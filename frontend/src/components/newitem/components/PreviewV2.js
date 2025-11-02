import React from 'react'

const PreviewV2 = ({ formData, previewUrl, files }) => {
    // プレビュー画像の取得
    const getPreviewImage = () => {
        if (previewUrl) return previewUrl;
        if (files.basic_image) {
            return URL.createObjectURL(files.basic_image);
        }
        return null;
    };

    const previewImage = getPreviewImage();

    return (
        <div className="flex justify-center pb-16">
            <div className="max-w-4xl w-full">
                <h2 className="text-2xl font-bold text-center mb-8">プレビュー</h2>

                {/* インベントリスタイルのプレビュー */}
                <div className="flex justify-center mb-8">
                    <div className="w-80 bg-inventory pb-4 pt-[8rem] pl-4 pr-[22rem] relative">
                        <div className="w-[147px] h-[141.5px] m-[2px] relative border-[1px] border-black border-opacity-5 bg-item">
                            <div className="max-w-full max-h-full p-[10px]">
                                {previewImage && (
                                    <img
                                        className="block relative mt-2 mb-0 mx-auto w-auto h-auto max-w-[92%] max-h-full"
                                        src={previewImage}
                                        alt="Preview"
                                    />
                                )}
                            </div>
                            <div className="absolute bottom-[10px] left-[10px] text-white font-semibold">
                                1x
                            </div>
                            <div className="absolute bottom-[10px] right-[10px] text-white">
                                {formData.weight}
                            </div>
                            <div className="absolute top-0 text-white w-full pl-[5px] p-[2.5px] font-semibold">
                                {formData.name}
                            </div>
                        </div>
                        <div className="absolute bottom-32 right-4 min-h-12 p-5 w-60 bg-item-content text-white">
                            <div className="pl-1 text-[26px] font-bold tracking-tight">
                                {formData.name}
                            </div>
                            <div className="pl-1 text-[15px] font-semibold tracking-tight leading-[18px]">
                                {formData.description}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 詳細情報 */}
                <div className="bg-white rounded-lg shadow-lg p-6 mx-4">
                    <h3 className="text-xl font-bold mb-4">アイテム詳細情報</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* 基本情報 */}
                        <div className="space-y-2">
                            <h4 className="font-semibold text-lg text-blue-600">基本情報</h4>
                            <div><span className="font-semibold">アイテム名:</span> {formData.name || "未設定"}</div>
                            <div><span className="font-semibold">アイテムID:</span> {formData.item_id || "未設定"}</div>
                            <div><span className="font-semibold">説明:</span> {formData.description || "未設定"}</div>
                            <div><span className="font-semibold">重量:</span> {formData.weight || "未設定"}</div>
                            {formData.price && <div className="mt-2"><span className="font-semibold">価格:</span> {formData.price}円</div>}
                            {formData.sale_date && <div><span className="font-semibold">販売日:</span> {formData.sale_date}</div>}
                        </div>

                        {/* アイテムタイプ・機能 */}
                        <div className="space-y-2">
                            <h4 className="font-semibold text-lg text-green-600">機能</h4>
                            {formData.emote && <div><span className="font-semibold">エモート:</span> {formData.emote}</div>}
                            <div><span className="font-semibold">素材:</span> {formData.is_material === 1 ? "はい" : "いいえ"}</div>
                            <div><span className="font-semibold">クラフト:</span> {formData.is_craft === 1 ? "はい" : "いいえ"}</div>
                            <div><span className="font-semibold">アイテムタイプ:</span>
                                {formData.item_type === "effect" && " 効果アイテム"}
                                {formData.item_type === "image" && " 画像表示"}
                                {formData.item_type === "audio" && " 音楽再生"}
                                {formData.item_type === "giveitem" && " アイテム付与"}
                                {!formData.item_type && " 通常アイテム"}
                            </div>
                        </div>
                    </div>

                    {/* クラフト情報 */}
                    {formData.is_craft === 1 && (
                        <div className="mt-4 pt-4 border-t">
                            <h4 className="font-semibold text-lg text-purple-600">クラフト情報</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2">
                                {formData.craft_material1 && <div><span className="font-semibold">素材1:</span> {formData.craft_material1}</div>}
                                {formData.craft_material2 && <div><span className="font-semibold">素材2:</span> {formData.craft_material2}</div>}
                                {formData.craft_material3 && <div><span className="font-semibold">素材3:</span> {formData.craft_material3}</div>}
                            </div>
                        </div>
                    )}

                    {/* 効果アイテム情報 */}
                    {formData.item_type === "effect" && (
                        <div className="mt-4 pt-4 border-t">
                            <h4 className="font-semibold text-lg text-red-600">効果情報</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                                {formData.effect_item_type && <div><span className="font-semibold">アイテムタイプ:</span> {formData.effect_item_type}</div>}
                                {formData.effect_time && <div><span className="font-semibold">使用時間:</span> {formData.effect_time}ms</div>}
                                {formData.effect_grant && <div><span className="font-semibold">付与アイテム:</span> {formData.effect_grant}</div>}
                                {formData.effect_grant_count && <div><span className="font-semibold">付与個数:</span> {formData.effect_grant_count}</div>}
                                {formData.effect_type && <div><span className="font-semibold">回復タイプ:</span> {formData.effect_type}</div>}
                                {formData.effect_amount && <div><span className="font-semibold">回復量:</span> {formData.effect_amount}</div>}
                                {formData.effect_screen && <div><span className="font-semibold">視覚効果:</span> {formData.effect_screen}</div>}
                                {formData.effect_required && <div><span className="font-semibold">必要アイテム:</span> {formData.effect_required}</div>}
                                <div><span className="font-semibold">OD機能:</span> {formData.effect_is_od === 1 ? "有効" : "無効"}</div>
                            </div>
                        </div>
                    )}

                    {/* 画像表示情報 */}
                    {formData.item_type === "image" && (
                        <div className="mt-4 pt-4 border-t">
                            <h4 className="font-semibold text-lg text-indigo-600">画像表示情報</h4>
                            <div className="mt-2">
                                {formData.display_type && <div><span className="font-semibold">表示タイプ:</span> {formData.display_type}</div>}
                                {files.display_image && <div><span className="font-semibold">表示画像:</span> {files.display_image.name}</div>}
                            </div>
                        </div>
                    )}

                    {/* 音楽再生情報 */}
                    {formData.item_type === "audio" && (
                        <div className="mt-4 pt-4 border-t">
                            <h4 className="font-semibold text-lg text-yellow-600">音楽再生情報</h4>
                            <div className="mt-2">
                                {files.audio_file && <div><span className="font-semibold">音楽ファイル:</span> {files.audio_file.name}</div>}
                            </div>
                        </div>
                    )}

                    {/* アイテム付与情報 */}
                    {formData.item_type === "giveitem" && (
                        <div className="mt-4 pt-4 border-t">
                            <h4 className="font-semibold text-lg text-orange-600">アイテム付与情報</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                                {formData.give_additem && <div><span className="font-semibold">付与アイテム:</span> {formData.give_additem}</div>}
                                {formData.give_addamount && <div><span className="font-semibold">付与個数:</span> {formData.give_addamount}</div>}
                                {formData.give_time && <div><span className="font-semibold">付与時間:</span> {formData.give_time}ms</div>}
                                {formData.give_text && <div><span className="font-semibold">付与テキスト:</span> {formData.give_text}</div>}
                            </div>
                        </div>
                    )}

                    {/* 卸売情報 */}
                    {formData.is_wholesale === 1 && (
                        <div className="mt-4 pt-4 border-t">
                            <h4 className="font-semibold text-lg text-cyan-600">卸売情報</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                                {formData.whole_price && <div><span className="font-semibold">卸売価格:</span> {formData.whole_price}円</div>}
                                {formData.whole_shop && <div><span className="font-semibold">卸売店舗:</span> {formData.whole_shop}</div>}
                            </div>
                        </div>
                    )}

                    {/* その他情報 */}
                    {formData.other && (
                        <div className="mt-4 pt-4 border-t">
                            <h4 className="font-semibold text-lg text-gray-600">その他</h4>
                            <div className="mt-2 p-3 bg-gray-50 rounded">
                                {formData.other}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default PreviewV2