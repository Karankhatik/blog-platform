"use client"
import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from "@/store/store";
import { setIsOpenDashboardSidebar } from '@/store/isOpenSlice';
import DashboardSideBar from '@/components/dashboard/DashboardSideBar';

const Layout = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    const dispatch = useAppDispatch();
    const isOpenDashboardSidebar = useAppSelector((state) => state.isOpen.isOpenDashboardSidebar);

    return (
        <>
            <div className="min-h-screen flex flex-col md:flex-row">
                {
                    isOpenDashboardSidebar
                        ?
                        <div className='absolute top-15 z-10 transition-transform duration-300 ease-in-out'>
                            <DashboardSideBar />
                        </div>
                        : null
                }
                {/* Main content area */}
                <div className="flex-1">
                    {children}
                </div>
            </div>
        </>
    )
}

export default Layout;
