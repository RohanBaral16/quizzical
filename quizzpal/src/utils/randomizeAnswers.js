import randomizeArrayItems from "./randomizeArray"


export default function randomizeAnswers(allAnswers, type){
    let tempAnswer = [...allAnswers]

    if(type.toLowerCase()==="boolean"){
            // bool question here
            tempAnswer = ['True', 'False']
            
    }else if(tempAnswer.some(answer=>{
            return (answer.toLowerCase() == 'none of the above')
    })){
        // contains none of the above.
        let tempAnswerExceptOne = tempAnswer.filter(answer=>{
            return (answer.toLowerCase() !== 'none of the above')
        })
        // randomize the array
        tempAnswerExceptOne = randomizeArrayItems(tempAnswerExceptOne)
        tempAnswer = [...tempAnswerExceptOne, 'None of the Above']

    }else{
            tempAnswer =randomizeArrayItems(tempAnswer)
        }
    return tempAnswer
}