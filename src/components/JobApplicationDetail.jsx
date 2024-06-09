import React, { useEffect, useState } from "react";
import "./JobApplicationDetail.css";
import { FaEye, FaEdit, FaSave } from "react-icons/fa";
import Modal from "react-modal";

const JobApplicationDetail = ({ email }) => {
  const [jobApplication, setJobApplication] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [proofUrl, setProofUrl] = useState("");
  const [editMode, setEditMode] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchJobApplication = async () => {
      try {
        const response = await fetch(
          `https://backend-1-qebm.onrender.com/api/v1/jobApplication/details/${email}`,
          {
            credentials: "include",
          }
        );
        const data = await response.json();
        setJobApplication(data.jobApplication);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching job application details:", error);
        setIsLoading(false);
      }
    };
    fetchJobApplication();
  }, [email]);

  const openModal = (url) => {
    if (url.endsWith(".pdf")) {
      window.open(url, "_blank");
    } else {
      setProofUrl(url);
      setModalIsOpen(true);
    }
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setProofUrl("");
  };

  const toggleEditMode = (field) => {
    setEditMode((prevEditMode) => ({
      ...prevEditMode,
      [field]: !prevEditMode[field],
    }));
  };

  const handleInputChange = (e, field) => {
    const value = e.target.type === "file" ? e.target.files[0] : e.target.value;
    setJobApplication({ ...jobApplication, [field]: value });
  };

  const saveChanges = async (field) => {
    try {
      const formData = new FormData();
      formData.append(field, jobApplication[field]);

      const endpoint = `https://backend-1-qebm.onrender.com/api/v1/jobApplication/update/${jobApplication._id}`;
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
    return <div>Loading...</div>;
  }

  if (!jobApplication) {
    return <div>Error loading job application details.</div>;
  }

  const renderField = (field, type = "text", options = []) => (
    <div key={field} className="field">
      <strong>{field.replace(/([A-Z])/g, " $1").toUpperCase()}:</strong>
      {editMode[field] ? (
        type === "textarea" ? (
          <textarea
            value={jobApplication[field]}
            onChange={(e) => handleInputChange(e, field)}
          />
        ) : type === "select" ? (
          <select
            value={jobApplication[field]}
            onChange={(e) => handleInputChange(e, field)}
          >
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        ) : type === "date" ? (
          <input
            type="date"
            value={jobApplication[field]}
            onChange={(e) => handleInputChange(e, field)}
          />
        ) : (
          <input
            type="text"
            value={jobApplication[field]}
            onChange={(e) => handleInputChange(e, field)}
          />
        )
      ) : (
        <span>{jobApplication[field]}</span>
      )}
      <FaEdit onClick={() => toggleEditMode(field)} className="edit-icon" />
      {editMode[field] && (
        <FaSave onClick={() => saveChanges(field)} className="save-icon" />
      )}
    </div>
  );

  const renderProofField = (field) => (
    <div key={field} className="field">
      <strong>{field.replace("Proof", "").toUpperCase()} Proof:</strong>
      {editMode[field] ? (
        <>
          <input type="file" onChange={(e) => handleInputChange(e, field)} />
          <FaSave onClick={() => saveChanges(field)} className="save-icon" />
        </>
      ) : (
        <FaEye className="eye-icon" onClick={() => openModal(jobApplication[field]?.url)} />
      )}
      <FaEdit onClick={() => toggleEditMode(field)} className="edit-icon" />
    </div>
  );

  return (
    <>
      <div className="job-application-detail">
        <div className="header">
          <h1>Job Application Detail</h1>
        </div>
        <div className="details-container">
          {/* Personal Information Section */}
          <section className="detail-card">
            <h2>Personal Information</h2>
            {renderField("reg")}
            {renderField("fullName")}
            {renderField("email")}
            {renderField("phone")}
            {renderField("dob", "date")}
            {renderField("gender", "select", ["Male", "Female", "Other"])}
            {renderField("address", "textarea")}
            {renderField("caste")}
            {renderField("gapYears", "number")}
            {renderField("careerPlans", "textarea")}
          </section>
          {/* Educational Background Section */}
          <section className="detail-card">
            <h2>Educational Background</h2>
            {renderField("cgpa", "number")}
            {renderProofField("cgpaProof")}
            {renderField("ssc", "number")}
            {renderProofField("sscProof")}
            {renderField("sscSchool")}
            {renderField("hsc", "number")}
            {renderProofField("hscProof")}
            {renderField("hscSchool")}
          </section>
          {/* Professional Experience Section */}
          <section className="detail-card">
            <h2>Professional Experience</h2>
            {renderField("branch", "select", ["Electrical", "Mechanical", "CSE", "Civil", "Electronics"])}
            {renderField("projects", "textarea")}
            {renderField("internship", "textarea")}
            {renderField("workExperience", "textarea")}
            {renderField("skills", "textarea")}
            {renderField("electiveSubjects", "textarea")}
            {renderField("communicationLanguages", "textarea")}
          </section>
          {/* Additional Information Section */}
          <section className="detail-card">
            <h2>Additional Information</h2>
            {renderField("references", "textarea")}
            {renderField("research", "textarea")}
            {renderField("hobbies", "textarea")}
            {renderField("extraCurricularActivities", "textarea")}
            {renderField("patents", "textarea")}
            {renderField("professionalMemberships", "textarea")}
            {renderField("languagesKnown", "textarea")}
            {renderField("maritalStatus", "select", ["Single", "Married", "Divorced", "Widowed"])}
            {renderField("nationality")}
            {renderField("passportNumber")}
            {renderField("visaStatus")}
            {renderField("disability", "textarea")}
          </section>
          {/* Social Profiles Section */}
          <section className="detail-card">
            <h2>Social Profiles</h2>
            {renderField("linkedinProfile")}
            {renderField("githubProfile")}
            {renderField("portfolio")}
          </section>
          {/* Job Preferences Section */}
          <section className="detail-card">
            <h2>Job Preferences</h2>
            {renderField("preferredLocation")}
            {renderField("noticePeriod", "number")}
            {renderField("expectedSalary", "number")}
            {renderField("currentSalary", "number")}
            {renderField("availability", "select", ["Immediate", "Within 1 Month", "Within 3 Months"])}
          </section>
          {/* Documents Section */}
          <section className="detail-card">
            <h2>Documents</h2>
            {renderProofField("resume")}
            {renderProofField("idCard")}
            {renderProofField("drivingLicense")}
          </section>
          {/* Additional Documents Section */}
          <section className="detail-card">
            <h2>Additional Documents</h2>
            {jobApplication.certifications.map((certification, index) => (
              renderProofField(`certifications[${index}]`)
            ))}
            {jobApplication.awards.map((award, index) => (
              renderProofField(`awards[${index}]`)
            ))}
            {jobApplication.workshops.map((workshop, index) => (
              renderProofField(`workshops[${index}]`)
            ))}
            {jobApplication.achievements.map((achievement, index) => (
              renderProofField(`achievements[${index}]`)
            ))}
          </section>
        </div>
      </div>
      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} contentLabel="Proof Modal">
        <div className="modal-content">
          <button className="close-modal" onClick={closeModal}>
            Close
          </button>
          <img src={proofUrl} alt="Proof" />
        </div>
      </Modal>
    </>
  );
};

export default JobApplicationDetail;
