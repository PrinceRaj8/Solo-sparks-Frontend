import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Sparkles, Calendar, Target, Zap, ChevronRight, Play } from 'lucide-react-native';
import { useUser } from '@/components/UserContext';

export default function HomeScreen() {
  const { profile, quests } = useUser();
  
  const todayQuest = quests.find(q => !q.completed);
  const recentReflections = 3;
  const weeklyGoal = 5;
  const completedThisWeek = profile.completedQuests % 7;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello, {profile.name}! ✨</Text>
            <Text style={styles.subtitle}>Ready for today's spark?</Text>
          </View>
          <View style={styles.levelBadge}>
            <Sparkles size={16} color="#F59E0B" />
            <Text style={styles.levelText}>Level {profile.level}</Text>
          </View>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <Zap size={20} color="#8B5CF6" />
            </View>
            <Text style={styles.statNumber}>{profile.sparkPoints}</Text>
            <Text style={styles.statLabel}>Spark Points</Text>
          </View>
          
          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <Target size={20} color="#EC4899" />
            </View>
            <Text style={styles.statNumber}>{profile.streak}</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
          
          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <Calendar size={20} color="#F59E0B" />
            </View>
            <Text style={styles.statNumber}>{profile.completedQuests}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
        </View>

        {/* Today's Quest */}
        {todayQuest && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Today's Quest</Text>
            <LinearGradient
              colors={['#8B5CF6', '#EC4899']}
              style={styles.questCard}
            >
              <View style={styles.questHeader}>
                <View style={styles.questBadge}>
                  <Text style={styles.questBadgeText}>{todayQuest.type}</Text>
                </View>
                <View style={styles.questPoints}>
                  <Sparkles size={16} color="#FFFFFF" />
                  <Text style={styles.questPointsText}>{todayQuest.points}</Text>
                </View>
              </View>
              
              <Text style={styles.questTitle}>{todayQuest.title}</Text>
              <Text style={styles.questDescription}>{todayQuest.description}</Text>
              
              <View style={styles.questMeta}>
                <Text style={styles.questDuration}>⏱️ {todayQuest.duration}</Text>
                <Text style={styles.questDifficulty}>
                  {todayQuest.difficulty === 'easy' ? '🟢' : 
                   todayQuest.difficulty === 'medium' ? '🟡' : '🔴'} {todayQuest.difficulty}
                </Text>
              </View>
              
              <TouchableOpacity style={styles.startQuestButton}>
                <Play size={16} color="#8B5CF6" />
                <Text style={styles.startQuestText}>Start Quest</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        )}

        {/* Weekly Progress */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Weekly Progress</Text>
          <View style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressTitle}>This Week's Goal</Text>
              <Text style={styles.progressNumbers}>{completedThisWeek}/{weeklyGoal}</Text>
            </View>
            
            <View style={styles.progressBarContainer}>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${(completedThisWeek / weeklyGoal) * 100}%` }]} />
              </View>
            </View>
            
            <Text style={styles.progressSubtext}>
              {weeklyGoal - completedThisWeek > 0 
                ? `${weeklyGoal - completedThisWeek} more quests to reach your weekly goal`
                : 'Congratulations! You\'ve reached your weekly goal! 🎉'
              }
            </Text>
          </View>
        </View>

        {/* Mood Check */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How are you feeling?</Text>
          <View style={styles.moodCard}>
            <Text style={styles.moodText}>Current mood: <Text style={styles.moodEmoji}>{profile.currentMood}</Text></Text>
            <TouchableOpacity style={styles.updateMoodButton}>
              <Text style={styles.updateMoodText}>Update Mood</Text>
              <ChevronRight size={16} color="#8B5CF6" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityCard}>
            <View style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <Target size={16} color="#10B981" />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Completed Creative Expression Flow</Text>
                <Text style={styles.activityTime}>2 days ago</Text>
              </View>
            </View>
            
            <View style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <Sparkles size={16} color="#F59E0B" />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Earned 40 Spark Points</Text>
                <Text style={styles.activityTime}>2 days ago</Text>
              </View>
            </View>
            
            <View style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <Calendar size={16} color="#8B5CF6" />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>5-day streak milestone!</Text>
                <Text style={styles.activityTime}>Today</Text>
              </View>
            </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 10,
  },
  greeting: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  levelText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#92400E',
    marginLeft: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 10,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statNumber: {
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
  questCard: {
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  questHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  questBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  questBadgeText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    textTransform: 'capitalize',
  },
  questPoints: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  questPointsText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginLeft: 4,
  },
  questTitle: {
    fontSize: 22,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  questDescription: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 16,
    lineHeight: 22,
  },
  questMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  questDuration: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  questDifficulty: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: 'rgba(255, 255, 255, 0.8)',
    textTransform: 'capitalize',
  },
  startQuestButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 14,
  },
  startQuestText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#8B5CF6',
    marginLeft: 8,
  },
  progressCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  progressTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  progressNumbers: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#8B5CF6',
  },
  progressBarContainer: {
    marginBottom: 12,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#8B5CF6',
    borderRadius: 4,
  },
  progressSubtext: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  moodCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  moodText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
  },
  moodEmoji: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#8B5CF6',
    textTransform: 'capitalize',
  },
  updateMoodButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  updateMoodText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#8B5CF6',
    marginRight: 4,
  },
  activityCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
});
