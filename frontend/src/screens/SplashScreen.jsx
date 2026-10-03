import React, { useEffect, useContext, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing, Dimensions, Image } from 'react-native';
import { FitnessContext } from '../context/FitnessContext';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function SplashScreen({ navigation }) {
  const { userProfile, permissionStatus } = useContext(FitnessContext);
  
  // Base Opacity Values (Screen 1)
  const bgGlowAnim = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.5)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  
  // Circular Ring & Particles Values (Screen 2)
  const ringRotate = useRef(new Animated.Value(0)).current;
  const ringOpacity = useRef(new Animated.Value(0)).current;
  const particlesOpacity = useRef(new Animated.Value(0)).current;
  
  // Fitness Features Values (Screen 3)
  const iconFootOpacity = useRef(new Animated.Value(0)).current;
  const iconFootTranslate = useRef(new Animated.Value(15)).current;
  const iconFireOpacity = useRef(new Animated.Value(0)).current;
  const iconFireTranslate = useRef(new Animated.Value(15)).current;
  const iconHeartOpacity = useRef(new Animated.Value(0)).current;
  const iconHeartTranslate = useRef(new Animated.Value(15)).current;
  const iconGraphOpacity = useRef(new Animated.Value(0)).current;
  const iconGraphTranslate = useRef(new Animated.Value(15)).current;
  const motionTrailOpacity = useRef(new Animated.Value(0)).current;

  // Final Loading Values (Screen 4)
  const loadingOpacity = useRef(new Animated.Value(0)).current;
  const loadingWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // State 1 (0s - 0.5s): Base Fade In (Logo + Text)
    Animated.parallel([
      Animated.timing(bgGlowAnim, { toValue: 1, duration: 500, easing: Easing.out(Easing.ease), useNativeDriver: true }),
      Animated.timing(logoOpacity, { toValue: 1, duration: 500, easing: Easing.out(Easing.ease), useNativeDriver: true }),
      Animated.spring(logoScale, { toValue: 1, friction: 6, tension: 40, useNativeDriver: true }),
      Animated.timing(textOpacity, { toValue: 1, duration: 500, easing: Easing.out(Easing.ease), useNativeDriver: true }),
    ]).start();

    // State 2 (0.5s - 2.0s): Circular Animation + Particles
    setTimeout(() => {
      Animated.timing(ringOpacity, { toValue: 1, duration: 400, useNativeDriver: true }).start();
      Animated.timing(particlesOpacity, { toValue: 1, duration: 500, useNativeDriver: true }).start();
      
      Animated.loop(
        Animated.timing(ringRotate, {
          toValue: 1,
          duration: 3000,
          easing: Easing.linear,
          useNativeDriver: true
        })
      ).start();
    }, 500);

    // State 3 (2.0s - 3.0s): Features Glimpse
    setTimeout(() => {
      const createIconAnim = (opac, trans) => Animated.parallel([
        Animated.timing(opac, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.spring(trans, { toValue: 0, friction: 5, useNativeDriver: true })
      ]);
      
      Animated.parallel([
        Animated.timing(motionTrailOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.stagger(150, [
          createIconAnim(iconFootOpacity, iconFootTranslate),
          createIconAnim(iconFireOpacity, iconFireTranslate),
          createIconAnim(iconHeartOpacity, iconHeartTranslate),
          createIconAnim(iconGraphOpacity, iconGraphTranslate),
        ])
      ]).start();
    }, 2000);

    // State 4 (3.0s - 4.0s): Final Loading
    setTimeout(() => {
      Animated.timing(loadingOpacity, { toValue: 1, duration: 400, useNativeDriver: true }).start();
      
      Animated.timing(loadingWidth, {
        toValue: 1,
        duration: 1000,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false
      }).start();
    }, 3000);

    // Transition out
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
        {/* Animated Ring (State 2) */}
        <Animated.View style={[styles.ringContainer, { opacity: ringOpacity, transform: [{ rotate: rotateInterpolate }] }]}>
           <View style={styles.ringOuter} />
           <View style={styles.ringInner} />
           <View style={styles.ringDot} />
        </Animated.View>
        
        {/* Particles (State 2) */}
        <Animated.View style={[StyleSheet.absoluteFill, { opacity: particlesOpacity, justifyContent: 'center', alignItems: 'center' }]}>
           <View style={[styles.particle, { top: -80, left: 20 }]} />
           <View style={[styles.particle, { top: -50, left: -60, width: 4, height: 4 }]} />
           <View style={[styles.particle, { bottom: -70, right: 10 }]} />
           <View style={[styles.particle, { bottom: 20, right: -80, width: 6, height: 6 }]} />
           <View style={[styles.particle, { bottom: -40, left: -40, width: 3, height: 3 }]} />
        </Animated.View>

        {/* Motion Trail (State 3) */}
        <Animated.View style={[styles.motionTrail, { opacity: motionTrailOpacity }]} />

        {/* Small Icons (State 3) */}
        <Animated.View style={[styles.floatingIcon, { top: -50, left: -50, opacity: iconFootOpacity, transform: [{ translateY: iconFootTranslate }] }]}>
          <MaterialCommunityIcons name="shoe-print" size={24} color="#00ff88" />
        </Animated.View>
        <Animated.View style={[styles.floatingIcon, { top: -30, right: -50, opacity: iconFireOpacity, transform: [{ translateY: iconFireTranslate }] }]}>
          <MaterialCommunityIcons name="fire" size={24} color="#00ff88" />
        </Animated.View>
        <Animated.View style={[styles.floatingIcon, { bottom: -10, right: -60, opacity: iconHeartOpacity, transform: [{ translateY: iconHeartTranslate }] }]}>
          <MaterialCommunityIcons name="heart-pulse" size={24} color="#00ff88" />
        </Animated.View>
        <Animated.View style={[styles.floatingIcon, { bottom: -40, left: 30, opacity: iconGraphOpacity, transform: [{ translateY: iconGraphTranslate }] }]}>
          <MaterialCommunityIcons name="chart-bar" size={24} color="#00ff88" />
        </Animated.View>

        {/* Central Logo (State 1) */}
        <Animated.View style={{ opacity: logoOpacity, transform: [{ scale: logoScale }] }}>
          <View style={styles.logoWrapper}>
            <Image 
              source={require('../../assets/icon.png')} 
              style={styles.logoImage}
              resizeMode="cover"
            />
          </View>
        </Animated.View>
      </View>

      {/* Main Text Section (State 1) */}
      <Animated.View style={[styles.bottomSection, { opacity: textOpacity }]}>
        <View style={styles.titleContainer}>
          <Text style={styles.titleWhite}>Fit</Text>
          <Text style={styles.titleGreen}>Step</Text>
        </View>
        <Text style={styles.tagline}>STEP TOWARDS</Text>
        <Text style={styles.tagline}>A HEALTHIER YOU</Text>
        
        {/* Loading Bar Section (State 4) */}
        <Animated.View style={{ opacity: loadingOpacity, alignItems: 'center', width: '100%', marginTop: 30 }}>
          <View style={styles.loadingContainer}>
            <Animated.View style={[styles.loadingBar, { width: loadingBarWidth }]} />
          </View>
          <Text style={styles.loadingText}>Getting you ready...</Text>
        </Animated.View>
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
    marginTop: -80 // Moved up slightly to balance layout
  },
  logoWrapper: {
    width: 130,
    height: 130,
    borderRadius: 65,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#040b16'
  },
  logoImage: {
    width: '100%',
    height: '100%',
    zIndex: 10
  },
  ringContainer: {
    position: 'absolute',
    width: 220,
    height: 220,
    justifyContent: 'center',
    alignItems: 'center'
  },
  ringOuter: {
    position: 'absolute',
    width: 210,
    height: 210,
    borderRadius: 105,
    borderWidth: 1.5,
    borderColor: 'rgba(0, 255, 136, 0.1)',
    borderTopColor: '#00ff88',
    borderRightColor: '#00ff88',
  },
  ringInner: {
    position: 'absolute',
    width: 170,
    height: 170,
    borderRadius: 85,
    borderWidth: 2,
    borderColor: 'rgba(0, 255, 136, 0.05)',
    borderBottomColor: '#00ff88',
  },
  ringDot: {
    position: 'absolute',
    top: 5,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#00ff88',
    shadowColor: '#00ff88',
    shadowOpacity: 1,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 0 },
    elevation: 10
  },
  particle: {
    position: 'absolute',
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#00ff88',
    shadowColor: '#00ff88',
    shadowOpacity: 0.8,
    shadowRadius: 5,
  },
  motionTrail: {
    position: 'absolute',
    left: -60,
    width: 120,
    height: 60,
    borderBottomLeftRadius: 60,
    borderTopLeftRadius: 60,
    backgroundColor: 'rgba(0, 255, 136, 0.1)',
    transform: [{ skewY: '-20deg' }],
  },
  floatingIcon: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 255, 136, 0.08)',
    padding: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 136, 0.25)',
    zIndex: 5
  },
  bottomSection: {
    position: 'absolute',
    bottom: 80,
    alignItems: 'center',
    width: '100%'
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12
  },
  titleWhite: {
    fontSize: 46,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -1
  },
  titleGreen: {
    fontSize: 46,
    fontWeight: '900',
    color: '#00ff88',
    letterSpacing: -1
  },
  tagline: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    letterSpacing: 3,
    marginBottom: 4
  },
  loadingContainer: {
    width: 220,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 16
  },
  loadingBar: {
    height: '100%',
    backgroundColor: '#00ff88',
    borderRadius: 2
  },
  loadingText: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.5)'
  }
});