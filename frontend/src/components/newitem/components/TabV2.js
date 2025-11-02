import React from 'react'

const TabV2 = ({ formData, handleItemTypeChange, userInfo }) => {
    return (
        <div className="relative flex flex-col mt-12 bg-white px-6 py-6 rounded-md border-gray-300 border-1">
            <label className="text-lg mb-4">アイテムタイプ</label>
            <div className="text-gray-500 text-sm mb-4">
                このアイテムの機能を選択してください。
            </div>

            <div className="grid grid-cols-2 gap-4">
                {/* 効果アイテム */}
                <div
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                        formData.item_type === "effect"
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-300 hover:border-gray-400'
                    }`}
                    onClick={() => handleItemTypeChange("effect")}
                >
                    <div className="flex items-center mb-2">
                        <input
                            type="radio"
                            checked={formData.item_type === "effect"}
                            className="mr-2"
                            readOnly
                        />
                        <span className="font-semibold">効果アイテム</span>
                    </div>
                    <div className="text-sm text-gray-600">
                        回復効果、視覚効果、付与アイテムなどの機能を持つアイテム
                    </div>
                </div>

                {/* 画像表示アイテム */}
                <div
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                        formData.item_type === "image"
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-300 hover:border-gray-400'
                    }`}
                    onClick={() => handleItemTypeChange("image")}
                >
                    <div className="flex items-center mb-2">
                        <input
                            type="radio"
                            checked={formData.item_type === "image"}
                            className="mr-2"
                            readOnly
                        />
                        <span className="font-semibold">画像表示</span>
                    </div>
                    <div className="text-sm text-gray-600">
                        使用時に画像を表示するアイテム
                    </div>
                </div>

                {/* 音楽再生アイテム */}
                <div
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                        formData.item_type === "audio"
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-300 hover:border-gray-400'
                    }`}
                    onClick={() => handleItemTypeChange("audio")}
                >
                    <div className="flex items-center mb-2">
                        <input
                            type="radio"
                            checked={formData.item_type === "audio"}
                            className="mr-2"
                            readOnly
                        />
                        <span className="font-semibold">音楽再生</span>
                    </div>
                    <div className="text-sm text-gray-600">
                        使用時に音楽を再生するアイテム
                    </div>
                </div>

                {/* アイテム付与 */}
                <div
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                        formData.item_type === "giveitem"
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-300 hover:border-gray-400'
                    }`}
                    onClick={() => handleItemTypeChange("giveitem")}
                >
                    <div className="flex items-center mb-2">
                        <input
                            type="radio"
                            checked={formData.item_type === "giveitem"}
                            className="mr-2"
                            readOnly
                        />
                        <span className="font-semibold">アイテム付与</span>
                    </div>
                    <div className="text-sm text-gray-600">
                        使用時に別のアイテムを付与するアイテム
                    </div>
                </div>

                {/* 通常アイテム */}
                <div
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 col-span-2 ${
                        formData.item_type === "" || formData.item_type === "normal"
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-300 hover:border-gray-400'
                    }`}
                    onClick={() => handleItemTypeChange("")}
                >
                    <div className="flex items-center mb-2">
                        <input
                            type="radio"
                            checked={formData.item_type === "" || formData.item_type === "normal"}
                            className="mr-2"
                            readOnly
                        />
                        <span className="font-semibold">通常アイテム</span>
                    </div>
                    <div className="text-sm text-gray-600">
                        機能を持たない通常のアイテム
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TabV2