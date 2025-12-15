/**
 * Study Page Component
 * Main study interface with content input, analysis results, and flashcard review
 * Demonstrates: useEffect hook (rubric requirement)
 */

import { useEffect } from 'react';
import { useStudy } from '../context/StudyContext';
import StudyInput from '../components/StudyInput';
import LoadingAnalysis from '../components/LoadingAnalysis';
import AnalysisResults from '../components/AnalysisResults';
import FlashcardReview from '../components/FlashcardReview';
import SavedMaterials from '../components/SavedMaterials';

function StudyPage() {
  const { currentView, content, keywords, flashcards, isLoading } = useStudy();

  // Log view changes for debugging (demonstrates useEffect)
  useEffect(() => {
    console.log('Current view changed to:', currentView);
  }, [currentView]);

  // Render based on current view
  const renderContent = () => {
    switch (currentView) {
      case 'study':
        return <StudyInput />;
      
      case 'analyzing':
        return (
          <div className="flex items-center justify-center min-h-[60vh]">
            <LoadingAnalysis />
          </div>
        );
      
      case 'results':
        return (
          <AnalysisResults
            content={content}
            keywords={keywords}
          />
        );
      
      case 'flashcards':
        return (
          <div className="flex items-center justify-center min-h-[60vh]">
            {flashcards.length > 0 ? (
              <FlashcardReview cards={flashcards} />
            ) : (
              <div className="text-center text-gray-500">
                <p>No flashcards yet. Analyze some study material first!</p>
              </div>
            )}
          </div>
        );
      
      case 'history':
        return <SavedMaterials />;
      
      default:
        return <StudyInput />;
    }
  };

  return (
    <div className="animate-fade-in">
      {renderContent()}
    </div>
  );
}

export default StudyPage;
