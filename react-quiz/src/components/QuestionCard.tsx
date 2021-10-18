import React from 'react';
import {AnswerObject} from '../App'; 

// Styles
import { Wrapper, ButtonWrapper } from './QuestionCard.styles';

// Instantiate type alias to be refered to within component
type Props = {
    question: string; // regular string
    answers: string[]; // array of strings
    callback: (e: React.MouseEvent<HTMLButtonElement>) => void;
    userAnswer: AnswerObject | undefined; // can be a valid answer or undefined
    questionNr: number; // << 
    totalQuestions: number; // <<
}

/* 
    Because we are using typescript, we need to type the props.

    FC refers to Functional Component within React
*/  
const QuestionCard: React.FC<Props> = ({ question, answers, callback, userAnswer, questionNr, totalQuestions
}) => (
    // This wrapper will allow for styling of our elements
    <Wrapper>
        <p className="number">
            Question: {questionNr} / {totalQuestions}
        </p>
        <p dangerouslySetInnerHTML={{ __html: question }} />

        <div>
            {/* 
                We will loop through our answers and determine if
                the button clicked is the correct answer
            */}
            {/* We are using inplicit return to render information
                without using return
            */}
            {answers.map(answer => (
                // If the user chose a correct answer, the button will turn green. Otherwise red. This is set by our styling sheet
                <ButtonWrapper
                key={answer}
                correct={userAnswer?.correctAnswer === answer} // Optional chaining
                userClicked={userAnswer?.answer === answer} // Optional chaining
                >
                 <button disabled={userAnswer ? true : false} value={answer} onClick={callback}>
                     {/* 
                        We use dangerouslySetInnerHTML before rendering html from a
                        external source.

                        In this case, we know the source and we know the infomation
                        that is being requested.
                     */}
                    <span dangerouslySetInnerHTML={{ __html: answer }} />
                </button>
                </ButtonWrapper>
            ))}
        </div>
    </Wrapper>
)

export default QuestionCard;