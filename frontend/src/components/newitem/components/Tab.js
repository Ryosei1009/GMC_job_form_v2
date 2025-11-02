import React from 'react'

const Tab = ({ formData, setFormData, userInfo }) => {
    const handleChange = (value) => {
        setFormData((prevData) => ({
            ...prevData,
            created_by: userInfo[0].id,
            is_other: value === "other" ? 1 : 0,
            is_craft: value === "craft" ? 1 : 0,
            is_delivery: value === "delivery" ? 1 : 0,
        }));
    }
    return (
        <div className="border-b border-accent w-full flex justify-around mt-12 rounded-md text-base">
            <div
                className={`flex flex-col justify-center w-1/3 px-4 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-accent focus:ring-opacity-50 cursor-pointer text-center rounded-md
                    ${formData.is_craft === 1
                        ? 'bg-accent text-white'
                        : 'bg-main text-gray-700 hover:bg-[#8dd8ff]'
                    }
                `}
                onClick={() => handleChange("craft")}
            >
                <div>
                    クラフト
                </div>
            </div>
            <div
                className={`flex flex-col justify-center w-1/3 px-4 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-accent focus:ring-opacity-50 cursor-pointer text-center rounded-md
                    ${formData.is_delivery === 1
                        ? 'bg-accent text-white'
                        : 'bg-main text-gray-700 hover:bg-[#8dd8ff]'
                    }
                `}
                onClick={() => handleChange("delivery")}
            >
                <div>
                    <span className="inline-block">納品</span><span className="inline-block"><span className="inline-block">(数量限定・</span><span className="inline-block">イベント商品のみ)</span></span>
                </div>
            </div>
            <div
                className={`flex flex-col justify-center w-1/3 px-4 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-accent focus:ring-opacity-50 cursor-pointer text-center rounded-md
                    ${formData.is_other === 1
                        ? 'bg-accent text-white'
                        : 'bg-main text-gray-700 hover:bg-[#8dd8ff]'
                    }
                `}
                onClick={() => handleChange("other")}
            >
                <div>
                    その他<br />
                    <span className="inline-block">(素材や</span><span className="inline-block">使用後付与する</span><span className="inline-block">アイテムなど)</span>
                </div>
            </div>
        </div>
    )
}

export default Tab