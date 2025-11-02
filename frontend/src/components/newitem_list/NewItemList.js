import React, { useEffect, useRef, useState } from 'react'
import EachItem from './EachItem';
import { Helmet } from 'react-helmet';
import Loading from '../utils/Loading';

const NewItemList = ({ userInfo, token }) => {
  const [newItemList, setNewItemList] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const pageRefs = useRef({});
  const [jobs, setJobs] = useState([]);

  // localstorageからフィルター設定を読み込み
  const loadFiltersFromStorage = () => {
    try {
      const savedFilters = localStorage.getItem('newItemListFilters');
      if (savedFilters) {
        const parsedFilters = JSON.parse(savedFilters);
        return {
          job: userInfo[0].role === "admin" ? parsedFilters.job || "" : userInfo[0].job,
          addStatus: Array.isArray(parsedFilters.addStatus) ? parsedFilters.addStatus : (parsedFilters.addStatus ? [parsedFilters.addStatus] : []),
          wholeShop: parsedFilters.wholeShop || ""
        };
      }
    } catch (error) {
      console.error('Failed to load filters from localStorage:', error);
    }
    return {
      job: userInfo[0].role === "admin" ? "" : userInfo[0].job,
      addStatus: [],
      wholeShop: ""
    };
  };

  const initialFilters = loadFiltersFromStorage();
  const [job, setJob] = useState(initialFilters.job);
  const [addStatus, setAddStatus] = useState(initialFilters.addStatus);
  const [wholeShop, setWholeShop] = useState(initialFilters.wholeShop);
  const [search, setSearch] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage] = useState(100);

  useEffect(() => {
    async function fetchMaterialList() {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_DOMAIN}/new_item_v2/get/material`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        setMaterials(data);
      } catch (error) {
        console.error('Error fetching new item list:', error);
      }
    }
    async function fetchJobs() {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_DOMAIN}/job/get`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });
        const data = await response.json();
        setJobs(data);
      } catch (error) {
        console.error('Error fetching new item list:', error);
      }
    }

    fetchJobs();
    fetchMaterialList();
  }, [userInfo, token]);

  useEffect(() => {
    async function fetchNewItemList() {
      setLoading(true);
      try {
        const addStatusQuery = Array.isArray(addStatus) && addStatus.length > 0 ? addStatus.join(',') : '';
        const response = await fetch(`${process.env.REACT_APP_API_DOMAIN}/new_item_v2/get?role=${userInfo[0].role}&job=${job}&add_status=${addStatusQuery}&whole_shop=${wholeShop}&search=${search}&page=${currentPage}&limit=${itemsPerPage}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });
        const data = await response.json();
        setNewItemList(data.items || []);
        setTotalItems(data.totalItems || 0);
      } catch (error) {
        console.error('Error fetching new item list:', error);
        setNewItemList([]);
        setTotalItems(0);
      }
      setLoading(false);
    }
    fetchNewItemList();
  }, [userInfo, token, job, addStatus, wholeShop, search, currentPage, itemsPerPage]);

  // フィルター設定をlocalstorageに保存
  useEffect(() => {
    try {
      const filtersToSave = {
        job: userInfo[0].role === "admin" ? job : "",  // オーナーの場合は保存しない
        addStatus,
        wholeShop
      };
      localStorage.setItem('newItemListFilters', JSON.stringify(filtersToSave));
    } catch (error) {
      console.error('Failed to save filters to localStorage:', error);
    }
  }, [job, addStatus, wholeShop, userInfo]);

  useEffect(() => {
    if (!loading) {
      const hash = window.location.hash.substring(1);
      if (hash && pageRefs.current[hash]) {
        pageRefs.current[hash].scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [loading, newItemList]);

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    setSearch(searchTerm);
    setCurrentPage(1);
  };

  if (loading) return <Loading />;
  return (
    <>
      <Helmet
        title="申請済み新商品リスト - GMC Role Play - GTA5 RPサーバー"
        meta={[
          { name: 'description', content: 'GMC Role Playのお店オーナー用の申請済み新商品リスト！' },
          { property: 'og:url', content: 'job.gmcrp.net' },
          { property: 'og:type', content: 'website' },
          { property: 'og:title', content: '申請済み新商品リスト - GMC Role Play - GTA5 RPサーバー' },
          { property: 'og:description', content: 'GMC Role Playのお店オーナー用の申請済み新商品リスト！' },
          { name: 'twitter:card', content: 'summary' },
          { name: 'twitter:title', content: '申請済み新商品リスト - GMC Role Play - GTA5 RPサーバー' },
          { name: 'twitter:description', content: 'GMC Role Playのお店オーナー用の申請済み新商品リスト！' },
        ]}
      />
      <div className="flex justify-center mx-3">
        <div className="max-w-5xl w-full mb-16">
          <div className="mt-4 bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-200">
            <div className="md:flex gap-6">
              <div className="md:w-1/3">
                <label className="block text-lg font-semibold text-gray-800 mb-2">
                  JOBフィルター
                </label>
                <select
                  onChange={(event) => setJob(event.target.value)}
                  className="w-full px-4 py-3 border-2 text-gray-700 bg-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer shadow-sm transition-all duration-200 hover:border-gray-400"
                  value={job}
                >
                  {(userInfo[0].role === "admin" || userInfo[0].role === "check") && (
                    <>
                      <option value="">選択してください。</option>
                      {jobs.map((job) => (
                        <option key={job.id} value={job.job_id}>{job.name}</option>
                      ))}
                    </>
                  )}
                  {userInfo[0].role === "owner" && (
                    (userInfo[0].job2 === null || userInfo[0].job2 === "") ? (
                      <>
                        <option value={userInfo[0].job}>{jobs.find((job) => job.job_id === userInfo[0]?.job)?.name}</option>
                      </>
                    ) :
                      <>
                        <option value={userInfo[0].job}>{jobs.find((job) => job.job_id === userInfo[0]?.job)?.name}</option>
                        <option value={userInfo[0].job2}>{jobs.find((job) => job.job_id === userInfo[0]?.job2)?.name}</option>
                      </>
                  )}
                </select>
              </div>

              <div className="md:w-1/3 mt-6 md:mt-0">
                <div className="text-lg font-semibold text-gray-800 mb-2">
                  ステータスフィルター（複数選択可）
                </div>
                <div className="max-h-48 overflow-y-auto border-2 border-gray-300 rounded-lg p-3 bg-white">
                  {[
                    { value: "none", label: "申請中" },
                    { value: "check1", label: "ルール確認中" },
                    { value: "check2", label: "ルール確認済み" },
                    { value: "pending", label: "審議中" },
                    { value: "add", label: "追加済み" },
                    { value: "cancel", label: "キャンセル済み" }
                  ].map((status) => (
                    <label key={status.value} className="flex items-center mb-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={addStatus.includes(status.value)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setAddStatus([...addStatus, status.value]);
                          } else {
                            setAddStatus(addStatus.filter(s => s !== status.value));
                          }
                        }}
                        className="mr-2 w-4 h-4"
                      />
                      <span className="text-sm text-gray-700">{status.label}</span>
                    </label>
                  ))}
                  {addStatus.length > 0 && (
                    <button
                      onClick={() => setAddStatus([])}
                      className="mt-2 text-xs text-blue-600 hover:text-blue-800 underline"
                    >
                      全て解除
                    </button>
                  )}
                </div>
              </div>

              <div className="md:w-1/3 mt-6 md:mt-0">
                <div className="text-lg font-semibold text-gray-800 mb-2">
                  卸先店舗フィルター
                </div>
                <select
                  onChange={(event) => setWholeShop(event.target.value)}
                  className="w-full px-4 py-3 border-2 text-gray-700 bg-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer shadow-sm transition-all duration-200 hover:border-gray-400"
                  value={wholeShop}
                >
                  <option value="">全て表示</option>
                  {jobs.map((job) => (
                    <option key={job.id} value={job.name}>{job.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <form className="my-4" onSubmit={handleSearchSubmit}>
            <input
              type="text"
              placeholder="名前またはアイテムIDで検索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-xl focus:outline-none"
            />
          </form>
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-4">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 mx-1 bg-gray-300 rounded disabled:opacity-50"
              >
                前へ
              </button>
              <span className="px-4 py-2">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 mx-1 bg-gray-300 rounded disabled:opacity-50"
              >
                次へ
              </button>
            </div>
          )}
          {newItemList.length === 0 ? "申請した商品がありません。" : (
            newItemList.map((item) => (
              <EachItem key={item.id} item={item} token={token} materials={materials} userInfo={userInfo} pageRefs={pageRefs} jobs={jobs} />
            ))
          )}
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-4">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 mx-1 bg-gray-300 rounded disabled:opacity-50"
              >
                前へ
              </button>
              <span className="px-4 py-2">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 mx-1 bg-gray-300 rounded disabled:opacity-50"
              >
                次へ
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default NewItemList