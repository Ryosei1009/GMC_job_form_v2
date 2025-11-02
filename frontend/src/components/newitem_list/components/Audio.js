import React from 'react'
import { CopyButton } from '../EachItem'

const Audio = ({ item }) => {
    let code = `["${item.item_id}"] = {
        type = Config.ItemTypes.MUSIC_PLAYER,
        itemName = "${item.item_id}",
        mp3File = "${item.item_id}.mp3",${item.emote ? `
        emote = "${item.emote}"` : ""}
    },`

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

export default Audio