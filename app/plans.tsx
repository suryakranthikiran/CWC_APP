import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Linking,
    Pressable,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    View
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import type { AppTheme } from "../src/theme/colors";
import { useAppTheme } from "../src/theme/ThemeProvider";

interface Plan {
  id: string;
  title: string;
  icon: string;
  color: string;
  references: {
    book: string;
    chapter: number;
    verse: number;
    text: string;
    explanation: string;
  }[];
}

// YouTube video mapping for each plan
const YOUTUBE_VIDEOS: { [key: string]: string } = {
  love: "https://www.youtube.com/watch?v=SZseFX0XU3Q",
  healing: "https://www.youtube.com/watch?v=kJIBhn9Blns",
  hope: "https://www.youtube.com/watch?v=mQ8k7MyedRI&t=220s",
  anxiety: "https://www.youtube.com/watch?v=UJb0_Rqm8_E",
  anger: "https://www.youtube.com/watch?v=mmqcIeEubw8",
  depression: "https://www.youtube.com/watch?v=0NFjmv2maRA",
  fear: "https://www.youtube.com/watch?v=3VYtbPxJ45g",
  peace: "https://www.youtube.com/watch?v=37b70I8eGE0",
  stress: "https://www.youtube.com/watch?v=QC_Ew5eMFgo",
  patience: "https://www.youtube.com/watch?v=Xn9fJ0CiqnE",
  loss: "https://www.youtube.com/watch?v=2prwjnT8aq8",
  jealousy: "https://www.youtube.com/watch?v=TtnrysJu5L8&t=1s",
  joy: "https://www.youtube.com/watch?v=l82pu50ef2E&t=10s",
  temptation: "https://www.youtube.com/watch?v=F-X5gF3OLtE",
  pride: "https://www.youtube.com/watch?v=cO-xzI64Lg4",
  doubt: "https://www.youtube.com/watch?v=Xn9fJ0CiqnE&t=9s",
};

const PLANS: Plan[] = [
  {
    id: "love",
    title: "Love",
    icon: "heart",
    color: "#ec4899",
    references: [
      {
        book: "1 John",
        chapter: 4,
        verse: 7,
        text: "Beloved, let us love one another: for love is of God",
        explanation: "This beautiful passage reminds us that love is not merely a human emotion, but a divine gift from God Himself. When we love one another, we are reflecting God's character and fulfilling His greatest commandment. Love transcends prejudice, heals broken relationships, and builds strong communities united by compassion and understanding.",
      },
      {
        book: "1 Corinthians",
        chapter: 13,
        verse: 4,
        text: "Charity suffereth long, and is kind",
        explanation: "True love is patient and enduring, never quick to anger or judgment. This verse teaches us that genuine love displays kindness even in difficult circumstances. It calls us to be gentle with others, to bear one another's burdens with grace, and to respond to conflict with compassion rather than retaliation.",
      },
      {
        book: "John",
        chapter: 13,
        verse: 34,
        text: "A new commandment I give unto you, That ye love one another",
        explanation: "Jesus established love as the new covenant principle that supersedes all other laws. By loving one another as Christ loved us—sacrificially and unconditionally—we become witnesses to His gospel. This commandment transforms how we relate to each other and builds the foundation of Christian community.",
      },
    ],
  },
  {
    id: "healing",
    title: "Healing",
    icon: "heart",
    color: "#10b981",
    references: [
      {
        book: "Psalms",
        chapter: 147,
        verse: 3,
        text: "He healeth the broken in heart, and bindeth up their wounds",
        explanation: "God is the ultimate physician of our souls. When life's pain and disappointment leave us broken, the Lord gently tenderly restores us. Just as a healer bandages physical wounds to stop the bleeding and promote recovery, God comforts our deepest emotional and spiritual hurts with His loving care and divine restoration.",
      },
      {
        book: "Proverbs",
        chapter: 17,
        verse: 22,
        text: "A merry heart doeth good like a medicine",
        explanation: "Joy and gratitude are powerful forces for healing. When we choose to maintain a positive spirit and grateful heart, we unlock the body's natural ability to heal and recover. A cheerful disposition strengthens our immune system, lifts our spirits, and invites God's healing presence into every aspect of our being.",
      },
      {
        book: "1 Peter",
        chapter: 2,
        verse: 24,
        text: "By whose stripes ye were healed",
        explanation: "Through Christ's suffering and sacrifice on the cross, complete healing—spiritual, emotional, and physical—becomes available to all who believe. His wounds become our remedy, His pain our deliverance. This profound truth assures us that no matter what we face, healing and wholeness are found in surrendering to Jesus' redemptive power.",
      },
    ],
  },
  {
    id: "hope",
    title: "Hope",
    icon: "sunny",
    color: "#f59e0b",
    references: [
      {
        book: "Romans",
        chapter: 15,
        verse: 13,
        text: "Now the God of hope fill you with all joy and peace in believing",
        explanation: "Hope is not wishful thinking but absolute confidence in God's faithfulness and goodness. When we believe in His promises and trust in His plan, He fills our hearts with supernatural joy and peace that defies our circumstances. This hope becomes an anchor during storms, reminding us that God is in control and working all things for our good.",
      },
      {
        book: "Psalms",
        chapter: 42,
        verse: 5,
        text: "Why art thou cast down, O my soul? hope thou in God",
        explanation: "Even in depression and despair, we have the power to redirect our thoughts toward God. This verse teaches us that when sadness overwhelms us, we can choose to remember God's character, His past faithfulness, and His promises. Hope is an active choice to trust in His salvation despite our present feelings.",
      },
      {
        book: "Hebrews",
        chapter: 6,
        verse: 19,
        text: "Which hope we have as an anchor of the soul",
        explanation: "Hope in Christ is like an anchor that holds our souls steady when the storms of life rage around us. It keeps us from drifting into despair and gives us stability amidst chaos. This hope is not superficial optimism but a deep spiritual conviction that holds us firm to God's promises and eternal purposes.",
      },
    ],
  },
  {
    id: "anxiety",
    title: "Anxiety",
    icon: "alert-circle",
    color: "#f97316",
    references: [
      {
        book: "Philippians",
        chapter: 4,
        verse: 6,
        text: "Be careful for nothing; but in every thing by prayer and supplication with thanksgiving",
        explanation: "Rather than allowing worry to consume us, God invites us to exchange anxiety for prayer. When concerns arise, we're commanded to bring them before God with gratitude, trusting that He hears and cares. This practice of prayerful thanksgiving actually rewires our minds, shifting our focus from problems to God's provision and faithfulness.",
      },
      {
        book: "1 Peter",
        chapter: 5,
        verse: 7,
        text: "Casting all your care upon him; for he careth for you",
        explanation: "We don't have to carry the weight of our worries alone. God extends His arms to receive every fear, concern, and burden we bear. When we release our anxieties to Him, we experience His tender care and protective love. He is not distant or indifferent but actively engaged in our wellbeing and protection.",
      },
      {
        book: "Matthew",
        chapter: 6,
        verse: 34,
        text: "Take therefore no thought for the morrow",
        explanation: "Jesus teaches us to live in the present moment rather than borrowing trouble from the future. Anxiety often comes from imagining worst-case scenarios that haven't happened. By focusing on today and trusting God for tomorrow, we free ourselves from the paralysis of fear and live with greater peace and purpose.",
      },
    ],
  },
  {
    id: "anger",
    title: "Anger",
    icon: "flame",
    color: "#ef4444",
    references: [
      {
        book: "Ephesians",
        chapter: 4,
        verse: 26,
        text: "Be ye angry, and sin not: let not the sun go down upon your wrath",
        explanation: "Anger itself is not sinful—it's how we handle it that matters. God permits us to feel anger at injustice and wrongdoing, but He calls us to resolve it before day's end. Holding onto anger overnight allows it to fester and poison our hearts. Quick resolution and forgiveness prevent bitterness from taking root.",
      },
      {
        book: "Proverbs",
        chapter: 15,
        verse: 1,
        text: "A soft answer turneth away wrath",
        explanation: "Words have tremendous power. When met with a gentle response, even intense anger can be diffused. By choosing calm, kind words instead of harsh retaliation, we demonstrate wisdom and maturity. This approach not only protects relationships but often transforms conflict into understanding and reconciliation.",
      },
      {
        book: "James",
        chapter: 1,
        verse: 19,
        text: "Wherefore, my beloved brethren, let every man be swift to hear, slow to speak, slow to wrath",
        explanation: "Wisdom begins with listening more than speaking and with patience more than reaction. When we slow down to truly hear others' perspectives and feelings before responding, we prevent hasty words born of anger. This measured approach leads to better communication, deeper understanding, and more peaceful resolution of conflicts.",
      },
    ],
  },
  {
    id: "depression",
    title: "Depression",
    icon: "cloudy",
    color: "#6366f1",
    references: [
      {
        book: "Psalms",
        chapter: 27,
        verse: 10,
        text: "When my father and my mother forsake me, then the LORD will take me up",
        explanation: "In our deepest loneliness and abandonment, God never leaves us. Even when earthly relationships fail or disappoint us, the Lord stands ready to gather us into His care. This unconditional love provides a foundation of belonging that transcends human rejection and heals the wounds of abandonment.",
      },
      {
        book: "Psalms",
        chapter: 34,
        verse: 18,
        text: "The LORD is nigh unto them that are of a broken heart",
        explanation: "When depression shatters our heart and spirit, God draws near with His loving presence. He doesn't stay distant from our pain but enters into it with us. His nearness in our brokenness becomes the source of hope for restoration and the evidence that we are never truly alone in our suffering.",
      },
      {
        book: "2 Corinthians",
        chapter: 1,
        verse: 3,
        text: "Who comforteth us in all our tribulation",
        explanation: "God is the Father of Compassion and the God of all comfort. He doesn't simply observe our struggles from afar but actively ministers to us during times of distress. His comfort isn't a quick fix but a deep, sustaining presence that strengthens us to endure and eventually overcome our seasons of darkness.",
      },
    ],
  },
  {
    id: "fear",
    title: "Fear",
    icon: "shield-outline",
    color: "#8b5cf6",
    references: [
      {
        book: "2 Timothy",
        chapter: 1,
        verse: 7,
        text: "For God hath not given us the spirit of fear; but of power, and of love, and of a sound mind",
        explanation: "Fear is not from God but from the enemy who seeks to paralyze us. Instead, God gives us the spirit of power to overcome obstacles, love to replace terror, and a sound mind to think clearly and rationally. When fear grips us, we can reject it and claim the strength, courage, and mental clarity God provides.",
      },
      {
        book: "Psalms",
        chapter: 27,
        verse: 1,
        text: "The LORD is my light and my salvation; whom shall I fear?",
        explanation: "When God is our protector and guide, there is nothing to fear. His light dispels darkness and confusion, His salvation secures our ultimate destiny. This confident declaration reflects a soul anchored in trust, knowing that the Lord's protection supersedes any earthly threat or danger.",
      },
      {
        book: "John",
        chapter: 14,
        verse: 27,
        text: "Peace I leave with you, my peace I give unto you",
        explanation: "Jesus bequeaths to us a supernatural peace that doesn't depend on circumstances. Unlike worldly peace built on favorable conditions, Christ's peace remains steadfast amid chaos and conflict. This peace is a gift available to all believers, a tranquility that passes understanding and guards our hearts.",
      },
    ],
  },
  {
    id: "peace",
    title: "Peace",
    icon: "leaf",
    color: "#06b6d4",
    references: [
      {
        book: "Philippians",
        chapter: 4,
        verse: 7,
        text: "The peace of God, which passeth all understanding, shall keep your hearts and your minds",
        explanation: "This peace transcends human logic and rational explanation—it's a divine gift that protects our emotional and mental wellbeing. When we surrender our concerns to God and trust in His wisdom, He stations this supernatural peace as a guard around our hearts and minds, shielding us from anxiety and confusion.",
      },
      {
        book: "John",
        chapter: 14,
        verse: 27,
        text: "Peace I leave with you: not as the world giveth, give I unto you",
        explanation: "The world's peace is conditional, temporary, and dependent on favorable circumstances. But Christ offers a peace that remains constant regardless of external conditions. This peace is the inheritance of every believer—a permanent tranquility woven into our identity in Christ.",
      },
      {
        book: "Psalms",
        chapter: 23,
        verse: 2,
        text: "He maketh me to lie down in green pastures: he leadeth me beside the still waters",
        explanation: "God provides rest and refreshment for our weary souls. Like a shepherd leading sheep to safe, nourishing grounds, the Lord guides us to places of peace and restoration. These still waters represent the calming presence of God where we find renewal, safety, and deep inner peace.",
      },
    ],
  },
  {
    id: "stress",
    title: "Stress",
    icon: "pulse",
    color: "#14b8a6",
    references: [
      {
        book: "Matthew",
        chapter: 11,
        verse: 28,
        text: "Come unto me, all ye that labour and are heavy laden, and I will give you rest",
        explanation: "Jesus extends a warm invitation to all who are exhausted and overburdened. Whether stressed by work, relationships, or life's pressures, we can come to Him and find restoration. This rest is not mere physical relaxation but spiritual renewal—a refreshing of the soul through connection with our Creator.",
      },
      {
        book: "Psalms",
        chapter: 55,
        verse: 22,
        text: "Cast thy burden upon the LORD, and he shall sustain thee",
        explanation: "We're not meant to carry our burdens alone. God invites us to transfer the weight of our stresses to Him. When we lay down what we cannot carry and trust Him with it, He not only sustains us but also demonstrates His care and capability. This exchange transforms our stress into rest.",
      },
      {
        book: "Proverbs",
        chapter: 12,
        verse: 25,
        text: "Heaviness in the heart of man maketh it stoop: but a good word maketh it glad",
        explanation: "Stress and worry weigh us down, affecting our posture, mood, and outlook. But encouraging words from others and from God's promises can lift us up and restore our spirit. The power of kindness, affirmation, and hope can transform stress into joy and give us new strength to face challenges.",
      },
    ],
  },
  {
    id: "patience",
    title: "Patience",
    icon: "time",
    color: "#06b6d4",
    references: [
      {
        book: "Romans",
        chapter: 12,
        verse: 12,
        text: "Rejoicing in hope; patient in tribulation",
        explanation: "True patience is not passive resignation but active joy coupled with endurance. When we hold onto hope in God's promises while facing difficulties, we can actually rejoice even in hard times. This patient attitude reflects deep faith that God is working through our struggles for our ultimate good.",
      },
      {
        book: "Galatians",
        chapter: 5,
        verse: 22,
        text: "But the fruit of the Spirit is love, joy, peace, longsuffering, gentleness",
        explanation: "Patience (longsuffering) is not a natural human trait but a fruit of the Holy Spirit. As we grow in our relationship with God, He cultivates this beautiful quality within us. Patient endurance develops character, deepens faith, and enables us to treat others with the same grace we receive from God.",
      },
      {
        book: "Hebrews",
        chapter: 12,
        verse: 1,
        text: "Let us run with patience the race that is set before us",
        explanation: "The Christian life is a marathon, not a sprint. Patience keeps us focused on the long-term goal of faithfulness to God rather than quick results. By maintaining steady perseverance and refusing to give up, we finish strong and experience the full reward of our commitment to Christ.",
      },
    ],
  },
  {
    id: "loss",
    title: "Loss & Grief",
    icon: "sad",
    color: "#64748b",
    references: [
      {
        book: "1 Thessalonians",
        chapter: 4,
        verse: 13,
        text: "But I would not have you to be ignorant, brethren, concerning them which are asleep",
        explanation: "Death is not the final word for believers—it's a temporary separation comparable to sleep. Paul teaches that those who die in faith await resurrection and reunion with loved ones. This truth transforms our grief from hopelessness into sorrow with confident expectation of eternal reunion and restoration.",
      },
      {
        book: "Psalms",
        chapter: 23,
        verse: 4,
        text: "Yea, though I walk through the valley of the shadow of death, I will fear no evil",
        explanation: "Grief and loss may feel like walking through a dark valley, but we need not fear. God's presence accompanies us through the deepest shadows of loss. His comfort and protection remain constant, ensuring that even in our darkest grief, we are never abandoned or hopeless.",
      },
      {
        book: "Revelation",
        chapter: 21,
        verse: 4,
        text: "And God shall wipe away all tears from their eyes",
        explanation: "This beautiful promise assures us that our suffering and sorrow are temporary. In heaven's eternity, God personally wipes away every tear, eradicating pain, loss, and grief. This incredible hope encourages us to persevere through loss, knowing that joy, wholeness, and peace await us in God's eternal presence.",
      },
    ],
  },
  {
    id: "jealousy",
    title: "Jealousy",
    icon: "eye",
    color: "#a855f7",
    references: [
      {
        book: "Proverbs",
        chapter: 14,
        verse: 30,
        text: "A sound heart is the life of the flesh: but envy the rottenness of the bones",
        explanation: "Envy and jealousy are corrosive emotions that destroy us from within. They eat away at our peace and contentment like decay affecting bones. Conversely, a content heart rooted in gratitude produces health, vitality, and wellbeing. Choosing contentment over comparison is actually an act of self-care and spiritual health.",
      },
      {
        book: "Romans",
        chapter: 13,
        verse: 13,
        text: "Not in rioting and drunkenness, not in chambering and wantonness, not in strife and envying",
        explanation: "Paul lists jealousy alongside serious vices, showing how serious this sin is. Envy leads to conflict, destroys relationships, and separates us from godly living. Overcoming jealousy requires choosing to celebrate others' blessings, focus on our own journey, and cultivate gratitude for what God has given us.",
      },
      {
        book: "1 Corinthians",
        chapter: 3,
        verse: 3,
        text: "For ye are yet carnal: for whereas there is among you envying, and strife",
        explanation: "Jealousy indicates spiritual immaturity and a carnal (fleshly) perspective. When our spirits are controlled by envy rather than God's love, we remain limited in spiritual growth. Overcoming jealousy requires dying to our selfish desires and allowing the Holy Spirit to transform our hearts toward generosity and genuine joy for others.",
      },
    ],
  },
  {
    id: "joy",
    title: "Joy",
    icon: "happy",
    color: "#facc15",
    references: [
      {
        book: "Philippians",
        chapter: 4,
        verse: 4,
        text: "Rejoice in the Lord alway: and again I say, Rejoice",
        explanation: "Paul's double command to rejoice reveals the importance of cultivating joy in God. This is not dependent on circumstances but on our relationship with the Lord. True joy springs from knowing we're loved, redeemed, and secure in Christ. This deep joy becomes our strength and testimony to God's goodness.",
      },
      {
        book: "Psalms",
        chapter: 16,
        verse: 11,
        text: "Thou wilt shew me the path of life: in thy presence is fulness of joy",
        explanation: "Complete joy is found only in God's presence. When we walk closely with Him, experiencing His guidance and love, we discover a fullness of joy that the world cannot offer. This joy overflows from intimacy with our Creator and sustains us through every circumstance.",
      },
      {
        book: "Nehemiah",
        chapter: 8,
        verse: 10,
        text: "The joy of the LORD is your strength",
        explanation: "Joy is not frivolous happiness but a source of spiritual power. When we embrace the joy that comes from knowing and serving God, we access divine strength to overcome obstacles, persevere through trials, and live with confidence. This joy becomes our fortress and our fortress.",
      },
    ],
  },
  {
    id: "temptation",
    title: "Temptation",
    icon: "warning",
    color: "#ff6b6b",
    references: [
      {
        book: "1 Corinthians",
        chapter: 10,
        verse: 13,
        text: "There hath no temptation taken you but such as is common to man",
        explanation: "You're not alone in facing temptation—it's a universal human struggle. God recognizes this and promises that every temptation we encounter is within the scope of human experience. More importantly, He ensures that no temptation is beyond our ability to resist with His help and grace.",
      },
      {
        book: "James",
        chapter: 1,
        verse: 14,
        text: "But every man is tempted, when he is drawn away of his own lust",
        explanation: "Temptation begins in the desires within us. Satan doesn't create temptations from nothing but exploits the desires already present. Understanding this helps us recognize that resisting temptation starts with addressing the desires and attitudes in our hearts, not just external circumstances.",
      },
      {
        book: "2 Timothy",
        chapter: 2,
        verse: 22,
        text: "Flee also youthful lusts: but follow righteousness, faith, charity, peace",
        explanation: "When facing temptation, the best strategy is active avoidance rather than confrontation. By fleeing temptation and instead pursuing righteous living, we protect ourselves. This positive approach—running toward good rather than just away from evil—provides both protection and direction for our spiritual growth.",
      },
    ],
  },
  {
    id: "pride",
    title: "Pride",
    icon: "person",
    color: "#f59e0b",
    references: [
      {
        book: "Proverbs",
        chapter: 16,
        verse: 18,
        text: "Pride goeth before destruction, and an haughty spirit before a fall",
        explanation: "Pride is the root of many spiritual failures and personal disasters. When we become consumed with self-importance and believe we don't need God or others, we set ourselves up for downfall. Humility, by contrast, opens us to God's grace and protection.",
      },
      {
        book: "1 Peter",
        chapter: 5,
        verse: 5,
        text: "God resisteth the proud, but giveth grace unto the humble",
        explanation: "The Almighty God actively works against those controlled by pride, making their path increasingly difficult. Conversely, He generously extends grace to the humble. This stark contrast teaches us that humility invites God's favor and blessing while pride guarantees His resistance.",
      },
      {
        book: "Philippians",
        chapter: 2,
        verse: 3,
        text: "Let nothing be done through strife or vainglory; but in lowliness of mind",
        explanation: "Paul calls us to replace self-promotion with humility and consideration for others. Our actions should be motivated not by ego or personal gain but by genuine concern for others' wellbeing. This lowliness of mind reflects Christ's humility and transforms our relationships and communities.",
      },
    ],
  },
  {
    id: "doubt",
    title: "Doubt & Unbelief",
    icon: "help-circle",
    color: "#3b82f6",
    references: [
      {
        book: "Mark",
        chapter: 11,
        verse: 24,
        text: "Therefore I say unto you, What things soever ye desire, when ye pray, believe that ye receive them",
        explanation: "Faith is believing not just that God can answer prayers but that He will. When we pray with genuine faith, we claim God's promise while still in the process of receiving. This perspective shift from doubt to faith fundamentally changes how we approach prayer and relate to God's promises.",
      },
      {
        book: "James",
        chapter: 1,
        verse: 6,
        text: "But let him ask in faith, nothing wavering",
        explanation: "Double-mindedness and wavering faith undermine prayer. When we ask God for something while simultaneously doubting His ability or willingness to provide, we demonstrate divided loyalty. Wholehearted faith—asking without wavering—aligns our hearts fully with God's promises.",
      },
      {
        book: "Romans",
        chapter: 10,
        verse: 17,
        text: "So then faith cometh by hearing, and hearing by the word of God",
        explanation: "Faith is built through exposure to God's Word. As we read, meditate on, and hear Scripture, the Holy Spirit cultivates faith in our hearts. This shows that doubt can be overcome not through willpower alone but through consistent engagement with God's Truth, which gradually transforms our belief.",
      },
    ],
  },
];

export default function Plans() {
  const router = useRouter();
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  const handleSelectPlan = (plan: Plan) => {
    setSelectedPlan(plan);
  };

  const handleClosePlan = () => {
    setSelectedPlan(null);
  };

  if (selectedPlan) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.background }}>
        <LinearGradient
          colors={theme.gradient}
          style={StyleSheet.absoluteFillObject}
        />
        <SafeAreaView style={{ flex: 1 }}>
          <StatusBar barStyle={theme.statusBar} translucent />

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
          >
            <Animated.View entering={FadeInDown.duration(600)}>
              <View style={styles.header}>
                <Pressable onPress={handleClosePlan} style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.7 }]}> 
                  <Ionicons name="arrow-back" size={22} color={theme.icon} />
                </Pressable>
                <Text style={styles.headerTitle}>{selectedPlan.title}</Text>
                <View style={{ width: 40 }} />
              </View>
            </Animated.View>

            <View style={[styles.planIntro, { borderLeftColor: selectedPlan.color }]}>
              <Ionicons
                name={selectedPlan.icon as any}
                size={32}
                color={selectedPlan.color}
              />
              <Text style={styles.planIntroText}>
                Scripture & Guidance for {selectedPlan.title}
              </Text>
            </View>

            <View style={styles.referencesContainer}>
              <Text style={styles.referencesTitle}>Bible References</Text>

              {selectedPlan.references.map((ref, index) => (
                <View key={index} style={styles.referenceCard}>
                  <View
                    style={[
                      styles.refHeader,
                      { borderBottomColor: selectedPlan.color },
                    ]}
                  >
                    <Text style={styles.refBook}>
                      {ref.book} {ref.chapter}:{ref.verse}
                    </Text>
                    <Ionicons
                      name="book"
                      size={16}
                      color={selectedPlan.color}
                    />
                  </View>
                  <Text style={styles.refText}>{ref.text}</Text>
                  <View style={styles.explanationSection}>
                    <Text style={styles.explanationTitle}>Understanding This Verse</Text>
                    <Text style={styles.explanationText}>{ref.explanation}</Text>
                  </View>
                </View>
              ))}
            </View>

            <Pressable
              onPress={() => {
                const videoUrl = YOUTUBE_VIDEOS[selectedPlan.id];
                if (videoUrl) {
                  Linking.openURL(videoUrl);
                }
              }}
              style={({ pressed }) => [
                styles.readMoreButton,
                pressed && styles.buttonPressed,
              ]}
            >
              <LinearGradient
                colors={[selectedPlan.color, selectedPlan.color]}
                style={styles.readMoreGradient}
              >
                <Ionicons name="play-circle" size={20} color="#fff" />
                <Text style={styles.readMoreText}>
                  Watch Spiritual Guidance
                </Text>
              </LinearGradient>
            </Pressable>
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <LinearGradient
        colors={theme.gradient}
        style={StyleSheet.absoluteFillObject}
      />
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar barStyle={theme.statusBar} translucent />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
        >
          <Animated.View entering={FadeInDown.duration(600)}>
            <View style={styles.header}>
              <Pressable onPress={() => router.back()} style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.7 }]}> 
                <Ionicons name="arrow-back" size={22} color={theme.icon} />
              </Pressable>
              <Text style={styles.headerTitle}>Life Plans</Text>
              <View style={{ width: 40 }} />
            </View>
          </Animated.View>

          <View style={styles.introSection}>
            <Text style={styles.introTitle}>
              Spiritual Plans for Every Season
            </Text>
            <Text style={styles.introText}>
              Find Bible-based guidance for life&apos;s challenges and emotions
            </Text>
          </View>

          <View style={styles.plansGrid}>
            {PLANS.map((plan) => (
              <Pressable
                key={plan.id}
                onPress={() => handleSelectPlan(plan)}
                style={({ pressed }) => [
                  styles.planCard,
                  pressed && styles.planCardPressed,
                ]}
              >
                <LinearGradient
                  colors={[plan.color, plan.color]}
                  style={styles.planCardGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <View style={styles.planCardContent}>
                    <View style={styles.planIconContainer}>
                      <Ionicons
                        name={plan.icon as any}
                        size={28}
                        color="#fff"
                      />
                    </View>
                    <Text style={styles.planCardTitle}>
                      {plan.title}
                    </Text>
                    <View style={styles.planArrow}>
                      <Ionicons
                        name="chevron-forward"
                        size={20}
                        color="#fff"
                      />
                    </View>
                  </View>
                </LinearGradient>
              </Pressable>
            ))}
          </View>

          <View style={styles.footerSection}>
            <Text style={styles.footerText}>
              Each plan includes curated Bible verses to guide you through
              life&apos;s challenges and emotions.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const createStyles = (theme: AppTheme) => StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: theme.surfaceMuted,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: theme.border,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: theme.text,
    textAlign: "center",
    flex: 1,
    letterSpacing: -0.3,
  },
  introSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  introTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: theme.textSecondary,
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  introText: {
    fontSize: 14,
    color: theme.textMuted,
    lineHeight: 20,
  },
  plansGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 12,
    justifyContent: "space-between",
  },
  planCard: {
    width: "48%",
    marginBottom: 12,
    borderRadius: 16,
    overflow: "hidden",
  },
  planCardPressed: {
    opacity: 0.8,
  },
  planCardGradient: {
    padding: 16,
    borderRadius: 16,
    minHeight: 140,
  },
  planCardContent: {
    alignItems: "center",
    justifyContent: "space-between",
    flex: 1,
    gap: 12,
  },
  planIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  planCardTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  planArrow: {
    marginTop: 8,
  },
  planIntro: {
    marginHorizontal: 16,
    marginBottom: 24,
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: theme.surface,
    borderRadius: 16,
    borderLeftWidth: 4,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: theme.border,
  },
  planIntroText: {
    color: theme.textSecondary,
    fontSize: 16,
    fontWeight: "700",
    flex: 1,
  },
  referencesContainer: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  referencesTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: theme.textSecondary,
    marginBottom: 12,
    letterSpacing: -0.2,
  },
  referenceCard: {
    backgroundColor: theme.surface,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.border,
  },
  refHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 2,
  },
  refBook: {
    color: "#a78bfa",
    fontSize: 14,
    fontWeight: "800",
  },
  refText: {
    color: theme.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    padding: 12,
    fontStyle: "italic",
  },
  explanationSection: {
    paddingHorizontal: 12,
    paddingBottom: 12,
    borderTopWidth: 1,
    borderTopColor: theme.border,
  },
  explanationTitle: {
    color: "#a78bfa",
    fontSize: 13,
    fontWeight: "800",
    marginTop: 10,
    marginBottom: 8,
  },
  explanationText: {
    color: theme.textMuted,
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: 0.3,
  },
  readMoreButton: {
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: "hidden",
  },
  readMoreGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    gap: 8,
  },
  readMoreText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
  },
  buttonPressed: {
    opacity: 0.8,
  },
  footerSection: {
    marginHorizontal: 16,
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: theme.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.border,
  },
  footerText: {
    color: theme.textMuted,
    fontSize: 13,
    lineHeight: 18,
    textAlign: "center",
  },
});
