import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, useColorScheme, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { FitnessContext } from '../context/FitnessContext';

export default function ProfileScreen({ navigation }) {
  const { userProfile, dailyGoal, updateProfile, updateGoals } = useContext(FitnessContext);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [stride, setStride] = useState('');
  const [goal, setGoal] = useState('');
  const [isEditingHealth, setIsEditingHealth] = useState(false);

  useEffect(() => {
    if (userProfile) {
      setName(userProfile.name || '');
      setAge(userProfile.age ? userProfile.age.toString() : '');
      setGender(userProfile.gender || '');
      setHeight(userProfile.height ? userProfile.height.toString() : '');
      setWeight(userProfile.weight ? userProfile.weight.toString() : '');
      setStride(userProfile.strideLength ? userProfile.strideLength.toString() : '');
    }
    if (dailyGoal) {
      setGoal(dailyGoal.toString());
    }
  }, [userProfile, dailyGoal]);

  const handleSave = () => {
    // Validation
    const parsedAge = parseInt(age);
    const parsedHeight = parseFloat(height);
    const parsedWeight = parseFloat(weight);
    const parsedStride = parseFloat(stride);
    const parsedGoal = parseInt(goal);

    if (parsedAge < 0 || parsedHeight < 0 || parsedWeight < 0 || parsedStride < 0 || parsedGoal < 0) {
      Alert.alert('Invalid Input', 'Values cannot be negative.');
      return;
    }

    updateProfile({
      name: name || 'User',
      age: isNaN(parsedAge) ? null : parsedAge,
      gender: gender,
      height: isNaN(parsedHeight) ? null : parsedHeight,
      weight: isNaN(parsedWeight) ? 70 : parsedWeight,
      strideLength: isNaN(parsedStride) ? 0.76 : parsedStride,
    });

    if (!isNaN(parsedGoal) && parsedGoal > 0) {
      updateGoals({ dailyStepsGoal: parsedGoal });
    }
    
    setIsEditingHealth(false);
    Alert.alert('Success', 'Profile saved successfully!');
  };

  const theme = {
    bg: isDark ? '#0b132b' : '#f8f9fa',
    card: isDark ? '#1c2541' : '#ffffff',
    text: isDark ? '#ffffff' : '#1a1a1a',
    textSub: isDark ? '#8d99ae' : '#6c757d',
    primary: '#00d27f',
    primaryBtn: isDark ? '#00d27f' : '#0d6efd',
    border: isDark ? '#2b3a55' : '#e9ecef',
    inputBg: isDark ? '#111b3d' : '#f1f3f5',
    topCardBg: isDark ? '#0d222b' : '#e6fce6',
  };

  const displayName = userProfile?.name ? userProfile.name : 'Your Profile';
  const displayAge = userProfile?.age ? `${userProfile.age} Years` : 'Not set';
  const displayGender = userProfile?.gender ? userProfile.gender : 'Not set';
  const displayHeight = userProfile?.height ? `${userProfile.height} cm` : 'Not set';

  const renderInitials = () => {
    if (!displayName || displayName === 'Your Profile') return 'U';
    return displayName.substring(0, 2).toUpperCase();
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.bg }]}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          {/* HEADER */}
          <View style={styles.header}>
            <Text style={styles.logoText}><Text style={{ color: theme.text }}>FIT</Text>STEP</Text>
            <TouchableOpacity><Ionicons name="settings-outline" size={24} color={theme.text} /></TouchableOpacity>
          </View>
          
          <View style={styles.titleRow}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.title, { color: theme.text }]}>Profile</Text>
              <Text style={[styles.subtitle, { color: theme.textSub }]}>Manage your personal information and fitness settings</Text>
            </View>
            <View style={styles.avatarContainer}>
              <View style={[styles.avatar, { backgroundColor: theme.primary }]}>
                <Text style={styles.avatarText}>{renderInitials()}</Text>
              </View>
              <View style={[styles.cameraBadge, { borderColor: theme.bg }]}>
                <Ionicons name="camera" size={12} color="#FFF" />
              </View>
            </View>
          </View>

          {/* TOP USER CARD */}
          <View style={[styles.topCard, { backgroundColor: theme.topCardBg }]}>
            <View style={styles.topCardHeader}>
              <View>
                <Text style={[styles.topCardName, { color: theme.text }]}>{displayName}</Text>
                <Text style={[styles.topCardSub, { color: theme.textSub }]}>Stay active, stay healthy! 💪</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={theme.textSub} />
            </View>
            <View style={styles.badgesRow}>
              <View style={[styles.badge, { backgroundColor: isDark ? 'rgba(0,210,127,0.1)' : '#d1f4e6' }]}>
                <Ionicons name="person" size={16} color="#00d27f" />
                <View style={{marginLeft: 6}}>
                  <Text style={[styles.badgeVal, { color: theme.text }]}>{userProfile?.age || '-'}</Text>
                  <Text style={[styles.badgeLabel, { color: theme.textSub }]}>Years</Text>
                </View>
              </View>
              <View style={[styles.badge, { backgroundColor: isDark ? 'rgba(33,150,243,0.1)' : '#dcf0ff' }]}>
                <Ionicons name="male-female" size={16} color="#2196f3" />
                <View style={{marginLeft: 6}}>
                  <Text style={[styles.badgeVal, { color: theme.text }]}>{userProfile?.gender || '-'}</Text>
                  <Text style={[styles.badgeLabel, { color: theme.textSub }]}>Gender</Text>
                </View>
              </View>
              <View style={[styles.badge, { backgroundColor: isDark ? 'rgba(156,39,176,0.1)' : '#f3e5f5' }]}>
                <Ionicons name="resize" size={16} color="#9c27b0" />
                <View style={{marginLeft: 6}}>
                  <Text style={[styles.badgeVal, { color: theme.text }]}>{userProfile?.height || '-'}</Text>
                  <Text style={[styles.badgeLabel, { color: theme.textSub }]}>Height</Text>
                </View>
              </View>
            </View>
          </View>

          {/* PHYSICAL DETAILS */}
          <View style={[styles.card, { backgroundColor: theme.card }]}>
            <View style={styles.cardHeader}>
              <View style={styles.cardHeaderLeft}>
                <View style={[styles.iconBox, { backgroundColor: 'rgba(255,107,129,0.1)' }]}>
                  <Ionicons name="clipboard-outline" size={18} color="#ff6b81" />
                </View>
                <Text style={[styles.cardTitle, { color: theme.text }]}>Physical Details</Text>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <View style={[styles.inputIcon, { backgroundColor: theme.inputBg }]}>
                <MaterialCommunityIcons name="scale-bathroom" size={20} color={theme.textSub} />
              </View>
              <View style={[styles.inputContainer, { backgroundColor: theme.inputBg }]}>
                <Text style={[styles.inputLabel, { color: theme.textSub }]}>Weight (kg)</Text>
                <TextInput
                  style={[styles.input, { color: theme.text }]}
                  value={weight}
                  onChangeText={setWeight}
                  keyboardType="numeric"
                  placeholder="Not set"
                  placeholderTextColor={theme.textSub}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <View style={[styles.inputIcon, { backgroundColor: theme.inputBg }]}>
                <MaterialCommunityIcons name="shoe-print" size={20} color={theme.textSub} />
              </View>
              <View style={[styles.inputContainer, { backgroundColor: theme.inputBg }]}>
                <Text style={[styles.inputLabel, { color: theme.textSub }]}>Stride Length (meters)</Text>
                <TextInput
                  style={[styles.input, { color: theme.text }]}
                  value={stride}
                  onChangeText={setStride}
                  keyboardType="numeric"
                  placeholder="Auto calculated"
                  placeholderTextColor={theme.textSub}
                />
              </View>
            </View>
          </View>

          {/* FITNESS GOALS */}
          <View style={[styles.card, { backgroundColor: theme.card }]}>
            <View style={styles.cardHeader}>
              <View style={styles.cardHeaderLeft}>
                <View style={[styles.iconBox, { backgroundColor: 'rgba(156,39,176,0.1)' }]}>
                  <MaterialCommunityIcons name="target" size={18} color="#9c27b0" />
                </View>
                <Text style={[styles.cardTitle, { color: theme.text }]}>Fitness Goals</Text>
              </View>
            </View>
            <View style={[styles.inputGroup, { marginBottom: 0 }]}>
              <View style={[styles.inputIcon, { backgroundColor: isDark ? 'rgba(0,210,127,0.1)' : '#e6fce6' }]}>
                <Ionicons name="golf" size={20} color="#00d27f" />
              </View>
              <View style={[styles.inputContainer, { backgroundColor: isDark ? '#112211' : '#f0fff0' }]}>
                <Text style={[styles.inputLabel, { color: theme.textSub }]}>Daily Step Goal</Text>
                <TextInput
                  style={[styles.input, { color: theme.text, fontWeight: 'bold' }]}
                  value={goal}
                  onChangeText={setGoal}
                  keyboardType="numeric"
                  placeholder="10000"
                  placeholderTextColor={theme.textSub}
                />
              </View>
            </View>
          </View>

          {/* HEALTH INFORMATION */}
          <View style={[styles.card, { backgroundColor: theme.card }]}>
            <View style={styles.cardHeader}>
              <View style={styles.cardHeaderLeft}>
                <View style={[styles.iconBox, { backgroundColor: 'rgba(255,152,0,0.1)' }]}>
                  <Ionicons name="heart" size={18} color="#ff9800" />
                </View>
                <Text style={[styles.cardTitle, { color: theme.text }]}>Health Information</Text>
              </View>
              <TouchableOpacity onPress={() => setIsEditingHealth(!isEditingHealth)} style={styles.editBtn}>
                <Ionicons name="pencil" size={14} color={theme.textSub} />
                <Text style={[styles.editBtnText, { color: theme.textSub }]}>{isEditingHealth ? "Done" : "Edit"}</Text>
              </TouchableOpacity>
            </View>

            {/* Name (Only visible when editing health info) */}
            {isEditingHealth && (
              <View style={styles.listItemRow}>
                <Ionicons name="person-outline" size={20} color={theme.primary} style={{width: 30}} />
                <Text style={[styles.listLabel, { color: theme.text }]}>Name</Text>
                <TextInput style={[styles.listInput, { color: theme.text, backgroundColor: theme.inputBg }]} value={name} onChangeText={setName} placeholder="Name" placeholderTextColor={theme.textSub} />
              </View>
            )}

            <View style={styles.listItemRow}>
              <Ionicons name="calendar-outline" size={20} color="#ff6b81" style={{width: 30}} />
              <Text style={[styles.listLabel, { color: theme.text }]}>Age</Text>
              {isEditingHealth ? 
                <TextInput style={[styles.listInput, { color: theme.text, backgroundColor: theme.inputBg }]} value={age} onChangeText={setAge} keyboardType="numeric" placeholder="Age" placeholderTextColor={theme.textSub} />
                : <Text style={[styles.listValue, { color: theme.text }]}>{displayAge}</Text>
              }
            </View>

            <View style={styles.listItemRow}>
              <Ionicons name="male-female" size={20} color="#2196f3" style={{width: 30}} />
              <Text style={[styles.listLabel, { color: theme.text }]}>Gender</Text>
              {isEditingHealth ? 
                <TextInput style={[styles.listInput, { color: theme.text, backgroundColor: theme.inputBg }]} value={gender} onChangeText={setGender} placeholder="Male/Female" placeholderTextColor={theme.textSub} />
                : <Text style={[styles.listValue, { color: theme.text }]}>{displayGender}</Text>
              }
            </View>

            <View style={[styles.listItemRow, { borderBottomWidth: 0 }]}>
              <Ionicons name="resize" size={20} color="#9c27b0" style={{width: 30}} />
              <Text style={[styles.listLabel, { color: theme.text }]}>Height</Text>
              {isEditingHealth ? 
                <TextInput style={[styles.listInput, { color: theme.text, backgroundColor: theme.inputBg }]} value={height} onChangeText={setHeight} keyboardType="numeric" placeholder="Height in cm" placeholderTextColor={theme.textSub} />
                : <Text style={[styles.listValue, { color: theme.text }]}>{displayHeight}</Text>
              }
            </View>
          </View>

          <TouchableOpacity style={[styles.saveBtn, { backgroundColor: theme.primaryBtn }]} onPress={handleSave}>
            <Ionicons name="save-outline" size={20} color="#FFF" style={{marginRight: 8}} />
            <Text style={styles.saveBtnText}>Save Profile</Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, marginBottom: 15 },
  logoText: { fontSize: 20, fontWeight: '900', color: '#00d27f', fontStyle: 'italic' },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 32, fontWeight: 'bold' },
  subtitle: { fontSize: 13, marginTop: 4, paddingRight: 20 },
  avatarContainer: { position: 'relative' },
  avatar: { width: 64, height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontSize: 24, fontWeight: 'bold', color: '#FFF' },
  cameraBadge: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#002855', width: 22, height: 22, borderRadius: 11, justifyContent: 'center', alignItems: 'center', borderWidth: 2 },
  
  topCard: { padding: 20, borderRadius: 20, marginBottom: 20 },
  topCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  topCardName: { fontSize: 18, fontWeight: 'bold' },
  topCardSub: { fontSize: 12, marginTop: 2 },
  badgesRow: { flexDirection: 'row', justifyContent: 'space-between' },
  badge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 10, borderRadius: 12, width: '31%' },
  badgeVal: { fontSize: 13, fontWeight: 'bold' },
  badgeLabel: { fontSize: 10 },

  card: { padding: 20, borderRadius: 24, marginBottom: 20 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  cardHeaderLeft: { flexDirection: 'row', alignItems: 'center' },
  iconBox: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  cardTitle: { fontSize: 16, fontWeight: 'bold' },
  editBtn: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#e9ecef', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  editBtnText: { fontSize: 12, marginLeft: 4 },

  inputGroup: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  inputIcon: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  inputContainer: { flex: 1, height: 50, borderRadius: 12, paddingHorizontal: 15, justifyContent: 'center' },
  inputLabel: { fontSize: 10, marginBottom: 2 },
  input: { fontSize: 14, fontWeight: '500', padding: 0, margin: 0 },

  listItemRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: 'rgba(150,150,150,0.1)' },
  listLabel: { flex: 1, fontSize: 14 },
  listValue: { fontSize: 14, fontWeight: '500' },
  listInput: { fontSize: 14, fontWeight: '500', textAlign: 'right', minWidth: 100, paddingVertical: 4, paddingHorizontal: 8, borderRadius: 6 },

  saveBtn: { flexDirection: 'row', height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginTop: 10 },
  saveBtnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' }
});
