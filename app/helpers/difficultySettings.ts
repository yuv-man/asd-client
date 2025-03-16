export const catchObjectSettings = {
    easy: { 
      spawnRate: 2000, // milliseconds
      fallSpeed: 3,
      objectTypes: ['apple', 'ball', 'star']
    },
    medium: {
      spawnRate: 1500,
      fallSpeed: 4,
      objectTypes: ['apple', 'ball', 'star', 'triangle']
    },
    hard: {
      spawnRate: 1000,
      fallSpeed: 5,
      objectTypes: ['apple', 'ball', 'star', 'triangle', 'diamond']
    }
  };

  export const balloonGameSettings = {
    easy: { balloonCount: 3, speed: 2000, targetInterval: 5000 },
    medium: { balloonCount: 5, speed: 1500, targetInterval: 4000 },
    hard: { balloonCount: 7, speed: 1000, targetInterval: 3000 }
  };