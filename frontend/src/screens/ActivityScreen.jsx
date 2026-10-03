import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { FitnessContext } from '../context/FitnessContext';
import { getHistory } from '../storage/database';

export default function ActivityScreen({ navigation }) {
  const { steps, distance, calories, activeMinutes, dailyGoal, permissionStatus, requestSensorPermissions } = useContext(FitnessContext);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [filter, setFilter] = useState('Today');
  const [history, setHistory] = useState([]);

  useEffect(() => {
    setHistory(getHistory() || []);
  }, []);

  // Theme Colors
  const theme = {
    bg: isDark ? '#0b132b' : '#f8f9fa',
    card: isDark ? '#1c2541' : '#ffffff',
    text: isDark ? '#ffffff' : '#1a1a1a',
    textSub: isDark ? '#8d99ae' : '#6c757d',
    primary: '#00d27f',
    border: isDark ? '#2b3a55' : '#e9ecef',
    pillBg: isDark ? '#2b3a55' : '#f1f3f5',
    progressBg: isDark ? '#2b3a55' : '#e9ecef',
    red: '#ff4d4f'
  };

  const progressPct = dailyGoal > 0 ? Math.min((steps / dailyGoal) * 100, 100) : 0;
  const remaining = Math.max(dailyGoal - steps, 0);
  
  const isGoalCompleted = steps >= dailyGoal && dailyGoal > 0;
  let motivationTitle = isGoalCompleted ? "Goal Completed! 🎉" : (remaining < 2000 ? "Almost There! 🔥" : "Keep Going! 🎯");
  let motivationSub = isGoalCompleted ? "You crushed your daily goal!" : `You're ${remaining.toLocaleString()} steps away from your daily goal.`;

  const filters = ['Today', 'Yesterday', 'This Week', 'Custom'];

  // Calculate Last 7 Days for Chart
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
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.bg }]}>
      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
        
        {/* HEADER */}
        <View style={styles.header}>
        <Text style={styles.logoText}><Text style={{ color: theme.text }}>FIT</Text>STEP</Text>
        <View style={styles.avatar}><Ionicons name="person" size={20} color="#333" /></View>
      </View>
        </View>

        {/* FILTER */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll} contentContainerStyle={styles.filterContent}>
          {filters.map(f => {
            const isActive = filter === f;
            return (
              <TouchableOpacity key={f} onPress={() => setFilter(f)} style={[styles.filterPill, isActive ? styles.filterPillActive : { backgroundColor: 'transparent' }]}>
                {isActive && <Ionicons name="calendar" size={16} color="#FFF" style={{marginRight: 6}} />}
                <Text style={[styles.filterText, isActive ? styles.filterTextActive : { color: theme.textSub }]}>{f}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View style={styles.content}>
          {permissionStatus !== 'granted' && (
            <View style={[styles.permissionBanner, { backgroundColor: isDark ? 'rgba(255, 77, 79, 0.15)' : '#ffe5e5' }]}>
              <Ionicons name="alert-circle-outline" size={28} color={theme.red} />
              <View style={styles.permTextCont}>
                <Text style={[styles.permTitle, { color: theme.red }]}>Activity Tracking Disabled</Text>
                <Text style={[styles.permDesc, { color: isDark ? '#ffb3b3' : '#555' }]}>Allow physical activity permission to track your real activity.</Text>
              </View>
              <TouchableOpacity style={[styles.permBtn, { backgroundColor: theme.red }]} onPress={requestSensorPermissions}>
                <Text style={styles.permBtnText}>Enable</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* TODAY'S ACTIVITY */}
          <View style={[styles.card, { backgroundColor: theme.card }]}>
            <View style={styles.cardHeader}>
              <Text style={[styles.cardTitle, { color: theme.text }]}>Today's Activity</Text>
              <View style={styles.walkingBadge}>
                <MaterialCommunityIcons name="walk" size={16} color={theme.primary} />
                <Text style={[styles.walkingText, { color: theme.text }]}>Walking <Ionicons name="chevron-forward" size={12}/></Text>
              </View>
            </View>
            <View style={styles.statsGrid}>
              <View style={[styles.statBox, { backgroundColor: isDark ? '#112233' : '#f0fbfa' }]}>
                <MaterialCommunityIcons name="shoe-print" size={24} color="#00bcd4" />
                <Text style={[styles.statVal, { color: theme.text }]}>{steps}</Text>
                <Text style={styles.statLabel}>Steps</Text>
              </View>
              <View style={[styles.statBox, { backgroundColor: isDark ? '#331a1a' : '#fff0eb' }]}>
                <MaterialCommunityIcons name="fire" size={24} color="#ff5722" />
                <Text style={[styles.statVal, { color: theme.text }]}>{Math.round(calories)}</Text>
                <Text style={styles.statLabel}>Calories</Text>
              </View>
              <View style={[styles.statBox, { backgroundColor: isDark ? '#1a2233' : '#eef5ff' }]}>
                <Ionicons name="location-sharp" size={24} color="#2196f3" />
                <Text style={[styles.statVal, { color: theme.text }]}>{distance.toFixed(2)} <Text style={{fontSize: 12}}>km</Text></Text>
                <Text style={styles.statLabel}>Distance</Text>
              </View>
              <View style={[styles.statBox, { backgroundColor: isDark ? '#221a33' : '#f5eeff' }]}>
                <Ionicons name="time" size={24} color="#9c27b0" />
                <Text style={[styles.statVal, { color: theme.text }]}>{Math.floor(activeMinutes/60)}h {activeMinutes%60}m</Text>
                <Text style={styles.statLabel}>Active Time</Text>
              </View>
            </View>
          </View>

          {/* PROGRESS */}
          <View style={[styles.card, { backgroundColor: theme.card }]}>
            <View style={styles.cardHeader}>
              <Text style={[styles.cardTitle, { color: theme.text }]}>Activity Progress</Text>
              <Text style={[styles.cardTitle, { color: theme.text }]}>{progressPct.toFixed(0)}%</Text>
            </View>
            <View style={[styles.progressBg, { backgroundColor: theme.progressBg }]}>
              <View style={[styles.progressFill, { width: `${progressPct}%` }]} />
            </View>
            <View style={styles.progressRow}>
              <Text style={[styles.progressText, { color: theme.textSub }]}><Text style={{ color: theme.text, fontWeight: 'bold' }}>{steps.toLocaleString()}</Text> / {dailyGoal.toLocaleString()} steps</Text>
              <Text style={[styles.progressText, { color: theme.textSub }]}>{remaining > 0 ? `${remaining.toLocaleString()} steps remaining` : 'Goal Achieved'}</Text>
            </View>
          </View>

          {/* MOTIVATION */}
          <View style={[styles.motivationCard, { backgroundColor: isDark ? '#1a2c1a' : '#e6fce6' }]}>
            <Text style={{fontSize: 32, marginRight: 15}}>🏆</Text>
            <View style={{ flex: 1 }}>
              <Text style={[styles.motivTitle, { color: theme.text }]}>{motivationTitle}</Text>
              <Text style={[styles.motivSub, { color: theme.textSub }]}>{motivationSub}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.text} />
          </View>

          {/* TIMELINE (Empty State as per rules) */}
          <View style={[styles.card, { backgroundColor: theme.card }]}>
            <View style={styles.cardHeader}>
              <Text style={[styles.cardTitle, { color: theme.text }]}>Activity Timeline</Text>
              <Text style={[styles.sectionSub, { color: theme.textSub }]}>0 sessions</Text>
            </View>
            <View style={styles.emptyState}>
              <MaterialCommunityIcons name="history" size={48} color={theme.textSub} style={{ opacity: 0.5, marginBottom: 10 }} />
              <Text style={[styles.emptyTitle, { color: theme.text }]}>No activity sessions recorded</Text>
              <Text style={[styles.emptySub, { color: theme.textSub }]}>Start walking to see your detailed sessions here.</Text>
            </View>
          </View>

          {/* WEEKLY ACTIVITY */}
          <View style={[styles.card, { backgroundColor: theme.card }]}>
            <View style={styles.cardHeader}>
              <Text style={[styles.cardTitle, { color: theme.text }]}>Weekly Activity</Text>
              <Text style={[styles.sectionSub, { color: theme.textSub }]}>Last 7 Days</Text>
            </View>
            <View style={styles.chartRow}>
              {last7Days.map((d, i) => {
                const max = Math.max(...last7Days.map(x => x.steps), dailyGoal, 1);
                const h = (d.steps / max) * 100;
                return (
                  <View key={i} style={styles.chartCol}>
                    <View style={[styles.barBg, { backgroundColor: theme.progressBg }]}>
                      {d.steps > 0 && <View style={[styles.barFill, { height: `${h}%` }]} />}
                    </View>
                    <Text style={[styles.chartDay, { color: theme.textSub }]}>{d.dayName}</Text>
                    <Text style={[styles.chartNum, { color: theme.text }]}>{d.steps > 0 ? (d.steps/1000).toFixed(1)+'K' : '0'}</Text>
                  </View>
                );
              })}
            </View>
          </View>

          {/* STAY ACTIVE */}
          <View style={[styles.stayActiveCard, { backgroundColor: isDark ? '#1a2c1a' : '#e6fce6' }]}>
             <MaterialCommunityIcons name="shoe-sneaker" size={32} color={theme.primary} style={{marginRight: 15, opacity: 0.8}} />
             <View style={{ flex: 1 }}>
               <Text style={[styles.stayTitle, { color: theme.text }]}>Stay Active</Text>
               <Text style={[styles.staySub, { color: theme.textSub }]}>Regular activity helps you stay healthy and fit.</Text>
             </View>
          </View>

          <View style={{ height: 40 }} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 10, paddingBottom: 15 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  logoText: { fontSize: 20, fontWeight: '900', color: '#00d27f', fontStyle: 'italic' },
  avatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#DDD', justifyContent: 'center', alignItems: 'center' },
  headerTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  title: { fontSize: 32, fontWeight: 'bold' },
  subtitle: { fontSize: 14, color: '#888', marginTop: 4 },
  headerRight: { flexDirection: 'row', alignItems: 'center' },
  dateBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, borderWidth: 1, marginRight: 10 },
  dateBtnText: { marginLeft: 6, fontSize: 12, fontWeight: 'bold' },
  iconBtn: { padding: 8, borderRadius: 12, borderWidth: 1 },
  filterScroll: { paddingHorizontal: 15, marginBottom: 20 },
  filterContent: { paddingRight: 30 },
  filterPill: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginHorizontal: 5, flexDirection: 'row', alignItems: 'center' },
  filterPillActive: { backgroundColor: '#00d27f' },
  filterText: { fontSize: 14, fontWeight: '600' },
  filterTextActive: { color: '#FFF' },
  content: { paddingHorizontal: 20 },
  permissionBanner: { flexDirection: 'row', padding: 16, borderRadius: 16, alignItems: 'center', marginBottom: 20 },
  permTextCont: { flex: 1, marginLeft: 12 },
  permTitle: { fontSize: 14, fontWeight: 'bold' },
  permDesc: { fontSize: 12, marginTop: 2 },
  permBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  permBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 12 },
  card: { padding: 20, borderRadius: 24, marginBottom: 20 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  cardTitle: { fontSize: 18, fontWeight: 'bold' },
  walkingBadge: { flexDirection: 'row', alignItems: 'center' },
  walkingText: { marginLeft: 4, fontSize: 14, fontWeight: '500' },
  statsGrid: { flexDirection: 'row', justifyContent: 'space-between' },
  statBox: { width: '23%', paddingVertical: 15, borderRadius: 16, alignItems: 'center' },
  statVal: { fontSize: 16, fontWeight: 'bold', marginTop: 8 },
  statLabel: { fontSize: 10, color: '#888', marginTop: 4 },
  progressBg: { height: 12, borderRadius: 6, overflow: 'hidden', marginBottom: 12 },
  progressFill: { height: '100%', backgroundColor: '#00d27f', borderRadius: 6 },
  progressRow: { flexDirection: 'row', justifyContent: 'space-between' },
  progressText: { fontSize: 12 },
  motivationCard: { flexDirection: 'row', padding: 20, borderRadius: 20, alignItems: 'center', marginBottom: 20 },
  motivTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  motivSub: { fontSize: 12 },
  sectionSub: { fontSize: 12 },
  emptyState: { alignItems: 'center', paddingVertical: 30 },
  emptyTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
  emptySub: { fontSize: 12, textAlign: 'center' },
  chartRow: { flexDirection: 'row', justifyContent: 'space-between', height: 140, alignItems: 'flex-end', marginTop: 10 },
  chartCol: { alignItems: 'center', width: 35 },
  barBg: { width: 32, height: 100, borderRadius: 8, justifyContent: 'flex-end', overflow: 'hidden' },
  barFill: { width: '100%', backgroundColor: '#00d27f', borderRadius: 8 },
  chartDay: { fontSize: 10, marginTop: 8 },
  chartNum: { fontSize: 10, fontWeight: 'bold', marginTop: 4 },
  stayActiveCard: { flexDirection: 'row', padding: 20, borderRadius: 20, alignItems: 'center', marginBottom: 20 },
  stayTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  staySub: { fontSize: 12 }
});
