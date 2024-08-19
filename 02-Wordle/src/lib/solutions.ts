const solutions: string[][] = [
  ["apple", "table", "chair", "house", "mouse"],
  ["banana", "orange", "purple", "yellow", "silver"],
  ["diamond", "elephant", "monster", "monster", "monster"],
  ["baseball", "football", "calendar", "calendar", "calendar"],
];

export const getRandomSolution = (level: number = 0) => {
  const randomIndex = Math.floor(Math.random() * solutions[level].length);
  return solutions[level][randomIndex];
};
