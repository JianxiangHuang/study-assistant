/**
 * Keyword Card Component
 * Expandable card showing keyword and its explanation
 */

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

function KeywordCard({ keyword, detail }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      onClick={() => setIsExpanded(!isExpanded)}
      className="bg-gray-50 border border-gray-200 rounded-lg cursor-pointer 
                 transition-all duration-200 hover:shadow-md hover:border-gray-300"
    >
      <div className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">{keyword}</h3>
          <div className="p-1 bg-gray-200 rounded">
            {isExpanded ? (
              <ChevronUp className="w-4 h-4 text-gray-600" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-600" />
            )}
          </div>
        </div>

        {/* Expandable content with CSS animation */}
        <div
          className={`overflow-hidden transition-all duration-300 ease-out ${
            isExpanded ? 'max-h-96 mt-3 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <p className="text-sm text-gray-600 leading-relaxed">
            {detail}
          </p>
        </div>
      </div>
    </div>
  );
}

export default KeywordCard;
