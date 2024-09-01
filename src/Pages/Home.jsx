import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaUserPlus, FaEdit, FaBars } from 'react-icons/fa';
import { MdOutlineQuiz, MdWorkOutline, MdAssessment, MdWeb, MdEventAvailable } from 'react-icons/md';
import EmailVerification from "../components/EmailVerification";

const Home = () => {
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Sidebar starts closed on mobile

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className={`bg-blue-600 text-white flex flex-col justify-between transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-16'} md:w-64`}>
        {/* Hamburger Menu (always visible) */}
        <div className="flex items-center justify-between p-4 md:hidden">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <FaBars />
          </button>
        </div>
        
        <div className="flex flex-col items-center md:items-stretch">
          <div className={`p-6 text-center font-bold text-xl ${isSidebarOpen ? 'block' : 'hidden'} md:block`}>
            Data Collection Portal
          </div>
          <nav className="mt-10 flex flex-col items-center md:items-start w-full">
            <Link
              to="/newApplicant"
              className="flex items-center px-6 py-3 hover:bg-blue-700 transition-colors duration-300 w-full"
            >
              <FaUserPlus className="mr-2" />
              <span className={`${!isSidebarOpen && 'hidden'} md:inline`}>New Application</span>
            </Link>
            <button
              onClick={() => setShowEmailVerification(true)}
              className="flex items-center px-6 py-3 hover:bg-blue-700 transition-colors duration-300 w-full text-left"
            >
              <FaEdit className="mr-2" />
              <span className={`${!isSidebarOpen && 'hidden'} md:inline`}>Change / View Application</span>
            </button>
            <a
              href="http://localhost:3000"
              className="flex items-center px-6 py-3 hover:bg-blue-700 transition-colors duration-300 w-full"
            >
              <MdOutlineQuiz className="mr-2" />
              <span className={`${!isSidebarOpen && 'hidden'} md:inline`}>Aptitude Test</span>
            </a>
            <a
              href="https://www.glassdoor.co.in/Community/index.html"
              className="flex items-center px-6 py-3 hover:bg-blue-700 transition-colors duration-300 w-full"
            >
              <MdWorkOutline className="mr-2" />
              <span className={`${!isSidebarOpen && 'hidden'} md:inline`}>Internships</span>
            </a>
            <a
              href="https://sggsplacements.in/"
              className="flex items-center px-6 py-3 hover:bg-blue-700 transition-colors duration-300 w-full"
            >
              <MdAssessment className="mr-2" />
              <span className={`${!isSidebarOpen && 'hidden'} md:inline`}>Placement Report</span>
            </a>
            <a
              href="https://iccpm.com/training-development/online-workshop-webinars/"
              className="flex items-center px-6 py-3 hover:bg-blue-700 transition-colors duration-300 w-full"
            >
              <MdWeb className="mr-2" />
              <span className={`${!isSidebarOpen && 'hidden'} md:inline`}>WorkShop/Webinar</span>
            </a>
            <a
              href="https://www.sggs.ac.in/"
              className="flex items-center px-6 py-3 hover:bg-blue-700 transition-colors duration-300 w-full"
            >
              <MdEventAvailable className="mr-2" />
              <span className={`${!isSidebarOpen && 'hidden'} md:inline`}>Achivement</span>
            </a>
          </nav>
        </div>
        <div className={`${isSidebarOpen ? 'block' : 'hidden'} md:block p-6 text-sm text-center`}>
          &copy; 2024 Application Portal
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center bg-gray-100 p-5 md:p-20">
        {showEmailVerification ? (
          <EmailVerification />
        ) : (
          <img
            src="/home.jpg"
            alt="Right Side Content"
            className="rounded-lg shadow-lg max-w-full max-h-full"
          />
        )}
      </div>
    </div>
  );
};

export default Home;
