import React from 'react'
import { Helmet } from 'react-helmet'

const NewItemMeta = () => {
  return (
    <Helmet
        title="新商品申請フォーム - GMC Role Play - GTA5 RPサーバー"
        meta={[
            { name: 'description', content: 'GMC Role Playのお店オーナー用の新商品申請フォーム！' },
            { property: 'og:url', content: 'job.gmcrp.net' },
            { property: 'og:type', content: 'website' },
            { property: 'og:title', content: '新商品申請フォーム - GMC Role Play - GTA5 RPサーバー' },
            { property: 'og:description', content: 'GMC Role Playのお店オーナー用の新商品申請フォーム！' },
            { name: 'twitter:card', content: 'summary' },
            { name: 'twitter:title', content: '新商品申請フォーム - GMC Role Play - GTA5 RPサーバー' },
            { name: 'twitter:description', content: 'GMC Role Playのお店オーナー用の新商品申請フォーム！' },
        ]}
    />
  )
}

export default NewItemMeta