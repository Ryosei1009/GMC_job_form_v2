import React from 'react'
import { CopyButton } from '../EachItem'

const Material = ({ item }) => {
    const code = `{ item = "${item.item_id}", label = '${item.name}', price = 0 },`
    const itemNames = `${item.item_id} = '${item.name}',`;
    return (
        <>
            <div>
                <p className="left-4 text-gray-600 font-bold">
                    RxBlackMarkets/config.lua <span className="text-black">{item.job}</span>
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
            <div>
                <p className="left-4 text-gray-600 font-bold">
                    okokCrafting/config.lua <span className="text-black">{item.job}</span>
                </p>
                <div className="relative">
                    <CopyButton item={item} code={itemNames} />
                    <pre>
                        <code className="language-lua pr-16">
                            {itemNames}
                        </code>
                    </pre>
                </div>
            </div>
        </>
    )
}

export default Material