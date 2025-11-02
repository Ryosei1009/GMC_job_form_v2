import React, { Fragment } from 'react';
import Logout from './account/Logout';
import { Popover, PopoverButton, PopoverPanel, Transition } from '@headlessui/react';
import GetJobName, { CheckRole } from '../../utils/AccountUtil';
import { ArrowUpTrayIcon, Bars3Icon, ClipboardDocumentListIcon } from '@heroicons/react/20/solid';


const Header = ({ setToken, userInfo, token }) => {
    return (
        <>
            <header className="glass-effect sticky top-0 z-50 flex justify-between items-center h-20 w-full px-4 md:px-8 text-secondary-800 shadow-elegant">
                <div className="flex items-center">
                    <div className="flex items-center mr-8">
                        <img src="/images/logo.png" alt="GMC Logo" className="md:w-12 md:h-12 w-8 h-8 rounded-lg drop-shadow-md" />
                        <span className="ml-3 text-lg md:text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
                            GMC JobForm V2
                        </span>
                    </div>

                    <nav className="hidden md:flex items-center space-x-1">
                        {(userInfo[0].role === "admin" || userInfo[0].role === "owner" || userInfo[0].role === "check") && (
                            <>
                                <a href="/newitem/"
                                    className="px-4 py-2 rounded-lg text-secondary-700 hover:bg-primary-50 hover:text-primary-600
                                            transition-colors duration-200 font-medium">
                                    新商品申請
                                </a>
                                <a href="/newitemlist/"
                                    className="px-4 py-2 rounded-lg text-secondary-700 hover:bg-primary-50 hover:text-primary-600
                                            transition-colors duration-200 font-medium">
                                    申請リスト
                                </a>
                            </>
                        )}
                        {(userInfo[0].role === "admin") && (
                            <a href="/admin/"
                                className="px-4 py-2 rounded-lg text-secondary-700 hover:bg-primary-50 hover:text-primary-600 
                                        transition-colors duration-200 font-medium">
                                アドミンツール
                            </a>
                        )}
                    </nav>
                </div>
                <div className="flex">
                    <Popover className="block md:hidden relative">
                        {({ open }) => (
                            <>
                                <PopoverButton className={`${open ? "ring-2 ring-primary-500" : ""} 
                                                                  p-2 rounded-full hover:bg-primary-50 transition-all duration-200 
                                                                  focus:outline-none focus:ring-2 focus:ring-primary-500`}>
                                    <Bars3Icon className="w-8 max-sm:w-6" />
                                </PopoverButton>
                                <Transition
                                    as={Fragment}
                                    enter="transition ease-out duration-200"
                                    enterFrom="opacity-0 translate-y-1"
                                    enterTo="opacity-100 translate-y-0"
                                    leave="transition ease-in duration-150"
                                    leaveFrom="opacity-100 translate-y-0"
                                    leaveTo="opacity-0 translate-y-1"
                                >
                                    <PopoverPanel className="absolute right-0 z-10 mt-3 w-96 max-w-sm max-sm:w-64 max-sm:right-4 animate-slide-up">
                                        <div className="card-elegant overflow-hidden">
                                            <div className="bg-gradient-to-br from-primary-50 to-secondary-50 p-6">
                                                <div className="space-y-4 flex flex-col">
                                                    {(userInfo[0].role === "admin" || userInfo[0].role === "owner" || userInfo[0].role === "check") && (
                                                        <>
                                                            <a href="/newitem/" className="flex rounded-lg text-secondary-700 hover:bg-primary-50 hover:text-primary-600 transition-colors duration-200 font-medium">
                                                                <ArrowUpTrayIcon className="w-6" />&ensp;新商品申請
                                                            </a>
                                                            <a href="/newitemlist/" className="flex rounded-lg text-secondary-700 hover:bg-primary-50 hover:text-primary-600 transition-colors duration-200 font-medium">
                                                                <ClipboardDocumentListIcon className="w-6" />&ensp;申請リスト
                                                            </a>
                                                        </>
                                                    )}
                                                    {(userInfo[0].role === "admin") && (
                                                        <a href="/admin/" className="rounded-lg text-secondary-700 hover:bg-primary-50 hover:text-primary-600 transition-colors duration-200 font-medium">
                                                            アドミンツール
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </PopoverPanel>
                                </Transition>
                            </>
                        )}
                    </Popover>
                    <Popover className="relative">
                        {({ open }) => (
                            <>
                                <PopoverButton className={`${open ? "ring-2 ring-primary-500" : ""} 
                                                                  p-2 rounded-full hover:bg-primary-50 transition-all duration-200 
                                                                  focus:outline-none focus:ring-2 focus:ring-primary-500`}>
                                    <img className="w-12 max-sm:w-8" src="/images/account.png" alt="" />
                                </PopoverButton>
                                <Transition
                                    as={Fragment}
                                    enter="transition ease-out duration-200"
                                    enterFrom="opacity-0 translate-y-1"
                                    enterTo="opacity-100 translate-y-0"
                                    leave="transition ease-in duration-150"
                                    leaveFrom="opacity-100 translate-y-0"
                                    leaveTo="opacity-0 translate-y-1"
                                >
                                    <PopoverPanel className="absolute right-0 z-10 mt-3 w-96 max-w-sm max-sm:w-80 max-sm:right-4 animate-slide-up">
                                        <div className="card-elegant overflow-hidden">
                                            <div className="bg-gradient-to-br from-primary-50 to-secondary-50 p-6">
                                                <div className="text-center mb-6">
                                                    <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full 
                                                              flex items-center justify-center text-white font-bold text-2xl shadow-elegant mx-auto mb-3">
                                                        {userInfo[0].username.charAt(0).toUpperCase()}
                                                    </div>
                                                    <h3 className="text-xl font-bold text-secondary-800">{userInfo[0].username}</h3>
                                                    <p className="text-sm text-secondary-600">{CheckRole(userInfo[0].role)}</p>
                                                </div>

                                                <div className="space-y-4">
                                                    <div className="bg-white rounded-lg p-4 shadow-sm">
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-sm font-medium text-secondary-600">ID</span>
                                                            <span className="text-base font-bold text-secondary-800">{userInfo[0].id}</span>
                                                        </div>
                                                    </div>

                                                    <div className="bg-white rounded-lg p-4 shadow-sm">
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-sm font-medium text-secondary-600">職業</span>
                                                            <span className="text-base font-bold text-secondary-800">
                                                                <GetJobName token={token} job_id={userInfo[0].job} />
                                                                {userInfo[0].job2 && <>, <GetJobName token={token} job_id={userInfo[0].job2} /></>}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <Logout setToken={setToken} />
                                            </div>
                                        </div>
                                    </PopoverPanel>
                                </Transition>
                            </>
                        )}
                    </Popover>
                </div>
            </header>
        </>
    );
}

export default Header;
