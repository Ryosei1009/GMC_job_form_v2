import React, { useEffect, useState } from 'react'
import './code.css';
import Prism from 'prismjs';
import 'prismjs/components/prism-lua';
import Effect from './components/Effect';
import Material from './components/Material';
import Craft from './components/Craft';
import Item from './components/Item';
import ItemControl from './components/ItemControl';
import Image from './components/Image';
import Audio from './components/Audio';
import Give from './components/Give';

const EachItem = ({ item, token, materials, userInfo, pageRefs, jobs }) => {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        Prism.highlightAll();
    }, [isOpen, token]);

    const checkMaterialName = (material_id) => {
        if (!material_id) return "";
        let materialName = "";
        materials.forEach((material) => {
            if (material.material_id === material_id) {
                materialName = material.name;
            }
        })
        return materialName;
    }

    const checkEffectType = (effect_type) => {
        switch (effect_type) {
            case "thirst":
                return "水分";
            case "hunger":
                return "食料";
            case "stress":
                return "ストレス";
            case "heal":
                return "体力";
            default:
                return "";
        }
    }

    const getItemTypeLabel = (item) => {
        if (item.item_type === "effect") return "効果アイテム";
        if (item.item_type === "image") return "画像表示アイテム";
        if (item.item_type === "audio") return "音楽再生アイテム";
        if (item.item_type === "giveitem") return "アイテム付与アイテム";
        return "通常アイテム";
    }

    const getEffectItemType = (item) => {
        switch (item.effect_item_type) {
            case "food": return "食べ物";
            case "drink": return "飲み物";
            case "alcohol": return "アルコール";
            case "drug": return "薬物";
            case "other": return "その他";
            default: return item.item_type || "";
        }
    }

    return (
        <div id={item.id} ref={(el) => (pageRefs.current[item.id] = el)} className={`my-8 bg-white/50 rounded-xl`}>
            <div className="mb-2 hover:bg-white rounded-xl p-4 w-full">
                <ItemControl item={item} token={token} userInfo={userInfo} jobs={jobs} />
                <div className={`${userInfo[0].role === "admin" && "cursor-pointer"}`} onClick={() => userInfo[0].role === "admin" && setIsOpen(!isOpen)}>
                    <div className={`flex max-md:flex-col justify-between max-md:justify-center`}>
                        <div className="flex items-center max-md:max-w-full max-w-[60%]">
                            <div className="relative mr-4">
                                <img loading="lazy" className="min-w-32 max-w-32 min-h-32 max-h-32" src={`${process.env.REACT_APP_IMAGE_DOMAIN}/images/items/${item.item_id}.png`} alt="" />
                                <div className="absolute bottom-0 right-0 text-black">
                                    {item.weight}
                                </div>
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{item.name}<span className="text-xl font-normal"> ({item.item_id})</span></p>
                                <p className="text-base font-normal">{item.description}</p>
                                {item.emote && (
                                    <p className="text-sm font-normal text-blue-600">エモート: {item.emote}</p>
                                )}
                                {item.price && (
                                    <p className="text-sm font-normal mt-2">{item.price}円</p>
                                )}
                            </div>
                        </div>
                        <div className={`flex justify-between flex-col ${(item.is_effect || item.item_type === "effect") ? ("flex-col items-start") : ("max-md:items-center max-md:flex-row")}`}>
                            <div className={`mt-2 ${(item.is_effect || item.item_type === "effect") && "max-md:flex justify-start w-full"}`}>
                                {/* アイテムタイプ表示 */}
                                <div className="mb-2">
                                    <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">
                                        {getItemTypeLabel(item)}
                                    </span>
                                    {item.effect_item_type && (
                                        <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">
                                            {getEffectItemType(item)}
                                        </span>
                                    )}
                                </div>

                                {item.is_material ? (
                                    <div className="font-bold text-purple-600 mb-2">
                                        素材アイテム
                                    </div>
                                ) : ""}

                                {item.is_craft ? (
                                    <div className={`font-bold ${(item.is_effect || item.item_type === "effect") && "max-md:w-1/2"} mb-2`}>
                                        <div className="font-bold text-orange-600">
                                            クラフトアイテム
                                        </div>
                                        <div>
                                            素材: {checkMaterialName(item.craft_material1 || item.material1)}
                                            {(item.craft_material2 || item.material2) && `, ${checkMaterialName(item.craft_material2 || item.material2)}`}
                                            {(item.craft_material3 || item.material3) && `, ${checkMaterialName(item.craft_material3 || item.material3)}`}
                                        </div>
                                    </div>
                                ) : ""}

                                {item.is_delivery ? (
                                    <div className={`font-bold ${(item.is_effect || item.item_type === "effect") && "max-md:w-1/2"} mb-2`}>
                                        <div className="font-bold text-cyan-600">
                                            納品アイテム
                                        </div>
                                        <div>
                                            納品個数: {item.number}
                                        </div>
                                    </div>
                                ) : ""}

                                {(item.is_effect || item.item_type === "effect") ? (
                                    <div className={`font-bold ${(item.is_effect || item.item_type === "effect") && "max-md:w-1/2"} mb-2`}>
                                        <div className="font-bold text-red-600">
                                            効果アイテム
                                        </div>
                                        {item.effect_type && (
                                            <div>
                                                {checkEffectType(item.effect_type)}回復: {item.effect_amount || item.effect}
                                            </div>
                                        )}
                                        {item.effect_time && (
                                            <div>使用時間: {item.effect_time}秒</div>
                                        )}
                                        {item.effect_grant && (
                                            <div>付与アイテム: {item.effect_grant}</div>
                                        )}
                                        {item.effect_grant_count && (
                                            <div>付与個数: {item.effect_grant_count}</div>
                                        )}
                                        {item.effect_screen && (
                                            <div>視覚効果: {item.effect_screen}</div>
                                        )}
                                        {item.effect_required && (
                                            <div>必要アイテム: {item.effect_required}</div>
                                        )}
                                        {item.effect_is_od === 1 && (
                                            <div className="text-yellow-600">OD機能あり</div>
                                        )}
                                    </div>
                                ) : ""}

                                {item.is_image ? (
                                    <div className="font-bold text-indigo-600 mb-2">
                                        <div className="font-bold">画像表示アイテム</div>
                                        {item.display_type && <div>表示タイプ: {item.display_type}</div>}
                                        <img className="w-48" src={`${process.env.REACT_APP_IMAGE_DOMAIN}/images/gmc2/utilsystem/${item.item_id}.png`} alt="" />
                                    </div>
                                ) : ""}

                                {item.is_audio ? (
                                    <>
                                    <div className="font-bold text-yellow-600 mb-2">
                                        <div className="font-bold">音楽再生アイテム</div>
                                    </div>
                                    <audio className="w-48" controls src={`${process.env.REACT_APP_IMAGE_DOMAIN}/images/gmc2/utilsystem/${item.item_id}.mp3`}></audio>
                                    </>
                                ) : ""}

                                {item.is_giveitem ? (
                                    <div className="font-bold text-pink-600 mb-2">
                                        <div className="font-bold">アイテム付与アイテム</div>
                                        {item.give_additem && <div>付与アイテム: {item.give_additem} x{item.give_addamount}</div>}
                                        {item.give_time && <div>付与時間: {item.give_time}秒</div>}
                                        {item.give_text && <div>付与テキスト: {item.give_text}</div>}
                                    </div>
                                ) : ""}

                                {item.is_wholesale === 1 ? (
                                    <div className="font-bold text-green-600 mb-2">
                                        <div>卸売商品</div>
                                        {item.whole_price && <div>卸売価格: {item.whole_price}円</div>}
                                        {item.whole_shop && <div>卸売店舗: {item.whole_shop}</div>}
                                    </div>
                                ) : ""}
                            </div>
                            {!item.is_material ? (
                                <div>
                                    <div className="mt-2">
                                        販売開始日: {item.sale_date}
                                    </div>
                                    <div>
                                        {item.iswholesale && (
                                            <>
                                                販売店舗: {item.is_wholesale ? "卸売り " : ""}{item.sale_shop}
                                            </>
                                        )}
                                    </div>
                                </div>
                            ) : ""}
                        </div>
                    </div>
                    {item.other !== null && (
                        <div className="mt-2">
                            <div className="text-lg font-bold">
                                その他
                            </div>
                            <div className="">
                                {item.other}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {
                isOpen &&
                <div className="border-black border-2 rounded-lg px-3 pt-2">
                    <Item item={item} />
                    {item.is_craft ? (
                        <Craft item={item} token={token} />
                    ) : ""}
                    {item.is_material ? (
                        <Material item={item} />
                    ) : ""}
                    {item.is_effect ? (
                        <Effect item={item} />
                    ) : ""}
                    {item.is_image ? (
                        <Image item={item} />
                    ) : ""}
                    {item.is_audio ? (
                        <Audio item={item} />
                    ) : ""}
                    {item.is_giveitem ? (
                        <Give item={item} />
                    ) : ""}
                </div>
            }
        </div >
    )
}

export const CopyButton = ({ code }) => {
    const [copyStatus, setCopyStatus] = useState('Copy');

    const handleCopy = (code) => {
        navigator.clipboard.writeText(code)
            .then(() => {
                setCopyStatus('Copied!');
                setTimeout(() => setCopyStatus('Copy'), 2000);
            })
            .catch((error) => {
                console.error("Copy failed:", error);
                setCopyStatus('Failed to copy');
            });
    };

    return (
        <button
            onClick={() => handleCopy(`${code}`)}
            className="absolute right-2 top-2 py-1 px-2 cursor-pointer bg-[#4CAF50] text-white rounded-md"
        >
            {copyStatus}
        </button>
    )
}

export default EachItem