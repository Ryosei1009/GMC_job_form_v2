import axios from 'axios';
import React, { useState, useCallback } from 'react';
import { CheckIcon, ClipboardDocumentIcon } from '@heroicons/react/20/solid';
import ErrorModal from '../../utils/ErrorModal';

const USER_ROLES = {
  ADMIN: 'admin',
  CHECK: 'check',
  OWNER: 'owner',
};

const ItemInfo = ({ id, job, jobs }) => (
  <div className="flex flex-col mr-4 text-left">
    <span className="text-sm text-gray-500">{id}</span>
    <span className="font-semibold">{jobs.find((j) => j.job_id === job)?.name || 'Unknown Job'}</span>
  </div>
);

const CopyButton = ({ textToCopy }) => {
  const [copyStatus, setCopyStatus] = useState(false);

  const handleCopy = useCallback(() => {
    if (copyStatus) return;
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        setCopyStatus(true);
        setTimeout(() => setCopyStatus(false), 2000);
      })
      .catch((error) => {
        console.error("Copy failed:", error);
      });
  }, [textToCopy, copyStatus]);

  return (
    <button
      className="focus:outline-none ml-4"
      onClick={handleCopy}
      aria-label="Copy item link"
    >
      {copyStatus ? (
        <CheckIcon className="h-7 w-7 text-green-700" />
      ) : (
        <ClipboardDocumentIcon className="h-7 w-7 text-gray-500 hover:text-gray-700" />
      )}
    </button>
  );
};

const ItemControl = ({ userInfo, item, token, jobs }) => {
  // v1互換性のための状態（既存のロジックが使用）
  const [isAdded, setIsAdded] = useState(item.add_status === 'add' || !!item.is_added);
  const [isCanceled, setIsCanceled] = useState(item.add_status === 'cancel' || !!item.is_cancel);
  const [isPending, setIsPending] = useState(item.add_status === 'pending' || !!item.is_pending);
  const [ruleCheck, setRuleCheck] = useState(
    item.add_status === 'check1' ? 1 :
    item.add_status === 'check2' ? 2 :
    (item.rule_check || 0)
  );

  // エラーモーダル用の状態
  const [errorModal, setErrorModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    details: ''
  });

  const makeStatusRequest = useCallback(async (status, successState, errorState) => {
    successState();
    try {
      await axios.post(`${process.env.REACT_APP_API_DOMAIN}/new_item_v2/update-status`,
        { id: item.id, status },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
    } catch (error) {
      errorState();
      console.error('API request failed:', error);

      let errorTitle = "ステータス更新エラー";
      let errorMessage = "アイテムのステータス更新に失敗しました。";
      let errorDetails = "";

      if (error.response) {
        const status = error.response.status;
        const responseData = error.response.data;

        switch (status) {
          case 400:
            errorTitle = "入力エラー";
            errorMessage = "無効なステータスが指定されました。";
            break;
          case 401:
            errorTitle = "認証エラー";
            errorMessage = "認証に失敗しました。再ログインしてください。";
            break;
          case 403:
            errorTitle = "権限エラー";
            errorMessage = "この操作を実行する権限がありません。";
            break;
          case 500:
            errorTitle = "サーバーエラー";
            errorMessage = "サーバー内部でエラーが発生しました。";
            break;
          default:
            errorDetails = `ステータスコード: ${status}\n${typeof responseData === 'string' ? responseData : JSON.stringify(responseData)}`;
        }
      } else if (error.request) {
        errorTitle = "通信エラー";
        errorMessage = "サーバーとの通信に失敗しました。";
      } else {
        errorDetails = error.message;
      }

      setErrorModal({
        isOpen: true,
        title: errorTitle,
        message: errorMessage,
        details: errorDetails
      });
    }
  }, [item.id, token]);

  const handleAdd = () => makeStatusRequest('add', () => setIsAdded(true), () => setIsAdded(false));
  const handleCancelAdd = () => makeStatusRequest('none', () => setIsAdded(false), () => setIsAdded(true));
  const handleCancel = () => makeStatusRequest('cancel', () => setIsCanceled(true), () => setIsCanceled(false));
  const handleCancelCancel = () => makeStatusRequest('none', () => setIsCanceled(false), () => setIsCanceled(true));
  const handlePending = () => makeStatusRequest('pending', () => setIsPending(true), () => setIsPending(false));
  const handleCancelPending = () => makeStatusRequest('none', () => setIsPending(false), () => setIsPending(true));
  const handleRuleCheck0 = () => makeStatusRequest('none', () => setRuleCheck(0), () => setRuleCheck(1));
  const handleRuleCheck1 = () => makeStatusRequest('check1', () => setRuleCheck(1), () => setRuleCheck(0));
  const handleRuleCheck2 = () => makeStatusRequest('check2', () => setRuleCheck(2), () => setRuleCheck(1));

  const userRole = userInfo?.[0]?.role;
  const itemUrl = `${process.env.REACT_APP_SITE_DOMAIN}/newitemlist#${item.id}`;

  const renderAdminControls = () => {
    if (isCanceled) {
      return (
        <>
          <div className="flex items-center">
            <ItemInfo id={item.id} job={item.job} jobs={jobs} />
            <div />
            <CopyButton textToCopy={itemUrl} />
          </div>
          <div />
          <button className="px-6 py-2 bg-red-500 text-white rounded-md" onClick={handleCancelCancel}>
            キャンセル取り消し
          </button>
        </>
      );
    }

    if (isPending) {
      return (
        <>
          <div className="flex items-center">
            <ItemInfo id={item.id} job={item.job} jobs={jobs} />
            <div />
            <CopyButton textToCopy={itemUrl} />
          </div>
          <button className="px-6 py-2 bg-red-500 text-white rounded-md" onClick={handleCancelPending}>
            審議取り消し
          </button>
          <button className="px-6 py-2 bg-green-500 text-white rounded-md" onClick={handleCancel}>
            キャンセル
          </button>
        </>
      );
    }

    if (isAdded) {
      return (
        <>
          <div className="flex items-center">
            <ItemInfo id={item.id} job={item.job} jobs={jobs} />
            <button className="px-6 py-2 bg-red-500 text-white rounded-md" onClick={handleCancelAdd}>
              追加取り消し
            </button>
            <CopyButton textToCopy={itemUrl} />
          </div>
          <div />
          <div />
        </>
      );
    }

    if (ruleCheck === 1) {
      return (
        <>
          <div className="flex items-center">
            <ItemInfo id={item.id} job={item.job} jobs={jobs} />
            <button className="px-6 py-2 bg-orange-500 text-white rounded-md" onClick={handleRuleCheck2}>
              ルール確認 1/2
            </button>
            <CopyButton textToCopy={itemUrl} />
          </div>
          <button className="px-6 py-2 bg-green-500 text-white rounded-md" onClick={handlePending}>
            審議
          </button>
          <button className="px-6 py-2 bg-green-500 text-white rounded-md" onClick={handleCancel}>
            キャンセル
          </button>
        </>
      );
    }

    if (ruleCheck === 2) {
      return (
        <>
          <div className="flex items-center">
            <ItemInfo id={item.id} job={item.job} jobs={jobs} />
            <button className="px-6 py-2 bg-green-500 text-white rounded-md" onClick={handleAdd}>
              追加
            </button>
            <CopyButton textToCopy={itemUrl} />
          </div>
          <button className="px-6 py-2 bg-red-500 text-white rounded-md" onClick={handleRuleCheck0}>
            ルール確認取り消し
          </button>
          <div />
        </>
      );
    }

    return (
      <>
        <div className="flex items-center">
          <ItemInfo id={item.id} job={item.job} jobs={jobs} />
          <button className="px-6 py-2 bg-green-500 text-white rounded-md" onClick={handleRuleCheck1}>
            ルール確認
          </button>
          <CopyButton textToCopy={itemUrl} />
        </div>
        <button className="px-6 py-2 bg-green-500 text-white rounded-md" onClick={handlePending}>
          審議
        </button>
        <button className="px-6 py-2 bg-green-500 text-white rounded-md" onClick={handleCancel}>
          キャンセル
        </button>
      </>
    );
  };

  const renderOwnerControls = () => {
    if (isCanceled) {
      return (
        <>
          <div className="flex items-center">
            <ItemInfo id={item.id} job={item.job} jobs={jobs} />
            <div />
            <CopyButton textToCopy={itemUrl} />
          </div>
          <div />
          <button className="px-6 py-2 bg-red-500 text-white rounded-md" onClick={handleCancelCancel}>
            キャンセル取り消し
          </button>
        </>
      );
    }

    if (isPending) {
      return (
        <>
          <div className="flex items-center">
            <ItemInfo id={item.id} job={item.job} jobs={jobs} />
            <div />
            <CopyButton textToCopy={itemUrl} />
          </div>
          <div className="px-6 py-2 text-red-700 font-bold">
            審議中
          </div>
          <button className="px-6 py-2 bg-green-500 text-white rounded-md" onClick={handleCancel}>
            キャンセル
          </button>
        </>
      );
    }

    if (isAdded) {
      return (
        <>
          <div className="flex items-center">
            <ItemInfo id={item.id} job={item.job} jobs={jobs} />
            <div className="px-6 py-2 text-red-700 font-bold">
              追加済み
            </div>
            <CopyButton textToCopy={itemUrl} />
          </div>
          <div />
          <div />
        </>
      );
    }

    if (ruleCheck === 1) {
      return (
        <>
          <div className="flex items-center">
            <ItemInfo id={item.id} job={item.job} jobs={jobs} />
            <div className="px-6 py-2 text-red-700 font-bold">
              ルール確認中
            </div>
            <CopyButton textToCopy={itemUrl} />
          </div>
          <div />
          <button className="px-6 py-2 bg-green-500 text-white rounded-md" onClick={handleCancel}>
            キャンセル
          </button>
        </>
      );
    }

    if (ruleCheck === 2) {
      return (
        <>
          <div className="flex items-center">
            <ItemInfo id={item.id} job={item.job} jobs={jobs} />
            <div className="px-6 py-2 text-red-700 font-bold">
              ルール確認済み
            </div>
            <CopyButton textToCopy={itemUrl} />
          </div>
          <div />
          <button className="px-6 py-2 bg-green-500 text-white rounded-md" onClick={handleCancel}>
            キャンセル
          </button>
        </>
      );
    }

    return (
      <>
        <div className="flex items-center">
          <ItemInfo id={item.id} job={item.job} jobs={jobs} />
          <div />
          <CopyButton textToCopy={itemUrl} />
        </div>
        <div />
        <button className="px-6 py-2 bg-green-500 text-white rounded-md" onClick={handleCancel}>
          キャンセル
        </button>
      </>
    );
  };

  const renderContent = () => {
    switch (userRole) {
      case USER_ROLES.ADMIN:
      case USER_ROLES.CHECK:
        return renderAdminControls();
      case USER_ROLES.OWNER:
        return renderOwnerControls();
      default:
        return null;
    }
  };

  return (
    <>
      <div className="flex flex-row-reverse justify-between items-center w-full p-2 border-b">
        {renderContent()}
      </div>

      {/* エラーモーダル */}
      <ErrorModal
        isOpen={errorModal.isOpen}
        onClose={() => setErrorModal({ ...errorModal, isOpen: false })}
        title={errorModal.title}
        message={errorModal.message}
        details={errorModal.details}
      />
    </>
  );
};

export default ItemControl;