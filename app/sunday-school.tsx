import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useCallback, useRef, useState } from "react";
import {
    Animated,
    Dimensions,
    Pressable,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from "react-native";
import ReAnimated, { FadeInDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import YoutubeIframe from "react-native-youtube-iframe";
import type { AppTheme } from "../src/theme/colors";
import { useAppTheme } from "../src/theme/ThemeProvider";

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");

/* ───── Celebration particle config ───── */
const PARTICLE_COUNT = 24;
const EMOJIS = ["🎉", "⭐", "🏆", "✨", "🎊", "💛", "🌟", "🙏", "📖", "❤️"];
const makeParticles = () =>
  Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
    id: i,
    emoji: EMOJIS[i % EMOJIS.length],
    x: Math.random() * (SCREEN_W - 30),
    delay: Math.random() * 600,
    size: 18 + Math.random() * 16,
  }));

/* ───────── TYPES ───────── */
type QuizQuestion = {
  question: string;
  options: string[];
  correctIndex: number;
};

type Lesson = {
  id: number;
  title: string;
  description: string;
  youtubeId: string;
  duration: string;
  icon: string;
  gradient: [string, string];
  bibleVerse: string;
  verseRef: string;
  quiz: QuizQuestion[];
};

/* ───────── OLD TESTAMENT LESSONS ───────── */
const otLessons: Lesson[] = [
  {
    id: 1,
    title: "Creation Story",
    description: "God created the heavens and the earth in 6 days",
    youtubeId: "teu7BCZTgDs",
    duration: "10 min",
    icon: "🌍",
    gradient: ["#06b6d4", "#0284c7"],
    bibleVerse: "In the beginning God created the heavens and the earth.",
    verseRef: "Genesis 1:1",
    quiz: [
      { question: "How many days did God take to create the world?", options: ["5", "6", "7", "10"], correctIndex: 1 },
      { question: "What did God create on the first day?", options: ["Animals", "Light", "Water", "Trees"], correctIndex: 1 },
      { question: "What did God do on the 7th day?", options: ["Created man", "Created stars", "Rested", "Created fish"], correctIndex: 2 },
    ],
  },
  {
    id: 2,
    title: "Noah's Ark",
    description: "Noah built an ark and saved the animals from the flood",
    youtubeId: "qzYjy6lhRag",
    duration: "12 min",
    icon: "🚢",
    gradient: ["#8b5cf6", "#7c3aed"],
    bibleVerse: "Noah did everything just as God commanded him.",
    verseRef: "Genesis 6:22",
    quiz: [
      { question: "What did God ask Noah to build?", options: ["A house", "An ark", "A temple", "A tower"], correctIndex: 1 },
      { question: "How many of each animal went into the ark?", options: ["1", "2", "3", "5"], correctIndex: 1 },
      { question: "What sign did God give after the flood?", options: ["A star", "A rainbow", "A dove", "Thunder"], correctIndex: 1 },
    ],
  },
  {
    id: 3,
    title: "David and Goliath",
    description: "A young shepherd boy defeats a mighty giant with faith",
    youtubeId: "2v9pTLPI72U",
    duration: "8 min",
    icon: "⚔️",
    gradient: ["#f59e0b", "#d97706"],
    bibleVerse:
      "The Lord who rescued me from the paw of the lion will rescue me from this Philistine.",
    verseRef: "1 Samuel 17:37",
    quiz: [
      { question: "What was David's job before fighting Goliath?", options: ["Soldier", "Shepherd", "King", "Carpenter"], correctIndex: 1 },
      { question: "What weapon did David use?", options: ["Sword", "Spear", "Sling and stone", "Bow"], correctIndex: 2 },
      { question: "What gave David courage?", options: ["His armor", "His strength", "His faith in God", "His brothers"], correctIndex: 2 },
    ],
  },
  {
    id: 4,
    title: "Daniel in the Lions' Den",
    description: "Daniel's faith protected him from the hungry lions",
    youtubeId: "bEM_X25DWPk",
    duration: "9 min",
    icon: "🦁",
    gradient: ["#ec4899", "#db2777"],
    bibleVerse:
      "My God sent his angel, and he shut the mouths of the lions.",
    verseRef: "Daniel 6:22",
    quiz: [
      { question: "Why was Daniel thrown into the lions' den?", options: ["He stole", "He prayed to God", "He fought the king", "He lied"], correctIndex: 1 },
      { question: "Who protected Daniel?", options: ["The king", "God", "A soldier", "His friends"], correctIndex: 1 },
      { question: "What happened to the lions?", options: ["They ate Daniel", "They slept", "God shut their mouths", "They escaped"], correctIndex: 2 },
    ],
  },
  {
    id: 5,
    title: "Adam and Eve",
    description: "The first man and woman in the Garden of Eden",
    youtubeId: "l7TDvJrjjz0",
    duration: "9 min",
    icon: "🍎",
    gradient: ["#84cc16", "#65a30d"],
    bibleVerse: "So God created mankind in his own image.",
    verseRef: "Genesis 1:27",
    quiz: [
      { question: "Where did Adam and Eve live?", options: ["Desert", "Garden of Eden", "Mountain", "City"], correctIndex: 1 },
      { question: "What fruit were they told not to eat?", options: ["Apple", "Mango", "Fruit of knowledge", "Grape"], correctIndex: 2 },
      { question: "Who tempted Eve?", options: ["A bird", "A serpent", "A lion", "An angel"], correctIndex: 1 },
    ],
  },
  {
    id: 6,
    title: "Tower of Babel",
    description: "People tried to build a tower to reach heaven",
    youtubeId: "CW-NXNzdZhM",
    duration: "7 min",
    icon: "🏗️",
    gradient: ["#a855f7", "#9333ea"],
    bibleVerse: "The Lord confused the language of the whole world.",
    verseRef: "Genesis 11:9",
    quiz: [
      { question: "Why did people build the tower?", options: ["For fun", "To reach heaven", "To store food", "To hide"], correctIndex: 1 },
      { question: "What did God do to stop them?", options: ["Destroyed the tower", "Confused their languages", "Sent rain", "Made them sleep"], correctIndex: 1 },
      { question: "What is the tower called?", options: ["Tower of David", "Tower of Babel", "Tower of Zion", "Tower of God"], correctIndex: 1 },
    ],
  },
  {
    id: 7,
    title: "Abraham's Faith",
    description: "Abraham trusted God and became the father of nations",
    youtubeId: "zUhs-MWoTbg",
    duration: "10 min",
    icon: "🌟",
    gradient: ["#0ea5e9", "#0369a1"],
    bibleVerse: "Abraham believed the Lord, and He credited it to him as righteousness.",
    verseRef: "Genesis 15:6",
    quiz: [
      { question: "What did God promise Abraham?", options: ["Gold", "A great nation", "A palace", "Power"], correctIndex: 1 },
      { question: "What was Abraham's wife's name?", options: ["Ruth", "Sarah", "Mary", "Hannah"], correctIndex: 1 },
      { question: "What was Abraham's son's name?", options: ["Moses", "David", "Isaac", "Jacob"], correctIndex: 2 },
    ],
  },
  {
    id: 8,
    title: "Jacob and Esau",
    description: "Twin brothers and the stolen blessing",
    youtubeId: "jNadcmhUjVQ",
    duration: "9 min",
    icon: "👬",
    gradient: ["#f43f5e", "#e11d48"],
    bibleVerse: "The older will serve the younger.",
    verseRef: "Genesis 25:23",
    quiz: [
      { question: "Who were the twin brothers?", options: ["Cain and Abel", "Jacob and Esau", "Moses and Aaron", "David and Solomon"], correctIndex: 1 },
      { question: "What did Esau sell for stew?", options: ["His land", "His birthright", "His sheep", "His coat"], correctIndex: 1 },
      { question: "Who was their father?", options: ["Abraham", "Noah", "Isaac", "Moses"], correctIndex: 2 },
    ],
  },
  {
    id: 9,
    title: "Joseph's Coat",
    description: "Joseph received a colorful coat and was sold by his brothers",
    youtubeId: "gNEPXefoe2s",
    duration: "11 min",
    icon: "🧥",
    gradient: ["#e879f9", "#c026d3"],
    bibleVerse: "You intended to harm me, but God intended it for good.",
    verseRef: "Genesis 50:20",
    quiz: [
      { question: "What special gift did Joseph get from his father?", options: ["A crown", "A colorful coat", "A sword", "A ring"], correctIndex: 1 },
      { question: "What could Joseph interpret?", options: ["Songs", "Dreams", "Languages", "Stars"], correctIndex: 1 },
      { question: "Where did Joseph become a ruler?", options: ["Israel", "Babylon", "Egypt", "Rome"], correctIndex: 2 },
    ],
  },
  {
    id: 10,
    title: "Baby Moses",
    description: "Baby Moses was saved in a basket on the river",
    youtubeId: "hI9rDikU-FM",
    duration: "8 min",
    icon: "👶",
    gradient: ["#14b8a6", "#0d9488"],
    bibleVerse: "She placed the child in it and put it among the reeds along the bank of the Nile.",
    verseRef: "Exodus 2:3",
    quiz: [
      { question: "Where was baby Moses placed?", options: ["In a cave", "In a basket on the river", "In a temple", "On a mountain"], correctIndex: 1 },
      { question: "Who found baby Moses?", options: ["A shepherd", "Pharaoh's daughter", "A fisherman", "His father"], correctIndex: 1 },
      { question: "Why was Moses hidden?", options: ["He was sick", "Pharaoh ordered baby boys killed", "He was lost", "There was a flood"], correctIndex: 1 },
    ],
  },
  {
    id: 11,
    title: "Crossing the Red Sea",
    description: "God parted the Red Sea so Moses and the Israelites could escape",
    youtubeId: "h5Sj-ZotsXw",
    duration: "10 min",
    icon: "🌊",
    gradient: ["#3b82f6", "#2563eb"],
    bibleVerse: "The Lord drove the sea back with a strong east wind.",
    verseRef: "Exodus 14:21",
    quiz: [
      { question: "Who led the Israelites out of Egypt?", options: ["Abraham", "David", "Moses", "Joshua"], correctIndex: 2 },
      { question: "What did God part for the Israelites?", options: ["A mountain", "The Red Sea", "The sky", "A river"], correctIndex: 1 },
      { question: "Who was chasing the Israelites?", options: ["Romans", "Babylonians", "Egyptians", "Philistines"], correctIndex: 2 },
    ],
  },
  {
    id: 12,
    title: "The Ten Commandments",
    description: "God gave Moses ten rules to live by on Mount Sinai",
    youtubeId: "2Kb1_v98As0",
    duration: "9 min",
    icon: "📜",
    gradient: ["#d946ef", "#a21caf"],
    bibleVerse: "You shall have no other gods before me.",
    verseRef: "Exodus 20:3",
    quiz: [
      { question: "Where did Moses receive the Ten Commandments?", options: ["Mount Sinai", "Mount Everest", "Jerusalem", "The temple"], correctIndex: 0 },
      { question: "What were the commandments written on?", options: ["Paper", "Stone tablets", "Wood", "Cloth"], correctIndex: 1 },
      { question: "How many commandments did God give?", options: ["5", "7", "10", "12"], correctIndex: 2 },
    ],
  },
  {
    id: 13,
    title: "Joshua and Jericho",
    description: "The walls of Jericho fell when the Israelites marched and shouted",
    youtubeId: "OAv9rZl2U5g",
    duration: "8 min",
    icon: "🏰",
    gradient: ["#fb923c", "#ea580c"],
    bibleVerse: "By faith the walls of Jericho fell, after the army had marched around them for seven days.",
    verseRef: "Hebrews 11:30",
    quiz: [
      { question: "Who led the Israelites to Jericho?", options: ["Moses", "Joshua", "David", "Samuel"], correctIndex: 1 },
      { question: "How many days did they march around the city?", options: ["3", "5", "7", "10"], correctIndex: 2 },
      { question: "What happened to the walls?", options: ["They grew taller", "They fell down", "They opened", "Nothing"], correctIndex: 1 },
    ],
  },
  {
    id: 14,
    title: "Samson's Strength",
    description: "God gave Samson incredible strength through his hair",
    youtubeId: "C3y4cLHryyk",
    duration: "10 min",
    icon: "💪",
    gradient: ["#ef4444", "#dc2626"],
    bibleVerse: "The Spirit of the Lord came powerfully upon him.",
    verseRef: "Judges 14:6",
    quiz: [
      { question: "Where did Samson's strength come from?", options: ["Food", "Exercise", "God through his hair", "A sword"], correctIndex: 2 },
      { question: "Who tricked Samson into revealing his secret?", options: ["Ruth", "Delilah", "Sarah", "Mary"], correctIndex: 1 },
      { question: "What did Samson push down at the end?", options: ["A wall", "A temple", "A tower", "The pillars of a temple"], correctIndex: 3 },
    ],
  },
  {
    id: 15,
    title: "Ruth and Naomi",
    description: "Ruth's loyalty and love for her mother-in-law Naomi",
    youtubeId: "SDmjO7X8ELI",
    duration: "8 min",
    icon: "🌾",
    gradient: ["#a3e635", "#65a30d"],
    bibleVerse: "Where you go I will go, and where you stay I will stay.",
    verseRef: "Ruth 1:16",
    quiz: [
      { question: "Who was Ruth loyal to?", options: ["Her sister", "Naomi", "The king", "Her friends"], correctIndex: 1 },
      { question: "What did Ruth do to provide food?", options: ["Cooked", "Gathered grain from fields", "Fished", "Hunted"], correctIndex: 1 },
      { question: "Who did Ruth marry?", options: ["David", "Boaz", "Samuel", "Solomon"], correctIndex: 1 },
    ],
  },
  {
    id: 16,
    title: "Solomon's Wisdom",
    description: "King Solomon asked God for wisdom and became the wisest king",
    youtubeId: "ihnnK9vQ3nM",
    duration: "9 min",
    icon: "👑",
    gradient: ["#fbbf24", "#b45309"],
    bibleVerse: "God gave Solomon wisdom and very great insight.",
    verseRef: "1 Kings 4:29",
    quiz: [
      { question: "What did Solomon ask God for?", options: ["Gold", "Power", "Wisdom", "Long life"], correctIndex: 2 },
      { question: "Who was Solomon's father?", options: ["Moses", "Abraham", "David", "Samuel"], correctIndex: 2 },
      { question: "What did Solomon build for God?", options: ["An ark", "A temple", "A wall", "A garden"], correctIndex: 1 },
    ],
  },
  {
    id: 17,
    title: "Elijah on Mount Carmel",
    description: "Elijah challenged the prophets of Baal and proved God's power",
    youtubeId: "vbsbBlaJiCY",
    duration: "10 min",
    icon: "🔥",
    gradient: ["#f97316", "#c2410c"],
    bibleVerse: "The Lord—he is God! The Lord—he is God!",
    verseRef: "1 Kings 18:39",
    quiz: [
      { question: "Who did Elijah challenge?", options: ["The king", "Prophets of Baal", "Soldiers", "Pharaoh"], correctIndex: 1 },
      { question: "What did God send from heaven?", options: ["Rain", "Fire", "Snow", "Wind"], correctIndex: 1 },
      { question: "Where did this happen?", options: ["Mount Sinai", "Mount Carmel", "Jerusalem", "Egypt"], correctIndex: 1 },
    ],
  },
  {
    id: 18,
    title: "Jonah and the Whale",
    description: "Jonah ran from God and was swallowed by a great fish",
    youtubeId: "WOSadLyqshg",
    duration: "8 min",
    icon: "🐋",
    gradient: ["#22d3ee", "#0891b2"],
    bibleVerse: "The Lord provided a huge fish to swallow Jonah.",
    verseRef: "Jonah 1:17",
    quiz: [
      { question: "Where did God tell Jonah to go?", options: ["Egypt", "Nineveh", "Jerusalem", "Babylon"], correctIndex: 1 },
      { question: "What swallowed Jonah?", options: ["A shark", "A great fish", "A whale", "A serpent"], correctIndex: 1 },
      { question: "How long was Jonah inside the fish?", options: ["1 day", "2 days", "3 days", "7 days"], correctIndex: 2 },
    ],
  },
  {
    id: 19,
    title: "Shadrach, Meshach & Abednego",
    description: "Three brave men survived the fiery furnace by God's protection",
    youtubeId: "93yhpb-hFJ0",
    duration: "9 min",
    icon: "🔥",
    gradient: ["#e11d48", "#be123c"],
    bibleVerse: "The God we serve is able to deliver us from the blazing furnace.",
    verseRef: "Daniel 3:17",
    quiz: [
      { question: "Why were they thrown into the furnace?", options: ["They stole", "They refused to bow to an idol", "They ran away", "They lied"], correctIndex: 1 },
      { question: "How many men did the king see in the fire?", options: ["3", "4", "5", "2"], correctIndex: 1 },
      { question: "What happened to the three men?", options: ["They burned", "They escaped", "God protected them", "They hid"], correctIndex: 2 },
    ],
  },
];

/* ───────── NEW TESTAMENT LESSONS ───────── */
const ntLessons: Lesson[] = [
  {
    id: 101,
    title: "Birth of Jesus",
    description: "The miraculous birth of our Savior in Bethlehem",
    youtubeId: "b930eTsJJNA",
    duration: "11 min",
    icon: "⭐",
    gradient: ["#6366f1", "#4f46e5"],
    bibleVerse: "For unto you is born this day a Savior, who is Christ the Lord.",
    verseRef: "Luke 2:11",
    quiz: [
      { question: "Where was Jesus born?", options: ["Jerusalem", "Nazareth", "Bethlehem", "Egypt"], correctIndex: 2 },
      { question: "Who was Jesus' mother?", options: ["Martha", "Mary", "Ruth", "Sarah"], correctIndex: 1 },
      { question: "Who visited baby Jesus following a star?", options: ["Shepherds", "Wise Men", "Soldiers", "Angels"], correctIndex: 1 },
    ],
  },
  {
    id: 102,
    title: "Jesus' Baptism",
    description: "John the Baptist baptized Jesus in the River Jordan",
    youtubeId: "tFOxR96WsdE",
    duration: "7 min",
    icon: "💧",
    gradient: ["#0ea5e9", "#0369a1"],
    bibleVerse: "This is my Son, whom I love; with him I am well pleased.",
    verseRef: "Matthew 3:17",
    quiz: [
      { question: "Who baptized Jesus?", options: ["Peter", "John the Baptist", "Paul", "Moses"], correctIndex: 1 },
      { question: "Where was Jesus baptized?", options: ["Red Sea", "River Jordan", "Sea of Galilee", "A pool"], correctIndex: 1 },
      { question: "What came down from heaven after baptism?", options: ["Fire", "Rain", "The Holy Spirit like a dove", "An angel"], correctIndex: 2 },
    ],
  },
  {
    id: 103,
    title: "The Good Samaritan",
    description: "Jesus teaches us to love and help everyone",
    youtubeId: "osfQg4yKtq8",
    duration: "7 min",
    icon: "❤️",
    gradient: ["#10b981", "#059669"],
    bibleVerse: "Love your neighbor as yourself.",
    verseRef: "Luke 10:27",
    quiz: [
      { question: "Who told the story of the Good Samaritan?", options: ["Moses", "David", "Jesus", "Paul"], correctIndex: 2 },
      { question: "Who helped the injured man?", options: ["A priest", "A Levite", "A Samaritan", "A soldier"], correctIndex: 2 },
      { question: "What does this story teach us?", options: ["To be rich", "To help everyone", "To travel", "To fight"], correctIndex: 1 },
    ],
  },
  {
    id: 104,
    title: "Jesus Feeds 5000",
    description: "Jesus multiplied five loaves and two fish to feed thousands",
    youtubeId: "jMjcD6TO-II",
    duration: "8 min",
    icon: "🍞",
    gradient: ["#f59e0b", "#d97706"],
    bibleVerse: "They all ate and were satisfied.",
    verseRef: "Matthew 14:20",
    quiz: [
      { question: "How many loaves of bread were there?", options: ["2", "3", "5", "7"], correctIndex: 2 },
      { question: "How many fish were there?", options: ["1", "2", "3", "5"], correctIndex: 1 },
      { question: "How many people were fed?", options: ["100", "1000", "5000", "500"], correctIndex: 2 },
    ],
  },
  {
    id: 105,
    title: "Jesus Walks on Water",
    description: "Jesus walked on the sea during a storm",
    youtubeId: "hLt-Tnhdxxo",
    duration: "7 min",
    icon: "🌊",
    gradient: ["#06b6d4", "#0284c7"],
    bibleVerse: "Take courage! It is I. Don't be afraid.",
    verseRef: "Matthew 14:27",
    quiz: [
      { question: "What was happening when Jesus walked on water?", options: ["It was sunny", "There was a storm", "It was night only", "There was a fire"], correctIndex: 1 },
      { question: "Who tried to walk on water too?", options: ["John", "James", "Peter", "Andrew"], correctIndex: 2 },
      { question: "Why did Peter start to sink?", options: ["He was heavy", "He doubted", "The waves were big", "He couldn't swim"], correctIndex: 1 },
    ],
  },
  {
    id: 106,
    title: "The Prodigal Son",
    description: "A father's love welcomes back his lost son",
    youtubeId: "MXaBPy9GMAU",
    duration: "9 min",
    icon: "🏠",
    gradient: ["#8b5cf6", "#7c3aed"],
    bibleVerse: "For this son of mine was dead and is alive again; he was lost and is found.",
    verseRef: "Luke 15:24",
    quiz: [
      { question: "What did the younger son ask his father for?", options: ["Food", "His inheritance", "A job", "A house"], correctIndex: 1 },
      { question: "What happened to the son's money?", options: ["He saved it", "He invested it", "He wasted it all", "He gave it away"], correctIndex: 2 },
      { question: "How did the father react when his son returned?", options: ["He was angry", "He ignored him", "He welcomed him with joy", "He sent him away"], correctIndex: 2 },
    ],
  },
  {
    id: 107,
    title: "Jesus Heals the Blind Man",
    description: "Jesus gave sight to a man born blind",
    youtubeId: "FPB3FnMerYA",
    duration: "8 min",
    icon: "👁️",
    gradient: ["#14b8a6", "#0d9488"],
    bibleVerse: "One thing I do know. I was blind but now I see!",
    verseRef: "John 9:25",
    quiz: [
      { question: "What did Jesus put on the blind man's eyes?", options: ["Water", "Mud", "Oil", "Cloth"], correctIndex: 1 },
      { question: "Where did Jesus tell him to wash?", options: ["River Jordan", "Pool of Siloam", "The sea", "A well"], correctIndex: 1 },
      { question: "What happened after he washed?", options: ["Nothing", "He could see", "He fell asleep", "He got sick"], correctIndex: 1 },
    ],
  },
  {
    id: 108,
    title: "The Lost Sheep",
    description: "A shepherd leaves 99 sheep to find the one that was lost",
    youtubeId: "OM-OATxAGE4",
    duration: "6 min",
    icon: "🐑",
    gradient: ["#84cc16", "#65a30d"],
    bibleVerse: "There will be more rejoicing in heaven over one sinner who repents.",
    verseRef: "Luke 15:7",
    quiz: [
      { question: "How many sheep did the shepherd have?", options: ["50", "80", "100", "200"], correctIndex: 2 },
      { question: "How many sheep were lost?", options: ["1", "2", "5", "10"], correctIndex: 0 },
      { question: "What did the shepherd do when he found the lost sheep?", options: ["Punished it", "Left it", "Rejoiced and celebrated", "Sold it"], correctIndex: 2 },
    ],
  },
  {
    id: 109,
    title: "Zacchaeus",
    description: "A tax collector climbed a tree to see Jesus and changed his life",
    youtubeId: "mhPB2dJcYSs",
    duration: "7 min",
    icon: "🌳",
    gradient: ["#a3e635", "#4d7c0f"],
    bibleVerse: "For the Son of Man came to seek and to save the lost.",
    verseRef: "Luke 19:10",
    quiz: [
      { question: "Why did Zacchaeus climb a tree?", options: ["To hide", "He was too short to see Jesus", "To pick fruit", "For fun"], correctIndex: 1 },
      { question: "What was Zacchaeus' job?", options: ["Farmer", "Fisherman", "Tax collector", "Carpenter"], correctIndex: 2 },
      { question: "What did Zacchaeus promise after meeting Jesus?", options: ["To leave town", "To give half his wealth to the poor", "To become a priest", "To build a temple"], correctIndex: 1 },
    ],
  },
  {
    id: 110,
    title: "The Last Supper",
    description: "Jesus shared a final meal with his disciples",
    youtubeId: "EGFcHLU0ZGU",
    duration: "9 min",
    icon: "🍷",
    gradient: ["#a855f7", "#7e22ce"],
    bibleVerse: "Do this in remembrance of me.",
    verseRef: "Luke 2:19",
    quiz: [
      { question: "How many disciples were at the Last Supper?", options: ["10", "11", "12", "13"], correctIndex: 2 },
      { question: "What did the bread represent?", options: ["Food", "Jesus' body", "A gift", "Wealth"], correctIndex: 1 },
      { question: "Who betrayed Jesus?", options: ["Peter", "John", "Judas", "Thomas"], correctIndex: 2 },
    ],
  },
  {
    id: 111,
    title: "Jesus on the Cross",
    description: "Jesus gave His life on the cross to save us all",
    youtubeId: "HL8bT3MJKRY",
    duration: "10 min",
    icon: "✝️",
    gradient: ["#dc2626", "#991b1b"],
    bibleVerse: "For God so loved the world that he gave his one and only Son.",
    verseRef: "John 3:16",
    quiz: [
      { question: "Where was Jesus crucified?", options: ["Mount Sinai", "Golgotha", "Bethlehem", "Nazareth"], correctIndex: 1 },
      { question: "Why did Jesus die on the cross?", options: ["He was punished", "To save us from sin", "He was weak", "He gave up"], correctIndex: 1 },
      { question: "What happened to the sky when Jesus died?", options: ["It rained", "It became dark", "A rainbow appeared", "Nothing"], correctIndex: 1 },
    ],
  },
  {
    id: 112,
    title: "Jesus' Resurrection",
    description: "Jesus rose from the dead on the third day!",
    youtubeId: "OFz4cJrjSxA",
    duration: "9 min",
    icon: "🌅",
    gradient: ["#fbbf24", "#b45309"],
    bibleVerse: "He is not here; he has risen, just as he said.",
    verseRef: "Matthew 28:6",
    quiz: [
      { question: "How many days after his death did Jesus rise?", options: ["1", "2", "3", "7"], correctIndex: 2 },
      { question: "Who first discovered the empty tomb?", options: ["Peter", "Women/Mary Magdalene", "John", "The soldiers"], correctIndex: 1 },
      { question: "What did the angel say?", options: ["Go away", "He has risen", "Wait here", "Be quiet"], correctIndex: 1 },
    ],
  },
  {
    id: 113,
    title: "Jesus Ascends to Heaven",
    description: "Jesus returned to heaven after appearing to his disciples",
    youtubeId: "K8TxMYOgYCw",
    duration: "7 min",
    icon: "☁️",
    gradient: ["#38bdf8", "#0284c7"],
    bibleVerse: "He was taken up before their very eyes, and a cloud hid him from their sight.",
    verseRef: "Acts 1:9",
    quiz: [
      { question: "Where did Jesus go after resurrection?", options: ["To a city", "To heaven", "To the temple", "To Egypt"], correctIndex: 1 },
      { question: "How many days after resurrection did Jesus ascend?", options: ["7", "20", "40", "50"], correctIndex: 2 },
      { question: "What did Jesus promise before leaving?", options: ["Gold", "The Holy Spirit", "A kingdom", "Food"], correctIndex: 1 },
    ],
  },
  {
    id: 114,
    title: "Day of Pentecost",
    description: "The Holy Spirit came upon the disciples with power",
    youtubeId: "ixD1dYM5bMo",
    duration: "8 min",
    icon: "🔥",
    gradient: ["#f97316", "#c2410c"],
    bibleVerse: "They were all filled with the Holy Spirit.",
    verseRef: "Acts 2:4",
    quiz: [
      { question: "What appeared over the disciples' heads?", options: ["Stars", "Tongues of fire", "Halos", "Birds"], correctIndex: 1 },
      { question: "What could the disciples suddenly do?", options: ["Fly", "Speak in different languages", "Become invisible", "Heal themselves"], correctIndex: 1 },
      { question: "How many people believed that day?", options: ["100", "500", "3000", "5000"], correctIndex: 2 },
    ],
  },
  {
    id: 115,
    title: "Paul's Conversion",
    description: "Saul met Jesus on the road to Damascus and became Paul",
    youtubeId: "dp_28q5FHUY",
    duration: "9 min",
    icon: "⚡",
    gradient: ["#e879f9", "#a21caf"],
    bibleVerse: "He is a chosen instrument of mine to carry my name.",
    verseRef: "Acts 9:15",
    quiz: [
      { question: "What was Paul's name before his conversion?", options: ["Simon", "Saul", "Samuel", "Seth"], correctIndex: 1 },
      { question: "What happened to Saul on the road?", options: ["He fell asleep", "A bright light blinded him", "It rained", "He found gold"], correctIndex: 1 },
      { question: "What did Paul do after his conversion?", options: ["Went home", "Preached about Jesus", "Became a farmer", "Hid away"], correctIndex: 1 },
    ],
  },
];

/* ───────── COMPONENT ───────── */
export default function SundaySchoolScreen() {
  const router = useRouter();
  const { theme } = useAppTheme();
  const st = createStyles(theme);

  const [activeTab, setActiveTab] = useState<"ot" | "nt">("ot");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [completedLessons, setCompletedLessons] = useState<number[]>([]);
  const [videoEnded, setVideoEnded] = useState<Record<number, boolean>>({});

  // quiz state
  const [activeQuiz, setActiveQuiz] = useState<number | null>(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [quizDone, setQuizDone] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  // celebration animation refs
  const particles = useRef(makeParticles()).current;
  const fallAnims = useRef(particles.map(() => new Animated.Value(-80))).current;
  const opacityAnims = useRef(particles.map(() => new Animated.Value(0))).current;

  const triggerCelebration = useCallback(() => {
    setShowCelebration(true);
    // reset
    fallAnims.forEach((a) => a.setValue(-80));
    opacityAnims.forEach((a) => a.setValue(0));

    const anims = particles.map((p, i) =>
      Animated.sequence([
        Animated.delay(p.delay),
        Animated.parallel([
          Animated.timing(fallAnims[i], {
            toValue: SCREEN_H + 40,
            duration: 2200 + Math.random() * 800,
            useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.timing(opacityAnims[i], {
              toValue: 1,
              duration: 200,
              useNativeDriver: true,
            }),
            Animated.delay(1600),
            Animated.timing(opacityAnims[i], {
              toValue: 0,
              duration: 400,
              useNativeDriver: true,
            }),
          ]),
        ]),
      ])
    );

    Animated.parallel(anims).start(() => setShowCelebration(false));
  }, []);

  const currentLessons = activeTab === "ot" ? otLessons : ntLessons;
  const allLessons = [...otLessons, ...ntLessons];

  /* helpers */
  const toggleLesson = (id: number) => {
    setExpandedId((prev) => (prev === id ? null : id));
    setPlayingId(null);
  };

  const startQuiz = (lessonId: number) => {
    setActiveQuiz(lessonId);
    setCurrentQ(0);
    setSelected(null);
    setScore(0);
    setQuizDone(false);
  };

  const closeQuiz = () => {
    setActiveQuiz(null);
    setCurrentQ(0);
    setSelected(null);
    setScore(0);
    setQuizDone(false);
  };

  const handleAnswer = (idx: number, lesson: Lesson) => {
    if (selected !== null) return;
    setSelected(idx);
    const correct = idx === lesson.quiz[currentQ].correctIndex;
    if (correct) setScore((s) => s + 1);

    setTimeout(() => {
      if (currentQ + 1 < lesson.quiz.length) {
        setCurrentQ((q) => q + 1);
        setSelected(null);
      } else {
        const finalScore = correct ? score + 1 : score;
        setQuizDone(true);
        if (!completedLessons.includes(lesson.id)) {
          setCompletedLessons((prev) => [...prev, lesson.id]);
        }
        // trigger celebration if perfect score
        if (finalScore === lesson.quiz.length) {
          triggerCelebration();
        }
      }
    }, 1000);
  };

  const progress = completedLessons.length;
  const total = allLessons.length;

  const switchTab = (tab: "ot" | "nt") => {
    setActiveTab(tab);
    setExpandedId(null);
    setPlayingId(null);
    closeQuiz();
  };

  /* ───── render helpers ───── */
  const renderQuizArea = (lesson: Lesson) => {
    const isQuizActive = activeQuiz === lesson.id;
    const hasEnded = videoEnded[lesson.id];
    const isDone = completedLessons.includes(lesson.id);
    const unlocked = hasEnded || isDone;

    if (!isQuizActive) {
      return (
        <Pressable
          style={[st.quizBtn, !unlocked && st.quizBtnLocked]}
          onPress={() => unlocked && startQuiz(lesson.id)}
        >
          <LinearGradient
            colors={unlocked ? ["#a78bfa", "#8b5cf6"] : ["#6b7280", "#4b5563"]}
            style={st.quizBtnGrad}
          >
            <Ionicons name="help-circle" size={22} color="#fff" />
            <Text style={st.quizBtnLabel}>
              {isDone ? "Retake Quiz" : unlocked ? "Take the Quiz!" : "Watch video to unlock quiz"}
            </Text>
          </LinearGradient>
        </Pressable>
      );
    }

    if (!quizDone) {
      const q = lesson.quiz[currentQ];
      return (
        <View style={st.quizCard}>
          <View style={st.quizTopRow}>
            <Text style={st.quizProg}>
              Question {currentQ + 1}/{lesson.quiz.length}
            </Text>
            <Pressable onPress={closeQuiz}>
              <Ionicons name="close-circle" size={24} color="#f87171" />
            </Pressable>
          </View>

          <View style={st.qBarBg}>
            <View style={[st.qBarFill, { width: `${((currentQ + 1) / lesson.quiz.length) * 100}%` }]} />
          </View>

          <Text style={st.qText}>{q.question}</Text>

          {q.options.map((opt, idx) => {
            let bg = st.optDef;
            if (selected !== null) {
              if (idx === q.correctIndex) bg = st.optOk;
              else if (idx === selected) bg = st.optBad;
            }
            return (
              <Pressable
                key={idx}
                onPress={() => handleAnswer(idx, lesson)}
                style={[st.optBtn, bg]}
              >
                <Text style={st.optLetter}>{String.fromCharCode(65 + idx)}</Text>
                <Text style={st.optLabel}>{opt}</Text>
                {selected !== null && idx === q.correctIndex && (
                  <Ionicons name="checkmark-circle" size={20} color="#22c55e" />
                )}
                {selected === idx && idx !== q.correctIndex && (
                  <Ionicons name="close-circle" size={20} color="#ef4444" />
                )}
              </Pressable>
            );
          })}
        </View>
      );
    }

    // results
    const emoji = score === lesson.quiz.length ? "🏆" : score >= 2 ? "⭐" : "💪";
    const msg = score === lesson.quiz.length ? "Perfect Score!" : score >= 2 ? "Great Job!" : "Keep Learning!";
    return (
      <View style={st.resCard}>
        <Text style={st.resEmoji}>{emoji}</Text>
        <Text style={st.resTitle}>{msg}</Text>
        <Text style={st.resScore}>{score}/{lesson.quiz.length} Correct</Text>
        <View style={st.resRow}>
          <Pressable style={st.retryBtn} onPress={() => startQuiz(lesson.id)}>
            <Ionicons name="refresh" size={16} color="#fff" />
            <Text style={st.btnLabel}>Retry</Text>
          </Pressable>
          <Pressable style={st.doneBtn} onPress={closeQuiz}>
            <Ionicons name="checkmark" size={16} color="#fff" />
            <Text style={st.btnLabel}>Done</Text>
          </Pressable>
        </View>
      </View>
    );
  };

  /* ───────── JSX ───────── */
  return (
    <View style={{ flex: 1 }}>
      <LinearGradient colors={["#0a0a1a", "#0f0f2e", "#0a0a1a"]} style={StyleSheet.absoluteFillObject} />

      <SafeAreaView style={{ flex: 1, backgroundColor: "transparent" }}>
        <StatusBar translucent barStyle="light-content" backgroundColor="transparent" />

        {/* Header */}
        <ReAnimated.View entering={FadeInDown.duration(600)}>
          <View style={st.header}>
            <Pressable onPress={() => router.back()} style={({ pressed }) => [st.backBtn, pressed && { opacity: 0.7 }]}>
              <Ionicons name="arrow-back" size={22} color="#e2e8f0" />
            </Pressable>
            <View style={st.headerCenter}>
              <Text style={st.headerTitle}>📖 Bible Learning & Quizes</Text>
              <Text style={st.headerSub}>Learn the Bible with Fun!</Text>
            </View>
            <View style={{ width: 40 }} />
          </View>
        </ReAnimated.View>

        {/* Progress */}
        <View style={st.progWrap}>
          <View style={st.progRow}>
            <Ionicons name="trophy" size={18} color="#a78bfa" />
            <Text style={st.progLabel}>{progress}/{total} Lessons Completed</Text>
          </View>
          <View style={st.progBg}>
            <LinearGradient
              colors={["#a78bfa", "#8b5cf6"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[st.progFill, { width: `${(progress / total) * 100}%` }]}
            />
          </View>
        </View>

        {/* Tab Selector */}
        <View style={st.tabRow}>
          <Pressable
            style={[st.tabBtn, activeTab === "ot" && st.tabActive]}
            onPress={() => switchTab("ot")}
          >
            <Text style={[st.tabText, activeTab === "ot" && st.tabTextActive]}>
              📜 Old Testament ({otLessons.length})
            </Text>
          </Pressable>
          <Pressable
            style={[st.tabBtn, activeTab === "nt" && st.tabActive]}
            onPress={() => switchTab("nt")}
          >
            <Text style={[st.tabText, activeTab === "nt" && st.tabTextActive]}>
              ✝️ New Testament ({ntLessons.length})
            </Text>
          </Pressable>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
          {/* Verse of the Day */}
          <View style={st.verseCard}>
            <Text style={st.verseBadge}>📜 Today&apos;s Verse</Text>
            <Text style={st.verseBody}>
              {activeTab === "ot"
                ? '"Train up a child in the way he should go; even when he is old he will not depart from it."'
                : '"Jesus said, \'Let the little children come to me, and do not hinder them, for the kingdom of heaven belongs to such as these.\'"'}
            </Text>
            <Text style={st.verseRef}>
              {activeTab === "ot" ? "— Proverbs 22:6" : "— Matthew 19:14"}
            </Text>
          </View>

          {/* Section Header */}
          <View style={st.sectionHeader}>
            <Text style={st.sectionHeaderText}>
              {activeTab === "ot" ? "📖 Old Testament Stories" : "✨ New Testament Stories"}
            </Text>
            <Text style={st.sectionHeaderSub}>
              {activeTab === "ot"
                ? `${otLessons.length} lessons from Genesis to Malachi`
                : `${ntLessons.length} lessons about Jesus and the Early Church`}
            </Text>
          </View>

          {/* Lessons */}
          {currentLessons.map((lesson, index) => {
            const isOpen = expandedId === lesson.id;
            const isDone = completedLessons.includes(lesson.id);
            const hasEnded = videoEnded[lesson.id];

            // Sequential unlock: first lesson always unlocked, rest need previous lesson completed
            const isUnlocked =
              index === 0 || completedLessons.includes(currentLessons[index - 1].id);

            return (
              <View key={lesson.id} style={st.lessonWrap}>
                {/* Card Header */}
                <Pressable
                  onPress={() => isUnlocked && toggleLesson(lesson.id)}
                  style={{ opacity: isUnlocked ? 1 : 0.5 }}
                >
                  <LinearGradient
                    colors={isUnlocked ? lesson.gradient : ["#4b5563", "#374151"]}
                    style={st.lessonCard}
                  >
                    <View style={st.lessonRow}>
                      <Text style={st.lessonEmoji}>
                        {isUnlocked ? lesson.icon : "🔒"}
                      </Text>
                      <View style={{ flex: 1, marginLeft: 12 }}>
                        <View style={st.titleRow}>
                          <Text style={st.lessonTitle}>{lesson.title}</Text>
                          {isDone && (
                            <View style={st.doneBadge}>
                              <Ionicons name="checkmark-circle" size={16} color="#22c55e" />
                              <Text style={st.doneLabel}>Done</Text>
                            </View>
                          )}
                          {!isUnlocked && (
                            <View style={st.lockBadge}>
                              <Ionicons name="lock-closed" size={12} color="#a78bfa" />
                              <Text style={st.lockLabel}>Locked</Text>
                            </View>
                          )}
                        </View>
                        <Text style={st.lessonDesc}>
                          {isUnlocked
                            ? lesson.description
                            : "Complete the previous lesson to unlock"}
                        </Text>
                        <View style={st.metaRow}>
                          <Ionicons name="time-outline" size={12} color="rgba(255,255,255,0.7)" />
                          <Text style={st.metaLabel}>{lesson.duration}</Text>
                        </View>
                      </View>
                      <Ionicons
                        name={!isUnlocked ? "lock-closed" : isOpen ? "chevron-up" : "chevron-down"}
                        size={20}
                        color="#fff"
                      />
                    </View>
                  </LinearGradient>
                </Pressable>

                {/* Expanded */}
                {isOpen && isUnlocked && (
                  <View style={st.expanded}>
                    {/* Bible verse */}
                    <View style={st.bvBox}>
                      <Ionicons name="book" size={16} color="#a78bfa" />
                      <View style={{ flex: 1, marginLeft: 8 }}>
                        <Text style={st.bvText}>{`"${lesson.bibleVerse}"`}</Text>
                        <Text style={st.bvRef}>— {lesson.verseRef}</Text>
                      </View>
                    </View>

                    {/* Video */}
                    <Text style={st.secLabel}>🎬 Watch the Story</Text>
                    <View style={st.vidWrap}>
                      <YoutubeIframe
                        height={200}
                        play={playingId === lesson.youtubeId}
                        videoId={lesson.youtubeId}
                        onChangeState={(state: string) => {
                          if (state === "ended") {
                            setPlayingId(null);
                            setVideoEnded((p) => ({ ...p, [lesson.id]: true }));
                          }
                          if (state === "paused") {
                            setPlayingId(null);
                          }
                          if (state === "playing") {
                            setPlayingId(lesson.youtubeId);
                          }
                        }}
                      />
                    </View>

                    {/* Quiz */}
                    <View style={{ marginTop: 16 }}>{renderQuizArea(lesson)}</View>
                  </View>
                )}
              </View>
            );
          })}
        </ScrollView>
      </SafeAreaView>

      {/* 🎉 Celebration overlay */}
      {showCelebration && (
        <View style={st.celebOverlay} pointerEvents="none">
          {particles.map((p, i) => (
            <Animated.Text
              key={p.id}
              style={[
                st.celebParticle,
                {
                  left: p.x,
                  fontSize: p.size,
                  transform: [{ translateY: fallAnims[i] }],
                  opacity: opacityAnims[i],
                },
              ]}
            >
              {p.emoji}
            </Animated.Text>
          ))}

          {/* Big center message */}
          <Animated.View style={st.celebCenter}>
            <Text style={st.celebTitle}>🎉 Perfect! 🎉</Text>
            <Text style={st.celebSub}>You got all answers right!</Text>
          </Animated.View>
        </View>
      )}
    </View>
  );
}

/* ───────── STYLES ───────── */
const createStyles = (theme: AppTheme) => StyleSheet.create({
  header: { flexDirection: "row", justifyContent: "space-between", padding: 16, alignItems: "center", borderBottomWidth: 1, borderBottomColor: theme.border },
  backBtn: { width: 40, height: 40, borderRadius: 14, backgroundColor: theme.surfaceMuted, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: theme.border },
  headerCenter: { alignItems: "center" },
  headerTitle: { fontSize: 22, fontWeight: "900", color: theme.text, letterSpacing: -0.3 },
  headerSub: { fontSize: 12, color: theme.textMuted, marginTop: 2 },
  progWrap: { paddingHorizontal: 16, marginBottom: 8 },
  progRow: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 6 },
  progLabel: { color: "#a78bfa", fontSize: 13, fontWeight: "600" },
  progBg: { height: 8, backgroundColor: theme.border, borderRadius: 4, overflow: "hidden" },
  progFill: { height: 8, borderRadius: 4 },
  verseCard: { backgroundColor: theme.surface, borderRadius: 16, padding: 16, marginBottom: 20, borderWidth: 1, borderColor: theme.border },
  verseBadge: { fontSize: 12, fontWeight: "700", color: "#a78bfa", marginBottom: 8 },
  verseBody: { fontSize: 14, color: theme.textSecondary, fontStyle: "italic", lineHeight: 22 },
  verseRef: { fontSize: 12, color: theme.textMuted, marginTop: 8, textAlign: "right" },
  lessonWrap: { marginBottom: 16 },
  lessonCard: { borderRadius: 16, padding: 16 },
  lessonRow: { flexDirection: "row", alignItems: "center" },
  lessonEmoji: { fontSize: 32 },
  titleRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  lessonTitle: { fontSize: 16, fontWeight: "700", color: theme.textSecondary },
  lessonDesc: { fontSize: 12, color: theme.textMuted, marginTop: 2 },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 6 },
  metaLabel: { fontSize: 11, color: theme.textMuted },
  doneBadge: { flexDirection: "row", alignItems: "center", gap: 3, backgroundColor: "rgba(34,197,94,0.2)", borderRadius: 8, paddingHorizontal: 6, paddingVertical: 2 },
  doneLabel: { fontSize: 10, color: "#22c55e", fontWeight: "600" },
  lockBadge: { flexDirection: "row", alignItems: "center", gap: 3, backgroundColor: "rgba(167,139,250,0.15)", borderRadius: 8, paddingHorizontal: 6, paddingVertical: 2 },
  lockLabel: { fontSize: 10, color: "#a78bfa", fontWeight: "600" },
  expanded: { backgroundColor: theme.surface, borderBottomLeftRadius: 16, borderBottomRightRadius: 16, padding: 16, marginTop: -8, borderWidth: 1, borderTopWidth: 0, borderColor: theme.border },
  bvBox: { flexDirection: "row", backgroundColor: "rgba(167,139,250,0.08)", borderRadius: 12, padding: 12, marginBottom: 16, borderLeftWidth: 3, borderLeftColor: "#a78bfa" },
  bvText: { fontSize: 13, color: theme.textSecondary, fontStyle: "italic", lineHeight: 20 },
  bvRef: { fontSize: 11, color: "#a78bfa", marginTop: 4 },
  secLabel: { fontSize: 14, fontWeight: "700", color: theme.textSecondary, marginBottom: 10 },
  vidWrap: { backgroundColor: "#000", borderRadius: 12, overflow: "hidden" },
  quizBtn: { borderRadius: 12, overflow: "hidden" },
  quizBtnLocked: { opacity: 0.6 },
  quizBtnGrad: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 14, borderRadius: 12 },
  quizBtnLabel: { fontSize: 15, fontWeight: "700", color: "#fff" },
  quizCard: { backgroundColor: theme.surface, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: theme.border },
  quizTopRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  quizProg: { fontSize: 13, fontWeight: "600", color: "#a78bfa" },
  qBarBg: { height: 4, backgroundColor: theme.border, borderRadius: 2, marginBottom: 16 },
  qBarFill: { height: 4, backgroundColor: "#a78bfa", borderRadius: 2 },
  qText: { fontSize: 16, fontWeight: "700", color: theme.textSecondary, marginBottom: 16, lineHeight: 24 },
  optBtn: { flexDirection: "row", alignItems: "center", padding: 14, borderRadius: 12, marginBottom: 10, borderWidth: 1 },
  optDef: { backgroundColor: theme.surfaceMuted, borderColor: theme.border },
  optOk: { backgroundColor: "rgba(34,197,94,0.15)", borderColor: "#22c55e" },
  optBad: { backgroundColor: "rgba(239,68,68,0.15)", borderColor: "#ef4444" },
  optLetter: { width: 28, height: 28, borderRadius: 14, backgroundColor: theme.border, textAlign: "center", lineHeight: 28, fontSize: 13, fontWeight: "700", color: theme.textSecondary, marginRight: 12, overflow: "hidden" },
  optLabel: { flex: 1, fontSize: 14, color: theme.textSecondary },
  resCard: { backgroundColor: theme.surface, borderRadius: 16, padding: 24, alignItems: "center", borderWidth: 1, borderColor: theme.border },
  resEmoji: { fontSize: 48, marginBottom: 8 },
  resTitle: { fontSize: 22, fontWeight: "800", color: theme.text, marginBottom: 4 },
  resScore: { fontSize: 16, color: "#a78bfa", fontWeight: "600", marginBottom: 16 },
  resRow: { flexDirection: "row", gap: 12 },
  retryBtn: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "#a78bfa", borderRadius: 10, paddingHorizontal: 20, paddingVertical: 10 },
  doneBtn: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "#059669", borderRadius: 10, paddingHorizontal: 20, paddingVertical: 10 },
  btnLabel: { color: "#fff", fontWeight: "600", fontSize: 14 },
  tabRow: { flexDirection: "row", paddingHorizontal: 16, marginBottom: 4, gap: 8 },
  tabBtn: { flex: 1, paddingVertical: 12, borderRadius: 12, backgroundColor: theme.surface, alignItems: "center", borderWidth: 1, borderColor: theme.border },
  tabActive: { backgroundColor: "rgba(167,139,250,0.15)", borderWidth: 1, borderColor: "rgba(167,139,250,0.3)" },
  tabText: { fontSize: 13, fontWeight: "600", color: theme.textMuted },
  tabTextActive: { color: "#fff" },
  sectionHeader: { marginBottom: 16 },
  sectionHeaderText: { fontSize: 18, fontWeight: "800", color: theme.textSecondary },
  sectionHeaderSub: { fontSize: 12, color: theme.textMuted, marginTop: 4 },
  celebOverlay: { ...StyleSheet.absoluteFillObject, zIndex: 999 },
  celebParticle: { position: "absolute", top: 0 },
  celebCenter: { position: "absolute", top: "35%", alignSelf: "center", alignItems: "center", backgroundColor: theme.surfaceElevated, borderRadius: 24, paddingHorizontal: 32, paddingVertical: 24, borderWidth: 2, borderColor: "#a78bfa" },
  celebTitle: { fontSize: 28, fontWeight: "900", color: "#a78bfa", textAlign: "center" },
  celebSub: { fontSize: 14, color: theme.textSecondary, marginTop: 6, textAlign: "center" },
});
