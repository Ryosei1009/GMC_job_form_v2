import React, { useEffect, useState } from 'react'
import { CopyButton } from '../../newitem_list/EachItem';
import GetJobName from '../../../utils/AccountUtil';
import '../../newitem_list/code.css'
import Prism from 'prismjs';
import 'prismjs/components/prism-lua';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

const EachCraftList = ({ job, userInfo, token }) => {
    const [visible1, setVisible1] = useState(false);
    const [visible2, setVisible2] = useState(false);
    const [visible3, setVisible3] = useState(false);
    const [item, setItem] = useState([]);
    const [itemList, setItemList] = useState("");
    const [craftTable, setCraftTable] = useState("");
    const [craftList, setCraftList] = useState("");

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

    useEffect(() => {
        const updatedItemList = item.map((item) => {
            return `${item.item_id} = '${item.name}',\n`;
        }).join('');
        setItemList(updatedItemList);

        const updatedCraftTable = item.map((item) => {
            return `'${item.item_id}',\n`;
        }).join('');
        setCraftTable(updatedCraftTable);

        const updatedCraftList = item.map((item) => {
            return `['${item.item_id}'] = {
    item = '${item.item_id}',
    amount = 1,
    maxCraft = 10,
    successCraftPercentage = 100,
    isItem = true,
    isDisassemble = false,
    time = 2,
    levelNeeded = 0,
    xpPerCraft = 2,
    recipe = {${item.material1 && (`
        {'${item.material1}', 1, true, false},`)}${item.material2 && (`
        {'${item.material2}', 1, true, false},`)}${item.material3 && (`
        {'${item.material3}', 1, true, false},`)}
    },
    job = {
        '${item.job}',
    },
    data = {},
    category = '',
},\n`;
        }).join('');
        setCraftList(updatedCraftList);
    }, [item]);


    useEffect(() => {
        Prism.highlightAll();
    }, [itemList, craftTable, craftList, visible1, visible2, visible3]);
    return (
        <div>
            <p className="left-4 text-gray-600 font-bold">
                okokCrafting/config.lua <span className="text-black"><GetJobName job_id={job} /></span>
            </p>
            <div className="relative">
                <CopyButton code={itemList} />
                <span onClick={() => setVisible1(!visible1)} className="absolute top-2 right-24 bg-[#4CAF50] rounded-md px-2 cursor-pointer">
                    <ChevronDownIcon className="h-8 w-8 fill-white inline-block" />
                </span>
                <pre className={`scroll-hidden ${!visible1 && "max-h-12"}`}>
                    <code className="language-lua pr-16">
                        {itemList}
                    </code>
                </pre>
            </div>
            <div className="relative">
                <CopyButton code={craftTable} />
                <span onClick={() => setVisible2(!visible2)} className="absolute top-2 right-24 bg-[#4CAF50] rounded-md px-2 cursor-pointer">
                    <ChevronDownIcon className="h-8 w-8 fill-white inline-block" />
                </span>
                <pre className={`scroll-hidden ${!visible2 && "max-h-12"}`}>
                    <code className="language-lua pr-16">
                        {craftTable}
                    </code>
                </pre>
            </div>
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