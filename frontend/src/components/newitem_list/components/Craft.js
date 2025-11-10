import React from 'react'
import { CopyButton } from '../EachItem'

const Craft = ({ item }) => {
    const crafts = `${item.item_id} = {
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

    return (
        <div>
            <p className="left-4 text-gray-600 font-bold">
                eco_crafting/config/craftdata.lua
            </p>
            <div className="relative">
                <CopyButton code={crafts} />
                <pre>
                    <code className="language-lua pr-16">
                        {crafts}
                    </code>
                </pre>
            </div>
        </div>
    )
}

export default Craft