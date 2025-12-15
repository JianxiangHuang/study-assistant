/**
 * Loading Analysis Component
 * Animated loading state during AI analysis
 * Demonstrates: CSS Animation (rubric requirement)
 */

import { useStudy } from '../context/StudyContext';
import { BookOpen, Brain, Sparkles } from 'lucide-react';

function LoadingAnalysis() {
  const { analysisStage } = useStudy();

  const stages = [
    { id: 'reading', label: 'Reading content...', icon: BookOpen },
    { id: 'analyzing', label: 'Analyzing concepts...', icon: Brain },
    { id: 'extracting', label: 'Extracting keywords...', icon: Sparkles }
  ];

  const getCurrentStageIndex = () => {
    return stages.findIndex(s => s.id === analysisStage);
  };

  return (
    <div className="text-center">
      {/* Animated brain icon */}
      <div className="relative mb-8">
        <div className="w-24 h-24 mx-auto bg-primary-100 rounded-full flex items-center justify-center animate-pulse-subtle">
          <Brain className="w-12 h-12 text-primary-600" />
        </div>
        
        {/* Orbiting dots */}
        <div className="absolute inset-0 animate-spin" style={{ animationDuration: '3s' }}>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-primary-400 rounded-full" />
        </div>
        <div className="absolute inset-0 animate-spin" style={{ animationDuration: '4s', animationDirection: 'reverse' }}>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-primary-300 rounded-full" />
        </div>
      </div>

      {/* Progress stages */}
      <div className="space-y-4 max-w-xs mx-auto">
        {stages.map((stage, index) => {
          const Icon = stage.icon;
          const currentIndex = getCurrentStageIndex();
          const isActive = index === currentIndex;
          const isComplete = index < currentIndex;

          return (
            <div
              key={stage.id}
              className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${
                isActive 
                  ? 'bg-primary-50 border border-primary-200' 
                  : isComplete 
                    ? 'bg-green-50 border border-green-200'
                    : 'bg-gray-50 border border-gray-100'
              }`}
            >
              <div className={`p-2 rounded-full ${
                isActive 
                  ? 'bg-primary-100' 
                  : isComplete 
                    ? 'bg-green-100'
                    : 'bg-gray-200'
              }`}>
                <Icon className={`w-4 h-4 ${
                  isActive 
                    ? 'text-primary-600 animate-pulse' 
                    : isComplete 
                      ? 'text-green-600'
                      : 'text-gray-400'
                }`} />
              </div>
              <span className={`text-sm font-medium ${
                isActive 
                  ? 'text-primary-700' 
                  : isComplete 
                    ? 'text-green-700'
                    : 'text-gray-400'
              }`}>
                {stage.label}
              </span>
              
              {/* Animated dots for active stage */}
              {isActive && (
                <div className="flex gap-1 ml-auto">
                  <span className="w-1.5 h-1.5 bg-primary-400 rounded-full analyzing-dot" />
                  <span className="w-1.5 h-1.5 bg-primary-400 rounded-full analyzing-dot" />
                  <span className="w-1.5 h-1.5 bg-primary-400 rounded-full analyzing-dot" />
                </div>
              )}
              
              {/* Checkmark for complete stage */}
              {isComplete && (
                <svg className="w-5 h-5 text-green-500 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
          );
        })}
      </div>

      <p className="mt-6 text-sm text-gray-500">
        This may take a few seconds...
      </p>
    </div>
  );
}

export default LoadingAnalysis;
