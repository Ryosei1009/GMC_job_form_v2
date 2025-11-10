import React, { useEffect, useState } from 'react'
import ImageV2 from './ImageV2';
import TabV2 from './TabV2';
import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react'

const FormV2 = ({
    handleChange,
    handleMaterialCraftChange,
    formData,
    handleItemTypeChange,
    handleFileChange,
    displayError,
    uploadError,
    setFormData,
    userInfo,
    materials,
    textareaRef,
    adjustTextareaHeight,
    handleUpload,
    previewUrl,
    setPreviewUrl,
    files,
    previewUrls,
    token
}) => {
    const [jobs, setJobs] = useState([]);
    useEffect(() => {
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
                console.error('Error fetching job list:', error);
            }
        }
        fetchJobs();
    }, [userInfo, token]);

    // 素材選択用の入力値
    const [material1InputValue, setMaterial1InputValue] = useState('')
    const [material2InputValue, setMaterial2InputValue] = useState('')
    const [material3InputValue, setMaterial3InputValue] = useState('')

    const filteredMaterials1 = material1InputValue === '' ?
        materials : materials.filter((material) => {
            return material.name.toLowerCase().includes(material1InputValue.toLowerCase())
        })

    const filteredMaterials2 = material2InputValue === '' ?
        materials : materials.filter((material) => {
            return material.name.toLowerCase().includes(material2InputValue.toLowerCase())
        })

    const filteredMaterials3 = material3InputValue === '' ?
        materials : materials.filter((material) => {
            return material.name.toLowerCase().includes(material3InputValue.toLowerCase())
        })

    return (
        <div className="flex justify-center mx-3">
            <div className="max-w-2xl w-full mb-16">
                {/* 基本情報 */}
                <div className="relative flex flex-col mt-12 bg-white px-6 pt-6 pb-3 rounded-md border-gray-300 border-1">
                    <label className="text-lg" htmlFor="name">
                        アイテム名<span className="text-red-500"> *</span>
                    </label>
                    <input
                        className="border-b-2 border-b-gray-200 focus:outline-none"
                        onChange={handleChange}
                        value={formData.name}
                        type="text"
                        id="name"
                        name="name"
                        maxLength={30}
                        placeholder="緑茶"
                    />
                    <div className="flex justify-between text-gray-500">
                        <div className="text-red-500 font-bold">
                            {(displayError && !formData.name) && (uploadError.name)}
                        </div>
                        <div>{formData.name.length}/30</div>
                    </div>
                </div>

                <div className="relative flex flex-col mt-12 bg-white px-6 pt-6 pb-3 rounded-md border-gray-300 border-1">
                    <label className="text-lg" htmlFor="item_id">
                        アイテムID<span className="text-red-500"> *</span>
                    </label>
                    <div className="text-gray-500 text-sm">システム内で使用するアイテムIDです。市民の皆さんには見えませんがわかりやすいものにしてください。<br />入力可能な文字は小文字のアルファベットと数字、アンダーバーのみです。</div>
                    <input
                        className="border-b-2 border-b-gray-200 focus:outline-none"
                        onChange={handleChange}
                        value={formData.item_id}
                        type="text"
                        id="item_id"
                        name="item_id"
                        maxLength={30}
                        placeholder="green_tea_special"
                        onInput={(event) => {
                            event.target.value = event.target.value.replace(/[^a-z0-9_]/g, '');
                        }}
                    />
                    <div className="flex justify-between text-gray-500">
                        <div className="text-red-500 font-bold">
                            {(displayError && !formData.item_id) && (uploadError.item_id)}
                        </div>
                        <div>{formData.item_id.length}/30</div>
                    </div>
                </div>

                <div className="relative flex flex-col mt-12 bg-white px-6 pt-6 pb-3 rounded-md border-gray-300 border-1">
                    <label className="text-lg" htmlFor="description">アイテム説明</label>
                    <input
                        className="border-b-2 border-b-gray-200 focus:outline-none"
                        onChange={handleChange}
                        value={formData.description}
                        type="text"
                        id="description"
                        name="description"
                        maxLength={60}
                        placeholder="日本の伝統的なお茶"
                    />
                    <div className="flex justify-between text-gray-500">
                        <div>{formData.description.length}/60</div>
                    </div>
                </div>

                <div className="relative flex flex-col mt-12 bg-white px-6 pt-6 pb-3 rounded-md border-gray-300 border-1">
                    <label className="text-lg" htmlFor="weight">
                        アイテムの重さ<span className="text-red-500"> *</span>
                    </label>
                    <input
                        className="border-b-2 border-b-gray-200 focus:outline-none"
                        onChange={handleChange}
                        value={formData.weight}
                        type="text"
                        id="weight"
                        name="weight"
                        maxLength={4}
                        placeholder="0.1"
                    />
                    <div className="flex justify-between text-gray-500">
                        <div className="text-red-500 font-bold">
                            {(displayError && !formData.weight) && (uploadError.weight)}
                        </div>
                        <div>{formData.weight.length}/4</div>
                    </div>
                </div>

                {/* 基本画像アップロード */}
                <ImageV2
                    formData={formData}
                    setFormData={setFormData}
                    handleFileChange={handleFileChange}
                    userInfo={userInfo}
                    displayError={displayError}
                    uploadError={uploadError}
                    previewUrl={previewUrl}
                    setPreviewUrl={setPreviewUrl}
                    files={files}
                />

                {/* 素材・クラフト選択 */}
                <div className="relative flex flex-col mt-12 bg-white px-6 py-6 rounded-md border-gray-300 border-1">
                    <label className="text-lg">
                        素材・クラフト選択<span className="text-red-500"> *</span>
                    </label>
                    <select
                        onChange={handleMaterialCraftChange}
                        className="w-full px-2 py-1 border-2 text-black border-gray-300 rounded-xl focus:outline-none cursor-pointer"
                        id="craft_material1"
                    >
                        <option value="">選択してください。</option>
                        <option value="material">素材</option>
                        <option value="craft">クラフト</option>
                    </select>
                    <div className="flex justify-between text-gray-500">
                        <div className="text-red-500 font-bold">
                            {(displayError && !formData.is_craft && !formData.is_material) && (uploadError.craftmaterial)}
                        </div>
                    </div>
                </div>

                {/* クラフト素材選択 */}
                {formData.is_craft === 1 && (
                    <div className="relative flex flex-col mt-12 bg-white px-6 py-6 rounded-md border-gray-300 border-1">
                        <label className="text-lg">
                            クラフト素材<span className="text-red-500"> *</span>
                        </label>
                        <div className="text-gray-500 text-sm">1番上から素材を選択してください。現存しない素材を選択したい場合は当フォームから申請し追加してください。</div>

                        {/* 素材1 */}
                        <Combobox
                            value={material1InputValue}
                            onChange={(value) => {
                                if (value && value.material_id && value.name) {
                                    setFormData((prevData) => ({
                                        ...prevData,
                                        craft_material1: value.material_id,
                                    }));
                                    setMaterial1InputValue(value.name);
                                } else {
                                    setFormData((prevData) => ({
                                        ...prevData,
                                        craft_material1: '',
                                    }));
                                    setMaterial1InputValue('');
                                }
                            }}
                        >
                            <div className="relative">
                                <ComboboxInput
                                    className="w-full px-2 py-1 border-2 text-black border-gray-300 rounded-xl focus:outline-none"
                                    onChange={(event) => setMaterial1InputValue(event.target.value)}
                                    placeholder="素材1を選択"
                                />
                                <ComboboxButton className="group absolute inset-y-0 right-0 px-2.5 cursor-pointer">
                                    <svg className="size-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                                    </svg>
                                </ComboboxButton>
                            </div>
                            <ComboboxOptions className="w-[var(--input-width)] rounded-xl border border-black/10 bg-white p-1 mt-1 max-h-60 overflow-y-auto">
                                {filteredMaterials1.map((material) => (
                                    <ComboboxOption
                                        key={material.id}
                                        value={{ material_id: material.material_id, name: material.name }}
                                        className="my-1 border-black/20 border-2 group flex items-center gap-2 rounded-lg py-1.5 px-3 select-none data-[focus]:bg-black/5 cursor-pointer"
                                    >
                                        <img src={`${process.env.REACT_APP_IMAGE_DOMAIN}/${material.image}`} className="w-12 h-12 object-cover" alt="" />
                                        <div className="text-lg font-bold text-black">{material.name}</div>
                                    </ComboboxOption>
                                ))}
                            </ComboboxOptions>
                        </Combobox>

                        {/* 素材2 */}
                        <Combobox
                            value={material2InputValue}
                            onChange={(value) => {
                                if (value && value.material_id && value.name) {
                                    setFormData((prevData) => ({
                                        ...prevData,
                                        craft_material2: value.material_id,
                                    }));
                                    setMaterial2InputValue(value.name);
                                } else {
                                    setFormData((prevData) => ({
                                        ...prevData,
                                        craft_material2: '',
                                    }));
                                    setMaterial2InputValue('');
                                }
                            }}
                        >
                            <div className="relative mt-2">
                                <ComboboxInput
                                    className="w-full px-2 py-1 border-2 text-black border-gray-300 rounded-xl focus:outline-none"
                                    onChange={(event) => setMaterial2InputValue(event.target.value)}
                                    placeholder="素材2を選択（任意）"
                                />
                                <ComboboxButton className="group absolute inset-y-0 right-0 px-2.5 cursor-pointer">
                                    <svg className="size-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                                    </svg>
                                </ComboboxButton>
                            </div>
                            <ComboboxOptions className="w-[var(--input-width)] rounded-xl border border-black/10 bg-white p-1 mt-1 max-h-60 overflow-y-auto">
                                {filteredMaterials2.map((material) => (
                                    <ComboboxOption
                                        key={material.id}
                                        value={{ material_id: material.material_id, name: material.name }}
                                        className="my-1 border-black/20 border-2 group flex items-center gap-2 rounded-lg py-1.5 px-3 select-none data-[focus]:bg-black/5 cursor-pointer"
                                    >
                                        <img src={`${process.env.REACT_APP_IMAGE_DOMAIN}/${material.image}`} className="w-12 h-12 object-cover" alt="" />
                                        <div className="text-lg font-bold text-black">{material.name}</div>
                                    </ComboboxOption>
                                ))}
                            </ComboboxOptions>
                        </Combobox>

                        {/* 素材3 */}
                        <Combobox
                            value={material3InputValue}
                            onChange={(value) => {
                                if (value && value.material_id && value.name) {
                                    setFormData((prevData) => ({
                                        ...prevData,
                                        craft_material3: value.material_id,
                                    }));
                                    setMaterial3InputValue(value.name);
                                } else {
                                    setFormData((prevData) => ({
                                        ...prevData,
                                        craft_material3: '',
                                    }));
                                    setMaterial3InputValue('');
                                }
                            }}
                        >
                            <div className="relative mt-2">
                                <ComboboxInput
                                    className="w-full px-2 py-1 border-2 text-black border-gray-300 rounded-xl focus:outline-none"
                                    onChange={(event) => setMaterial3InputValue(event.target.value)}
                                    placeholder="素材3を選択（任意）"
                                />
                                <ComboboxButton className="group absolute inset-y-0 right-0 px-2.5 cursor-pointer">
                                    <svg className="size-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                                    </svg>
                                </ComboboxButton>
                            </div>
                            <ComboboxOptions className="w-[var(--input-width)] rounded-xl border border-black/10 bg-white p-1 mt-1 max-h-60 overflow-y-auto">
                                {filteredMaterials3.map((material) => (
                                    <ComboboxOption
                                        key={material.id}
                                        value={{ material_id: material.material_id, name: material.name }}
                                        className="my-1 border-black/20 border-2 group flex items-center gap-2 rounded-lg py-1.5 px-3 select-none data-[focus]:bg-black/5 cursor-pointer"
                                    >
                                        <img src={`${process.env.REACT_APP_IMAGE_DOMAIN}/${material.image}`} className="w-12 h-12 object-cover" alt="" />
                                        <div className="text-lg font-bold text-black">{material.name}</div>
                                    </ComboboxOption>
                                ))}
                            </ComboboxOptions>
                        </Combobox>

                        <div className="text-red-500 font-bold mt-2">
                            {(displayError && formData.is_craft === 1 && !formData.craft_material1) && (uploadError.craft_material1)}
                        </div>
                    </div>
                )}

                {/* アイテムタイプ選択 */}
                <TabV2
                    formData={formData}
                    handleItemTypeChange={handleItemTypeChange}
                    userInfo={userInfo}
                />

                {/* エモート */}
                {(formData.item_type === "effect" || formData.item_type === "image" || formData.item_type === "audio" || formData.item_type === "giveitem") && (
                    <div className="relative flex flex-col mt-12 bg-white px-6 pt-6 pb-3 rounded-md border-gray-300 border-1">
                        <label className="text-lg" htmlFor="emote">エモート</label>
                        <div className="text-gray-500 text-sm">アイテム使用時に表示されるエモート<br />/eのあとに入力するエモートのIDのみ入力してください。/e drinkの場合は"drink"のみ</div>
                        <input
                            className="border-b-2 border-b-gray-200 focus:outline-none"
                            onChange={handleChange}
                            value={formData.emote}
                            type="text"
                            id="emote"
                            name="emote"
                            maxLength={15}
                            placeholder="drink"
                        />
                        <div className="flex justify-between text-gray-500">
                            <div>{formData.emote.length}/15</div>
                        </div>
                    </div>
                )}

                {/* 効果アイテム設定 */}
                {formData.item_type === "effect" && (
                    <>
                        <div className="relative flex flex-col mt-12 bg-white px-6 py-6 rounded-md border-gray-300 border-1">
                            <label className="text-lg">
                                アイテムタイプ<span className="text-red-500"> *</span>
                            </label>
                            <select
                                onChange={handleChange}
                                name="effect_item_type"
                                className="w-full px-2 py-1 border-2 text-black border-gray-300 rounded-xl focus:outline-none cursor-pointer"
                                id="effect_item_type"
                            >
                                <option value="">選択してください。</option>
                                <option value="food">食べ物</option>
                                <option value="drink">飲み物</option>
                                <option value="alcohol">アルコール</option>
                                <option value="drug">薬物</option>
                                <option value="other">その他</option>
                            </select>
                            <div className="text-red-500 font-bold">
                                {(displayError && !formData.effect_item_type) && (uploadError.effect_item_type)}
                            </div>
                        </div>

                        <div className="relative flex flex-col mt-12 bg-white px-6 pt-6 pb-3 rounded-md border-gray-300 border-1">
                            <label className="text-lg">
                                使用時間 (秒)<span className="text-red-500"> *</span>
                            </label>
                            <div className="text-gray-500 text-sm">デフォルト(最短)で5~6秒のランダムです。 <br />回復効果付きのアイテムでカスタマイズしたい場合は6秒以上にしてください。<br />効果付きアイテムで6秒未満の場合は5~6秒のランダムで設定します。</div>
                            <input
                                className="border-b-2 border-b-gray-200 focus:outline-none"
                                onChange={handleChange}
                                value={formData.effect_time}
                                type="text"
                                id="effect_time"
                                name="effect_time"
                                maxLength={4}
                                placeholder="6"
                            />
                            <div className="flex justify-between text-gray-500">
                                <div className="text-red-500 font-bold">
                                    {(displayError && !formData.effect_time) && (uploadError.effect_time)}
                                </div>
                                <div>{formData.effect_time.length}/4</div>
                            </div>
                        </div>

                        {/* 付与アイテム */}
                        <div className="flex flex-col mt-8 bg-white px-6 py-6 rounded-md border-gray-300 border-1">
                            <label className="text-lg">付与アイテム</label>
                            <div className="text-gray-500 text-sm">複数個からランダムにしたい場合は「,」で区切ってください。(例: giveitem1, giveitem2, giveitem3)</div>
                            <div className="mt-2">
                                <input
                                    className="border-b-2 border-b-gray-200 focus:outline-none w-full"
                                    onChange={handleChange}
                                    value={formData.effect_grant}
                                    type="text"
                                    name="effect_grant"
                                    maxLength={100}
                                    placeholder="giveitem"
                                />
                                <div className="text-gray-500 text-sm mt-1">{formData.effect_grant.length}/100</div>
                            </div>
                            <div className="mt-2">
                                <label className="text-lg">付与個数</label>
                                <input
                                    className="border-b-2 border-b-gray-200 focus:outline-none w-full"
                                    onChange={handleChange}
                                    value={formData.effect_grant_count}
                                    type="text"
                                    name="effect_grant_count"
                                    id="effect_grant_count"
                                    maxLength={4}
                                    placeholder="5"
                                />
                                <div className="flex justify-between text-gray-500">
                                    <div className="text-red-500 font-bold">
                                        {(displayError && !formData.effect_grant_count) && (uploadError.effect_grant_count)}
                                    </div>
                                    <div>{formData.effect_grant_count.length}/4</div>
                                </div>
                            </div>
                        </div>

                        {/* 回復効果 */}
                        <div className="flex flex-col mt-8 bg-white px-6 py-6 rounded-md border-gray-300 border-1">
                            <label className="text-lg">回復効果</label>
                            <div className="text-gray-500 text-sm">ステータス回復効果の設定（選択時に自動でitem_idに接頭辞が追加されます）</div>
                            <select
                                onChange={(e) => {
                                    handleChange(e);
                                    // 回復効果が選択された時にitem_idの接頭辞を自動設定
                                    if (e.target.value) {
                                        const currentItemId = formData.item_id;
                                        // 既存の接頭辞を削除
                                        const withoutPrefix = currentItemId.replace(/^(hunger_|thirst_|heal_|stress_)/, '');
                                        // 新しい接頭辞を追加
                                        const newItemId = `${e.target.value}_${withoutPrefix}`;
                                        setFormData((prevData) => ({
                                            ...prevData,
                                            item_id: newItemId
                                        }));
                                    }
                                }}
                                name="effect_type"
                                className="w-full px-2 py-1 border-2 text-black border-gray-300 rounded-xl focus:outline-none cursor-pointer mt-2"
                            >
                                <option value="">選択してください。</option>
                                <option value="hunger">空腹</option>
                                <option value="thirst">のどの渇き</option>
                                <option value="heal">体力</option>
                                <option value="stress">ストレス</option>
                            </select>
                            {formData.effect_type && (
                                <div className="mt-2">
                                    <input
                                        className="border-b-2 border-b-gray-200 focus:outline-none w-full"
                                        onChange={handleChange}
                                        value={formData.effect_amount}
                                        type="number"
                                        name="effect_amount"
                                        min="-127"
                                        max="127"
                                        placeholder="回復量（マイナス可）"
                                    />
                                    <div className="text-red-500 font-bold">
                                        {(displayError && formData.effect_type && !formData.effect_amount) && (uploadError.effect_amount)}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* 視覚効果 */}
                        <div className="flex flex-col mt-8 bg-white px-6 py-6 rounded-md border-gray-300 border-1">
                            <label className="text-lg">視覚効果</label>
                            <div className="text-gray-500 text-sm">画面エフェクトの設定 (サンプルアイテムの納品可能です。)</div>
                            <select
                                onChange={handleChange}
                                name="effect_screen"
                                className="w-full px-2 py-1 border-2 text-black border-gray-300 rounded-xl focus:outline-none cursor-pointer mt-2"
                            >
                                <option value="">選択してください。</option>
                                <option value="rampage">rampage</option>
                                <option value="turbo">turbo</option>
                                <option value="focus">focus</option>
                                <option value="weed">weed</option>
                                <option value="trevor">trevor</option>
                            </select>
                        </div>

                        {/* 必要アイテム */}
                        <div className="flex flex-col mt-8 bg-white px-6 py-6 rounded-md border-gray-300 border-1">
                            <label className="text-lg">必要アイテム</label>
                            <div className="text-gray-500 text-sm">使用時に必要なアイテム</div>
                            <input
                                className="border-b-2 border-b-gray-200 focus:outline-none w-full mt-2"
                                onChange={handleChange}
                                value={formData.effect_required}
                                type="text"
                                name="effect_required"
                                maxLength={20}
                                placeholder="required_item"
                            />
                            <div className="text-gray-500 text-sm mt-1">{formData.effect_required.length}/20</div>
                        </div>

                        {/* OD機能 */}
                        <div className="flex flex-col mt-8 bg-white px-6 py-6 rounded-md border-gray-300 border-1">
                            <div className="text-lg cursor-pointer"
                                onClick={() => setFormData((prevData) => ({
                                    ...prevData,
                                    effect_is_od: formData.effect_is_od === 1 ? 0 : 1,
                                }))}>
                                <input
                                    type="checkbox"
                                    checked={formData.effect_is_od === 1}
                                    className="mr-2"
                                    readOnly
                                />
                                OD機能を有効にする
                            </div>
                        </div>
                    </>
                )}

                {/* 画像表示アイテム設定 */}
                {formData.item_type === "image" && (
                    <>
                        <div className="relative flex flex-col mt-12 bg-white px-6 py-6 rounded-md border-gray-300 border-1">
                            <label className="text-lg">
                                画像表示タイプ<span className="text-red-500"> *</span>
                            </label>
                            <select
                                onChange={handleChange}
                                name="display_type"
                                className="w-full px-2 py-1 border-2 text-black border-gray-300 rounded-xl focus:outline-none cursor-pointer"
                                id="display_type"
                            >
                                <option value="">選択してください。</option>
                                <option value="near">近くの人に表示</option>
                                <option value="onlyme">自分にのみ表示</option>
                                <option value="scroll">スクロール表示</option>
                            </select>
                            <div className="text-red-500 font-bold">
                                {(displayError && !formData.display_type) && (uploadError.display_type)}
                            </div>
                        </div>

                        <div className="relative flex flex-col mt-12 bg-white px-6 py-6 rounded-md border-gray-300 border-1">
                            <label className="text-lg">
                                表示画像<span className="text-red-500"> *</span>
                            </label>

                            <input
                                type="file"
                                accept="image/png"
                                onChange={(e) => handleFileChange('display_image', e.target.files[0])}
                                className="mt-2 block w-full text-sm text-gray-500
                                    file:mr-4 file:py-2 file:px-4
                                    file:rounded-lg file:border-0
                                    file:text-sm file:font-semibold
                                    file:bg-blue-50 file:text-blue-700
                                    hover:file:bg-blue-100 file:cursor-pointer"
                                id="display_image"
                            />

                            {previewUrls?.display_image && (
                                <div className="mt-4">
                                    <p className="text-sm text-gray-600 mb-2">プレビュー:</p>
                                    <img
                                        src={previewUrls.display_image}
                                        alt="Display preview"
                                        className="w-32 h-32 object-cover border-2 border-gray-300 rounded-lg"
                                    />
                                </div>
                            )}

                            <div className="text-red-500 font-bold mt-2">
                                {(displayError && !files.display_image) && (uploadError.display_image)}
                            </div>

                            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                <p className="text-sm text-yellow-800">
                                    <strong>画像要件:</strong>
                                </p>
                                <ul className="text-sm text-yellow-700 mt-1 list-disc list-inside">
                                    <li>形式: PNG のみ</li>
                                    <li>サイズ: 1000x1000 以下</li>
                                    <li>ファイルサイズ: 5MB 以下</li>
                                </ul>
                            </div>
                        </div>
                    </>
                )}

                {/* 音楽再生アイテム設定 */}
                {formData.item_type === "audio" && (
                    <div className="relative flex flex-col mt-12 bg-white px-6 py-6 rounded-md border-gray-300 border-1">
                        <label className="text-lg">
                            音楽ファイル<span className="text-red-500"> *</span>
                        </label>

                        <input
                            type="file"
                            accept="audio/mpeg"
                            onChange={(e) => handleFileChange('audio_file', e.target.files[0])}
                            className="mt-2 block w-full text-sm text-gray-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-lg file:border-0
                                file:text-sm file:font-semibold
                                file:bg-blue-50 file:text-blue-700
                                hover:file:bg-blue-100 file:cursor-pointer"
                            id="audio_file"
                        />

                        {previewUrls?.audio_file && (
                            <div className="mt-4">
                                <p className="text-sm text-gray-600 mb-2">プレビュー:</p>
                                <audio
                                    controls
                                    className="w-full max-w-md"
                                    preload="metadata"
                                >
                                    <source src={previewUrls.audio_file} type="audio/mpeg" />
                                    お使いのブラウザはオーディオ要素をサポートしていません。
                                </audio>
                                {files.audio_file && (
                                    <div className="text-xs text-gray-500 mt-1">
                                        ファイル名: {files.audio_file.name} | サイズ: {(files.audio_file.size / 1024 / 1024).toFixed(2)}MB
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="text-red-500 font-bold mt-2">
                            {(displayError && !files.audio_file) && (uploadError.audio_file)}
                        </div>

                        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <p className="text-sm text-yellow-800">
                                <strong>音楽ファイル要件:</strong>
                            </p>
                            <ul className="text-sm text-yellow-700 mt-1 list-disc list-inside">
                                <li>形式: MP3 のみ</li>
                                <li>ファイルサイズ: 10MB 以下</li>
                            </ul>
                        </div>
                    </div>
                )}

                {/* アイテム付与設定 */}
                {formData.item_type === "giveitem" && (
                    <>
                        <div className="relative flex flex-col mt-12 bg-white px-6 pt-6 pb-3 rounded-md border-gray-300 border-1">
                            <label className="text-lg">
                                付与アイテム
                            </label>
                            <div className="text-gray-500 text-sm">
                                2個以上にしたい場合は付与アイテム欄と付与個数を空白にし、その他のテキストボックス内にアイテムを全て記載してください。<br />
                                (例: 使用後giveitem1を10個, giveitem2を2個付与してください。)
                            </div>
                            <input
                                className="border-b-2 border-b-gray-200 focus:outline-none"
                                onChange={handleChange}
                                value={formData.give_additem}
                                type="text"
                                id="give_additem"
                                name="give_additem"
                                maxLength={20}
                                placeholder="giveitem"
                            />
                            <div className="flex justify-between text-gray-500">
                                <div></div>
                                <div>{formData.give_additem.length}/20</div>
                            </div>
                        </div>

                        <div className="relative flex flex-col mt-12 bg-white px-6 pt-6 pb-3 rounded-md border-gray-300 border-1">
                            <label className="text-lg">
                                付与個数<span className="text-red-500"> *</span>
                            </label>
                            <input
                                className="border-b-2 border-b-gray-200 focus:outline-none"
                                onChange={handleChange}
                                value={formData.give_addamount}
                                type="number"
                                id="give_addamount"
                                name="give_addamount"
                                min="1"
                                max="200"
                                placeholder="1"
                            />
                            <div className="text-red-500 font-bold">
                                {(displayError && !formData.give_addamount) && (uploadError.give_addamount)}
                            </div>
                        </div>

                        <div className="relative flex flex-col mt-12 bg-white px-6 pt-6 pb-3 rounded-md border-gray-300 border-1">
                            <label className="text-lg">
                                付与時間 (秒)<span className="text-red-500"> *</span>
                            </label>
                            <input
                                className="border-b-2 border-b-gray-200 focus:outline-none"
                                onChange={handleChange}
                                value={formData.give_time}
                                type="text"
                                id="give_time"
                                name="give_time"
                                maxLength={4}
                                placeholder="5"
                            />
                            <div className="flex justify-between text-gray-500">
                                <div className="text-red-500 font-bold">
                                    {(displayError && !formData.give_time) && (uploadError.give_time)}
                                </div>
                                <div>{formData.give_time.length}/4</div>
                            </div>
                        </div>

                        <div className="relative flex flex-col mt-12 bg-white px-6 pt-6 pb-3 rounded-md border-gray-300 border-1">
                            <label className="text-lg">
                                付与テキスト<span className="text-red-500"> *</span>
                            </label>
                            <input
                                className="border-b-2 border-b-gray-200 focus:outline-none"
                                onChange={handleChange}
                                value={formData.give_text}
                                type="text"
                                id="give_text"
                                name="give_text"
                                maxLength={30}
                                placeholder="アイテム付与ボックスを開封中..."
                            />
                            <div className="flex justify-between text-gray-500">
                                <div className="text-red-500 font-bold">
                                    {(displayError && !formData.give_text) && (uploadError.give_text)}
                                </div>
                                <div>{formData.give_text.length}/30</div>
                            </div>
                        </div>
                    </>
                )}

                {/* 卸売設定 */}
                <div className="flex flex-col mt-8 bg-white px-6 py-6 rounded-md border-gray-300 border-1">
                    <div className="text-lg cursor-pointer"
                        onClick={() => setFormData((prevData) => ({
                            ...prevData,
                            is_wholesale: formData.is_wholesale === 1 ? 0 : 1,
                        }))}>
                        <input
                            type="checkbox"
                            checked={formData.is_wholesale === 1}
                            className="mr-2"
                            readOnly
                        />
                        卸売商品とする
                    </div>
                </div>

                {formData.is_wholesale === 1 && (
                    <>
                        <div className="relative flex flex-col mt-12 bg-white px-6 pt-6 pb-3 rounded-md border-gray-300 border-1">
                            <label className="text-lg">
                                卸先での価格<span className="text-red-500"> *</span>
                            </label>
                            <input
                                className="border-b-2 border-b-gray-200 focus:outline-none"
                                onChange={handleChange}
                                value={formData.whole_price}
                                type="number"
                                id="whole_price"
                                name="whole_price"
                                placeholder="50000"
                            />
                            <div className="text-red-500 font-bold">
                                {(displayError && formData.is_wholesale === 1 && !formData.whole_price) && (uploadError.whole_price)}
                            </div>
                        </div>

                        <div className="relative flex flex-col mt-12 bg-white px-6 pt-6 pb-3 rounded-md border-gray-300 border-1">
                            <label className="text-lg">
                                卸先店舗<span className="text-red-500"> *</span>
                            </label>
                            <select
                                onChange={handleChange}
                                value={formData.whole_shop}
                                name="whole_shop"
                                className="w-full px-2 py-1 border-2 text-black border-gray-300 rounded-xl focus:outline-none cursor-pointer"
                                id="whole_shop"
                            >
                                <option value="">選択してください。</option>
                                {jobs.map((job) => (
                                    <option key={job.id} value={job.name}>{job.name}</option>
                                ))}
                            </select>
                            <div className="text-red-500 font-bold">
                                {(displayError && formData.is_wholesale === 1 && !formData.whole_shop) && (uploadError.whole_shop)}
                            </div>
                        </div>
                    </>
                )}

                {/* 製造店舗選択 */}
                {(userInfo[0].job2 !== null && userInfo[0].job2 !== "") && (
                    <div className="flex flex-col mt-8 bg-white px-6 py-6 rounded-md border-gray-300 border-1">
                        <label className="text-lg">
                            製造店舗<span className="text-red-500"> *</span>
                        </label>
                        <div className="text-gray-500 text-sm">2店舗のオーナーをしている方向けです。</div>
                        <select
                            onChange={handleChange}
                            name="job"
                            className="w-full px-2 py-1 border-2 text-black border-gray-300 rounded-xl focus:outline-none cursor-pointer mt-2"
                            id="job"
                        >
                            <option value="">選択してください。</option>
                            <option value={userInfo[0].job}>
                                {jobs.find((job) => job.job_id === userInfo[0]?.job)?.name}
                            </option>
                            <option value={userInfo[0].job2}>
                                {jobs.find((job) => job.job_id === userInfo[0]?.job2)?.name}
                            </option>
                        </select>
                        <div className="text-red-500 font-bold">
                            {(displayError && !formData.job) && (uploadError.job)}
                        </div>
                    </div>
                )}

                <div className="relative flex flex-col mt-12 bg-white px-6 py-6 rounded-md border-gray-300 border-1">
                    <label className="text-lg">
                        販売日時<span className="text-red-500"> *</span>
                    </label>
                    <div className="text-gray-500 text-sm">恒常商品ルールの販売間隔はこちらで計算されます。</div>
                    {formData.is_material ? (
                        <div className="text-gray-500 text-sm">素材のみでの使用の場合、販売日時はいつでも大丈夫です。</div>
                    ) : ""}
                    <input
                        className="border-b-2 border-b-gray-200 focus:outline-none"
                        onChange={handleChange}
                        value={formData.sale_date}
                        type="date"
                        id="sale_date"
                        name="sale_date"
                    />
                    <div className="text-red-500 font-bold">
                        {(displayError && !formData.sale_date) && (uploadError.sale_date)}
                    </div>
                </div>

                <div className="relative flex flex-col mt-12 bg-white px-6 pt-6 pb-3 rounded-md border-gray-300 border-1">
                    <label className="text-lg">
                        値段<span className="text-red-500"> *</span>
                    </label>
                    {formData.is_material ? (
                        <div className="text-gray-500 text-sm">素材のみでの使用の場合、値段は0円で大丈夫です。</div>
                    ) : ""}
                    <input
                        className="border-b-2 border-b-gray-200 focus:outline-none"
                        onChange={handleChange}
                        value={formData.price}
                        type="number"
                        id="price"
                        name="price"
                        placeholder="50000"
                    />
                    <div className="text-red-500 font-bold">
                        {(displayError && !formData.price) && (uploadError.price)}
                    </div>
                </div>

                {/* その他 */}
                <div className="flex flex-col mt-8 bg-white px-6 py-6 rounded-md border-gray-300 border-1">
                    <label className="text-lg">その他</label>
                    <div className="text-gray-500 text-sm">イベント商品の場合やフォームで設定できない機能をつけたいなど補足がある場合記載してください。</div>
                    <textarea
                        className="border-b-2 border-b-gray-200 focus:outline-none scroll-hidden mt-2"
                        ref={textareaRef}
                        onChange={(e) => {
                            adjustTextareaHeight();
                            handleChange(e);
                        }}
                        value={formData.other}
                        id="other"
                        name="other"
                        maxLength={4000}
                    />
                    <div className="text-gray-500 text-sm mt-1">{formData.other.length}/4000</div>
                </div>

                <button
                    className="mt-8 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-8 rounded-lg"
                    onClick={(event) => {
                        event.preventDefault();
                        handleUpload();
                    }}>
                    申請する
                </button>
            </div>
        </div>
    )
}

export default FormV2