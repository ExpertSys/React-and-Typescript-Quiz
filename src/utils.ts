// This will handle shuffling of arrays within our quiz
export const shuffleArray = (array: any[]) => 
// Creating a new array via spread and then sorting it and applying random result
[...array].sort(() => Math.random() - 0.5);