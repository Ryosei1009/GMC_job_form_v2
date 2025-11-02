import React from 'react'
import { CopyButton } from '../EachItem'

const Image = ({ item }) => {
    let code = ``

    if (item.display_type === "near") {
        code = `['${item.item_id}'] = {
        type = Config.ItemTypes.DISPLAY_NEARBY,
        image = '${item.item_id}.png',
        baseUrl = Config.BaseURLs.imagedisplay,${item.emote ? `
        emote = "${item.emote}"` : ""}
    },`
    }

    if (item.display_type === "onlyme") {
        code = `['${item.item_id}'] = {
        type = Config.ItemTypes.SIMPLE_IMAGE,
        image = '${item.item_id}.png',
        baseUrl = Config.BaseURLs.itemimage,${item.emote ? `
        emote = "${item.emote}"` : ""}
    },`
    }

    if (item.display_type === "scroll") {
        code = `['${item.item_id}'] = {
        type = Config.ItemTypes.NEWSPAPER,
        image = '${item.item_id}.png',
        baseUrl = Config.BaseURLs.itemimage_shinbun,${item.emote ? `
        emote = "${item.emote}"` : ""}
    },`
    }

    return (
        <div>
            <p className="left-4 text-gray-600 font-bold">
                gmc_utilsystem/config.lua
            </p>
            <div className="relative">
                <CopyButton item={item} code={code} />
                <pre>
                    <code className="language-lua pr-16">
                        {code}
                    </code>
                </pre>
            </div>
        </div>
    )
}

export default Image