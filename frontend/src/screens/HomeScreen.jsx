import React, { useContext, useEffect, useState } from 'react';
import { ScrollView, View, Text, StyleSheet, RefreshControl, ImageBackground, TouchableOpacity, Modal, TextInput, Alert, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FitnessContext } from '../context/FitnessContext';
import { getHistory } from '../storage/database';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import colors from '../constants/colors';

export default function HomeScreen({ navigation }) {
  const { steps, distance, calories, activeMinutes, dailyGoal, userProfile, permissionStatus, requestSensorPermissions, updateGoals, addManualSteps } = useContext(FitnessContext);
  const [history, setHistory] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [goalModalVisible, setGoalModalVisible] = useState(false);
  const [tempGoal, setTempGoal] = useState("");

  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const theme = {
    bg: isDark ? '#0b132b' : colors.background,
    card: isDark ? '#1c2541' : colors.card,
    text: isDark ? '#ffffff' : colors.text,
    textSub: isDark ? '#8d99ae' : colors.textSecondary,
    border: isDark ? '#2b3a55' : colors.border,
    cardAccent1: isDark ? '#3a2020' : '#fff5f2',
    cardAccent2: isDark ? '#1a2233' : '#f0f7ff',
    cardAccent3: isDark ? '#221a33' : '#f8f0ff',
    cardAccent4: isDark ? '#112211' : '#f0fcf7',
  };

  const loadData = () => {
    setHistory(getHistory() || []);
    setRefreshing(false);
  };

  useEffect(() => { loadData(); }, []);
  const onRefresh = () => { setRefreshing(true); loadData(); };

  const openGoalModal = () => {
    setTempGoal(dailyGoal.toString());
    setGoalModalVisible(true);
  };

  const saveGoal = () => {
    const parsed = parseInt(tempGoal, 10);
    if (!isNaN(parsed) && parsed > 0) {
      if (updateGoals) updateGoals({ dailyStepsGoal: parsed });
      setGoalModalVisible(false);
    } else {
      Alert.alert('Invalid Goal', 'Please enter a valid number.');
    }
  };

  const name = userProfile?.name || '';
  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
  };
  const greeting = getGreeting();
  const dateStr = new Date().toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
  const progressPct = dailyGoal > 0 ? Math.min((steps / dailyGoal) * 100, 100).toFixed(0) : 0;

  // Weekly History formatting (Last 7 days)
  const last7Days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateKey = d.toISOString().split('T')[0];
    const rec = history.find(h => h.date === dateKey);
    last7Days.push({
      dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
      steps: rec ? rec.steps : 0
    });
  }

  return (
    <View style={[styles.container, {backgroundColor: theme.bg}]}>
      <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} showsVerticalScrollIndicator={false}>

        {/* HERO SECTION */}
        <ImageBackground source={require('../../assets/hero_background.jpg')} style={styles.heroBackground}>
          <SafeAreaView style={styles.heroSafeArea}>
            {/* Top Bar */}
            <View style={styles.topBar}>
              <Text style={styles.logoText}><Text style={styles.logoWhite}>FIT</Text>STEP</Text>
              <View style={styles.topRight}>
                <View style={styles.avatar}><Ionicons name="person" size={20} color="#333" /></View>
              </View>
            </View>

            <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
              <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#FFF' }}>{name ? `${greeting}, ${name}` : greeting} 👋</Text>
              <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 5 }}>{dateStr}</Text>
            </View>

            {/* Circular Dial */}
            <View style={styles.dialContainer}>
              <View style={styles.dialOuter}>
                <TouchableOpacity activeOpacity={0.8} onPress={() => addManualSteps && addManualSteps(15)} style={styles.dialInner}>
                  <MaterialCommunityIcons name="walk" size={32} color="#FFF" />
                  <Text style={styles.dialSteps}>{steps.toLocaleString()}</Text>
                  <Text style={styles.dialLabel}>STEPS</Text>
                  <Text style={styles.dialGoal}>Goal: {dailyGoal.toLocaleString()}</Text>
                  <View style={styles.dialPill}><Text style={styles.dialPillText}>{progressPct}%</Text></View>
                </TouchableOpacity>
              </View>
            </View>

            {/* Edit Goal Button (Moved lower to not hide the dial) */}
            <TouchableOpacity onPress={openGoalModal} style={{ alignSelf: 'center', flexDirection: 'row', alignItems: 'center', backgroundColor: colors.primary, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginTop: 15, zIndex: 10, elevation: 5 }}>
              <Ionicons name="pencil" size={14} color="#FFF" style={{ marginRight: 4 }} />
              <Text style={{ color: "#FFF", fontSize: 12, fontWeight: "bold" }}>EDIT DAILY GOAL</Text>
            </TouchableOpacity>

            {/* Goal Edit Modal */}
            <Modal visible={goalModalVisible} transparent animationType="fade">
              <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ width: '80%', padding: 20, borderRadius: 20, backgroundColor: theme.card }}>
                  <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: theme.text }}>Edit Daily Goal</Text>
                  <TextInput
                    style={{ height: 50, borderRadius: 12, paddingHorizontal: 15, fontSize: 16, marginBottom: 20, backgroundColor: isDark ? '#2b3a55' : '#f0f0f0', color: theme.text }}
                    value={tempGoal}
                    onChangeText={setTempGoal}
                    keyboardType="numeric"
                  />
                  <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                    <TouchableOpacity style={{ padding: 10, marginRight: 10 }} onPress={() => setGoalModalVisible(false)}>
                      <Text style={{ color: theme.textSub }}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ paddingHorizontal: 20, paddingVertical: 10, borderRadius: 12, backgroundColor: colors.primary }} onPress={saveGoal}>
                      <Text style={{ color: '#FFF', fontWeight: 'bold' }}>Save</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>

          </SafeAreaView>
        </ImageBackground>

        {/* Adjust margin to properly attach to the hero without overlapping the dial */}
        <View style={[styles.content, {backgroundColor: theme.bg, marginTop: -25}]}>

          {/* 4 Cards Grid */}
          <View style={styles.grid}>
            <View style={[styles.card, { backgroundColor: theme.cardAccent1 }]}>
              <MaterialCommunityIcons name="fire" size={28} color={colors.orange} />
              <Text style={[styles.cardVal, {color: theme.text}]}>{Math.round(calories)}</Text>
              <Text style={styles.cardLabel}>Calories</Text>
            </View>
            <View style={[styles.card, { backgroundColor: theme.cardAccent2 }]}>
              <Ionicons name="location-sharp" size={28} color={colors.secondary} />
              <Text style={[styles.cardVal, {color: theme.text}]}>{distance.toFixed(2)} <Text style={styles.cardUnit}>km</Text></Text>
              <Text style={styles.cardLabel}>Distance</Text>
            </View>
            <View style={[styles.card, { backgroundColor: theme.cardAccent3 }]}>
              <Ionicons name="stopwatch-outline" size={28} color={colors.purple} />
              <Text style={[styles.cardVal, {color: theme.text}]}>{Math.floor(activeMinutes / 60)}h {activeMinutes % 60}m</Text>
              <Text style={styles.cardLabel}>Active Time</Text>
            </View>
            <View style={[styles.card, { backgroundColor: theme.cardAccent4 }]}>
              <MaterialCommunityIcons name="target" size={28} color={colors.success} />
              <Text style={[styles.cardVal, {color: theme.text}]}>{dailyGoal.toLocaleString()}</Text>
              <Text style={styles.cardLabel}>Daily Goal</Text>
            </View>
          </View>

          {/* Today's Progress */}
          <View style={[styles.section, {backgroundColor: theme.card}]}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, {color: theme.text}]}>Today's Progress</Text>
              <Text style={[styles.sectionValue, {color: theme.text}]}>{progressPct}%</Text>
            </View>
            <View style={[styles.progressBarBg, {backgroundColor: isDark ? '#2b3a55' : colors.background}]}>
              <View style={[styles.progressBarFill, { width: `${progressPct}%` }]} />
            </View>
            <View style={styles.progressRow}>
              <Text style={[styles.progressText, {color: theme.textSub}]}><Text style={{ fontWeight: 'bold', color: theme.text }}>{steps}</Text> / {dailyGoal} steps</Text>
              <Text style={[styles.progressText, {color: theme.textSub}]}>{dailyGoal} goal</Text>
            </View>
            <TouchableOpacity style={[styles.remainingBtn, {borderColor: theme.border}]} onPress={() => navigation.navigate('Activity')}>
              <MaterialCommunityIcons name="shoe-print" size={20} color={colors.secondary} />
              <Text style={[styles.remainingText, {color: theme.text}]}>{Math.max(0, dailyGoal - steps).toLocaleString()} steps remaining</Text>
              <Ionicons name="chevron-forward" size={20} color={theme.textSub} style={{ marginLeft: 'auto' }} />
            </TouchableOpacity>
          </View>

          {/* Weekly Steps */}
          <View style={[styles.section, {backgroundColor: theme.card}]}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, {color: theme.text}]}>Weekly Steps</Text>
              <Text style={[styles.sectionSub, {color: theme.textSub}]}>Last 7 Days</Text>
            </View>
            <View style={styles.chartRow}>
              {last7Days.map((d, i) => {
                const max = Math.max(...last7Days.map(x => x.steps), dailyGoal, 1);
                const h = (d.steps / max) * 100;
                return (
                  <View key={i} style={styles.chartCol}>
                    <View style={[styles.barBg, {backgroundColor: isDark ? '#2b3a55' : colors.background}]}>
                      <View style={[styles.barFill, { height: `${h}%` }]} />
                    </View>
                    <Text style={[styles.chartDay, {color: theme.textSub}]}>{d.dayName}</Text>
                    <Text style={[styles.chartNum, {color: theme.text}]}>{d.steps > 0 ? (d.steps/1000).toFixed(1)+'K' : '0'}</Text>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Today's Activity */}
          <View style={[styles.section, { marginBottom: 40, backgroundColor: theme.card }]}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, {color: theme.text}]}>Today's Activity</Text>
              <View style={styles.walkingBadge}>
                <MaterialCommunityIcons name="walk" size={16} color={colors.success} />
                <Text style={[styles.walkingText, {color: theme.text}]}>Walking</Text>
              </View>
            </View>
            <View style={styles.activityRow}>
              <View style={styles.actCol}>
                <MaterialCommunityIcons name="fire" size={24} color={colors.orange} />
                <Text style={[styles.actVal, {color: theme.text}]}>{Math.round(calories)} <Text style={styles.actUnit}>kcal</Text></Text>
                <Text style={styles.actLabel}>Calories</Text>
              </View>
              <View style={styles.actCol}>
                <Ionicons name="location-sharp" size={24} color={colors.secondary} />
                <Text style={[styles.actVal, {color: theme.text}]}>{distance.toFixed(2)} <Text style={styles.actUnit}>km</Text></Text>
                <Text style={styles.actLabel}>Distance</Text>
              </View>
              <View style={styles.actCol}>
                <Ionicons name="stopwatch-outline" size={24} color={colors.purple} />
                <Text style={[styles.actVal, {color: theme.text}]}>{Math.floor(activeMinutes / 60)}h {activeMinutes % 60}m</Text>
                <Text style={styles.actLabel}>Active Time</Text>
              </View>
              <View style={styles.actCol}>
                <MaterialCommunityIcons name="shoe-print" size={24} color={theme.textSub} />
                <Text style={[styles.actVal, {color: theme.text}]}>{steps}</Text>
                <Text style={styles.actLabel}>Steps</Text>
              </View>
            </View>
          </View>

          {/* Developer Credit */}
          <View style={{ alignItems: 'center', marginBottom: 20, marginTop: -20 }}>
            <Text style={{ color: theme.textSub, fontSize: 12, fontWeight: 'bold' }}>Developed by Madhaw Verma</Text>
          </View>

        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  heroBackground: { width: '100%', height: 460, resizeMode: 'cover' }, // Increased height to fit the circle and button
  heroSafeArea: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', paddingTop: 40 },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, alignItems: 'center' },
  logoText: { fontSize: 24, fontWeight: '900', color: colors.primary, fontStyle: 'italic' },
  logoWhite: { color: '#FFF' },
  topRight: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center' },
  dialContainer: { alignItems: 'center', marginTop: 15 },
  dialOuter: { width: 220, height: 220, borderRadius: 110, backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center', borderWidth: 8, borderColor: 'rgba(255,255,255,0.2)' },
  dialInner: { width: 190, height: 190, borderRadius: 95, backgroundColor: '#213345', justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.5, shadowRadius: 10 },
  dialSteps: { fontSize: 36, fontWeight: 'bold', color: '#FFF', marginTop: -5 },
  dialLabel: { fontSize: 14, color: '#AAA', letterSpacing: 1 },
  dialGoal: { fontSize: 14, color: '#AAA', marginTop: 5 },
  dialPill: { backgroundColor: colors.primary, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 15, marginTop: 10 },
  dialPillText: { color: '#FFF', fontWeight: 'bold', fontSize: 12 },
  content: { padding: 16, borderTopLeftRadius: 30, borderTopRightRadius: 30 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 10 },
  card: { width: '48%', padding: 16, borderRadius: 16, alignItems: 'center', marginBottom: 15 },
  cardVal: { fontSize: 20, fontWeight: 'bold', marginVertical: 8 },
  cardUnit: { fontSize: 14, fontWeight: 'normal' },
  cardLabel: { fontSize: 12, color: colors.textSecondary },
  section: { padding: 20, borderRadius: 20, marginBottom: 15 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold' },
  sectionValue: { fontSize: 16, fontWeight: 'bold' },
  sectionSub: { fontSize: 12 },
  progressBarBg: { height: 10, borderRadius: 5, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: colors.primary }, 
  progressRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  progressText: { fontSize: 12 },
  remainingBtn: { flexDirection: 'row', alignItems: 'center', marginTop: 15, paddingTop: 15, borderTopWidth: 1 },
  remainingText: { marginLeft: 10, fontSize: 14 },
  chartRow: { flexDirection: 'row', justifyContent: 'space-between', height: 120, alignItems: 'flex-end' },
  chartCol: { alignItems: 'center', width: 35 },
  barBg: { width: 30, height: 80, borderRadius: 8, justifyContent: 'flex-end', overflow: 'hidden' },
  barFill: { width: '100%', backgroundColor: colors.primary },
  chartDay: { fontSize: 10, marginTop: 8 },
  chartNum: { fontSize: 10, fontWeight: 'bold', marginTop: 4 },
  walkingBadge: { flexDirection: 'row', alignItems: 'center' },
  walkingText: { marginLeft: 4, fontSize: 14 },
  activityRow: { flexDirection: 'row', justifyContent: 'space-between' },
  actCol: { alignItems: 'center' },
  actVal: { fontSize: 16, fontWeight: 'bold', marginTop: 8 },
  actUnit: { fontSize: 12, fontWeight: 'normal' },
  actLabel: { fontSize: 10, marginTop: 4, color: '#888' }
});
