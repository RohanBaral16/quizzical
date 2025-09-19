import { useState, useEffect } from "react"
import questionsDefault from '../testQuestions'
import randomizeAnswers from "../utils/randomizeAnswers"
import {clsx} from'clsx'

export default function QuestionPage(){
    //states
    const [questions, setQuestions] = useState({
        ...questionsDefault,
    })

    const [selectedAnswers, setSelectedAnswer] = useState([])

    const [randomizedAnswerArray, setRandomizedAnswerArray] = useState(()=>{
        const temp = questions.results.map((questionItem)=>{
            const allAnswers = [...questionItem.incorrect_answers, questionItem.correct_answer]
            const randomizedAnswersResult = randomizeAnswers(allAnswers, questionItem.type)
            return randomizedAnswersResult
        })
        return temp
    })
    
    //derived values

    // useEffect(()=>{
    //     fetch('https://opentdb.com/api.php?amount=5')
    //         .then(res => res.json())
    //         .then(data => {
    //             const decodedData = {
    //             ...data,
    //             results: data.results.map(q => ({
    //                 ...q,
    //                 question: decodeHtml(q.question),
    //                 correct_answer: decodeHtml(q.correct_answer),
    //                 incorrect_answers: q.incorrect_answers.map(a => decodeHtml(a))
    //             }))
    //             };
    //             setQuestions(decodedData);
    //         })
    //         .catch(error=>{
    //             console.error('Fetch error', error)
    //         })
    // }, [renderCount])

    function decodeHtml(html) {
        const txt = document.createElement("textarea");
        txt.innerHTML = html;
        return txt.value;
    }
    const questionElements = questions?.results?.map((questionItem, index)=>{
        // copy all the answers in an array

        const buttonElements = randomizedAnswerArray[index].map((answer)=>{
            const className=clsx({
                'each-answer':true,
                selected: selectedAnswers[index]===answer
            })
            return(
                <button 
                className={className}
                key={answer}
                id={`${index}${answer}`}
                onClick={()=>answerSelected(index, answer)}
                >
                    {answer}
                </button>
            )
        })
        return(
            <section className="each-question-entity" key={index}>
                <p>{questionItem.question}</p>
                <div className="all-answers">{buttonElements}</div>
            </section>
        )
    }) || []

    function answerSelected(questionIndex, answer){
        console.log(questionIndex, answer)
        setSelectedAnswer(prev=>{
            return {
                ...prev, 
                [questionIndex]: answer
            }
        })
    }
    function checkAnswer(){

    }

    return(
        <>
            <section className="question-page page">
                <div>{questions? 
                questionElements
                : '<p>Loading questions...'}</div>
                <button className="question-action-btn">Check answers</button>

            </section>
        </>
    )
}