'use client';
import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Brain, MessageSquare, Activity, TrendingUp, Award, Clock, ArrowRight } from 'lucide-react';
import { useUserStore } from '@/store/userStore';

const Dashboard = () => {
  const user = useUserStore((state) => state.user);

  const assessmentAreas = [
    {
      id: 'cognitive',
      title: 'Cognitive Skills',
      icon: Brain,
      color: 'from-blue-500 to-blue-600',
      score: 75,
      lastActivity: '2 days ago',
      improvement: '+12%'
    },
    {
      id: 'speech',
      title: 'Speech Therapy',
      icon: MessageSquare,
      color: 'from-purple-500 to-purple-600',
      score: 68,
      lastActivity: '1 day ago',
      improvement: '+8%'
    },
    {
      id: 'ot',
      title: 'Occupational Therapy',
      icon: Activity,
      color: 'from-green-500 to-green-600',
      score: 82,
      lastActivity: '3 days ago',
      improvement: '+15%'
    }
  ];

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
        {assessmentAreas.map((area) => (
          <motion.div
            key={area.id}
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <div className={`bg-gradient-to-r ${area.color} p-6 text-white`}>
              <area.icon className="w-8 h-8 mb-4" />
              <h3 className="text-xl font-semibold mb-2">{area.title}</h3>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold">{area.score}%</div>
                <div className="flex items-center text-green-300">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  {area.improvement}
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {area.lastActivity}
                </div>
                <div className="flex items-center">
                  <Award className="w-4 h-4 mr-1" />
                  Level 3
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href={`/assessment/${area.id}`}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-center hover:bg-gray-200"
                >
                  Take Test
                </Link>
                <Link
                  href={`/training/${area.id}`}
                  className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg text-center hover:bg-purple-200"
                >
                  Train
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Recent Activities</h3>
          <div className="space-y-4">
            {[
              {
                title: 'Memory Exercise',
                score: '85%',
                date: 'Today',
                type: 'Cognitive'
              },
              {
                title: 'Pattern Recognition',
                score: '92%',
                date: 'Yesterday',
                type: 'Cognitive'
              },
              {
                title: 'Shape Matching',
                score: '78%',
                date: '2 days ago',
                type: 'Cognitive'
              }
            ].map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <h4 className="font-medium text-gray-900">{activity.title}</h4>
                  <p className="text-sm text-gray-600">{activity.date}</p>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-green-600">
                    {activity.score}
                  </div>
                  <div className="text-sm text-gray-600">{activity.type}</div>
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