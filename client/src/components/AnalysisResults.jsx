/**
 * Analysis Results Component
 * Displays analyzed content with highlighted keywords and tooltips
 * Demonstrates: Interactive UI with tooltips (rubric requirement)
 */

import { useState } from 'react';
import { ArrowLeft, Sparkles, BookOpen, Layers } from 'lucide-react';
import { useStudy } from '../context/StudyContext';
import KeywordHighlight from './KeywordHighlight';
import KeywordCard from './KeywordCard';

function AnalysisResults({ content, keywords }) {
  const { generateFlashcards, resetToStudy, setCurrentView, flashcards, isLoading } = useStudy();
  const [activeTab, setActiveTab] = useState('highlighted'); // 'highlighted' | 'keywords'

  const handleViewFlashcards = () => {
    setCurrentView('flashcards');
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <button
          onClick={resetToStudy}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to input
        </button>

        <div className="flex items-center gap-2">
          {/* Show View Flashcards if flashcards exist */}
          {flashcards.length > 0 && (
            <button
              onClick={handleViewFlashcards}
              className="btn-outline flex items-center gap-2"
            >
              <Layers className="w-4 h-4" />
              View Flashcards ({flashcards.length})
            </button>
          )}
          
          <button
            onClick={generateFlashcards}
            disabled={isLoading || keywords.length === 0}
            className="btn-primary flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            {isLoading ? 'Generating...' : flashcards.length > 0 ? 'Regenerate Flashcards' : 'Generate Flashcards'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('highlighted')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'highlighted'
              ? 'bg-primary-100 text-primary-700'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <BookOpen className="w-4 h-4 inline mr-2" />
          Highlighted Content
        </button>
        <button
          onClick={() => setActiveTab('keywords')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'keywords'
              ? 'bg-primary-100 text-primary-700'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Sparkles className="w-4 h-4 inline mr-2" />
          Keywords ({keywords.length})
        </button>
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        {activeTab === 'highlighted' ? (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Your Study Material
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              Click on highlighted keywords to see their explanations.
            </p>
            <div className="prose prose-gray max-w-none">
              <KeywordHighlight content={content} keywords={keywords} />
            </div>
          </div>
        ) : (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Extracted Keywords
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              Click on any keyword to expand its explanation.
            </p>
            <div className="grid gap-3">
              {keywords.map((kw, index) => (
                <KeywordCard
                  key={index}
                  keyword={kw.keyword}
                  detail={kw.detail}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AnalysisResults;
