"use client";
import React, { useState } from "react";

import menuIcon from '@/assets/menu.svg';
import Image from "next/image";
import Link from "next/link";
import { navbarItems } from '@/data/navbarData';
import DropUpIcon from '@/assets/up-arrow.svg';
import DropDownIcon from '@/assets/down-arrow.svg';
import ToggleThemeButton from "@/components/ToggleThemeButton";
import { logout } from "@/services/commonAPIs/commonApis";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useRouter } from 'next/navigation';
import { setAuthState } from "@/store/authSlice";
import { useDispatch } from "react-redux";

function Navbar() {

    const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState<boolean>(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
    const [active, setActive] = useState<string | null>(null);
    const router = useRouter();
    const { authState } = useSelector((state: any) => state.auth);
    const dispatch = useDispatch();

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

    const handleLogout = async () => {
        const response = await logout();        
        if (response.success) {
            dispatch(setAuthState(false));
            router.push('/auth/login');
            toast.success(response.message);
        }
    }



    return (
        <nav className="flex h-16 items-center justify-between ">

            <div className="flex-1 md:flex md:items-center md:gap-12">
                <Link href={'/'}>
                    <span className="block text-typography text-lg">Intake Learn</span>
                </Link>
            </div>
            <div className="md:flex md:items-center md:gap-12">
                <nav aria-label="Global" className="hidden md:block">
                    <ul className="flex items-center gap-4 text-sm">
                        {navbarItems.map((item, index) =>
                            (item.label === "Login" || item.label === "Register") && authState ? null : (
                                <li key={index}>
                                    <Link href={item.href}>
                                        <span className="text-typography-hover text-sm">{item.label}</span>
                                    </Link>
                                </li>
                            )
                        )}
                        {
                            authState &&
                            <li>
                                <button className="text-typography-hover text-sm" onClick={() => handleLogout()}>logout</button>
                            </li>
                        }

                    </ul>
                </nav>

                <div className="flex items-center gap-4">
                    <ToggleThemeButton />
                    {/* Mobile Menu */}
                    <div className="block md:hidden">
                        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="rounded p-2 ">
                            <Image src={menuIcon} alt="menuIcon" width={45} height={45} />
                        </button>
                    </div>

                    {isMobileMenuOpen && (
                        <div className="md:hidden block absolute top-16 left-0 right-0  z-10">
                            <nav aria-label="Global">
                                <div
                                    className="absolute end-3 z-10 mt-2 rounded-lg border border-borderColor bg-primary w-39 shadow-lg"
                                    role="menu"
                                >
                                    {navbarItems.map((item, index) => (
                                        <div key={index}>
                                            {item.subMenu ? (
                                                <div className="relative">
                                                    <div onClick={() => setIsCompanyDropdownOpen(!isCompanyDropdownOpen)} className="flex cursor-pointer rounded-lg px-4 py-2 text-sm text-typography-hover" role="menuitem">
                                                        <span role="menuitem"> Company </span>
                                                        <span className='mt'>
                                                            {isCompanyDropdownOpen ? <Image src={DropUpIcon} alt="DropUpIcon" /> : <Image src={DropDownIcon} alt="DropDownIcon" />}
                                                        </span>
                                                    </div>
                                                    {isCompanyDropdownOpen && (
                                                        <div className="ml-2">
                                                            {item.subMenu.map((subItem, subIndex) => (
                                                                <Link key={subIndex} href={subItem.href} onClick={() => setIsMobileMenuOpen(false)}>
                                                                    <span className="block px-4 py-2 text-sm text-typography-hover" role="menuitem">
                                                                        {subItem.label}
                                                                    </span>
                                                                </Link>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            ) :
                                                <Link href={item.href} onClick={() => setIsMobileMenuOpen(false)}>
                                                    <span className="block btn-button cursor-pointer rounded-lg px-4 py-2 text-sm text-typography-hover" role="menuitem">
                                                        {item.label}
                                                    </span>
                                                </Link>
                                            }
                                        </div>
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
