import React from 'react'

const Forbidden = () => {
  return (
    <>
        <section className="flex justify-center items-center pt-20 pb-24 text-black">
            <img className="w-1/4 mr-8" src="/images/logo.png" alt="" />
            <div className="justify-start w-2/4">
                <h1 className="text-4xl max-md:text-3xl max-sm:text-2xl font-bold">403 Forbidden</h1>
                <p className="text-lg max-md:text-base max-sm:text-sm">権限の付与がされていません。</p>
                <p className="text-lg max-md:text-base max-sm:text-sm">お店のオーナー/副オーナーの場合はJOBS Discordから申請してください。</p>
            </div>
        </section>
    </>
  )
}

export default Forbidden