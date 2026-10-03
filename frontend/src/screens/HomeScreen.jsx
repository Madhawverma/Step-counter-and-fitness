import React, { useContext, useEffect, useState } from 'react';
import { ScrollView, View, Text, StyleSheet, SafeAreaView, RefreshControl } from 'react-native';
import { FitnessContext } from '../context/FitnessContext';
import { getHistory } from '../storage/database';
import StepCounterCard from '../components/StepCounterCard';
import CalorieCard from '../components/CalorieCard';
import DistanceCard from '../components/DistanceCard';
import ActiveTimeCard from '../components/ActiveTimeCard';
import GoalProgress from '../components/GoalProgress';
import WeeklyChart from '../components/WeeklyChart';
import colors from '../constants/colors';

export default function HomeScreen() {
  const { steps, distance, calories, activeMinutes, dailyGoal, sensorAvailable, permissionStatus } = useContext(FitnessContext);
  const [history, setHistory] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = () => {
    setHistory(getHistory() || []);
    setRefreshing(false);
  };

  useEffect(() => { loadData(); }, []);
  const onRefresh = () => { setRefreshing(true); loadData(); };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.title}>FITSTEP</Text>
          {sensorAvailable === false && <Text style={styles.warning}>Sensor Unavailable</Text>}
          {permissionStatus === 'denied' && <Text style={styles.warning}>Permission Denied</Text>}
        </View>

        <StepCounterCard steps={steps} goal={dailyGoal} />
        <GoalProgress steps={steps} goal={dailyGoal} />

        <View style={styles.row}>
          <CalorieCard calories={calories} />
          <DistanceCard distance={distance} />
          <ActiveTimeCard minutes={activeMinutes} />
        </View>

        <WeeklyChart data={history} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: 16 },
  header: { paddingVertical: 10, alignItems: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', color: colors.text },
  warning: { color: colors.danger, marginTop: 4 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }
});