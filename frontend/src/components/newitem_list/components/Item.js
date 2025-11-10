import React from 'react'
import { CopyButton } from '../EachItem'

const Item = ({ item }) => {
    const code = `['${item.item_id}'] = { label = '${item.name}', description = '${item.description === null ? "" : item.description}${item.is_effect ? (`\\n\\n${item.effect_type === "hunger" ? "食料値" : ""}${item.effect_type === "thirst" ? "飲料値" : ""}${item.effect_type === "heal" ? "体力" : ""}${item.effect_type === "stress" ? "ストレス値" : ""} ${item.effect_amount}%`) : ""}', weight = ${item.weight * 1000}, stack = true, close = true, },`

    return (
        <div>
            <p className="left-4 text-gray-600 font-bold">
                ox_inventory/data/item.lua
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

export default Item