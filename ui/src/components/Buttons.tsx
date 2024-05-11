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
    className={`inline-flex items-center justify-center gap-2 rounded border border-transparent px-4 py-2 text-sm font-medium text-white ${loading ? 'bg-gray-400' : 'bg-black hover:bg-orange-500'} transition-colors duration-150 ease-in-out w-full`}
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

export const SearchLoaderButton: React.FC<LoaderButtonProps> = ({ loading, buttonText }) => (
  <button
    disabled={loading}
    className={`inline-flex items-center justify-center rounded-full gap-2 min-w-[130px] border border-transparent px-4 py-2 text-sm font-medium text-white $ ${loading ? 'bg-gray-400' : 'bg-black hover:bg-orange-500'} transition-colors duration-150 ease-in-out w-full`}
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

// export const TopButton = ({ isToolTipVisible }) => {
//   const scrollToTop = () => {
//     window.scrollTo({
//       top: 0,
//       behavior: 'smooth',
//     });
//   };
//   return (
//     <div className="mt-1 w-8 cursor-pointer hover:text-orange-500 ">
//       {
//         isToolTipVisible ?
//           <TopToolTip text='Back to top'>
//             <Image onClick={() => scrollToTop()} src={arrowIcon} alt="topIcon" width={30} height={30} />
//           </TopToolTip>
//           :
//           <Image onClick={() => scrollToTop()} src={arrowIcon} alt="topIcon" width={30} height={30} />

//       }

//     </div>
//   )
// }


interface NavButtonProps {
  navigationLink: string;
  label: string;
}

export const NavButton: React.FC<NavButtonProps> = ({ navigationLink, label }) => {
  return (
    <Link href={navigationLink} >
      <button className="p-4 no-underline group cursor-pointer relative shadow-2xl shadow-zinc-900 rounded-full p-px text-xs font-semibold leading-6 bg-buttons text-buttonTypography transition  hover:text-buttonHover inline-block">
        <span className="absolute inset-0 overflow-hidden rounded-full">
          <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(56,189,248,0.6)_0%,rgba(56,189,248,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        </span>
        <div className="relative flex space-x-2 items-center z-10 rounded-full bg-zinc-950 py-0.5 px-4 ring-1 ring-white/10 ">
          <span>
            {label}
          </span>
          <svg
            fill="none"
            height="16"
            viewBox="0 0 24 24"
            width="16"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10.75 8.75L14.25 12L10.75 15.25"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
            />
          </svg>
        </div>
        <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-emerald-400/0 via-emerald-400/90 to-emerald-400/0 transition-opacity duration-500 group-hover:opacity-40" />
      </button>
    </Link>
  );
};

export const NavButton2: React.FC<NavButtonProps> = ({ navigationLink, label }) => {
  return (
    <Link href={navigationLink} >
      <button className="btn"
      >
        <div className="relative flex">
          <span className='p-1 text-[15px]'>
            {label}
          </span>
          <span className='mt-[3px]'>
            <svg
              fill="none"
              height="26"
              viewBox="0 0 24 24"
              width="26"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.75 8.75L14.25 12L10.75 15.25"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
              />
            </svg>
          </span>

        </div>
      </button>
    </Link>
  )
}

