"use client";
import React, { useState } from "react";
import menuIcon from '@/assets/menu.svg';
import Image from "next/image";
import Link from "next/link";
import { navbarItems } from '@/data/navbarData';
import { useSelector } from "react-redux";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { setIsOpenDashboardSidebar } from '@/store/isOpenSlice';
import { usePathname } from "next/navigation";
import ProfileIcon from "./ProfileIcon";
import { RiMenuFold2Line } from "react-icons/ri";


function Navbar() {

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
    const [active, setActive] = useState<string | null>(null);
    const dispatch = useAppDispatch();
    const { authState } = useSelector((state: any) => state.auth);
    const isOpenDashboardSidebar = useAppSelector((state) => state.isOpen.isOpenDashboardSidebar);
    const pathname = usePathname()

    const { user } = useSelector((state: any) => state.auth);

    // useEffect(() => {
    //     const disableRightClick = (event: MouseEvent): void => {
    //       event.preventDefault();
    //     };

    //     const disableCertainKeys = (event: KeyboardEvent): void => {
    //       if (event.keyCode === 123 || // F12
    //           (event.ctrlKey && event.shiftKey && (event.keyCode === 73 || event.keyCode === 74)) || // Ctrl+Shift+I, Ctrl+Shift+J
    //           (event.ctrlKey && event.keyCode === 85)) { // Ctrl+U
    //         event.preventDefault();
    //       }
    //     };

    //     document.addEventListener('contextmenu', disableRightClick);
    //     document.addEventListener('keydown', disableCertainKeys);

    //     return () => {
    //       document.removeEventListener('contextmenu', disableRightClick);
    //       document.removeEventListener('keydown', disableCertainKeys);
    //     };
    //   }, []);    

    return (
        <nav className="flex h-16 items-center mx-auto  px-2 md:px-8 lg:px-8 justify-between bg-background text-white">

            <div className="flex-1 md:flex md:items-center md:gap-6">
                {
                    pathname.includes('dashboard') ? (
                        <>
                            <span className=' cursor-pointer' onClick={() => dispatch(setIsOpenDashboardSidebar(!isOpenDashboardSidebar))}>
                                <RiMenuFold2Line className="w-6 h-6" />
                            </span>

                            <Link href={'/'}>
                                <span className="hidden md:block text-typography text-lg ">TechBlog</span>
                            </Link>
                        </>
                    ) : (
                        <Link href={'/'}>
                            <span className="block text-typography text-lg ">TechBlog</span>
                        </Link>
                    )
                }
            </div>
            <div className="md:flex md:items-center md:gap-12">
                <nav aria-label="Global" className="hidden md:block">
                    <ul className="flex items-center gap-4 text-sm">
                        {navbarItems.map((item, index) => {                           
                            if ((item.label === "Login" || item.label === "Register")) {
                                if (pathname === '/articles' && !authState) {
                                    return (
                                        <li key={index}>
                                            <Link href={item.href}>
                                                <span className="text-typography-hover text-sm">{item.label}</span>
                                            </Link>
                                        </li>
                                    );
                                } else {
                                    return null;
                                }
                            } else {
                                return (                                    
                                    <li key={index}>
                                        <Link href={item.href}>
                                            <span className="text-typography-hover text-sm">{item.label}</span>
                                        </Link>
                                    </li>
                                );
                            }
                        })}

                    </ul>
                </nav>

                <div className="flex items-center gap-4">
                    {/* <ToggleThemeButton /> */}
                    {
                        authState && (
                            <ProfileIcon />
                        )
                    }

                    {/* Mobile Menu */}
                    <div className="block md:hidden">
                        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="rounded p-2 ">
                            <Image src={menuIcon} alt="menuIcon" width={45} height={45} />
                        </button>
                    </div>

                    {isMobileMenuOpen && (
                        <div className="md:hidden block absolute top-12 left-0 right-0  z-10">
                            <nav aria-label="Global">
                                <div
                                    className="absolute end-3 z-10  rounded-md border border-[#12375c] bg-background w-39 shadow-lg"
                                    role="menu"
                                >
                                    {navbarItems.map((item, index) => (
                                        (item.label === "Login" || item.label === "Register") && authState ? null : (
                                            <div key={index}>
                                                <Link href={item.href} onClick={() => setIsMobileMenuOpen(false)}>
                                                    <span className="block btn-button cursor-pointer rounded-lg px-4 py-2 text-sm text-typography-hover" role="menuitem">
                                                        {item.label}
                                                    </span>
                                                </Link>
                                            </div>
                                        )
                                    ))}
                                </div>
                            </nav>
                        </div>
                    )}
                </div>
            </div >
        </nav >
    );
}

export default Navbar;
