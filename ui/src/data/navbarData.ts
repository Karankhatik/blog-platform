export type NavbarItem = {
    label: string;
    href: string;
    subMenu?: NavbarItem[];
};

export const navbarItems: NavbarItem[] = [
    // {
    //   label: 'About us', href: '/about-us'
    // },
    // { label: 'Contact us', href: '/contact-us' },
    { label: 'FAQs', href: '/faqs' },
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
