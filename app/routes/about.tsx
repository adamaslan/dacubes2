import type { MetaFunction, LinksFunction } from "@remix-run/node";
import Navbar from "~/components/navbar";
// Remove this import
// import aboutStylesHref from "~/styles/about.css"; 

// Use direct path in links function instead
export const links: LinksFunction = () => [
  { rel: "stylesheet", href: "/styles/about.css" },
  // If Navbar.tsx imports its own CSS (which it does: import '../styles/navbar.css';),
  // then navbar.css is handled, and no further action is needed here for it.
];

// Make sure navbar.css is also handled, either imported in Navbar.tsx or globally if preferred
// REMOVED DUPLICATE LINKS FUNCTION THAT WAS HERE:
// export const links: LinksFunction = () => [
//   { rel: "stylesheet", href: aboutStylesHref },
//   // If Navbar.tsx doesn't import its own CSS and you want it route-specific:
//   // { rel: "stylesheet", href: navbarStylesHref }, // (you'd need to import navbarStylesHref too)
// ];

export const meta: MetaFunction = () => {
  return [
    { title: "About DaCubes" },
    { name: "description", content: "Welcome to DaCubes!" },
  ];
};

export default function About() {
  return (
    // Optional: Add a class to this root fragment's div if needed for page-level styling
    // <div className="about-page-container"> 
    <>
      <Navbar
        links={[
          { href: "/", text: "Home" },
          { href: "/about", text: "About" },
          { href: "/contact", text: "Contact" },
        ]}
        logo={<div className="">LOGO</div>} // Removed Tailwind from logo prop; Navbar CSS will style it
      />
      <div className="about-grid-container">
        <div
          className="about-grid-item"
          style={{ backgroundColor: '#FF6B6B' }}
        >
          My name is Adam Timur Aslan. It works well for English and Turkish speakers. In addition to working as a full stack engineer, I am also a founder of ZXY Gallery, Tasty Tech Bytes, International Art Magazine, and Drinks Food Life. These days I am building AI Agents and am continually tinkering with the process of Retrieval-Augmented Generation.
        </div>
        <div
          className="about-grid-item"
          style={{ backgroundColor: '#4ECDC4' }}
        >
          + - + - + - + - + - + - + - + -
        </div>
        {/* ... other grid items ... (remove Tailwind classes, use about-grid-item) */}
        <div
          className="about-grid-item"
          style={{ backgroundColor: '#45B7D1' }}
        >
          + - + - + - + - + - + - + - + -
        </div>
        <div
          className="about-grid-item"
          style={{ backgroundColor: '#96CEB4' }}
        >
          + - + - + - + - + - + - + - + -
        </div>
        <div
          className="about-grid-item"
          style={{ backgroundColor: '#4EEEED' }}
        >
          I hope to bring a sort of customer facing communication skill set to whatever techy role I am, which hopefully begs the question: “why isn’t this person a solutions architect or some other role that involves technical skills and the type of communication that resolves pain points and inspires?”
        </div>
        <div
          className="about-grid-item"
          style={{ backgroundColor: '#D4A5A5' }}
        >
          + - + - + - + - + - + - + - + -
        </div>
        <div
          className="about-grid-item"
          style={{ backgroundColor: '#9B786F' }}
        >
          + - + - + - + - + - + - + - + -
        </div>
        <div
          className="about-grid-item"
          style={{ backgroundColor: '#A8E6CE' }}
        >
          + - + - + - + - + - + - + - + -
        </div>
        <div
          className="about-grid-item"
          style={{ backgroundColor: '#FFD93D' }}
        >
          My deep nerdyness wants to be in constant conversation with engineers building AI Agents. My creative side wants to yap with product designers envisioning how to create the latest tools to revolutionize an industry. My continual compassion for the suffering of all beings makes me want to help customers and stakeholders feel a type of resolution in the workplace that translates to less stress at home.
        </div>
      </div>
    </>
    // </div>
  );
}