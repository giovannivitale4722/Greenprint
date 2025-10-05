'use client';

import React, { useState } from 'react';

interface Action {
  id: number;
  title: string;
  description: string;
  impact: string;
  difficulty?: string;
  acceptedDate?: string;
}

export default function ActionsDemoPage() {
  const initialRecommendations: Action[] = [
    {
      id: 1,
      title: 'Switch to Public Transportation',
      description: 'Replace 2 car trips per week with public transit to reduce your transportation emissions by 30%',
      impact: '4.5 kg CO2e/month',
      difficulty: 'Easy',
    },
    {
      id: 2,
      title: 'Reduce Meat Consumption',
      description: 'Try Meatless Mondays or reduce meat intake by 25% to lower food-related emissions',
      impact: '3.2 kg CO2e/month',
      difficulty: 'Medium',
    },
    {
      id: 3,
      title: 'Optimize Home Energy Use',
      description: 'Adjust thermostat by 2°F and switch to LED bulbs to reduce utility emissions',
      impact: '2.8 kg CO2e/month',
      difficulty: 'Easy',
    },
  ];

  const [recommendations, setRecommendations] = useState<Action[]>(initialRecommendations);
  const [acceptedActions, setAcceptedActions] = useState<Action[]>([]);
  const [generateError, setGenerateError] = useState('');

  const handleAccept = (action: Action) => {
    const acceptedAction = {
      ...action,
      acceptedDate: new Date().toISOString().split('T')[0],
    };
    setAcceptedActions([...acceptedActions, acceptedAction]);
    setRecommendations(recommendations.filter(rec => rec.id !== action.id));
  };

  const handleGenerateNew = () => {
    setGenerateError('Unable to generate new recommendations. AI service is currently unavailable.');
    setTimeout(() => setGenerateError(''), 5000);
  };

  return (
    <main className="min-h-screen max-w-full overflow-x-hidden bg-[#E5FCD4] text-black">
      {/* Top Border Accent */}
      <div className="h-1 w-full bg-[#1B4332]" />

      {/* Navbar */}
      <header className="bg-white shadow-sm w-full">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 w-full">
          <a href="/" className="text-2xl font-bold tracking-tight text-black hover:text-gray-700 transition">
            Greenprint
          </a>
          <nav className="hidden gap-6 text-sm md:flex">
            <a href="/dashboard-demo" className="text-black transition hover:text-gray-600">
              Dashboard
            </a>
            <a href="/transactions-demo" className="text-black transition hover:text-gray-600">
              Transactions
            </a>
            <a href="/insights-demo" className="text-black transition hover:text-gray-600">
              Insights
            </a>
            <a href="/actions-demo" className="text-[#1B4332] font-semibold transition hover:text-gray-600">
              Actions
            </a>
            <a href="/settings-demo" className="text-black transition hover:text-gray-600">
              Settings
            </a>
            <a href="/" className="text-black transition hover:text-gray-600">
              Home
            </a>
          </nav>
        </div>
      </header>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-6 py-8 w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-[#1B4332] mb-2">Action Plan</h1>
            <p className="text-gray-600">Personalized recommendations to reduce your carbon footprint</p>
          </div>
          <button 
            onClick={handleGenerateNew}
            className="bg-[#1B4332] text-white px-6 py-2 rounded-lg hover:opacity-90 transition flex items-center gap-2"
          >
            <span>✨</span>
            Generate New Recommendations
          </button>
        </div>

        {/* Generate Error Message */}
        {generateError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-start gap-2">
            <span className="text-red-500 font-bold">⚠️</span>
            <div>
              <strong className="font-bold">Error: </strong>
              <span>{generateError}</span>
            </div>
          </div>
        )}

        {/* Impact Summary */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8">
          <h2 className="text-xl font-bold text-[#1B4332] mb-4">Potential Impact</h2>
          <div className="grid grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Available Actions</p>
              <p className="text-3xl font-bold text-[#1B4332]">{recommendations.length}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Potential Savings</p>
              <p className="text-3xl font-bold text-green-600">
                {recommendations.reduce((sum, rec) => sum + parseFloat(rec.impact), 0).toFixed(1)} kg
              </p>
              <p className="text-xs text-gray-500">CO2e per month</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Actions Completed</p>
              <p className="text-3xl font-bold text-[#1B4332]">{acceptedActions.length}</p>
            </div>
          </div>
        </div>

        {/* Active Goals */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-[#1B4332] mb-4">Your Active Goals</h2>
          {acceptedActions.length === 0 ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-8 text-center">
              <div className="text-6xl mb-4">🎯</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Active Goals Yet</h3>
              <p className="text-gray-600 mb-4">
                Start your sustainability journey by accepting recommendations below!
              </p>
              <p className="text-sm text-gray-500">
                Each action you take helps reduce your carbon footprint and makes a real difference for our planet.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {acceptedActions.map((action) => (
                <div
                  key={action.id}
                  className="bg-white rounded-xl p-6 shadow-sm border-2 border-green-200"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">✅</span>
                        <h3 className="text-lg font-bold text-gray-900">{action.title}</h3>
                      </div>
                      <p className="text-gray-600 mb-3">{action.description}</p>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500">Saving:</span>
                          <span className="text-sm font-semibold text-green-600">{action.impact}</span>
                        </div>
                        <div className="text-sm text-gray-500">
                          Started: {action.acceptedDate ? new Date(action.acceptedDate).toLocaleDateString() : 'N/A'}
                        </div>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="bg-green-100 text-green-700 px-4 py-2 rounded-lg font-semibold text-sm">
                        Active
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pending Recommendations */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-[#1B4332] mb-4">Recommended Actions</h2>
          {recommendations.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center border border-gray-200">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">All Caught Up!</h3>
              <p className="text-gray-600">
                You've accepted all available recommendations. Click "Generate New Recommendations" to see more suggestions.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {recommendations.map((rec) => (
                <div key={rec.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-900">{rec.title}</h3>
                        {rec.difficulty && (
                          <span
                            className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              rec.difficulty === 'Easy'
                                ? 'bg-green-100 text-green-700'
                                : rec.difficulty === 'Medium'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-red-100 text-red-700'
                            }`}
                          >
                            {rec.difficulty}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 mb-3">{rec.description}</p>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500">Impact:</span>
                          <span className="text-sm font-semibold text-[#1B4332]">{rec.impact}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <span>🌱</span>
                          <span>Equivalent to planting 0.5 trees</span>
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleAccept(rec)}
                      className="ml-4 bg-[#1B4332] text-white px-6 py-2 rounded-lg hover:opacity-90 transition flex items-center gap-2"
                    >
                      <span>✓</span>
                      Accept
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tips Section */}
        <div className="mt-8 bg-gradient-to-r from-[#1B4332] to-[#2D5F4C] rounded-xl p-6 text-white">
          <h2 className="text-2xl font-bold mb-3">💡 Quick Tips</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white/10 rounded-lg p-4">
              <p className="font-semibold mb-1">Start Small</p>
              <p className="text-sm text-white/90">Begin with easy actions to build momentum</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <p className="font-semibold mb-1">Track Progress</p>
              <p className="text-sm text-white/90">Monitor your impact over time to stay motivated</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <p className="font-semibold mb-1">Be Consistent</p>
              <p className="text-sm text-white/90">Small daily changes create lasting impact</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <p className="font-semibold mb-1">Share & Inspire</p>
              <p className="text-sm text-white/90">Encourage others to join your sustainability journey</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#1B4332] py-8 text-white w-full mt-12">
        <div className="mx-auto max-w-6xl px-6 text-center text-sm w-full">
          <p>&copy; 2025 Greenprint. All rights reserved.</p>
          <div className="mt-4 flex justify-center space-x-6">
            <a href="/privacy" className="hover:text-gray-300">
              Privacy Policy
            </a>
            <a href="/terms" className="hover:text-gray-300">
              Terms of Service
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
