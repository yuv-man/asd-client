import { areaTypes } from "@/app/helpers/areas";
import { motion } from "framer-motion";
import Image from "next/image";
import { Clock, Award, TrendingUp, BarChart2 } from "lucide-react";
import { DashboardProps } from "@/types/props";
import { MemoryAgeNorms } from "../results/norms";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { difficultyEnum } from "@/enums/enumDifficulty";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const AreaAnalyses = ({ user, area, value, recentData }: DashboardProps) => {    
    const areaColor = areaTypes[area].chartColor || '#4F46E5';
    const lightAreaColor = areaColor + '33'; // Add 33 for 20% opacity

    const scoreChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { 
                display: true,
                position: 'top' as const,
                align: 'end' as const,
                labels: {
                    boxWidth: 12,
                    usePointStyle: true,
                    pointStyle: 'circle',
                    padding: 10,
                    font: {
                        size: 10
                    }
                }
            },
            tooltip: {
                backgroundColor: 'rgba(0,0,0,0.8)',
                titleFont: { size: 14 },
                bodyFont: { size: 13 },
                padding: 12,
                callbacks: {
                    label: function(context: any) {
                        return `${context.dataset.label}: ${context.raw}%`;
                    }
                }
            }
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: { 
                    maxRotation: 0,
                    font: { size: 10 }
                }
            },
            y: {
                beginAtZero: true,
                max: 1000,
                grid: { 
                    color: 'rgba(0,0,0,0.05)',
                    drawBorder: false
                },
                ticks: { 
                    font: { size: 10 },
                    padding: 8
                }
            }
        }
    };

    const timeChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: 'rgba(0,0,0,0.8)',
                titleFont: { size: 14 },
                bodyFont: { size: 13 },
                padding: 12,
                displayColors: false,
                callbacks: {
                    label: function(context: any) {
                        return `Time: ${context.raw} min`;
                    }
                }
            }
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: { 
                    maxRotation: 0,
                    font: { size: 10 }
                }
            },
            y: {
                beginAtZero: true,
                grid: { 
                    color: 'rgba(0,0,0,0.05)',
                    drawBorder: false
                },
                ticks: { 
                    font: { size: 10 },
                    padding: 8
                }
            }
        }
    };

    // Calculate trending data
    const scoresTrend = recentData?.scores.length > 1 
        ? (recentData.scores[recentData.scores.length - 1] - recentData.scores[0]).toFixed(1)
        : '0';
    
    const isPositiveTrend = parseFloat(scoresTrend) >= 0;
    
    // Calculate norm comparison
    const age = user?.age as keyof typeof MemoryAgeNorms;
    const difficultyLevel = user?.areasProgress[area as keyof typeof user.areasProgress].difficultyLevel;
    const difficultyLevelEnum = difficultyEnum[difficultyLevel as keyof typeof difficultyEnum];
    const normScore = MemoryAgeNorms[age][difficultyLevelEnum].average; // Example norm score of 75%
    const normComparison = value.averageScore - normScore;
    const aboveNorm = normComparison >= 0;

    return (
        <motion.div
            key={areaTypes[area].id}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100"
        >
            <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                        <div className={`${areaTypes[area].class} w-10 h-10 rounded-lg flex items-center justify-center mr-3`}>
                            <Image src={areaTypes[area].icon} alt={area} width={20} height={20} className="text-white" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800">{area}</h3>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="flex items-center">
                            <Award className="w-4 h-4 mr-1 text-amber-500" />
                            <span className="text-sm font-medium text-gray-600">
                                Level {user?.areasProgress[area as keyof typeof user.areasProgress].difficultyLevel}
                            </span>
                        </div>
                        <div className="h-4 w-px bg-gray-200"></div>
                        <div className="flex items-center">
                            <span className="text-sm font-medium text-gray-600 flex items-center">
                                <span className="w-2 h-2 rounded-full bg-orange-400 mr-1"></span>
                                Norm: {normScore}
                            </span>
                        </div>
                    </div>
                </div>
                
                <div className="flex mb-8">
                    <div className="w-1/2 pr-3">
                        <div className="flex items-end mb-1">
                            <span className="text-3xl font-bold text-gray-800">{value.averageScore.toFixed(0)}</span>
                            <div className="flex ml-2">
                                {/* <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center ${isPositiveTrend ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    <TrendingUp className={`w-3 h-3 mr-1 ${!isPositiveTrend && 'transform rotate-180'}`} />
                                    {scoresTrend}%
                                </div> */}
                            </div>
                        </div>
                        <p className="text-xs text-gray-500">Average Score</p>
                    </div>
                    <div className="w-1/2 pl-3 border-l border-gray-100">
                        <div className="flex items-end mb-1">
                            <span className="text-3xl font-bold text-gray-800">{value.timeSpentMinutes.toFixed(0)}</span>
                            <span className="ml-1 text-gray-600 text-sm mb-1">min</span>
                        </div>
                        <div className="flex items-center">
                            <Clock className="w-3 h-3 mr-1 text-gray-400" />
                            <p className="text-xs text-gray-500">Total Time Spent</p>
                        </div>
                    </div>
                </div>
                
                {recentData && (
                    <div className="space-y-6">
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-sm font-medium text-gray-700">Performance</p>
                                <BarChart2 className="w-4 h-4 text-gray-400" />
                            </div>
                            <div className="relative h-32 w-full">
                                <Bar
                                    data={{
                                        labels: recentData.dates.map(date => {
                                            const d = new Date(date);
                                            return `${d.getMonth()+1}/${d.getDate()}`;
                                        }),
                                        datasets: [
                                            {
                                                data: recentData.scores,
                                                backgroundColor: areaColor,
                                                borderColor: areaColor,
                                                borderRadius: 4,
                                                borderWidth: 0,
                                                label: 'Your Score'
                                            }
                                        ]
                                    }}
                                    options={scoreChartOptions}
                                />
                                <div 
                                    className="absolute border-t-2 border-dashed border-orange-400 w-full left-0 z-10 pointer-events-none"
                                    style={{ 
                                        top: `${(1000 - normScore) / 10}%`,
                                        height: '1px'
                                    }}
                                >
                                    <div className="absolute right-0 -top-3 bg-orange-100 text-orange-800 px-1 py-0.5 text-xs rounded">
                                        Norm: {normScore}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-sm font-medium text-gray-700">Time Dedication</p>
                                <Clock className="w-4 h-4 text-gray-400" />
                            </div>
                            <div className="h-32 w-full">
                                <Bar
                                    data={{
                                        labels: recentData.dates.map(date => {
                                            const d = new Date(date);
                                            return `${d.getMonth()+1}/${d.getDate()}`;
                                        }),
                                        datasets: [{
                                            data: recentData.times,
                                            backgroundColor: lightAreaColor,
                                            borderColor: areaColor,
                                            borderRadius: 4,
                                            borderWidth: 0
                                        }]
                                    }}
                                    options={timeChartOptions}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    )
}

export default AreaAnalyses;