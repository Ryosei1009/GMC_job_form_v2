import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios';
import FormV2 from './components/FormV2';
import PreviewV2 from './components/PreviewV2';
import ActionPerfect from '../utils/ActionPerfect';
import ErrorModal from '../utils/ErrorModal';
import { Helmet } from 'react-helmet';

const NewItemV2 = ({ userInfo, token }) => {
    const [formData, setFormData] = useState({
        // 基本情報
        item_id: "",
        name: "",
        description: "",
        weight: "0.1",
        emote: "",

        // 素材・クラフト関連
        is_material: 0,
        is_craft: 0,
        craft_material1: "",
        craft_material2: "",
        craft_material3: "",

        // アイテムタイプ（排他的選択）
        item_type: "", // "effect", "image", "audio", "giveitem" のいずれか一つ

        // 効果アイテム関連
        is_effect: 0,
        effect_item_type: "",
        effect_grant: "",
        effect_grant_count: "",
        effect_time: "",
        effect_type: "",
        effect_amount: "",
        effect_screen: "",
        effect_required: "",
        effect_is_od: 0,

        // 画像表示関連
        is_image: 0,
        display_type: "",

        // 音楽再生関連
        is_audio: 0,

        // アイテム付与関連
        is_giveitem: 0,
        give_additem: "",
        give_addamount: "",
        give_time: "",
        give_text: "",

        // 卸売関連
        is_wholesale: 0,
        whole_price: "",
        whole_shop: "",

        // 販売関連
        sale_date: "",
        price: "",
        other: "",

        // システム情報
        job: "",
        created_by: userInfo[0].id,
    });

    // ファイル管理
    const [files, setFiles] = useState({
        basic_image: null,
        display_image: null,
        audio_file: null
    });

    // プレビュー用URL管理
    const [previewUrls, setPreviewUrls] = useState({
        display_image: null,
        audio_file: null
    });

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            created_by: userInfo[0].id,
            [name]: type === 'checkbox' ? (checked ? 1 : 0) : value,
        }));
    };

    const handleMaterialCraftChange = (event) => {
        if (event.target.value === "material") {
            setFormData((prevData) => ({
                ...prevData,
                created_by: userInfo[0].id,
                is_material: 1,
                is_craft: 0,
            }));
        }
        if (event.target.value === "craft") {
            setFormData((prevData) => ({
                ...prevData,
                created_by: userInfo[0].id,
                is_material: 0,
                is_craft: 1,
            }));
        }
        if (event.target.value === "") {
            setFormData((prevData) => ({
                ...prevData,
                created_by: userInfo[0].id,
                is_material: 0,
                is_craft: 0,
            }));
        }
    };

    // アイテムタイプ選択ハンドラー（排他的選択）
    const handleItemTypeChange = (type) => {
        setFormData((prevData) => ({
            ...prevData,
            item_type: type,
            is_effect: type === "effect" ? 1 : 0,
            is_image: type === "image" ? 1 : 0,
            is_audio: type === "audio" ? 1 : 0,
            is_giveitem: type === "giveitem" ? 1 : 0,
        }));
    };

    // ファイル選択ハンドラー
    const handleFileChange = (fieldName, file) => {
        setFiles(prev => ({
            ...prev,
            [fieldName]: file
        }));

        // プレビューURL生成
        if (file && (fieldName === 'display_image' || fieldName === 'audio_file')) {
            // 既存のプレビューURLを破棄
            if (previewUrls[fieldName]) {
                URL.revokeObjectURL(previewUrls[fieldName]);
            }

            // 新しいプレビューURL生成
            const newPreviewUrl = URL.createObjectURL(file);
            setPreviewUrls(prev => ({
                ...prev,
                [fieldName]: newPreviewUrl
            }));
        }
    };

    const uploadError = {
        name: "アイテム名を入力してください。",
        item_id: "アイテムIDを入力してください。",
        weight: "アイテムの重さを入力してください。",
        basic_image: "基本画像を選択してください。",
        craft_material1: "素材を選択してください。",
        effect_item_type: "アイテムタイプを選択してください。",
        effect_time: "使用時間を入力してください。",
        effect_type: "回復効果の種類を選択してください。",
        effect_amount: "回復量を入力してください。",
        effect_grant_count: "付与個数を入力してください。",
        display_type: "画像表示タイプを選択してください。",
        display_image: "表示画像を選択してください。",
        audio_file: "音楽ファイルを選択してください。",
        give_addamount: "付与個数を入力してください。",
        give_time: "付与時間を入力してください。",
        give_text: "付与テキストを入力してください。",
        whole_price: "卸売価格を入力してください。",
        whole_shop: "卸売店舗を入力してください。",
        sale_date: "販売日時を入力してください。",
        craftmaterial: "素材かクラフトを選択してください。",
        price: "値段を入力してください。",
        job: "製造店舗を選択してください。",
    };

    const [displayError, setDisplayError] = useState(false);

    // バリデーション関数
    const validateForm = () => {
        const errors = [];

        // 基本情報のバリデーション
        if (!formData.name) errors.push("name");
        if (!formData.item_id) errors.push("item_id");
        if (!formData.weight) errors.push("weight");
        if (!files.basic_image) errors.push("basic_image");
        if (!formData.price) errors.push("price");
        if (!formData.sale_date) errors.push("sale_date");
        if (!formData.is_craft && !formData.is_material) errors.push("craftmaterial");
        if (!formData.job && !(userInfo[0].job2 === null || userInfo[0].job2 === "")) {
            errors.push("job");
        }

        // クラフトアイテムのバリデーション
        if (formData.is_craft === 1 && !formData.craft_material1) {
            errors.push("craft_material1");
        }

        // 効果アイテムのバリデーション
        if (formData.item_type === "effect") {
            if (!formData.effect_item_type) errors.push("effect_item_type");
            if (!formData.effect_time) errors.push("effect_time");
            if (formData.effect_type && !formData.effect_amount) errors.push("effect_amount");
            if (formData.effect_grant && !formData.effect_grant_count) errors.push("effect_grant_count");
        }

        // 画像表示アイテムのバリデーション
        if (formData.item_type === "image") {
            if (!formData.display_type) errors.push("display_type");
            if (!files.display_image) errors.push("display_image");
        }

        // 音楽再生アイテムのバリデーション
        if (formData.item_type === "audio") {
            if (!files.audio_file) errors.push("audio_file");
        }

        // アイテム付与のバリデーション
        if (formData.item_type === "giveitem") {
            if (formData.give_additem && !formData.give_addamount) errors.push("give_addamount");
            if (!formData.give_time) errors.push("give_time");
            if (!formData.give_text) errors.push("give_text");
        }

        // 卸売のバリデーション
        if (formData.is_wholesale === 1) {
            if (!formData.whole_price) errors.push("whole_price");
            if (!formData.whole_shop) errors.push("whole_shop");
        }

        return errors;
    };

    const scrollToError = (errorField) => {
        const element = document.getElementById(errorField);
        if (element) {
            window.scrollTo({
                top: element.getBoundingClientRect().top + window.scrollY - 75,
                behavior: "smooth"
            });
        }
    };

    const handleUpload = async () => {
        setDisplayError(true);

        const errors = validateForm();
        if (errors.length > 0) {
            scrollToError(errors[0]);
            return;
        }

        const uploadFormData = new FormData();

        // フォームデータを追加
        Object.keys(formData).forEach(key => {
            const value = formData[key];
            if (value !== null && value !== undefined && value !== "") {
                uploadFormData.append(key, value);
            }
        });

        // ジョブ情報の設定
        const jobValue = formData.job ? formData.job : userInfo[0].job;
        uploadFormData.set('job', jobValue);
        uploadFormData.set('created_by', userInfo[0].id);

        // ファイルを追加
        if (files.basic_image) {
            uploadFormData.append('basic_image', files.basic_image);
        }
        if (files.display_image) {
            uploadFormData.append('display_image', files.display_image);
        }
        if (files.audio_file) {
            uploadFormData.append('audio_file', files.audio_file);
        }

        try {
            await axios.post(`${process.env.REACT_APP_API_DOMAIN}/new_item_v2/upload`, uploadFormData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                },
            });
            setIsUploadPerfect(true);
            setIsUploadError(false);
        } catch (error) {
            console.error('Error uploading data:', error);

            let errorTitle = "申請エラー";
            let errorMessage = "新商品の申請中にエラーが発生しました。";
            let errorDetails = "";

            if (error.response) {
                const status = error.response.status;
                const responseData = error.response.data;

                switch (status) {
                    case 400:
                        errorTitle = "入力エラー";
                        errorMessage = "入力内容に問題があります。";
                        errorDetails = typeof responseData === 'string' ? responseData : JSON.stringify(responseData);
                        break;
                    case 401:
                        errorTitle = "認証エラー";
                        errorMessage = "認証に失敗しました。再ログインしてください。";
                        break;
                    case 413:
                        errorTitle = "ファイルサイズエラー";
                        errorMessage = "アップロードファイルのサイズが大きすぎます。";
                        break;
                    case 500:
                        errorTitle = "サーバーエラー";
                        errorMessage = "サーバー内部でエラーが発生しました。しばらく待ってからもう一度お試しください。";
                        break;
                    default:
                        errorDetails = `ステータスコード: ${status}\n${typeof responseData === 'string' ? responseData : JSON.stringify(responseData)}`;
                }
            } else if (error.request) {
                errorTitle = "通信エラー";
                errorMessage = "サーバーとの通信に失敗しました。インターネット接続を確認してください。";
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
    };

    const [materials, setMaterials] = useState([]);
    useEffect(() => {
        async function fetchMaterialList() {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_DOMAIN}/new_item_v2/get/material`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }

                const data = await response.json();
                setMaterials(data);
            } catch (error) {
                console.error('Error fetching material list:', error);
                setErrorModal({
                    isOpen: true,
                    title: "データ取得エラー",
                    message: "素材リストの取得に失敗しました。",
                    details: error.message
                });
            }
        }

        fetchMaterialList();
    }, [token, userInfo]);

    // コンポーネントアンマウント時にプレビューURLをクリーンアップ
    useEffect(() => {
        return () => {
            Object.values(previewUrls).forEach(url => {
                if (url) {
                    URL.revokeObjectURL(url);
                }
            });
        };
    }, [previewUrls]);

    const textareaRef = useRef(null);
    const adjustTextareaHeight = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = textarea.scrollHeight + 'px';
        }
    };

    const [previewUrl, setPreviewUrl] = useState();
    const [isUploadPerfect, setIsUploadPerfect] = useState(false);
    const [isUploadError, setIsUploadError] = useState(false);

    // エラーモーダル用の状態
    const [errorModal, setErrorModal] = useState({
        isOpen: false,
        title: '',
        message: '',
        details: ''
    });

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
            <div className="min-h-screen">
                <div className="relative justify-center flex">
                    <div className="opacity-100 text-black absolute max-sm:top-12 top-28 text-center mx-4">
                        <span className="block text-4xl max-sm:text-3xl font-bold mb-1">新商品申請フォーム</span>
                    </div>
                    <img src="/images/bg.png" alt="" className="opacity-20 h-72 max-sm:h-48 w-full object-cover"></img>
                </div>
                <FormV2
                    formData={formData}
                    handleChange={handleChange}
                    handleMaterialCraftChange={handleMaterialCraftChange}
                    handleItemTypeChange={handleItemTypeChange}
                    handleFileChange={handleFileChange}
                    handleUpload={handleUpload}
                    displayError={displayError}
                    uploadError={uploadError}
                    materials={materials}
                    setFormData={setFormData}
                    adjustTextareaHeight={adjustTextareaHeight}
                    textareaRef={textareaRef}
                    userInfo={userInfo}
                    previewUrl={previewUrl}
                    setPreviewUrl={setPreviewUrl}
                    files={files}
                    previewUrls={previewUrls}
                    token={token}
                />
                <PreviewV2 formData={formData} previewUrl={previewUrl} files={files} />
                <ActionPerfect
                    Perfect={isUploadPerfect}
                    onClose={() => {
                        window.location.reload()
                        setIsUploadPerfect(false)
                    }}
                    title={"Perfect"}
                    text={"新商品の申請に成功しました。"}
                />
                <ActionPerfect
                    Perfect={isUploadError}
                    onClose={() => { setIsUploadError(false) }}
                    title={"Error"}
                    text={"新商品の申請に失敗しました。\nアイテムID変更しても失敗した場合は\n市役所に申請してください。"}
                />

                {/* エラーモーダル */}
                <ErrorModal
                    isOpen={errorModal.isOpen}
                    onClose={() => setErrorModal({ ...errorModal, isOpen: false })}
                    title={errorModal.title}
                    message={errorModal.message}
                    details={errorModal.details}
                />
            </div >
        </>
    )
}

export default NewItemV2