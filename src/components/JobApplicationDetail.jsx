import React, { useEffect, useState } from "react";
import "./JobApplicationDetail.css";
import { FaEye, FaEdit, FaSave } from "react-icons/fa";
import Modal from "react-modal";

// const baseURL = process.env.BASE_URL || "http://localhost:4000";

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

  return (
    <>
      <div className="job-application-detail">
        <div className="header">
          <h1>Job Application Detail</h1>
        </div>
        <div className="details-container">
          <section className="detail-card">
            <h2>Personal Information</h2>
            {["fullName", "email", "phone", "dob", "gender", "address"].map(
              (field) => (
                <div key={field} className="field">
                  <strong>
                    {field.charAt(0).toUpperCase() + field.slice(1)}:
                  </strong>
                  {editMode[field] ? (
                    field === "dob" ? (
                      <input
                        type="date"
                        value={jobApplication[field]}
                        onChange={(e) => handleInputChange(e, field)}
                      />
                    ) : field === "gender" ? (
                      <select
                        value={jobApplication[field]}
                        onChange={(e) => handleInputChange(e, field)}
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    ) : field === "address" ? (
                      <textarea
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
                  <FaEdit
                    onClick={() => toggleEditMode(field)}
                    className="edit-icon"
                  />
                  {editMode[field] && (
                    <FaSave
                      onClick={() => saveChanges(field)}
                      className="save-icon"
                    />
                  )}
                </div>
              )
            )}
          </section>
          <section className="detail-card">
            <h2>Educational Background</h2>
            {["cgpa", "ssc", "hsc"].map((field) => (
              <div key={field} className="field">
                <strong>{field.toUpperCase()}:</strong>
                {editMode[field] ? (
                  <input
                    type="text"
                    value={jobApplication[field]}
                    onChange={(e) => handleInputChange(e, field)}
                  />
                ) : (
                  <span>{jobApplication[field]}</span>
                )}
                <FaEdit
                  onClick={() => toggleEditMode(field)}
                  className="edit-icon"
                />
                {editMode[field] && (
                  <FaSave
                    onClick={() => saveChanges(field)}
                    className="save-icon"
                  />
                )}
              </div>
            ))}
            {["cgpaProof", "sscProof", "hscProof"].map((field) => (
              <div key={field} className="field">
                <strong>{field.replace("Proof", "").toUpperCase()} Proof:</strong>
                {editMode[field] ? (
                  <>
                    <input
                      type="file"
                      onChange={(e) => handleInputChange(e, field)}
                    />
                    <FaSave
                      onClick={() => saveChanges(field)}
                      className="save-icon"
                    />
                  </>
                ) : (
                  <FaEye
                    className="eye-icon"
                    onClick={() => openModal(jobApplication[field]?.url)}
                  />
                )}
                <FaEdit
                  onClick={() => toggleEditMode(field)}
                  className="edit-icon"
                />
              </div>
            ))}
          </section>
          <section className="detail-card">
            <h2>Professional Experience</h2>
            {["projects", "internship"].map((field) => (
              <div key={field} className="field">
                <strong>
                  {field.charAt(0).toUpperCase() + field.slice(1)}:
                </strong>
                {editMode[field] ? (
                  <textarea
                    value={jobApplication[field]}
                    onChange={(e) => handleInputChange(e, field)}
                  />
                ) : (
                  <span>{jobApplication[field]}</span>
                )}
                <FaEdit
                  onClick={() => toggleEditMode(field)}
                  className="edit-icon"
                />
                {editMode[field] && (
                  <FaSave
                    onClick={() => saveChanges(field)}
                    className="save-icon"
                  />
                )}
              </div>
            ))}
          </section>
          <section className="detail-card">
            <h2>Additional Information</h2>
            {["branch", "skills", "references"].map((field) => (
              <div key={field} className="field">
                <strong>
                  {field.charAt(0).toUpperCase() + field.slice(1)}:
                </strong>
                {editMode[field] ? (
                  <textarea
                    value={jobApplication[field]}
                    onChange={(e) => handleInputChange(e, field)}
                  />
                ) : (
                  <span>{jobApplication[field]}</span>
                )}
                <FaEdit
                  onClick={() => toggleEditMode(field)}
                  className="edit-icon"
                />
                {editMode[field] && (
                  <FaSave
                    onClick={() => saveChanges(field)}
                    className="save-icon"
                  />
                )}
              </div>
            ))}
          </section>
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
            width: "80%",
            height: "80%",
          },
        }}
      >
        <button onClick={closeModal} className="close-modal-button">
          Close
        </button>
        <div className="proof-content">
          <img src={proofUrl} alt="Proof Document" style={{ width: "100%" }} />
          <div>
            <a href={proofUrl} target="_blank" rel="noopener noreferrer">
              Open Document
            </a>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default JobApplicationDetail;
