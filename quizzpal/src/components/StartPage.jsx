export default function StartPage(props){
    return(
        <section className="start-page page">
            <h1>Quizzical</h1>
            <p>Nourish your curiousities.</p>
            <button onClick={()=>props.startQuiz()} className="start-quiz-btn">Start Quiz</button>
        </section>
    )
}