
type FooterLinkListProps = {
    title: string;
    links: Link[];
  };

  interface Link {
    name: string;
    href: string;
  }

export const footerLinks: FooterLinkListProps[] = [
    {
      title: "About Us",
      links: [               
        { name: "Careers", href: "/career" },
        { name: "About us", href: "/about-us" }
      ],
    },
    {
      title: "Our Services",
      links: [
        { name: "Medical courses", href: "/courses" },
        { name: "Medical carrier guidance", href: "/career-guidance" },
      ],
    },
    {
      title: "Helpful Links",
      links: [
        { name: "FAQs", href: "/faqs" },
        { name: "Support", href: "/contact-us" },
      ],
    },
    {
      title: "Contact Us",
      links: [        
        { name: "support@Ilearn.com", href: "" },
        { name: "0123456789", href: "" },
      ],
    },
  ];