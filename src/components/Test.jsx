import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TestComponent = () => {
  const [step, setStep] = useState(1); // 1: Register, 2: Test Selection, 3: Answer Questions, 4: Show Score
  const [userData, setUserData] = useState({ firstName: '', lastName: '', email: '', branch: '', regNo: '', testId: '' });
  const [tests, setTests] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState([]);
  const [score, setScore] = useState(null);

  // Fetch available tests on load
  useEffect(() => {
    const fetchTests = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/v1/test/test'); // Replace with your API endpoint to fetch tests
        setTests(response.data.tests);
      } catch (error) {
        console.error('Error fetching tests:', error);
      }
    };

    fetchTests();
  }, []);

  // Handle input changes for form fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handle user registration and test selection
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:4000/api/v1/test/register', userData);
      setStep(2); // Move to test selection step
    } catch (error) {
      console.error('Error registering user:', error);
    }
  };

  // Fetch questions for selected test
  const handleTestSelection = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`/api/test/${userData.testId}/questions`);
      setQuestions(response.data.questions);
      setStep(3); // Move to answer questions step
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  // Handle answer selection
  const handleAnswerSelection = (questionId, answer) => {
    setResponses((prevResponses) => ({
      ...prevResponses,
      [questionId]: answer,
    }));
  };

  // Submit responses and calculate score
  const handleSubmitResponses = async (e) => {
    e.preventDefault();
    const formattedResponses = questions.map((question) => ({
      questionId: question._id,
      answer: responses[question._id],
    }));

    try {
      const response = await axios.post('/api/submit-responses', {
        userId: userData.userId,
        testId: userData.testId,
        responses: formattedResponses,
      });
      setScore(response.data.score);
      setStep(4); // Move to show score step
    } catch (error) {
      console.error('Error submitting responses:', error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      {step === 1 && (
        <div className="w-full max-w-md mx-auto">
          <h2 className="text-2xl font-bold mb-4">Register and Select Test</h2>
          <form onSubmit={handleRegister}>
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={userData.firstName}
              onChange={handleInputChange}
              className="border rounded w-full p-2 mb-4"
              required
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={userData.lastName}
              onChange={handleInputChange}
              className="border rounded w-full p-2 mb-4"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={userData.email}
              onChange={handleInputChange}
              className="border rounded w-full p-2 mb-4"
              required
            />
            <input
              type="text"
              name="branch"
              placeholder="Branch"
              value={userData.branch}
              onChange={handleInputChange}
              className="border rounded w-full p-2 mb-4"
              required
            />
            <input
              type="text"
              name="regNo"
              placeholder="Registration Number"
              value={userData.regNo}
              onChange={handleInputChange}
              className="border rounded w-full p-2 mb-4"
              required
            />
            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Register
            </button>
          </form>
        </div>
      )}

      {step === 2 && (
        <div className="w-full max-w-md mx-auto">
          <h2 className="text-2xl font-bold mb-4">Select a Test</h2>
          <form onSubmit={handleTestSelection}>
            <select
              name="testId"
              value={userData.testId}
              onChange={handleInputChange}
              className="border rounded w-full p-2 mb-4"
              required
            >
              <option value="" disabled>Select a Test</option>
              {tests.map((test) => (
                <option key={test._id} value={test._id}>{test.test_name}</option>
              ))}
            </select>
            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Start Test
            </button>
          </form>
        </div>
      )}

      {step === 3 && (
        <div className="w-full max-w-md mx-auto">
          <h2 className="text-2xl font-bold mb-4">Answer Questions</h2>
          <form onSubmit={handleSubmitResponses}>
            {questions.map((question) => (
              <div key={question._id} className="mb-4">
                <p className="font-semibold">{question.question_text}</p>
                {question.options.map((option, index) => (
                  <div key={index}>
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name={`question-${question._id}`}
                        value={option}
                        onChange={() => handleAnswerSelection(question._id, option)}
                        className="form-radio"
                        required
                      />
                      <span>{option}</span>
                    </label>
                  </div>
                ))}
              </div>
            ))}
            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Submit Answers
            </button>
          </form>
        </div>
      )}

      {step === 4 && score !== null && (
        <div className="w-full max-w-md mx-auto">
          <h2 className="text-2xl font-bold mb-4">Your Score</h2>
          <p className="text-xl">You scored {score} out of {questions.length}</p>
        </div>
      )}
    </div>
  );
};

export default TestComponent;
