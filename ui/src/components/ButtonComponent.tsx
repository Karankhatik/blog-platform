"use client";
import Image from 'next/image';
import arrowIcon from '@/assets/arrow-sm-up-svgrepo-com.svg';
import Link from 'next/link';
// import { TopToolTip } from './ToolTips';

const Loader = () => (
  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);


interface LoaderButtonProps {
  loading: boolean;
  buttonText: string;
}

export const LoaderButton: React.FC<LoaderButtonProps> = ({ loading, buttonText }) => (
  <button
    disabled={loading}
    className={`inline-flex items-center mt-4 justify-center gap-2 rounded border border-transparent px-4 py-2 text-sm font-medium text-black ${loading ? 'bg-gray-400' : 'bg-white hover:bg-gray-200'} transition-colors duration-150 ease-in-out w-full`}
  >
    {loading ? (
      <>
        <Loader />
        {buttonText}
      </>
    ) : (
      buttonText
    )}
  </button>
);






