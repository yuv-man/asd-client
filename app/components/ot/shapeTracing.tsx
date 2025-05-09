import React, { useState, useRef, useEffect } from 'react';
import { SHAPES } from '@/app/helpers/shapesToTrace';
import { RotateCcw, CheckCircle2, XCircle } from 'lucide-react';
import { CardProps, CardContentProps, ExerciseProps } from '@/types/props';
import { shapeTracingSettings } from '@/app/helpers/difficultySettings';
import { Timer } from 'lucide-react';
import { difficultyEnum } from '@/enums/enumDifficulty';
import '@/app/styles/shapeTracing.scss';

type DifficultyLevel = 'easy' | 'medium' | 'hard';

// Update Card component
const Card: React.FC<CardProps> = ({ children }) => {
  return (
    <div className="shape-tracing-card">
      {children}
    </div>
  );
};

// Update CardContent component
const CardContent: React.FC<CardContentProps> = ({ children }) => {
  return (
    <div className="shape-tracing-content">
      {children}
    </div>
  );
};

const ACCURACY_THRESHOLD = 85; // Percentage accuracy required to progress
const POINT_RADIUS = 15;

// Add interfaces for points and lines
interface Point {
  x: number;
  y: number;
  number: number;
}

interface Line {
  start: Point;
  end: Point;
}

// Add these constants at the top with other constants


type ShapeKey = keyof typeof SHAPES;

const ShapeTracing: React.FC<ExerciseProps> = ({ onComplete, isTest, difficultyLevel }) => {
  // Add new state variables for test mode
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [timeInSeconds, setTimeInSeconds] = useState(0);

  // Modify initial shape selection for test mode
  const initialShape = Object.entries(SHAPES).find(([_, shape]) => shape.difficulty === difficultyLevel)?.[0] as ShapeKey;
  const [selectedShape, setSelectedShape] = useState<ShapeKey>(initialShape);
  const [currentPoint, setCurrentPoint] = useState<number>(1);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [lines, setLines] = useState<Line[]>([]);
  const [completed, setCompleted] = useState<boolean>(false);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [attempts, setAttempts] = useState<number>(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [drawingPath, setDrawingPath] = useState<Array<{x: number, y: number}>>([]);
  const [difficulty, setDifficulty] = useState<number>(difficultyLevel || 1);

  const points = SHAPES[selectedShape].points;

  // Calculate accuracy between drawn lines and ideal shape
  const calculateAccuracy = () => {
    // Number of lines is points.length - 1
    const numberOfLines = points.length - 1;
    // Lower attempts means higher accuracy (inverse relationship)
    const accuracy = Math.max(0, 100 - ((attempts / numberOfLines - 1) * 20));
    return Math.round(accuracy);
  };

  const getPointAtPosition = (x: number, y: number): Point | undefined => {
    // Special case for the last point when trying to close the shape
    if (currentPoint === points.length - 1) {
      // Check first point with a larger hit area
      const firstPoint = points[0];
      if (Math.sqrt(Math.pow(firstPoint.x - x, 2) + Math.pow(firstPoint.y - y, 2)) < POINT_RADIUS * 2) {
        return points[points.length - 1];
      }
    }
    
    return points.find(point => 
      Math.sqrt(Math.pow(point.x - x, 2) + Math.pow(point.y - y, 2)) < POINT_RADIUS * 2
    );
  };

  const handleDrawStart = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const startPoint = getPointAtPosition(x, y);
    
    if (startPoint?.number === currentPoint) {
      setIsDragging(true);
      setDrawingPath([{x, y}]);
    }
  };

  const handleDrawMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setDrawingPath(prev => [...prev, {x, y}]);
  };

  // Add this new function to check path accuracy
  const calculatePathAccuracy = (drawingPath: Array<{x: number, y: number}>, startPoint: Point, endPoint: Point): number => {
    if (drawingPath.length < 2) return 0;

    // Calculate the ideal line equation (ax + by + c = 0)
    const a = endPoint.y - startPoint.y;
    const b = startPoint.x - endPoint.x;
    const c = endPoint.x * startPoint.y - startPoint.x * endPoint.y;
    const lineLength = Math.sqrt(a * a + b * b);

    // Calculate average distance of points from the line
    let totalDeviation = 0;
    drawingPath.forEach(point => {
      // Distance from point to line formula: |ax + by + c| / sqrt(a² + b²)
      const distance = Math.abs(a * point.x + b * point.y + c) / lineLength;
      totalDeviation += distance;
    });

    const averageDeviation = totalDeviation / drawingPath.length;
    const difficultyKey = difficultyEnum[difficulty as 1 | 2 | 3] as DifficultyLevel;
    const maxAllowedDeviation = shapeTracingSettings[difficultyKey].maxDeviation;
    
    // Convert deviation to accuracy percentage
    const accuracy = Math.max(0, Math.min(100, 100 - (averageDeviation / maxAllowedDeviation * 100)));
    return accuracy;
  };

  // Add useEffect to set start time when component mounts in test mode
  useEffect(() => {
    if (isTest) {
      setStartTime(Date.now());
    }
  }, [isTest]);

  // Modify the completion logic in handleDrawEnd and handleTouchEnd
  const handleCompletion = (drawingAccuracy: number) => {
    setAccuracy(drawingAccuracy);
    setCompleted(true);

    if (isTest) {
      setEndTime(Date.now());
      const timeInSeconds = startTime ? (Date.now() - startTime) / 1000 : 0;
      
      // Calculate normalized scores for each component (0-1000)
      const accuracyWeight = 0.5;  // 50% of total score
      const timeWeight = 0.3;      // 30% of total score
      const attemptsWeight = 0.2;  // 20% of total score
      
      // Accuracy score (0-1000)
      const accuracyScore = (drawingAccuracy / 100) * 1000 * accuracyWeight;
      
      // Time score (0-1000)
      // Assuming 60 seconds is the maximum time, better times get higher scores
      const timeScore = Math.max(0, (1 - timeInSeconds / 60)) * 1000 * timeWeight;
      
      // Attempts score (0-1000)
      // Assuming 10 attempts is the maximum, fewer attempts get higher scores
      const maxAttempts = 10;
      const attemptsScore = Math.max(0, (1 - attempts / maxAttempts)) * 1000 * attemptsWeight;
      
      // Calculate total score (0-1000)
      const totalScore = Math.round(accuracyScore + timeScore + attemptsScore);

      // Call onComplete with the normalized score and metrics
      onComplete?.({
        score: totalScore,
        metrics: {
          accuracy: drawingAccuracy,
          timeInSeconds: Math.round(timeInSeconds),
          attempts: attempts
        }
      });
    }
  };

  const handleDrawEnd = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const endPoint = getPointAtPosition(x, y);
    
    if (endPoint?.number === currentPoint + 1) {
      const pathAccuracy = calculatePathAccuracy(
        drawingPath, 
        points[currentPoint - 1], 
        endPoint
      );
      const difficultyKey = difficultyEnum[difficulty as 1 | 2 | 3] as DifficultyLevel;
      if (pathAccuracy >= shapeTracingSettings[difficultyKey].accuracyThreshold) {
        const newLine = {
          start: points[currentPoint - 1],
          end: endPoint
        };
        
        const newLines = [...lines, newLine];
        setLines(newLines);
        
        if (currentPoint + 1 === points.length) {
          const drawingAccuracy = calculateAccuracy();
          handleCompletion(drawingAccuracy);
        } else {
          setCurrentPoint(currentPoint + 1);
          setAttempts(prev => prev + 1);
        }
      } else {
        setAttempts(prev => prev + 1);
      }
    } else {
      setAttempts(prev => prev + 1);
    }
    
    setIsDragging(false);
    setDrawingPath([]);
  };

  const resetDrawing = () => {
    setCurrentPoint(1);
    setLines([]);
    setAttempts(0);
    setCompleted(false);
    setIsDragging(false);
    setDrawingPath([]);
    setAccuracy(null);
  };

  const selectShape = (shape: string) => {
    if (!isTest && completed && accuracy !== null && accuracy >= ACCURACY_THRESHOLD) {
      setSelectedShape(shape as ShapeKey);
      resetDrawing();
      setAttempts(0);
    }
  };

  // Handle touch events for mobile support
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    
    const startPoint = getPointAtPosition(x, y);
    
    if (startPoint?.number === currentPoint) {
      setIsDragging(true);
      setDrawingPath([{x, y}]);
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;
    e.preventDefault();
    
    const touch = e.touches[0];
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    setDrawingPath(prev => [...prev, {x, y}]);
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDragging || !drawingPath.length) return;
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    let x, y;
    
    if (e.changedTouches && e.changedTouches.length > 0) {
      const touch = e.changedTouches[0];
      x = touch.clientX - rect.left;
      y = touch.clientY - rect.top;
    } else if (drawingPath.length > 1) {
      x = drawingPath[drawingPath.length - 1].x;
      y = drawingPath[drawingPath.length - 1].y;
    } else {
      return;
    }
    
    const endPoint = getPointAtPosition(x, y);
    
    if (endPoint?.number === currentPoint + 1) {
      const pathAccuracy = calculatePathAccuracy(
        drawingPath, 
        points[currentPoint - 1], 
        endPoint
      );
      const difficultyKey = difficultyEnum[difficulty as 1 | 2 | 3] as DifficultyLevel;
      if (pathAccuracy >= shapeTracingSettings[difficultyKey].accuracyThreshold) {
        const newLine = {
          start: points[currentPoint - 1],
          end: endPoint
        };
        const newLines = [...lines, newLine];
        setLines(newLines);
        
        if (currentPoint + 1 === points.length) {
          const drawingAccuracy = calculateAccuracy();
          handleCompletion(drawingAccuracy);
        } else {
          setCurrentPoint(currentPoint + 1);
        }
      } else {
        setAttempts(prev => prev + 1);
      }
    } else {
      setAttempts(prev => prev + 1);
    }
    
    setIsDragging(false);
    setDrawingPath([]);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the shape preview
    ctx.save();
    ctx.globalAlpha = completed ? 1 : 0.3;
    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 2;
    
    const shape = SHAPES[selectedShape];
    shape.drawShape(ctx);
    
    const { direction, colors } = shape.gradient;
    const gradient = ctx.createLinearGradient(
      direction.x1, direction.y1, direction.x2, direction.y2
    );
    colors.forEach((color, index) => {
      gradient.addColorStop(index / (colors.length - 1), color);
    });
    
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    ctx.setLineDash([]);

    // Draw completed lines
    ctx.beginPath();
    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 3;
    lines.forEach(line => {
      ctx.moveTo(line.start.x, line.start.y);
      ctx.lineTo(line.end.x, line.end.y);
    });
    ctx.stroke();

    // Draw current drawing path
    if (drawingPath.length > 1) {
      ctx.beginPath();
      ctx.strokeStyle = '#93c5fd';
      ctx.lineWidth = 3;
      ctx.moveTo(drawingPath[0].x, drawingPath[0].y);
      
      for (let i = 1; i < drawingPath.length; i++) {
        ctx.lineTo(drawingPath[i].x, drawingPath[i].y);
      }
      ctx.stroke();
    }

    // Draw points - modified to handle overlapping first/last points
    points.forEach((point, index) => {
      if (index === points.length - 1 && !completed) {
        // Draw the last point with a larger radius and different color if it's the current target
        if (currentPoint === points.length - 1) {
          ctx.beginPath();
          ctx.fillStyle = '#6b7280';
          ctx.arc(point.x, point.y, POINT_RADIUS * 1.5, 0, 2 * Math.PI);
          ctx.fill();
          ctx.strokeStyle = 'white';
          ctx.lineWidth = 2;
          ctx.stroke();
          
          // Draw the number slightly offset
          ctx.fillStyle = 'white';
          ctx.font = 'bold 16px Arial';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(point.number.toString(), point.x, point.y + POINT_RADIUS * 1.5);
        }
        return;
      }

      ctx.beginPath();
      ctx.fillStyle = index < currentPoint - 1 ? '#22c55e' : '#6b7280';
      ctx.arc(point.x, point.y, POINT_RADIUS, 0, 2 * Math.PI);
      ctx.fill();

      ctx.strokeStyle = 'white';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = 'white';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(point.number.toString(), point.x, point.y);
    });
  }, [points, lines, drawingPath, currentPoint, completed, selectedShape]);

  useEffect(() => {
    if (startTime) {
      const interval = setInterval(() => {
        setTimeInSeconds(Math.round((Date.now() - startTime) / 1000));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [startTime]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Add non-passive touch event listeners
    canvas.addEventListener('touchstart', (e) => e.preventDefault(), { passive: false });
    canvas.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });
    canvas.addEventListener('touchend', (e) => e.preventDefault(), { passive: false });

    // Cleanup
    return () => {
      canvas.removeEventListener('touchstart', (e) => e.preventDefault());
      canvas.removeEventListener('touchmove', (e) => e.preventDefault());
      canvas.removeEventListener('touchend', (e) => e.preventDefault());
    };
  }, []);

  return (
    <Card>
      <CardContent>
        <div className="shape-tracing-header">
          <div className="shape-tracing-title">
            <h2>Learn to Draw!</h2>
          </div>
          <div className="shape-tracing-buttons">
            {Object.entries(SHAPES)
              .filter(([key, shape]) => shape.difficulty === difficultyLevel)
              .map(([key, shape]) => {
                const Icon = shape.icon;
                return (
                  <button
                    key={key}
                    onClick={() => selectShape(key as ShapeKey)}
                    className={`${selectedShape === key ? 'selected' : ''}`}
                    disabled={(!completed || accuracy !== null && accuracy < ACCURACY_THRESHOLD) && key !== selectedShape}
                    title={shape.name}
                  >
                    <Icon />
                  </button>
                );
              })}
            {!isTest && (
              <button onClick={resetDrawing} title="Try Again">
                <RotateCcw />
              </button>
            )}
          </div>
        </div>

        <div className="shape-tracing-canvas-container">
          <canvas
            ref={canvasRef}
            width={300}
            height={300}
            onMouseDown={handleDrawStart}
            onMouseMove={handleDrawMove}
            onMouseUp={handleDrawEnd}
            onMouseLeave={handleDrawEnd}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          />
          
          {completed && (
            <div className="shape-tracing-completion-overlay">
              <div className="shape-tracing-completion-card">
                <div className="shape-tracing-stats">
                  {accuracy !== null && accuracy >= ACCURACY_THRESHOLD ? (
                    <CheckCircle2 className="text-green-500" />
                  ) : (
                    <XCircle className="text-red-500" />
                  )}
                  <span className="shape-tracing-stats-text">
                    Accuracy: {accuracy}%
                  </span>
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  Attempts: {attempts} 
                </div>
                {accuracy !== null && accuracy >= ACCURACY_THRESHOLD ? (
                  <div className="text-green-600">
                    Great job! You can move to the next shape!
                  </div>
                ) : (
                  <div className="text-blue-600">
                    Keep practicing to reach {ACCURACY_THRESHOLD}% accuracy
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="shape-tracing-footer">
          {!completed ? (
            <div>
              <div>Drag from point {currentPoint} to point {currentPoint + 1}</div>
              <div className={`shape-tracing-attempts ${isTest ? 'with-timer' : ''}`}>
                <div>Attempts: {attempts}</div>
                {isTest && (
                  <div className="shape-tracing-timer">
                    <Timer />
                    <span>{timeInSeconds}</span>
                  </div>
                )}
              </div>
            </div>
          ) : accuracy !== null && accuracy >= ACCURACY_THRESHOLD ? (
            <div>Choose another shape or reset to try again!</div>
          ) : (
            <div>Click reset to try again and improve your accuracy!</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ShapeTracing;
