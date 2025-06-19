import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Sparkles, Clock, Target, Filter, CheckCircle, Play } from 'lucide-react-native';
import { useUser } from '@/components/UserContext';

const questTypes = ['all', 'self-reflection', 'mindfulness', 'creativity', 'social', 'adventure', 'wellness'];
const difficulties = ['all', 'easy', 'medium', 'hard'];

export default function QuestsScreen() {
  const { quests, updateQuest, addSparkPoints } = useUser();
  const [selectedType, setSelectedType] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');

  const filteredQuests = quests.filter(quest => {
    const typeMatch = selectedType === 'all' || quest.type === selectedType;
    const difficultyMatch = selectedDifficulty === 'all' || quest.difficulty === selectedDifficulty;
    return typeMatch && difficultyMatch;
  });

  const handleStartQuest = (questId: string) => {
    // Navigate to quest detail or start quest flow
    console.log('Starting quest:', questId);
  };

  const handleCompleteQuest = (quest: any) => {
    updateQuest(quest.id, { completed: true, completedAt: new Date() });
    addSparkPoints(quest.points);
  };

  const getTypeColor = (type: string) => {
    const colors = {
      'self-reflection': '#8B5CF6',
      'mindfulness': '#10B981',
      'creativity': '#F59E0B',
      'social': '#EC4899',
      'adventure': '#EF4444',
      'wellness': '#06B6D4',
    };
    return colors[type as keyof typeof colors] || '#6B7280';
  };

  const getDifficultyEmoji = (difficulty: string) => {
    const emojis = {
      easy: '🟢',
      medium: '🟡',
      hard: '🔴',
    };
    return emojis[difficulty as keyof typeof emojis] || '⚪';
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Quest Collection</Text>
        <Text style={styles.subtitle}>Choose your next adventure</Text>
      </View>

      {/* Filters */}
      <View style={styles.filtersContainer}>
        <Text style={styles.filterTitle}>Type</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
          {questTypes.map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.filterChip,
                selectedType === type && styles.selectedFilterChip
              ]}
              onPress={() => setSelectedType(type)}
            >
              <Text style={[
                styles.filterChipText,
                selectedType === type && styles.selectedFilterChipText
              ]}>
                {type === 'all' ? 'All' : type.replace('-', ' ')}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.filterTitle}>Difficulty</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
          {difficulties.map((difficulty) => (
            <TouchableOpacity
              key={difficulty}
              style={[
                styles.filterChip,
                selectedDifficulty === difficulty && styles.selectedFilterChip
              ]}
              onPress={() => setSelectedDifficulty(difficulty)}
            >
              <Text style={[
                styles.filterChipText,
                selectedDifficulty === difficulty && styles.selectedFilterChipText
              ]}>
                {difficulty === 'all' ? 'All' : difficulty}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Quest List */}
      <ScrollView style={styles.questList} showsVerticalScrollIndicator={false}>
        {filteredQuests.map((quest) => (
          <View key={quest.id} style={styles.questCard}>
            <View style={styles.questHeader}>
              <View style={styles.questBadges}>
                <View style={[styles.typeBadge, { backgroundColor: getTypeColor(quest.type) }]}>
                  <Text style={styles.typeBadgeText}>{quest.type.replace('-', ' ')}</Text>
                </View>
                <View style={styles.difficultyBadge}>
                  <Text style={styles.difficultyBadgeText}>
                    {getDifficultyEmoji(quest.difficulty)} {quest.difficulty}
                  </Text>
                </View>
              </View>
              
              <View style={styles.questPoints}>
                <Sparkles size={16} color="#F59E0B" />
                <Text style={styles.questPointsText}>{quest.points}</Text>
              </View>
            </View>

            <Text style={styles.questTitle}>{quest.title}</Text>
            <Text style={styles.questDescription}>{quest.description}</Text>

            <View style={styles.questMeta}>
              <View style={styles.questMetaItem}>
                <Clock size={16} color="#6B7280" />
                <Text style={styles.questMetaText}>{quest.duration}</Text>
              </View>
            </View>

            <View style={styles.questActions}>
              {quest.completed ? (
                <View style={styles.completedBadge}>
                  <CheckCircle size={16} color="#10B981" />
                  <Text style={styles.completedText}>Completed</Text>
                  {quest.completedAt && (
                    <Text style={styles.completedDate}>
                      {quest.completedAt.toLocaleDateString()}
                    </Text>
                  )}
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.startButton}
                  onPress={() => handleStartQuest(quest.id)}
                >
                  <Play size={16} color="#FFFFFF" />
                  <Text style={styles.startButtonText}>Start Quest</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Quest Instructions Preview */}
            {!quest.completed && (
              <View style={styles.instructionsPreview}>
                <Text style={styles.instructionsTitle}>Quest Steps:</Text>
                {quest.instructions.slice(0, 3).map((instruction, index) => (
                  <Text key={index} style={styles.instructionItem}>
                    {index + 1}. {instruction}
                  </Text>
                ))}
                {quest.instructions.length > 3 && (
                  <Text style={styles.moreInstructions}>
                    +{quest.instructions.length - 3} more steps...
                  </Text>
                )}
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  filtersContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  filterTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 8,
    marginTop: 16,
  },
  filterScroll: {
    flexGrow: 0,
  },
  filterChip: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  selectedFilterChip: {
    backgroundColor: '#8B5CF6',
    borderColor: '#8B5CF6',
  },
  filterChipText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    textTransform: 'capitalize',
  },
  selectedFilterChipText: {
    color: '#FFFFFF',
  },
  questList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  questCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  questHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  questBadges: {
    flexDirection: 'row',
    gap: 8,
    flex: 1,
  },
  typeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  typeBadgeText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    textTransform: 'capitalize',
  },
  difficultyBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyBadgeText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    textTransform: 'capitalize',
  },
  questPoints: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  questPointsText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#92400E',
    marginLeft: 4,
  },
  questTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  questDescription: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 16,
    lineHeight: 22,
  },
  questMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  questMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  questMetaText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginLeft: 4,
  },
  questActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8B5CF6',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
    flex: 1,
    justifyContent: 'center',
  },
  startButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    flex: 1,
    justifyContent: 'center',
  },
  completedText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#059669',
    marginLeft: 8,
  },
  completedDate: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginLeft: 8,
  },
  instructionsPreview: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  instructionsTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 8,
  },
  instructionItem: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 4,
    lineHeight: 20,
  },
  moreInstructions: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#8B5CF6',
    fontStyle: 'italic',
  },
});