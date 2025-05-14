import React, { useState, useEffect } from 'react';

interface NavbarProps {
  links: { href: string; text: string }[];
  logo?: JSX.Element;
}

const Navbar: React.FC<NavbarProps> = ({ links, logo }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/70 backdrop-blur-md shadow-md'
          : 'bg-transparent'
      } py-4 px-8 md:px-16 flex justify-between items-center`}
    >
      {logo && logo}
      <ul className="flex m-0 p-0 list-none">
        {links.map((link) => (
          <li key={link.href} className="ml-8 md:ml-16">
            <a
              href={link.href}
              className="text-gray-800 font-medium hover:text-blue-500 transition-colors duration-300"
            >
              {link.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;