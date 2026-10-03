import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Text, SafeAreaView } from 'react-native';
import { getHistory } from '../storage/database';
import HistoryItem from '../components/HistoryItem';
import EmptyState from '../components/EmptyState';
import colors from '../constants/colors';

export default function HistoryScreen() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const data = getHistory() || [];
    setHistory(data);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Activity History</Text>
      {history.length === 0 ? (
        <EmptyState message="No history available yet. Start walking!" />
      ) : (
        <FlatList
          data={history}
          keyExtractor={item => item.date}
          renderItem={({ item }) => <HistoryItem item={item} />}
          contentContainerStyle={{ padding: 16 }}
        />
      )}
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  title: { fontSize: 28, fontWeight: 'bold', color: colors.text, margin: 16, marginBottom: 0 }
});