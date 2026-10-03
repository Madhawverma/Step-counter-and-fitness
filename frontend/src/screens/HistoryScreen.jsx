import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useColorScheme, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { FitnessContext } from '../context/FitnessContext';
import { getHistory } from '../storage/database';

export default function HistoryScreen({ navigation }) {
  const { steps: liveSteps, distance: liveDist, calories: liveCal, activeMinutes: liveMins, dailyGoal } = useContext(FitnessContext);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [filter, setFilter] = useState('Daily');
  const [history, setHistory] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    loadData();
  }, [liveSteps]); // Reload when live steps change to keep today updated

  const loadData = () => {
    const dbHistory = getHistory() || [];
    
    // Merge live today data if needed
    const todayStr = new Date().toISOString().split('T')[0];
    const todayIndex = dbHistory.findIndex(h => h.date === todayStr);
    
    if (todayIndex >= 0) {
      dbHistory[todayIndex] = { ...dbHistory[todayIndex], steps: liveSteps, distance: liveDist, calories: liveCal, activeMinutes: liveMins };
    } else if (liveSteps > 0) {
      dbHistory.unshift({ date: todayStr, steps: liveSteps, distance: liveDist, calories: liveCal, activeMinutes: liveMins, goal: dailyGoal });
    }
    
    setHistory([...dbHistory]);
  };

  const theme = {
    bg: isDark ? '#0b132b' : '#f8f9fa',
    card: isDark ? '#1c2541' : '#ffffff',
    text: isDark ? '#ffffff' : '#1a1a1a',
    textSub: isDark ? '#8d99ae' : '#6c757d',
    primary: '#00d27f',
    border: isDark ? '#2b3a55' : '#e9ecef',
    pillBg: isDark ? '#2b3a55' : '#f1f3f5',
    progressBg: isDark ? '#2b3a55' : '#e9ecef'
  };

  const filters = ['Daily', 'Weekly', 'Monthly'];

  const selectedRecord = history.find(h => h.date === selectedDate) || { steps: 0, calories: 0, distance: 0, activeMinutes: 0, goal: dailyGoal };
  
  const progressPct = selectedRecord.goal > 0 ? Math.min((selectedRecord.steps / selectedRecord.goal) * 100, 100) : 0;
  const remaining = Math.max((selectedRecord.goal || dailyGoal) - selectedRecord.steps, 0);

  // Last 7 Days for Chart
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

  const renderHistoryItem = ({ item, index }) => {
    const isSelected = item.date === selectedDate;
    const d = new Date(item.date);
    const dateDisplay = d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
    
    // Cycle colors for icons to match design
    const iconColors = ['#00d27f', '#2196f3', '#ff9800', '#9c27b0'];
    const iconColor = iconColors[index % iconColors.length];

    return (
      <TouchableOpacity 
        style={[styles.recordItem, { backgroundColor: isSelected ? (isDark ? '#112211' : '#f0fff0') : theme.card, borderColor: isSelected ? theme.primary : theme.border, borderWidth: isSelected ? 1 : 0 }]}
        onPress={() => setSelectedDate(item.date)}
      >
        <View style={[styles.recordIconBox, { backgroundColor: iconColor + '20' }]}>
          <MaterialCommunityIcons name="shoe-print" size={24} color={iconColor} />
        </View>
        <View style={styles.recordContent}>
          <Text style={[styles.recordDate, { color: theme.text }]}>{dateDisplay}</Text>
          <View style={styles.recordStatsRow}>
            <Text style={[styles.recordStat, { color: theme.textSub }]}>{item.steps.toLocaleString()} <Text style={{fontSize:10}}>steps</Text></Text>
            <Text style={[styles.recordStat, { color: theme.textSub }]}>{item.distance.toFixed(1)} <Text style={{fontSize:10}}>km</Text></Text>
            <Text style={[styles.recordStat, { color: theme.textSub }]}>{Math.round(item.calories)} <Text style={{fontSize:10}}>kcal</Text></Text>
            <Text style={[styles.recordStat, { color: theme.textSub }]}>{Math.floor(item.activeMinutes/60)}h {item.activeMinutes%60}m</Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={20} color={theme.textSub} />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.bg }]}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.logoText}><Text style={{ color: theme.text }}>FIT</Text>STEP</Text>
          <View style={styles.headerTopRight}>
            <TouchableOpacity style={styles.iconBtn}><Ionicons name="calendar-outline" size={24} color={theme.text} /></TouchableOpacity>
            <View style={styles.avatar}><Ionicons name="person" size={20} color="#333" /></View>
          </View>
        </View>
        <Text style={[styles.title, { color: theme.text }]}>Activity History</Text>
        <Text style={styles.subtitle}>View your past activity and progress</Text>
      </View>

      {/* FILTERS */}
      <View style={styles.filterContainer}>
        <View style={[styles.filterGroup, { backgroundColor: theme.pillBg }]}>
          {filters.map(f => (
            <TouchableOpacity key={f} onPress={() => setFilter(f)} style={[styles.filterBtn, filter === f && styles.filterBtnActive]}>
              <Text style={[styles.filterText, filter === f ? styles.filterTextActive : { color: theme.textSub }]}>{f}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity style={[styles.calBtn, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Ionicons name="calendar" size={16} color={theme.text} style={{marginRight:6}} />
          <Text style={[styles.calBtnText, { color: theme.text }]}>Calendar</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={history}
        keyExtractor={item => item.date}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={<>
          
          {/* SELECTED DAY SUMMARY */}
          <View style={styles.dateHeaderRow}>
            <Text style={[styles.selectedDateText, { color: theme.text }]}>
              {new Date(selectedDate).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
            </Text>
            <Ionicons name="chevron-forward" size={20} color={theme.textSub} />
          </View>

          <View style={styles.statsGrid}>
            <View style={[styles.statBox, { backgroundColor: isDark ? '#112233' : '#f0fbfa' }]}>
              <MaterialCommunityIcons name="shoe-print" size={24} color="#00d27f" />
              <Text style={[styles.statVal, { color: theme.text }]}>{selectedRecord.steps.toLocaleString()}</Text>
              <Text style={styles.statLabel}>Steps</Text>
            </View>
            <View style={[styles.statBox, { backgroundColor: isDark ? '#331a1a' : '#fff0eb' }]}>
              <MaterialCommunityIcons name="fire" size={24} color="#ff5722" />
              <Text style={[styles.statVal, { color: theme.text }]}>{Math.round(selectedRecord.calories)}</Text>
              <Text style={styles.statLabel}>Calories</Text>
            </View>
            <View style={[styles.statBox, { backgroundColor: isDark ? '#1a2233' : '#eef5ff' }]}>
              <Ionicons name="location-sharp" size={24} color="#2196f3" />
              <Text style={[styles.statVal, { color: theme.text }]}>{selectedRecord.distance.toFixed(1)} <Text style={{fontSize:10}}>km</Text></Text>
              <Text style={styles.statLabel}>Distance</Text>
            </View>
            <View style={[styles.statBox, { backgroundColor: isDark ? '#221a33' : '#f5eeff' }]}>
              <Ionicons name="time" size={24} color="#9c27b0" />
              <Text style={[styles.statVal, { color: theme.text }]}>{Math.floor(selectedRecord.activeMinutes/60)}h {selectedRecord.activeMinutes%60}m</Text>
              <Text style={styles.statLabel}>Active Time</Text>
            </View>
          </View>

          {/* DAILY PROGRESS */}
          <View style={[styles.card, { backgroundColor: theme.card }]}>
            <View style={styles.cardHeader}>
              <Text style={[styles.cardTitle, { color: theme.text }]}>Daily Progress</Text>
              <Text style={[styles.cardTitle, { color: theme.text }]}>{progressPct.toFixed(0)}%</Text>
            </View>
            <View style={[styles.progressBg, { backgroundColor: theme.progressBg }]}>
              <View style={[styles.progressFill, { width: `${progressPct}%` }]} />
            </View>
            <View style={styles.progressRow}>
              <Text style={[styles.progressText, { color: theme.textSub }]}><Text style={{ color: theme.text, fontWeight: 'bold' }}>{selectedRecord.steps.toLocaleString()}</Text> / {(selectedRecord.goal || dailyGoal).toLocaleString()} steps</Text>
              <Text style={[styles.progressText, { color: theme.textSub }]}>{remaining > 0 ? `${remaining.toLocaleString()} steps remaining` : 'Goal Completed'}</Text>
            </View>
          </View>

          {/* LAST 7 DAYS CHART */}
          <View style={[styles.card, { backgroundColor: theme.card }]}>
            <View style={styles.cardHeader}>
              <Text style={[styles.cardTitle, { color: theme.text }]}>Last 7 Days</Text>
              <View style={[styles.dropdownBtn, { backgroundColor: theme.pillBg }]}>
                <Text style={{color: theme.textSub, fontSize: 12}}>Steps</Text>
                <Ionicons name="chevron-down" size={14} color={theme.textSub} style={{marginLeft:4}} />
              </View>
            </View>
            <View style={styles.chartRow}>
              {last7Days.map((d, i) => {
                const max = Math.max(...last7Days.map(x => x.steps), dailyGoal, 1);
                const h = (d.steps / max) * 100;
                return (
                  <View key={i} style={styles.chartCol}>
                    <Text style={[styles.chartNumTop, { color: theme.textSub }]}>{d.steps > 0 ? (d.steps/1000).toFixed(1)+'K' : '0'}</Text>
                    <View style={[styles.barBg, { backgroundColor: theme.progressBg }]}>
                      {d.steps > 0 && <View style={[styles.barFill, { height: `${h}%` }]} />}
                    </View>
                    <Text style={[styles.chartDay, { color: theme.textSub }]}>{d.dayName}</Text>
                  </View>
                );
              })}
            </View>
          </View>

          {/* DAILY RECORDS HEADER */}
          <View style={styles.recordsHeader}>
            <Text style={[styles.cardTitle, { color: theme.text }]}>Daily Records</Text>
            <TouchableOpacity style={styles.filterIconBtn}>
              <Ionicons name="filter" size={20} color={theme.textSub} />
            </TouchableOpacity>
          </View>

        </>}
        
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="history" size={48} color={theme.textSub} style={{ opacity: 0.5, marginBottom: 10 }} />
            <Text style={[styles.emptyTitle, { color: theme.text }]}>No Activity History Yet</Text>
            <Text style={[styles.emptySub, { color: theme.textSub }]}>Start walking to build your activity history.</Text>
          </View>
        }
        
        renderItem={renderHistoryItem}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  header: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 15 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  logoText: { fontSize: 20, fontWeight: '900', color: '#00d27f', fontStyle: 'italic' },
  headerTopRight: { flexDirection: 'row', alignItems: 'center' },
  iconBtn: { marginRight: 15 },
  avatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#DDD', justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 32, fontWeight: 'bold' },
  subtitle: { fontSize: 14, color: '#888', marginTop: 4 },
  
  filterContainer: { flexDirection: 'row', paddingHorizontal: 20, marginBottom: 20, justifyContent: 'space-between' },
  filterGroup: { flexDirection: 'row', borderRadius: 20, padding: 4 },
  filterBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 16 },
  filterBtnActive: { backgroundColor: '#00d27f' },
  filterText: { fontSize: 13, fontWeight: '600' },
  filterTextActive: { color: '#FFF' },
  calBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, borderRadius: 20, borderWidth: 1 },
  calBtnText: { fontSize: 13, fontWeight: '600' },

  listContent: { paddingHorizontal: 20, paddingBottom: 40 },
  dateHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  selectedDateText: { fontSize: 16, fontWeight: 'bold' },

  statsGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  statBox: { width: '23%', paddingVertical: 15, borderRadius: 16, alignItems: 'center' },
  statVal: { fontSize: 14, fontWeight: 'bold', marginTop: 8 },
  statLabel: { fontSize: 10, color: '#888', marginTop: 4 },

  card: { padding: 20, borderRadius: 24, marginBottom: 20 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  cardTitle: { fontSize: 18, fontWeight: 'bold' },
  progressBg: { height: 12, borderRadius: 6, overflow: 'hidden', marginBottom: 12 },
  progressFill: { height: '100%', backgroundColor: '#00d27f', borderRadius: 6 },
  progressRow: { flexDirection: 'row', justifyContent: 'space-between' },
  progressText: { fontSize: 12 },

  dropdownBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  chartRow: { flexDirection: 'row', justifyContent: 'space-between', height: 160, alignItems: 'flex-end', marginTop: 10 },
  chartCol: { alignItems: 'center', width: 35 },
  barBg: { width: 30, height: 100, borderRadius: 6, justifyContent: 'flex-end', overflow: 'hidden', marginTop: 5, marginBottom: 5 },
  barFill: { width: '100%', backgroundColor: '#00d27f', borderRadius: 6 },
  chartDay: { fontSize: 10 },
  chartNumTop: { fontSize: 10 },

  recordsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  filterIconBtn: { padding: 4 },
  
  recordItem: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 16, marginBottom: 10 },
  recordIconBox: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  recordContent: { flex: 1 },
  recordDate: { fontSize: 14, fontWeight: 'bold', marginBottom: 6 },
  recordStatsRow: { flexDirection: 'row', flexWrap: 'wrap' },
  recordStat: { fontSize: 12, marginRight: 12 },

  emptyState: { alignItems: 'center', paddingVertical: 40 },
  emptyTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
  emptySub: { fontSize: 12, textAlign: 'center' },
});
