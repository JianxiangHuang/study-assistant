/**
 * Study Context with useReducer
 * Manages study materials, keywords, and flashcards state
 * Demonstrates: useReducer hook (rubric requirement)
 */

import { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

// Action types
const ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_CONTENT: 'SET_CONTENT',
  SET_KEYWORDS: 'SET_KEYWORDS',
  SET_FLASHCARDS: 'SET_FLASHCARDS',
  ADD_FLASHCARDS: 'ADD_FLASHCARDS',
  UPDATE_FLASHCARD: 'UPDATE_FLASHCARD',
  SET_CURRENT_VIEW: 'SET_CURRENT_VIEW',
  SET_ANALYSIS_STAGE: 'SET_ANALYSIS_STAGE',
  SET_SAVED_MATERIALS: 'SET_SAVED_MATERIALS',
  SET_CURRENT_MATERIAL_ID: 'SET_CURRENT_MATERIAL_ID',
  RESET_STATE: 'RESET_STATE'
};

// Initial state
const initialState = {
  isLoading: false,
  error: null,
  content: '',
  keywords: [],
  flashcards: [],
  currentView: 'study', // 'study' | 'analyzing' | 'results' | 'flashcards' | 'history'
  analysisStage: 'idle', // 'idle' | 'reading' | 'analyzing' | 'extracting'
  savedMaterials: [],
  currentMaterialId: null
};

// Reducer function
function studyReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_LOADING:
      return { ...state, isLoading: action.payload };
    
    case ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, isLoading: false };
    
    case ACTIONS.CLEAR_ERROR:
      return { ...state, error: null };
    
    case ACTIONS.SET_CONTENT:
      return { ...state, content: action.payload };
    
    case ACTIONS.SET_KEYWORDS:
      return { ...state, keywords: action.payload };
    
    case ACTIONS.SET_FLASHCARDS:
      return { ...state, flashcards: action.payload };
    
    case ACTIONS.ADD_FLASHCARDS:
      return { ...state, flashcards: [...state.flashcards, ...action.payload] };
    
    case ACTIONS.UPDATE_FLASHCARD:
      return {
        ...state,
        flashcards: state.flashcards.map(fc =>
          fc.id === action.payload.id ? { ...fc, ...action.payload } : fc
        )
      };
    
    case ACTIONS.SET_CURRENT_VIEW:
      return { ...state, currentView: action.payload };
    
    case ACTIONS.SET_ANALYSIS_STAGE:
      return { ...state, analysisStage: action.payload };
    
    case ACTIONS.SET_SAVED_MATERIALS:
      return { ...state, savedMaterials: action.payload };
    
    case ACTIONS.SET_CURRENT_MATERIAL_ID:
      return { ...state, currentMaterialId: action.payload };
    
    case ACTIONS.RESET_STATE:
      return { ...initialState };
    
    default:
      return state;
  }
}

// Create context
const StudyContext = createContext(null);

export function StudyProvider({ children }) {
  const [state, dispatch] = useReducer(studyReducer, initialState);
  const { isAuthenticated } = useAuth();

  // Reset state when user logs out
  useEffect(() => {
    if (!isAuthenticated) {
      dispatch({ type: ACTIONS.RESET_STATE });
    }
  }, [isAuthenticated]);

  // Action creators
  const setContent = (content) => {
    dispatch({ type: ACTIONS.SET_CONTENT, payload: content });
  };

  const setCurrentView = (view) => {
    dispatch({ type: ACTIONS.SET_CURRENT_VIEW, payload: view });
  };

  const analyzeContent = async (content, title = '') => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    dispatch({ type: ACTIONS.SET_CONTENT, payload: content });
    dispatch({ type: ACTIONS.SET_CURRENT_VIEW, payload: 'analyzing' });
    
    // Simulate analysis stages for UX
    dispatch({ type: ACTIONS.SET_ANALYSIS_STAGE, payload: 'reading' });
    await new Promise(resolve => setTimeout(resolve, 800));
    
    dispatch({ type: ACTIONS.SET_ANALYSIS_STAGE, payload: 'analyzing' });
    await new Promise(resolve => setTimeout(resolve, 800));
    
    dispatch({ type: ACTIONS.SET_ANALYSIS_STAGE, payload: 'extracting' });

    try {
      // First, create the study material in database
      const materialResponse = await axios.post('/api/study-materials', {
        title: title || `Study Session - ${new Date().toLocaleDateString()}`,
        content
      }, { withCredentials: true });
      
      const materialId = materialResponse.data.id;
      dispatch({ type: ACTIONS.SET_CURRENT_MATERIAL_ID, payload: materialId });

      // Then analyze and update with keywords
      const response = await axios.post('/api/analyze', { 
        content,
        studyMaterialId: materialId
      }, { withCredentials: true });
      
      dispatch({ type: ACTIONS.SET_KEYWORDS, payload: response.data.keywords });
      dispatch({ type: ACTIONS.SET_CURRENT_VIEW, payload: 'results' });
      dispatch({ type: ACTIONS.SET_ANALYSIS_STAGE, payload: 'idle' });
    } catch (error) {
      dispatch({ 
        type: ACTIONS.SET_ERROR, 
        payload: error.response?.data?.message || 'Failed to analyze content' 
      });
      dispatch({ type: ACTIONS.SET_CURRENT_VIEW, payload: 'study' });
      dispatch({ type: ACTIONS.SET_ANALYSIS_STAGE, payload: 'idle' });
    } finally {
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
    }
  };

  const generateFlashcards = async () => {
    if (state.keywords.length === 0) return;

    dispatch({ type: ACTIONS.SET_LOADING, payload: true });

    try {
      const response = await axios.post('/api/flashcards/generate', {
        keywords: state.keywords,
        studyMaterialId: state.currentMaterialId
      }, {
        withCredentials: true
      });
      
      dispatch({ type: ACTIONS.SET_FLASHCARDS, payload: response.data.flashcards });
      dispatch({ type: ACTIONS.SET_CURRENT_VIEW, payload: 'flashcards' });
    } catch (error) {
      dispatch({ 
        type: ACTIONS.SET_ERROR, 
        payload: error.response?.data?.message || 'Failed to generate flashcards' 
      });
    } finally {
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
    }
  };

  // Fetch all saved materials for current user
  const fetchSavedMaterials = async () => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    try {
      const response = await axios.get('/api/study-materials', {
        withCredentials: true
      });
      dispatch({ type: ACTIONS.SET_SAVED_MATERIALS, payload: response.data });
    } catch (error) {
      dispatch({ 
        type: ACTIONS.SET_ERROR, 
        payload: error.response?.data?.message || 'Failed to fetch saved materials' 
      });
    } finally {
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
    }
  };

  // Load a specific saved material
  const loadSavedMaterial = async (materialId) => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    try {
      // Fetch the material
      const materialResponse = await axios.get(`/api/study-materials/${materialId}`, {
        withCredentials: true
      });
      const material = materialResponse.data;
      
      dispatch({ type: ACTIONS.SET_CONTENT, payload: material.content });
      dispatch({ type: ACTIONS.SET_KEYWORDS, payload: material.keywords || [] });
      dispatch({ type: ACTIONS.SET_CURRENT_MATERIAL_ID, payload: material.id });

      // Fetch associated flashcards
      const flashcardsResponse = await axios.get(`/api/flashcards?studyMaterialId=${materialId}`, {
        withCredentials: true
      });
      dispatch({ type: ACTIONS.SET_FLASHCARDS, payload: flashcardsResponse.data });
      
      // Go to results view if we have keywords, otherwise go to flashcards if we have them
      if (material.keywords && material.keywords.length > 0) {
        dispatch({ type: ACTIONS.SET_CURRENT_VIEW, payload: 'results' });
      } else if (flashcardsResponse.data.length > 0) {
        dispatch({ type: ACTIONS.SET_CURRENT_VIEW, payload: 'flashcards' });
      } else {
        dispatch({ type: ACTIONS.SET_CURRENT_VIEW, payload: 'results' });
      }
    } catch (error) {
      dispatch({ 
        type: ACTIONS.SET_ERROR, 
        payload: error.response?.data?.message || 'Failed to load material' 
      });
    } finally {
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
    }
  };

  // Delete a saved material
  const deleteSavedMaterial = async (materialId) => {
    try {
      await axios.delete(`/api/study-materials/${materialId}`, {
        withCredentials: true
      });
      // Refresh the list
      await fetchSavedMaterials();
    } catch (error) {
      dispatch({ 
        type: ACTIONS.SET_ERROR, 
        payload: error.response?.data?.message || 'Failed to delete material' 
      });
    }
  };

  // Show history view
  const showHistory = async () => {
    await fetchSavedMaterials();
    dispatch({ type: ACTIONS.SET_CURRENT_VIEW, payload: 'history' });
  };

  const updateFlashcardMastered = async (id, mastered) => {
    try {
      await axios.patch(`/api/flashcards/${id}/mastered`, { mastered }, {
        withCredentials: true
      });
      dispatch({ type: ACTIONS.UPDATE_FLASHCARD, payload: { id, mastered } });
    } catch (error) {
      console.error('Failed to update flashcard:', error);
    }
  };

  const clearError = () => {
    dispatch({ type: ACTIONS.CLEAR_ERROR });
  };

  const resetToStudy = () => {
    dispatch({ type: ACTIONS.SET_CURRENT_VIEW, payload: 'study' });
    dispatch({ type: ACTIONS.SET_KEYWORDS, payload: [] });
    dispatch({ type: ACTIONS.SET_CONTENT, payload: '' });
    dispatch({ type: ACTIONS.SET_CURRENT_MATERIAL_ID, payload: null });
    dispatch({ type: ACTIONS.SET_FLASHCARDS, payload: [] });
  };

  const value = {
    ...state,
    setContent,
    setCurrentView,
    analyzeContent,
    generateFlashcards,
    updateFlashcardMastered,
    clearError,
    resetToStudy,
    fetchSavedMaterials,
    loadSavedMaterial,
    deleteSavedMaterial,
    showHistory
  };

  return (
    <StudyContext.Provider value={value}>
      {children}
    </StudyContext.Provider>
  );
}

export function useStudy() {
  const context = useContext(StudyContext);
  if (!context) {
    throw new Error('useStudy must be used within a StudyProvider');
  }
  return context;
}

export default StudyContext;
