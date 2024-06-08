import React from "react";
import { Link } from "react-router-dom"; // Make sure to import Link from react-router-dom
import EmailVerification from "../components/EmailVerification";
import "./Home.css"; 

const Home = () => {
  return (
    <div className="home-container">
      <div className="email-verification-container">
        <EmailVerification />
      </div>
      <div className="new-application-link">
        <Link to="/newApplicant">New Application</Link>
      </div>
    </div>
  );
};

export default Home;
