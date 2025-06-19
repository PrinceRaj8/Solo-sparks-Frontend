import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Camera, Image as ImageIcon, Mic, Send, Calendar, Heart, Sparkles } from 'lucide-react-native';
import { useUser } from '@/components/UserContext';
import * as ImagePicker from 'expo-image-picker';

const moods = ['peaceful', 'excited', 'grateful', 'contemplative', 'inspired', 'joyful', 'centered', 'adventurous'];

export default function ReflectionsScreen() {
  const { reflections, addReflection, quests, addSparkPoints } = useUser();
  const [showNewReflection, setShowNewReflection] = useState(false);
  const [selectedQuestId, setSelectedQuestId] = useState('');
  const [reflectionText, setReflectionText] = useState('');
  const [selectedMood, setSelectedMood] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const availableQuests = quests.filter(q => q.completed);

  const handleImagePicker = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const handleSubmitReflection = () => {
    if (!selectedQuestId || !reflectionText.trim() || !selectedMood) {
      Alert.alert('Please fill in all required fields');
      return;
    }

    const quest = quests.find(q => q.id === selectedQuestId);
    if (!quest) return;

    addReflection({
      questId: selectedQuestId,
      questTitle: quest.title,
      text: reflectionText,
      photoUri: selectedImage || undefined,
      mood: selectedMood,
      points: Math.floor(quest.points * 0.5), // Bonus points for reflection
    });

    addSparkPoints(Math.floor(quest.points * 0.5));

    // Reset form
    setSelectedQuestId('');
    setReflectionText('');
    setSelectedMood('');
    setSelectedImage(null);
    setShowNewReflection(false);

    Alert.alert('Reflection saved!', 'Your reflection has been added and you earned bonus Spark Points!');
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getMoodEmoji = (mood: string) => {
    const moodEmojis = {
      peaceful: '😌',
      excited: '🤩',
      grateful: '🙏',
      contemplative: '🤔',
      inspired: '✨',
      joyful: '😊',
      centered: '🧘',
      adventurous: '🌟',
    };
    return moodEmojis[mood as keyof typeof moodEmojis] || '😊';
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Reflections</Text>
        <Text style={styles.subtitle}>Your journey of self-discovery</Text>
        
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowNewReflection(true)}
        >
          <Text style={styles.addButtonText}>+ New Reflection</Text>
        </TouchableOpacity>
      </View>

      {showNewReflection && (
        <View style={styles.newReflectionContainer}>
          <View style={styles.newReflectionCard}>
            <Text style={styles.newReflectionTitle}>Create New Reflection</Text>
            
            {/* Quest Selection */}
            <Text style={styles.inputLabel}>Select a completed quest:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.questScroll}>
              {availableQuests.map((quest) => (
                <TouchableOpacity
                  key={quest.id}
                  style={[
                    styles.questOption,
                    selectedQuestId === quest.id && styles.selectedQuestOption
                  ]}
                  onPress={() => setSelectedQuestId(quest.id)}
                >
                  <Text style={[
                    styles.questOptionText,
                    selectedQuestId === quest.id && styles.selectedQuestOptionText
                  ]}>
                    {quest.title}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Mood Selection */}
            <Text style={styles.inputLabel}>How did you feel?</Text>
            <View style={styles.moodGrid}>
              {moods.map((mood) => (
                <TouchableOpacity
                  key={mood}
                  style={[
                    styles.moodOption,
                    selectedMood === mood && styles.selectedMoodOption
                  ]}
                  onPress={() => setSelectedMood(mood)}
                >
                  <Text style={styles.moodEmoji}>{getMoodEmoji(mood)}</Text>
                  <Text style={[
                    styles.moodText,
                    selectedMood === mood && styles.selectedMoodText
                  ]}>
                    {mood}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Text Input */}
            <Text style={styles.inputLabel}>Share your thoughts:</Text>
            <TextInput
              style={styles.textInput}
              multiline
              numberOfLines={4}
              value={reflectionText}
              onChangeText={setReflectionText}
              placeholder="What did you discover about yourself? How did this quest make you feel?"
              placeholderTextColor="#9CA3AF"
            />

            {/* Media Options */}
            <View style={styles.mediaOptions}>
              <TouchableOpacity style={styles.mediaButton} onPress={handleImagePicker}>
                <ImageIcon size={20} color="#8B5CF6" />
                <Text style={styles.mediaButtonText}>Add Photo</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.mediaButton}>
                <Mic size={20} color="#8B5CF6" />
                <Text style={styles.mediaButtonText}>Record Audio</Text>
              </TouchableOpacity>
            </View>

            {selectedImage && (
              <View style={styles.selectedImageContainer}>
                <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
                <TouchableOpacity
                  style={styles.removeImageButton}
                  onPress={() => setSelectedImage(null)}
                >
                  <Text style={styles.removeImageText}>×</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Actions */}
            <View style={styles.reflectionActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowNewReflection(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmitReflection}
              >
                <Send size={16} color="#FFFFFF" />
                <Text style={styles.submitButtonText}>Save Reflection</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* Reflections List */}
      <ScrollView style={styles.reflectionsList} showsVerticalScrollIndicator={false}>
        {reflections.length === 0 ? (
          <View style={styles.emptyState}>
            <Heart size={48} color="#D1D5DB" />
            <Text style={styles.emptyStateTitle}>No reflections yet</Text>
            <Text style={styles.emptyStateText}>
              Complete some quests and share your thoughts to start your reflection journey!
            </Text>
          </View>
        ) : (
          reflections.map((reflection) => (
            <View key={reflection.id} style={styles.reflectionCard}>
              <View style={styles.reflectionHeader}>
                <View style={styles.reflectionInfo}>
                  <Text style={styles.reflectionQuestTitle}>{reflection.questTitle}</Text>
                  <View style={styles.reflectionMeta}>
                    <Calendar size={14} color="#6B7280" />
                    <Text style={styles.reflectionDate}>{formatDate(reflection.createdAt)}</Text>
                    <Text style={styles.reflectionMood}>
                      {getMoodEmoji(reflection.mood)} {reflection.mood}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.reflectionPoints}>
                  <Sparkles size={14} color="#F59E0B" />
                  <Text style={styles.reflectionPointsText}>+{reflection.points}</Text>
                </View>
              </View>

              {reflection.photoUri && (
                <Image source={{ uri: reflection.photoUri }} style={styles.reflectionImage} />
              )}

              <Text style={styles.reflectionText}>{reflection.text}</Text>
            </View>
          ))
        )}
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
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: '#8B5CF6',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignSelf: 'flex-start',
  },
  addButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  newReflectionContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    justifyContent: 'center',
    padding: 20,
  },
  newReflectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    maxHeight: '90%',
  },
  newReflectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputLabel: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 8,
    marginTop: 16,
  },
  questScroll: {
    marginBottom: 16,
  },
  questOption: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedQuestOption: {
    backgroundColor: '#EDE9FE',
    borderColor: '#8B5CF6',
  },
  questOptionText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  selectedQuestOptionText: {
    color: '#8B5CF6',
  },
  moodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  moodOption: {
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 2,
    borderColor: 'transparent',
    minWidth: 80,
  },
  selectedMoodOption: {
    backgroundColor: '#EDE9FE',
    borderColor: '#8B5CF6',
  },
  moodEmoji: {
    fontSize: 20,
    marginBottom: 4,
  },
  moodText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    textAlign: 'center',
  },
  selectedMoodText: {
    color: '#8B5CF6',
  },
  textInput: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  mediaOptions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  mediaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flex: 1,
    justifyContent: 'center',
  },
  mediaButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#8B5CF6',
    marginLeft: 8,
  },
  selectedImageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  selectedImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeImageText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-Bold',
  },
  reflectionActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
  },
  submitButton: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8B5CF6',
    borderRadius: 12,
    paddingVertical: 14,
  },
  submitButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  reflectionsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 22,
  },
  reflectionCard: {
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
  reflectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  reflectionInfo: {
    flex: 1,
  },
  reflectionQuestTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 8,
  },
  reflectionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  reflectionDate: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  reflectionMood: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#8B5CF6',
    textTransform: 'capitalize',
  },
  reflectionPoints: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  reflectionPointsText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#92400E',
    marginLeft: 4,
  },
  reflectionImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
  },
  reflectionText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#374151',
    lineHeight: 22,
  },
});