import React, { useState } from 'react';
import { fetchQuizQuestions } from './API';
// Components
import QuestionCard from './components/QuestionCard';

// Types
import { QuestionState, Difficulty } from './API'; 

// Styles
import { GlobalStyle, Wrapper } from './App.Style';

/* 
  The purpose of this object is so we can store
  all information about the game. For instance,
  at the end of the game, we may want to output
  all of the questions and answers in which the
  user answered.
*/
export type AnswerObject = {
  question: string; // The question string
  answer: string; // Answer string
  correct: boolean; // Correct value
  correctAnswer: string; // The correct answer
}

// The total  number of questions. Defined here so we can easily modify the amount
const TOTAL_QUESTIONS = 10;

const App = () => {
  // All of our states using React State via Hooks
  const [loading, setLoading] = useState(false); // The initial state of loading is false
  const [questions, setQuestions] = useState<QuestionState[]>([]); // We store all questions within the question state
  const [number, setNumber] = useState(0); // The current 
  const [userAnswers, setUserAnswers] = useState<AnswerObject[]>([]); // Specificy the type to AnswerObject
  const [score, setScore] = useState(0); // Keep track of the total store. Default 0
  const [gameOver, setGameOver] = useState(true); // Determine whether the game is over or not

  // Function to start the trivia. This must be in sync so that we can load the questions first
  const startTrivia = async () => {
    setLoading(true); // The loading game state should be true until the data has finished loading
    setGameOver(false); // The game is not over until the last question is answered.

    let newQuestions;

    /* 
      We are using try and catch in order to determine
      whether we have the required data before starting
      the game. 

      success: the game starts
      error: returns error, game has not began
      complete: initialize a new game
    */
    try {
      newQuestions = await fetchQuizQuestions(
        TOTAL_QUESTIONS,
        Difficulty.EASY
      );
    } catch(error) {
      console.error(error);
    } finally{
      // Reset values to 0 at start of new game
      setQuestions(newQuestions);
      setScore(0);
      setUserAnswers([]);
      setNumber(0);
      setLoading(false);
    }

  }

  // We are checking the answer of what the user clicks via button onClick
  const checkAnswer = (e: React.MouseEvent<HTMLButtonElement>) => {
    if(!gameOver){
      // Users answer
      const answer = e.currentTarget.value;
      // Check answer against correct value
      const correct = questions[number].correct_answer === answer;
      // Add score if answer is correct
      if(correct) setScore(prev => prev + 1);
      // Save answer in the array for user answers
      const answerObject = {
        question: questions[number].question,
        answer,
        correct,
        correctAnswer: questions[number].correct_answer,
      };
      setUserAnswers(prev => [...prev, answerObject])
    }
  }

  // Move to the next question when requested as long as we aren't at the last question
  const nextQuestion = () => {
    // Move on to next question if we haven't reached the last question
    const nextQuestion = number + 1;
    
    // Are we at the last question? If nextQuestion + 1 = TOTAL_QUESTIONS(10 or another value entered), there are no more questions
    if(nextQuestion === TOTAL_QUESTIONS) {
      // If we are at the last question, gameOver = true
      setGameOver(true);
    } else{
      // If the game is not yet over, increment the active question
      setNumber(nextQuestion);
    }
  }

  // Render quiz to ReactDOM
  return (
    <>
    {/* CSS Styles rendered for elements */}
    <GlobalStyle />
    <Wrapper>
      <h1>REACT QUIZ</h1>
      {gameOver || userAnswers.length === TOTAL_QUESTIONS ? (
      <button className="start" onClick={startTrivia}>
        Start
      </button>
      ) : null}

      {/* If the game is not over, display the score */}
      { !gameOver ? <p className="score">Score: {score}</p> : null }
      {/* If the game data (quiz) is loading, let the user know */}
      { loading && <p>Loading Questions ...</p> }
      {/* If the game is not loading and the game is not over. Render the quiz question card */}
      { !loading && !gameOver && (
        <QuestionCard 
        questionNr={number + 1}
        totalQuestions={TOTAL_QUESTIONS}
        question={questions[number].question}
        answers={questions[number].answers}
        userAnswer={userAnswers ? userAnswers[number] : undefined}
        callback={checkAnswer}
        />
      )} 
      {/* If the game is not over, the game is not loading and the user has chosen an answer. Show the next button*/}
      { !gameOver && !loading && userAnswers.length === number + 1 && 
        number !== TOTAL_QUESTIONS - 1 ? (
          <button className="next" onClick={nextQuestion}>
              Next Question
          </button>
        ) : null }
      {/* If the user has selected an answer, display the correct answer whether user was correct or not */}
      { userAnswers.length === number + 1 ? (
      <h2>Correct Answer {questions[number].correct_answer}</h2>
      ) : null}
    </Wrapper>
    </>
  );
}

export default App;
