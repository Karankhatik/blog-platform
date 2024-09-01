export type NavbarItem = {
    label: string;
    href: string;
    subMenu?: NavbarItem[];
};

export const navbarItems: NavbarItem[] = [
    {
      label: 'Articles',
      href: '/articles',
    },
    {
      label: 'About me', href: '/about-me'
    },
    {
      label: 'Contact me', href: '/contact-me'
    }, 
    { label: 'Login', href: '/auth/login' },
    { label: 'Register', href: '/auth/register' },


    // {
    //   label: 'Company',
    //   href: '#',
    //   subMenu: [
    //     { label: 'About Us', href: '/about-us' },
    //     { label: 'Contact Us', href: '/contact-us' },
    //     { label: 'FAQs', href: '/faqs' },
    //   ],
    // },
  ];
