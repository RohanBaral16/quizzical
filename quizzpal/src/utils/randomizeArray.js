export default function randomizeArrayItems(array){
    let tempArray = [...array]
    let currentIndex = tempArray.length
    while(currentIndex != 0){
        // pick a remaining element
        let randomIndex = Math.floor(Math.random()*currentIndex)
        currentIndex--
        // swap current index with randomIndex
        [tempArray[currentIndex], tempArray[randomIndex]] = [tempArray[randomIndex], tempArray[currentIndex]]
    }
    return tempArray
}