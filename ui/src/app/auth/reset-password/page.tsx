"use client";
import React, { useState, FormEvent, ChangeEvent } from 'react';
import { toast } from 'react-toastify';
import { LoaderButton } from '@/components/ButtonComponent';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { validateForm, commonValidationRules } from "@/helpers/validation";
import { ResetPasswordEmailForm, PasswordResetForm } from "@/types/validation";
import { forgotPassword, resetPassword } from '@/services/users/user';
import PasswordInput from '@/components/inputFields/PasswordField';


interface FormErrors {
    [key: string]: string;
}

const ResetPassword = () => {
    const [email, setEmail] = useState<string>('');
    const [otp, setOtp] = useState<string>('');
    const [newPassword, setNewPassword] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [step, setStep] = useState<number>(1);
    const [errors, setErrors] = useState<FormErrors>({});
    const router = useRouter();

    const handleEmailSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData: ResetPasswordEmailForm = {
            email: email
        };
        const { isValid, errors } = await validateForm(formData, commonValidationRules);
        if (isValid) {
            setLoading(true);
            try {
                const response = await forgotPassword(email);
                if (response?.success) {
                    toast.success(response.message);
                    setLoading(false);
                    setStep(2);  
                }
            } catch {
                //toast.error("An unexpected error occurred. Please try again.");
            } finally {
                setLoading(false);
            }
        } else {
            setErrors(errors);
        }
    };

    const handlePasswordSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData: PasswordResetForm = {
            otp: otp,
            password: newPassword,
            email: email
        };
        const { isValid, errors } = await validateForm(formData, commonValidationRules); 
               
        if (isValid) {
            try {
                setLoading(true);
                const response = await resetPassword(Number(otp), newPassword, email);
                if (response?.success) {
                    toast.success(response.message);
                    router.push('/');
                    setLoading(false);
                    setEmail('');
                    setOtp('');
                    setNewPassword('');
                }
            } catch (error) {              
                // do nothing 
            } finally {
                setLoading(false);
            }
        } else {-
            setErrors(errors);

        }
    }

    const gettingPasswordValue = (password: string) => {
        setNewPassword(password);
      }

        return (
            <main className="w-full h-screen flex flex-col mt-16 items-center px-4">
                <div className="max-w-sm w-full border border-[#12375c] p-8  space-y-5 rounded-lg shadow-2xl" style={{ minHeight: '400px' }}>
                    {step === 1 ? (
                        <>
                            <div className="text-center pb-2">
                                <h3 className="text-2xl font-bold sm:text-3xl mt-5">Reset Password</h3>
                            </div>
                            <form onSubmit={handleEmailSubmit}>
                                <input
                                    placeholder="Email"
                                    name='email'
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-grey-500 bg-background"
                                    value={email}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                                />
                                {errors.email && <p className="text-red-500 text-xs mb-2">{errors.email}</p>}
                                <LoaderButton loading={loading} buttonText="Reset Password" />
                            </form>
                        </>
                    ) : (
                        <>
                            <div className="text-center pb-2">
                                <h3 className="text-2xl font-bold sm:text-3xl mt-5">Enter New Password</h3>
                            </div>
                            <form onSubmit={handlePasswordSubmit}>
                                <input
                                    type="text"
                                    placeholder="OTP"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-grey-500 bg-background"
                                    value={otp}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => setOtp(e.target.value)}
                                    maxLength={6}
                                />
                                {errors.otp && <p className="text-red-500 text-xs mb-2">{errors.otp}</p>}                               

                                <PasswordInput gettingPasswordValue={gettingPasswordValue} isPassword={true} />
                                {errors.password && <p className="text-red-500 text-xs mb-2">{errors.password}</p>}
                                <LoaderButton loading={loading} buttonText="Submit Password" />
                            </form>
                        </>
                    )}
                </div>
            </main>
        );
    };

    export default ResetPassword;
