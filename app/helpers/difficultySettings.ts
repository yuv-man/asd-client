export const catchObjectSettings = {
    easy: { 
      spawnRate: 2000, // milliseconds
      fallSpeed: 3,
      objectTypes: ['apple', 'fish', 'soda']
    },
    medium: {
      spawnRate: 1500,
      fallSpeed: 4,
      objectTypes: ['apple', 'fish', 'soda', 'steak']
    },
    hard: {
      spawnRate: 1000,
      fallSpeed: 5,
      objectTypes: ['apple', 'fish', 'soda', 'steak', 'poachedEgg']
    }
  };

  export const balloonGameSettings = {
    easy: { balloonCount: 3, speed: 2000, targetInterval: 5000 },
    medium: { balloonCount: 5, speed: 1500, targetInterval: 4000 },
    hard: { balloonCount: 7, speed: 1000, targetInterval: 3000 }
  };

  export const shapeTracingSettings = {
    easy: {
      maxDeviation: 50,
      accuracyThreshold: 75
    },
    medium: {
      maxDeviation: 40,
      accuracyThreshold: 85
    },
    hard: {
      maxDeviation: 30,
      accuracyThreshold: 90
    }
  }
