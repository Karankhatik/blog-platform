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
      label: 'About us', href: '/about-us'
    },
    {
      label: 'Contact us', href: '/contact-us'
    }, 
    { label: 'Login', href: '/auth/login' },
    { label: 'Register', href: '/auth/register' },
  ];
