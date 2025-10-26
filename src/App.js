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

  // Default sight words for demo
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
    { word: 'him', category: 'pronouns' }
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
    return sightWords.filter(item => item.category === selectedCategory);
  };

  // Select random word
  const selectRandomWord = () => {
    const filteredWords = getFilteredWords();
    if (filteredWords.length > 0) {
      const randomIndex = Math.floor(Math.random() * filteredWords.length);
      const newWord = filteredWords[randomIndex].word;
      setCurrentWord(newWord);
      setShowAnimation(true);
      setTimeout(() => setShowAnimation(false), 500);
      
      if (autoPlay) {
        setTimeout(() => speakWord(newWord), 200);
      }
    }
  };

  // Select next word in sequence
  const selectNextWord = () => {
    const filteredWords = getFilteredWords();
    if (filteredWords.length > 0) {
      const currentIndex = filteredWords.findIndex(item => item.word === currentWord);
      const nextIndex = (currentIndex + 1) % filteredWords.length;
      const newWord = filteredWords[nextIndex].word;
      setCurrentWord(newWord);
      setShowAnimation(true);
      setTimeout(() => setShowAnimation(false), 500);
      
      // Change background color
      setBackgroundColorIndex(prev => (prev + 1) % backgroundColors.length);
    }
  };

  // Mark word as learned
  const markWordLearned = () => {
    setWordsLearned(prev => prev + 1);
    setShowAnimation(true);
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
            if (row[0]) { // Check if word exists
              const word = row[0].toString().toLowerCase().trim();
              const category = row[1] ? row[1].toString().toLowerCase().trim() : 'general';
              parsedWords.push({ word, category });
              parsedCategories.add(category);
            }
          }
          
          if (parsedWords.length > 0) {
            setSightWords(parsedWords);
            setCategories([...parsedCategories]);
            setCurrentWord(parsedWords[0].word);
            setSelectedCategory('all');
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
        {/* File Upload Section */}
        <div className="file-upload-section">
          <label htmlFor="excel-upload" className="upload-button">
            📁 Upload Excel File
            <input
              id="excel-upload"
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />
          </label>
        </div>

        {/* Category Selector */}
        {categories.length > 1 && (
          <div className="category-section">
            <label htmlFor="category-select">Choose Category:</label>
            <select
              id="category-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="category-select"
            >
              <option value="all">All Words</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
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

        {/* Instructions */}
        <div className="instructions">
          <h3>How to Use:</h3>
          <ul>
            <li>📱 Click "Say It!" to hear the word</li>
            <li>🎲 Click "Random Word" for a surprise word</li>
            <li>➡️ Click "Next Word" to go through words in order</li>
            <li>⭐ Click "I Know This!" when you've learned a word</li>
            <li>📁 Upload your own Excel file with sight words</li>
          </ul>
        </div>
      </main>
    </div>
  );
}

export default App;