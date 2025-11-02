import React from 'react'
import { Helmet } from 'react-helmet'

const NewItemListMeta = () => {
  return (
    <Helmet
        title="申請済み新商品リスト - GMC Role Play - GTA5 RPサーバー"
        meta={[
            { name: 'description', content: 'GMC Role Playのお店オーナー用の申請済み新商品リスト！' },
            { property: 'og:url', content: 'job.gmcrp.net' },
            { property: 'og:type', content: 'website' },
            { property: 'og:title', content: '申請済み新商品リスト - GMC Role Play - GTA5 RPサーバー' },
            { property: 'og:description', content: 'GMC Role Playのお店オーナー用の申請済み新商品リスト！' },
            { name: 'twitter:card', content: 'summary' },
            { name: 'twitter:title', content: '申請済み新商品リスト - GMC Role Play - GTA5 RPサーバー' },
            { name: 'twitter:description', content: 'GMC Role Playのお店オーナー用の申請済み新商品リスト！' },
        ]}
    />
  )
}

export default NewItemListMeta