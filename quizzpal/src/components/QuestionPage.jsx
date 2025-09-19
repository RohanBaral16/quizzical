import { useState, useEffect } from "react"
import questionsDefault from '../testQuestions'
import randomizeAnswers from "../utils/randomizeAnswers"
import {clsx} from'clsx'
import Confetti from 'react-confetti'

export default function QuestionPage(){
    //states
    const [renderToggle, setRenderToggle] = useState(true)

    const [questions, setQuestions] = useState({
    })

    const [selectedAnswers, setSelectedAnswer] = useState([])

    const [randomizedAnswerArray, setRandomizedAnswerArray] = useState(()=>{
        return createRandomAnswerArray()
    })

    function createRandomAnswerArray(){
        const temp = questions?.results?.map((questionItem)=>{
            const allAnswers = [...questionItem.incorrect_answers, questionItem.correct_answer]
            const randomizedAnswersResult = randomizeAnswers(allAnswers, questionItem.type)
            return randomizedAnswersResult
        }) || []
        return temp
    }

    const [gameState, setGameState] = useState(['playing'])
    // game states are, incomplete, over, and playing
    
    //derived values
    const correctAnswers = Object.entries(selectedAnswers).filter(([index, answer]) => {
        return questions?.results[index]?.correct_answer === answer;
    }).map((data)=>data[1])

    const allCorrectAnswers = questions?.results?.map(questionItem=>{
        return questionItem.correct_answer
    }) || []

    let statusText = ''
    if (gameState==='playing'){
        statusText = ''
    }else if(gameState === 'incomplete'){
        statusText = `Please answer all questions`
    }else if(gameState === 'over'){
        statusText =  `You nailed ${correctAnswers.length} out of ${questions.results.length}-solid progress, just a step away from greatness!🚀`
    }

    useEffect(() => {
        if (!questions) return;

        const randomized = questions?.results?.map(q => {
            const allAnswers = [...q.incorrect_answers, q.correct_answer];
            return randomizeAnswers(allAnswers, q.type);
        }) || [];

        setRandomizedAnswerArray(randomized);
    }, [questions]);

    useEffect(()=>{
        fetch('https://opentdb.com/api.php?amount=5&category=18')
            .then(res => res.json())
            .then(data => {
                const decodedData = {
                ...data,
                results: data.results.map(q => ({
                    ...q,
                    question: decodeHtml(q.question),
                    correct_answer: decodeHtml(q.correct_answer),
                    incorrect_answers: q.incorrect_answers.map(a => decodeHtml(a))
                }))
                };
                setQuestions(decodedData);
            })
            .then(()=>{
                setRandomizedAnswerArray(()=>{
                    return createRandomAnswerArray()
                })
            })
            .catch(error=>{
                console.error('Fetch error', error)
            })
    }, [renderToggle])

    function decodeHtml(html) {
        const txt = document.createElement("textarea");
        txt.innerHTML = html;
        return txt.value;
    }
    const questionElements = questions?.results?.map((questionItem, index)=>{
        // copy all the answers in an array

        const buttonElements = randomizedAnswerArray[index]?.map((answer)=>{
            
            const isWrong = !correctAnswers.includes(answer) && selectedAnswers[index]===answer && gameState==='over'
            const isRight =  correctAnswers.includes(answer) && gameState==='over' && selectedAnswers[index]===answer
            const isNotSelected = selectedAnswers[index]!= answer && gameState === 'over'
            const isNotSelectedButTrue = isNotSelected && allCorrectAnswers.includes(answer)
            const className=clsx({
                'each-answer':true,
                selected: selectedAnswers[index]===answer,
                wrong: isWrong,
                right: isRight || isNotSelectedButTrue,
                'not-selected': isNotSelected && !isNotSelectedButTrue,
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
        }) || []
        return(
            <section className="each-question-entity" key={index}>
                <p>{questionItem.question}</p>
                <div className="all-answers">{buttonElements}</div>
            </section>
        )
    }) || []

    function answerSelected(questionIndex, answer){
        setSelectedAnswer(prev=>{
            return {
                ...prev, 
                [questionIndex]: answer
            }
        })
    }
    function checkAnswer(){
        console.log('selected answers', selectedAnswers)
        console.log('correct selected answers', correctAnswers)
        console.log('correct answers', questions.results.map(q=>q.correct_answer))
        const selectedCount = Object.keys(selectedAnswers).length
        const correctCount = correctAnswers.length
        const questionCount = questions.results.length
        if(selectedCount === questionCount){
            setGameState('over')
        }else if(selectedCount < questionCount){
            setGameState('incomplete')
        }
    }
    function resetGame(){
        setGameState('playing')  
        setSelectedAnswer([])     
        setRenderToggle(prev=>!prev)
    }

    return(
        <>
            { gameState === 'over' && <Confetti
                numberOfPieces={500}
                recycle={false}
            />}

            <section className="question-page page">
                <div>{questions? 
                questionElements
                : '<p>Loading questions...'}</div>
                <section className="bottom-section">
                    <p>{statusText}</p>
                    {gameState != 'over' && questions.results != null &&
                    <button 
                    onClick={checkAnswer}
                    className="question-action-btn"
                    >
                        Check answers
                    </button>}

                    {gameState === 'over' &&
                        <button 
                    onClick={resetGame}
                    className="question-action-btn"
                    >
                        Play again
                    </button>}
                    {
                        !questions.results &&
                        <h1>loading....</h1>
                    }
                </section>
            </section>
        </>
    )
}