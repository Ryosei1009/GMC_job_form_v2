import React from 'react'
import { CopyButton } from '../EachItem'

const Item = ({ item }) => {
    const code = `['${item.item_id}'] = { ['name'] = '${item.item_id}', ['image'] = '${item.item_id}.png', ['label'] = '${item.name}', ['weight'] = ${item.weight * 1000}, ['description'] = '${item.description}', ['type'] = 'item', ['unique'] = false, ['useable'] = true, ['shouldClose'] = true, ['combinable'] = nil, },`

    return (
        <div>
            <p className="left-4 text-gray-600 font-bold">
                qb-core/shared/item.lua
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