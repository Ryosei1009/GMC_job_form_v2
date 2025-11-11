import React, {useState, useEffect} from 'react'
import { CopyButton } from '../../newitem_list/EachItem'
import { ChevronDownIcon } from '@heroicons/react/20/solid';

const EachImage = ({ job, userInfo, token }) => {
    const [visible, setVisible] = useState(false);
    const [item, setItem] = useState([]);
    const [imageList, setImageList] = useState("");

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
                setItem(data.filter(item => item.is_image === 1));
            } catch (error) {
                console.error('Error fetching new item list:', error);
            }
        }

        fetchNewItemList();
    }, [userInfo, token, job]);

    useEffect(() => {
        const updatedImageList = item.map((item) => {
            return `["${item.item_id}"] = {
        type = Config.ItemTypes.MUSIC_PLAYER,
        itemName = "${item.item_id}",
        mp3File = "${item.item_id}.mp3",${item.emote ? `
        emote = "${item.emote}"` : ""}
    },\n`;
        }).join('');
        setImageList(updatedImageList);
    }, [item]);

    return (
        <div>
            <p className="left-4 text-gray-600 font-bold">
                gmc_utilsystem/config.lua
            </p>
            <div className="relative">
                <CopyButton item={item} code={imageList} />
                <span onClick={() => setVisible(!visible)} className="absolute top-2 right-24 bg-[#4CAF50] rounded-md px-2 cursor-pointer">
                    <ChevronDownIcon className="h-8 w-8 fill-white inline-block" />
                </span>
                <pre className={`scroll-hidden ${!visible && "max-h-12"}`}>
                    <code className="language-lua pr-16">
                        {imageList}
                    </code>
                </pre>
            </div>
        </div>
    )
}

export default EachImage