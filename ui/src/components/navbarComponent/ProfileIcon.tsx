"use client";
import { useState } from 'react';
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "@/services/commonAPIs/commonApis";
import { setAuthState, setUser } from "@/store/authSlice";
import { useRouter } from 'next/navigation';
import Toast from '@/helpers/toasters';

const ProfileIcon = () => {

    const { user } = useSelector((state: any) => state.auth);

    const dispatch = useDispatch();
    const router = useRouter();
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState<boolean>(false);

    const handleLogout = async () => {
        const response = await logout();
        if (response.success) {
            dispatch(setAuthState(false));
            dispatch(setUser(null));
            setIsProfileMenuOpen(false)
            localStorage.clear();
            router.push('/auth/login');
            Toast.successToast({ message: response.message, autoClose: 1000, position: 'top-right' });
        }
    }

    return (
        <>
            <span onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} className="cursor-pointer profile-icon w-9 h-9 text-white bg-zinc-800 rounded-full flex items-center justify-center">{user.name ? user?.name?.charAt(0).toUpperCase() : 'I'}</span>

            {
                isProfileMenuOpen && (
                    <div className="absolute w-64 top-10 z-10">
                        <div
                            className="absolute  z-10 mt-5 rounded-lg border border-borderColor bg-primary w-39 shadow-lg" role="menu"
                        >
                            <div>
                                <Link href={'/profile'} onClick={() => setIsProfileMenuOpen(false)}>
                                    <span className="block btn-button cursor-pointer rounded-lg px-4 py-2 text-sm text-typography-hover" role="menuitem">
                                        Profile
                                    </span>
                                </Link>
                            </div>
                            <div>
                                <span onClick={() => handleLogout()} className="block btn-button cursor-pointer rounded-lg px-4 py-2 text-sm text-typography-hover" role="menuitem">
                                    Logout
                                </span>
                            </div>
                        </div>
                    </div>

                )
            }
        </>
    )
}

export default ProfileIcon