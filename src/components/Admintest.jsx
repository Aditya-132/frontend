import React, { useState } from 'react';
import axios from 'axios';

const AdminTestManagement = () => {
  const [step, setStep] = useState(1); // Step 1: Create Test, Step 2: Add Questions
  const [testId, setTestId] = useState('');
  const [testName, setTestName] = useState('');
  const [description, setDescription] = useState('');
  const [questionText, setQuestionText] = useState('');
  const [options, setOptions] = useState({ A: '', B: '', C: '', D: '' });
  const [correctOption, setCorrectOption] = useState('');
  const [message, setMessage] = useState('');

  // Handle test creation
  const handleCreateTest = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:4000/api/v1/test/admin/create-test', {
        testName: testName,
        description,
      });
      setTestId(response.data.test._id);
      setStep(2); // Move to step 2 (Add Questions)
      setMessage(`Test Created: ${response.data.test.test_name}`);
    } catch (error) {
      setMessage('Error creating test');
    }
  };

  // Handle adding questions to the created test
  const handleAddQuestion = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`http://localhost:4000/api/v1/test/admin/add-question/${testId}`, {
        testId: testId,
        questionText: questionText,
        options: [options.A, options.B, options.C, options.D], // Ensure this is an array
        correctOption: correctOption,
      });
      setMessage(`Question Added:`);
      setQuestionText('');
      setOptions({ A: '', B: '', C: '', D: '' });
      setCorrectOption('');
    } catch (error) {
      console.log(error);
      setMessage('Error adding question');
    }
  };
  

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-center mb-6">Test Management System</h1>
        {step === 1 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Create Test</h2>
            <form onSubmit={handleCreateTest}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Test Name:</label>
                <input
                  type="text"
                  value={testName}
                  onChange={(e) => setTestName(e.target.value)}
                  required
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Description:</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
              >
                Create Test
              </button>
            </form>
          </div>
        )}
        {step === 2 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Add Questions to Test: {testName}</h2>
            <form onSubmit={handleAddQuestion}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Question Text:</label>
                <input
                  type="text"
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  required
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Option A:</label>
                <input
                  type="text"
                  value={options.A}
                  onChange={(e) => setOptions({ ...options, A: e.target.value })}
                  required
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Option B:</label>
                <input
                  type="text"
                  value={options.B}
                  onChange={(e) => setOptions({ ...options, B: e.target.value })}
                  required
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Option C:</label>
                <input
                  type="text"
                  value={options.C}
                  onChange={(e) => setOptions({ ...options, C: e.target.value })}
                  required
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Option D:</label>
                <input
                  type="text"
                  value={options.D}
                  onChange={(e) => setOptions({ ...options, D: e.target.value })}
                  required
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Correct Option:</label>
                <input
                  type="text"
                  value={correctOption}
                  onChange={(e) => setCorrectOption(e.target.value)}
                  required
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
              >
                Add Question
              </button>
            </form>
          </div>
        )}
        {message && <p className="text-center text-red-500 mt-4">{message}</p>}
      </div>
    </div>
  );
};

export default AdminTestManagement;
