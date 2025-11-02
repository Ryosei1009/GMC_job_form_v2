import React from 'react'

const NotFound = () => {
    return (
        <>
            <section className="flex justify-center items-center pt-20 pb-24 text-black">
                <img className="w-1/4 mr-8" src="/images/logo.png" alt="" />
                <div className="justify-start w-2/4">
                    <h1 className="text-4xl max-md:text-3xl max-sm:text-2xl font-bold">404 Not Found</h1>
                    <p className="text-lg max-md:text-base max-sm:text-sm">ページが見つかりません</p>
                    <p className="text-lg max-md:text-base max-sm:text-sm">お探しのページは、移動または削除された可能性があります。</p>
                </div>
            </section>
        </>
    )
}

export default NotFound