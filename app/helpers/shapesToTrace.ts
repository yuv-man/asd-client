import { Star, Home, Heart, Triangle, Square, Hexagon, Pentagon, Flower, Palette, Cherry } from 'lucide-react';

export interface Shape {
  name: string;
  icon: React.ElementType;
  difficulty: number;
  points: { x: number, y: number, number: number }[];
  gradient: { colors: string[], direction: { x1: number, y1: number, x2: number, y2: number } };
  drawShape: (ctx: CanvasRenderingContext2D) => void;
} 

export const SHAPES: Record<string, Shape> = {
  // Beginner level shapes
  
  square: {
    name: 'Square',
    icon: Square,
    difficulty: 1,
    points: [
      { x: 50, y: 50, number: 1 },
      { x: 250, y: 50, number: 2 },
      { x: 250, y: 250, number: 3 },
      { x: 50, y: 250, number: 4 },
      { x: 50, y: 50, number: 5 }
    ],
    gradient: {
      colors: ['#FFA07A', '#FA8072'],
      direction: { x1: 50, y1: 50, x2: 250, y2: 250 }
    },
    drawShape: (ctx: CanvasRenderingContext2D) => {
      ctx.beginPath();
      ctx.rect(50, 50, 200, 200);
      ctx.closePath();
    }
  },
  
  triangle: {
    name: 'Triangle',
    icon: Triangle,
    difficulty: 1,
    points: [
      { x: 150, y: 50, number: 1 },
      { x: 250, y: 250, number: 2 },
      { x: 50, y: 250, number: 3 },
      { x: 150, y: 50, number: 4 }
    ],
    gradient: {
      colors: ['#98FB98', '#32CD32'],
      direction: { x1: 50, y1: 50, x2: 250, y2: 250 }
    },
    drawShape: (ctx: CanvasRenderingContext2D) => {
      ctx.beginPath();
      ctx.moveTo(150, 50);
      ctx.lineTo(250, 250);
      ctx.lineTo(50, 250);
      ctx.closePath();
    }
  },

  // Intermediate level shapes
  pentagon: {
    name: 'Pentagon',
    icon: Pentagon,
    difficulty: 2,
    points: [
      { x: 150, y: 50, number: 1 },
      { x: 250, y: 120, number: 2 },
      { x: 220, y: 230, number: 3 },
      { x: 80, y: 230, number: 4 },
      { x: 50, y: 120, number: 5 },
      { x: 150, y: 50, number: 6 }
    ],
    gradient: {
      colors: ['#DDA0DD', '#9370DB'],
      direction: { x1: 50, y1: 50, x2: 250, y2: 250 }
    },
    drawShape: (ctx: CanvasRenderingContext2D) => {
      ctx.beginPath();
      ctx.moveTo(150, 50);
      ctx.lineTo(250, 120);
      ctx.lineTo(220, 230);
      ctx.lineTo(80, 230);
      ctx.lineTo(50, 120);
      ctx.closePath();
    }
  },
  
  hexagon: {
    name: 'Hexagon',
    icon: Hexagon,
    difficulty: 2,
    points: [
      { x: 150, y: 50, number: 1 },
      { x: 250, y: 100, number: 2 },
      { x: 250, y: 200, number: 3 },
      { x: 150, y: 250, number: 4 },
      { x: 50, y: 200, number: 5 },
      { x: 50, y: 100, number: 6 },
      { x: 150, y: 50, number: 7 }
    ],
    gradient: {
      colors: ['#20B2AA', '#48D1CC'],
      direction: { x1: 50, y1: 50, x2: 250, y2: 250 }
    },
    drawShape: (ctx: CanvasRenderingContext2D) => {
      ctx.beginPath();
      ctx.moveTo(150, 50);
      ctx.lineTo(250, 100);
      ctx.lineTo(250, 200);
      ctx.lineTo(150, 250);
      ctx.lineTo(50, 200);
      ctx.lineTo(50, 100);
      ctx.closePath();
    }
  },
  
  star: {
    name: 'Star',
    icon: Star,
    difficulty: 2,
    points: [
      { x: 150, y: 50, number: 1 },
      { x: 180, y: 115, number: 2 },
      { x: 250, y: 115, number: 3 },
      { x: 195, y: 160, number: 4 },
      { x: 220, y: 230, number: 5 },
      { x: 150, y: 190, number: 6 },
      { x: 80, y: 230, number: 7 },
      { x: 105, y: 160, number: 8 },
      { x: 50, y: 115, number: 9 },
      { x: 120, y: 115, number: 10 },
      { x: 150, y: 50, number: 11 }
    ],
    gradient: {
      colors: ['#FFD700', '#FFA500'],
      direction: { x1: 50, y1: 50, x2: 250, y2: 250 }
    },
    drawShape: (ctx: CanvasRenderingContext2D) => {
      ctx.beginPath();
      ctx.moveTo(150, 50);
      ctx.lineTo(180, 115);
      ctx.lineTo(250, 115);
      ctx.lineTo(195, 160);
      ctx.lineTo(220, 230);
      ctx.lineTo(150, 190);
      ctx.lineTo(80, 230);
      ctx.lineTo(105, 160);
      ctx.lineTo(50, 115);
      ctx.lineTo(120, 115);
      ctx.closePath();
    }
  },

  // Advanced level shapes
  house: {
    name: 'House',
    icon: Home,
    difficulty: 3,
    points: [
      { x: 150, y: 50, number: 1 },  // Roof top
      { x: 250, y: 150, number: 2 }, // Roof right
      { x: 250, y: 250, number: 3 }, // Wall right
      { x: 175, y: 250, number: 4 }, // Door right
      { x: 175, y: 200, number: 5 }, // Door top
      { x: 125, y: 200, number: 6 }, // Door top left
      { x: 125, y: 250, number: 7 }, // Door bottom left
      { x: 50, y: 250, number: 8 },  // Wall left
      { x: 50, y: 150, number: 9 },  // Roof left
      { x: 150, y: 50, number: 10 }  // Back to roof top
    ],
    gradient: {
      colors: ['#FF6B6B', '#FF8E8E'],
      direction: { x1: 50, y1: 50, x2: 250, y2: 250 }
    },
    drawShape: (ctx: CanvasRenderingContext2D) => {
      ctx.beginPath();
      // Roof and walls
      ctx.moveTo(150, 50);
      ctx.lineTo(250, 150);
      ctx.lineTo(250, 250);
      ctx.lineTo(50, 250);
      ctx.lineTo(50, 150);
      ctx.closePath();
      
      // Door (separate path)
      ctx.moveTo(125, 250);
      ctx.lineTo(125, 200);
      ctx.lineTo(175, 200);
      ctx.lineTo(175, 250);
      
      // Window (separate path)
      ctx.moveTo(90, 175);
      ctx.rect(90, 175, 40, 40);
      
      // Second window
      ctx.moveTo(170, 175);
      ctx.rect(170, 175, 40, 40);
    }
  },
  
  heart: {
    name: 'Heart',
    icon: Heart,
    difficulty: 3,
    points: [
      { x: 150, y: 75, number: 1 },   // Top center
      { x: 180, y: 50, number: 2 },   // Right top curve start
      { x: 220, y: 70, number: 3 },   // Right top curve
      { x: 240, y: 110, number: 4 },  // Right side
      { x: 220, y: 150, number: 5 },  // Right bottom curve
      { x: 150, y: 220, number: 6 },  // Bottom point
      { x: 80, y: 150, number: 7 },   // Left bottom curve
      { x: 60, y: 110, number: 8 },   // Left side
      { x: 80, y: 70, number: 9 },    // Left top curve
      { x: 120, y: 50, number: 10 },  // Left top curve start
      { x: 150, y: 75, number: 11 }   // Back to top center
    ],
    gradient: {
      colors: ['#FF69B4', '#FF1493'],
      direction: { x1: 60, y1: 50, x2: 240, y2: 220 }
    },
    drawShape: (ctx: CanvasRenderingContext2D) => {
      ctx.beginPath();
      ctx.moveTo(150, 75);
      // Right half
      ctx.bezierCurveTo(200, 0, 330, 70, 150, 220);
      // Left half
      ctx.bezierCurveTo(-40, 70, 120, 0, 150, 75);
      ctx.closePath();
    }
  },
  
  flower: {
    name: 'Flower',
    icon: Flower,
    difficulty: 3,
    points: [
      { x: 150, y: 50, number: 1 },   // Top petal
      { x: 180, y: 80, number: 2 },   // Top-right curve
      { x: 250, y: 100, number: 3 },  // Right petal
      { x: 180, y: 150, number: 4 },  // Bottom-right curve
      { x: 200, y: 200, number: 5 },  // Bottom-right petal
      { x: 150, y: 180, number: 6 },  // Bottom curve
      { x: 100, y: 200, number: 7 },  // Bottom-left petal
      { x: 120, y: 150, number: 8 },  // Bottom-left curve
      { x: 50, y: 100, number: 9 },   // Left petal
      { x: 120, y: 80, number: 10 },  // Top-left curve
      { x: 150, y: 50, number: 11 }   // Back to top
    ],
    gradient: {
      colors: ['#FF99CC', '#FF66B2', '#FF3399'],
      direction: { x1: 50, y1: 50, x2: 250, y2: 250 }
    },
    drawShape: (ctx: CanvasRenderingContext2D) => {
      // Center
      ctx.beginPath();
      ctx.arc(150, 130, 30, 0, Math.PI * 2);
      ctx.closePath();
      
      // Petals
      for (let i = 0; i < 6; i++) {
        const angle = (i * 60) * Math.PI / 180;
        const x = 150 + Math.cos(angle) * 80;
        const y = 130 + Math.sin(angle) * 80;
        
        ctx.beginPath();
        ctx.ellipse(
          150 + Math.cos(angle) * 60, 
          130 + Math.sin(angle) * 60, 
          30, 40, 
          angle, 
          0, Math.PI * 2
        );
        ctx.closePath();
      }
    }
  },

  // Expert level shapes
  butterfly: {
    name: 'Butterfly',
    icon: Cherry,
    difficulty: 4,
    points: [
      { x: 150, y: 60, number: 1 },    // Top antenna left
      { x: 130, y: 80, number: 2 },    // Antenna curve
      { x: 150, y: 100, number: 3 },   // Head top
      { x: 170, y: 80, number: 4 },    // Antenna curve right
      { x: 190, y: 60, number: 5 },    // Top antenna right
      { x: 170, y: 110, number: 6 },   // Body top right
      { x: 230, y: 80, number: 7 },    // Upper wing right top
      { x: 250, y: 130, number: 8 },   // Upper wing right edge
      { x: 230, y: 170, number: 9 },   // Upper wing right bottom
      { x: 190, y: 150, number: 10 },  // Body middle right
      { x: 220, y: 190, number: 11 },  // Lower wing right top
      { x: 240, y: 220, number: 12 },  // Lower wing right edge
      { x: 190, y: 230, number: 13 },  // Lower wing right bottom
      { x: 150, y: 200, number: 14 },  // Body bottom
      { x: 110, y: 230, number: 15 },  // Lower wing left bottom
      { x: 60, y: 220, number: 16 },   // Lower wing left edge
      { x: 80, y: 190, number: 17 },   // Lower wing left top
      { x: 110, y: 150, number: 18 },  // Body middle left
      { x: 70, y: 170, number: 19 },   // Upper wing left bottom
      { x: 50, y: 130, number: 20 },   // Upper wing left edge
      { x: 70, y: 80, number: 21 },    // Upper wing left top
      { x: 130, y: 110, number: 22 },  // Body top left
      { x: 150, y: 60, number: 23 }    // Back to top
    ],
    gradient: {
      colors: ['#9370DB', '#8A2BE2', '#483D8B'],
      direction: { x1: 50, y1: 60, x2: 250, y2: 250 }
    },
    drawShape: (ctx: CanvasRenderingContext2D) => {
      ctx.beginPath();
      // Body
      ctx.moveTo(150, 100);
      ctx.lineTo(150, 200);
      
      // Antennae
      ctx.moveTo(150, 100);
      ctx.bezierCurveTo(130, 80, 120, 70, 130, 60);
      ctx.moveTo(150, 100);
      ctx.bezierCurveTo(170, 80, 180, 70, 170, 60);
      
      // Upper wings
      ctx.moveTo(150, 120);
      ctx.bezierCurveTo(190, 90, 250, 100, 200, 170);
      ctx.bezierCurveTo(170, 150, 160, 130, 150, 120);
      
      ctx.moveTo(150, 120);
      ctx.bezierCurveTo(110, 90, 50, 100, 100, 170);
      ctx.bezierCurveTo(130, 150, 140, 130, 150, 120);
      
      // Lower wings
      ctx.moveTo(150, 170);
      ctx.bezierCurveTo(180, 180, 240, 200, 190, 230);
      ctx.bezierCurveTo(160, 220, 150, 200, 150, 170);
      
      ctx.moveTo(150, 170);
      ctx.bezierCurveTo(120, 180, 60, 200, 110, 230);
      ctx.bezierCurveTo(140, 220, 150, 200, 150, 170);
      
      ctx.closePath();
    }
  },
  
  castle: {
    name: 'Castle',
    icon: Home,
    difficulty: 4,
    points: [
      { x: 50, y: 250, number: 1 },    // Bottom left
      { x: 50, y: 160, number: 2 },    // Left wall up
      { x: 70, y: 160, number: 3 },    // Left tower bottom left
      { x: 70, y: 120, number: 4 },    // Left tower top left
      { x: 90, y: 120, number: 5 },    // Left tower top right
      { x: 90, y: 160, number: 6 },    // Left tower bottom right
      { x: 120, y: 160, number: 7 },   // Main left wall
      { x: 120, y: 100, number: 8 },   // Main turret left start
      { x: 130, y: 100, number: 9 },   // Turret 1 left
      { x: 130, y: 80, number: 10 },   // Turret 1 top left
      { x: 140, y: 80, number: 11 },   // Turret 1 top right
      { x: 140, y: 100, number: 12 },  // Turret 1 right
      { x: 160, y: 100, number: 13 },  // Turret 2 left
      { x: 160, y: 80, number: 14 },   // Turret 2 top left
      { x: 170, y: 80, number: 15 },   // Turret 2 top right
      { x: 170, y: 100, number: 16 },  // Turret 2 right
      { x: 180, y: 100, number: 17 },  // Main turret right start
      { x: 180, y: 160, number: 18 },  // Main right wall
      { x: 210, y: 160, number: 19 },  // Right tower bottom left
      { x: 210, y: 120, number: 20 },  // Right tower top left
      { x: 230, y: 120, number: 21 },  // Right tower top right
      { x: 230, y: 160, number: 22 },  // Right tower bottom right
      { x: 250, y: 160, number: 23 },  // Right wall up
      { x: 250, y: 250, number: 24 },  // Bottom right
      { x: 190, y: 250, number: 25 },  // Door right
      { x: 190, y: 200, number: 26 },  // Door top right
      { x: 110, y: 200, number: 27 },  // Door top left
      { x: 110, y: 250, number: 28 },  // Door left
      { x: 50, y: 250, number: 29 }    // Back to bottom left
    ],
    gradient: {
      colors: ['#A0522D', '#8B4513', '#A0522D'],
      direction: { x1: 50, y1: 80, x2: 250, y2: 250 }
    },
    drawShape: (ctx: CanvasRenderingContext2D) => {
      ctx.beginPath();
      // Main castle structure
      ctx.moveTo(50, 250);
      ctx.lineTo(50, 160);
      // Left tower
      ctx.lineTo(70, 160);
      ctx.lineTo(70, 120);
      ctx.lineTo(90, 120);
      ctx.lineTo(90, 160);
      // Main wall left
      ctx.lineTo(120, 160);
      ctx.lineTo(120, 100);
      // Center turrets
      ctx.lineTo(130, 100);
      ctx.lineTo(130, 80);
      ctx.lineTo(140, 80);
      ctx.lineTo(140, 100);
      ctx.lineTo(160, 100);
      ctx.lineTo(160, 80);
      ctx.lineTo(170, 80);
      ctx.lineTo(170, 100);
      // Main wall right
      ctx.lineTo(180, 100);
      ctx.lineTo(180, 160);
      // Right tower
      ctx.lineTo(210, 160);
      ctx.lineTo(210, 120);
      ctx.lineTo(230, 120);
      ctx.lineTo(230, 160);
      // Right wall
      ctx.lineTo(250, 160);
      ctx.lineTo(250, 250);
      // Door
      ctx.lineTo(190, 250);
      ctx.lineTo(190, 200);
      ctx.lineTo(110, 200);
      ctx.lineTo(110, 250);
      ctx.closePath();
      
      // Windows (separate paths)
      ctx.moveTo(80, 140);
      ctx.rect(75, 135, 10, 15);
      
      ctx.moveTo(220, 140);
      ctx.rect(215, 135, 10, 15);
      
      ctx.moveTo(150, 140);
      ctx.rect(140, 130, 20, 20);
    }
  },
  
  dragon: {
    name: 'Dragon',
    icon: Palette,
    difficulty: 4,
    points: [
      { x: 70, y: 100, number: 1 },    // Head start
      { x: 50, y: 80, number: 2 },     // Snout top
      { x: 30, y: 100, number: 3 },    // Snout front
      { x: 50, y: 120, number: 4 },    // Snout bottom
      { x: 70, y: 110, number: 5 },    // Jaw
      { x: 90, y: 100, number: 6 },    // Neck start
      { x: 110, y: 70, number: 7 },    // Neck curve top
      { x: 130, y: 60, number: 8 },    // Back start
      { x: 170, y: 70, number: 9 },    // Back middle
      { x: 200, y: 90, number: 10 },   // Back end
      { x: 220, y: 110, number: 11 },  // Tail start
      { x: 250, y: 130, number: 12 },  // Tail middle
      { x: 270, y: 160, number: 13 },  // Tail end
      { x: 240, y: 140, number: 14 },  // Tail fin
      { x: 210, y: 130, number: 15 },  // Back leg start
      { x: 220, y: 170, number: 16 },  // Back leg middle
      { x: 200, y: 200, number: 17 },  // Back leg end
      { x: 180, y: 180, number: 18 },  // Back leg joint
      { x: 170, y: 140, number: 19 },  // Belly back
      { x: 140, y: 150, number: 20 },  // Belly middle
      { x: 120, y: 170, number: 21 },  // Front leg start
      { x: 100, y: 200, number: 22 },  // Front leg end
      { x: 120, y: 160, number: 23 },  // Front leg joint
      { x: 100, y: 130, number: 24 },  // Belly front
      { x: 90, y: 110, number: 25 },   // Neck bottom
      { x: 70, y: 100, number: 26 }    // Back to head
    ],
    gradient: {
      colors: ['#228B22', '#006400', '#228B22'],
      direction: { x1: 30, y1: 60, x2: 270, y2: 200 }
    },
    drawShape: (ctx: CanvasRenderingContext2D) => {
      ctx.beginPath();
      // Head
      ctx.moveTo(70, 100);
      ctx.bezierCurveTo(50, 80, 30, 90, 30, 100);
      ctx.bezierCurveTo(30, 110, 50, 120, 70, 110);
      
      // Neck and body
      ctx.bezierCurveTo(90, 100, 100, 80, 130, 60);
      ctx.bezierCurveTo(150, 60, 170, 70, 200, 90);
      
      // Tail
      ctx.bezierCurveTo(220, 110, 230, 120, 250, 130);
      ctx.bezierCurveTo(260, 140, 265, 150, 270, 160);
      ctx.bezierCurveTo(260, 155, 250, 145, 240, 140);
      
      // Back to underbelly
      ctx.bezierCurveTo(230, 130, 220, 120, 210, 130);
      
      // Back leg
      ctx.bezierCurveTo(215, 150, 220, 170, 200, 200);
      ctx.bezierCurveTo(190, 190, 185, 180, 180, 180);
      ctx.bezierCurveTo(175, 160, 170, 150, 170, 140);
      
      // Underbelly
      ctx.bezierCurveTo(160, 145, 150, 150, 140, 150);
      
      // Front leg
      ctx.bezierCurveTo(130, 160, 120, 170, 100, 200);
      ctx.bezierCurveTo(110, 180, 115, 170, 120, 160);
      ctx.bezierCurveTo(115, 150, 110, 140, 100, 130);
      
      // Back to neck
      ctx.bezierCurveTo(95, 120, 92, 115, 90, 110);
      
      ctx.closePath();
      
      // Wing (separate path)
      ctx.moveTo(150, 65);
      ctx.bezierCurveTo(170, 40, 190, 30, 220, 50);
      ctx.bezierCurveTo(200, 60, 180, 70, 170, 70);
      ctx.bezierCurveTo(165, 65, 160, 60, 150, 65);
      
      // Eye (separate path)
      ctx.moveTo(65, 95);
      ctx.arc(65, 95, 5, 0, Math.PI * 2);
    }
  }
};