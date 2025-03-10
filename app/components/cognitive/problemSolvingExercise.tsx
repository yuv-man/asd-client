import Image from 'next/image';
import puzzleImage from '@/assets/images/puzzle.png';
import { useState, useEffect } from "react";
import { ExerciseProps, PuzzlePiece } from '@/types/types';

const ProblemSolvingExercise: React.FC<ExerciseProps> = ({ onComplete, isTest, difficultyLevel }) => {
    const [image, setImage] = useState(puzzleImage.src);
    const [pieces, setPieces] = useState<PuzzlePiece[]>([]);
    const [shuffledPieces, setShuffledPieces] = useState<PuzzlePiece[]>([]);
    const [time, setTime] = useState(0);
    const [moves, setMoves] = useState(0);
    const [solved, setSolved] = useState(false);

    // Initialize puzzle on component mount
    useEffect(() => {
        generatePuzzle(puzzleImage.src);
    }, []);

    // Generate Puzzle Pieces (Splitting the Image into 9 Parts)
    const generatePuzzle = (imageUrl: string) => {
        let tempPieces = [];
        let id = 0;
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
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
        return array.sort(() => Math.random() - 0.5);
    };

    // Timer Effect
    useEffect(() => {
        if (!solved) {
            const timer = setInterval(() => setTime(time + 1), 1000);
            return () => clearInterval(timer);
        }
    }, [time, solved]);

    // Handle Drag and Drop
    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
        e.dataTransfer.setData("dragIndex", index.toString());
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, dropIndex: number) => {
        e.preventDefault();
        const dragIndex = parseInt(e.dataTransfer.getData("dragIndex"));
        if (dragIndex !== dropIndex) {
            let temp = [...shuffledPieces];
            [temp[dragIndex], temp[dropIndex]] = [temp[dropIndex], temp[dragIndex]];
            setShuffledPieces(temp);
            setMoves(moves + 1);
            checkIfSolved(temp);
        }
    };

    const checkIfSolved = (puzzle: PuzzlePiece[]) => {
        if (puzzle.every((piece: PuzzlePiece, index: number) => piece.originalIndex === index)) {
            setSolved(true);
            onComplete(calculateScore());
        }
    };

    // Calculate Score
    const calculateScore = () => {
        return Math.max(1000 - time * 5 - moves * 10, 0);
    };

    return (
        <div className='flex flex-col items-center justify-center h-screen'>
            <h1 className='text-2xl font-bold text-pastelOrange mb-4'>Puzzle Game</h1>
            
            <div className='mb-4'>
                <Image 
                    src={puzzleImage.src} 
                    alt="Puzzle reference" 
                    width={100} 
                    height={100} 
                    className='border border-gray-300 rounded'
                />
            </div>
            
            <div style={{ 
                display: "grid", 
                gridTemplateColumns: "repeat(3, 100px)", 
                gap: "5px",
                width: "310px",
                margin: "0 auto"
            }}>
                {shuffledPieces.map((piece, index) => (
                    <div
                        key={piece.id}
                        draggable="true"
                        onDragStart={(e) => handleDragStart(e, index)}
                        onDrop={(e) => handleDrop(e, index)}
                        onDragOver={(e) => e.preventDefault()}
                        style={{
                            width: "100px",
                            height: "100px",
                            backgroundImage: `url(${piece.imageUrl})`,
                            backgroundPosition: `${-piece.col * 100}px ${-piece.row * 100}px`,
                            backgroundSize: "300px 300px",
                            border: "1px solid black",
                            cursor: "grab",
                            userSelect: "none",
                            position: "relative"
                        }}
                    >
                        {piece.originalIndex === index && (
                            <div style={{
                                position: "absolute",
                                top: "5px",
                                right: "5px",
                                width: "12px",
                                height: "12px",
                                borderRadius: "50%",
                                backgroundColor: "#4CAF50",
                            }} />
                        )}
                    </div>
                ))}
            </div>
            <div className='flex flex-row items-center justify-center gap-4 mt-4'>
              <p className='text-secondary'>Time: {time}s</p>
              <p className='text-secondary'>Moves: {moves}</p>
              {solved && <h2 className='text-secondary'>Score: {calculateScore()}</h2>}
            </div>
        </div>
    );
}

export default ProblemSolvingExercise;