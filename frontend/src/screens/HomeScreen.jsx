import React, { useContext, useEffect, useState } from 'react';
import { ScrollView, View, Text, StyleSheet, SafeAreaView, RefreshControl, ImageBackground, TouchableOpacity, Image } from 'react-native';
import { FitnessContext } from '../context/FitnessContext';
import { getHistory } from '../storage/database';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import colors from '../constants/colors';

export default function HomeScreen({ navigation }) {
  const { steps, distance, calories, activeMinutes, dailyGoal, userProfile, permissionStatus, requestSensorPermissions } = useContext(FitnessContext);
  const [history, setHistory] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = () => {
    setHistory(getHistory() || []);
    setRefreshing(false);
  };

  useEffect(() => { loadData(); }, []);
  const onRefresh = () => { setRefreshing(true); loadData(); };

  const name = userProfile?.name || 'Alex';
  const dateStr = new Date().toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
  const progressPct = dailyGoal > 0 ? Math.min((steps / dailyGoal) * 100, 100).toFixed(0) : 0;
  
  // Weekly History formatting (Last 7 days)
  const last7Days = [];
  for(let i=6; i>=0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateKey = d.toISOString().split('T')[0];
    const rec = history.find(h => h.date === dateKey);
    last7Days.push({
      dayName: d.toLocaleDateString('en-US', {weekday:'short'}),
      steps: rec ? rec.steps : 0
    });
  }

  return (
    <View style={styles.container}>
      <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} showsVerticalScrollIndicator={false}>
        
        {/* HERO SECTION */}
        <ImageBackground source={require('../../assets/hero_background.jpg')} style={styles.heroBackground}>
          <SafeAreaView style={styles.heroSafeArea}>
            {/* Top Bar */}
            <View style={styles.topBar}>
              <Text style={styles.logoText}><Text style={styles.logoWhite}>FIT</Text>STEP</Text>
              <View style={styles.topRight}>
                <TouchableOpacity style={styles.iconBtn}><Ionicons name="sunny" size={24} color="#FFF" /></TouchableOpacity>
                <View style={styles.avatar}><Ionicons name="person" size={20} color="#333" /></View>
              </View>
            </View>

            {/* Greeting */}
            <View style={styles.greetingCont}>
              <Text style={styles.greetingTitle}>Good Morning, {name} 👋</Text>
              <Text style={styles.greetingDate}>{dateStr}</Text>
            </View>

            {/* Circular Dial */}
            <View style={styles.dialContainer}>
              <View style={styles.dialOuter}>
                <View style={styles.dialInner}>
                  <MaterialCommunityIcons name="walk" size={32} color="#FFF" />
                  <Text style={styles.dialSteps}>{steps}</Text>
                  <Text style={styles.dialLabel}>STEPS</Text>
                  <Text style={styles.dialGoal}>Goal: {dailyGoal.toLocaleString()}</Text>
                  <View style={styles.dialPill}><Text style={styles.dialPillText}>{progressPct}%</Text></View>
                </View>
              </View>
            </View>
          </SafeAreaView>
        </ImageBackground>

        <View style={styles.content}>
          {/* Permission Banner */}
          {permissionStatus !== 'granted' && (
            <View style={styles.banner}>
              <Ionicons name="alert-circle-outline" size={32} color={colors.danger} />
              <View style={styles.bannerTextCont}>
                <Text style={styles.bannerTitle}>Activity Permission Denied</Text>
                <Text style={styles.bannerDesc}>Allow physical activity permission to track your real steps and fitness data.</Text>
              </View>
              <TouchableOpacity style={styles.bannerBtn} onPress={requestSensorPermissions}>
                <Text style={styles.bannerBtnText}>Enable</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* 4 Cards Grid */}
          <View style={styles.grid}>
            <View style={[styles.card, {backgroundColor: '#fff5f2'}]}>
              <MaterialCommunityIcons name="fire" size={28} color={colors.orange} />
              <Text style={styles.cardVal}>{Math.round(calories)}</Text>
              <Text style={styles.cardLabel}>Calories</Text>
            </View>
            <View style={[styles.card, {backgroundColor: '#f0f7ff'}]}>
              <Ionicons name="location-sharp" size={28} color={colors.secondary} />
              <Text style={styles.cardVal}>{distance.toFixed(2)} <Text style={styles.cardUnit}>km</Text></Text>
              <Text style={styles.cardLabel}>Distance</Text>
            </View>
            <View style={[styles.card, {backgroundColor: '#f8f0ff'}]}>
              <Ionicons name="stopwatch-outline" size={28} color={colors.purple} />
              <Text style={styles.cardVal}>{Math.floor(activeMinutes/60)}h {activeMinutes%60}m</Text>
              <Text style={styles.cardLabel}>Active Time</Text>
            </View>
            <View style={[styles.card, {backgroundColor: '#f0fcf7'}]}>
              <MaterialCommunityIcons name="target" size={28} color={colors.success} />
              <Text style={styles.cardVal}>{dailyGoal.toLocaleString()}</Text>
              <Text style={styles.cardLabel}>Daily Goal</Text>
            </View>
          </View>

          {/* Today's Progress */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Today's Progress</Text>
              <Text style={styles.sectionValue}>{progressPct}%</Text>
            </View>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, {width: `${progressPct}%`}]} />
            </View>
            <View style={styles.progressRow}>
              <Text style={styles.progressText}><Text style={{fontWeight:'bold', color:colors.text}}>{steps}</Text> / {dailyGoal} steps</Text>
              <Text style={styles.progressText}>{dailyGoal} goal</Text>
            </View>
            <TouchableOpacity style={styles.remainingBtn} onPress={() => navigation.navigate('Activity')}>
              <MaterialCommunityIcons name="shoe-print" size={20} color={colors.secondary} />
              <Text style={styles.remainingText}>{Math.max(0, dailyGoal - steps).toLocaleString()} steps remaining</Text>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} style={{marginLeft:'auto'}} />
            </TouchableOpacity>
          </View>

          {/* Weekly Steps */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Weekly Steps</Text>
              <Text style={styles.sectionSub}>Last 7 Days</Text>
            </View>
            <View style={styles.chartRow}>
              {last7Days.map((d, i) => {
                const max = Math.max(...last7Days.map(x => x.steps), dailyGoal, 1);
                const h = (d.steps / max) * 100;
                return (
                  <View key={i} style={styles.chartCol}>
                    <View style={styles.barBg}>
                      <View style={[styles.barFill, {height: `${h}%`}]} />
                    </View>
                    <Text style={styles.chartDay}>{d.dayName}</Text>
                    <Text style={styles.chartNum}>{d.steps}</Text>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Today's Activity */}
          <View style={[styles.section, {marginBottom: 40}]}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Today's Activity</Text>
              <View style={styles.walkingBadge}>
                <MaterialCommunityIcons name="walk" size={16} color={colors.success} />
                <Text style={styles.walkingText}>Walking</Text>
              </View>
            </View>
            <View style={styles.activityRow}>
              <View style={styles.actCol}>
                <MaterialCommunityIcons name="fire" size={24} color={colors.orange} />
                <Text style={styles.actVal}>{Math.round(calories)} <Text style={styles.actUnit}>kcal</Text></Text>
                <Text style={styles.actLabel}>Calories</Text>
              </View>
              <View style={styles.actCol}>
                <Ionicons name="location-sharp" size={24} color={colors.secondary} />
                <Text style={styles.actVal}>{distance.toFixed(2)} <Text style={styles.actUnit}>km</Text></Text>
                <Text style={styles.actLabel}>Distance</Text>
              </View>
              <View style={styles.actCol}>
                <Ionicons name="stopwatch-outline" size={24} color={colors.purple} />
                <Text style={styles.actVal}>{Math.floor(activeMinutes/60)}h {activeMinutes%60}m</Text>
                <Text style={styles.actLabel}>Active Time</Text>
              </View>
              <View style={styles.actCol}>
                <MaterialCommunityIcons name="shoe-print" size={24} color={colors.text} />
                <Text style={styles.actVal}>{steps}</Text>
                <Text style={styles.actLabel}>Steps</Text>
              </View>
            </View>
          </View>

        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  heroBackground: { width: '100%', height: 350, resizeMode: 'cover' },
  heroSafeArea: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', paddingTop: 40 },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, alignItems: 'center' },
  logoText: { fontSize: 24, fontWeight: '900', color: colors.primary, fontStyle: 'italic' },
  logoWhite: { color: '#FFF' },
  topRight: { flexDirection: 'row', alignItems: 'center' },
  iconBtn: { marginRight: 15 },
  avatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center' },
  greetingCont: { paddingHorizontal: 20, marginTop: 20 },
  greetingTitle: { fontSize: 22, fontWeight: 'bold', color: '#FFF' },
  greetingDate: { fontSize: 14, color: '#DDD', marginTop: 4 },
  dialContainer: { alignItems: 'center', marginTop: 20 },
  dialOuter: { width: 220, height: 220, borderRadius: 110, backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center', borderWidth: 8, borderColor: 'rgba(255,255,255,0.2)' },
  dialInner: { width: 190, height: 190, borderRadius: 95, backgroundColor: '#213345', justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.5, shadowRadius: 10 },
  dialSteps: { fontSize: 48, fontWeight: 'bold', color: '#FFF', marginTop: -5 },
  dialLabel: { fontSize: 14, color: '#AAA', letterSpacing: 1 },
  dialGoal: { fontSize: 14, color: '#AAA', marginTop: 5 },
  dialPill: { backgroundColor: colors.primary, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 15, marginTop: 10 },
  dialPillText: { color: '#FFF', fontWeight: 'bold', fontSize: 12 },
  content: { padding: 16, marginTop: -20, backgroundColor: colors.background, borderTopLeftRadius: 30, borderTopRightRadius: 30 },
  banner: { flexDirection: 'row', backgroundColor: '#ffe5e5', padding: 16, borderRadius: 16, alignItems: 'center', marginBottom: 20 },
  bannerTextCont: { flex: 1, marginLeft: 12 },
  bannerTitle: { fontSize: 14, fontWeight: 'bold', color: colors.danger },
  bannerDesc: { fontSize: 12, color: '#555', marginTop: 2 },
  bannerBtn: { backgroundColor: colors.danger, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  bannerBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 12 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  card: { width: '48%', padding: 16, borderRadius: 16, alignItems: 'center', marginBottom: 15 },
  cardVal: { fontSize: 20, fontWeight: 'bold', color: colors.text, marginVertical: 8 },
  cardUnit: { fontSize: 14, fontWeight: 'normal' },
  cardLabel: { fontSize: 12, color: colors.textSecondary },
  section: { backgroundColor: colors.card, padding: 20, borderRadius: 20, marginBottom: 15 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: colors.text },
  sectionValue: { fontSize: 16, fontWeight: 'bold', color: colors.text },
  sectionSub: { fontSize: 12, color: colors.textSecondary },
  progressBarBg: { height: 10, backgroundColor: colors.background, borderRadius: 5, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: colors.background }, // Should be gray if 0
  progressRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  progressText: { fontSize: 12, color: colors.textSecondary },
  remainingBtn: { flexDirection: 'row', alignItems: 'center', marginTop: 15, paddingTop: 15, borderTopWidth: 1, borderColor: colors.background },
  remainingText: { marginLeft: 10, fontSize: 14, color: colors.text },
  chartRow: { flexDirection: 'row', justifyContent: 'space-between', height: 120, alignItems: 'flex-end' },
  chartCol: { alignItems: 'center', width: 35 },
  barBg: { width: 30, height: 80, backgroundColor: colors.background, borderRadius: 8, justifyContent: 'flex-end', overflow: 'hidden' },
  barFill: { width: '100%', backgroundColor: colors.background },
  chartDay: { fontSize: 10, color: colors.textSecondary, marginTop: 8 },
  chartNum: { fontSize: 10, fontWeight: 'bold', color: colors.text, marginTop: 4 },
  walkingBadge: { flexDirection: 'row', alignItems: 'center' },
  walkingText: { marginLeft: 4, fontSize: 14, color: colors.text },
  activityRow: { flexDirection: 'row', justifyContent: 'space-between' },
  actCol: { alignItems: 'center' },
  actVal: { fontSize: 16, fontWeight: 'bold', color: colors.text, marginTop: 8 },
  actUnit: { fontSize: 12, fontWeight: 'normal' },
  actLabel: { fontSize: 10, color: colors.textSecondary, marginTop: 4 }
});