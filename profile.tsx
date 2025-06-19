import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { User, Settings, TrendingUp, Award, Calendar, Target, Sparkles, ChevronRight } from 'lucide-react-native';
import { useUser } from '@/components/UserContext';

export default function ProfileScreen() {
  const { profile, quests, reflections } = useUser();

  const completedQuests = quests.filter(q => q.completed).length;
  const totalReflections = reflections.length;
  const averagePointsPerQuest = completedQuests > 0 ? Math.round(profile.sparkPoints / completedQuests) : 0;

  const getPersonalityColor = (type: string) => {
    const colors = {
      'creative-explorer': '#8B5CF6',
      'mindful-seeker': '#10B981',
      'social-connector': '#EC4899',
      'adventure-spirit': '#EF4444',
      'gentle-nurturer': '#06B6D4',
    };
    return colors[type as keyof typeof colors] || '#8B5CF6';
  };

  const stats = [
    { icon: Target, label: 'Completed Quests', value: completedQuests.toString(), color: '#8B5CF6' },
    { icon: Calendar, label: 'Current Streak', value: `${profile.streak} days`, color: '#EC4899' },
    { icon: Sparkles, label: 'Total Points', value: profile.sparkPoints.toString(), color: '#F59E0B' },
    { icon: Award, label: 'Current Level', value: profile.level.toString(), color: '#10B981' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient
          colors={['#8B5CF6', '#EC4899']}
          style={styles.profileHeader}
        >
          <View style={styles.profileInfo}>
            <View style={styles.avatarContainer}>
              <User size={40} color="#FFFFFF" />
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{profile.name}</Text>
              <Text style={styles.userAge}>{profile.age} years old</Text>
              <View style={styles.personalityBadge}>
                <Text style={styles.personalityText}>{profile.personalityType.replace('-', ' ')}</Text>
              </View>
            </View>
          </View>
          
          <TouchableOpacity style={styles.settingsButton}>
            <Settings size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </LinearGradient>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {stats.map((stat, index) => (
            <View key={index} style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: `${stat.color}20` }]}>
                <stat.icon size={24} color={stat.color} />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Growth Journey */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Growth Journey</Text>
          <View style={styles.journeyCard}>
            <View style={styles.journeyHeader}>
              <TrendingUp size={24} color="#8B5CF6" />
              <Text style={styles.journeyTitle}>Self-Discovery Progress</Text>
            </View>
            
            <View style={styles.journeyStats}>
              <View style={styles.journeyStat}>
                <Text style={styles.journeyNumber}>{totalReflections}</Text>
                <Text style={styles.journeyLabel}>Reflections</Text>
              </View>
              <View style={styles.journeyStat}>
                <Text style={styles.journeyNumber}>{averagePointsPerQuest}</Text>
                <Text style={styles.journeyLabel}>Avg Points/Quest</Text>
              </View>
              <View style={styles.journeyStat}>
                <Text style={styles.journeyNumber}>{profile.goals.length}</Text>
                <Text style={styles.journeyLabel}>Active Goals</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Emotional Needs */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Emotional Needs</Text>
          <View style={styles.needsContainer}>
            {profile.emotionalNeeds.map((need, index) => (
              <View key={index} style={styles.needChip}>
                <Text style={styles.needText}>{need}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Interests */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Interests</Text>
          <View style={styles.interestsContainer}>
            {profile.interests.map((interest, index) => (
              <View key={index} style={styles.interestChip}>
                <Text style={styles.interestText}>{interest}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Goals */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Goals</Text>
          <View style={styles.goalsContainer}>
            {profile.goals.map((goal, index) => (
              <View key={index} style={styles.goalItem}>
                <View style={styles.goalIcon}>
                  <Target size={16} color="#8B5CF6" />
                </View>
                <Text style={styles.goalText}>{goal}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Settings Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <View style={styles.settingsContainer}>
            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingIcon}>
                <User size={20} color="#8B5CF6" />
              </View>
              <Text style={styles.settingText}>Edit Profile</Text>
              <ChevronRight size={16} color="#9CA3AF" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingIcon}>
                <Target size={20} color="#EC4899" />
              </View>
              <Text style={styles.settingText}>Update Goals</Text>
              <ChevronRight size={16} color="#9CA3AF" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingIcon}>
                <Settings size={20} color="#F59E0B" />
              </View>
              <Text style={styles.settingText}>Preferences</Text>
              <ChevronRight size={16} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollView: {
    flex: 1,
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 10,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  userAge: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 8,
  },
  personalityBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: 'flex-start',
  },
  personalityText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    textTransform: 'capitalize',
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 20,
    gap: 12,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    width: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  journeyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  journeyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  journeyTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginLeft: 12,
  },
  journeyStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  journeyStat: {
    alignItems: 'center',
  },
  journeyNumber: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#8B5CF6',
    marginBottom: 4,
  },
  journeyLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    textAlign: 'center',
  },
  needsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  needChip: {
    backgroundColor: '#EDE9FE',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  needText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#8B5CF6',
    textTransform: 'capitalize',
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  interestChip: {
    backgroundColor: '#FCE7F3',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  interestText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#EC4899',
    textTransform: 'capitalize',
  },
  goalsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  goalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  goalIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EDE9FE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  goalText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#1F2937',
    textTransform: 'capitalize',
  },
  settingsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#1F2937',
    flex: 1,
  },
});