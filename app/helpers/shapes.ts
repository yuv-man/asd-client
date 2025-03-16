import { Star, Home, Flower2, Heart } from 'lucide-react';


export const SHAPES = {
    star: {
      name: 'Star',
      icon: Star,
      points: [
        { x: 150, y: 50, number: 1 },   
        { x: 250, y: 150, number: 2 },  
        { x: 200, y: 250, number: 3 },  
        { x: 100, y: 250, number: 4 }, 
        { x: 50, y: 150, number: 5 }, 
        { x: 150, y: 50, number: 6 } 
      ],
      gradient: {
        colors: ['#FFD700', '#FFA500', '#FF4500'],
        direction: { x1: 50, y1: 50, x2: 250, y2: 250 }
      },
      drawShape: (ctx: CanvasRenderingContext2D) => {
        ctx.beginPath();
        ctx.moveTo(150, 50);
        ctx.lineTo(250, 150);
        ctx.lineTo(200, 250);
        ctx.lineTo(100, 250);
        ctx.lineTo(50, 150);
        ctx.lineTo(150, 50);
        ctx.closePath();
      }
    },
    house: {
      name: 'House',
      icon: Home,
      points: [
        { x: 150, y: 50, number: 1 },   // Top of roof
        { x: 250, y: 150, number: 2 },  // Right roof
        { x: 250, y: 250, number: 3 },  // Right wall
        { x: 50, y: 250, number: 4 },   // Left wall
        { x: 50, y: 150, number: 5 },   // Left roof
        { x: 150, y: 50, number: 6 }    // Back to top
      ],
      gradient: {
        colors: ['#FF6B6B', '#FF8E8E', '#FFA5A5'],
        direction: { x1: 50, y1: 150, x2: 250, y2: 250 }
      },
      drawShape: (ctx: CanvasRenderingContext2D) => {
        ctx.beginPath();
        ctx.moveTo(150, 50);
        ctx.lineTo(250, 150);
        ctx.lineTo(250, 250);
        ctx.lineTo(50, 250);
        ctx.lineTo(50, 150);
        ctx.lineTo(150, 50);
        ctx.closePath();
      }
    },
    flower: {
      name: 'Flower',
      icon: Flower2,
      points: [
        { x: 150, y: 100, number: 1 },  // Top petal
        { x: 200, y: 150, number: 2 },  // Right petal
        { x: 150, y: 200, number: 3 },  // Bottom petal
        { x: 100, y: 150, number: 4 },  // Left petal
        { x: 150, y: 100, number: 5 }   // Back to top
      ],
      gradient: {
        colors: ['#4CAF50', '#8BC34A', '#CDDC39'],
        direction: { x1: 100, y1: 100, x2: 200, y2: 200 }
      },
      drawShape: (ctx: CanvasRenderingContext2D) => {
        ctx.beginPath();
        ctx.arc(150, 150, 50, 0, Math.PI * 2);
        
        // Draw petals
        for (let i = 0; i < 5; i++) {
          const angle = (i * 72 - 18) * Math.PI / 180;
          const x = 150 + Math.cos(angle) * 50;
          const y = 150 + Math.sin(angle) * 50;
          ctx.moveTo(150, 150);
          ctx.arc(x, y, 25, 0, Math.PI * 2);
        }
      }
    },
    heart: {
      name: 'Heart',
      icon: Heart,
      points: [
        { x: 150, y: 100, number: 1 },  // Top center
        { x: 200, y: 75, number: 2 },   // Right curve top
        { x: 250, y: 150, number: 3 },  // Right curve bottom
        { x: 150, y: 250, number: 4 },  // Bottom point
        { x: 50, y: 150, number: 5 },   // Left curve bottom
        { x: 100, y: 75, number: 6 },   // Left curve top
        { x: 150, y: 100, number: 7 }   // Back to top
      ],
      gradient: {
        colors: ['#FF69B4', '#FF1493', '#FF69B4'],
        direction: { x1: 50, y1: 75, x2: 250, y2: 250 }
      },
      drawShape: (ctx: CanvasRenderingContext2D) => {
        ctx.beginPath();
        ctx.moveTo(150, 100);
        ctx.bezierCurveTo(200, 20, 350, 150, 150, 250);
        ctx.bezierCurveTo(-50, 150, 100, 20, 150, 100);
        ctx.closePath();
      }
    }
  };