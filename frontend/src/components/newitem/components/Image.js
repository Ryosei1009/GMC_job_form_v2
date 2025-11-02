import React, { useRef, useState } from 'react';

const Image = ({ formData, setFormData, userInfo, displayError, uploadError, previewUrl, setPreviewUrl }) => {
    const [isNotImage, setIsNotImage] = useState(false);
    const [isFileLimit, setIsFileLimit] = useState(false);
    const fileInputRef = useRef(null);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                setIsNotImage(true);
                setIsFileLimit(false);
                return;
            };
            setIsNotImage(false);
            const reader = new FileReader();
            reader.onloadend = () => {
                const img = new window.Image();

                img.src = reader.result;

                img.onload = () => {
                    if (img.width > 300 || img.height > 300) {
                        setIsFileLimit(true);
                        return;
                    }

                    setIsFileLimit(false);
                    setPreviewUrl(reader.result);
                    setFormData((prevData) => ({
                        ...prevData,
                        created_by: userInfo[0].id,
                        image: file,
                    }));
                };
            };
            reader.readAsDataURL(file);
        }
    }

    return (
        <div className="relative flex flex-col mt-12 bg-white px-6 py-6 rounded-md border-gray-300 border-1">
            <label className="text-lg" htmlFor="name">
                アイテム画像<span className="text-red-500"> *</span>
            </label>
            <div className="text-gray-500 text-sm">300×300以下のサイズでpng拡張子で画像比率1:1でお願いします。</div>
            <img id="image" className="w-48 h-48" src={previewUrl && previewUrl} alt="" />
            {isNotImage && <div className="text-red-500 mb-1">画像ファイルを選択してください。</div>}
            {isFileLimit && <div className="text-red-500 mb-1">画像サイズが300×300以上です。</div>}
            <div className="mt-2">
                <span className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-6 rounded" onClick={() => fileInputRef.current?.click()} >
                    ファイルを選択
                </span>
            </div>
            <div className="flex justify-between text-gray-500">
                <div className="text-red-500 font-bold">
                    {(displayError && !formData.image) && (uploadError.image)}
                </div>
            </div>
            <input accept="image/png" type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
        </div>
    );
};

export default Image;
