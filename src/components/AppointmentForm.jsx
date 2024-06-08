import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";
import Modal from 'react-modal';
import './JobApplicationForm.css'; 


Modal.setAppElement('#root'); // Bind modal to your app element

const JobApplicationForm = () => {
  const [reg, setReg] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [cgpa, setCgpa] = useState("");
  const [cgpaProof, setCgpaProof] = useState(null);
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [ssc, setSsc] = useState("");
  const [sscProof, setSscProof] = useState(null);
  const [hsc, setHsc] = useState("");
  const [hscProof, setHscProof] = useState(null);
  const [projects, setProjects] = useState("");
  const [internship, setInternship] = useState("");
  const [branch, setBranch] = useState("CSE");
  const [address, setAddress] = useState("");
  const [skills, setSkills] = useState("");
  const [references, setReferences] = useState("");

  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const branchesArray = ["Electrical", "Mechanical", "CSE", "Civil", "Electronics"];

  const sendOtp = async () => {
    try {
      const { data } = await axios.post(`https://backend-1-qebm.onrender.com/api/v1/sendOtp`, { email });
      setOtpSent(true);
      toast.success("OTP sent to your email");
    } catch (error) {
      console.log(error);
      toast.error("Failed to send OTP");
    }
  };

  const verifyOtp = async () => {
    try {
      const { data } = await axios.post(`https://backend-1-qebm.onrender.com/api/v1/verifyOtp`, { email, otp });
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

  const handleJobApplication = async (e) => {
    e.preventDefault();
    if (!otpVerified) {
      toast.error("Please verify your email with the OTP sent to you");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("reg", reg);
      formData.append("fullName", fullName);
      formData.append("email", email);
      formData.append("phone", phone);
      formData.append("cgpa", cgpa);
      formData.append("cgpaProof", cgpaProof);
      formData.append("dob", dob);
      formData.append("gender", gender);
      formData.append("ssc", ssc);
      formData.append("sscProof", sscProof);
      formData.append("hsc", hsc);
      formData.append("hscProof", hscProof);
      formData.append("projects", projects);
      formData.append("internship", internship);
      formData.append("branch", branch);
      formData.append("address", address);
      formData.append("skills", skills);
      formData.append("references", references);

      const { data } = await axios.post(
        `https://backend-1-qebm.onrender.com/api/v1/jobApplication/post`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      toast.success(data.message);
      // Reset form fields
      setReg("");
      setFullName("");
      setEmail("");
      setPhone("");
      setCgpa("");
      setCgpaProof(null);
      setDob("");
      setGender("");
      setSsc("");
      setSscProof(null);
      setHsc("");
      setHscProof(null);
      setProjects("");
      setInternship("");
      setBranch("CSE");
      setAddress("");
      setSkills("");
      setReferences("");
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
              placeholder="Registration Number"
              value={reg}
              onChange={(e) => setReg(e.target.value)}
            />
          </div>
          <div>
            <label>Full Name</label>
            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          <div>
            <label>Email</label>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              placeholder="Mobile Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div>
            <label>CGPA</label>
            <input
              type="number"
              placeholder="CGPA"
              value={cgpa}
              onChange={(e) => setCgpa(e.target.value)}
            />
            <label>Upload CGPA Proof</label>
            <input
              type="file"
              onChange={(e) => setCgpaProof(e.target.files[0])}
            />
          </div>
          <div>
            <label>Date of Birth</label>
            <input
              type="date"
              placeholder="Date of Birth"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
            />
          </div>
          <div>
            <label>Gender</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
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
              placeholder="SSC Percentage"
              value={ssc}
              onChange={(e) => setSsc(e.target.value)}
            />
            <label>Upload SSC Proof</label>
            <input
              type="file"
              onChange={(e) => setSscProof(e.target.files[0])}
            />
          </div>
          <div>
            <label>HSC Percentage</label>
            <input
              type="number"
              placeholder="HSC Percentage"
              value={hsc}
              onChange={(e) => setHsc(e.target.value)}
            />
            <label>Upload HSC Proof</label>
            <input
              type="file"
              onChange={(e) => setHscProof(e.target.files[0])}
            />
          </div>
          <div>
            <label>Projects</label>
            <input
              type="text"
              placeholder="Projects"
              value={projects}
              onChange={(e) => setProjects(e.target.value)}
            />
          </div>
          <div>
            <label>Internships</label>
            <input
              type="text"
              placeholder="Internships"
              value={internship}
              onChange={(e) => setInternship(e.target.value)}
            />
          </div>
          <div>
            <label>Branch</label>
            <select
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
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
              rows="4"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Address"
            />
          </div>
          <div>
            <label>Skills</label>
            <textarea
              rows="4"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="Skills"
            />
          </div>
          <div>
            <label>References</label>
            <textarea
              rows="4"
              value={references}
              onChange={(e) => setReferences(e.target.value)}
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
