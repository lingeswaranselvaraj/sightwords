import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import './App.css';

function App() {
  // State management
  const [sightWords, setSightWords] = useState([]);
  const [currentWord, setCurrentWord] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [wordsLearned, setWordsLearned] = useState(0);
  const [showAnimation, setShowAnimation] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);
  const [backgroundColorIndex, setBackgroundColorIndex] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);

  // Default sight words for demo - Complete list from CSV
  const defaultWords = [
    { word: 'the', category: 'basic' },
    { word: 'and', category: 'basic' },
    { word: 'a', category: 'basic' },
    { word: 'to', category: 'basic' },
    { word: 'said', category: 'action' },
    { word: 'you', category: 'pronouns' },
    { word: 'he', category: 'pronouns' },
    { word: 'it', category: 'pronouns' },
    { word: 'in', category: 'prepositions' },
    { word: 'was', category: 'verbs' },
    { word: 'his', category: 'possessive' },
    { word: 'that', category: 'basic' },
    { word: 'she', category: 'pronouns' },
    { word: 'for', category: 'prepositions' },
    { word: 'on', category: 'prepositions' },
    { word: 'they', category: 'pronouns' },
    { word: 'but', category: 'conjunctions' },
    { word: 'had', category: 'verbs' },
    { word: 'at', category: 'prepositions' },
    { word: 'him', category: 'pronouns' },
    { word: 'with', category: 'prepositions' },
    { word: 'up', category: 'prepositions' },
    { word: 'all', category: 'quantifiers' },
    { word: 'look', category: 'action' },
    { word: 'is', category: 'verbs' },
    { word: 'her', category: 'pronouns' },
    { word: 'there', category: 'adverbs' },
    { word: 'some', category: 'quantifiers' },
    { word: 'out', category: 'prepositions' },
    { word: 'as', category: 'conjunctions' },
    { word: 'be', category: 'verbs' },
    { word: 'have', category: 'verbs' },
    { word: 'go', category: 'action' },
    { word: 'we', category: 'pronouns' },
    { word: 'am', category: 'verbs' },
    { word: 'then', category: 'adverbs' },
    { word: 'little', category: 'adjectives' },
    { word: 'down', category: 'prepositions' },
    { word: 'do', category: 'action' },
    { word: 'can', category: 'modals' },
    { word: 'could', category: 'modals' },
    { word: 'when', category: 'question' },
    { word: 'did', category: 'verbs' },
    { word: 'what', category: 'question' },
    { word: 'so', category: 'conjunctions' },
    { word: 'see', category: 'action' },
    { word: 'not', category: 'negation' },
    { word: 'were', category: 'verbs' },
    { word: 'get', category: 'action' },
    { word: 'them', category: 'pronouns' },
    { word: 'like', category: 'action' },
    { word: 'one', category: 'numbers' },
    { word: 'this', category: 'demonstrative' },
    { word: 'my', category: 'possessive' },
    { word: 'would', category: 'modals' },
    { word: 'me', category: 'pronouns' },
    { word: 'will', category: 'modals' },
    { word: 'yes', category: 'affirmative' },
    { word: 'big', category: 'adjectives' },
    { word: 'went', category: 'verbs' },
    { word: 'are', category: 'verbs' },
    { word: 'come', category: 'action' },
    { word: 'if', category: 'conditionals' },
    { word: 'now', category: 'adverbs' },
    { word: 'long', category: 'adjectives' },
    { word: 'no', category: 'negation' },
    { word: 'came', category: 'verbs' },
    { word: 'ask', category: 'action' },
    { word: 'very', category: 'adverbs' },
    { word: 'an', category: 'articles' },
    { word: 'over', category: 'prepositions' },
    { word: 'your', category: 'possessive' },
    { word: 'its', category: 'possessive' },
    { word: 'ride', category: 'action' },
    { word: 'into', category: 'prepositions' },
    { word: 'just', category: 'adverbs' },
    { word: 'blue', category: 'colors' },
    { word: 'red', category: 'colors' },
    { word: 'from', category: 'prepositions' },
    { word: 'good', category: 'adjectives' },
    { word: 'any', category: 'quantifiers' },
    { word: 'about', category: 'prepositions' },
    { word: 'around', category: 'prepositions' },
    { word: 'want', category: 'action' },
    { word: "don't", category: 'contractions' },
    { word: 'how', category: 'question' },
    { word: 'know', category: 'action' },
    { word: 'right', category: 'directions' },
    { word: 'put', category: 'action' },
    { word: 'too', category: 'adverbs' },
    { word: 'got', category: 'verbs' },
    { word: 'take', category: 'action' },
    { word: 'where', category: 'question' },
    { word: 'every', category: 'quantifiers' },
    { word: 'pretty', category: 'adjectives' },
    { word: 'jump', category: 'action' },
    { word: 'green', category: 'colors' },
    { word: 'four', category: 'numbers' },
    { word: 'away', category: 'adverbs' },
    { word: 'old', category: 'adjectives' },
    { word: 'by', category: 'prepositions' },
    { word: 'their', category: 'possessive' },
    { word: 'here', category: 'adverbs' },
    { word: 'saw', category: 'verbs' },
    { word: 'call', category: 'action' },
    { word: 'after', category: 'prepositions' },
    { word: 'well', category: 'adverbs' },
    { word: 'think', category: 'action' },
    { word: 'ran', category: 'verbs' },
    { word: 'let', category: 'action' },
    { word: 'help', category: 'action' },
    { word: 'make', category: 'action' },
    { word: 'going', category: 'verbs' },
    { word: 'sleep', category: 'action' },
    { word: 'brown', category: 'colors' },
    { word: 'yellow', category: 'colors' },
    { word: 'five', category: 'numbers' },
    { word: 'six', category: 'numbers' },
    { word: 'walk', category: 'action' },
    { word: 'two', category: 'numbers' },
    { word: 'or', category: 'conjunctions' },
    { word: 'before', category: 'prepositions' },
    { word: 'eat', category: 'action' },
    { word: 'again', category: 'adverbs' },
    { word: 'play', category: 'action' },
    { word: 'who', category: 'question' },
    { word: 'been', category: 'verbs' },
    { word: 'may', category: 'modals' },
    { word: 'stop', category: 'action' },
    { word: 'off', category: 'prepositions' },
    { word: 'never', category: 'adverbs' },
    { word: 'seven', category: 'numbers' },
    { word: 'eight', category: 'numbers' },
    { word: 'cold', category: 'adjectives' },
    { word: 'today', category: 'time' },
    { word: 'fly', category: 'action' },
    { word: 'myself', category: 'pronouns' },
    { word: 'round', category: 'adjectives' },
    { word: 'tell', category: 'action' },
    { word: 'much', category: 'quantifiers' },
    { word: 'keep', category: 'action' },
    { word: 'give', category: 'action' },
    { word: 'work', category: 'action' },
    { word: 'first', category: 'ordinals' },
    { word: 'try', category: 'action' },
    { word: 'new', category: 'adjectives' },
    { word: 'must', category: 'modals' },
    { word: 'start', category: 'action' },
    { word: 'black', category: 'colors' },
    { word: 'white', category: 'colors' },
    { word: 'ten', category: 'numbers' },
    { word: 'does', category: 'verbs' },
    { word: 'bring', category: 'action' },
    { word: 'goes', category: 'verbs' },
    { word: 'write', category: 'action' },
    { word: 'always', category: 'adverbs' },
    { word: 'drink', category: 'action' },
    { word: 'once', category: 'adverbs' },
    { word: 'soon', category: 'adverbs' },
    { word: 'made', category: 'verbs' },
    { word: 'run', category: 'action' },
    { word: 'gave', category: 'verbs' },
    { word: 'open', category: 'action' },
    { word: 'has', category: 'verbs' },
    { word: 'find', category: 'action' },
    { word: 'only', category: 'adverbs' },
    { word: 'us', category: 'pronouns' },
    { word: 'three', category: 'numbers' },
    { word: 'our', category: 'possessive' },
    { word: 'better', category: 'adjectives' },
    { word: 'hold', category: 'action' },
    { word: 'buy', category: 'action' },
    { word: 'funny', category: 'adjectives' },
    { word: 'warm', category: 'adjectives' },
    { word: 'ate', category: 'verbs' },
    { word: 'full', category: 'adjectives' },
    { word: 'those', category: 'demonstrative' },
    { word: 'done', category: 'verbs' },
    { word: 'use', category: 'action' },
    { word: 'fast', category: 'adjectives' },
    { word: 'say', category: 'action' },
    { word: 'light', category: 'adjectives' },
    { word: 'pick', category: 'action' },
    { word: 'hurt', category: 'action' },
    { word: 'pull', category: 'action' },
    { word: 'cut', category: 'action' },
    { word: 'kind', category: 'adjectives' },
    { word: 'both', category: 'quantifiers' },
    { word: 'sit', category: 'action' },
    { word: 'which', category: 'question' },
    { word: 'fall', category: 'action' },
    { word: 'carry', category: 'action' },
    { word: 'small', category: 'adjectives' },
    { word: 'under', category: 'prepositions' },
    { word: 'read', category: 'action' },
    { word: 'why', category: 'question' },
    { word: 'own', category: 'possessive' },
    { word: 'found', category: 'verbs' },
    { word: 'wash', category: 'action' },
    { word: 'show', category: 'action' },
    { word: 'hot', category: 'adjectives' },
    { word: 'because', category: 'conjunctions' },
    { word: 'far', category: 'adjectives' },
    { word: 'live', category: 'action' },
    { word: 'draw', category: 'action' },
    { word: 'clean', category: 'action' },
    { word: 'grow', category: 'action' },
    { word: 'best', category: 'superlatives' },
    { word: 'upon', category: 'prepositions' },
    { word: 'these', category: 'demonstrative' },
    { word: 'sing', category: 'action' },
    { word: 'together', category: 'adverbs' },
    { word: 'please', category: 'polite' },
    { word: 'thank', category: 'polite' },
    { word: 'wish', category: 'action' },
    { word: 'many', category: 'quantifiers' }
  ];

  // Background colors array for "Next Word" button
  const backgroundColors = [
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
  ];

  // Initialize with default words
  useEffect(() => {
    setSightWords(defaultWords);
    const uniqueCategories = [...new Set(defaultWords.map(item => item.category))];
    setCategories(uniqueCategories);
    setCurrentWord(defaultWords[0].word);
  }, []);

  // Text-to-speech functionality
  const speakWord = (word) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.rate = 0.7;
      utterance.pitch = 1.2;
      utterance.volume = 1;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Get filtered words based on selected category
  const getFilteredWords = () => {
    if (selectedCategory === 'all') {
      return sightWords;
    }
    
    // Debug: Show all available categories
    const availableCategories = [...new Set(sightWords.map(item => item.category))];
    console.log('Available categories:', availableCategories);
    console.log('Looking for category:', selectedCategory);
    
    const filtered = sightWords.filter(item => item.category === selectedCategory);
    console.log('Words found for category "' + selectedCategory + '":', filtered.map(w => w.word));
    
    return filtered;
  };

  // Select random word
  const selectRandomWord = () => {
    const filteredWords = getFilteredWords();
    console.log('Selected category:', selectedCategory);
    console.log('Filtered words:', filteredWords);
    console.log('Total words available:', sightWords.length);
    
    if (filteredWords.length > 0) {
      const randomIndex = Math.floor(Math.random() * filteredWords.length);
      const newWord = filteredWords[randomIndex].word;
      setCurrentWord(newWord);
      setShowAnimation(true);
      setTimeout(() => setShowAnimation(false), 500);
      
      if (autoPlay) {
        setTimeout(() => speakWord(newWord), 200);
      }
    } else {
      console.log('No words found for category:', selectedCategory);
      // Fallback to showing a message or the first word
      if (sightWords.length > 0) {
        setCurrentWord(sightWords[0].word);
      }
    }
  };

  // Select next word in sequence
  const selectNextWord = () => {
    // Use filtered words based on selected category
    const filteredWords = getFilteredWords();
    if (filteredWords.length > 0) {
      const currentIndex = filteredWords.findIndex(item => item.word === currentWord);
      let nextIndex;
      
      if (currentIndex === -1) {
        // Current word not found in filtered list, start from beginning
        nextIndex = 0;
      } else {
        // Move to next word in the filtered list
        nextIndex = (currentIndex + 1) % filteredWords.length;
      }
      
      const newWord = filteredWords[nextIndex].word;
      setCurrentWord(newWord);
      setShowAnimation(true);
      setTimeout(() => setShowAnimation(false), 500);
      
      // Change background color
      setBackgroundColorIndex(prev => (prev + 1) % backgroundColors.length);
    }
  };

  // Handle category selection change
  const handleCategoryChange = (newCategory) => {
    setSelectedCategory(newCategory);
    
    // Get words for the new category
    let filteredWords;
    if (newCategory === 'all') {
      filteredWords = sightWords;
    } else {
      filteredWords = sightWords.filter(item => item.category === newCategory);
    }
    
    // Update current word to first word from new category
    if (filteredWords.length > 0) {
      const newWord = filteredWords[0].word;
      setCurrentWord(newWord);
      setShowAnimation(true);
      setTimeout(() => setShowAnimation(false), 500);
      console.log('Category changed to:', newCategory, 'First word:', newWord);
    }
  };

  // Mark word as learned
  const markWordLearned = () => {
    setWordsLearned(prev => prev + 1);
    setShowAnimation(true);
    setShowCelebration(true);
    
    // Hide celebration after 3 seconds
    setTimeout(() => {
      setShowCelebration(false);
    }, 3000);
    
    setTimeout(() => {
      setShowAnimation(false);
      selectRandomWord();
    }, 1000);
  };

  // Parse Excel file
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          
          // Parse the data - assuming first column is words, second is categories
          const parsedWords = [];
          const parsedCategories = new Set();
          
          for (let i = 1; i < jsonData.length; i++) { // Skip header row
            const row = jsonData[i];
            if (row[0] && row[0].toString().trim()) { // Check if word exists and is not empty
              const word = row[0].toString().toLowerCase().trim();
              const category = row[1] ? row[1].toString().toLowerCase().trim() : 'general';
              
              // Only add if word is valid
              if (word.length > 0) {
                parsedWords.push({ word, category });
                parsedCategories.add(category);
              }
            }
          }
          
          console.log('Parsed words:', parsedWords.length);
          console.log('Parsed categories:', [...parsedCategories]);
          
          if (parsedWords.length > 0) {
            setSightWords(parsedWords);
            setCategories([...parsedCategories]);
            setCurrentWord(parsedWords[0].word);
            setSelectedCategory('all');
            console.log('Excel file loaded successfully');
          } else {
            alert('No valid words found in the Excel file.');
          }
        } catch (error) {
          alert('Error reading Excel file. Please make sure it has words in the first column and categories in the second column.');
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  return (
    <div className="app" style={{ background: backgroundColors[backgroundColorIndex] }}>
      <header className="app-header">
        <h1 className="app-title">🌟 Sight Words Adventure 🌟</h1>
        <div className="progress">
          <span className="progress-text">Words Learned: {wordsLearned}</span>
        </div>
      </header>

      <main className="main-content">
        {/* Category Selector */}
        {categories.length > 1 && (
          <div className="category-section">
            <label htmlFor="category-select">Choose Category:</label>
            <select
              id="category-select"
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="category-select"
            >
              <option value="all">All Words ({sightWords.length})</option>
              {categories.map(category => {
                const wordsInCategory = sightWords.filter(word => word.category === category).length;
                return (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)} ({wordsInCategory})
                  </option>
                );
              })}
            </select>
          </div>
        )}

        {/* Word Display */}
        <div className={`word-display ${showAnimation ? 'animate' : ''}`}>
          <div className="word-card">
            <span className="current-word">{currentWord}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="controls">
          <button
            onClick={() => speakWord(currentWord)}
            className="control-button speak-button"
          >
            🔊 Say It!
          </button>
          
          <button
            onClick={selectRandomWord}
            className="control-button random-button"
          >
            🎲 Random Word
          </button>
          
          <button
            onClick={selectNextWord}
            className="control-button next-button"
          >
            ➡️ Next Word
          </button>
          
          <button
            onClick={markWordLearned}
            className="control-button learned-button"
          >
            ⭐ I Know This!
          </button>
        </div>

        {/* Auto-play Toggle */}
        <div className="settings">
          <label className="auto-play-toggle">
            <input
              type="checkbox"
              checked={autoPlay}
              onChange={(e) => setAutoPlay(e.target.checked)}
            />
            🎵 Auto-pronounce new words
          </label>
        </div>
      </main>

      {/* Celebration Animation - Only Falling Ribbons */}
      {showCelebration && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none',
          zIndex: 1000
        }}>
          {/* Falling Ribbons */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            pointerEvents: 'none'
          }}>
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  top: '-20px',
                  left: `${Math.random() * 100}%`,
                  width: '10px',
                  height: '60px',
                  background: `linear-gradient(45deg, 
                    ${['#ff6b9d', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd'][Math.floor(Math.random() * 8)]}, 
                    ${['#ff6b9d', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd'][Math.floor(Math.random() * 8)]})`,
                  borderRadius: '5px',
                  transform: `rotate(${Math.random() * 360}deg)`,
                  animation: `ribbonFall ${2 + Math.random() * 3}s linear infinite`,
                  animationDelay: `${Math.random() * 2}s`,
                  boxShadow: '0 4px 8px rgba(0,0,0,0.3)'
                }}
              />
            ))}
          </div>
          
          {/* Message box removed - only ribbons now */}
          <div style={{display: 'none'}}>
            <h2 style={{ 
              color: '#ff6b9d', 
              fontSize: '3rem', 
              margin: '0 0 10px 0',
              fontFamily: 'Fredoka One, cursive',
              textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
              animation: 'titleBounce 1s ease-in-out infinite alternate'
            }}>
              🌟 Celebration! 🌟
            </h2>
            <p style={{ 
              color: '#4a5568', 
              fontSize: '1.5rem', 
              margin: '0 0 20px 0',
              fontFamily: 'Comic Neue, cursive',
              fontWeight: 'bold'
            }}>
              You learned a new word!
            </p>
            <div style={{ 
              fontSize: '2rem', 
              marginTop: '20px',
              animation: 'sparkle 1.5s ease-in-out infinite'
            }}>
              🎉 🎊 ⭐ 💫 ✨ � �🎆 🎇
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;