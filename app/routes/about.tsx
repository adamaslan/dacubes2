import { useState } from 'react';
import Navbar from 'app/components/navbar';

export default function About() {
  return (
    <>    <Navbar 
    links={[
      { href: "/", text: "Home" },
      { href: "/about", text: "About" },
      { href: "/contact", text: "Contact" }
    ]} 
    logo={<div className="text-white font-bold">LOGO</div>}
  />
    <div className="grid-container">
      <style>
        {`
          .grid-container {
            display: grid;
            gap: 1rem;
            padding: 1rem;
          }

          @media (min-width: 768px) {
            .grid-container {
              grid-template-columns: repeat(3, 1fr);
              grid-template-rows: repeat(3, 1fr);
            }
          }

          @media (max-width: 767px) {
            .grid-container {
              grid-template-columns: repeat(2, 1fr);
            }
          }

          .grid-item {
            padding: 2rem;
            text-align: center;
            min-height: 150px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
          }
        `}
      </style>

      <div className="grid-item" style={{ backgroundColor: '#FF6B6B' }}>
      My name is Adam Timur Aslan. It works well for English and Turkish speakers. In addition to working as a full stack engineer, I am also a founder of ZXY Gallery, Tasty Tech Bytes, International Art Magazine, and Drinks Food Life. These days I am building AI Agents and am continually tinkering with the process of  Retrieval-Augmented Generation. 
      </div>
      <div className="grid-item" style={{ backgroundColor: '#4ECDC4' }}>
        + - + - + - + - + - + - + - + -
      </div>
      <div className="grid-item" style={{ backgroundColor: '#45B7D1' }}>
        + - + - + - + - + - + - + - + -
      </div>
      <div className="grid-item" style={{ backgroundColor: '#96CEB4' }}>
        + - + - + - + - + - + - + - + -
      </div>
      <div className="grid-item" style={{ backgroundColor: '#4EEEED' }}>
      I hope to bring a sort of customer facing communication skill set to whatever techy role I am, which hopefully begs the question: “why isn’t this person a solutions architect or some other role that involves technical skills and the type of communication that resolves pain points and inspires?”
      </div>
      <div className="grid-item" style={{ backgroundColor: '#D4A5A5' }}>
        + - + - + - + - + - + - + - + -
      </div>
      <div className="grid-item" style={{ backgroundColor: '#9B786F' }}>
        + - + - + - + - + - + - + - + -
      </div>
      <div className="grid-item" style={{ backgroundColor: '#A8E6CE' }}>
        + - + - + - + - + - + - + - + -
      </div>
      <div className="grid-item" style={{ backgroundColor: '#FFD93D' }}>
      My deep nerdyness wants to be in constant conversation with engineers building AI Agents. My creative side wants to yap with product designers envisioning how to create the latest tools to revolutionize an industry. My continual compassion for the suffering of all beings makes me want to help customers and stakeholders feel  a type of resolution in the workplace that translates to less stress at home.
      </div>
    </div>
    </>
  );
}