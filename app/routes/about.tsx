import { useState } from 'react';
import Navbar from 'app/components/navbar';

export default function About() {
  return (
    <>
      <Navbar
        links={[
          { href: "/", text: "Home" },
          { href: "/about", text: "About" },
          { href: "/contact", text: "Contact" },
        ]}
        logo={<div className="text-white font-bold">LOGO</div>}
      />
      <div className="grid grid-cols-2 md:grid-cols-3 md:grid-rows-3 gap-4 p-4">
        {/* Removed inline <style> block. Styles are now applied via Tailwind classes. */}
        {/* Individual grid items now use Tailwind classes directly or retain inline styles for unique background colors. */}
        
        <div
          className="p-8 text-center min-h-[150px] flex items-center justify-center text-white font-bold"
          style={{ backgroundColor: '#FF6B6B' }}
        >
          My name is Adam Timur Aslan. It works well for English and Turkish speakers. In addition to working as a full stack engineer, I am also a founder of ZXY Gallery, Tasty Tech Bytes, International Art Magazine, and Drinks Food Life. These days I am building AI Agents and am continually tinkering with the process of Retrieval-Augmented Generation.
        </div>
        <div
          className="p-8 text-center min-h-[150px] flex items-center justify-center text-white font-bold"
          style={{ backgroundColor: '#4ECDC4' }}
        >
          + - + - + - + - + - + - + - + -
        </div>
        <div
          className="p-8 text-center min-h-[150px] flex items-center justify-center text-white font-bold"
          style={{ backgroundColor: '#45B7D1' }}
        >
          + - + - + - + - + - + - + - + -
        </div>
        <div
          className="p-8 text-center min-h-[150px] flex items-center justify-center text-white font-bold"
          style={{ backgroundColor: '#96CEB4' }}
        >
          + - + - + - + - + - + - + - + -
        </div>
        <div
          className="p-8 text-center min-h-[150px] flex items-center justify-center text-white font-bold"
          style={{ backgroundColor: '#4EEEED' }}
        >
          I hope to bring a sort of customer facing communication skill set to whatever techy role I am, which hopefully begs the question: “why isn’t this person a solutions architect or some other role that involves technical skills and the type of communication that resolves pain points and inspires?”
        </div>
        <div
          className="p-8 text-center min-h-[150px] flex items-center justify-center text-white font-bold"
          style={{ backgroundColor: '#D4A5A5' }}
        >
          + - + - + - + - + - + - + - + -
        </div>
        <div
          className="p-8 text-center min-h-[150px] flex items-center justify-center text-white font-bold"
          style={{ backgroundColor: '#9B786F' }}
        >
          + - + - + - + - + - + - + - + -
        </div>
        <div
          className="p-8 text-center min-h-[150px] flex items-center justify-center text-white font-bold"
          style={{ backgroundColor: '#A8E6CE' }}
        >
          + - + - + - + - + - + - + - + -
        </div>
        <div
          className="p-8 text-center min-h-[150px] flex items-center justify-center text-white font-bold"
          style={{ backgroundColor: '#FFD93D' }}
        >
          My deep nerdyness wants to be in constant conversation with engineers building AI Agents. My creative side wants to yap with product designers envisioning how to create the latest tools to revolutionize an industry. My continual compassion for the suffering of all beings makes me want to help customers and stakeholders feel a type of resolution in the workplace that translates to less stress at home.
        </div>
      </div>
    </>
  );
}