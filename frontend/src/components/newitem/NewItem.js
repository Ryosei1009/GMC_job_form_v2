import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios';
import Form from './components/Form';
import Preview from './components/Preview';
import ActionPerfect from '../utils/ActionPerfect';
import { Helmet } from 'react-helmet';

const NewItem = ({ userInfo, token }) => {
    const [formData, setFormData] = useState({
        item_id: "",
        name: "",
        description: "",
        image: "",
        weight: "0.1",
        is_craft: 1,
        is_other: 0,
        material1: "",
        material2: "",
        material3: "",
        is_delivery: 0,
        number: 0,
        is_effect: 0,
        effect_type: "",
        effect: "",
        sale_date: "",
        sale_shop: "",
        job: "",
        price: "",
        is_wholesale: 0,
        is_material: 0,
        other: "",
        created_by: userInfo[0].id,
    })
    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            created_by: userInfo[0].id,
            [name]: value,
        }));
    }
    const uploadError = {
        name: "アイテム名を入力してください。",
        item_id: "アイテムIDを入力してください。",
        weight: "アイテムの重さを入力してください。",
        image: "アイテム画像を選択してください。",
        material: "素材を選択してください。",
        number: "数量を入力してください。",
        price: "値段を入力してください。",
        sale_date: "販売日時を入力してください。",
        sale_shop: "販売店舗を入力してください。",
        job: "製造店舗を選択してください。",
        effect: "回復量を入力してください。",
        effect_type: "回復する効果の種類を選択してください。",
        item_type: "アイテムの種類を選択してください。",
    }
    const [displayError, setDisplayError] = useState(false);
    const handleUpload = async () => {
        setDisplayError(true);
        if (formData.name === "") {
            window.scrollTo({ top: document.getElementById("name").getBoundingClientRect().top + window.scrollY - 75, behavior: "smooth" })
            return
        }
        if (formData.item_id === "") {
            window.scrollTo({ top: document.getElementById("item_id").getBoundingClientRect().top + window.scrollY - 75, behavior: "smooth" })
            return
        }
        if (formData.weight === "") {
            window.scrollTo({ top: document.getElementById("weight").getBoundingClientRect().top + window.scrollY - 75, behavior: "smooth" })
            return
        }
        if (formData.image === "") {
            window.scrollTo({ top: document.getElementById("image").getBoundingClientRect().top + window.scrollY - 75, behavior: "smooth" })
            return
        }
        if (formData.job === "") {
            if (!(userInfo[0].job2 === null || userInfo[0].job2 === "")) {
                window.scrollTo({ top: document.getElementById("job").getBoundingClientRect().top + window.scrollY - 75, behavior: "smooth" })
                return
            }
        }
        if (formData.is_craft === 1 && !formData.material1) {
            window.scrollTo({ top: document.getElementById("material").getBoundingClientRect().top + window.scrollY - 75, behavior: "smooth" })
            return
        }
        if (formData.is_delivery === 1 && !formData.number) {
            window.scrollTo({ top: document.getElementById("number").getBoundingClientRect().top + window.scrollY - 75, behavior: "smooth" })
            return
        }
        if ((formData.is_craft === 1 || formData.is_delivery === 1) && !formData.price) {
            window.scrollTo({ top: document.getElementById("price").getBoundingClientRect().top + window.scrollY - 75, behavior: "smooth" })
            return
        }
        if ((formData.is_craft === 1 || formData.is_delivery === 1) && !formData.sale_date) {
            window.scrollTo({ top: document.getElementById("sale_date").getBoundingClientRect().top + window.scrollY - 75, behavior: "smooth" })
            return
        }
        if ((formData.is_craft === 1 || formData.is_delivery === 1) && !formData.sale_shop) {
            window.scrollTo({ top: document.getElementById("sale_shop").getBoundingClientRect().top + window.scrollY - 75, behavior: "smooth" })
            return
        }
        if (formData.is_effect === 1 && !formData.effect_type) {
            window.scrollTo({ top: document.getElementById("effect_type").getBoundingClientRect().top + window.scrollY - 75, behavior: "smooth" })
            return
        }
        if (formData.is_effect === 1 && !formData.effect) {
            window.scrollTo({ top: document.getElementById("effect").getBoundingClientRect().top + window.scrollY - 75, behavior: "smooth" })
            return
        }
        if (formData.item_type === 1 && !formData.item_type) {
            window.scrollTo({ top: document.getElementById("item_type").getBoundingClientRect().top + window.scrollY - 75, behavior: "smooth" })
            return
        }
        const updatedFormData = {
            ...formData,
            job: formData.job ? formData.job : userInfo[0].job,
            created_by: userInfo[0].id,
        };
        setFormData(updatedFormData);
        try {
            await axios.post(`${process.env.REACT_APP_API_DOMAIN}/new_item/upload`, updatedFormData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                },
            });
            setIsUploadPerfect(true);
            setIsUploadError(false);
        } catch (error) {
            console.error('Error uploading data:', error);
            if (error.response) {
                if (error.response.status === 500) {
                    setIsUploadPerfect(false);
                    setIsUploadError(true);
                }
            }
        }
    }

    const [materials, setMaterials] = useState([]);
    useEffect(() => {
        async function fetchMaterialList() {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_DOMAIN}/new_item/get/material`, {
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

        fetchMaterialList();
    }, [token, userInfo]);

    const textareaRef = useRef(null);
    const adjustTextareaHeight = () => {
        const textarea = textareaRef.current;
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 'px';
    };

    const [previewUrl, setPreviewUrl] = useState();

    const [isUploadPerfect, setIsUploadPerfect] = useState(false);
    const [isUploadError, setIsUploadError] = useState(false);

    return (
        <>
            <Helmet
                title="新商品申請フォーム - GMC Role Play - GTA5 RPサーバー"
                meta={[
                    { name: 'description', content: 'GMC Role Playのお店オーナー用の新商品申請フォーム！' },
                    { property: 'og:url', content: 'job.gmcrp.net' },
                    { property: 'og:type', content: 'website' },
                    { property: 'og:title', content: '新商品申請フォーム - GMC Role Play - GTA5 RPサーバー' },
                    { property: 'og:description', content: 'GMC Role Playのお店オーナー用の新商品申請フォーム！' },
                    { name: 'twitter:card', content: 'summary' },
                    { name: 'twitter:title', content: '新商品申請フォーム - GMC Role Play - GTA5 RPサーバー' },
                    { name: 'twitter:description', content: 'GMC Role Playのお店オーナー用の新商品申請フォーム！' },
                ]}
            />
            <div>
                <div className="relative justify-center flex">
                    <div className="opacity-100 text-black absolute max-sm:top-12 top-28 text-center mx-4">
                        <span className="block text-4xl max-sm:text-3xl font-bold mb-1">新商品申請フォーム</span>
                        {/* <span className="block text-xl max-md:text-lg max-sm:text-base"></span>
                    <span className="block text-xl max-md:text-lg max-sm:text-base"></span> */}
                    </div>
                    <img src="/images/bg.png" alt="" className="opacity-20 h-72 max-sm:h-48 w-full object-cover"></img>
                </div>
                <Form formData={formData} handleChange={handleChange} handleUpload={handleUpload} displayError={displayError} uploadError={uploadError} materials={materials} setFormData={setFormData} adjustTextareaHeight={adjustTextareaHeight} textareaRef={textareaRef} userInfo={userInfo} previewUrl={previewUrl} setPreviewUrl={setPreviewUrl} token={token} />
                <Preview formData={formData} previewUrl={previewUrl} />
                <ActionPerfect Perfect={isUploadPerfect} onClose={() => {
                    window.location.reload()
                    setIsUploadPerfect(false)
                }} title={"Perfect"} text={"新商品の追加に成功しました。"} />
                <ActionPerfect Perfect={isUploadError} onClose={() => { setIsUploadError(false) }} title={"Error"} text={"新商品の追加に失敗しました。\nアイテムID変更しても失敗した場合は\n市役所に申請してください。"} />
            </div >
        </>
    )
}

export default NewItem