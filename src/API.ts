import QuestionCard from "./components/QuestionCard";

// Our shuffle utility
import { shuffleArray } from "./utils"; 

// We are specifying a type for each request returned
export type Question = {
    category: string; // The Quiz category type
    correct_answer: string; // The correct answer for each quiz (shuffles)
    difficulty: string; // The difficulty of quiz
    incorrect_answers: string[]; // Incorrect answer
    question: string; // The question string
    type: string;
}

/* 
    We will use the type from Question but add a new property
    to the end of answers.
*/
export type QuestionState = Question & { answers: string[] }

// Emumerations allow a parameter to only use specific constants (a set # of constants)
export enum Difficulty {
    EASY = "easy",
    MEDIUM = "medium",
    HARD = "hard",
}

// Here we are creating a new request to an external API to pull the questions and answers for our quiz
export const fetchQuizQuestions = async (amount: number, difficulty: Difficulty) => {
    // Our source URL API
    const endpoint = `https://opentdb.com/api.php?amount=${amount}&difficulty=${difficulty}&type=multiple`;
    // First await will wait for the json, the second await will wait for conversions to json
    const data = await (await fetch(endpoint)).json();

    // First we map through all of our results and add a new property
    return data.results.map((question: Question) => (
        // Inside inplicit return
        {
            // We are spreading our the question
            ...question,
            // Then we are adding in the new property from answers and then shuffle the answers
            answers: shuffleArray([
                // We created a new array via spread from the question. We store both incorrect and correct answers into one new array
                ...question.incorrect_answers,
                question.correct_answer
            ])
        }
    ))

    /* 
        The purpose of this is to store both answers and incorrect answers into
        one array so that we can easily map through map and later compare all of the
        values in the new array for the correct answer.

        Their original data points were seperated which meant, more work for us if
        we did not combine them.
    */
}