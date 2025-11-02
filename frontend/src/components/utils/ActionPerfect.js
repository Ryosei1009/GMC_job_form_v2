import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react'
import React, { Fragment } from 'react'

const ActionPerfect = ({ Perfect, onClose, title, text }) => {
    const breakText = () => {
        const textArray = text.split('\n');
        return textArray.map((text, index) => {
            return <p key={index}>{text}</p>
        })
    }
    return (
        <>
            <Transition appear show={Perfect} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={onClose}>
                    <TransitionChild
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black opacity-30" />
                    </TransitionChild>
                    <TransitionChild
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0">
                            <DialogPanel className={`min-w-72 border-8 ${title === "Perfect" ? "border-green-400" : title === "Error" ? "border-red-500" : ""} py-6 px-12 max-md:px-4 rounded-2xl flex flex-col items-center justify-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-main`}>
                                <div className={`text-2xl font-bold text-black ${title === "Perfect" ? "text-black" : title === "Error" ? "text-red-700" : ""}`}>
                                    {title}
                                </div>
                                <div className="text-center">
                                    {breakText()}
                                </div>
                            </DialogPanel>
                        </div>
                    </TransitionChild>
                </Dialog>
            </Transition>
        </>
    )
}

export default ActionPerfect