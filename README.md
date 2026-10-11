#  AI Quiz Generator

An AI-powered quiz application that generates personalized multiple-choice quizzes from any topic using **Google Gemini AI**.

Enter a topic, generate a quiz, answer the questions, and instantly see your score with explanations for each answer.

##  Features

-  AI-generated quizzes using Google Gemini
-  Generates 10 questions per quiz
-  3 multiple-choice options per question
-  One correct answer per question
-  Automatic score calculation
-  Correct and incorrect answer highlighting
-  Explanations for answers after submission
-  Generate a new quiz with a different topic
-  Loading state while the AI generates the quiz
-  Error handling for failed requests
-  Responsive design for smaller screens

##  Tech Stack

### Frontend
- React
- Vite
- JavaScript
- CSS

### Backend
- Python
- FastAPI
- Pydantic

### AI
- Google Gemini API
- `google-genai`

##  How It Works

```
User enters a topic
        ↓
React frontend sends request
        ↓
FastAPI backend receives topic
        ↓
Gemini generates the quiz
        ↓
FastAPI validates the AI response
        ↓
Quiz is returned to React
        ↓
User answers questions
        ↓
Score is calculated
```

##  Project Structure

```
ai-quiz-generator/
│
├── backend/
│   ├── main.py
│   ├── .env
│   └── ...
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── ...
│   ├── package.json
│   └── ...
│
├── .gitignore
└── README.md
```

##  Getting Started

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd ai-quiz-generator
```

### 2. Set up the backend

Navigate to the backend:

```bash
cd backend
```

Create and activate a virtual environment:

```bash
python -m venv venv
```

On Windows:

```bash
venv\Scripts\activate
```

Install the required packages:

```bash
pip install fastapi uvicorn python-dotenv google-genai
```

### 3. Add your Gemini API key

Create a `.env` file inside the `backend` folder:

```env
GEMINI_API_KEY=your_api_key_here
```

**Never commit your `.env` file to GitHub.**

### 4. Start the backend

```bash
uvicorn main:app --reload
```

The backend will run at:

```text
http://127.0.0.1:8000
```

### 5. Start the frontend

Open another terminal and navigate to the frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the URL provided by Vite in your browser.

## Environment Variables

The backend requires the following environment variable:

| Variable | Description |
|---|---|
| `GEMINI_API_KEY` | Your Google Gemini API key |

## Example

Enter a topic such as:

```
Operating Systems
```

The application sends the topic to the backend, Gemini generates a 10-question quiz, and the questions are displayed in the React interface.

After answering all questions, click **Submit Quiz** to see your score and explanations.

##  What I Learned

This project helped me practice building an AI-powered application from frontend to backend.

### Frontend
- React state management with `useState`
- Controlled inputs
- Rendering dynamic data with `.map()`
- Handling user interactions
- Sending API requests with `fetch()`
- Loading and error states
- Conditional rendering
- Working with API responses

### Backend
- Building APIs with FastAPI
- Creating request and response models with Pydantic
- Handling API errors
- Connecting a Python backend to an AI API
- Validating structured AI-generated data
- Environment variables and API keys
- CORS configuration

### AI Integration
- Using the Google Gemini API
- Prompting an AI model to generate structured content
- Requesting structured JSON output
- Validating AI-generated responses before returning them to the frontend

## Future Improvements

Possible improvements for future versions could include:

- Difficulty selection
- Question categories
- Timer-based quizzes
- Quiz history
- User accounts
- Saving previous quiz results



Built as a learning project while exploring **AI Product Engineering** and AI-powered application development.