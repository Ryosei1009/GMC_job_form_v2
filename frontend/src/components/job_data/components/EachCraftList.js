import React, { useEffect, useState } from 'react'
import { CopyButton } from '../../newitem_list/EachItem';
import GetJobName from '../../../utils/AccountUtil';
import '../../newitem_list/code.css'
import Prism from 'prismjs';
import 'prismjs/components/prism-lua';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

const EachCraftList = ({ job, userInfo, token }) => {
    const [visible3, setVisible3] = useState(false);
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
            return `${item.item_id} = {
            labor = 0,
            ingredients = {${(item.craft_material1) && (`
                ${item.craft_material1} = 1,`)}${(item.craft_material2) ? (`
                ${item.craft_material2} = 1,`) : ""}${(item.craft_material3) ? (`
                ${item.craft_material3} = 1,`) : ""}
            },
            time = 2,
            amount = 1,
            proficiency = 0,
            price = 0,
            excluding = { '${item.job}' },
        },`;
        }).join('');
        setCraftList(updatedCraftList);
    }, [item]);


    useEffect(() => {
        Prism.highlightAll();
    }, [craftList, visible3]);
    return (
        <div>
            <p className="left-4 text-gray-600 font-bold">
                okokCrafting/config.lua <span className="text-black"><GetJobName job_id={job} /></span>
            </p>
            <div className="relative">
                <CopyButton code={craftList} />
                <span onClick={() => setVisible3(!visible3)} className="absolute top-2 right-24 bg-[#4CAF50] rounded-md px-2 cursor-pointer">
                    <ChevronDownIcon className="h-8 w-8 fill-white inline-block" />
                </span>
                <pre className={`scroll-hidden ${!visible3 && "max-h-12"}`}>
                    <code className="language-lua pr-16">
                        {craftList}
                    </code>
                </pre>
            </div>
        </div>
    )
}

export default EachCraftList