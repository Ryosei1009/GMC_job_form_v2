import React, { useEffect, useState } from 'react'
import { CopyButton } from '../../newitem_list/EachItem';
import GetJobName from '../../../utils/AccountUtil';
import '../../newitem_list/code.css'
import Prism from 'prismjs';
import 'prismjs/components/prism-lua';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

const EachCraftList = ({ job, userInfo, token }) => {
    const [visible, setVisible] = useState(false);
    const [item, setItem] = useState([]);
    const [craftList, setCraftList] = useState("");

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
                setItem(data.filter(item => item.is_craft === 1));
            } catch (error) {
                console.error('Error fetching new item list:', error);
            }
        }

        fetchNewItemList();
    }, [userInfo, token, job]);

    useEffect(() => {
        const updatedCraftList = item.map((item) => {
            return `    {
        name = '${item.item_id}',
        profession = 'cooking',
        proficiency = 0,
        chance = 100,
        amount = 1,
        price = 0,
        labor = 10,
        time = 2,
        ingredients = {${(item.craft_material1) && (`
            { name = '${item.craft_material1}', amount = 1, remove = true },`)}${(item.craft_material2) ? (`
            { name = '${item.craft_material2}', amount = 1, remove = true },`) : ""}${(item.craft_material3) ? (`
            { name = '${item.craft_material3}', amount = 1, remove = true },`) : ""}
        },
        whitelist = { '${item.job}' },
        special = '${item.job}'
    },\n`;
        }).join('');
        setCraftList(updatedCraftList);
    }, [item]);


    useEffect(() => {
        Prism.highlightAll();
    }, [craftList, visible]);
    return (
        <div>
            <p className="left-4 text-gray-600 font-bold">
                eco_crafting/config/craftdata.lua <span className="text-black"><GetJobName job_id={job} /></span>
            </p>
            <div className="relative">
                <CopyButton code={craftList} />
                <span onClick={() => setVisible(!visible)} className="absolute top-2 right-24 bg-[#4CAF50] rounded-md px-2 cursor-pointer">
                    <ChevronDownIcon className="h-8 w-8 fill-white inline-block" />
                </span>
                <pre className={`scroll-hidden ${!visible && "max-h-12"}`}>
                    <code className="language-lua pr-16">
                        {craftList}
                    </code>
                </pre>
            </div>
        </div>
    )
}

export default EachCraftList