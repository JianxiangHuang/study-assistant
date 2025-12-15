/**
 * Keyword Highlight Component
 * Highlights keywords in text and shows tooltips on click
 * Demonstrates: Interactive UI with clickable keywords and tooltips
 */

import { useState, useRef, useEffect } from 'react';
import { Lightbulb, X } from 'lucide-react';

function KeywordHighlight({ content, keywords }) {
  const [activeKeyword, setActiveKeyword] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const containerRef = useRef(null);

  // Close tooltip when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (activeKeyword && !e.target.closest('.keyword-tooltip') && 
          !e.target.closest('.keyword-highlight')) {
        setActiveKeyword(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [activeKeyword]);

  const handleKeywordClick = (keyword, event) => {
    event.stopPropagation();
    
    if (activeKeyword?.keyword === keyword.keyword) {
      setActiveKeyword(null);
      return;
    }

    // Calculate tooltip position
    const rect = event.target.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();
    
    setTooltipPosition({
      top: rect.bottom - containerRect.top + 8,
      left: Math.min(
        rect.left - containerRect.left,
        containerRect.width - 320 // Keep tooltip within container
      )
    });
    
    setActiveKeyword(keyword);
  };

  // Escape special regex characters
  const escapeRegExp = (str) => {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  };

  // Render content with highlighted keywords
  const renderHighlightedContent = () => {
    if (keywords.length === 0) {
      return <span>{content}</span>;
    }

    // Sort keywords by length (longest first) to avoid partial matches
    const sortedKeywords = [...keywords].sort((a, b) => 
      b.keyword.length - a.keyword.length
    );

    // Create regex pattern for all keywords
    const pattern = sortedKeywords
      .map(k => `(${escapeRegExp(k.keyword)})`)
      .join('|');
    const regex = new RegExp(pattern, 'gi');

    // Split content by keywords
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(content)) !== null) {
      // Add text before match
      if (match.index > lastIndex) {
        parts.push({
          type: 'text',
          content: content.slice(lastIndex, match.index)
        });
      }

      // Find the matching keyword data
      const matchedKeyword = keywords.find(
        k => k.keyword.toLowerCase() === match[0].toLowerCase()
      );

      parts.push({
        type: 'keyword',
        content: match[0],
        data: matchedKeyword
      });

      lastIndex = regex.lastIndex;
    }

    // Add remaining text
    if (lastIndex < content.length) {
      parts.push({
        type: 'text',
        content: content.slice(lastIndex)
      });
    }

    return parts.map((part, index) => {
      if (part.type === 'text') {
        return <span key={index}>{part.content}</span>;
      }

      const isActive = activeKeyword?.keyword === part.data?.keyword;

      return (
        <button
          key={index}
          onClick={(e) => handleKeywordClick(part.data, e)}
          className={`keyword-highlight inline font-semibold underline decoration-2 
                     underline-offset-2 cursor-pointer transition-all rounded px-0.5 -mx-0.5
                     ${isActive 
                       ? 'bg-primary-200 text-primary-800 decoration-primary-400' 
                       : 'text-primary-600 decoration-primary-300 hover:bg-primary-50 hover:decoration-primary-400'
                     }`}
        >
          {part.content}
        </button>
      );
    });
  };

  return (
    <div ref={containerRef} className="relative leading-relaxed whitespace-pre-wrap">
      {renderHighlightedContent()}

      {/* Tooltip */}
      {activeKeyword && (
        <div
          className="keyword-tooltip absolute z-50 w-80 bg-white rounded-lg shadow-xl 
                     border border-gray-200 animate-fade-in"
          style={{
            top: tooltipPosition.top,
            left: Math.max(0, tooltipPosition.left)
          }}
        >
          {/* Arrow */}
          <div className="absolute -top-2 left-8 w-4 h-4 bg-white border-l border-t 
                         border-gray-200 transform rotate-45" />
          
          <div className="relative p-4">
            {/* Close button */}
            <button
              onClick={() => setActiveKeyword(null)}
              className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600 
                        rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-2 mb-3 pr-6">
              <div className="p-1.5 bg-primary-100 rounded">
                <Lightbulb className="w-4 h-4 text-primary-600" />
              </div>
              <h4 className="font-bold text-gray-900">
                {activeKeyword.keyword}
              </h4>
            </div>

            {/* Content */}
            <p className="text-sm text-gray-600 leading-relaxed">
              {activeKeyword.detail}
            </p>

            {/* Badge */}
            <div className="mt-3">
              <span className="inline-block px-2 py-1 bg-primary-50 text-primary-700 
                             text-xs font-medium rounded">
                Key Concept
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default KeywordHighlight;
