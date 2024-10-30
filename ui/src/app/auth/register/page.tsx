"use client";
// Import necessary modules
import React, { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { validateForm, registrationValidationRules } from "@/helpers/validation";
import { registerUser, verifyEmail, resendEmailOTP } from '@/services/users/user';
import Link from 'next/link';
import { useSelector } from "react-redux";
import { LoaderButton } from '@/components/ButtonComponent';
import { useRouter } from 'next/navigation';
import { RegistrationForm } from '@/types/validation';
import Toast from '@/helpers/toasters';
import PasswordInput from '@/components/input-fields/PasswordField';

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
  const { authState } = useSelector((state: any) => state.auth);
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
          Toast.successToast({ message: response.message, autoClose: 1000, position: 'top-right' });
        } else {
          Toast.errorToast({ message: response.message, autoClose: 1000, position: 'top-right' });
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
          Toast.successToast({ message: response.message, autoClose: 1000, position: 'top-right' });
          setOtp('');
          setShowOTP(false);
        }
      } catch {
        //do nothing
      } finally {
        setLoadingOtp(false);
      }
    } else {
      Toast.errorToast({ message: 'Please enter a valid 6-digit OTP.', autoClose: 1000, position: 'top-right' });
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
      Toast.successToast({ message: response.message, autoClose: 1000, position: 'top-right' });
      startTimer();
    }
  };

  const gettingPasswordValue = (password: string, confirmPassword: string) => {
    if (confirmPassword) {
      setConfirmPassword(password);
    } else {
      setPassword(password);
    }

  }

  if(authState) {
    router.push('/');  
  }

  return (
    <main className="w-full h-screen flex flex-col items-center mt-16 px-4 ">
      <div className="max-w-sm w-full border border-[#12375c]  p-8 space-y-5 rounded-lg shadow-2xl" style={{ minHeight: '500px' }}>
        {showOTP ? (
          <div className="mt-5 h-full">
            <button className="text-gray-400 hover:text-gray-500" onClick={() => { setOtp(''); setSuccess(''); setShowOTP(false); setTimer(120); setTimerActive(false); }}>
              {backIcon}
            </button>
            <p className=" text-2xl font-bold sm:text-3xl mb-4 mt-3">Enter OTP</p>
            <p className="text-sm mb-8">A 6-digit OTP has been sent to your email.
              {timer === 0 ? 'OTP expired' : `It will expire in ${formatTime()} .`}</p>
            <input
              value={otp}
              name="otp"
              onChange={(e: ChangeEvent<HTMLInputElement>) => setOtp(e.target.value)}
              className="shadow appearance-none mb-4 border rounded w-full py-2 px-3 text-grey-500 bg-background"
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
              <h3 className="text-2xl font-bold sm:text-3xl mt-5">Sign Up</h3>
            </div>

            <form onSubmit={handleSubmit}>
              
              <input
                name="name"
                type="text"
                placeholder="Full Name"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-grey-500 bg-background"
                value={fullName}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setFullName(e.target.value)}
              />
              {errors.name && <p className="text-red-500 text-xs mb-2">{errors.name}</p>}

              <input
                name="email"
                type="text"
                placeholder="Email"
                className="shadow appearance-none border mt-4 rounded w-full py-2 px-3 text-grey-500 bg-background"
                value={email}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              />
              {errors.email && <p className="text-red-500 text-xs mb-2">{errors.email}</p>}

              <PasswordInput gettingPasswordValue={gettingPasswordValue} isPassword={true} />
              {errors.password && <p className="text-red-500 text-xs mb-2">{errors.password}</p>}
              
              <PasswordInput gettingPasswordValue={gettingPasswordValue} isconfirmPassword={true} />              {errors.confirmPassword && <p className="text-red-500 text-xs mb-4">{errors.confirmPassword}</p>}
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
