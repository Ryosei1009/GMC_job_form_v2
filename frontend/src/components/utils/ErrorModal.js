import React from 'react';
import { XMarkIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const ErrorModal = ({ isOpen, onClose, title, message, details }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* オーバーレイ */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
                onClick={onClose}
            ></div>

            {/* モーダル本体 */}
            <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6 transform transition-all">
                {/* ヘッダー */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                        <ExclamationTriangleIcon className="h-6 w-6 text-red-500 mr-2" />
                        <h3 className="text-lg font-semibold text-gray-900">
                            {title || "エラー"}
                        </h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>

                {/* メッセージ */}
                <div className="mb-4">
                    <p className="text-gray-700 leading-relaxed">
                        {message}
                    </p>

                    {/* 詳細情報（オプション） */}
                    {details && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-md border">
                            <p className="text-sm text-gray-600 font-medium mb-1">詳細:</p>
                            <p className="text-sm text-gray-600 whitespace-pre-wrap">
                                {details}
                            </p>
                        </div>
                    )}
                </div>

                {/* ボタン */}
                <div className="flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    >
                        閉じる
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ErrorModal;