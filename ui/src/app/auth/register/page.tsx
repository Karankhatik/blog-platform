"use client";
// Import necessary modules
import googleIconSvg from '@/assets/icons/googleIcon.svg';
import React, { useState, useTransition, useEffect, FormEvent, ChangeEvent } from 'react';
import Image from 'next/image';
import { validateForm, registrationValidationRules } from "@/helpers/validation";
import { registerUser, verifyEmail, resendEmailOTP } from '@/services/users/user';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { LoaderButton } from '@/components/Buttons';
import { useRouter } from 'next/navigation';
import { RegistrationForm } from '@/types/validation';

const backIcon = (
  <svg width="40" height="24" viewBox="0 0 40 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M40 12H8" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
    <path d="M12 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" stroke-linecap="round" strokeLinejoin="round" />
  </svg>
);

interface FormErrors {
  [key: string]: string;
}

const SignUp: React.FC = () => {
  // Form state hooks
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [success, setSuccess] = useState<string>('');
  const [timer, setTimer] = useState<number>(120);
  
  const [loading, setLoading] = useState<boolean>(false);

  // Hooks related to OTP input
  const [showOTP, setShowOTP] = useState<boolean>(false);
  const [otp, setOtp] = useState<string>('');
  const [loadingOtp, setLoadingOtp] = useState<boolean>(false);
  const router = useRouter();

  // Track timer state for interval cleanup
  const [timerActive, setTimerActive] = useState<boolean>(false);

  const handleRegistration = async (formData: RegistrationForm) => {
    const { isValid, errors } = await validateForm(formData, registrationValidationRules);
    if (isValid) {
      setLoading(true);
      try {
        const response = await registerUser(formData);
        if (response.success) {
          startTimer();
          setShowOTP(true);
          toast.success(response.message);
        } else {
          toast(response.message);
        }
      } catch {
        toast.error("An unexpected error occurred. Please try again.");
      } finally {
        setLoading(false);
      }
    } else {
      setErrors(errors);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    setErrors({});
    setSuccess('');
    const formData: RegistrationForm = {
      email: email.trim().toLowerCase(),
      password,
      name: fullName.trim(),
      confirmPassword
    };
    handleRegistration(formData);
  };

  const handleOTPChange = async () => {
    if (otp.length === 6) {
      setLoadingOtp(true);
      try {
        const response = await verifyEmail(email, Number(otp));
        if (response.success) {
          router.push('/auth/login');
          setSuccess(response.message);
          setFullName('');
          setEmail('');
          setConfirmPassword('');
          setPassword('');
          toast.success(response.message);
          setOtp('');
          setShowOTP(false);
        }
      } catch {
        //do nothing
      } finally {
        setLoadingOtp(false);
      }
    } else {
      toast.error("Please enter a valid 6-digit OTP.");
    }
  };

  const startTimer = () => {
    setTimer(120);
    setTimerActive(true);
  };

  useEffect(() => {
    let interval: NodeJS.Timer | undefined;
  
    if (timerActive) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval as NodeJS.Timeout); // Use type assertion here
            setTimerActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  
    return () => clearInterval(interval as NodeJS.Timeout); // And here as well
  }, [timerActive]);
  

  const formatTime = (): string => {
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleResendOTP = async () => {
    const response = await resendEmailOTP(email);
    if (response.success) {
      toast.success(response.message);
      startTimer(); // Restart the timer
    } else {
      toast.error("Failed to resend OTP. Please try again.");
    }
  };

  return (
    <main className="w-full mt-10 flex flex-col items-center justify-center px-4">
      <div className="max-w-sm w-full border border-gray-300 p-8 text-gray-600 space-y-5 rounded-lg shadow-2xl" style={{ minHeight: '500px' }}>
        {showOTP ? (
          <div className="mt-5">
            <button className="text-black hover:text-orange-500" onClick={() => { setOtp(''); setSuccess(''); }}>
              {backIcon}
            </button>
            <p className="text-gray-800 text-2xl font-bold sm:text-3xl mb-4 mt-3">Enter OTP</p>
            <p className="text-sm mb-8 text-gray-600">A 6-digit OTP has been sent to your email.
              {timer === 0 ? 'OTP expired' : `It will expire in ${formatTime()} .`}</p>
            <input
              value={otp}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setOtp(e.target.value)}
              className="border border-gray-300 rounded-md text-lg p-2 w-full mb-2"
              maxLength={6}
              placeholder="Enter OTP"
              pattern="\d*"
            />
            {timer === 0 ? (
              <span className="mt-10" onClick={handleResendOTP}>
                 <LoaderButton loading={loadingOtp} buttonText="Resend OTP" />
              </span>              
            ) : <span className="mt-10" onClick={handleOTPChange}>
              <LoaderButton loading={loadingOtp} buttonText="Submit OTP" />
            </span>}
          </div>
        ) : (
          <>
            <div className="text-center pb-2">
              <h3 className="text-gray-800 text-2xl font-bold sm:text-3xl mt-5">Sign Up</h3>
            </div>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Full Name"
                className="block w-full px-4 py-2 mb-2 text-gray-700 bg-white border rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                value={fullName}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setFullName(e.target.value)}
              />
              {errors.name && <p className="text-red-500 text-xs mb-2">{errors.name}</p>}
              <input
                type="text"
                placeholder="Email"
                className="block w-full px-4 py-2 mb-2 text-gray-700 bg-white border rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                value={email}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              />
              {errors.email && <p className="text-red-500 text-xs mb-2">{errors.email}</p>}
              <input
                type="password"
                placeholder="Password"
                className="block w-full px-4 py-2 mb-2 text-gray-700 bg-white border rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                value={password}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              />
              {errors.password && <p className="text-red-500 text-xs mb-2">{errors.password}</p>}
              <input
                type="password"
                placeholder="Confirm Password"
                className="block w-full px-4 py-2 mb-4 text-gray-700 bg-white border rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                value={confirmPassword}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
              />
              {errors.confirmPassword && <p className="text-red-500 text-xs mb-4">{errors.confirmPassword}</p>}
              {errors.generalError && <p className="text-red-500 text-xs mb-4">{errors.generalError}</p>}
              {success && <p className="text-green-500 text-xs mb-4">{success}</p>}
              <LoaderButton loading={loading} buttonText="Sign Up" />
            </form>
            <p className="text-center">
              Already have an account?{' '}
              <Link href="/auth/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                Sign In
              </Link>
            </p>
          </>
        )}
      </div>
    </main>
  );
};

export default SignUp;
