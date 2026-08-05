import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Animated, Easing, TouchableOpacity } from 'react-native';
import { BASE_COLORS } from '../constants/colors';

export default function LoadingScreen({ onFinishLoading }) {
  const moveAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade in main elements
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    // Infinite moving background loop
    Animated.loop(
      Animated.timing(moveAnim, {
        toValue: 1,
        duration: 15000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  // Interpolate movement for background elements
  const bgTranslateX = moveAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -100],
  });

  const bgTranslateY = moveAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -100],
  });

  return (
    <View style={styles.container}>
      {/* Moving Background Grid / Animation Layer */}
      <Animated.View
        style={[
          styles.movingGrid,
          {
            transform: [{ translateX: bgTranslateX }, { translateY: bgTranslateY }],
          },
        ]}
      >
        <View style={styles.gridCircleOne} />
        <View style={styles.gridCircleTwo} />
      </Animated.View>

      {/* Main Branding Content */}
      <Animated.View style={[styles.centerContent, { opacity: fadeAnim }]}>
        <Text style={styles.brandTitle}>PARCHMENT & OBSIDIAN</Text>
        <View style={styles.goldDivider} />
        <Text style={styles.tagline}>The Infinite Library, Archive & Study Arena</Text>

        {/* Feature Highlights Ticker */}
        <View style={styles.featureBox}>
          <Text style={styles.featureText}>🌍 Global Catalog & Custom Book Sync</Text>
          <Text style={styles.featureText}>🎙️ Voice Margin Notes & AI Character Chat</Text>
          <Text style={styles.featureText}>🧪 Competitive Study Rooms & Tournaments</Text>
        </View>

        {/* Enter Library Button */}
        <TouchableOpacity style={styles.enterBtn} onPress={onFinishLoading}>
          <Text style={styles.enterBtnText}>Enter Grand Archive ➔</Text>
        </TouchableOpacity>
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
    backgroundColor: '#070609',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    overflow: 'hidden',
  },
  movingGrid: {
    position: 'absolute',
    width: '200%',
    height: '200%',
    top: '-50%',
    left: '-50%',
    opacity: 0.25,
  },
  gridCircleOne: {
    position: 'absolute',
    top: '20%',
    left: '30%',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: '#3B2D4A',
  },
  gridCircleTwo: {
    position: 'absolute',
    top: '60%',
    left: '60%',
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: '#2A1F35',
  },
  centerContent: {
    alignItems: 'center',
    width: '100%',
    maxWidth: 360,
    zIndex: 2,
  },
  brandTitle: {
    color: BASE_COLORS.gold,
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 2.5,
    textAlign: 'center',
    fontFamily: 'serif',
  },
  goldDivider: {
    width: 50,
    height: 2,
    backgroundColor: BASE_COLORS.gold,
    marginVertical: 12,
  },
  tagline: {
    color: '#9E98A8',
    fontSize: 11,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    textAlign: 'center',
    marginBottom: 24,
  },
  featureBox: {
    backgroundColor: 'rgba(28, 24, 34, 0.8)',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#383142',
    width: '100%',
    marginBottom: 24,
    gap: 6,
  },
  featureText: {
    color: '#D4CFC4',
    fontSize: 12,
    textAlign: 'center',
  },
  enterBtn: {
    backgroundColor: BASE_COLORS.terracotta,
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D4A373',
  },
  enterBtnText: {
    color: BASE_COLORS.parchment,
    fontWeight: 'bold',
    fontSize: 13,
    letterSpacing: 1,
  },
  footerLeft: {
    position: 'absolute',
    bottom: 35,
    left: 25,
    zIndex: 2,
  },
  founderLabel: {
    color: BASE_COLORS.gold,
    fontSize: 9,
    letterSpacing: 1.8,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  founderName: {
    color: '#EDE8DF',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});
