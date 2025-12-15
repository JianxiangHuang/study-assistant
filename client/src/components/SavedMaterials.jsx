/**
 * SavedMaterials Component
 * Displays list of saved study materials for the user
 */

import { useEffect } from 'react';
import { ArrowLeft, BookOpen, Trash2, Calendar, FileText, Sparkles } from 'lucide-react';
import { useStudy } from '../context/StudyContext';
import LoadingSpinner from './LoadingSpinner';

function SavedMaterials() {
  const { 
    savedMaterials, 
    isLoading, 
    loadSavedMaterial, 
    deleteSavedMaterial,
    resetToStudy 
  } = useStudy();

  const handleLoad = (materialId) => {
    loadSavedMaterial(materialId);
  };

  const handleDelete = async (e, materialId) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this study material and its flashcards?')) {
      await deleteSavedMaterial(materialId);
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateContent = (content, maxLength = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={resetToStudy}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          New Study Session
        </button>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          My Study History
        </h1>
        <p className="text-gray-600">
          Access your previously analyzed materials and flashcards
        </p>
      </div>

      {/* Materials List */}
      {savedMaterials.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No saved materials yet</h3>
          <p className="text-gray-500 mb-4">
            Start by analyzing some study content. Your materials will appear here.
          </p>
          <button onClick={resetToStudy} className="btn-primary">
            Start Studying
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {savedMaterials.map((material) => (
            <div
              key={material.id}
              onClick={() => handleLoad(material.id)}
              className="bg-white rounded-xl shadow-md p-5 cursor-pointer 
                         transition-all duration-200 hover:shadow-lg hover:-translate-y-1
                         border border-gray-100 hover:border-primary-200"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  {/* Title */}
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-primary-500 flex-shrink-0" />
                    {material.title || 'Untitled Study Session'}
                  </h3>
                  
                  {/* Content preview */}
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {truncateContent(material.content)}
                  </p>
                  
                  {/* Meta info */}
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(material.createdAt)}
                    </span>
                    {material.keywords && material.keywords.length > 0 && (
                      <span className="flex items-center gap-1 text-primary-600">
                        <Sparkles className="w-3 h-3" />
                        {material.keywords.length} keywords
                      </span>
                    )}
                  </div>
                </div>

                {/* Delete button */}
                <button
                  onClick={(e) => handleDelete(e, material.id)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 
                             rounded-lg transition-colors flex-shrink-0"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SavedMaterials;
