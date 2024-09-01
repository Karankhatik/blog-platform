"use client"
import React from 'react';
import Link from 'next/link';
import { FaRegUser } from "react-icons/fa";
import { GrArticle } from "react-icons/gr";
import { RxDashboard } from "react-icons/rx";
import { usePathname } from 'next/navigation';

const DashboardSideBar = () => {

    const pathname = usePathname();



    return (
        <div className="min-h-screen flex flex-col flex-auto flex-shrink-0 bg-gray-50 text-gray-800">
            <div className="flex flex-col left-0 w-64 bg-white h-full ">

                <div className="">
                    <ul className="flex flex-col py-4 space-y-1">
                        <li className="px-5">
                            <div className="flex flex-row items-center h-8">
                                <div className="text-sm font-light tracking-wide text-gray-500">Menu</div>
                            </div>
                        </li>
                        <li>
                            <Link href="/dashboard" className={`relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent ${pathname === "/dashboard" ? "border-indigo-500" : ""}  hover:border-indigo-500 pr-6`}>
                                <span className="inline-flex justify-center items-center ml-4">
                                    <RxDashboard />
                                </span>
                                <span className="ml-2 text-sm tracking-wide truncate">Dashboard</span>
                            </Link>
                        </li>
                        <li>
                            <Link href="/dashboard/users" className={`relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent ${pathname === "/dashboard/users" ? "border-indigo-500" : ""}  hover:border-indigo-500 pr-6`}>
                                <span className="inline-flex justify-center items-center ml-4">
                                    <FaRegUser />
                                </span>
                                <span className="ml-2 text-sm tracking-wide truncate">Users</span>
                                <span className="px-2 py-0.5 ml-auto text-xs font-medium tracking-wide text-indigo-500 bg-indigo-50 rounded-full">New</span>
                            </Link>
                        </li>
                        <li>
                            <Link href="/dashboard/articles" className={`relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent ${pathname === "/dashboard/articles" ? "border-indigo-500" : ""}  hover:border-indigo-500 pr-6`}>
                                <span className="inline-flex justify-center items-center ml-4">
                                    <GrArticle />
                                </span>
                                <span className="ml-2 text-sm tracking-wide truncate">Articles</span>
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default DashboardSideBar