import { Link } from "@remix-run/react";
import type { MetaFunction } from "@remix-run/node";
import Navbar from "~/components/navbar";

export const meta: MetaFunction = () => {
  return [
    { title: "GitHub Projects" },
    { name: "description", content: "Explore our GitHub projects" },
  ];
};

export default function AIProjects() {
  const navLinks = [
    { href: "/", text: "Home" },
    { href: "/about", text: "About" },
    { href: "/contact", text: "Contact" },
  ];

  const logo = <div>My Logo</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar links={navLinks} logo={logo} />
      
      <main className="container mx-auto py-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">GitHub Projects</h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-5 p-5 max-w-4xl mx-auto" id="parent">
          <a href="https://github.com/yourusername/project1" target="_blank" rel="noopener noreferrer" 
             className="block w-[280px] sm:w-[320px] md:w-[360px] aspect-square mx-auto bg-blue-500 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 group">
            <div className="flex flex-col items-center justify-center h-full w-full p-6 text-center">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">GitHub 1</h2>
              <p className="text-white text-sm sm:text-base">React Project Repository</p>
              <p className="text-blue-100 text-xs sm:text-sm mt-2">Click to view source code</p>
            </div>
          </a>

          <a href="https://github.com/yourusername/project2" target="_blank" rel="noopener noreferrer" 
             className="block w-[280px] sm:w-[320px] md:w-[360px] aspect-square mx-auto bg-green-500 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 group">
            <div className="flex flex-col items-center justify-center h-full w-full p-6 text-center">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">GitHub 2</h2>
              <p className="text-white text-sm sm:text-base">Node.js Backend API</p>
              <p className="text-green-100 text-xs sm:text-sm mt-2">Click to explore the code</p>
            </div>
          </a>

          <a href="https://github.com/yourusername/project3" target="_blank" rel="noopener noreferrer" 
             className="block w-[280px] sm:w-[320px] md:w-[360px] aspect-square mx-auto bg-purple-500 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 group">
            <div className="flex flex-col items-center justify-center h-full w-full p-6 text-center">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">GitHub 3</h2>
              <p className="text-white text-sm sm:text-base">Three.js 3D Models</p>
              <p className="text-purple-100 text-xs sm:text-sm mt-2">View 3D project code</p>
            </div>
          </a>

          <a href="https://github.com/yourusername/project4" target="_blank" rel="noopener noreferrer" 
             className="block w-[280px] sm:w-[320px] md:w-[360px] aspect-square mx-auto bg-red-500 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 group">
            <div className="flex flex-col items-center justify-center h-full w-full p-6 text-center">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">GitHub 4</h2>
              <p className="text-white text-sm sm:text-base">Full Stack Application</p>
              <p className="text-red-100 text-xs sm:text-sm mt-2">Explore the repository</p>
            </div>
          </a>
        </div>
      </main>
    </div>
  );
}