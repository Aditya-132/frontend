import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";
import Modal from 'react-modal';
import './JobApplicationForm.css'; 

Modal.setAppElement('#root'); // Bind modal to your app element

const JobApplicationForm = () => {
  const [formData, setFormData] = useState({
    reg: "",
    fullName: "",
    email: "",
    phone: "",
    cgpa: "",
    dob: "",
    gender: "",
    address: "",
    caste: "",
    gapYears: "",
    careerPlans: "",
    ssc: "",
    sscSchool: "",
    hsc: "",
    hscSchool: "",
    branch: "CSE",
    projects: "",
    internship: "",
    workExperience: "",
    skills: "",
    electiveSubjects: "",
    communicationLanguages: "",
    references: "",
    research: "",
    certifications: "",
    workshops: "",
    achievements: "",
    linkedinProfile: "",
    githubProfile: "",
    portfolio: "",
    preferredLocation: "",
    noticePeriod: "",
    expectedSalary: "",
    currentSalary: "",
    availability: "",
    awards: "",
    hobbies: "",
    extraCurricularActivities: "",
    patents: "",
    professionalMemberships: "",
    languagesKnown: "",
    maritalStatus: "",
    nationality: "",
    passportNumber: "",
    visaStatus: "",
    drivingLicense: "",
    disability: ""
  });

  const [files, setFiles] = useState({
    resume: null,
    idCard: null
  });

  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const branchesArray = ["Electrical", "Mechanical", "CSE", "Civil", "Electronics"];

  const sendOtp = async () => {
    try {
      const { data } = await axios.post(`https://backend-1-qebm.onrender.com/api/v1/sendOtp`, { email: formData.email });
      setOtpSent(true);
      toast.success("OTP sent to your email");
    } catch (error) {
      console.log(error);
      toast.error("Failed to send OTP");
    }
  };

  const verifyOtp = async () => {
    try {
      const { data } = await axios.post(`https://backend-1-qebm.onrender.com/api/v1/verifyOtp`, { email: formData.email, otp });
      if (data.success) {
        setOtpVerified(true);
        setIsModalOpen(false);
        toast.success("OTP verified");
      } else {
        toast.error("Invalid OTP");
      }
    } catch (error) {
      console.log(error);
      toast.error("Invalid OTP");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFiles((prevFiles) => ({ ...prevFiles, [name]: files[0] }));
  };

  const handleJobApplication = async (e) => {
    e.preventDefault();
    if (!otpVerified) {
      toast.error("Please verify your email with the OTP sent to you");
      return;
    }
    try {
      const dataToSubmit = new FormData();
      for (const key in formData) {
        dataToSubmit.append(key, formData[key]);
      }
      for (const key in files) {
        dataToSubmit.append(key, files[key]);
      }

      const { data } = await axios.post(
        `https://backend-1-qebm.onrender.com/api/v1/jobApplication/post`,
        dataToSubmit,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      toast.success(data.message);
      // Reset form fields
      setFormData({
        reg: "",
        fullName: "",
        email: "",
        phone: "",
        cgpa: "",
        dob: "",
        gender: "",
        address: "",
        caste: "",
        gapYears: "",
        careerPlans: "",
        ssc: "",
        sscSchool: "",
        hsc: "",
        hscSchool: "",
        branch: "CSE",
        projects: "",
        internship: "",
        workExperience: "",
        skills: "",
        electiveSubjects: "",
        communicationLanguages: "",
        references: "",
        research: "",
        certifications: "",
        workshops: "",
        achievements: "",
        linkedinProfile: "",
        githubProfile: "",
        portfolio: "",
        preferredLocation: "",
        noticePeriod: "",
        expectedSalary: "",
        currentSalary: "",
        availability: "",
        awards: "",
        hobbies: "",
        extraCurricularActivities: "",
        patents: "",
        professionalMemberships: "",
        languagesKnown: "",
        maritalStatus: "",
        nationality: "",
        passportNumber: "",
        visaStatus: "",
        drivingLicense: "",
        disability: ""
      });
      setFiles({
        resume: null,
        idCard: null
      });
      setOtp("");
      setOtpSent(false);
      setOtpVerified(false);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <>
      <h2>Profile</h2>
      <div className="container1 form-component job-application-form">
        <form onSubmit={handleJobApplication}>
          <div>
            <label>Registration Number</label>
            <input
              type="text"
              name="reg"
              placeholder="Registration Number"
              value={formData.reg}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Full Name</label>
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
            />
            <button 
              type="button" 
              onClick={() => { sendOtp(); setIsModalOpen(true); }} 
              disabled={otpSent || otpVerified}
              style={{ backgroundColor: otpVerified ? "green" : "" }}
            >
              {otpVerified ? "Verified" : "Verify"}
            </button>
          </div>
          <div>
            <label>Mobile Number</label>
            <input
              type="text"
              name="phone"
              placeholder="Mobile Number"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>CGPA</label>
            <input
              type="number"
              name="cgpa"
              placeholder="CGPA"
              value={formData.cgpa}
              onChange={handleChange}
            />
            <label>Upload CGPA Proof</label>
            <input
              type="file"
              name="cgpaProof"
              onChange={handleFileChange}
            />
          </div>
          <div>
            <label>Date of Birth</label>
            <input
              type="date"
              name="dob"
              placeholder="Date of Birth"
              value={formData.dob}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label>SSC Percentage</label>
            <input
              type="number"
              name="ssc"
              placeholder="SSC Percentage"
              value={formData.ssc}
              onChange={handleChange}
            />
            <label>Upload SSC Proof</label>
            <input
              type="file"
              name="sscProof"
              onChange={handleFileChange}
            />
          </div>
          <div>
            <label>HSC Percentage</label>
            <input
              type="number"
              name="hsc"
              placeholder="HSC Percentage"
              value={formData.hsc}
              onChange={handleChange}
            />
            <label>Upload HSC Proof</label>
            <input
              type="file"
              name="hscProof"
              onChange={handleFileChange}
            />
          </div>
          <div>
            <label>Projects</label>
            <input
              type="text"
              name="projects"
              placeholder="Projects"
              value={formData.projects}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Internships</label>
            <input
              type="text"
              name="internship"
              placeholder="Internships"
              value={formData.internship}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Branch</label>
            <select
              name="branch"
              value={formData.branch}
              onChange={handleChange}
            >
              {branchesArray.map((branch, index) => (
                <option value={branch} key={index}>
                  {branch}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Address</label>
            <textarea
              name="address"
              rows="4"
              value={formData.address}
              onChange={handleChange}
              placeholder="Address"
            />
          </div>
          <div>
            <label>Skills</label>
            <textarea
              name="skills"
              rows="4"
              value={formData.skills}
              onChange={handleChange}
              placeholder="Skills"
            />
          </div>
          <div>
            <label>References</label>
            <textarea
              name="references"
              rows="4"
              value={formData.references}
              onChange={handleChange}
              placeholder="References"
            />
          </div>
          <button type="submit" disabled={!otpVerified}>Submit Application</button>
        </form>

        <Modal
          isOpen={isModalOpen}
          onRequestClose={() => setIsModalOpen(false)}
          contentLabel="OTP Verification"
        >
          <h2>OTP Verification</h2>
          <div>
            <label>OTP</label>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button type="button" onClick={verifyOtp}>
              Verify OTP
            </button>
          </div>
        </Modal>
      </div>
    </>
  );
};

export default JobApplicationForm;
