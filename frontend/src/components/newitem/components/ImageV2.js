import React from 'react'

const ImageV2 = ({
    formData,
    setFormData,
    handleFileChange,
    userInfo,
    displayError,
    uploadError,
    previewUrl,
    setPreviewUrl,
    files
}) => {
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            // バリデーション
            if (!file.type.includes('png')) {
                alert('PNG形式の画像を選択してください。');
                event.target.value = '';
                return;
            }

            // ファイルサイズチェック (例: 5MB以下)
            if (file.size > 5 * 1024 * 1024) {
                alert('ファイルサイズが大きすぎます。5MB以下の画像を選択してください。');
                event.target.value = '';
                return;
            }

            // 画像の比率チェック
            const img = new Image();
            img.onload = function() {
                const ratio = this.width / this.height;
                if (Math.abs(ratio - 1) > 0.1) { // 1:1比率の許容誤差10%
                    alert('画像は1:1の比率である必要があります。');
                    event.target.value = '';
                    setPreviewUrl(null);
                    return;
                }

                // 300x300以下のチェック
                if (this.width > 300 || this.height > 300) {
                    alert('画像サイズは300x300以下である必要があります。');
                    event.target.value = '';
                    setPreviewUrl(null);
                    return;
                }

                // ファイルとプレビューを設定
                handleFileChange('basic_image', file);
                const reader = new FileReader();
                reader.onload = function(e) {
                    setPreviewUrl(e.target.result);
                };
                reader.readAsDataURL(file);
            };

            img.onerror = function() {
                alert('画像ファイルの読み込みに失敗しました。');
                event.target.value = '';
            };

            const reader = new FileReader();
            reader.onload = function(e) {
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="relative flex flex-col mt-12 bg-white px-6 py-6 rounded-md border-gray-300 border-1">
            <label className="text-lg">
                基本画像<span className="text-red-500"> *</span>
            </label>

            <input
                type="file"
                accept="image/png"
                onChange={handleImageChange}
                className="mt-2 block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-lg file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100 file:cursor-pointer"
                id="basic_image"
            />

            {previewUrl && (
                <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-2">プレビュー:</p>
                    <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-32 h-32 object-cover border-2 border-gray-300 rounded-lg"
                    />
                </div>
            )}

            <div className="text-red-500 font-bold mt-2">
                {(displayError && !files.basic_image) && (uploadError.basic_image)}
            </div>

            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                    <strong>画像要件:</strong>
                </p>
                <ul className="text-sm text-yellow-700 mt-1 list-disc list-inside">
                    <li>形式: PNG のみ</li>
                    <li>サイズ: 300x300 以下</li>
                    <li>比率: 1:1 (正方形)</li>
                    <li>ファイルサイズ: 5MB 以下</li>
                </ul>
            </div>
        </div>
    )
}

export default ImageV2