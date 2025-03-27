'use client';
import SpeechQuiz from "@/app/components/quizes/SpeechQuiz";
import CognitiveQuiz from "@/app/components/quizes/CognitiveQuiz";
import OtQuiz from "@/app/components/quizes/OtQuiz";
import { useParams } from "next/navigation";

export default function Quiz() {
    const { quizType } = useParams();
    if (quizType === 'speech') {
        return <SpeechQuiz isInitialAssessment={false} />;
    } else if (quizType === 'cognitive') {
        return <CognitiveQuiz isInitialAssessment={false} />;
    } else if (quizType === 'ot') {
        return <OtQuiz isInitialAssessment={false} />;
    }
}