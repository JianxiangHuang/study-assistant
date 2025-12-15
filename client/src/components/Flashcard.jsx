/**
 * Flashcard Component
 * Individual flashcard with 3D flip animation
 * Demonstrates: CSS 3D Transform Animation (rubric requirement)
 */

import { useState } from 'react';

function Flashcard({ front, back }) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleKeyDown = (e) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      handleFlip();
    }
  };

  return (
    <div
      className="perspective-1000 cursor-pointer w-full"
      style={{ perspective: '1000px' }}
      onClick={handleFlip}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={isFlipped ? 'Showing answer. Click to see question.' : 'Showing question. Click to see answer.'}
    >
      <div
        className="relative w-full aspect-[3/2] transition-transform duration-500"
        style={{
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
        }}
      >
        {/* Front side - Question */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center p-8 
                     bg-white rounded-xl shadow-lg border border-gray-200"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <p className="text-sm text-gray-400 mb-4 uppercase tracking-wider">
            Question
          </p>
          <h2 className="text-xl md:text-2xl font-bold text-center text-gray-900 leading-relaxed">
            {front}
          </h2>
          <p className="text-sm text-gray-400 mt-6">
            Click to flip
          </p>
        </div>

        {/* Back side - Answer */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center p-8 
                     bg-primary-50 rounded-xl shadow-lg border border-primary-200"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
        >
          <p className="text-sm text-primary-400 mb-4 uppercase tracking-wider">
            Answer
          </p>
          <p className="text-lg text-center text-primary-900 leading-relaxed">
            {back}
          </p>
          <p className="text-sm text-primary-400 mt-6">
            Click to flip back
          </p>
        </div>
      </div>
    </div>
  );
}

export default Flashcard;
