import React from 'react'
import { CopyButton } from '../EachItem'

const Craft = ({ item }) => {
    const itemNames = `${item.item_id} = '${item.name}',`;
    const crafting = `'${item.item_id}',`;
    const crafts = `['${item.item_id}'] = {
        item = '${item.item_id}',
        amount = 1,
        maxCraft = 10,
        successCraftPercentage = 100,
        isItem = true,
        isDisassemble = false,
        time = 2,
        levelNeeded = 0,
        xpPerCraft = 2,
        recipe = {${(item.craft_material1) && (`
            {'${item.craft_material1}', 1, true, false},`)}${(item.craft_material2) ? (`
            {'${item.craft_material2}', 1, true, false},`) : ""}${(item.craft_material3) ? (`
            {'${item.craft_material3}', 1, true, false},`) : ""}
        },
        job = {
            '${item.job}',
        },
        data = {},
        category = '',
    },`;

    return (
        <div>
            <p className="left-4 text-gray-600 font-bold">
                okokCrafting/config.lua
            </p>
            <div className="relative">
                <CopyButton code={itemNames} />
                <pre>
                    <code className="language-lua pr-16">
                        {itemNames}
                    </code>
                </pre>
            </div>
            <div className="relative">
                <CopyButton code={crafting} />
                <pre>
                    <code className="language-lua pr-16">
                        {crafting}
                    </code>
                </pre>
            </div>
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