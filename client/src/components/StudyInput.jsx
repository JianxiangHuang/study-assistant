/**
 * Study Input Component
 * Text area for entering study material to analyze
 */

import { useState } from 'react';
import { Sparkles, FileText, Lightbulb } from 'lucide-react';
import { useStudy } from '../context/StudyContext';

function StudyInput() {
  const [inputContent, setInputContent] = useState('');
  const { analyzeContent, isLoading } = useStudy();

  const handleAnalyze = () => {
    if (inputContent.trim().length > 0) {
      analyzeContent(inputContent.trim());
    }
  };

  const handleKeyDown = (e) => {
    // Ctrl/Cmd + Enter to analyze
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleAnalyze();
    }
  };

  const exampleText = `The process of photosynthesis converts light energy into chemical energy stored in glucose. This process occurs in the chloroplasts of plant cells. The overall equation is: 6CO2 + 6H2O + light energy → C6H12O6 + 6O2.

Photosynthesis has two main stages: the light-dependent reactions and the light-independent reactions (Calvin cycle). The light-dependent reactions occur in the thylakoid membranes and produce ATP and NADPH. The Calvin cycle takes place in the stroma and uses ATP and NADPH to convert CO2 into glucose.

Chlorophyll is the primary pigment that absorbs light, particularly in the blue and red wavelengths, reflecting green light which gives plants their characteristic color.`;

  const loadExample = () => {
    setInputContent(exampleText);
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Analyze Your Study Material
        </h1>
        <p className="text-gray-600">
          Paste your notes, textbook excerpts, or any study content below. 
          Our AI will extract key concepts and create flashcards for you.
        </p>
      </div>

      {/* Input Card */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        {/* Tips */}
        <div className="flex items-start gap-3 mb-4 p-3 bg-blue-50 rounded-lg">
          <Lightbulb className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-blue-700">
            <strong>Tip:</strong> The more detailed your content, the better the analysis. 
            Include definitions, processes, and key facts for best results.
          </p>
        </div>

        {/* Text Area */}
        <div className="relative">
          <textarea
            value={inputContent}
            onChange={(e) => setInputContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Paste or type your study material here..."
            className="textarea-field min-h-[300px] text-gray-800 placeholder-gray-400"
            disabled={isLoading}
          />
          
          {/* Character count */}
          <div className="absolute bottom-3 right-3 text-xs text-gray-400">
            {inputContent.length} characters
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between mt-4">
          <button
            onClick={loadExample}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            disabled={isLoading}
          >
            <FileText className="w-4 h-4" />
            Load example
          </button>

          <button
            onClick={handleAnalyze}
            disabled={inputContent.trim().length === 0 || isLoading}
            className="btn-primary flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Analyze Content
          </button>
        </div>

        {/* Keyboard shortcut hint */}
        <p className="text-xs text-gray-400 text-center mt-4">
          Press <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-600">Ctrl</kbd> + 
          <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-600 ml-1">Enter</kbd> to analyze
        </p>
      </div>
    </div>
  );
}

export default StudyInput;
