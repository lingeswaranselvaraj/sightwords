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
  const [showScorePopup, setShowScorePopup] = useState(false);

  // Category explanations for kids
  const categoryExplanations = {
    'all': {
      title: 'All Words',
      explanation: 'All the sight words together!',
      examples: []
    },
    'action': {
      title: 'Action Words',
      explanation: 'Words that tell us what someone or something is doing.',
      examples: ['I can <strong>run</strong> very fast.', 'Please <strong>help</strong> me with this.']
    },
    'basic': {
      title: 'Basic Words',
      explanation: 'Simple words we use all the time in sentences.',
      examples: ['<strong>The</strong> cat is <strong>on</strong> the mat.', 'I <strong>have</strong> <strong>a</strong> red ball.']
    },
    'pronouns': {
      title: 'People Words',
      explanation: 'Words we use instead of names for people.',
      examples: ['<strong>She</strong> likes to play games.', '<strong>They</strong> are my best friends.']
    },
    'verbs': {
      title: 'Doing Words',
      explanation: 'Words that tell us what is happening.',
      examples: ['The bird <strong>was</strong> singing.', 'We <strong>are</strong> going to school.']
    },
    'prepositions': {
      title: 'Place Words',
      explanation: 'Words that tell us where things are.',
      examples: ['The book is <strong>on</strong> the table.', 'Walk <strong>to</strong> the store <strong>with</strong> me.']
    },
    'adjectives': {
      title: 'Describing Words',
      explanation: 'Words that tell us what something looks like.',
      examples: ['I saw a <strong>big</strong> elephant.', 'She has a <strong>pretty</strong> dress.']
    },
    'adverbs': {
      title: 'How Words',
      explanation: 'Words that tell us how something happens.',
      examples: ['She <strong>always</strong> brushes her teeth.', 'The car moved <strong>very</strong> slowly.']
    },
    'colors': {
      title: 'Color Words',
      explanation: 'Words that tell us what color something is.',
      examples: ['I like the <strong>blue</strong> sky.', 'The <strong>red</strong> apple tastes sweet.']
    },
    'numbers': {
      title: 'Number Words',
      explanation: 'Words that tell us how many of something.',
      examples: ['I have <strong>two</strong> cats at home.', 'Count from <strong>one</strong> to <strong>ten</strong>.']
    },
    'conjunctions': {
      title: 'Joining Words',
      explanation: 'Words that connect other words together.',
      examples: ['I like cats <strong>and</strong> dogs.', 'Eat your dinner, <strong>but</strong> save room for dessert.']
    },
    'question': {
      title: 'Question Words',
      explanation: 'Words we use to ask questions.',
      examples: ['<strong>What</strong> is your favorite color?', '<strong>Where</strong> do you live?']
    },
    'modals': {
      title: 'Helper Words',
      explanation: 'Words that help other words in sentences.',
      examples: ['I <strong>can</strong> ride a bicycle.', 'You <strong>must</strong> wash your hands.']
    },
    'quantifiers': {
      title: 'Amount Words',
      explanation: 'Words that tell us how much or how many.',
      examples: ['<strong>All</strong> the children are playing.', 'I want <strong>some</strong> ice cream.']
    },
    'possessive': {
      title: 'Belonging Words',
      explanation: 'Words that show something belongs to someone.',
      examples: ['This is <strong>my</strong> favorite book.', 'The dog wagged <strong>its</strong> tail.']
    },
    'negation': {
      title: 'No Words',
      explanation: 'Words that mean the opposite or say no.',
      examples: ['I do <strong>not</strong> like broccoli.', '<strong>No</strong>, I cannot come today.']
    },
    'articles': {
      title: 'The Words',
      explanation: 'Little words that come before other words.',
      examples: ['I saw <strong>an</strong> elephant at <strong>the</strong> zoo.', 'Give me <strong>the</strong> red crayon.']
    },
    'contractions': {
      title: 'Short Words',
      explanation: 'Two words squeezed together into one.',
      examples: ['I <strong>don\'t</strong> want to go yet.', 'We <strong>can\'t</strong> find the keys.']
    },
    'demonstrative': {
      title: 'Pointing Words',
      explanation: 'Words that point to specific things.',
      examples: ['<strong>This</strong> book is very interesting.', '<strong>Those</strong> cookies look delicious.']
    },
    'affirmative': {
      title: 'Yes Words',
      explanation: 'Words that mean yes or agree.',
      examples: ['<strong>Yes</strong>, I would like some cake.', 'I agree with your idea.']
    },
    'directions': {
      title: 'Direction Words',
      explanation: 'Words that tell us which way to go.',
      examples: ['Turn <strong>right</strong> at the corner.', 'The answer is correct.']
    },
    'time': {
      title: 'Time Words',
      explanation: 'Words that tell us when something happens.',
      examples: ['<strong>Today</strong> is a beautiful day.', 'Yesterday we went to the park.']
    },
    'ordinals': {
      title: 'Order Words',
      explanation: 'Words that tell us what comes first, second, etc.',
      examples: ['I finished <strong>first</strong> in the race.', 'This is my <strong>second</strong> try.']
    },
    'superlatives': {
      title: 'Best Words',
      explanation: 'Words that say something is the most or best.',
      examples: ['This is the <strong>best</strong> pizza ever.', 'She is the fastest runner.']
    },
    'conditionals': {
      title: 'If Words',
      explanation: 'Words that talk about what might happen.',
      examples: ['<strong>If</strong> it rains, we stay inside.', 'What <strong>if</strong> we go to the park?']
    },
    'polite': {
      title: 'Nice Words',
      explanation: 'Words we use to be kind and polite.',
      examples: ['<strong>Please</strong> pass the salt.', '<strong>Thank</strong> you for helping me.']
    }
  };

  // Function to get the category of a specific word
  const getWordCategory = (word) => {
    const foundWord = sightWords.find(w => w.word === word);
    return foundWord ? foundWord.category : 'basic';
  };

  // Function to generate dynamic example with current word
  const generateDynamicExample = (category, word) => {
    if (!word) return null;
    
    // More sophisticated sentence generation based on specific words
    const generateSentence = (category, word) => {
      switch (category) {
        case 'action':
          // Specific sentences for action words
          if (word === 'run') {
            return `I love to <strong>${word}</strong> in the park.`;
          } else if (word === 'jump') {
            return `Can you <strong>${word}</strong> over the rope?`;
          } else if (word === 'help') {
            return `Please <strong>${word}</strong> me with this box.`;
          } else if (word === 'look') {
            return `<strong>${word.charAt(0).toUpperCase() + word.slice(1)}</strong> at the beautiful rainbow!`;
          } else if (word === 'see') {
            return `I can <strong>${word}</strong> the mountains.`;
          } else if (word === 'go') {
            return `Let's <strong>${word}</strong> to the playground.`;
          } else if (word === 'come') {
            return `Please <strong>${word}</strong> here quickly.`;
          } else if (word === 'get') {
            return `Can you <strong>${word}</strong> the book for me?`;
          } else if (word === 'take') {
            return `<strong>${word.charAt(0).toUpperCase() + word.slice(1)}</strong> your time to think.`;
          } else if (word === 'make') {
            return `Let's <strong>${word}</strong> a sandcastle.`;
          } else if (word === 'play') {
            return `I want to <strong>${word}</strong> outside.`;
          } else if (word === 'work') {
            return `Dad has to <strong>${word}</strong> today.`;
          } else if (word === 'walk') {
            return `We <strong>${word}</strong> to school every day.`;
          } else if (word === 'fly') {
            return `Birds can <strong>${word}</strong> high in the sky.`;
          } else if (word === 'eat') {
            return `Time to <strong>${word}</strong> our lunch.`;
          } else if (word === 'drink') {
            return `I need to <strong>${word}</strong> some water.`;
          } else if (word === 'sleep') {
            return `The baby likes to <strong>${word}</strong> all day.`;
          } else if (word === 'read') {
            return `I love to <strong>${word}</strong> bedtime stories.`;
          } else if (word === 'write') {
            return `Can you <strong>${word}</strong> your name here?`;
          } else if (word === 'draw') {
            return `Let's <strong>${word}</strong> a picture together.`;
          } else if (word === 'sing') {
            return `She loves to <strong>${word}</strong> songs.`;
          } else {
            return `I like to <strong>${word}</strong> with my friends.`;
          }
          
        case 'adjectives':
          // Specific sentences for adjectives
          if (word === 'big') {
            return `The <strong>${word}</strong> elephant is gray.`;
          } else if (word === 'little' || word === 'small') {
            return `The <strong>${word}</strong> mouse is cute.`;
          } else if (word === 'old') {
            return `My <strong>${word}</strong> grandfather tells stories.`;
          } else if (word === 'new') {
            return `I got a <strong>${word}</strong> bicycle today.`;
          } else if (word === 'good') {
            return `That was a <strong>${word}</strong> movie.`;
          } else if (word === 'pretty') {
            return `What a <strong>${word}</strong> dress you have!`;
          } else if (word === 'funny') {
            return `The clown is very <strong>${word}</strong>.`;
          } else if (word === 'warm') {
            return `The soup is nice and <strong>${word}</strong>.`;
          } else if (word === 'cold') {
            return `The ice cream is <strong>${word}</strong>.`;
          } else if (word === 'hot') {
            return `The sun makes me feel <strong>${word}</strong>.`;
          } else if (word === 'fast') {
            return `The <strong>${word}</strong> car zoomed by.`;
          } else if (word === 'full') {
            return `My stomach is <strong>${word}</strong> after dinner.`;
          } else if (word === 'light') {
            return `This feather is very <strong>${word}</strong>.`;
          } else if (word === 'kind') {
            return `She is a <strong>${word}</strong> person.`;
          } else if (word === 'round') {
            return `The ball is perfectly <strong>${word}</strong>.`;
          } else if (word === 'long') {
            return `The snake is very <strong>${word}</strong>.`;
          } else if (word === 'better') {
            return `This book is <strong>${word}</strong> than that one.`;
          } else if (word === 'far') {
            return `The store is too <strong>${word}</strong> to walk.`;
          } else {
            return `The <strong>${word}</strong> cat is sleeping.`;
          }

        case 'adverbs':
          // Keep the improved adverb handling we already fixed
          if (word === 'always') {
            return `She <strong>${word}</strong> reads her book.`;
          } else if (word === 'never') {
            return `He <strong>${word}</strong> forgets his lunch.`;
          } else if (word === 'very') {
            return `The dog runs <strong>${word}</strong> fast.`;
          } else if (word === 'well') {
            return `She sings <strong>${word}</strong> in class.`;
          } else if (word === 'away') {
            return `The bird flew <strong>${word}</strong> quickly.`;
          } else if (word === 'here') {
            return `Come <strong>${word}</strong> and sit down.`;
          } else if (word === 'there') {
            return `The toy is over <strong>${word}</strong>.`;
          } else if (word === 'now') {
            return `We need to go <strong>${word}</strong>.`;
          } else if (word === 'then') {
            return `First we eat, <strong>${word}</strong> we play.`;
          } else if (word === 'today') {
            return `<strong>${word.charAt(0).toUpperCase() + word.slice(1)}</strong> is a sunny day.`;
          } else if (word === 'again') {
            return `Let's try it <strong>${word}</strong>.`;
          } else if (word === 'just') {
            return `I <strong>${word}</strong> finished my homework.`;
          } else if (word === 'too') {
            return `This box is <strong>${word}</strong> heavy.`;
          } else if (word === 'only') {
            return `There is <strong>${word}</strong> one cookie left.`;
          } else if (word === 'once') {
            return `I went to the zoo <strong>${word}</strong>.`;
          } else if (word === 'soon') {
            return `We will eat dinner <strong>${word}</strong>.`;
          } else {
            return `The children play <strong>${word}</strong>.`;
          }
          
        case 'colors':
          const colorSentences = [
            `I see a <strong>${word}</strong> bird flying.`,
            `The <strong>${word}</strong> flower smells nice.`,
            `My <strong>${word}</strong> crayon is broken.`,
            `Look at the <strong>${word}</strong> butterfly!`
          ];
          return colorSentences[Math.floor(Math.random() * colorSentences.length)];
          
        case 'numbers':
          if (word === 'one') {
            return `I have <strong>${word}</strong> apple to eat.`;
          } else if (word === 'two') {
            return `There are <strong>${word}</strong> cats playing.`;
          } else if (word === 'three') {
            return `I can count to <strong>${word}</strong> easily.`;
          } else if (word === 'four') {
            return `The table has <strong>${word}</strong> legs.`;
          } else if (word === 'five') {
            return `I have <strong>${word}</strong> fingers on my hand.`;
          } else if (word === 'six') {
            return `There are <strong>${word}</strong> eggs in the box.`;
          } else if (word === 'seven') {
            return `I am <strong>${word}</strong> years old.`;
          } else if (word === 'eight') {
            return `The spider has <strong>${word}</strong> legs.`;
          } else if (word === 'ten') {
            return `I can count from one to <strong>${word}</strong>.`;
          } else {
            return `I have <strong>${word}</strong> toys.`;
          }
          
        case 'pronouns':
          if (word === 'I') {
            return `<strong>${word}</strong> like to play games.`;
          } else if (word === 'you') {
            return `<strong>${word.charAt(0).toUpperCase() + word.slice(1)}</strong> are my best friend.`;
          } else if (word === 'he') {
            return `<strong>${word.charAt(0).toUpperCase() + word.slice(1)}</strong> is playing outside.`;
          } else if (word === 'she') {
            return `<strong>${word.charAt(0).toUpperCase() + word.slice(1)}</strong> likes to read books.`;
          } else if (word === 'it') {
            return `<strong>${word.charAt(0).toUpperCase() + word.slice(1)}</strong> is a beautiful day.`;
          } else if (word === 'we') {
            return `<strong>${word.charAt(0).toUpperCase() + word.slice(1)}</strong> are going to the park.`;
          } else if (word === 'they') {
            return `<strong>${word.charAt(0).toUpperCase() + word.slice(1)}</strong> are having fun together.`;
          } else if (word === 'me') {
            return `Please help <strong>${word}</strong> with this.`;
          } else if (word === 'him') {
            return `I gave the book to <strong>${word}</strong>.`;
          } else if (word === 'her') {
            return `This toy belongs to <strong>${word}</strong>.`;
          } else if (word === 'us') {
            return `Come play with <strong>${word}</strong>!`;
          } else if (word === 'them') {
            return `I like playing with <strong>${word}</strong>.`;
          } else if (word === 'myself') {
            return `I can do it by <strong>${word}</strong>.`;
          } else {
            return `<strong>${word.charAt(0).toUpperCase() + word.slice(1)}</strong> likes to play.`;
          }
          
        case 'verbs':
          if (word === 'is') {
            return `The cat <strong>${word}</strong> sleeping peacefully.`;
          } else if (word === 'are') {
            return `The children <strong>${word}</strong> playing outside.`;
          } else if (word === 'was') {
            return `Yesterday <strong>${word}</strong> a fun day.`;
          } else if (word === 'were') {
            return `The cookies <strong>${word}</strong> delicious.`;
          } else if (word === 'have') {
            return `I <strong>${word}</strong> a pet dog.`;
          } else if (word === 'has') {
            return `She <strong>${word}</strong> beautiful eyes.`;
          } else if (word === 'had') {
            return `We <strong>${word}</strong> pizza for dinner.`;
          } else if (word === 'be') {
            return `I want to <strong>${word}</strong> a teacher.`;
          } else if (word === 'been') {
            return `I have <strong>${word}</strong> to the zoo before.`;
          } else if (word === 'am') {
            return `I <strong>${word}</strong> seven years old.`;
          } else if (word === 'will') {
            return `Tomorrow <strong>${word}</strong> be sunny.`;
          } else if (word === 'would') {
            return `I <strong>${word}</strong> like some ice cream.`;
          } else if (word === 'does') {
            return `<strong>${word.charAt(0).toUpperCase() + word.slice(1)}</strong> she like apples?`;
          } else if (word === 'did') {
            return `<strong>${word.charAt(0).toUpperCase() + word.slice(1)}</strong> you have fun today?`;
          } else if (word === 'goes') {
            return `The bus <strong>${word}</strong> to school.`;
          } else if (word === 'went') {
            return `Yesterday we <strong>${word}</strong> swimming.`;
          } else if (word === 'came') {
            return `My friend <strong>${word}</strong> to visit.`;
          } else if (word === 'got') {
            return `I <strong>${word}</strong> a new toy today.`;
          } else if (word === 'gave') {
            return `Mom <strong>${word}</strong> me a hug.`;
          } else if (word === 'made') {
            return `We <strong>${word}</strong> cookies together.`;
          } else if (word === 'ran') {
            return `The dog <strong>${word}</strong> very fast.`;
          } else if (word === 'saw') {
            return `I <strong>${word}</strong> a rainbow yesterday.`;
          } else if (word === 'found') {
            return `She <strong>${word}</strong> her lost toy.`;
          } else if (word === 'done') {
            return `I have <strong>${word}</strong> my homework.`;
          } else if (word === 'ate') {
            return `The mouse <strong>${word}</strong> the cheese.`;
          } else if (word === 'going') {
            return `We are <strong>${word}</strong> to the beach.`;
          } else {
            return `The children <strong>${word}</strong> happy.`;
          }
          
        case 'prepositions':
          if (word === 'in') {
            return `The cat is <strong>${word}</strong> the box.`;
          } else if (word === 'on') {
            return `The book is <strong>${word}</strong> the table.`;
          } else if (word === 'at') {
            return `We are <strong>${word}</strong> the park now.`;
          } else if (word === 'to') {
            return `Let's walk <strong>${word}</strong> the store.`;
          } else if (word === 'for') {
            return `This gift is <strong>${word}</strong> you.`;
          } else if (word === 'with') {
            return `I play <strong>${word}</strong> my friends.`;
          } else if (word === 'from') {
            return `The letter came <strong>${word}</strong> grandma.`;
          } else if (word === 'up') {
            return `The balloon floated <strong>${word}</strong> high.`;
          } else if (word === 'down') {
            return `The ball rolled <strong>${word}</strong> the hill.`;
          } else if (word === 'out') {
            return `Let's go <strong>${word}</strong> and play.`;
          } else if (word === 'into') {
            return `The mouse ran <strong>${word}</strong> its hole.`;
          } else if (word === 'over') {
            return `The plane flies <strong>${word}</strong> the clouds.`;
          } else if (word === 'under') {
            return `The shoes are <strong>${word}</strong> the bed.`;
          } else if (word === 'about') {
            return `Tell me <strong>${word}</strong> your day.`;
          } else if (word === 'around') {
            return `We walked <strong>${word}</strong> the playground.`;
          } else if (word === 'by') {
            return `The house <strong>${word}</strong> the river is blue.`;
          } else if (word === 'off') {
            return `Please turn <strong>${word}</strong> the lights.`;
          } else if (word === 'before') {
            return `Wash your hands <strong>${word}</strong> dinner.`;
          } else if (word === 'after') {
            return `We play <strong>${word}</strong> we eat.`;
          } else if (word === 'upon') {
            return `Once <strong>${word}</strong> a time, there lived a princess.`;
          } else {
            return `The book is <strong>${word}</strong> the table.`;
          }
          
        case 'question':
          if (word === 'what') {
            return `<strong>${word.charAt(0).toUpperCase() + word.slice(1)}</strong> is your favorite color?`;
          } else if (word === 'where') {
            return `<strong>${word.charAt(0).toUpperCase() + word.slice(1)}</strong> do you live?`;
          } else if (word === 'when') {
            return `<strong>${word.charAt(0).toUpperCase() + word.slice(1)}</strong> are we going home?`;
          } else if (word === 'who') {
            return `<strong>${word.charAt(0).toUpperCase() + word.slice(1)}</strong> is your best friend?`;
          } else if (word === 'why') {
            return `<strong>${word.charAt(0).toUpperCase() + word.slice(1)}</strong> is the sky blue?`;
          } else if (word === 'which') {
            return `<strong>${word.charAt(0).toUpperCase() + word.slice(1)}</strong> book do you like?`;
          } else if (word === 'how') {
            return `<strong>${word.charAt(0).toUpperCase() + word.slice(1)}</strong> are you feeling today?`;
          } else {
            return `<strong>${word.charAt(0).toUpperCase() + word.slice(1)}</strong> is your name?`;
          }

        case 'basic':
          if (word === 'the') {
            return `<strong>${word.charAt(0).toUpperCase() + word.slice(1)}</strong> sun is shining bright.`;
          } else if (word === 'and') {
            return `I like apples <strong>${word}</strong> oranges.`;
          } else if (word === 'a') {
            return `I see <strong>${word}</strong> bird in the tree.`;
          } else if (word === 'that') {
            return `<strong>${word.charAt(0).toUpperCase() + word.slice(1)}</strong> book looks interesting.`;
          } else if (word === 'this') {
            return `<strong>${word.charAt(0).toUpperCase() + word.slice(1)}</strong> is my favorite game.`;
          } else if (word === 'said') {
            return `She <strong>${word}</strong> hello to everyone.`;
          } else {
            return `<strong>${word.charAt(0).toUpperCase() + word.slice(1)}</strong> is a useful word.`;
          }
          
        default:
          return `Here is the word <strong>${word}</strong> in a sentence.`;
      }
    };

    return [generateSentence(category, word)];
  };

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
    setShowScorePopup(true);
    
    // Hide score popup after 2 seconds (reduced from 4s)
    setTimeout(() => {
      setShowScorePopup(false);
    }, 2000);
    
    // Hide celebration after 3 seconds (reduced from 5s)
    setTimeout(() => {
      setShowCelebration(false);
    }, 3000);
    
    // Wait for popup to finish before changing word
    setTimeout(() => {
      setShowAnimation(false);
      selectRandomWord();
    }, 2500);
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
          <div className="score-display">
            <span className="score-icon">🏆</span>
            <div className="score-content">
              <span className="score-label">Words Mastered</span>
              <span className="score-number">{wordsLearned}</span>
            </div>
            <span className="score-sparkle">✨</span>
          </div>
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

        {/* Category Explanation */}
        {selectedCategory && categoryExplanations[selectedCategory] && (
          <div className="category-explanation">
            <h3 className="explanation-title">
              📖 {categoryExplanations[selectedCategory].title}
            </h3>
            <p className="explanation-text">
              {categoryExplanations[selectedCategory].explanation}
            </p>
            <div className="explanation-examples">
              <strong>Examples:</strong>
              <ul>
                {/* Dynamic example with current word - always use word's actual category for grammar */}
                {currentWord && (
                  <li dangerouslySetInnerHTML={{ 
                    __html: generateDynamicExample(getWordCategory(currentWord), currentWord)[0] 
                  }}></li>
                )}
                {/* Static examples */}
                {categoryExplanations[selectedCategory].examples.map((example, index) => (
                  <li key={index} dangerouslySetInnerHTML={{ __html: example }}></li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Word Display */}
        <div className={`word-display ${showAnimation ? 'animate' : ''}`}>
          <div className="word-card" style={{ position: 'relative' }}>
            <span className="current-word">{currentWord}</span>
            
            {/* Score Popup positioned relative to word-card */}
            {showScorePopup && (
              <div style={{
                position: 'absolute',
                top: '0',
                left: '0',
                right: '0',
                bottom: '0',
                zIndex: 2000,
                pointerEvents: 'none',
                borderRadius: '35px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.8) 0%, rgba(139, 195, 74, 0.8) 100%)',
                  color: 'white',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  animation: 'scorePopup 2s ease-out forwards',
                  fontFamily: 'Fredoka One, cursive',
                  border: '3px solid rgba(255, 255, 255, 0.6)',
                  borderRadius: '35px',
                  backdropFilter: 'blur(1px)'
                }}>
                  <div style={{
                    fontSize: 'clamp(3rem, 8vw, 5rem)',
                    fontWeight: '900',
                    color: '#FFD700',
                    textShadow: '3px 3px 6px rgba(0,0,0,0.4)',
                    animation: 'scoreNumber 1s ease-out',
                    marginBottom: 'clamp(10px, 3vw, 15px)'
                  }}>
                    {wordsLearned}
                  </div>
                  <div style={{
                    fontSize: 'clamp(1.2rem, 4vw, 1.8rem)',
                    marginTop: '5px',
                    opacity: '0.95',
                    textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
                  }}>
                    Great job! 🎉
                  </div>
                </div>
              </div>
            )}
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