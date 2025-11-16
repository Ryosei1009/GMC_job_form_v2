import React, { useEffect, useState } from 'react'
import { CopyButton } from '../../newitem_list/EachItem';
import GetJobName from '../../../utils/AccountUtil';
import '../../newitem_list/code.css'
import Prism from 'prismjs';
import 'prismjs/components/prism-lua';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

const EachMaterialList = ({ job, userInfo, token }) => {
    const [visible1, setVisible1] = useState(false);
    const [shopItemList, setShopItemList] = useState("");
    const [itemList, setItemList] = useState([]);
    const [shopItems, setShopItems] = useState([]);
    useEffect(() => {
        setShopItems([]);
        async function fetchNewItemList() {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_DOMAIN}/new_item_v2/get?role=${userInfo[0].role}&job=&add_status=add&whole_shop=&search=&page=&limit=3000`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                });
                const data = await response.json();
                setItemList(data);
            } catch (error) {
                console.error('Error fetching new item list:', error);
            }
        }
        async function fetchMaterials() {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_DOMAIN}/new_item_v2/get/material`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        // 'job': `${job}`,
                    }
                });
                const data = await response.json();
                setShopItems(data);
            } catch (error) {
                console.error('Error fetching new item list:', error);
            }
        }
        fetchMaterials();
        fetchNewItemList();
    }, [userInfo, token, job]);

    useEffect(() => {
        const getItemName = (item_id) => {
            const item = itemList.find((item) => item.item_id === item_id);
            return item ? item.name : '';
        };
        const updatedShopItemList = shopItems.map((item) => {
            const label = getItemName(item.material_id);
            return `                { item = "${item.material_id}", label = '${label}', price = 0 },\n`;
        }).join('');
        setShopItemList(updatedShopItemList);
    }, [shopItems, itemList]);


    useEffect(() => {
        Prism.highlightAll();
    }, [shopItemList, visible1]);
    return (
        <div>
            <p className="left-4 text-gray-600 font-bold">
                RxBlackMarkets/config.lua <span className="text-black"><GetJobName job_id={job} /></span>
            </p>
            <div className="relative">
                <CopyButton code={shopItemList} />
                <span onClick={() => setVisible1(!visible1)} className="absolute top-2 right-24 bg-[#4CAF50] rounded-md px-2 cursor-pointer">
                    <ChevronDownIcon className="h-8 w-8 fill-white inline-block" />
                </span>
                <pre className={`scroll-hidden ${!visible1 && "max-h-12"}`}>
                    <code className="language-lua pr-16">
                        {shopItemList}
                    </code>
                </pre>
            </div>
        </div>
    )
}

export default EachMaterialList