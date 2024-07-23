import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbarComponent/Navbar";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Script from 'next/script'
//import tinymce from "../../public/tinymce/tinymce"

const ReduxProvider = dynamic(() => import("@/store/reduxProvider"), {
  ssr: false
});

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Intake Learn",
  description: "Education Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <ReduxProvider>      
      <div className='bg-primary'>
      <div className='mx-auto  px-2 md:px-8 lg:px-8'>
        <Navbar/>
        {children}
      </div>
      </div>
      <ToastContainer />
      </ReduxProvider>
        </body>
        <Script src="/tinymce/tinymce.min.js"  />
    </html>
    
  );
}
