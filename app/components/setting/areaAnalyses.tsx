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
import '@/app/styles/areaAnalyses.scss';

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
            className="area-analyses"
        >
            <div className="container">
                <div className="header">
                    <div className="header__left">
                        <div className={`header__left-icon ${areaTypes[area].class}`}>
                            <Image src={areaTypes[area].icon} alt={area} width={20} height={20} />
                        </div>
                        <h3 className="header__left-title">{area}</h3>
                    </div>
                    <div className="header__right">
                        <div className="header__right-level">
                            <Award className="award-icon" />
                            <span>
                                Level {user?.areasProgress[area as keyof typeof user.areasProgress].difficultyLevel}
                            </span>
                        </div>
                        <div className="header__right-divider"></div>
                        <div className="header__right-norm">
                            <span className="norm-dot"></span>
                            Norm: {normScore}
                        </div>
                    </div>
                </div>
                
                <div className="metrics">
                    <div className="metrics__score">
                        <div className="metrics__score-value">
                            <span className="number">{value.averageScore.toFixed(0)}</span>
                        </div>
                        <p className="metrics__score-label">Average Score</p>
                    </div>
                    <div className="metrics__time">
                        <div className="metrics__time-value">
                            <span className="number">{value.timeSpentMinutes.toFixed(0)}</span>
                            <span className="unit">min</span>
                        </div>
                        <div className="metrics__time-label">
                            <Clock className="icon" />
                            <p>Total Time Spent</p>
                        </div>
                    </div>
                </div>
                
                {recentData && (
                    <div className="charts">
                        <div className="charts__section">
                            <div className="charts__section-header">
                                <p className="title">Performance</p>
                                <BarChart2 className="icon" />
                            </div>
                            <div className="charts__section-chart">
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
                                    className="norm-line"
                                    style={{ top: `${(1000 - normScore) / 10}%` }}
                                >
                                    <div className="norm-label">
                                        Norm: {normScore}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="charts__section">
                            <div className="charts__section-header">
                                <p className="title">Time Dedication</p>
                                <Clock className="icon" />
                            </div>
                            <div className="charts__section-chart">
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