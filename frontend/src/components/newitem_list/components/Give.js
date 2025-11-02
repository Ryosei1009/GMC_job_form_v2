import React from 'react'
import { CopyButton } from '../EachItem'

const Give = ({ item }) => {
    let code = `["${item.item_id}"] = {
            RemoveItems = {
                {item = "${item.item_id}", amount = 1}
            },
            AddItems = {
                {item = "${item.give_additem}", amount = ${item.give_addamount}}
            },
            emote = "${item.emote ? item.emote : ""}",
            duration = ${item.give_time * 1000},
            progressBarText = "${item.give_text}",
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

export default Give