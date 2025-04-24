import Image from 'next/image';
import puzzleImage from '@/public/images/puzzle.png';
import { useState, useEffect, useCallback } from "react";
import { PuzzlePiece } from '@/types/types';
import { ExerciseProps } from '@/types/props';
import { Timer } from 'lucide-react';
import '@/app/styles/puzzle.scss';

const ProblemSolvingExercise: React.FC<ExerciseProps> = ({ onComplete, isTest, difficultyLevel = 1 }) => {
    // Convert difficultyLevel to grid size
    const gridSize = difficultyLevel + 2; // Level 1 = 3x3, Level 2 = 4x4, Level 3 = 5x5
    
    const [image, setImage] = useState(puzzleImage.src);
    const [pieces, setPieces] = useState<PuzzlePiece[]>([]);
    const [shuffledPieces, setShuffledPieces] = useState<PuzzlePiece[]>([]);
    const [time, setTime] = useState(0);
    const [moves, setMoves] = useState(0);
    const [solved, setSolved] = useState(false);
    const [selectedPieceIndex, setSelectedPieceIndex] = useState<number | null>(null);
    const [draggedPieceIndex, setDraggedPieceIndex] = useState<number | null>(null);

    // Initialize puzzle on component mount or when difficulty changes
    useEffect(() => {
        generatePuzzle(puzzleImage.src);
        // Reset game state when difficulty changes
        setTime(0);
        setMoves(0);
        setSolved(false);
    }, [difficultyLevel]);

    // Generate Puzzle Pieces based on grid size
    const generatePuzzle = (imageUrl: string) => {
        let tempPieces = [];
        let id = 0;
        for (let row = 0; row < gridSize; row++) {
            for (let col = 0; col < gridSize; col++) {
                tempPieces.push({ 
                    id, 
                    row, 
                    col, 
                    originalIndex: id, 
                    imageUrl 
                });
                id++;
            }
        }
        setPieces(tempPieces);
        setShuffledPieces(shuffleArray([...tempPieces]));
    };

    // Shuffle Pieces Randomly
    const shuffleArray = (array: any[]) => {
        // More thorough shuffling algorithm
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    };

    // Timer Effect
    useEffect(() => {
        if (!solved) {
            const timer = setInterval(() => setTime(time + 1), 1000);
            return () => clearInterval(timer);
        }
    }, [time, solved]);

    // Check if puzzle is solved
    const checkIfSolved = useCallback((puzzle: PuzzlePiece[]) => {
        if (puzzle.every((piece: PuzzlePiece, index: number) => piece.originalIndex === index)) {
            setSolved(true);
            const finalScore = calculateScore();
            onComplete?.({ 
                score: finalScore, 
                metrics: {
                    timeInSeconds: time,
                    attempts: moves,
                    accuracy: calculateAccuracy()
                }
            });
        }
    }, [time, moves, onComplete]);

    // Calculate accuracy based on moves
    const calculateAccuracy = () => {
        // Minimum moves required is number of pieces - 1
        const minMoves = (gridSize * gridSize) - 1;
        // Higher accuracy for fewer moves
        return Math.max(0, Math.min(100, (minMoves / moves) * 100));
    };

    // Calculate Score based on difficulty
    const calculateScore = () => {
        // Expected values adjusted by difficulty
        const maxExpectedTime = 120 * difficultyLevel; // More time allowed for higher difficulties
        const expectedMoves = 15 * (gridSize * gridSize) / 9; // Scale expected moves by puzzle size

        // Time weight (50% of total score)
        const timeWeight = 0.5;
        const timeScore = Math.max(0, (1 - time / maxExpectedTime)) * 1000 * timeWeight;

        // Moves/attempts weight (50% of total score)
        const movesWeight = 0.5;
        const movesScore = Math.max(0, (1 - moves / expectedMoves)) * 1000 * movesWeight;

        // Apply difficulty multiplier
        const difficultyMultiplier = 1 + (difficultyLevel - 1) * 0.25; // Level 1 = 1x, Level 2 = 1.25x, Level 3 = 1.5x

        return Math.round(Math.max(0, Math.min(1000, (timeScore + movesScore) * difficultyMultiplier)));
    };

    // Swap two pieces
    const swapPieces = (index1: number, index2: number) => {
        if (index1 === index2) return;
        
        let temp = [...shuffledPieces];
        [temp[index1], temp[index2]] = [temp[index2], temp[index1]];
        setShuffledPieces(temp);
        setMoves(moves + 1);
        checkIfSolved(temp);
    };

    // Handle piece selection with tap/click (works for both touch and mouse)
    const handlePieceClick = (index: number) => {
        if (selectedPieceIndex === null) {
            // First piece selected
            setSelectedPieceIndex(index);
        } else {
            // Second piece selected, swap them
            swapPieces(selectedPieceIndex, index);
            setSelectedPieceIndex(null);
        }
    };

    // Reset selection if clicked elsewhere
    const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
        // Only reset if clicking the container but not a piece
        if ((e.target as HTMLElement).classList.contains('puzzle-container')) {
            setSelectedPieceIndex(null);
        }
    };

    // Add drag and drop handlers
    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
        setDraggedPieceIndex(index);
        e.currentTarget.classList.add('dragging');
    };

    const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
        e.currentTarget.classList.remove('dragging');
        setDraggedPieceIndex(null);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault(); // Necessary to allow drop
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, index: number) => {
        e.preventDefault();
        if (draggedPieceIndex !== null && draggedPieceIndex !== index) {
            swapPieces(draggedPieceIndex, index);
        }
        setDraggedPieceIndex(null);
    };

    return (
        <div className="puzzle-container" onClick={handleContainerClick}>
            <h1 className="puzzle-title">Puzzle Game - Level {difficultyLevel}</h1>
            
            <div className="puzzle-reference">
                <Image 
                    src={puzzleImage.src} 
                    alt="Puzzle reference" 
                    width={100} 
                    height={100}
                />
            </div>
            
            <div 
                className="puzzle-grid" 
                style={{ 
                    gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                    ['--grid-size' as any]: gridSize 
                }}
            >
                {shuffledPieces.map((piece, index) => (
                    <div
                        key={piece.id}
                        className={`puzzle-piece ${selectedPieceIndex === index ? 'selected' : ''} ${piece.originalIndex === index ? 'correct-position' : ''}`}
                        onClick={() => handlePieceClick(index)}
                        draggable={true}
                        onDragStart={(e) => handleDragStart(e, index)}
                        onDragEnd={handleDragEnd}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, index)}
                        style={{
                            backgroundImage: `url(${piece.imageUrl})`,
                            backgroundPosition: `${-piece.col * (100 / gridSize) * 3}% ${-piece.row * (100 / gridSize) * 3}%`,
                            backgroundSize: `${gridSize * 100}% ${gridSize * 100}%`,
                        }}
                    >
                        {piece.originalIndex === index && (
                            <div className="correct-indicator" />
                        )}
                    </div>
                ))}
            </div>

            <div className="puzzle-instructions">
                {selectedPieceIndex !== null ? 
                    "Now tap another piece to swap positions" : 
                    "Tap a piece to select it"
                }
            </div>

            <div className="puzzle-stats">
                <div className="stat-item">
                    <Timer className="stat-icon" />
                    <p>{time}s</p>
                </div>
                <div className="stat-item">
                    <p>Moves: {moves}</p>
                </div>
                {solved && (
                    <div className="score-container">
                        <h2>Score: {calculateScore()}</h2>
                        <p>
                            (Efficiency: {Math.round(calculateAccuracy())}%)
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ProblemSolvingExercise;