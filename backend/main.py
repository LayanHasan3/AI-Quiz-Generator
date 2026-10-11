from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


import os
import time
from dotenv import load_dotenv
from google import genai

load_dotenv()  #env contains api and load_dotenv() loads that value into python environment

api_key = os.getenv("GEMINI_API_KEY")  # it retrieves it

client = genai.Client(api_key=api_key) #Now your backend knows how to communicate with Gemini.

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class QuizRequest(BaseModel):
  topic: str
  
class Question(BaseModel):
  question : str
  options: list[str]
  correct_answer : str
  explanation: str
  
class Quiz(BaseModel):
  questions: list[Question]  
  
@app.get("/test-gemini")
def test_gemini():
    try:
        response = client.models.generate_content(
            model="gemini-3.5-flash",
            contents="Say hello in one sentence."
        )

        return {
            "success": True,
            "response": response.text
        }

    except Exception as error:
        print("TEST GEMINI ERROR:", type(error).__name__)
        print(error)

        raise HTTPException(
            status_code=500,
            detail=str(error)
        )
  
@app.post("/generate-quiz")
def generate_quiz(request: QuizRequest):
  prompt = f"""
 You are a quiz generator.

Generate questions appropriate for the topic: {request.topic}.

Rules:
- Generate exactly 10 questions.
- Each question must have exactly 4 options.
- The correct_answer must exactly match one of the options.
- Provide a short explanation for the correct answer.
- Only one option should be correct.
- Avoid ambiguous questions.
- Do not repeat questions.
- Make the questions educational and accurate.
  """
  
  
  try:  
    response = None
    
    for attempt in range(3):
      try:
        print(f"Gemini attempt {attempt+1}/3")
        
        response = client.models.generate_content(
          model = "gemini-3.5-flash",
          contents = prompt,
          config = {
            "response_mime_type": "application/json",
            "response_schema" : Quiz,
          },
        )
        
        print("Gemini request successful")
        break
      except Exception as error:
        print(f"Gemini attempt {attempt+1} failed:")
        print(type(error).__name__)
        print(error)
        
        if attempt < 2:
          print("Retrying in 2 seconds..")
          time.sleep(2)
        else:
          raise error
        
  except Exception as error:
        print("Gemini failed after 3 attempts.")
        
        raise HTTPException(
          status_code=503,
          detail= "Gemini is temporarily unavailable. Please try again."
        )
  
  quiz = Quiz.model_validate_json(response.text)
  
  #validation layer to verify the generated quiz
  if len(quiz.questions)!= 10:
    return{
      "error":"AI generated an invalid quiz",
      "message": "The quiz must contain exactly 10 questions." 
    }
  for question in quiz.questions:
    
    if len(question.options) != 4:
      return{
        "error":"AI generated an invalid quiz",
        "message": "Each question must contain exactly 4 options."
      }
    
    if question.correct_answer not in question.options:
      return{
        "error":"AI generated an invalid quiz",
        "message": "The correct answer must be one of the options."
        }
       
  
  return{
    "topic": request.topic,
    "questions" : quiz.questions
  }
  