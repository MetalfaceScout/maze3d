/*
Generate a random int between start and stop, and whether to make it inclusive.
*/

/*
Return a number bewteen start and stop. Inclusive is end
*/
function randomInteger(start, stop, inclusive = false) {
    if (inclusive) {
        stop += 1;
    }
    return Math.random() * (stop - start) + start;
}

/*
Randomize the given array. I can assume the input array is destroyed.
*/
function randomizeArray(array) {

    const reorderedArray = [];
    const arraySize = array.length;

    if (Math.random() < 0.5) {
        array.reverse();
    }

    for (let i = 0; i < arraySize; i++) {
        //randomly pop something
        const ChosenIndex = randomInteger(0, array.length-1);
        const ChosenItem = array[ChosenIndex];
        array.splice(ChosenIndex, 1);
        reorderedArray.push(ChosenItem);
    }

    return reorderedArray;
}

/* Return random items of an amount from a given array. Assume input is destroyed.*/
function chooseRandomAmountFromArray(array, amount) {

    if (amount > array.length) {
        console.error("chooseRandomAmountFromArray: trying to pick more items out of an array than exist.");
        return;
    }

    const newArray = [];

    for (let i = 0; i < amount; i++) {
        //randomly pop something
        const ChosenIndex = randomInteger(0, array.length);
        let item = array[ChosenIndex];
        array.splice(ChosenIndex, 1);
        newArray.push(item)
    }
    return newArray;
}

//Returns either 0 or 1. 50/50 chance.
function randomBool() {
    if (Math.random() < 0.5) {
        return 0;
    }
    return 1;
}

export {randomInteger, randomizeArray, chooseRandomAmountFromArray, randomBool};