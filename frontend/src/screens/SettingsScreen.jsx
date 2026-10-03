import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useColorScheme, Switch, Alert, TextInput, Modal, Appearance } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { FitnessContext } from '../context/FitnessContext';
import { clearAllHistory } from '../storage/database';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SettingsScreen({ navigation }) {
  const { dailyGoal, updateGoals, isTracking, setDailySteps, setDistance, setCalories, setActiveMinutes } = useContext(FitnessContext);
  
  // Basic theme tracking (in a real app, this needs a global context or App.jsx wrapper, but we use Appearance here)
  const systemTheme = useColorScheme();
  const [appTheme, setAppTheme] = useState('System'); 
  const isDark = appTheme === 'System' ? systemTheme === 'dark' : appTheme === 'Dark';

  const [unit, setUnit] = useState('km');
  const [reminders, setReminders] = useState(true);

  const [modalVisible, setModalVisible] = useState(false);
  const [tempGoal, setTempGoal] = useState(dailyGoal ? dailyGoal.toString() : '10000');

  const theme = {
    bg: isDark ? '#0b132b' : '#f8f9fa',
    card: isDark ? '#1c2541' : '#ffffff',
    text: isDark ? '#ffffff' : '#1a1a1a',
    textSub: isDark ? '#8d99ae' : '#6c757d',
    primary: '#00d27f',
    border: isDark ? '#2b3a55' : '#e9ecef',
    iconBg: isDark ? '#2b3a55' : '#f1f3f5',
    activePill: isDark ? '#00d27f' : '#0d6efd',
  };

  const handleClearData = () => {
    Alert.alert(
      "Clear Local Data?",
      "This will permanently remove locally stored fitness information.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Clear Data", 
          style: "destructive",
          onPress: () => {
            clearAllHistory();
            setDailySteps(0);
            setDistance(0);
            setCalories(0);
            setActiveMinutes(0);
            Alert.alert("Success", "All local data has been cleared.");
          }
        }
      ]
    );
  };

  const saveGoal = () => {
    const val = parseInt(tempGoal);
    if (!isNaN(val) && val > 0) {
      updateGoals({ dailyStepsGoal: val });
      setModalVisible(false);
    } else {
      Alert.alert("Invalid", "Please enter a valid number.");
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.bg }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.logoText}><Text style={{ color: theme.text }}>FIT</Text>STEP</Text>
          <View style={styles.avatar}><Ionicons name="person" size={20} color="#333" /></View>
        </View>

        <Text style={[styles.title, { color: theme.text }]}>Settings</Text>
        <Text style={[styles.subtitle, { color: theme.textSub }]}>Customize your fitness experience</Text>

        {/* PREF CARD */}
        <View style={[styles.prefCard, { backgroundColor: isDark ? '#0d222b' : '#eef5ff' }]}>
          <View style={[styles.prefIcon, { backgroundColor: isDark ? '#00d27f' : '#0d6efd' }]}>
            <Ionicons name="settings" size={24} color="#FFF" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.prefTitle, { color: theme.text }]}>App Preferences</Text>
            <Text style={[styles.prefSub, { color: theme.textSub }]}>Manage appearance, units, notifications and app behavior.</Text>
          </View>
        </View>

        {/* APPEARANCE */}
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Appearance</Text>
        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <View style={[styles.iconBox, { backgroundColor: 'rgba(255,193,7,0.1)' }]}>
                <Ionicons name="sunny" size={20} color="#ffc107" />
              </View>
              <View>
                <Text style={[styles.rowTitle, { color: theme.text }]}>Theme</Text>
                <Text style={[styles.rowSub, { color: theme.textSub }]}>Choose your preferred theme</Text>
              </View>
            </View>
            <View style={[styles.themeSelector, { backgroundColor: isDark ? '#111b3d' : '#f1f3f5' }]}>
              {['System', 'Light', 'Dark'].map(t => (
                <TouchableOpacity 
                  key={t} 
                  style={[styles.themeBtn, appTheme === t && { backgroundColor: theme.activePill }]}
                  onPress={() => setAppTheme(t)}
                >
                  <Text style={[styles.themeBtnText, appTheme === t ? { color: '#FFF' } : { color: theme.textSub }]}>{t}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* FITNESS SETTINGS */}
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Fitness Settings</Text>
        <View style={[styles.card, { backgroundColor: theme.card, paddingVertical: 5 }]}>
          <TouchableOpacity style={styles.listItem} onPress={() => setModalVisible(true)}>
            <View style={styles.rowLeft}>
              <View style={[styles.iconBox, { backgroundColor: 'rgba(0,210,127,0.1)' }]}>
                <Ionicons name="disc" size={20} color="#00d27f" />
              </View>
              <View>
                <Text style={[styles.rowTitle, { color: theme.text }]}>Daily Step Goal</Text>
                <Text style={[styles.rowSub, { color: theme.textSub }]}>Set your daily step target</Text>
              </View>
            </View>
            <View style={styles.rowRight}>
              <Text style={[styles.rowValue, { color: theme.textSub }]}>{dailyGoal?.toLocaleString()} steps</Text>
              <Ionicons name="chevron-forward" size={16} color={theme.textSub} style={{marginLeft: 8}} />
            </View>
          </TouchableOpacity>

          <View style={[styles.divider, { backgroundColor: theme.border }]} />

          <TouchableOpacity style={styles.listItem} onPress={() => setUnit(unit === 'km' ? 'mi' : 'km')}>
            <View style={styles.rowLeft}>
              <View style={[styles.iconBox, { backgroundColor: 'rgba(156,39,176,0.1)' }]}>
                <MaterialCommunityIcons name="map-marker-distance" size={20} color="#9c27b0" />
              </View>
              <View>
                <Text style={[styles.rowTitle, { color: theme.text }]}>Distance Unit</Text>
                <Text style={[styles.rowSub, { color: theme.textSub }]}>Choose distance measurement</Text>
              </View>
            </View>
            <View style={styles.rowRight}>
              <Text style={[styles.rowValue, { color: theme.textSub }]}>{unit === 'km' ? 'Kilometers (km)' : 'Miles (mi)'}</Text>
              <Ionicons name="chevron-forward" size={16} color={theme.textSub} style={{marginLeft: 8}} />
            </View>
          </TouchableOpacity>
        </View>

        {/* ACTIVITY TRACKING */}
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Activity Tracking</Text>
        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <View style={[styles.iconBox, { backgroundColor: 'rgba(33,150,243,0.1)' }]}>
                <Ionicons name="walk" size={20} color="#2196f3" />
              </View>
              <View>
                <Text style={[styles.rowTitle, { color: theme.text }]}>Activity Tracking</Text>
                <Text style={[styles.rowSub, { color: theme.textSub }]}>Track real steps using device sensors</Text>
              </View>
            </View>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>{isTracking ? 'Enabled' : 'Unavailable'}</Text>
            </View>
          </View>
        </View>

        {/* NOTIFICATIONS */}
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Notifications</Text>
        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <View style={[styles.iconBox, { backgroundColor: 'rgba(255,87,34,0.1)' }]}>
                <Ionicons name="notifications" size={20} color="#ff5722" />
              </View>
              <View>
                <Text style={[styles.rowTitle, { color: theme.text }]}>Daily Activity Reminder</Text>
                <Text style={[styles.rowSub, { color: theme.textSub }]}>Get reminded to stay active</Text>
              </View>
            </View>
            <Switch
              value={reminders}
              onValueChange={setReminders}
              trackColor={{ false: theme.border, true: '#00d27f' }}
              thumbColor="#FFF"
            />
          </View>
        </View>

        {/* DATA & PRIVACY */}
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Data & Privacy</Text>
        <View style={[styles.card, { backgroundColor: theme.card, paddingVertical: 5 }]}>
          <TouchableOpacity style={styles.listItem}>
            <View style={styles.rowLeft}>
              <View style={[styles.iconBox, { backgroundColor: 'rgba(156,39,176,0.1)' }]}>
                <Ionicons name="server" size={20} color="#9c27b0" />
              </View>
              <View>
                <Text style={[styles.rowTitle, { color: theme.text }]}>View Local Data</Text>
                <Text style={[styles.rowSub, { color: theme.textSub }]}>See your stored fitness data</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={16} color={theme.textSub} />
          </TouchableOpacity>

          <View style={[styles.divider, { backgroundColor: theme.border }]} />

          <TouchableOpacity style={styles.listItem} onPress={handleClearData}>
            <View style={styles.rowLeft}>
              <View style={[styles.iconBox, { backgroundColor: 'rgba(244,67,54,0.1)' }]}>
                <Ionicons name="trash" size={20} color="#f44336" />
              </View>
              <View>
                <Text style={[styles.rowTitle, { color: theme.text }]}>Clear Local Data</Text>
                <Text style={[styles.rowSub, { color: theme.textSub }]}>Delete all your fitness data</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={16} color={theme.textSub} />
          </TouchableOpacity>
        </View>

        {/* ABOUT */}
        <Text style={[styles.sectionTitle, { color: theme.text }]}>About</Text>
        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <View style={[styles.iconBox, { backgroundColor: 'rgba(33,150,243,0.1)' }]}>
                <Ionicons name="information-circle" size={20} color="#2196f3" />
              </View>
              <View>
                <Text style={[styles.rowTitle, { color: theme.text }]}>About FITSTEP</Text>
                <Text style={[styles.rowSub, { color: theme.textSub }]}>App version, privacy and terms</Text>
              </View>
            </View>
            <View style={styles.rowRight}>
              <Text style={[styles.rowValue, { color: theme.textSub }]}>v1.0.0</Text>
              <Ionicons name="chevron-forward" size={16} color={theme.textSub} style={{marginLeft: 8}} />
            </View>
          </View>
        </View>

        <View style={[styles.privacyCard, { backgroundColor: isDark ? 'rgba(0,210,127,0.1)' : '#e6fce6' }]}>
          <Ionicons name="shield-checkmark" size={20} color="#00d27f" />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={[styles.privacyTitle, { color: theme.text }]}>Your fitness data is stored locally on this device.</Text>
            <Text style={[styles.privacySub, { color: theme.textSub }]}>The app works completely offline and keeps your data private.</Text>
          </View>
        </View>

      </ScrollView>

      {/* Goal Edit Modal */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: theme.card }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Edit Daily Goal</Text>
            <TextInput
              style={[styles.modalInput, { backgroundColor: theme.bg, color: theme.text }]}
              value={tempGoal}
              onChangeText={setTempGoal}
              keyboardType="numeric"
            />
            <View style={styles.modalBtns}>
              <TouchableOpacity style={styles.modalBtnCancel} onPress={() => setModalVisible(false)}>
                <Text style={{color: '#888'}}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalBtnSave, { backgroundColor: theme.primary }]} onPress={saveGoal}>
                <Text style={{color: '#FFF', fontWeight: 'bold'}}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, marginBottom: 15 },
  logoText: { fontSize: 20, fontWeight: '900', color: '#00d27f', fontStyle: 'italic' },
  avatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#DDD', justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 32, fontWeight: 'bold' },
  subtitle: { fontSize: 14, marginTop: 4, marginBottom: 20 },
  
  prefCard: { flexDirection: 'row', alignItems: 'center', padding: 20, borderRadius: 20, marginBottom: 25 },
  prefIcon: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  prefTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  prefSub: { fontSize: 12, lineHeight: 18 },

  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10, marginLeft: 5 },
  card: { borderRadius: 20, padding: 20, marginBottom: 25 },
  
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rowLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  iconBox: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  rowTitle: { fontSize: 15, fontWeight: 'bold', marginBottom: 2 },
  rowSub: { fontSize: 12 },
  rowRight: { flexDirection: 'row', alignItems: 'center' },
  rowValue: { fontSize: 13 },

  themeSelector: { flexDirection: 'row', borderRadius: 20, padding: 4 },
  themeBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  themeBtnText: { fontSize: 12, fontWeight: '600' },

  listItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 15 },
  divider: { height: 1, width: '100%' },

  statusBadge: { backgroundColor: '#e6fce6', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  statusText: { color: '#00d27f', fontSize: 12, fontWeight: 'bold' },

  privacyCard: { flexDirection: 'row', padding: 15, borderRadius: 16, marginTop: 10 },
  privacyTitle: { fontSize: 13, fontWeight: 'bold', marginBottom: 4 },
  privacySub: { fontSize: 11, lineHeight: 16 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalCard: { width: '80%', padding: 20, borderRadius: 20 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  modalInput: { height: 50, borderRadius: 12, paddingHorizontal: 15, fontSize: 16, marginBottom: 20 },
  modalBtns: { flexDirection: 'row', justifyContent: 'flex-end' },
  modalBtnCancel: { padding: 10, marginRight: 10 },
  modalBtnSave: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 12 }
});
