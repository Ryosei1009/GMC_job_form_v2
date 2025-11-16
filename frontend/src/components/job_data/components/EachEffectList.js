import React, { useEffect, useState } from 'react'
import { CopyButton } from '../../newitem_list/EachItem';
import GetJobName from '../../../utils/AccountUtil';
import '../../newitem_list/code.css'
import Prism from 'prismjs';
import 'prismjs/components/prism-lua';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

const EachEffectList = ({ job, userInfo, token }) => {
    const [visible, setVisible] = useState(false);
    const [item, setItem] = useState([]);
    const [effectList, setEffectList] = useState("");

    useEffect(() => {
        setItem([]);
        if (job === "") return;
        async function fetchNewItemList() {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_DOMAIN}/new_item_v2/get?role=${userInfo[0].role}&job=${job}&add_status=add&whole_shop=&search=&page=&limit=3000`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                });
                const data = await response.json();
                setItem(data.filter(item => item.is_effect === 1));
            } catch (error) {
                console.error('Error fetching new item list:', error);
            }
        }

        fetchNewItemList();
    }, [userInfo, token, job]);

    const selectEmote = (item) => {
        // v2では emote フィールドが直接設定されている場合はそれを使用
        if (item.emote) {
            return item.emote;
        }
        // v1互換性のため、item_typeに基づくデフォルト設定
        switch (item.effect_item_type || item.item_type) {
            case "food":
                return "sandwich";
            case "drink":
                return "drink";
            case "alcohol":
                return "whiskey";
            default:
                return "coke";
        }
    }
    
    const selectStress = (item) => {
        if(item.effect_type === "stress") {
            const amount = item.effect_amount || item.effect || 0;
            return ` stress = math.random(${amount}, ${amount}),`
        } else {
            return ""
        }
    }

    const selectHunger = (item) => {
        if(item.effect_type === "hunger") {
            const amount = item.effect_amount || item.effect || 0;
            return ` hunger = math.random(${amount}, ${amount}),`
        } else {
            return ""
        }
    }

    const selectThirst = (item) => {
        if(item.effect_type === "thirst") {
            const amount = item.effect_amount || item.effect || 0;
            return ` thirst = math.random(${amount}, ${amount}),`
        } else {
            return ""
        }
    }

    const selectHeal = (item) => {
        if(item.effect_type === "heal") {
            const amount = item.effect_amount || item.effect || 0;
            return ` heal = ${amount},`;
        } else {
            return "";
        }
    }

    // v2では effect_time を使用、v1互換性のため時間設定
    const getTime = (item) => {
        if (item.effect_time) {
            return `math.random(${item.effect_time * 1000}, ${item.effect_time * 1000})`;
        }
        return "math.random(5000, 6000)";
    }

    const getReward = (item) => {
        if (item.effect_grant) {
            return `, amounttogive = ${item.effect_grant_count}, rewards = {[1] = { item = "${item.effect_grant}", max = ${item.effect_grant_count}, rarity = 1, }}`;
        }
        return "";
    }

    const getRequiredItem = (item) => {
        if (item.effect_required) {
            return `requiredItem = "${item.effect_required}",`;
        }
        return "";
    }

    const getScreenEffect = (item) => {
        if (item.effect_screen) {
            return ` screen = "${item.effect_screen}",`;
        }
        return "";
    }

    const getOD = (item) => {
        if (item.effect_is_od) {
            return ` canOD = true,`;
        }
        return "";
    }

    useEffect(() => {
        const updatedEffectList = item.map((item) => {
            return `    ["${item.item_id}"] = { emote = "${selectEmote(item)}", canRun = false, time = ${getTime(item)},${selectStress(item)}${selectHeal(item)} type = "${item.effect_item_type || item.item_type}", ${getRequiredItem(item)} stats = {${selectHunger(item)}${selectThirst(item)}${getScreenEffect(item)}${getOD(item)} }${getReward(item)}},\n`;
        }).join('');
        setEffectList(updatedEffectList);
    }, [item]);


    useEffect(() => {
        Prism.highlightAll();
    }, [effectList, visible]);
    return (
        <div>
            <p className="left-4 text-gray-600 font-bold">
                jim-consumables/shared/consumables.lua <span className="text-black"><GetJobName job_id={job} /></span>
            </p>
            <div className="relative">
                <CopyButton code={effectList} />
                <span onClick={() => setVisible(!visible)} className="absolute top-2 right-24 bg-[#4CAF50] rounded-md px-2 cursor-pointer">
                    <ChevronDownIcon className="h-8 w-8 fill-white inline-block" />
                </span>
                <pre className={`scroll-hidden ${!visible && "max-h-12"}`}>
                    <code className="language-lua pr-16">
                        {effectList}
                    </code>
                </pre>
            </div>
        </div>
    )
}

export default EachEffectList