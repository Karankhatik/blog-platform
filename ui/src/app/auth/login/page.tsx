"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import googleIconSvg from '@/assets/icons/googleIcon.svg'
import Link from 'next/link';
import { commonValidationRules, validateForm } from '@/helpers/validation';
import { LoginForm } from "@/types/validation";
import { useRouter, useSearchParams } from 'next/navigation';

import { LoaderButton } from '@/components/Buttons';
import { useAppDispatch } from "@/store/store";
import { setAuthState } from "@/store/authSlice";
import {toast} from 'react-toastify';
import { Suspense } from 'react';
import { login } from '@/services/commonAPIs/commonApis'; 



type FormErrors = { [key: string]: string };

const LoginWithoutSuspense = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  const router = useRouter();

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  async function handleLogin(formData: LoginForm) {
    const { isValid, errors } = await validateForm(formData, commonValidationRules);
    try {
      setLoading(true);
      if (isValid) {
        const response = await login(formData);             
        if (response.success) {
          toast.success(response.message);
          router.push('/');
          dispatch(setAuthState(true));
          setEmail('');
          setPassword('');      
        } else {         
          setErrors(errors);
        }
      } else {
        setErrors(errors);
      }
    } catch (error) {
      //toast.error("An unexpected error occurred. Please try again.");
      setErrors(errors);
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    setErrors({});
    const formData: LoginForm = {
      email: email.trim().toLowerCase(),
      password: password,
    }
    handleLogin(formData);
  };


//   const loginWithGogle = () => {
//     signIn("google", {
//       callbackUrl: callbackUrl || DEFAULT_LOGIN_REDIRECT,
//     });
//   }

  return (
    <main className="w-full mt-10 flex flex-col items-center justify-center px-4 ">
      <div className="max-w-sm w-full border border-gray-300 p-8 text-gray-600 space-y-5 rounded-lg border-black shadow-2xl shadow-gray-400" style={{ minHeight: '500px' }}>       <div className="text-center pb-2">
        <div className="mt-5">
          <h3 className="text-gray-800 text-2xl font-bold sm:text-3xl">Login to your account</h3>
        </div>
      </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <input
              placeholder="Email"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && <p className="text-red-500  text-xs">{errors.email}</p>}
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker mt-3"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
          </div>
          <div className="flex items-center justify-between text-sm">
            <Link href="/auth/reset-password" className="text-center text-black hover:text-orange-500">Forgot password?</Link>
          </div>
          <LoaderButton loading={loading} buttonText="continue" />
        </form>
        {/* <div className="flex flex-col items-center mt-4">
          <span className="text-sm text-gray-600">Or sign in with</span>
          <button
            onClick={() => loginWithGogle()}
            className="inline-flex h-10 mt-2 w-full items-center justify-center gap-2 rounded border border-slate-300 bg-white p-2 text-sm font-medium text-black ">
            <Image src={googleIconSvg} alt="Google" width={20} height={20} />
            Continue with Google
          </button>
        </div> */}
        <p className="text-center">Dont have an account? <Link href="/auth/register" className="font-medium text-indigo-600 hover:text-indigo-500">Sign up</Link></p>

      </div>
    </main>
  )
}

const Login = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginWithoutSuspense />
    </Suspense>
  )
}

export default Login

