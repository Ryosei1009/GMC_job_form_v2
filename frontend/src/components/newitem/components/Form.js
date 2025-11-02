import React, { useEffect, useState } from 'react'
import Image from './Image';
import Tab from './Tab';
import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react'

const Form = ({ handleChange, formData, displayError, uploadError, setFormData, userInfo, materials, textareaRef, adjustTextareaHeight, handleUpload, previewUrl, setPreviewUrl, token }) => {
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
                console.error('Error fetching new item list:', error);
            }
        }
        fetchJobs();
    }, [userInfo, token]);

    const [material1InputValue, setMaterial1InputValue] = useState('')
    const [material2InputValue, setMaterial2InputValue] = useState('')
    const [material3InputValue, setMaterial3InputValue] = useState('')

    const filteredMaterials1 =
        material1InputValue === '' ?
            materials : materials.filter((material) => {
                return material.name.toLowerCase().includes(material1InputValue.toLowerCase())
            })

    const filteredMaterials2 =
        material2InputValue === '' ?
            materials : materials.filter((material) => {
                return material.name.toLowerCase().includes(material2InputValue.toLowerCase())
            })

    const filteredMaterials3 =
        material3InputValue === '' ?
            materials : materials.filter((material) => {
                return material.name.toLowerCase().includes(material3InputValue.toLowerCase())
            })
    return (
        <div className="flex justify-center mx-3">
            <div className="max-w-2xl w-full mb-16">
                <div className="relative flex flex-col mt-12 bg-white px-6 pt-6 pb-3 rounded-md border-gray-300 border-1">
                    <label className="text-lg" htmlFor="name">
                        アイテム名<span className="text-red-500"> *</span>
                    </label>
                    <div className="text-gray-500 text-sm"></div>
                    <input
                        className="border-b-2 border-b-gray-200 focus:outline-none"
                        onChange={handleChange}
                        value={formData.name}
                        type="text"
                        id="name"
                        name="name"
                        maxLength={31}
                        placeholder="緑茶"
                    />
                    <div className="flex justify-between text-gray-500">
                        <div className="text-red-500 font-bold">
                            {(displayError && !formData.name) && (uploadError.name)}
                        </div>
                        <div>
                            {formData.name.length}/31
                        </div>
                    </div>
                </div>
                <div className="relative flex flex-col mt-12 bg-white px-6 pt-6 pb-3 rounded-md border-gray-300 border-1">
                    <label className="text-lg" htmlFor="name">
                        アイテムID<span className="text-red-500"> *</span>
                    </label>
                    <div className="text-gray-500 text-sm">システム内で使用するアイテムIDです。市民の皆さんには見えませんがわかりやすいものにしてください。<br />入力可能な文字は小文字のアルファベットと数字、アンダーバーのみです。(abc.. 123.. _)</div>
                    <input
                        className="border-b-2 border-b-gray-200 focus:outline-none"
                        onChange={handleChange}
                        value={formData.item_id}
                        type="text"
                        id="item_id"
                        name="item_id"
                        maxLength={31}
                        placeholder="green_tea"
                        onInput={(event) => {
                            event.target.value = event.target.value.replace(/[^a-z0-9_]/g, ''); // 小文字のアルファベット、アンダーバー、数字以外を削除
                        }}
                    />
                    <div className="flex justify-between text-gray-500">
                        <div className="text-red-500 font-bold">
                            {(displayError && !formData.item_id) && (uploadError.item_id)}
                        </div>
                        <div>
                            {formData.item_id.length}/31
                        </div>
                    </div>
                </div>
                <div className="relative flex flex-col mt-12 bg-white px-6 pt-6 pb-3 rounded-md border-gray-300 border-1">
                    <label className="text-lg" htmlFor="name">
                        アイテム説明
                    </label>
                    <div className="text-gray-500 text-sm"></div>
                    <input
                        className="border-b-2 border-b-gray-200 focus:outline-none"
                        onChange={handleChange}
                        value={formData.description}
                        type="text"
                        id="description"
                        name="description"
                        maxLength={127}
                        placeholder="日本の伝統的なお茶"
                    />
                    <div className="flex justify-between text-gray-500">
                        <div>
                            {formData.description.length}/127
                        </div>
                    </div>
                </div>
                <div className="relative flex flex-col mt-12 bg-white px-6 pt-6 pb-3 rounded-md border-gray-300 border-1">
                    <label className="text-lg" htmlFor="name">
                        アイテムの重さ<span className="text-red-500"> *</span>
                    </label>
                    <div className="text-gray-500 text-sm"></div>
                    <input
                        className="border-b-2 border-b-gray-200 focus:outline-none"
                        onChange={handleChange}
                        value={formData.weight}
                        type="number"
                        id="weight"
                        name="weight"
                        onInput={(event) => {
                            if (Number(event.target.value) > 360) {
                                event.target.value = 360;
                            }
                        }}
                        onWheel={(e) => e.target.blur()}
                        placeholder="0.1"
                    />
                    <div className="flex justify-between text-gray-500">
                        <div className="text-red-500 font-bold">
                            {(displayError && !formData.weight) && (uploadError.weight)}
                        </div>
                        <div>
                            {formData.weight}/360
                        </div>
                    </div>
                </div>
                <Image formData={formData} setFormData={setFormData} userInfo={userInfo} displayError={displayError} uploadError={uploadError} previewUrl={previewUrl} setPreviewUrl={setPreviewUrl} />
                <Tab formData={formData} setFormData={setFormData} userInfo={userInfo} />
                {formData.is_craft === 1 && (
                    <div className="relative flex flex-col mt-12 bg-white px-6 py-6 rounded-md border-gray-300 border-1">
                        <label className="text-lg" htmlFor="name">
                            素材<span className="text-red-500"> *</span>
                        </label>
                        <div className="text-gray-500 text-sm">1番上から素材を選択してください。現存しない素材を選択したい場合は当フォームから申請し追加してください。</div>

                        <Combobox
                            value={material1InputValue}
                            onChange={(value) => {
                                if (value && value.material_id && value.name) {
                                    setFormData((prevData) => ({
                                        ...prevData,
                                        created_by: userInfo[0]?.id,
                                        material1: value.material_id,
                                    }));
                                    setMaterial1InputValue(value.name);
                                } else {
                                    setFormData((prevData) => ({
                                        ...prevData,
                                        created_by: userInfo[0]?.id,
                                        material1: '',
                                    }));
                                    setMaterial1InputValue('');
                                }
                            }}
                        >
                            <div className="relative">
                                <ComboboxInput
                                    className="w-full px-2 py-1 border-2 text-black border-gray-300 rounded-xl focus:outline-none"
                                    onChange={(event) => setMaterial1InputValue(event.target.value)}
                                />
                                <ComboboxButton className="group absolute inset-y-0 right-0 px-2.5 cursor-pointer">
                                    <svg
                                        className="size-6 fill-white/60 group-data-[hover]:fill-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                        stroke="currentColor"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                                    </svg>
                                </ComboboxButton>
                            </div>

                            <ComboboxOptions
                                anchor="bottom"
                                transition
                                className="w-[var(--input-width)] rounded-xl border border-black/10 bg-white p-1 [--anchor-gap:var(--spacing-1)] empty:invisible"
                            >
                                {filteredMaterials1.map((material) => (
                                    <ComboboxOption
                                        key={material.id}
                                        value={
                                            {
                                                material_id: material.material_id,
                                                name: material.name
                                            }
                                        }
                                        className="my-1 border-black/20 border-2 group flex items-center gap-2 rounded-lg py-1.5 px-3 select-none data-[focus]:bg-black/5 cursor-pointer"
                                    >
                                        <svg className={`size-6 fill-white ${formData.material1 === material.material_id ? "visible" : "invisible"}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                        </svg>
                                        <img src={`${process.env.REACT_APP_IMAGE_DOMAIN}/${material.image}`} className="w-20" alt="" />
                                        <div className="text-lg font-bold text-black">{material.name}</div>
                                    </ComboboxOption>
                                ))}
                            </ComboboxOptions>
                        </Combobox>
                        <Combobox
                            value={material2InputValue}
                            onChange={(value) => {
                                if (value && value.material_id && value.name) {
                                    setFormData((prevData) => ({
                                        ...prevData,
                                        created_by: userInfo[0]?.id,
                                        material2: value.material_id,
                                    }));
                                    setMaterial2InputValue(value.name);
                                } else {
                                    setFormData((prevData) => ({
                                        ...prevData,
                                        created_by: userInfo[0]?.id,
                                        material2: '',
                                    }));
                                    setMaterial2InputValue('');
                                }
                            }}
                        >
                            <div className="relative">
                                <ComboboxInput
                                    className="w-full px-2 py-1 border-2 text-black border-gray-300 rounded-xl focus:outline-none mt-1"
                                    onChange={(event) => setMaterial2InputValue(event.target.value)}
                                />
                                <ComboboxButton className="group absolute inset-y-0 right-0 px-2.5 cursor-pointer">
                                    <svg
                                        className="size-6 fill-white/60 group-data-[hover]:fill-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                        stroke="currentColor"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                                    </svg>
                                </ComboboxButton>
                            </div>

                            <ComboboxOptions
                                anchor="bottom"
                                transition
                                className="w-[var(--input-width)] rounded-xl border border-black/10 bg-white p-1 [--anchor-gap:var(--spacing-1)] empty:invisible"
                            >
                                {filteredMaterials2.map((material) => (
                                    <ComboboxOption
                                        key={material.id}
                                        value={
                                            {
                                                material_id: material.material_id,
                                                name: material.name
                                            }
                                        }
                                        className="my-1 border-black/20 border-2 group flex items-center gap-2 rounded-lg py-1.5 px-3 select-none data-[focus]:bg-black/5 cursor-pointer"
                                    >
                                        <svg className={`size-6 fill-white ${formData.material2 === material.material_id ? "visible" : "invisible"}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                        </svg>
                                        <img src={`${process.env.REACT_APP_IMAGE_DOMAIN}/${material.image}`} className="w-20" alt="" />
                                        <div className="text-lg font-bold text-black">{material.name}</div>
                                    </ComboboxOption>
                                ))}
                            </ComboboxOptions>
                        </Combobox>
                        <Combobox
                            value={material3InputValue}
                            onChange={(value) => {
                                if (value && value.material_id && value.name) {
                                    setFormData((prevData) => ({
                                        ...prevData,
                                        created_by: userInfo[0]?.id,
                                        material3: value.material_id,
                                    }));
                                    setMaterial3InputValue(value.name);
                                } else {
                                    setFormData((prevData) => ({
                                        ...prevData,
                                        created_by: userInfo[0]?.id,
                                        material3: '',
                                    }));
                                    setMaterial3InputValue('');
                                }
                            }}
                        >
                            <div className="relative">
                                <ComboboxInput
                                    className="w-full px-2 py-1 border-2 text-black border-gray-300 rounded-xl focus:outline-none mt-1"
                                    onChange={(event) => setMaterial3InputValue(event.target.value)}
                                />
                                <ComboboxButton className="group absolute inset-y-0 right-0 px-2.5 cursor-pointer">
                                    <svg
                                        className="size-6 fill-white/60 group-data-[hover]:fill-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                        stroke="currentColor"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                                    </svg>
                                </ComboboxButton>
                            </div>

                            <ComboboxOptions
                                anchor="bottom"
                                transition
                                className="w-[var(--input-width)] rounded-xl border border-black/10 bg-white p-1 [--anchor-gap:var(--spacing-1)] empty:invisible"
                            >
                                {filteredMaterials3.map((material) => (
                                    <ComboboxOption
                                        key={material.id}
                                        value={
                                            {
                                                material_id: material.material_id,
                                                name: material.name
                                            }
                                        }
                                        className="my-1 border-black/20 border-2 group flex items-center gap-2 rounded-lg py-1.5 px-3 select-none data-[focus]:bg-black/5 cursor-pointer"
                                    >
                                        <svg className={`size-6 fill-white ${formData.material3 === material.material_id ? "visible" : "invisible"}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                        </svg>
                                        <img src={`${process.env.REACT_APP_IMAGE_DOMAIN}/${material.image}`} className="w-20" alt="" />
                                        <div className="text-lg font-bold text-black">{material.name}</div>
                                    </ComboboxOption>
                                ))}
                            </ComboboxOptions>
                        </Combobox>
                    </div>
                )}
                {formData.is_delivery === 1 && (
                    <div className="relative flex flex-col mt-12 bg-white px-6 pt-6 pb-3 rounded-md border-gray-300 border-1">
                        <label className="text-lg" htmlFor="name">
                            数量<span className="text-red-500"> *</span>
                        </label>
                        <div className="text-gray-500 text-sm"></div>
                        <input
                            className="border-b-2 border-b-gray-200 focus:outline-none"
                            onChange={handleChange}
                            value={formData.number}
                            type="number"
                            id="number"
                            name="number"
                            onInput={(e) => {
                                if (e.target.value.length > 4) {
                                    e.target.value = e.target.value.slice(0, 4);
                                }
                            }}
                            onWheel={(e) => e.target.blur()}
                            placeholder="300"
                        />
                        <div className="flex justify-between text-gray-500">
                            <div className="text-red-500 font-bold">
                                {(displayError && !formData.number) && (uploadError.number)}
                            </div>
                            <div>
                                {formData.number.length}/4
                            </div>
                        </div>
                    </div>
                )}
                {(formData.is_delivery === 1 || formData.is_craft === 1) && (
                    <>
                        <div className="relative flex flex-col mt-12 bg-white px-6 pt-6 pb-3 rounded-md border-gray-300 border-1">
                            <label className="text-lg" htmlFor="name">
                                値段<span className="text-red-500"> *</span>
                            </label>
                            <div className="text-gray-500 text-sm"></div>
                            <input
                                className="border-b-2 border-b-gray-200 focus:outline-none"
                                onChange={handleChange}
                                value={formData.price}
                                type="number"
                                id="price"
                                name="price"
                                onInput={(e) => {
                                    if (e.target.value.length > 9) {
                                        e.target.value = e.target.value.slice(0, 9);
                                    }
                                }}
                                onWheel={(e) => e.target.blur()}
                                placeholder="50000"
                            />
                            <div className="flex justify-between text-gray-500">
                                <div className="text-red-500 font-bold">
                                    {(displayError && !formData.price) && (uploadError.price)}
                                </div>
                                <div>
                                    {formData.price.length}/9
                                </div>
                            </div>
                        </div>
                        <div className="relative flex flex-col mt-12 bg-white px-6 py-6 rounded-md border-gray-300 border-1">
                            <label className="text-lg" htmlFor="name">
                                販売日時<span className="text-red-500"> *</span>
                            </label>
                            <div className="text-gray-500 text-sm"></div>
                            <input
                                className="border-b-2 border-b-gray-200 focus:outline-none"
                                onChange={handleChange}
                                value={formData.sale_date}
                                type="date"
                                id="sale_date"
                                name="sale_date"
                            />
                            <div className="flex justify-between text-gray-500">
                                <div className="text-red-500 font-bold">
                                    {(displayError && !formData.sale_date) && (uploadError.sale_date)}
                                </div>
                            </div>
                        </div>
                        <div className="relative flex flex-col mt-12 bg-white px-6 pt-6 pb-3 rounded-md border-gray-300 border-1">
                            <label className="text-lg" htmlFor="name">
                                販売店舗<span className="text-red-500"> *</span>
                            </label>
                            <div className="text-gray-500 text-sm"></div>
                            <input
                                className="border-b-2 border-b-gray-200 focus:outline-none"
                                onChange={handleChange}
                                value={formData.sale_shop}
                                type="text"
                                id="sale_shop"
                                name="sale_shop"
                                maxLength={15}
                                placeholder="市役所"
                            />
                            <div className="flex justify-between text-gray-500">
                                <div className="text-red-500 font-bold">
                                    {(displayError && !formData.sale_shop) && (uploadError.sale_shop)}
                                </div>
                                <div>
                                    {formData.sale_shop.length}/15
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col mt-8 bg-white px-6 py-6 rounded-md border-gray-300 border-1">
                            <label className="text-lg" htmlFor="name">
                                卸売り商品
                            </label>
                            <div className="text-gray-500 text-sm"></div>
                            <div className="text-lg cursor-pointer"
                                onClick={() => setFormData((prevData) => ({
                                    ...prevData,
                                    created_by: userInfo[0].id,
                                    is_wholesale: formData.is_wholesale === 1 ? 0 : 1,
                                }))}>
                                <input
                                    type="radio"
                                    checked={formData.is_wholesale === 1}
                                    className="mr-2"
                                    readOnly
                                />
                                はい
                            </div>
                        </div>
                    </>
                )}
                {formData.is_other === 1 && (
                    <div className="flex flex-col mt-8 bg-white px-6 py-6 rounded-md border-gray-300 border-1">
                        <label className="text-lg" htmlFor="name">
                            素材
                        </label>
                        <div className="text-gray-500 text-sm"></div>
                        <div className="text-lg cursor-pointer"
                            onClick={() => setFormData((prevData) => ({
                                ...prevData,
                                created_by: userInfo[0].id,
                                is_material: formData.is_material === 1 ? 0 : 1,
                            }))}>
                            <input
                                type="radio"
                                checked={formData.is_material === 1}
                                className="mr-2"
                                readOnly
                            />
                            はい
                        </div>
                    </div>
                )}
                <div className="flex flex-col mt-8 bg-white px-6 py-6 rounded-md border-gray-300 border-1">
                    <label className="text-lg" htmlFor="name">
                        回復効果
                    </label>
                    <div className="text-gray-500 text-sm"></div>
                    <div className="text-lg cursor-pointer"
                        onClick={() => setFormData((prevData) => ({
                            ...prevData,
                            created_by: userInfo[0].id,
                            is_effect: formData.is_effect === 1 ? 0 : 1,
                        }))}>
                        <input
                            type="radio"
                            checked={formData.is_effect === 1}
                            className="mr-2"
                            readOnly
                        />
                        あり
                    </div>
                </div>
                {formData.is_effect === 1 && (
                    <>
                        <div className="relative flex flex-col mt-12 bg-white px-6 py-6 rounded-md border-gray-300 border-1">
                            <label className="text-lg" htmlFor="name">
                                回復する効果の種類<span className="text-red-500"> *</span>
                            </label>
                            <div className="text-gray-500 text-sm"></div>
                            <select
                                onChange={(event) => setFormData((prevData) => ({
                                    ...prevData,
                                    created_by: userInfo[0].id,
                                    effect_type: event.target.value,
                                }))}
                                className={`w-full px-2 py-1 border-2 text-black border-gray-300 rounded-xl focus:outline-none cursor-pointer`}
                                id="effect_type"
                            >
                                <option value="null">選択してください。</option>
                                <option value="hunger">空腹</option>
                                <option value="thirst">飲料</option>
                                <option value="stress">ストレス</option>
                            </select>
                            <div className="flex justify-between text-gray-500">
                                <div className="text-red-500 font-bold">
                                    {(displayError && !formData.effect_type) && (uploadError.effect_type)}
                                </div>
                            </div>
                        </div>
                        <div className="relative flex flex-col mt-12 bg-white px-6 pt-6 pb-3 rounded-md border-gray-300 border-1">
                            <label className="text-lg" htmlFor="name">
                                回復量<span className="text-red-500"> *</span>
                            </label>
                            <div className="text-gray-500 text-sm">デバフにしたい場合はマイナスで記載してください。</div>
                            <input
                                className="border-b-2 border-b-gray-200 focus:outline-none"
                                onChange={handleChange}
                                value={formData.effect}
                                type="number"
                                id="effect"
                                name="effect"
                                onInput={(e) => {
                                    if (e.target.value.length > 3) {
                                        e.target.value = e.target.value.slice(0, 3);
                                    }
                                    if (Number(e.target.value) > 60) {
                                        e.target.value = 60;
                                    }
                                }}
                                onWheel={(e) => e.target.blur()}
                                placeholder="30"
                            />
                            <div className="flex justify-between text-gray-500">
                                <div className="text-red-500 font-bold">
                                    {(displayError && !formData.effect) && (uploadError.effect)}
                                </div>
                                <div>
                                    {formData.effect}/60
                                </div>
                            </div>
                        </div>
                        <div className="relative flex flex-col mt-12 bg-white px-6 pt-6 pb-3 rounded-md border-gray-300 border-1">
                            <label className="text-lg" htmlFor="name">
                                種類<span className="text-red-500"> *</span>
                            </label>
                            <div className="text-gray-500 text-sm"></div>
                            <select
                                onChange={(event) => setFormData((prevData) => ({
                                    ...prevData,
                                    created_by: userInfo[0].id,
                                    item_type: event.target.value,
                                }))}
                                className={`w-full px-2 py-1 border-2 text-black border-gray-300 rounded-xl focus:outline-none cursor-pointer`}
                                id="item_type"
                            >
                                <option value="null">選択してください。</option>
                                <option value="food">食べ物</option>
                                <option value="drink">飲み物</option>
                                <option value="alcohol">アルコール</option>
                                <option value="other">その他</option>
                            </select>
                            <div className="flex justify-between text-gray-500">
                                <div className="text-red-500 font-bold">
                                    {(displayError && !formData.item_type) && (uploadError.item_type)}
                                </div>
                            </div>
                        </div>
                    </>
                )}
                {(userInfo[0].job2 === null || userInfo[0].job2 === "") ? "" : (
                    <div className="flex flex-col mt-8 bg-white px-6 py-6 rounded-md border-gray-300 border-1">
                        <label className="text-lg" htmlFor="name">製造店舗<span className="text-red-500"> *</span></label>
                        <div className="text-gray-500 text-sm">2店舗のオーナーをしている方向けです。</div>
                        <select
                            onChange={(event) => setFormData((prevData) => ({
                                ...prevData,
                                created_by: userInfo[0].id,
                                job: event.target.value,
                            }))}
                            className={`w-full px-2 py-1 border-2 text-black border-gray-300 rounded-xl focus:outline-none cursor-pointer`}
                            id="job"
                        >
                            <option value="null">選択してください。</option>
                            <option value={userInfo[0].job}>{jobs.find((job) => job.job_id === userInfo[0]?.job)?.name}</option>
                            <option value={userInfo[0].job2}>{jobs.find((job) => job.job_id === userInfo[0]?.job2)?.name}</option>
                        </select>
                        <div className="flex justify-between text-gray-500">
                            <div className="text-red-500 font-bold">
                                {(displayError && !formData.job) && ((userInfo[0].job2 === null || userInfo[0].job2 === "") ? "" : uploadError.job)}
                            </div>
                        </div>
                    </div>
                )}
                <div className="flex flex-col mt-8 bg-white px-6 py-6 rounded-md border-gray-300 border-1">
                    <label className="text-lg" htmlFor="name">その他</label>
                    <div className="text-gray-500 text-sm">イベント商品の場合や使用後別れるアイテムなど補足がある場合記載してください。</div>
                    <textarea
                        className="border-b-2 border-b-gray-200 focus:outline-none scroll-hidden"
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
                </div>
                <button
                    className="mt-3 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-8 rounded-lg"
                    onClick={(event) => {
                        event.preventDefault();
                        handleUpload();
                    }}>
                    送信
                </button>
            </div>
        </div>
    )
}

export default Form