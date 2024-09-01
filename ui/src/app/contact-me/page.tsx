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
    <main className="w-full flex flex-col items-center mt-16 mb-52 px-4 sm:mt-5">
      <div className="w-full max-w-4xl flex flex-col sm:flex-row space-y-5 sm:space-y-0 sm:space-x-5">
        <div className="flex-1 border border-[#12375c] rounded-lg p-8 bg-black">
          <div className="text-center pb-2">
            <div className="mt-5">
              <h1 className="text-center font-bold text-3xl">Contact Me</h1>              
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <input
                placeholder="Name"
                name="name"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-grey-500 bg-black"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
            </div>

            <div>
              <textarea
                placeholder="Your Message"
                name="message"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-grey-500 bg-black"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
              />
              {errors.message && <p className="text-red-500 text-xs">{errors.message}</p>}
            </div>

            <LoaderButton loading={loading} buttonText="Send Message" />
          </form>
          
        </div>

        <div className="flex-1 border border-[#12375c] rounded-lg p-5 bg-black relative sm:-ml-8 sm:-mt-8 z-0 sm:z-20">
          <div className="flex flex-col justify-center h-full">
            <div className="flex items-center gap-2 mb-5">
              <FaLink className="text-xl" />
              <h1 className="text-sm text-gray-400">Connect with me</h1>
            </div>

            <div className="flex flex-col gap-5">
              <Link
                href="https://github.com/MayankUghade"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <GrGithub className="md:text-3xl text-2xl" />
                <h1 className="text-sm">Github</h1>
              </Link>
              <Link
                href="https://www.linkedin.com/in/mayank-ughade-63aab7229/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <FaLinkedin className="md:text-3xl text-2xl" />
                <h1 className="text-sm">LinkedIn</h1>
              </Link>
              <Link
                href="https://x.com/MayankUghade3"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <FaTwitter className="md:text-3xl text-2xl" />
                <h1 className="text-sm">Twitter</h1>
              </Link>
              <Link
                href="https://www.instagram.com/mayank_ughade/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <FaInstagram className="md:text-3xl text-2xl" />
                <h1 className="text-sm">Instagram</h1>
              </Link>
              <Link
                href="mailto:mayank14ughade@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <GrMailOption className="md:text-3xl text-2xl" />
                <h1 className="text-sm">Mail</h1>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default ContactUs;
