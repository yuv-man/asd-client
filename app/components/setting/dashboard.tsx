import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Award, ArrowRight, Star } from 'lucide-react';
import { WeeklySummary, User } from '@/types/types';
import { weeklySummariesAPI, dailySummariesAPI } from '@/services/api';
import AreaAnalyses from './areaAnalyses';

const Dashboard = ({ user }: { user: User | null }) => {
  const [userProgress, setUserProgress] = useState<WeeklySummary>();
  const [recentData, setRecentData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
 
  const fetchRecentData = async () => {
    try {
      const recentData = await dailySummariesAPI.getRecentByUser(user?._id);
      if(recentData?.data?.length > 0) {
        const data = recentData.data;
        
        // Create an array of the last 7 days
        const last7Days = Array.from({length: 7}, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - i);
          return date.toLocaleDateString();
        }).reverse();

        const createEmptyDataSet = () => ({
          dates: last7Days,
          scores: Array(7).fill(null),
          times: Array(7).fill(null),
          exercisesCompleted: Array(7).fill(null)
        });

        const otData = createEmptyDataSet();
        const speechData = createEmptyDataSet();
        const cognitiveData = createEmptyDataSet();

        // Fill in actual data where it exists
        data.forEach((item: any) => {
          if (!item.areaBreakdown) return;
          
          const date = new Date(item.date).toLocaleDateString();
          const dateIndex = otData.dates.indexOf(date);

          // OT data
          const ot = item.areaBreakdown['ot'];
          if (ot) {
            otData.scores[dateIndex] = ot.averageScore;
            otData.times[dateIndex] = ot.timeSpentMinutes;
            otData.exercisesCompleted[dateIndex] = ot.exercisesCompleted;
          }

          // Speech data
          const speech = item.areaBreakdown['speech'];
          if (speech) {
            speechData.scores[dateIndex] = speech.averageScore;
            speechData.times[dateIndex] = speech.timeSpentMinutes;
            speechData.exercisesCompleted[dateIndex] = speech.exercisesCompleted;
          }

          // Cognitive data
          const cognitive = item.areaBreakdown['cognitive'];
          if (cognitive) {
            cognitiveData.scores[dateIndex] = cognitive.averageScore;
            cognitiveData.times[dateIndex] = cognitive.timeSpentMinutes;
            cognitiveData.exercisesCompleted[dateIndex] = cognitive.exercisesCompleted;
          }
        });

        setRecentData({
          ot: otData,
          speech: speechData,
          cognitive: cognitiveData
        });
      } else {
        // Initialize with empty data if no data is returned
        setRecentData({
          ot: { dates: [], scores: [], times: [], exercisesCompleted: [] },
          speech: { dates: [], scores: [], times: [], exercisesCompleted: [] },
          cognitive: { dates: [], scores: [], times: [], exercisesCompleted: [] }
        });
      }
    } catch (error) {
      console.error("Error fetching recent data:", error);
      // Initialize with empty data on error
      setRecentData({
        ot: { dates: [], scores: [], times: [], exercisesCompleted: [] },
        speech: { dates: [], scores: [], times: [], exercisesCompleted: [] },
        cognitive: { dates: [], scores: [], times: [], exercisesCompleted: [] }
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchUserWeeklyProgress = async () => {
      try {
        const progress = await weeklySummariesAPI.getRecentByUser(user?._id);
        if (progress?.data) {
          setUserProgress(progress.data);
        }
      } catch (error) {
        console.error("Error fetching user progress:", error);
      }
    };
    
    if (user?._id) {
      fetchUserWeeklyProgress();
      fetchRecentData();
    }
  }, [user]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.name || 'User'}! 👋
        </h1>
        <p className="text-gray-600">
          Track your progress and continue your learning journey.
        </p>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Loading your progress data...</div>
      ) : (
        userProgress && recentData && (
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            {Object.entries(userProgress.areaBreakdown || {}).map(([area, value]) => (
              <AreaAnalyses 
                key={area} 
                user={user} 
                area={area} 
                value={value} 
                recentData={recentData[area]} 
              />
            ))}
          </div>
        )
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Recent Activities</h3>
          <div className="space-y-4">
            {userProgress?.recentExercises && userProgress.recentExercises.length > 0 ? (
              userProgress.recentExercises.slice(0, 10).map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <h4 className={`font-medium ${activity.area}`}>{activity.title}</h4>
                  </div>
                  <p className="text-sm text-gray-600">
                    {new Date(activity.timestamp).toLocaleDateString()}
                  </p>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 mr-1" />
                    <div>{activity.score}</div>
                  </div>
                  <div className="text-purple-600 flex items-center">
                    <Award className="w-4 h-4 mr-1" />
                    {activity.difficultyLevel}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-4">
                No recent activities found
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Recommended Exercises</h3>
          <div className="space-y-4">
            {[
              {
                title: 'Advanced Pattern Recognition',
                duration: '15 mins',
                difficulty: 'Medium',
                type: 'Cognitive'
              },
              {
                title: 'Speed Memory Challenge',
                duration: '10 mins',
                difficulty: 'Hard',
                type: 'Cognitive'
              },
              {
                title: 'Visual Attention Training',
                duration: '20 mins',
                difficulty: 'Easy',
                type: 'Cognitive'
              }
            ].map((exercise, index) => (
              <Link
                key={index}
                href={`/training/cognitive/${index + 1}`}
                className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {exercise.title}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {exercise.duration} • {exercise.difficulty}
                    </p>
                  </div>
                  <div className="text-purple-600">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;