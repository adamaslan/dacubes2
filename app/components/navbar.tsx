import React, { useState, useEffect } from 'react';
import '../styles/navbar.css'; // Import the new CSS file

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
    updateScrollState();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navClasses = `navbar ${isScrolled ? 'navbar-scrolled' : 'navbar-transparent'}`;

  return (
    <nav className={navClasses}>
      <div className="navbar-container">
        {logo && (
          <a href="/" className="navbar-logo-link">
            {React.cloneElement(logo, {
              // Remove Tailwind classes that are now handled by navbar.css for the logo
              className: `${(logo.props.className || '')
                .replace(/\btext-\S+\b/g, '') // Remove text color utilities
                .replace(/\bfont-(bold|medium|semibold)\b/g, '') // Remove font weight utilities
                .trim()} navbar-logo`
            })}
          </a>
        )}
        
        <ul className="navbar-links-list">
          {links.map((link) => (
            <li key={link.href} className="navbar-link-item">
              <a href={link.href}>
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