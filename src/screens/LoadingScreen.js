import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Animated, Easing } from 'react-native';
import { BASE_COLORS } from '../constants/colors';

export default function LoadingScreen({ onFinishLoading }) {
  // Animated background position
  const translateY = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade in main title
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1200,
      useNativeDriver: true,
    }).start();

    // Smooth moving background loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(translateY, {
          toValue: -20,
          duration: 3000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 3000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Automatically transition past loading screen after 3.5 seconds
    const timer = setTimeout(() => {
      if (onFinishLoading) onFinishLoading();
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      {/* Moving Animated Background Layer */}
      <Animated.View
        style={[
          styles.backgroundGlow,
          {
            transform: [{ translateY }],
          },
        ]}
      />

      {/* Central Brand Content */}
      <Animated.View style={[styles.centerContent, { opacity: fadeAnim }]}>
        <Text style={styles.brandTitle}>PARCHMENT & OBSIDIAN</Text>
        <View style={styles.goldDivider} />
        <Text style={styles.tagline}>The Infinite Library & Archive</Text>
      </Animated.View>

      {/* Founder Credit at Bottom Left */}
      <View style={styles.footerLeft}>
        <Text style={styles.founderLabel}>FOUNDER / CEO</Text>
        <Text style={styles.founderName}>Talabi David Adeoluwa</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0A0D',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  backgroundGlow: {
    position: 'absolute',
    width: '150%',
    height: '150%',
    backgroundColor: '#1E1924',
    opacity: 0.35,
    borderRadius: 300,
  },
  centerContent: {
    alignItems: 'center',
  },
  brandTitle: {
    color: BASE_COLORS.gold,
    fontSize: 22,
    fontWeight: 'bold',
    letterSpacing: 3,
    textAlign: 'center',
    fontFamily: 'serif',
  },
  goldDivider: {
    width: 60,
    height: 2,
    backgroundColor: BASE_COLORS.gold,
    marginVertical: 12,
  },
  tagline: {
    color: '#9E98A8',
    fontSize: 12,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  footerLeft: {
    position: 'absolute',
    bottom: 40,
    left: 30,
  },
  founderLabel: {
    color: BASE_COLORS.gold,
    fontSize: 10,
    letterSpacing: 2,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  founderName: {
    color: '#EDE8DF',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});
