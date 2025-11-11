import React, {useState, useEffect} from 'react'
import { CopyButton } from '../../newitem_list/EachItem'
import { ChevronDownIcon } from '@heroicons/react/20/solid';

const EachGive = ({ job, userInfo, token }) => {
    const [visible, setVisible] = useState(false);
    const [item, setItem] = useState([]);
    const [giveItemList, setGiveItemList] = useState("");

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
                setItem(data.filter(item => item.is_giveitem === 1));
            } catch (error) {
                console.error('Error fetching new item list:', error);
            }
        }

        fetchNewItemList();
    }, [userInfo, token, job]);

    useEffect(() => {
        const updatedGiveItemList = item.map((item) => {
            return `["${item.item_id}"] = {
            RemoveItems = {
                {item = "${item.item_id}", amount = 1}
            },
            AddItems = {
                {item = "${item.give_additem}", amount = ${item.give_addamount}}
            },
            emote = "${item.emote ? item.emote : ""}",
            duration = ${item.give_time * 1000},
            progressBarText = "${item.give_text}",
        },\n`;
        }).join('');
        setGiveItemList(updatedGiveItemList);
    }, [item]);

    return (
        <div>
            <p className="left-4 text-gray-600 font-bold">
                gmc_item_transforms/config.lua
            </p>
            <div className="relative">
                <CopyButton item={item} code={giveItemList} />
                <span onClick={() => setVisible(!visible)} className="absolute top-2 right-24 bg-[#4CAF50] rounded-md px-2 cursor-pointer">
                    <ChevronDownIcon className="h-8 w-8 fill-white inline-block" />
                </span>
                <pre className={`scroll-hidden ${!visible && "max-h-12"}`}>
                    <code className="language-lua pr-16">
                        {giveItemList}
                    </code>
                </pre>
            </div>
        </div>
    )
}

export default EachGive