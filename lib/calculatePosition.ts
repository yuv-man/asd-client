interface Position {
  x: number;
  y: number;
}

export const calculatePosition = (index: number): Position => {
  // This creates a winding path pattern
  return {
    x: 10 + (index * 15) % 45,  // Oscillates between 10 and 55
    y: 65 + (index * 20) % 60   // Oscillates between 65 and 125
  };
}; 