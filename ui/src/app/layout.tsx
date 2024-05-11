import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbarComponent/navbar";
import { ToastContainer, toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';

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
      <div className='mx-auto  max-w-screen-xl px-4 sm:px-6 lg:px-8'>
        <Navbar/>
        {children}
      </div>
      </div>
      <ToastContainer />
      </ReduxProvider>
        </body>

    </html>
  );
}
