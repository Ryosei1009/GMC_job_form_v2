import React from 'react'
import { CopyButton } from '../EachItem'

const Craft = ({ item }) => {
    const crafts = `{
        name = '${item.item_id}',
        profession = 'cooking',
        proficiency = 0,
        chance = 100,
        amount = 1,
        price = 0,
        labor = 10,
        time = 2,
        ingredients = {${(item.craft_material1) && (`
            { name = '${item.craft_material1}', amount = 1, remove = true },`)}${(item.craft_material2) ? (`
            { name = '${item.craft_material2}', amount = 1, remove = true },`) : ""}${(item.craft_material3) ? (`
            { name = '${item.craft_material3}', amount = 1, remove = true },`) : ""}
        },
        whitelist = { '${item.job}' },
        special = '${item.job}'
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