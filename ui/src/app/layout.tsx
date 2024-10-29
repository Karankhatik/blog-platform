import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar-component/Navbar";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Script from 'next/script'
import Footer from "@/components/footer/Footer";
//import tinymce from "../../public/tinymce/tinymce"

const ReduxProvider = dynamic(() => import("@/store/reduxProvider"), {
  ssr: false
});

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TechBlog",
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
        <div className="bg-background">
        <Navbar/>
        {children}
        <Footer/>
        </div>
        
      <ToastContainer />
      </ReduxProvider>
        </body>
        <Script src="/tinymce/tinymce.min.js"  />
    </html>
    
  );
}
