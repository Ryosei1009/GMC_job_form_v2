import React from 'react'

const Footer = () => {
    return (
        <>
            <footer className="text-sm bg-opacity-90 px-28 max-sm:px-4 bg-white border-t ">
                <div className="flex gap-4 w-full flex-wrap justify-center px-8 max-md:px-2 pt-16 pb-12 text-black border-b-2 border-gray-400">
                    <div className="flex justify-around w-5/12 max-lg:w-180 max-md:w-96">
                        <div className="w-1/2">
                            <a href="/" className="text-black flex text-base font-bold items-center mb-2">
                                <img src="/images/logo.png" alt="" className="w-8 mr-1" />GMC RP
                            </a>
                            <div className="ml-2">
                                <a className="flex items-center hover:underline text-gray-700" href="https://discord.gg/gmcrp" target="_blank" rel="noopener noreferrer">
                                    <svg className="w-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 127.14 96.36">
                                        <path className="fill-gray-700" d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z" />
                                    </svg>
                                    Discord
                                </a>
                                <a className="flex items-center hover:underline text-gray-700" href="https://x.com/GMCROLEPLAY" target="_blank" rel="noopener noreferrer">
                                    <svg className="w-5 -ml-1 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="-89.00934757 -46.8841404 643.93723344 446.8841404">
                                        <path className="fill-gray-700" d="m154.729 400c185.669 0 287.205-153.876 287.205-287.312 0-4.37-.089-8.72-.286-13.052a205.304 205.304 0 0 0 50.352-52.29c-18.087 8.044-37.55 13.458-57.968 15.899 20.841-12.501 36.84-32.278 44.389-55.852a202.42 202.42 0 0 1 -64.098 24.511c-18.42-19.628-44.644-31.904-73.682-31.904-55.744 0-100.948 45.222-100.948 100.965 0 7.925.887 15.631 2.619 23.025-83.895-4.223-158.287-44.405-208.074-105.504a100.739 100.739 0 0 0 -13.668 50.754c0 35.034 17.82 65.961 44.92 84.055a100.172 100.172 0 0 1 -45.716-12.63c-.015.424-.015.837-.015 1.29 0 48.903 34.794 89.734 80.982 98.986a101.036 101.036 0 0 1 -26.617 3.553c-6.493 0-12.821-.639-18.971-1.82 12.851 40.122 50.115 69.319 94.296 70.135-34.549 27.089-78.07 43.224-125.371 43.224a204.9 204.9 0 0 1 -24.078-1.399c44.674 28.645 97.72 45.359 154.734 45.359" />
                                    </svg>
                                    Twitter (現X)
                                </a>
                                <a className="flex items-center hover:underline text-gray-700" href="https://tebex.gmcrp.net" target="_blank" rel="noopener noreferrer">
                                    <div className="w-4 mr-1"></div>
                                    Tebex
                                </a>
                            </div>
                        </div>
                        <div className="w-1/2">
                            <div className="text-base font-bold mb-1">
                                ウェブアプリ
                            </div>
                            <div className="ml-2 flex-col flex">
                                <a href="/profile" className="text-gray-700 hover:underline">市民リスト</a>
                                <a href="/storelist" className="text-gray-700 hover:underline">店舗リスト</a>
                                <a href="/vehiclelist" className="text-gray-700 hover:underline">車両カタログ</a>
                                <a href="https://sticker2.gmcrp.net" className="text-gray-700 hover:underline">ステッカー申請フォーム v2</a>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-around w-5/12 max-lg:w-180 max-md:w-96">
                        <div className="w-1/2">
                            <div className="text-base font-bold mb-1">
                                情報
                            </div>
                            <div className="ml-2 flex-col flex">
                                <a href="https://gmc-rp.gitbook.io/docs" className="text-gray-700 hover:underline">ルール</a>
                                <a href="https://gmc-rp.gitbook.io/docs/crime/premise" className="text-gray-700 hover:underline">犯罪一覧</a>
                            </div>
                        </div>
                        <div className="w-1/2">
                            <div className="text-base font-bold mb-1">
                                新商品申請フォーム
                            </div>
                            <div className="ml-2 flex-col flex">
                                <a href="/newitem/" className="text-gray-700 hover:underline">新商品申請</a>
                                <a href="/newitemlist/" className="text-gray-700 hover:underline">申請リスト</a>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex justify-between max-lg:items-center max-lg:flex-col-reverse px-16 max-md:px-4 py-4 text-sm text-gray-700">
                    <div>
                        ©️{new Date().getFullYear()} GMCRP
                    </div>
                </div>
            </footer>
        </>
    )
}

export default Footer