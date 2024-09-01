import axios from "axios";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Modal from 'react-modal';
import 'tailwindcss/tailwind.css';

Modal.setAppElement('#root');

const JobApplicationForm = () => {
  const [formData, setFormData] = useState({
    reg: "",
    fullName: "",
    email: "",
    phone: "",
    cgpa: "",
    cgpaProof: null,
    dob: "",
    gender: "",
    ssc: "",
    sscProof: null,
    hsc: "",
    hscProof: null,
    projects: "",
    internship: "",
    internshipProof: null,
    branch: "CSE",
    gap_year: "",
    gap_yearProof: null,
    address: "",
    skills: "",
    references: "",
    backlogs: "",
    profilePhotoProof: null
  });

  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const branchesArray = ["EXTC", "Mech", "CSE", "Civil", "Elect","IT","Text","Chem","INST","Prod"];

  useEffect(() => {
    setOtpSent(false);
    setOtpVerified(false);
  }, [formData.email]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    let maxSize = 1 * 1024 * 1024; // 1 MB in bytes for most files
    let allowedTypes = ['application/pdf']; // Default allowed types for most files

    if (name === "cgpaProof") {
      maxSize = 5 * 1024 * 1024; // 5 MB for CGPA proof
    } else if (name === "profilePhotoProof") {
      maxSize = 5 * 1024 * 1024; // 5 MB for profile photo
      allowedTypes = ['image/jpeg', 'image/png']; // Allowed types for profile photo
    }

    if (file.size > maxSize) {
      toast.error(`File size for ${name} should be less than ${maxSize / (1024 * 1024)} MB`);
    } else if (!allowedTypes.includes(file.type)) {
      toast.error(`Invalid file type for ${name}. Allowed types: ${allowedTypes.join(', ')}`);
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: file
      }));
    }
  };

  const sendOtp = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post(`http://localhost:4000/api/v1/sendOtp`, { email: formData.email });
      setOtpSent(true);
      toast.success("OTP sent to your email");
    } catch (error) {
      console.log(error);
      toast.error("Failed to send OTP");
    }
    setLoading(false);
  };

  const verifyOtp = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post(`http://localhost:4000/api/v1/verifyOtp`, { email: formData.email, otp });
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
    setLoading(false);
  };

  const handleJobApplication = async (e) => {
    e.preventDefault();
    if (!otpVerified) {
      toast.error("Please verify your email with the OTP sent to you");
      return;
    }
    setLoading(true);
    try {
      const form = new FormData();
      Object.keys(formData).forEach(key => {
        form.append(key, formData[key]);
      });

      const { data } = await axios.post(
        `http://localhost:4000/api/v1/jobApplication/post`,
        form,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      toast.success(data.message);
      setFormData({
        reg: "",
        fullName: "",
        email: "",
        phone: "",
        cgpa: "",
        cgpaProof: null,
        dob: "",
        gender: "",
        ssc: "",
        sscProof: null,
        hsc: "",
        hscProof: null,
        projects: "",
        internship: "",
        internshipProof: null,
        branch: "CSE",
        gap_year: "",
        gap_yearProof: null,
        address: "",
        skills: "",
        references: "",
        backlogs: "",
        profilePhotoProof: null
      });
      setOtp("");
      setOtpSent(false);
      setOtpVerified(false);
      setFormSubmitted(true);
    } catch (error) {
      toast.error(error.response.data.message);
    }
    setLoading(false);
  };

  const handleResetForm = () => {
    setFormSubmitted(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setOtpSent(false); // Reset otpSent when modal is closed without verifying
  };

  return (
    <>
      <h2 className="text-2xl font-bold text-center my-4">Student Data Form</h2>
      <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg">
        {!formSubmitted ? (
          <form onSubmit={handleJobApplication} className="space-y-6">
            <InputField label="Registration Number" name="reg" value={formData.reg} onChange={handleChange} disabled={loading} />
            <InputField label="Full Name" name="fullName" value={formData.fullName} onChange={handleChange} disabled={loading} />
            <InputField label="Email" type="email" name="email" value={formData.email} onChange={handleChange} disabled={loading} />
            <button 
              type="button" 
              onClick={() => { sendOtp(); setIsModalOpen(true); }} 
              disabled={otpSent || otpVerified || loading}
              className={`py-2 px-4 rounded ${otpVerified ? "bg-green-500" : "bg-blue-500"} text-white`}
            >
              {otpVerified ? "Verified" : "Verify"}
            </button>
            <InputField label="Mobile Number" name="phone" value={formData.phone} onChange={handleChange} disabled={loading} />
            <InputField label="CGPA" type="number" name="cgpa" value={formData.cgpa} onChange={handleChange} disabled={loading} />
            <FileInput label="Upload CGPA Proof" name="cgpaProof" onChange={handleFileChange} disabled={loading} />
            <InputField label="Date of Birth" type="date" name="dob" value={formData.dob} onChange={handleChange} disabled={loading} />
            <SelectField label="Gender" name="gender" value={formData.gender} options={["", "Male", "Female", "Other"]} onChange={handleChange} disabled={loading} />
            <InputField label="SSC Percentage" type="number" name="ssc" value={formData.ssc} onChange={handleChange} disabled={loading} />
            <FileInput label="Upload SSC Proof" name="sscProof" onChange={handleFileChange} disabled={loading} />
            <InputField label="HSC Percentage" type="number" name="hsc" value={formData.hsc} onChange={handleChange} disabled={loading} />
            <FileInput label="Upload HSC Proof" name="hscProof" onChange={handleFileChange} disabled={loading} />
            <InputField label="No of Backlogs" type="number" name="backlogs" value={formData.backlogs} onChange={handleChange} disabled={loading} />
            <InputField label="Projects" name="projects" value={formData.projects} onChange={handleChange} disabled={loading} />
            <InputField label="Internships" name="internship" value={formData.internship} onChange={handleChange} disabled={loading} />
            <FileInput label="Upload Internship Proof" name="internshipProof" onChange={handleFileChange} disabled={loading} />
            <InputField label="Gap Year" type="number" name="gap_year" value={formData.gap_year} onChange={handleChange} disabled={loading} />
            <FileInput label="Upload Gap Year Proof" name="gap_yearProof" onChange={handleFileChange} disabled={loading} />
            <FileInput label="Upload Profile Photo" name="profilePhotoProof" onChange={handleFileChange} disabled={loading} />
            <SelectField label="Branch" name="branch" value={formData.branch} options={branchesArray} onChange={handleChange} disabled={loading} />
            <TextAreaField label="Address" name="address" value={formData.address} onChange={handleChange} disabled={loading} />
            <TextAreaField label="Skills" name="skills" value={formData.skills} onChange={handleChange} disabled={loading} />
            <TextAreaField label="References" name="references" value={formData.references} onChange={handleChange} disabled={loading} />
            <button 
              type="submit" 
              disabled={!otpVerified || loading}
              className="py-2 px-4 rounded bg-blue-500 text-white hover:bg-blue-700"
            >
              {loading ? "Submitting..." : "Submit Application"}
            </button>
          </form>
        ) : (
          <button onClick={handleResetForm} className="py-2 px-4 rounded bg-green-500 text-white hover:bg-green-700">Submit Again</button>
        )}

        <Modal
          isOpen={isModalOpen}
          onRequestClose={handleCloseModal}
          contentLabel="OTP Verification"
          className="modal bg-white p-6 rounded-lg shadow-lg"
          overlayClassName="modal-overlay fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center"
        >
          <h2 className="text-xl font-bold mb-4">OTP Verification</h2>
          <div className="space-y-4">
            <label className="block">OTP</label>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              disabled={loading}
              className="w-full p-2 border border-gray-300 rounded"
            />
            <button 
              type="button" 
              onClick={verifyOtp} 
              disabled={loading}
              className="py-2 px-4 rounded bg-blue-500 text-white hover:bg-blue-700"
            >
              {loading ? "Wait..." : "Verify OTP"}
            </button>
          </div>
        </Modal>
      </div>
    </>
  );
};

const InputField = ({ label, type = "text", name, value, onChange, disabled }) => (
  <div className="flex flex-col">
    <label className="font-semibold mb-2">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      placeholder={label}
      className="p-2 border border-gray-300 rounded"
    />
  </div>
);

const FileInput = ({ label, name, onChange, disabled }) => (
  <div className="flex flex-col">
    <label className="font-semibold mb-2">{label}</label>
    <input
      type="file"
      name={name}
      onChange={onChange}
      disabled={disabled}
      className="p-2 border border-gray-300 rounded"
    />
  </div>
);

const SelectField = ({ label, name, value, options, onChange, disabled }) => (
  <div className="flex flex-col">
    <label className="font-semibold mb-2">{label}</label>
    <select 
      name={name} 
      value={value} 
      onChange={onChange} 
      disabled={disabled} 
      className="p-2 border border-gray-300 rounded"
    >
      {options.map((option, index) => (
        <option value={option} key={index}>
          {option}
        </option>
      ))}
    </select>
  </div>
);

const TextAreaField = ({ label, name, value, onChange, disabled }) => (
  <div className="flex flex-col">
    <label className="font-semibold mb-2">{label}</label>
    <textarea
      rows="4"
      name={name}
      value={value}
      onChange={onChange}
      placeholder={label}
      disabled={disabled}
      className="p-2 border border-gray-300 rounded"
    />
  </div>
);

export default JobApplicationForm;
