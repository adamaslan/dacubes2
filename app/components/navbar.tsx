import React, { useState, useEffect } from 'react';

interface NavbarProps {
  links: { href: string; text: string }[];
  logo?: JSX.Element;
}

const Navbar: React.FC<NavbarProps> = ({ links, logo }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const updateScrollState = () => {
      setIsScrolled(window.scrollY > 50);
    };

    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateScrollState();
          ticking = false;
        });
        ticking = true;
      }
    };

    // Set initial state on mount
    updateScrollState();

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      // requestAnimationFrame handles its own cleanup if the callback isn't executed.
    };
  }, []); // Empty dependency array is appropriate here as setIsScrolled is stable.

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-[opacity,backdrop-filter] duration-300 ${
        isScrolled
          ? 'bg-white/80 backdrop-blur-md shadow-sm'
          : 'bg-transparent'
      } py-3 px-4 sm:px-8 md:px-12`}
    >
      <div className="max-w-screen-xl mx-auto flex items-center justify-between">
        {logo && React.cloneElement(logo, { 
          className: `${logo.props.className || ''} h-8 w-auto transition-transform hover:scale-105`
        })}
        
        <ul className="flex space-x-4 md:space-x-6">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-gray-700 hover:text-blue-600 font-medium transition-all
                           duration-300 hover:scale-[1.02] active:scale-95 px-2 py-1 rounded-lg
                           focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                {link.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;