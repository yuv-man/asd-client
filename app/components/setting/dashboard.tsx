import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { TrendingUp, Award, Clock, ArrowRight, Star } from 'lucide-react';
import { areaTypes } from '@/app/helpers/areas';
import { DashboardProps } from '@/types/props';
import Image from 'next/image';
import { weeklySummariesAPI } from '@/services/api';
import { WeeklySummary } from '@/types/types';

const Dashboard = ({ user }: DashboardProps) => {
  const [userProgress, setUserProgress] = useState<WeeklySummary>();
  const assessmentAreas = [
    {
      id: 'cognitive',
      title: 'Cognitive Skills',
      icon: areaTypes.cognitive.icon,
      color: areaTypes.cognitive.color,
      class: areaTypes.cognitive.class,
      score: 0,
      lastActivity: '2 days ago',
      improvement: '+12%'
    },
    {
      id: 'speech',
      title: 'Speech Therapy',
      icon: areaTypes.speech.icon,
      color: areaTypes.speech.color,
      class: areaTypes.speech.class,
      score: 68,
      lastActivity: '1 day ago',
      improvement: '+8%'
    },
    {
      id: 'ot',
      title: 'Occupational Therapy',
      icon: areaTypes.ot.icon,
      color: areaTypes.ot.color,
      class: areaTypes.ot.class,
      score: 82,
      lastActivity: '3 days ago',
      improvement: '+15%'
    }
  ];

  useEffect(() => {
    const fetchUserProgress = async () => {
      const progress = await weeklySummariesAPI.getRecentByUser(user?._id);
      if (progress?.data) {
        console.log(progress.data);
        setUserProgress(progress.data);
      }
    };
    fetchUserProgress();
  }, [user]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.name}! 👋
        </h1>
        <p className="text-gray-600">
          Track your progress and continue your learning journey.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {userProgress?.areaBreakdown && Object.entries(userProgress.areaBreakdown).map(([area, value]) => (
          <motion.div
            key={areaTypes[area].id}
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <div className={`${areaTypes[area].class} p-6 text-white`}>
              <Image src={areaTypes[area].icon} alt={area} width={24} height={24} />
              <h3 className="text-xl font-semibold mb-2">{area}</h3>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold">{value.averageScore}%</div>
                {/* <div className="flex items-center text-green-300">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  {area.improvement}
                </div> */}
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {value.timeSpentMinutes.toFixed(2)} minutes
                </div>
                <div className="flex items-center">
                  <Award className="w-4 h-4 mr-1" />
                  {user?.areasProgress[area as keyof typeof user.areasProgress].difficultyLevel}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Recent Activities</h3>
          <div className="space-y-4">
            {userProgress?.recentExercises && userProgress.recentExercises.map((activity, index) => (
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
            ))}
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