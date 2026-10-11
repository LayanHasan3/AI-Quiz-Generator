import { useState } from 'react';
import './App.css';

function App() {
  const [topic, setTopic] = useState("");
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");


  function handleAnswer(index, option) {
    const updatedAnswer = [...selectedAnswers];
    updatedAnswer[index] = option;
    setSelectedAnswers(updatedAnswer);
  }


  function handleSubmit() {
    const allAnswered = questions.every(
     (_, index) => selectedAnswers[index] !== undefined
    );

  if (!allAnswered) {
    alert("Please answer all questions before submitting.");
    return;
  }

  let newScore = 0;

  questions.forEach((question, index) => {
    if (selectedAnswers[index] === question.correct_answer) {
      newScore++;
    }
  });

  setScore(newScore);
  setSubmitted(true);
}

  async function handleClick() {
    if (topic.trim() === "") {
      alert("Please enter a topic");
      return;
    }

    setLoading(true);
    setError("");
    setQuestions([]);
    setSelectedAnswers([]);
    setScore(null);
    setSubmitted(false);


    try {
      const response = await fetch(
        "http://127.0.0.1:8000/generate-quiz",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            topic: topic
          })
        }
      );

      const data = await response.json();

      console.log("Quiz data:", data);

      if (!response.ok) {
        throw new Error(
         data.detail || data.message || "Failed to generate quiz"
        );
      }

      setQuestions(data.questions);
    }

    catch (error) {
      console.log(error);
      setError(error.message);
    }

    finally {
      setLoading(false);
    }
  }

  return (
    <div className="app">

      {/* Header */}

      <div className="header">
        <h1>Quiz Yourself</h1>

        <p>
          Test your knowledge with AI-generated quizzes.
        </p>
      </div>


      {/* Topic input */}

      <div className="topic-section">

        <input
          type="text"
          value={topic}
          onChange={(event) => setTopic(event.target.value)}
          placeholder="Enter a topic..."
        />

        <button
          className="generate-button"
          onClick={handleClick}
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate Quiz"}
        </button>

      </div>


      {/* Error */}

      {error && (
        <p className="message error">
          {error}
        </p>
      )}


      {/* Loading */}

      {loading && (
        <p className="message loading">
           AI is generating your quiz...
        </p>
      )}


      {/* Topic */}

      {questions.length > 0 && (
        <p className="topic">
          Quiz Topic: <strong>{topic}</strong>
        </p>
      )}


      {/* Questions */}

      {questions.map((question, index) => (

        <div
          className="question-card"
          key={question.question}
        >

          <span className="question-number">
            Question {index + 1} of {questions.length}
          </span>

          <h2>
            {question.question}
          </h2>


          {/* Options */}

          {question.options.map((option) => (

            <button
              className={`option-button ${
                submitted
                  ? option === question.correct_answer
                    ? "correct"
                    : selectedAnswers[index] === option
                      ? "incorrect"
                      : ""
                  : selectedAnswers[index] === option
                    ? "selected"
                    : ""
              }`}
              key={option}
              onClick={() => handleAnswer(index, option)}
              disabled={submitted}
            >
              {option}
            </button>

          ))}


          {/* Feedback */}

          {submitted && (

            <div className="feedback">

              {selectedAnswers[index] === undefined ? (

                <div>
                  <p>⚠️ Not answered</p>

                  <p>
                    Correct answer:{" "}
                    <strong>
                      {question.correct_answer}
                    </strong>
                  </p>
                </div>

              ) : selectedAnswers[index] === question.correct_answer ? (

                <p>
                  ✅ <strong>Correct!</strong>
                </p>

              ) : (

                <div>
                  <p>
                    ❌ <strong>Incorrect</strong>
                  </p>

                  <p>
                    Correct answer:{" "}
                    <strong>
                      {question.correct_answer}
                    </strong>
                  </p>
                </div>

              )}

              <p className="explanation">
                <strong>Explanation:</strong>{" "}
                {question.explanation}
              </p>

            </div>

          )}

        </div>

      ))}


      {/* Submit button */}

      {questions.length > 0 && !submitted && (

        <button
          className="submit-button"
          onClick={handleSubmit}
        >
          Submit Quiz
        </button>

      )}


      {/* Score */}

      {score !== null && (

        <div className="score-card">

          <h2>
             Your Score: {score} / {questions.length}
          </h2>

          <p>
            {score === questions.length
              ? "Perfect score! Amazing!"
              : score >= questions.length / 2
                ? "Great job! Keep learning!"
                : "Good effort! Try again and improve!"
            }
          </p>

          <button
            className='regenerate-button'
            onClick = {handleClick}
            disabled = {loading}
          >
           {loading ? "Generating..." : "Generate New Quiz"}
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
