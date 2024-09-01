import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaEye, FaEdit, FaSave, FaBars, FaTimes } from "react-icons/fa";
import Modal from "react-modal";
import 'tailwindcss/tailwind.css';

const JobApplicationDetail = ({ email }) => {
  const location = useLocation();
  const navigate = useNavigate();
 
  const [jobApplication, setJobApplication] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [proofUrl, setProofUrl] = useState("");
  const [editMode, setEditMode] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [currentSection, setCurrentSection] = useState("personal-information");
  const [menuOpen, setMenuOpen] = useState(false);
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!email) {
      navigate("/check");
    }
  
    const fetchJobApplication = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/v1/jobApplication/details/${email}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          },
          credentials: "include",
        });
        const data = await response.json();
        if (response.ok) {
          setJobApplication(data.jobApplication);
        } else {
          throw new Error(data.message || "Failed to fetch data");
        }
      } catch (error) {
        console.error("Error fetching job application details:", error);
        alert("Error fetching job application details. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    if (email) {
      fetchJobApplication();
    }
  }, [email, navigate]);
  

  const openModal = (url) => {
    if(url==null){
      alert("No URL provided");
      setModalIsOpen(false);
    }
    else{
    setProofUrl(url);
    setModalIsOpen(true);
    }
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setProofUrl("");
  };

  const printDocument = () => {
    const iframe = document.getElementById("pdf-iframe");
    if (iframe) {
      iframe.contentWindow.print();
    }
  };

  const toggleEditMode = (field) => {
    setEditMode((prevEditMode) => ({
      ...prevEditMode,
      [field]: !prevEditMode[field],
    }));
  };

  const handleInputChange = (e, field) => {
    if (jobApplication.status === 'Accepted') {
      alert('You have already been accepted for this job.');
      return;
    }
  
    const { type, value, files } = e.target;
  
    // Ensure that 'files' is not null
    if (type === "file" && files && files.length > 0) {
      const file = files[0];
      const fileSize = file.size / 1024 / 1024; // in MB
      const maxSize = field === 'cgpaProof' ? 5 : 1; // 5 MB for cgpaProof, 1 MB for others
  
      if (fileSize > maxSize) {
        alert(`File size should not exceed ${maxSize} MB.`);
        return;
      }
  
      setJobApplication({ ...jobApplication, [field]: file });
    } else {
      setJobApplication({ ...jobApplication, [field]: value });
    }
  };
  

  const saveChanges = async (field) => {
    try {
      const formData = new FormData();
      formData.append(field, jobApplication[field]);

      const endpoint = `http://localhost:4000/api/v1/jobApplication/update/${jobApplication._id}`;
      const response = await fetch(endpoint, {
        method: "PUT",
        body: formData,
        credentials: "include",
      });

      if (response.ok) {
        const updatedApplication = await response.json();
        setJobApplication(updatedApplication.jobApplication);
        setEditMode({});
      } else {
        const errorData = await response.json();
        console.error("Error saving changes:", errorData);
      }
    } catch (error) {
      console.error("Error saving changes:", error);
    }
  };


  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!jobApplication) {
    return <div className="flex justify-center items-center h-screen">Error loading job application details.</div>;
  }

  const renderField = (field, label, isEditable, inputType = "text") => (
    <div className="field mb-4 flex flex-col md:flex-row items-start md:items-center">
      <strong className="mr-2 w-full md:w-1/4">{label}:</strong>
      {editMode[field] ? (
        inputType === "select" ? (
          <select
            value={jobApplication[field]}
            onChange={(e) => handleInputChange(e, field)}
            className="border border-gray-300 p-2 rounded w-full"
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        ) : inputType === "textarea" ? (
          <textarea
            value={jobApplication[field]}
            onChange={(e) => handleInputChange(e, field)}
            className="border border-gray-300 p-2 rounded w-full"
          />
        ) : (
          <input
            type={inputType}
            value={
              inputType === "date"
                ? jobApplication[field].split("T")[0]
                : jobApplication[field]
            }
            onChange={(e) => handleInputChange(e, field)}
            className="border border-gray-300 p-2 rounded w-full"
          />
        )
      ) : (
        <span className="w-full md:w-3/4">
          {inputType === "date"
            ? new Date(jobApplication[field]).toLocaleDateString()
            : jobApplication[field]}
        </span>
      )}
      {isEditable && (
        <div className="flex mt-2 md:mt-0">
          <FaEdit
            onClick={() => toggleEditMode(field)}
            className="ml-2 cursor-pointer text-gray-500"
          />
          {editMode[field] && (
            <FaSave
              onClick={() => saveChanges(field)}
              className="ml-2 cursor-pointer text-gray-500"
            />
          )}
        </div>
      )}
    </div>
  );

  const renderFileField = (field, label, acceptType) => (
    <div className="field mb-4 flex flex-col md:flex-row items-start md:items-center">
      <strong className="mr-2 w-full md:w-1/4">{label} Proof:</strong>
      {editMode[field] ? (
        <div className="w-full md:w-3/4 flex items-center">
          <input
            type="file"
            onChange={(e) => handleInputChange(e, field)}
            accept={acceptType}
            className="border border-gray-300 p-2 rounded w-full"
          />
          <FaSave
            onClick={() => saveChanges(field)}
            className="ml-2 cursor-pointer text-gray-500"
          />
        </div>
      ) : (
        <div className="flex mt-2 md:mt-0">
          <FaEye
            className="ml-2 cursor-pointer text-gray-500"
            onClick={() => openModal(jobApplication[field]?.url)}
          />
          <FaEdit
            onClick={() => toggleEditMode(field)}
            className="ml-2 cursor-pointer text-gray-500"
          />
        </div>
      )}
    </div>
  );

  const getStatusStyles = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "Approved":
        return "bg-green-100 text-green-700";
      case "Rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const renderStatus = (status) => (
    <div className={`status-indicator p-2 rounded ${getStatusStyles(status)}`}>
      {status}
    </div>
  );

  return (
    <>
      <div className="job-application-detail p-6 bg-white shadow-lg rounded-lg max-w-4xl mx-auto">
        <div className="header mb-6 text-center flex justify-between items-center">
          <h1 className="text-3xl font-bold">Data Profile Detail</h1>
          {renderStatus(jobApplication.status)}
        </div>
        <div className="profile-header flex flex-col md:flex-row items-center mb-6">
          <div className="profile-photo mr-4 mb-4 md:mb-0">
            <img
              src={jobApplication.profilePhotoProof?.url || "default-profile-photo.jpg"}
              alt="Profile"
              className="rounded-full w-24 h-24"
            />
          </div>
          <div className="profile-info text-center md:text-left">
            <h2 className="text-2xl font-semibold">{jobApplication.fullName}</h2>
            <p className="text-gray-600">{jobApplication.email}</p>
            <p className="text-gray-600">{jobApplication.phone}</p>
          </div>
        </div>
        <div className="navbar mb-6">
          <div className="flex justify-between items-center md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-2xl"
            >
              {menuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
          <ul className={`md:flex space-x-4 justify-center text-lg ${menuOpen ? "block" : "hidden"} md:block`}>
            <li>
              <button
                onClick={() => {
                  setCurrentSection("personal-information");
                  setMenuOpen(false);
                }}
                className={`${
                  currentSection === "personal-information" ? "text-blue-600" : "text-blue-500"
                } hover:underline px-4 py-2 rounded-lg ${
                  currentSection === "personal-information" ? "text-blue-500" : ""
                }`}
              >
                Personal Information
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  setCurrentSection("educational-background");
                  setMenuOpen(false);
                }}
                className={`${
                  currentSection === "educational-background" ? "text-blue-600" : "text-blue-500"
                } hover:underline px-4 py-2 rounded-lg ${
                  currentSection === "educational-background" ? "text-blue-500" : ""
                }`}
              >
                Educational Background
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  setCurrentSection("professional-experience");
                  setMenuOpen(false);
                }}
                className={`${
                  currentSection === "professional-experience" ? "text-blue-600" : "text-blue-500"
                } hover:underline px-4 py-2 rounded-lg ${
                  currentSection === "professional-experience" ? "text-blue-500" : ""
                }`}
              >
                Professional Experience
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  setCurrentSection("additional-information");
                  setMenuOpen(false);
                }}
                className={`${
                  currentSection === "additional-information" ? "text-blue-600" : "text-blue-500"
                } hover:underline px-4 py-2 rounded-lg ${
                  currentSection === "additional-information" ? "text-blue-500" : ""
                }`}
              >
                Additional Information
              </button>
            </li>
          </ul>
        </div>
        <div className="details-container space-y-6">
          {currentSection === "personal-information" && (
            <section className="detail-card p-4 bg-gray-100 rounded">
              <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
              {renderField("fullName", "Name", true)}
              {renderField("email", "Email", false)}
              {renderField("dob", "Date of Birth", true, "date")}
              {renderField("gender", "Gender", true, "select")}
              {renderField("address", "Address", true, "textarea")}
            </section>
          )}
          {currentSection === "educational-background" && (
            <section className="detail-card p-4 bg-gray-100 rounded">
              <h2 className="text-xl font-semibold mb-4">Educational Background</h2>
              {renderField("cgpa", "CGPA", true)}
              {renderField("ssc", "SSC", true)}
              {renderField("hsc", "HSC", true)}
              {renderField("gap_year", "Gap Year", true)}
              {renderField("backlogs", "Backlogs", true)}
              {renderFileField("cgpaProof", "CGPA", "application/pdf")}
              {renderFileField("sscProof", "SSC", "application/pdf")}
              {renderFileField("hscProof", "HSC", "application/pdf")}
              {renderFileField("gap_yearProof", "Gap Year", "application/pdf")}
              {renderFileField("profilePhotoProof", "Profile Photo", "image/jpeg,image/png,image/jpg")}
            </section>
          )}
          {currentSection === "professional-experience" && (
            <section className="detail-card p-4 bg-gray-100 rounded">
              <h2 className="text-xl font-semibold mb-4">Professional Experience</h2>
              {renderField("projects", "Projects", true, "textarea")}
              {renderField("internship", "Internship", true)}
              {renderFileField("internshipProof", "Internship", "application/pdf")}
            </section>
          )}
          {currentSection === "additional-information" && (
            <section className="detail-card p-4 bg-gray-100 rounded">
              <h2 className="text-xl font-semibold mb-4">Additional Information</h2>
              {renderField("branch", "Branch", true)}
              {renderField("skills", "Skills", true, "textarea")}
              {renderField("references", "References", true, "textarea")}
              {renderField("message", "Message", false, "textarea")}
            </section>
          )}
        </div>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Proof Modal"
        style={{
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            width: "90%",
            height: "90%",
            maxWidth: "800px",
          },
        }}
      >
        <button onClick={closeModal} className="close-modal-button text-red-500">
          Close
        </button>
        <div className="proof-content w-full h-full">
          {proofUrl.endsWith(".pdf") ? (
            <div className="w-full h-full flex flex-col">
              <iframe
                id="pdf-iframe"
                src={proofUrl}
                className="w-full h-full flex-grow"
              />
            </div>
          ) : (
            <div>
              <img src={proofUrl} alt="Proof Document" className="w-full h-auto" />
              <div className="text-center mt-4">
                <a href={proofUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                  Open Document
                </a>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
};

export default JobApplicationDetail;
