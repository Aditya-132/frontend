import React, { useState, useEffect } from "react";
import axios from "axios";

const TestComponent = () => {
  const [step, setStep] = useState(1);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [branch, setBranch] = useState("");
  const [regNo, setRegNo] = useState("");
  const [testId, setTestId] = useState("");
  const [tests, setTests] = useState([]);
  const [test, setTest] = useState(null);
  const [responses, setResponses] = useState({});

  useEffect(() => {
    // Fetch available tests
    axios.get("/api/tests").then((response) => {
      setTests(response.data.tests);
    });
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();

    const userData = {
      firstName,
      lastName,
      email,
      branch,
      regNo,
      testId,
    };

    try {
      const response = await axios.post("/api/register", userData);
      setTest(response.data.test);
      setStep(2); // Move to the test-taking step
    } catch (error) {
      console.error("Error registering user:", error);
    }
  };

  const handleOptionChange = (questionId, answer) => {
    setResponses((prevResponses) => ({
      ...prevResponses,
      [questionId]: answer,
    }));
  };

  const handleSubmitTest = async (e) => {
    e.preventDefault();

    const formattedResponses = Object.keys(responses).map((questionId) => ({
      questionId,
      answer: responses[questionId],
    }));

    try {
      await axios.post("/api/submit-responses", {
        userId: test.user._id,
        testId: test._id,
        responses: formattedResponses,
      });
      alert("Test submitted successfully!");
      setStep(3); // Move to submission confirmation
    } catch (error) {
      console.error("Error submitting test:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex justify-center items-center">
      <div className="max-w-2xl w-full bg-white shadow-lg rounded-lg p-8">
        {step === 1 && (
          <>
            <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
            <form onSubmit={handleRegister} className="space-y-4">
              <input
                type="text"
                placeholder="First Name"
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Last Name"
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Branch"
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Registration Number"
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                value={regNo}
                onChange={(e) => setRegNo(e.target.value)}
                required
              />
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                value={testId}
                onChange={(e) => setTestId(e.target.value)}
                required
              >
                <option value="">Select a Test</option>
                {tests.map((test) => (
                  <option key={test._id} value={test._id}>
                    {test.test_name}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
              >
                Register and Start Test
              </button>
            </form>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="text-2xl font-bold mb-6 text-center">{test.testName}</h2>
            <form onSubmit={handleSubmitTest} className="space-y-6">
              {test.questions.map((question) => (
                <div key={question._id} className="space-y-2">
                  <p className="text-lg font-semibold">{question.question_text}</p>
                  <div className="space-y-2">
                    {question.options.map((option, index) => (
                      <div key={index} className="flex items-center">
                        <input
                          type="radio"
                          id={`question-${question._id}-option-${index}`}
                          name={`question-${question._id}`}
                          value={option}
                          className="mr-2"
                          onChange={() =>
                            handleOptionChange(question._id, option)
                          }
                          required
                        />
                        <label htmlFor={`question-${question._id}-option-${index}`}>
                          {option}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <button
                type="submit"
                className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600"
              >
                Submit Test
              </button>
            </form>
          </>
        )}

        {step === 3 && (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-6">Thank you!</h2>
            <p>Your test has been submitted successfully.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestComponent;
