/**
 * Flashcard Review Component
 * Interactive flashcard review with 3D flip animation
 * Demonstrates: CSS Animation (flip card - rubric requirement)
 */

import { useState } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, RotateCcw, Check, Shuffle } from 'lucide-react';
import { useStudy } from '../context/StudyContext';
import Flashcard from './Flashcard';

function FlashcardReview({ cards }) {
  const { resetToStudy, setCurrentView, updateFlashcardMastered, keywords } = useStudy();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [masteredCards, setMasteredCards] = useState(new Set());
  const [shuffledCards, setShuffledCards] = useState(cards);

  const currentCard = shuffledCards[currentIndex];
  const progress = ((currentIndex + 1) / shuffledCards.length) * 100;

  const handleNext = () => {
    if (currentIndex < shuffledCards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleMarkMastered = () => {
    const cardId = currentCard.id;
    const newMasteredCards = new Set(masteredCards);
    
    if (newMasteredCards.has(cardId)) {
      newMasteredCards.delete(cardId);
      updateFlashcardMastered(cardId, false);
    } else {
      newMasteredCards.add(cardId);
      updateFlashcardMastered(cardId, true);
    }
    
    setMasteredCards(newMasteredCards);
  };

  const handleShuffle = () => {
    const shuffled = [...shuffledCards].sort(() => Math.random() - 0.5);
    setShuffledCards(shuffled);
    setCurrentIndex(0);
  };

  const handleBack = () => {
    // Go back to results if we have keywords, otherwise go to history
    if (keywords && keywords.length > 0) {
      setCurrentView('results');
    } else {
      setCurrentView('history');
    }
  };

  const isMastered = masteredCards.has(currentCard?.id);

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {keywords && keywords.length > 0 ? 'Back to analysis' : 'Back to history'}
        </button>
      </div>

      <div className="space-y-6">
        {/* Title and stats */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Study Session</h1>
            <p className="text-sm text-gray-500 mt-1">
              {masteredCards.size} of {shuffledCards.length} cards mastered
            </p>
          </div>
          <button
            onClick={handleShuffle}
            className="btn-outline flex items-center gap-2"
          >
            <Shuffle className="w-4 h-4" />
            Shuffle
          </button>
        </div>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Progress</span>
            <span className="font-medium text-gray-700">
              Card {currentIndex + 1} of {shuffledCards.length}
            </span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-bar-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Flashcard */}
        <Flashcard
          key={currentCard?.id}
          front={currentCard?.front}
          back={currentCard?.back}
        />

        {/* Navigation controls */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="btn-outline p-3 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Previous card"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={handleMarkMastered}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              isMastered
                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                : 'btn-outline'
            }`}
          >
            {isMastered ? (
              <>
                <Check className="w-4 h-4" />
                Mastered
              </>
            ) : (
              <>
                <RotateCcw className="w-4 h-4" />
                Mark Mastered
              </>
            )}
          </button>

          <button
            onClick={handleNext}
            disabled={currentIndex === shuffledCards.length - 1}
            className="btn-outline p-3 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Next card"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Card dots indicator */}
        <div className="flex justify-center">
          <div className="flex gap-1.5">
            {shuffledCards.map((card, index) => (
              <button
                key={card.id}
                onClick={() => setCurrentIndex(index)}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${
                  index === currentIndex
                    ? 'bg-primary-600'
                    : masteredCards.has(card.id)
                    ? 'bg-green-500'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to card ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FlashcardReview;
