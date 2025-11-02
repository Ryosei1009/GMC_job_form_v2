import React, { useEffect, useState } from 'react'
import { CopyButton } from '../../newitem_list/EachItem';
import GetJobName from '../../../utils/AccountUtil';
import '../../newitem_list/code.css'
import Prism from 'prismjs';
import 'prismjs/components/prism-lua';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

const EachEffectList = ({ job, userInfo, token }) => {
    const [visible1, setVisible1] = useState(false);
    const [item, setItem] = useState([]);
    const [effectList, setEffectList] = useState("");

    useEffect(() => {
        setItem([]);
        if (job === "") return;
        async function fetchNewItemList() {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_DOMAIN}/new_item/get?role=${userInfo[0].role}&job=${job}&cancel=&add=`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                });
                const data = await response.json();
                setItem(data.filter(item => item.is_craft === 1));
            } catch (error) {
                console.error('Error fetching new item list:', error);
            }
        }

        fetchNewItemList();
    }, [userInfo, token, job]);

    const selectEmote = (item) => {
        switch (item.item_type) {
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
            return `stress = math.random(${item.effect}, ${item.effect}),`
        } else {
            return "stress = math.random(0, 0),"
        }
    }

    const selectHunger = (item) => {
        if(item.effect_type === "hunger") {
            return `hunger = math.random(${item.effect}, ${item.effect}),`
        } else {
            return "hunger = math.random(0, 0),"
        }
    }

    const selectThirst = (item) => {
        if(item.effect_type === "thirst") {
            return `thirst = math.random(${item.effect}, ${item.effect}),`
        } else {
            return "thirst = math.random(0, 0),"
        }
    }

    useEffect(() => {
        const updatedEffectList = item.map((item) => {
            return `["${item.item_id}"] = { emote = "${selectEmote(item)}", 	canRun = false, time = math.random(5000, 6000), ${selectStress(item)} heal = 0, armor = 0, type = "${item.item_type}", stats = { ${selectHunger(item)} ${selectThirst(item)} }},\n`;
        }).join('');
        setEffectList(updatedEffectList);
    }, [item]);


    useEffect(() => {
        Prism.highlightAll();
    }, [effectList, visible1]);
    return (
        <div>
            <p className="left-4 text-gray-600 font-bold">
                jim-consumables/config.lua <span className="text-black"><GetJobName job_id={job} /></span>
            </p>
            <div className="relative">
                <CopyButton code={effectList} />
                <span onClick={() => setVisible1(!visible1)} className="absolute top-2 right-24 bg-[#4CAF50] rounded-md px-2 cursor-pointer">
                    <ChevronDownIcon className="h-8 w-8 fill-white inline-block" />
                </span>
                <pre className={`scroll-hidden ${!visible1 && "max-h-12"}`}>
                    <code className="language-lua pr-16">
                        {effectList}
                    </code>
                </pre>
            </div>
        </div>
    )
}

export default EachEffectList