"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { validateForm, commonValidationRules } from '@/helpers/validation';
import { useRouter } from 'next/navigation';
import { LoaderButton } from '@/components/ButtonComponent';
import Toast from '@/helpers/toasters';
import {
  FaInstagram,
  FaLink,
  FaLinkedin,  
  FaTwitter,
} from "react-icons/fa6";
import { GrGithub, GrMailOption } from "react-icons/gr";
import { sendEmailAPI } from '@/services/commonAPIs/commonApis';

type FormErrors = { [key: string]: string };

const ContactUs = () => {
  const [name, setName] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();

  async function handleContactUs(formData:any) {
    const { isValid, errors } = await validateForm(formData, commonValidationRules);
    try {
      setLoading(true);
      if (isValid) {
        // Simulating form submission
        const response = await sendEmailAPI(formData.name, formData.message);
        if (response.success) {
          setTimeout(() => {
            Toast.successToast({ message: "Message sent successfully!", autoClose: 1000, position: 'top-right' });
            setName('');
            setMessage('');
          }, 1000);
        }
        
      } else {
        setErrors(errors);
      }
    } catch (error) {
      Toast.errorToast({ message: "An unexpected error occurred. Please try again.", autoClose: 1000, position: 'top-right' });
      setErrors(errors);
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    setErrors({});
    const formData: any = {
      name: name.trim(),
      message: message.trim(),
    }
    handleContactUs(formData);
  };

  return (
    <main className="w-full h-screen flex flex-col items-center mt-20 px-4 ">
      <div className="w-full max-w-4xl flex flex-col sm:flex-row space-y-5 sm:space-y-0 sm:space-x-5">
        <div className="flex-1 border border-[#12375c] rounded-lg p-8 bg-background">
          <div className="text-center pb-2">
            <div className="mt-5">
              <h1 className="text-center font-bold text-3xl">Contact Us</h1>              
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <input
                placeholder="Name"
                name="name"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-grey-500 bg-background"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
            </div>

            <div>
              <textarea
                placeholder="Your Message"
                name="message"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-grey-500 bg-background"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
              />
              {errors.message && <p className="text-red-500 text-xs">{errors.message}</p>}
            </div>

            <LoaderButton loading={loading} buttonText="Send Message" />
          </form>
          
        </div>
        
      </div>
    </main>
  )
}

export default ContactUs;
