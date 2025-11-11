import React, { useEffect, useState } from 'react'
import { CopyButton } from '../../newitem_list/EachItem';
import GetJobName from '../../../utils/AccountUtil';
import '../../newitem_list/code.css'
import Prism from 'prismjs';
import 'prismjs/components/prism-lua';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

const EachItemList = ({ job, userInfo, token }) => {
    const [visible, setVisible] = useState(false);
    const [item, setItem] = useState([]);
    const [itemList, setItemList] = useState("");

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
                setItem(data);
            } catch (error) {
                console.error('Error fetching new item list:', error);
            }
        }

        fetchNewItemList();
    }, [userInfo, token, job]);

    useEffect(() => {
        const updatedItemList = item.map((item) => {
            return `['${item.item_id}'] = { label = '${item.name}', description = '${item.description === null ? "" : item.description}${item.is_effect ? (`\\n\\n${item.effect_type === "hunger" ? "食料値" : ""}${item.effect_type === "thirst" ? "飲料値" : ""}${item.effect_type === "heal" ? "体力" : ""}${item.effect_type === "stress" ? "ストレス値" : ""} ${item.effect_amount}%`) : ""}', weight = ${item.weight * 1000}, stack = true, close = true, },\n`;
        }).join('');
        setItemList(updatedItemList);
    }, [item]);


    useEffect(() => {
        Prism.highlightAll();
    }, [itemList, visible]);
    return (
        <div>
            <p className="left-4 text-gray-600 font-bold">
                ox_inventory/data/items.lua <span className="text-black"><GetJobName job_id={job} /></span>
            </p>
            <div className="relative">
                <CopyButton code={itemList} />
                <span onClick={() => setVisible(!visible)} className="absolute top-2 right-24 bg-[#4CAF50] rounded-md px-2 cursor-pointer">
                    <ChevronDownIcon className="h-8 w-8 fill-white inline-block" />
                </span>
                <pre className={`scroll-hidden ${!visible && "max-h-12"}`}>
                    <code className="language-lua pr-16">
                        {itemList}
                    </code>
                </pre>
            </div>
        </div>
    )
}

export default EachItemList