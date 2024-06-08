import React, { useContext, useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Appointment from "./Pages/Appointment";
import AboutUs from "./Pages/AboutUs";
import Register from "./Pages/Register";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { Context } from "./main";
import Login from "./Pages/Login";
import JobApplicationDetail from "./components/JobApplicationDetail";
import EmailVerification from "./components/EmailVerification";
// import {config} from 'dotenv';




// config({ path: ".env" });
const App = () => {
  const { isAuthenticated, setIsAuthenticated, setUser } =
    useContext(Context);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          "https://backend-1-qebm.onrender.com/api/v1/user/patient/me",
          {
            withCredentials: true,
          }
        );
        setIsAuthenticated(true);
        setUser(response.data.user);
      } catch (error) {
        setIsAuthenticated(false);
        setUser({});
      }
    };
    fetchUser();
  }, [isAuthenticated]);

  return (
    <>
      <Router>
        {/* <Navbar /> */}
        <Routes>
          <Route index path="/" element={<Home />} />
          <Route path="/newApplicant" element={<Appointment />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          {/* <Route index path="/" element={<EmailVerification/>} /> */}
        <Route path="/detail" element={<JobApplicationDetail/>} />
        </Routes>
        {/* <Footer /> */}
        <ToastContainer position="top-center" />
      </Router>
    </>
  );
};

export default App;
