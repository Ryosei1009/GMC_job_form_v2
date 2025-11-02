import { useState, useCallback, useRef } from 'react';

const useCache = (ttl = 300000) => { // デフォルト5分のキャッシュ
  const [cache, setCache] = useState(new Map());
  const timersRef = useRef(new Map());

  const get = useCallback((key) => {
    const entry = cache.get(key);
    if (entry && Date.now() < entry.expiry) {
      return entry.data;
    }
    return null;
  }, [cache]);

  const set = useCallback((key, data) => {
    const expiry = Date.now() + ttl;
    
    // 既存のタイマーをクリア
    if (timersRef.current.has(key)) {
      clearTimeout(timersRef.current.get(key));
    }

    // 新しいエントリを設定
    setCache(prev => new Map(prev.set(key, { data, expiry })));

    // 有効期限後に自動削除するタイマーを設定
    const timer = setTimeout(() => {
      setCache(prev => {
        const newCache = new Map(prev);
        newCache.delete(key);
        return newCache;
      });
      timersRef.current.delete(key);
    }, ttl);

    timersRef.current.set(key, timer);
  }, [ttl]);

  const clear = useCallback(() => {
    // すべてのタイマーをクリア
    timersRef.current.forEach(timer => clearTimeout(timer));
    timersRef.current.clear();
    setCache(new Map());
  }, []);

  const remove = useCallback((key) => {
    if (timersRef.current.has(key)) {
      clearTimeout(timersRef.current.get(key));
      timersRef.current.delete(key);
    }
    setCache(prev => {
      const newCache = new Map(prev);
      newCache.delete(key);
      return newCache;
    });
  }, []);

  return {
    get,
    set,
    clear,
    remove,
    size: cache.size
  };
};

export default useCache;