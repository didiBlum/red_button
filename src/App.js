import React, { useState, useEffect, useRef, useMemo } from 'react';
import './App.css';
import copy from 'copy-to-clipboard';

// Activities in both languages, paired by index
const activitiesEn = [
  { type: 'breathe', label: 'Breathe in for 4 seconds, hold for 4, exhale for 4 – repeat 4 times', duration: 32 },
  { type: 'box-breath', label: 'Box Breathing (4-4-4-4)', duration: 32 },
  { type: 'deep-breath', label: 'Take 10 deep breaths', duration: 40 },
  { type: 'affirm-breath', label: 'Breathe and silently say “I am safe” on each exhale', duration: 30 },
  { type: 'body-scan', label: 'Body scan – what hurts, what feels good?', duration: 40 },
  { type: 'muscle-relax', label: 'Tense and release every muscle in your body', duration: 35 },
  { type: 'rub-hands', label: 'Rub your hands together until they are warm', duration: 15 },
  { type: 'drink-water', label: 'Drink water slowly', duration: 20 },
  { type: 'sit-chair', label: 'Sit on a chair and place your hands on your knees', duration: 30 },
  { type: 'touch-object', label: 'Touch a nearby object and describe it', duration: 25 },
  { type: 'jump', label: 'Do 10 jumping jacks', duration: 20 },
  { type: 'calm-phrase', label: 'Take a breath and say a calming phrase to yourself', duration: 15 },
  { type: 'self-hug', label: 'Give yourself a hug (physically!)', duration: 15 },
  { type: 'sit-floor', label: 'Sit on the floor for 30 seconds', duration: 30 },
  { type: 'fake-yawn', label: 'Fake yawn 5 times', duration: 15 },
  { type: 'fake-smile', label: 'Fake a smile for 10 seconds (your body responds to this too!)', duration: 10 },
  { type: 'smell', label: 'Smell something pleasant (coffee, essential oil)', duration: 15 },
];
const activitiesHe = [
  { type: 'breathe', label: 'נשום 4 שניות, החזק 4, נשוף 4 – חזור 4 פעמים', duration: 32 },
  { type: 'box-breath', label: 'נשימת קופסה (4-4-4-4)', duration: 32 },
  { type: 'deep-breath', label: 'נשימה עמוקה 10 פעמים', duration: 40 },
  { type: 'affirm-breath', label: 'נשום ואמור בלב "אני בטוח/ה" בכל נשיפה', duration: 30 },
  { type: 'body-scan', label: 'סריקה גופנית – מה כואב, מה נעים', duration: 40 },
  { type: 'muscle-relax', label: 'מתח כל שריר בגוף והרפה', duration: 35 },
  { type: 'rub-hands', label: 'שפשף את הידיים עד שהן חמות', duration: 15 },
  { type: 'drink-water', label: 'שתה  מים לאט', duration: 20 },
  { type: 'sit-chair', label: 'שב על כיסא והנח ידיים על הברכיים', duration: 30 },
  { type: 'touch-object', label: 'גע בחפץ קרוב ותאר אותו', duration: 25 },
  { type: 'jump', label: 'עשה 10 קפיצות במקום', duration: 20 },
  { type: 'calm-phrase', label: 'קח נשימה ואמור לעצמך משפט הרגעה', duration: 15 },
  { type: 'self-hug', label: 'תן לעצמך חיבוק (פיזי!)', duration: 15 },
  { type: 'sit-floor', label: 'שב על הרצפה ל-30 שניות', duration: 30 },
  { type: 'fake-yawn', label: 'פיהוק מזויף 5 פעמים', duration: 15 },
  { type: 'fake-smile', label: 'חיוך מזויף ל-10 שניות (הגוף מגיב גם לזה!)', duration: 10 },
  { type: 'smell', label: 'הריח משהו נעים (קפה, שמן אתרי)', duration: 15 },
];

const focusEn = [
  { type: 'object-observe', label: 'Look at an object for a minute and try to see details', duration: 60 },
  { type: 'describe-place', label: 'Describe out loud where you are', duration: 30 },
  { type: 'listen-sounds', label: 'Listen to the sounds around you and count 5 different sounds', duration: 40 },
  { type: 'count-back', label: 'Count backwards from 30', duration: 30 },
  { type: 'write-message', label: 'Write yourself an encouraging message and send it', duration: 60 },
  { type: 'three-things', label: 'Say 3 things you see, hear, and feel', duration: 40 },
  { type: 'ten-things-see', label: 'Count at least 10 things you see around you', duration: 40 },
  { type: 'three-good', label: 'Write 3 good things about yourself', duration: 50 },
  { type: 'one-right', label: 'Write 1 thing you did right today', duration: 30 },
  { type: 'ten-blue', label: 'Count 10 blue things around you', duration: 40 },
  { type: 'city-name', label: 'Pick a city name and think of cities starting with the same letter', duration: 40 },
  { type: 'ten-aleph', label: 'Find 10 things around you that start with the letter A', duration: 50 },
];
const focusHe = [
  { type: 'object-observe', label: 'התבונן בחפץ במשך דקה ונסה לראות פרטים', duration: 60 },
  { type: 'describe-place', label: 'תאר בקול רם איפה אתה נמצא', duration: 30 },
  { type: 'listen-sounds', label: 'הקשב לקולות סביבך וספור 5 קולות', duration: 40 },
  { type: 'count-back', label: 'ספור אחורה מ-30', duration: 30 },
  { type: 'write-message', label: 'תכתוב לעצמך הודעת עידוד ותשלח', duration: 60 },
  { type: 'three-things', label: 'אמור 3 דברים שאתה רואה, שומע ומרגיש', duration: 40 },
  { type: 'ten-things-see', label: 'ספור לפחות 10 דברים שאתה רואה סביבך', duration: 40 },
  { type: 'three-good', label: 'כתוב 3 דברים טובים בעצמך', duration: 50 },
  { type: 'one-right', label: 'כתוב 1 דבר שעשית נכון היום', duration: 30 },
  { type: 'ten-blue', label: 'ספור 10 דברים כחולים בסביבה', duration: 40 },
  { type: 'city-name', label: 'בחר שם של עיר וחשוב על ערים שמתחילות באותה אות', duration: 40 },
  { type: 'ten-aleph', label: 'חפש 10 דברים שמתחילים באות א׳ בסביבה', duration: 50 },
];

const selftalkEn = [
  { type: 'complete-sentence', label: 'Complete the sentence: "This is hard, but I..."', duration: 30 },
  { type: 'what-tell-friend', label: 'Write: What would I tell a friend in this situation?', duration: 40 },
  { type: 'good-thing-week', label: 'Write one small good thing that happened this week', duration: 30 },
  { type: 'will-it-matter', label: 'Ask yourself: "Will this matter in a year?"', duration: 25 },
  { type: 'forgive-yourself', label: 'Write something you forgive yourself for', duration: 35 },
  { type: 'doing-my-best', label: 'Say: "I am doing my best"', duration: 10 },
  { type: 'human-mistakes', label: 'Say: "I am human. I make mistakes. That doesn’t make me bad"', duration: 15 },
  { type: 'this-too-shall-pass', label: 'Say to yourself: "This too shall pass"', duration: 10 },
  { type: 'imagine-smile', label: 'Imagine yourself smiling tomorrow morning', duration: 20 },
  { type: 'three-caring', label: 'Name 3 people who care about you', duration: 20 },
  { type: 'what-need-now', label: 'Write: What do I need right now?', duration: 20 },
  { type: 'what-do-different', label: 'Write: What can I do differently next time?', duration: 30 },
  { type: 'see-yourself', label: 'Imagine seeing yourself from the outside', duration: 20 },
  { type: 'important-value', label: 'Write: What value is important to me here?', duration: 30 },
  { type: 'worst-case', label: 'Write: What’s the worst that will happen if I don’t react right now?', duration: 30 },
  { type: 'anger-logic', label: 'Say: "When I’m angry, I don’t think logically. In 10 minutes, everything will look different. I just need a few calm minutes."', duration: 30 },
];
const selftalkHe = [
  { type: 'complete-sentence', label: 'השלם משפט: "זה קשה אבל אני..."', duration: 30 },
  { type: 'what-tell-friend', label: 'כתוב: מה הייתי אומר לחבר במצב הזה', duration: 40 },
  { type: 'good-thing-week', label: 'כתוב משהו טוב קטן שקרה השבוע', duration: 30 },
  { type: 'will-it-matter', label: 'שאל את עצמך: "האם זה יהיה חשוב עוד שנה?"', duration: 25 },
  { type: 'forgive-yourself', label: 'תכתוב משהו שאתה סולח לעצמך עליו', duration: 35 },
  { type: 'doing-my-best', label: 'אמור: "אני עושה כמיטב יכולתי"', duration: 10 },
  { type: 'human-mistakes', label: 'אמור: "אני בן אדם. אני טועה. זה לא הופך אותי רע"', duration: 15 },
  { type: 'this-too-shall-pass', label: 'אמור לעצמך: "גם זה יעבור"', duration: 10 },
  { type: 'imagine-smile', label: 'דמיין את עצמך מחייך מחר בבוקר', duration: 20 },
  { type: 'three-caring', label: 'ציין 3 אנשים שאכפת להם ממך', duration: 20 },
  { type: 'what-need-now', label: 'כתוב: מה אני צריך עכשיו?', duration: 20 },
  { type: 'what-do-different', label: 'כתוב: מה אני יכול לעשות אחרת פעם הבאה?', duration: 30 },
  { type: 'see-yourself', label: 'דמיין שאתה רואה את עצמך מבחוץ', duration: 20 },
  { type: 'important-value', label: 'כתוב: איזה ערך חשוב לי כאן?', duration: 30 },
  { type: 'worst-case', label: 'כתוב: מה הדבר הכי גרוע שיקרה אם אני לא אגיב כרגע?', duration: 30 },
  { type: 'anger-logic', label: 'אמור לעצמך: בזמן כעס אני לא חושב בהיגיון. עוד 10 דקות הכל יראה לי אחרת לגמרי. רק צריך להעביר כמה דקות רגועות', duration: 30 },
];

const contentEn = [
  {
    type: 'youtube',
    label: 'Watch this funny animal video: https://youtu.be/RK-oQfFToVg', // cats and cucumbers
    duration: 60
  },
  {
    type: 'youtube',
    label: 'Watch a calming nature scene with music: https://youtu.be/2OEL4P1Rz04', // peaceful rivers
    duration: 60
  },
  {
    type: 'youtube',
    label: 'Listen to 1 minute of ocean waves: https://youtu.be/B4gI1ZxdZP0', // nature white noise
    duration: 60
  },
  {
    type: 'story',
    label: 'An elderly man dropped his groceries, and a teenager helped him carry everything home. They now wave to each other every morning.',
    duration: 30
  },
  {
    type: 'quote',
    label: '"You are not a drop in the ocean. You are the entire ocean in a drop." — Rumi',
    duration: 30
  },
  {
    type: 'riddle',
    label: 'I’m tall when I’m young and short when I’m old. What am I? (A candle)',
    duration: 30
  },
  {
    type: 'joke',
    label: 'Why don’t skeletons fight each other? They don’t have the guts!',
    duration: 20
  }
];

const contentHe = [
  {
    type: 'youtube',
    label: 'צפו בחתולים מפחדים ממלפפונים: https://youtu.be/RK-oQfFToVg',
    duration: 60
  },
  {
    type: 'youtube',
    label: 'סצנת טבע של נחל עם מוזיקה רגועה: https://youtu.be/2OEL4P1Rz04',
    duration: 60
  },
  {
    type: 'youtube',
    label: 'האזינו לגלי הים לדקה אחת: https://youtu.be/B4gI1ZxdZP0',
    duration: 60
  },
  {
    type: 'story',
    label: 'איש מבוגר הפיל את הקניות, ונער צעיר עזר לו לשאת אותן הביתה. מאז הם מנופפים זה לזה כל בוקר.',
    duration: 30
  },
  {
    type: 'quote',
    label: '"אתה לא טיפה באוקיינוס. אתה כל האוקיינוס בטיפה אחת." — רומי',
    duration: 30
  },
  {
    type: 'riddle',
    label: 'אני גבוה כשאני צעיר ונמוך כשאני זקן. מה אני? (נר)',
    duration: 30
  },
  {
    type: 'joke',
    label: 'למה שלדים לא נלחמים זה בזה? כי אין להם אומץ!',
    duration: 20
  }
];

const logicEn = [
  { type: 'math', label: 'Solve: 7 + 5 = ?', answer: '12', duration: 60 },
  { type: 'math', label: 'Solve: 9 - 3 = ?', answer: '6', duration: 60 },
  { type: 'puzzle', label: 'Which emoji is different? 😀 😃 😄 😁 🐱', options: ['😀','😃','😄','😁','🐱'], answer: '🐱', duration: 60 },
  {
    type: 'word-multi',
    label: 'Word Challenge',
    steps: [
      { prompt: 'Type a word that starts with the letter B', check: val => /^b/i.test(val.trim()) },
      { prompt: 'Type a word with at least 5 letters', check: val => val.trim().length >= 5 },
      { prompt: 'Type a word that ends with the letter E', check: val => /e$/i.test(val.trim()) },
      { prompt: 'Type a word with double letters (like "letter")', check: val => /(\w)\1/.test(val.trim()) },
      { prompt: 'Type a word with only one vowel', check: val => (val.match(/[aeiou]/gi) || []).length === 1 },
      { prompt: 'Type a word that is a noun', check: val => true }, // can't check, accept any
      { prompt: 'Type a word with no repeating letters', check: val => new Set(val.toLowerCase()).size === val.length },
      { prompt: 'Type a word that rhymes with "cat"', check: val => /at$/i.test(val.trim()) },
      { prompt: 'Type a word that contains the letter Z', check: val => /z/i.test(val) },
      { prompt: 'Type a word that is a color', check: val => true }, // can't check, accept any
    ],
    duration: 120
  },
  { type: 'memory', label: 'Match all the pairs to finish!', duration: 90 },
];
const logicHe = [
  { type: 'math', label: 'פתור: 7 + 5 = ?', answer: '12', duration: 60 },
  { type: 'math', label: 'פתור: 9 - 3 = ?', answer: '6', duration: 60 },
  { type: 'puzzle', label: 'איזה אימוג׳י שונה? 😀 😃 😄 😁 🐱', options: ['😀','😃','😄','😁','🐱'], answer: '🐱', duration: 60 },
  {
    type: 'word-multi',
    label: 'אתגר מילים',
    steps: [
      { prompt: 'כתוב מילה שמתחילה באות ב׳', check: val => val.trim().startsWith('ב') },
      { prompt: 'כתוב מילה עם לפחות 5 אותיות', check: val => val.trim().length >= 5 },
      { prompt: 'כתוב מילה שמסתיימת באות ה׳', check: val => val.trim().endsWith('ה') },
      { prompt: 'כתוב מילה עם שתי אותיות זהות ברצף', check: val => /(\w)\1/.test(val.trim()) },
      { prompt: 'כתוב מילה עם תנועה אחת בלבד', check: val => (val.match(/[אהויוע]/g) || []).length === 1 },
      { prompt: 'כתוב שם עצם', check: val => true },
      { prompt: 'כתוב מילה בלי אותיות חוזרות', check: val => new Set(val).size === val.length },
      { prompt: 'כתוב מילה שמסתיימת ב-"ת"', check: val => val.trim().endsWith('ת') },
      { prompt: 'כתוב מילה שיש בה את האות ז׳', check: val => val.includes('ז') },
      { prompt: 'כתוב שם של צבע', check: val => true },
    ],
    duration: 120
  },
  { type: 'memory', label: 'התאם את כל הזוגות כדי לסיים!', duration: 90 },
];

const translations = {
  en: {
    feeling: "Feeling overwhelmed? Press the Red Button.",
    header: "Just breathe. You're safe. Let's do this together.",
    back: "I’m ready to go back",
    moreTime: "I need more time",
    start: "Start",
    chooseCategory: "Pick a category or let me choose for you:",
    chooseForMe: "Choose for me",
    noActivityMsg: "No activities in this category yet.",
    redButtonLabel: "Red Button",
    redButtonIcon: "🔴",
    categories: [
      { key: 'breath', label: 'Breathing & Physical Calm', emoji: '🫁' },
      { key: 'focus', label: 'Focus & Mindfulness', emoji: '🧘' },
      { key: 'content', label: 'Calming/Distraction Content', emoji: '🎵' },
      { key: 'selftalk', label: 'Self-Talk', emoji: '💬' },
      { key: 'logic', label: 'Return to Logic', emoji: '🧠' },
    ],
    lang: 'עברית',
    langLabel: 'Switch to Hebrew',
  },
  he: {
    feeling: "מרגישים מוצפים? לחצו על הכפתור האדום.",
    header: "פשוט לנשום. נעבור את זה יחד.",
    back: "אני מוכן/ה לחזור",
    moreTime: "אני צריך/ה עוד זמן",
    start: "התחל",
    chooseCategory: "בחרו קטגוריה או תנו לנו לבחור בשבילכם:",
    chooseForMe: "בחירה אקראית",
    noActivityMsg: "אין פעילויות בקטגוריה זו עדיין.",
    redButtonLabel: "הכפתור האדום",
    redButtonIcon: "🔴",
    categories: [
      { key: 'breath', label: 'נשימה והרגעה פיזית', emoji: '🫁' },
      { key: 'focus', label: 'מיקוד ומיינדפולנס', emoji: '🧘' },
      { key: 'content', label: 'תוכן מרגיע/מסיח', emoji: '🎵' },
      { key: 'selftalk', label: 'דיבור עצמי', emoji: '💬' },
      { key: 'logic', label: 'לחזור לפעול מהראש', emoji: '🧠' },
    ],
    lang: 'English',
    langLabel: 'החלף לאנגלית',
  },
};

// Assign all current activities to the 'breath' category for now
const categorizedActivities = {
  breath: activitiesEn.map((a, i) => ({ ...a, category: 'breath', he: activitiesHe[i].label, en: a.label })),
  focus: focusEn.map((a, i) => ({ ...a, category: 'focus', he: focusHe[i].label, en: a.label })),
  content: contentEn.map((a, i) => ({ ...a, category: 'content', he: contentHe[i].label, en: a.label })),
  selftalk: selftalkEn.map((a, i) => ({ ...a, category: 'selftalk', he: selftalkHe[i].label, en: a.label })),
  logic: logicEn.map((a, i) => ({ ...a, category: 'logic', he: logicHe[i].label, en: a.label, options: logicHe[i].options, letter: logicHe[i].letter, answer: logicHe[i].answer })),
};

function getRandomActivityFromCategory(category, lang) {
  const arr = categorizedActivities[category] || [];
  if (!arr.length) return null;
  const idx = Math.floor(Math.random() * arr.length);
  return lang === 'he' ? { ...arr[idx], label: arr[idx].he } : { ...arr[idx], label: arr[idx].en };
}

function getRandomCategory(categories) {
  const filled = categories.filter(cat => categorizedActivities[cat.key] && categorizedActivities[cat.key].length > 0);
  if (!filled.length) return null;
  return filled[Math.floor(Math.random() * filled.length)].key;
}

function App() {
  const [lang, setLang] = useState('he');
  const [showTask, setShowTask] = useState(false);
  const [activity, setActivity] = useState(null);
  const [timer, setTimer] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [started, setStarted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [noActivityMsg, setNoActivityMsg] = useState('');
  // Add state for logic answers and memory game
  const [logicInput, setLogicInput] = useState('');
  const [logicCorrect, setLogicCorrect] = useState(false);
  // Add state for multi-step word challenge
  const [wordStep, setWordStep] = useState(0);
  const [wordInput, setWordInput] = useState('');
  const [wordStepCorrect, setWordStepCorrect] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [selftalkInput, setSelftalkInput] = useState('');
  const [selftalkInputValid, setSelftalkInputValid] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstall, setShowInstall] = useState(false);
  const installBtnRef = useRef();
  // Add state for multi-input tasks
  const [multiInputs, setMultiInputs] = useState([]);
  // Add state for showing WhatsApp suggestion
  const [showWhatsApp, setShowWhatsApp] = useState(false);
  const [showCongrats, setShowCongrats] = useState(false);

  const t = translations[lang];

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstall(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  // Hide install button if app is already installed
  useEffect(() => {
    const listener = () => setShowInstall(false);
    window.addEventListener('appinstalled', listener);
    return () => window.removeEventListener('appinstalled', listener);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') setShowInstall(false);
  };

  const handleCategoryPick = (catKey) => {
    setSelectedCategory(catKey);
    const act = getRandomActivityFromCategory(catKey, lang);
    if (!act) {
      setNoActivityMsg(t.noActivityMsg);
      setShowTask(false);
      setActivity(null);
      setTimer(0);
      setTimerActive(false);
      setStarted(false);
      return;
    }
    setNoActivityMsg('');
    setActivity(act);
    setTimer(act.duration);
    setShowTask(true);
    setTimerActive(false);
    setStarted(false);
  };

  const handleChooseForMe = () => {
    const catKey = getRandomCategory(t.categories);
    handleCategoryPick(catKey);
  };

  const handleStart = () => {
    setStarted(true);
    setTimerActive(true);
  };

  // In handleBack, show the congrats screen instead of going directly to home
  const handleBack = () => {
    setShowTask(false);
    setActivity(null);
    setTimer(0);
    setTimerActive(false);
    setStarted(false);
    setSelectedCategory(null);
    setShowCategories(false);
    setShowCongrats(true);
  };

  const handleMoreTime = () => {
    const act = getRandomActivityFromCategory(selectedCategory, lang);
    if (!act) {
      setNoActivityMsg(t.noActivityMsg);
      setShowTask(false);
      setActivity(null);
      setTimer(0);
      setTimerActive(false);
      setStarted(false);
      return;
    }
    setNoActivityMsg('');
    setActivity(act);
    setTimer(act.duration);
    setTimerActive(false);
    setStarted(false);
  };

  useEffect(() => {
    if (!timerActive) return;
    if (timer <= 0) {
      setTimerActive(false);
      return;
    }
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer, timerActive]);

  // Reset wordStep and wordInput when a new activity is shown
  useEffect(() => {
    setWordStep(0);
    setWordInput('');
    setWordStepCorrect(false);
    setLogicCorrect(false);
  }, [activity]);

  // Reset selftalkInput and selftalkInputValid when a new activity is shown
  useEffect(() => {
    setSelftalkInput('');
    setSelftalkInputValid(false);
    // Multi-input: detect if label starts with 'Write N' or 'כתוב N'
    let n = 0;
    if (activity && activity.label) {
      const enMatch = activity.label.match(/^Write (\d+)/);
      const heMatch = activity.label.match(/^כתוב (\d+)/);
      if (enMatch) n = parseInt(enMatch[1], 10);
      if (heMatch) n = parseInt(heMatch[1], 10);
    }
    if (n > 1) {
      setMultiInputs(Array(n).fill(''));
    } else {
      setMultiInputs([]);
    }
  }, [activity]);

  // After timer is up and all write fields are filled, show WhatsApp suggestion
  useEffect(() => {
    if (
      timer === 0 &&
      ((activity && ((lang === 'en' && activity.label && activity.label.startsWith('Write')) || (lang === 'he' && activity.label && activity.label.startsWith('כתוב'))))) &&
      (
        (multiInputs.length > 1
          ? multiInputs.every(val => val.trim().length >= 2)
          : selftalkInputValid)
      )
    ) {
      setShowWhatsApp(true);
    } else {
      setShowWhatsApp(false);
    }
  }, [timer, activity, lang, multiInputs, selftalkInputValid]);

  // WhatsApp send handler
  const handleSendWhatsApp = () => {
    let text = '';
    if (multiInputs.length > 1) {
      text = multiInputs.filter(val => val.trim()).join('\n');
    } else {
      text = selftalkInput;
    }
    copy(text);
    // WhatsApp URL
    const encoded = encodeURIComponent(text);
    const isMobile = /android|iphone|ipad|ipod/i.test(navigator.userAgent);
    const waUrl = isMobile
      ? `https://wa.me/?text=${encoded}`
      : `https://web.whatsapp.com/send?text=${encoded}`;
    window.open(waUrl, '_blank');
  };

  return (
    <div className={`App gradient-bg${lang === 'he' ? ' rtl' : ''}`}>
      <button className="lang-switch" onClick={() => setLang(lang === 'en' ? 'he' : 'en')} aria-label={t.langLabel}>{t.lang}</button>
      {!showCategories && !showTask ? (
        <div className="centered-content">
          <button
            className="red-button"
            onClick={() => setShowCategories(true)}
            aria-label={t.redButtonLabel}
          >{t.redButtonIcon}</button>
          <div className="calm-text">{t.feeling}</div>
          {showInstall && (
            <button
              className="install-btn"
              ref={installBtnRef}
              onClick={handleInstallClick}
              style={{ marginTop: '2.5rem' }}
            >
              {lang === 'he' ? 'הוסף למסך הבית' : 'Add to Home Screen'}
            </button>
          )}
        </div>
      ) : showCategories && !showTask ? (
        <div className="centered-content">
          <div className="category-prompt">{t.chooseCategory}</div>
          <div className="categories-list">
            {t.categories.map(cat => (
              <button key={cat.key} className="category-btn" onClick={() => handleCategoryPick(cat.key)}>
                <span className="cat-emoji">{cat.emoji}</span>
                <span className="cat-label">{cat.label}</span>
              </button>
            ))}
          </div>
          <button className="choose-for-me-btn" onClick={handleChooseForMe}>{t.chooseForMe}</button>
        </div>
      ) : showTask ? (
        <div className="task-screen">
          <div className="task-header">{t.header}</div>
          <div className="activity-card">
            <div className="activity-label">{activity.label}</div>
            {noActivityMsg && (
              <div className="no-activity-msg">{noActivityMsg}</div>
            )}
            {!started ? (
              <button className="start-button" onClick={handleStart}>{t.start}</button>
            ) : (
              <>
                <div className="timer-display">{timer > 0 ? timer : 0}</div>
                {activity.type === 'math' && (
                  <div className="logic-task">
                    <div className="logic-label">{activity.label}</div>
                    <input
                      className="logic-input"
                      type="text"
                      value={logicInput}
                      onChange={e => {
                        setLogicInput(e.target.value);
                        setLogicCorrect(e.target.value.trim() === activity.answer);
                      }}
                      placeholder={lang === 'he' ? 'הקלד תשובה' : 'Type answer'}
                      dir={lang === 'he' ? 'rtl' : 'ltr'}
                    />
                    {logicCorrect && <div className="logic-correct">✔️</div>}
                  </div>
                )}
                {activity.type === 'puzzle' && (
                  <div className="logic-task">
                    <div className="logic-label">{activity.label}</div>
                    <div className="logic-options">
                      {activity.options.map(opt => (
                        <button
                          key={opt}
                          className={`logic-option-btn${logicInput === opt ? ' selected' : ''}`}
                          onClick={() => {
                            setLogicInput(opt);
                            setLogicCorrect(opt === activity.answer);
                          }}
                        >{opt}</button>
                      ))}
                    </div>
                    {logicCorrect && <div className="logic-correct">✔️</div>}
                  </div>
                )}
                {activity.type === 'word-multi' && (
                  <div className="logic-task">
                    {wordStep < activity.steps.length ? (
                      <>
                        <div className="logic-label">{(activity.steps[wordStep] && activity.steps[wordStep].prompt) || ''}</div>
                        <input
                          className="logic-input"
                          type="text"
                          value={wordInput}
                          onChange={e => {
                            setWordInput(e.target.value);
                            setWordStepCorrect(activity.steps[wordStep].check(e.target.value));
                          }}
                          placeholder={lang === 'he' ? 'הקלד מילה' : 'Type a word'}
                          dir={lang === 'he' ? 'rtl' : 'ltr'}
                        />
                        <button
                          className="logic-option-btn"
                          disabled={!wordStepCorrect}
                          onClick={() => {
                            setWordInput('');
                            setWordStepCorrect(false);
                            setWordStep(wordStep + 1);
                            if (wordStep + 1 === activity.steps.length) setLogicCorrect(true);
                          }}
                        >{lang === 'he' ? 'בדוק' : 'Check'}</button>
                        <div style={{marginTop:8}}>{lang === 'he' ? `שלב ${wordStep+1} מתוך ${activity.steps.length}` : `Step ${wordStep+1} of ${activity.steps.length}`}</div>
                      </>
                    ) : (
                      <div className="logic-correct">{lang === 'he' ? 'כל הכבוד! סיימת.' : 'Well done! You finished.'}</div>
                    )}
                  </div>
                )}
                {activity.type === 'memory' && (
                  <MemoryGame
                    lang={lang}
                    onComplete={() => setLogicCorrect(true)}
                    reset={activity.type === 'memory'}
                  />
                )}
                {((activity.label && ((lang === 'en' && activity.label.startsWith('Write')) || (lang === 'he' && activity.label.startsWith('כתוב'))))) && (
                  <div className="logic-task">
                    <div className="logic-label">{activity.label}</div>
                    {multiInputs.length > 1 ? (
                      <>
                        {multiInputs.map((val, idx) => (
                          <textarea
                            key={idx}
                            className="logic-textarea"
                            value={val}
                            onChange={e => {
                              const newInputs = [...multiInputs];
                              newInputs[idx] = e.target.value;
                              setMultiInputs(newInputs);
                            }}
                            placeholder={lang === 'he' ? `הקלד כאן (${idx+1})...` : `Type here (${idx+1})...`}
                            dir={lang === 'he' ? 'rtl' : 'ltr'}
                            style={{marginBottom: 6}}
                          />
                        ))}
                      </>
                    ) : (
                      <textarea
                        className="logic-textarea"
                        value={selftalkInput}
                        onChange={e => {
                          setSelftalkInput(e.target.value);
                          setSelftalkInputValid(e.target.value.trim().length >= 2);
                        }}
                        placeholder={lang === 'he' ? 'הקלד כאן...' : 'Type here...'}
                        dir={lang === 'he' ? 'rtl' : 'ltr'}
                      />
                    )}
                  </div>
                )}
                {!started ? (
                  <button className="start-button" onClick={handleStart}>{t.start}</button>
                ) : (
                  <>
                    <button
                      className="back-button"
                      onClick={handleBack}
                      disabled={
                        timer > 0 ||
                        (activity.category === 'logic' && !logicCorrect) ||
                        (((activity.label && ((lang === 'en' && activity.label.startsWith('Write')) || (lang === 'he' && activity.label.startsWith('כתוב'))))) && (
                          (multiInputs.length > 1
                            ? multiInputs.some(val => val.trim().length < 2)
                            : !selftalkInputValid)
                        ))
                      }
                    >
                      {t.back}
                    </button>
                    {timer <= 0 && (
                      <button className="more-time-button" onClick={handleMoreTime}>
                        {t.moreTime}
                      </button>
                    )}
                  </>
                )}
                {showWhatsApp && (
                  <button
                    className="whatsapp-btn"
                    onClick={handleSendWhatsApp}
                    style={{marginTop: 12}}
                  >
                    {lang === 'he'
                      ? 'שלח לעצמך תזכורת ב-WhatsApp (הטקסט הועתק)' 
                      : 'Send to yourself via WhatsApp'}
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      ) : null}
      {showCongrats ? (
        <div className="congrats-screen" onClick={() => setShowCongrats(false)}>
          <div className="congrats-message" style={{fontFamily: `'Quicksand', 'Open Sans', 'Inter', Arial, sans-serif`}}>
            <div>{lang === 'he' ? 'כל הכבוד!' : 'Good job!'}</div>
            <div>{lang === 'he' ? 'קח/י נשימה אחרונה' : 'Take a final breath'}</div>
            <div>{lang === 'he' ? 'תן/י לעצמך חיבוק חזק' : 'Give yourself a strong hug'}</div>
            <div>{lang === 'he' ? 'הצלחת!' : 'You got it!'}</div>
            <div style={{fontSize: '1rem', marginTop: '1.5rem', opacity: 0.7}}>{lang === 'he' ? 'הקלק/י כדי להמשיך' : 'Tap anywhere to continue'}</div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default App;

function MemoryGame({ lang, onComplete, reset }) {
  const emojis = useMemo(() => ['🍎','🍌','🍇','🍉','🍓','🍒'], []);
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    // Shuffle and duplicate emojis
    const deck = [...emojis, ...emojis]
      .sort(() => Math.random() - 0.5)
      .map((emoji, i) => ({ id: i, emoji, flipped: false, matched: false }));
    setCards(deck);
    setFlipped([]);
    setMatched([]);
    setDone(false);
  }, [reset, emojis]);

  useEffect(() => {
    if (matched.length === emojis.length * 2) {
      setDone(true);
      onComplete();
    }
  }, [matched, onComplete, emojis.length]);

  const handleFlip = idx => {
    if (flipped.length === 2 || cards[idx].flipped || cards[idx].matched) return;
    const newFlipped = [...flipped, idx];
    const newCards = cards.map((card, i) =>
      i === idx ? { ...card, flipped: true } : card
    );
    setCards(newCards);
    setFlipped(newFlipped);
    if (newFlipped.length === 2) {
      setTimeout(() => {
        const [i1, i2] = newFlipped;
        if (newCards[i1].emoji === newCards[i2].emoji) {
          setMatched(m => [...m, i1, i2]);
          setCards(cs => cs.map((c, i) =>
            i === i1 || i === i2 ? { ...c, matched: true } : c
          ));
        } else {
          setCards(cs => cs.map((c, i) =>
            i === i1 || i === i2 ? { ...c, flipped: false } : c
          ));
        }
        setFlipped([]);
      }, 800);
    }
  };

  return (
    <div className="memory-game">
      <div className="memory-grid">
        {cards.map((card, idx) => (
          <button
            key={card.id}
            className={`memory-card${card.flipped || card.matched ? ' flipped' : ''}`}
            onClick={() => handleFlip(idx)}
            disabled={card.flipped || card.matched || flipped.length === 2}
          >
            {card.flipped || card.matched ? card.emoji : '❓'}
          </button>
        ))}
      </div>
      {done && <div className="memory-done">{lang === 'he' ? 'כל הכבוד! סיימת.' : 'Well done! You finished.'}</div>}
    </div>
  );
}
