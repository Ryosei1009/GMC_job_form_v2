import React from 'react'
import { CopyButton } from '../EachItem'

const Effect = ({ item }) => {
    const selectEmote = (item) => {
        // v2では emote フィールドが直接設定されている場合はそれを使用
        if (item.emote) {
            return item.emote;
        }
        // v1互換性のため、item_typeに基づくデフォルト設定
        switch (item.effect_item_type || item.item_type) {
            case "food":
                return "sandwich";
            case "drink":
                return "drink";
            case "alcohol":
                return "whiskey";
            default:
                return "coke";
        }
    }

    const selectStress = (item) => {
        if(item.effect_type === "stress") {
            const amount = item.effect_amount || item.effect || 0;
            return ` stress = math.random(${amount}, ${amount}),`
        } else {
            return ""
        }
    }

    const selectHunger = (item) => {
        if(item.effect_type === "hunger") {
            const amount = item.effect_amount || item.effect || 0;
            return ` hunger = math.random(${amount}, ${amount}),`
        } else {
            return ""
        }
    }

    const selectThirst = (item) => {
        if(item.effect_type === "thirst") {
            const amount = item.effect_amount || item.effect || 0;
            return ` thirst = math.random(${amount}, ${amount}),`
        } else {
            return ""
        }
    }

    const selectHeal = (item) => {
        if(item.effect_type === "heal") {
            const amount = item.effect_amount || item.effect || 0;
            return ` heal = ${amount},`;
        } else {
            return "";
        }
    }

    // v2では effect_time を使用、v1互換性のため時間設定
    const getTime = (item) => {
        if (item.effect_time && (item.effect_time === 5 || item.effect_time === 6)) {
            return "math.random(5000, 6000)";
        }
        if (item.effect_time) {
            return `math.random(${item.effect_time * 1000}, ${item.effect_time * 1000})`;
        }
        return "math.random(5000, 6000)";
    }

    const getReward = (item) => {
        if (item.effect_grant) {
            return `, amounttogive = ${item.effect_grant_count}, rewards = {[1] = { item = "${item.effect_grant}", max = ${item.effect_grant_count}, rarity = 1, }}`;
        }
        return "";
    }

    const getRequiredItem = (item) => {
        if (item.effect_required) {
            return `requiredItem = "${item.effect_required}",`;
        }
        return "";
    }

    const getScreenEffect = (item) => {
        if (item.effect_screen) {
            return ` screen = "${item.effect_screen}",`;
        }
        return "";
    }

    const getOD = (item) => {
        if (item.effect_is_od) {
            return ` canOD = true,`;
        }
        return "";
    }

    const code = `["${item.item_id}"] = { emote = "${selectEmote(item)}", canRun = false, time = ${getTime(item)},${selectStress(item)}${selectHeal(item)} type = "${item.effect_item_type || item.item_type}", ${getRequiredItem(item)} stats = {${selectHunger(item)}${selectThirst(item)}${getScreenEffect(item)}${getOD(item)} }${getReward(item)}},`

    return (
        <div>
            <p className="left-4 text-gray-600 font-bold">
                jim-consumables/shared/consumables.lua
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

export default Effect