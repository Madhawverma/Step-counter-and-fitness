import React, { useEffect, useContext, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing, Dimensions, Image } from 'react-native';
import { FitnessContext } from '../context/FitnessContext';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import colors from '../constants/colors';

const { width, height } = Dimensions.get('window');

export default function SplashScreen({ navigation }) {
  const { userProfile, permissionStatus } = useContext(FitnessContext);
  
  // Animation Values
  const bgGlowAnim = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.5)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const ringRotate = useRef(new Animated.Value(0)).current;
  const ringOpacity = useRef(new Animated.Value(0)).current;
  
  const iconFootOpacity = useRef(new Animated.Value(0)).current;
  const iconFootTranslate = useRef(new Animated.Value(20)).current;
  
  const iconFireOpacity = useRef(new Animated.Value(0)).current;
  const iconFireTranslate = useRef(new Animated.Value(20)).current;
  
  const iconHeartOpacity = useRef(new Animated.Value(0)).current;
  const iconHeartTranslate = useRef(new Animated.Value(20)).current;
  
  const iconGraphOpacity = useRef(new Animated.Value(0)).current;
  const iconGraphTranslate = useRef(new Animated.Value(20)).current;

  const textOpacity = useRef(new Animated.Value(0)).current;
  const textTranslate = useRef(new Animated.Value(20)).current;
  
  const loadingWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 0.0s - 0.5s: Initial fade in & scale
    Animated.parallel([
      Animated.timing(bgGlowAnim, { toValue: 1, duration: 800, easing: Easing.out(Easing.ease), useNativeDriver: true }),
      Animated.timing(logoOpacity, { toValue: 1, duration: 600, easing: Easing.out(Easing.ease), useNativeDriver: true }),
      Animated.spring(logoScale, { toValue: 1, friction: 6, tension: 40, useNativeDriver: true })
    ]).start();

    // 0.5s - 2.0s: Ring rotation and appear
    setTimeout(() => {
      Animated.timing(ringOpacity, { toValue: 1, duration: 400, useNativeDriver: true }).start();
      Animated.loop(
        Animated.timing(ringRotate, {
          toValue: 1,
          duration: 3000,
          easing: Easing.linear,
          useNativeDriver: true
        })
      ).start();
    }, 500);

    // 2.0s - 3.0s: Staggered icons
    setTimeout(() => {
      const createIconAnim = (opac, trans) => Animated.parallel([
        Animated.timing(opac, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.spring(trans, { toValue: 0, friction: 5, useNativeDriver: true })
      ]);
      
      Animated.stagger(200, [
        createIconAnim(iconFootOpacity, iconFootTranslate),
        createIconAnim(iconFireOpacity, iconFireTranslate),
        createIconAnim(iconHeartOpacity, iconHeartTranslate),
        createIconAnim(iconGraphOpacity, iconGraphTranslate),
      ]).start();
    }, 1500);

    // 3.0s - 4.0s: Text and Loading bar
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(textOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.spring(textTranslate, { toValue: 0, friction: 5, useNativeDriver: true }),
      ]).start();
      
      Animated.timing(loadingWidth, {
        toValue: 1,
        duration: 1200,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false // width doesn't support native driver easily without scaleX
      }).start();
    }, 2500);

    // End of Splash -> Navigation
    const timer = setTimeout(() => {
      if (!userProfile) {
        navigation.replace('Onboarding');
      } else {
        navigation.replace('Main');
      }
    }, 4500);
    
    return () => clearTimeout(timer);
  }, [userProfile, permissionStatus]);

  const rotateInterpolate = ringRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });
  
  const loadingBarWidth = loadingWidth.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%']
  });

  return (
    <View style={styles.container}>
      {/* Background Glow */}
      <Animated.View style={[StyleSheet.absoluteFill, { opacity: bgGlowAnim }]}>
        <LinearGradient
          colors={['#040b16', '#092025', '#040b16']}
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        <LinearGradient
          colors={['transparent', 'rgba(0, 255, 136, 0.15)', 'transparent']}
          style={[StyleSheet.absoluteFill, { bottom: -height/2 }]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        />
      </Animated.View>

      <View style={styles.centerStage}>
        {/* Animated Ring */}
        <Animated.View style={[styles.ringContainer, { opacity: ringOpacity, transform: [{ rotate: rotateInterpolate }] }]}>
           <View style={styles.ringOuter} />
           <View style={styles.ringInner} />
           <View style={styles.ringDot} />
        </Animated.View>

        {/* Small Icons */}
        <Animated.View style={[styles.floatingIcon, { top: -40, left: -40, opacity: iconFootOpacity, transform: [{ translateY: iconFootTranslate }] }]}>
          <MaterialCommunityIcons name="shoe-print" size={24} color="#00ff88" />
        </Animated.View>
        <Animated.View style={[styles.floatingIcon, { top: -20, right: -40, opacity: iconFireOpacity, transform: [{ translateY: iconFireTranslate }] }]}>
          <MaterialCommunityIcons name="fire" size={24} color="#00ff88" />
        </Animated.View>
        <Animated.View style={[styles.floatingIcon, { bottom: 0, right: -50, opacity: iconHeartOpacity, transform: [{ translateY: iconHeartTranslate }] }]}>
          <MaterialCommunityIcons name="heart-pulse" size={24} color="#00ff88" />
        </Animated.View>
        <Animated.View style={[styles.floatingIcon, { bottom: -30, left: 30, opacity: iconGraphOpacity, transform: [{ translateY: iconGraphTranslate }] }]}>
          <MaterialCommunityIcons name="chart-bar" size={24} color="#00ff88" />
        </Animated.View>

        {/* Central Logo */}
        <Animated.View style={{ opacity: logoOpacity, transform: [{ scale: logoScale }] }}>
          <Image 
            source={require('../../assets/icon.png')} 
            style={styles.logoImage}
            resizeMode="contain"
          />
        </Animated.View>
      </View>

      {/* Text and Loader */}
      <Animated.View style={[styles.bottomSection, { opacity: textOpacity, transform: [{ translateY: textTranslate }] }]}>
        <View style={styles.titleContainer}>
          <Text style={styles.titleWhite}>Fit</Text>
          <Text style={styles.titleGreen}>Step</Text>
        </View>
        <Text style={styles.tagline}>STEP TOWARDS A HEALTHIER YOU</Text>
        
        <View style={styles.loadingContainer}>
          <Animated.View style={[styles.loadingBar, { width: loadingBarWidth }]} />
        </View>
        <Text style={styles.loadingText}>Getting you ready...</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#040b16',
    justifyContent: 'center',
    alignItems: 'center'
  },
  centerStage: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -50
  },
  logoImage: {
    width: 130,
    height: 130,
    zIndex: 10
  },
  ringContainer: {
    position: 'absolute',
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center'
  },
  ringOuter: {
    position: 'absolute',
    width: 190,
    height: 190,
    borderRadius: 95,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 136, 0.2)',
    borderTopColor: '#00ff88',
  },
  ringInner: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 2,
    borderColor: 'rgba(0, 255, 136, 0.1)',
    borderBottomColor: '#00ff88',
  },
  ringDot: {
    position: 'absolute',
    top: 5,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#00ff88',
    shadowColor: '#00ff88',
    shadowOpacity: 1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
    elevation: 10
  },
  floatingIcon: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 255, 136, 0.1)',
    padding: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 136, 0.2)'
  },
  bottomSection: {
    position: 'absolute',
    bottom: 60,
    alignItems: 'center',
    width: '100%'
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  titleWhite: {
    fontSize: 42,
    fontWeight: '900',
    color: '#FFFFFF'
  },
  titleGreen: {
    fontSize: 42,
    fontWeight: '900',
    color: '#00ff88'
  },
  tagline: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    letterSpacing: 2,
    marginBottom: 40
  },
  loadingContainer: {
    width: 200,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 12
  },
  loadingBar: {
    height: '100%',
    backgroundColor: '#00ff88',
    borderRadius: 2
  },
  loadingText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.4)'
  }
});