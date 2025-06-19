import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight, ChevronLeft, Heart, Sparkles } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';

const personalityTypes = [
  { id: 'creative-explorer', title: 'Creative Explorer', description: 'Love trying new things and expressing yourself' },
  { id: 'mindful-seeker', title: 'Mindful Seeker', description: 'Value inner peace and self-reflection' },
  { id: 'social-connector', title: 'Social Connector', description: 'Thrive on meaningful relationships' },
  { id: 'adventure-spirit', title: 'Adventure Spirit', description: 'Seek excitement and new experiences' },
  { id: 'gentle-nurturer', title: 'Gentle Nurturer', description: 'Care deeply for yourself and others' },
];

const emotionalNeeds = [
  'Self-expression', 'Mindfulness', 'Adventure', 'Connection', 'Creativity',
  'Inner peace', 'Growth', 'Joy', 'Freedom', 'Purpose'
];

const interests = [
  'Photography', 'Music', 'Nature', 'Writing', 'Art', 'Travel',
  'Cooking', 'Reading', 'Yoga', 'Dancing', 'Movies', 'Crafts'
];

const goals = [
  'Build self-confidence', 'Discover new passions', 'Improve self-love',
  'Reduce stress', 'Find inner peace', 'Express creativity',
  'Connect with others', 'Live authentically', 'Embrace adventure'
];

const moods = [
  'Curious', 'Peaceful', 'Excited', 'Contemplative', 'Energetic',
  'Calm', 'Inspired', 'Hopeful', 'Adventurous', 'Grateful'
];

export default function OnboardingScreen() {
  const params = useLocalSearchParams();
  const { register } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: (params.name as string) || '',
    email: (params.email as string) || '',
    password: (params.password as string) || '',
    age: '',
    personalityType: '',
    emotionalNeeds: [] as string[],
    interests: [] as string[],
    goals: [] as string[],
    currentMood: '',
  });

  const steps = [
    { title: 'Welcome to Solo Sparks', subtitle: 'Your journey to self-discovery begins here' },
    { title: 'Tell us about yourself', subtitle: 'Basic information' },
    { title: 'What\'s your personality type?', subtitle: 'Choose the one that resonates most' },
    { title: 'What do you need emotionally?', subtitle: 'Select all that apply' },
    { title: 'What are your interests?', subtitle: 'Choose your favorites' },
    { title: 'What are your goals?', subtitle: 'What do you want to achieve?' },
    { title: 'How are you feeling today?', subtitle: 'Your current mood helps us personalize' },
  ];

  const handleNext = async () => {
    if (currentStep === 0) {
      setCurrentStep(1);
      return;
    }
    
    if (currentStep === 1) {
      if (!formData.age.trim()) {
        Alert.alert('Please enter your age');
        return;
      }
    }
    
    if (currentStep === 2 && !formData.personalityType) {
      Alert.alert('Please select a personality type');
      return;
    }
    
    if (currentStep === 3 && formData.emotionalNeeds.length === 0) {
      Alert.alert('Please select at least one emotional need');
      return;
    }
    
    if (currentStep === 4 && formData.interests.length === 0) {
      Alert.alert('Please select at least one interest');
      return;
    }
    
    if (currentStep === 5 && formData.goals.length === 0) {
      Alert.alert('Please select at least one goal');
      return;
    }
    
    if (currentStep === 6) {
      if (!formData.currentMood) {
        Alert.alert('Please select your current mood');
        return;
      }
      
      // Complete registration
      setIsLoading(true);
      try {
        const result = await register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          age: parseInt(formData.age),
          personalityType: formData.personalityType,
          emotionalNeeds: formData.emotionalNeeds,
          interests: formData.interests,
          goals: formData.goals,
          currentMood: formData.currentMood,
        });

        if (result.success) {
          router.replace('/(tabs)');
        } else {
          Alert.alert('Registration Failed', result.error || 'Please try again');
        }
      } catch (error) {
        Alert.alert('Error', 'Something went wrong. Please try again.');
      } finally {
        setIsLoading(false);
      }
      return;
    }
    
    setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      router.back();
    }
  };

  const toggleSelection = (field: 'emotionalNeeds' | 'interests' | 'goals', value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <View style={styles.welcomeContainer}>
            <View style={styles.iconContainer}>
              <Sparkles size={60} color="#8B5CF6" />
            </View>
            <Text style={styles.welcomeTitle}>Solo Sparks</Text>
            <Text style={styles.welcomeSubtitle}>
              Discover yourself through personalized quests designed to build emotional intelligence and self-love.
            </Text>
            <View style={styles.featureList}>
              <View style={styles.featureItem}>
                <Heart size={20} color="#EC4899" />
                <Text style={styles.featureText}>Personalized self-discovery quests</Text>
              </View>
              <View style={styles.featureItem}>
                <Sparkles size={20} color="#F59E0B" />
                <Text style={styles.featureText}>Earn Spark Points and rewards</Text>
              </View>
              <View style={styles.featureItem}>
                <Heart size={20} color="#8B5CF6" />
                <Text style={styles.featureText}>Track your emotional growth</Text>
              </View>
            </View>
          </View>
        );
      
      case 1:
        return (
          <View style={styles.formContainer}>
            <Text style={styles.inputLabel}>How old are you?</Text>
            <TextInput
              style={styles.textInput}
              value={formData.age}
              onChangeText={(text) => setFormData(prev => ({ ...prev, age: text }))}
              placeholder="Enter your age"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
            />
          </View>
        );
      
      case 2:
        return (
          <ScrollView style={styles.optionsContainer}>
            {personalityTypes.map((type) => (
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.optionCard,
                  formData.personalityType === type.id && styles.selectedCard
                ]}
                onPress={() => setFormData(prev => ({ ...prev, personalityType: type.id }))}
              >
                <Text style={[
                  styles.optionTitle,
                  formData.personalityType === type.id && styles.selectedText
                ]}>
                  {type.title}
                </Text>
                <Text style={[
                  styles.optionDescription,
                  formData.personalityType === type.id && styles.selectedDescription
                ]}>
                  {type.description}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        );
      
      case 3:
        return (
          <ScrollView style={styles.optionsContainer}>
            <View style={styles.multiSelectGrid}>
              {emotionalNeeds.map((need) => (
                <TouchableOpacity
                  key={need}
                  style={[
                    styles.multiSelectItem,
                    formData.emotionalNeeds.includes(need) && styles.selectedMultiSelect
                  ]}
                  onPress={() => toggleSelection('emotionalNeeds', need)}
                >
                  <Text style={[
                    styles.multiSelectText,
                    formData.emotionalNeeds.includes(need) && styles.selectedMultiSelectText
                  ]}>
                    {need}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        );
      
      case 4:
        return (
          <ScrollView style={styles.optionsContainer}>
            <View style={styles.multiSelectGrid}>
              {interests.map((interest) => (
                <TouchableOpacity
                  key={interest}
                  style={[
                    styles.multiSelectItem,
                    formData.interests.includes(interest) && styles.selectedMultiSelect
                  ]}
                  onPress={() => toggleSelection('interests', interest)}
                >
                  <Text style={[
                    styles.multiSelectText,
                    formData.interests.includes(interest) && styles.selectedMultiSelectText
                  ]}>
                    {interest}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        );
      
      case 5:
        return (
          <ScrollView style={styles.optionsContainer}>
            <View style={styles.multiSelectGrid}>
              {goals.map((goal) => (
                <TouchableOpacity
                  key={goal}
                  style={[
                    styles.multiSelectItem,
                    formData.goals.includes(goal) && styles.selectedMultiSelect
                  ]}
                  onPress={() => toggleSelection('goals', goal)}
                >
                  <Text style={[
                    styles.multiSelectText,
                    formData.goals.includes(goal) && styles.selectedMultiSelectText
                  ]}>
                    {goal}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        );
      
      case 6:
        return (
          <ScrollView style={styles.optionsContainer}>
            <View style={styles.multiSelectGrid}>
              {moods.map((mood) => (
                <TouchableOpacity
                  key={mood}
                  style={[
                    styles.multiSelectItem,
                    formData.currentMood === mood && styles.selectedMultiSelect
                  ]}
                  onPress={() => setFormData(prev => ({ ...prev, currentMood: mood }))}
                >
                  <Text style={[
                    styles.multiSelectText,
                    formData.currentMood === mood && styles.selectedMultiSelectText
                  ]}>
                    {mood}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        );
      
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#8B5CF6', '#EC4899']}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${((currentStep + 1) / steps.length) * 100}%` }]} />
            </View>
            <Text style={styles.progressText}>{currentStep + 1} of {steps.length}</Text>
          </View>
        </View>
        
        <View style={styles.content}>
          <Text style={styles.stepTitle}>{steps[currentStep].title}</Text>
          <Text style={styles.stepSubtitle}>{steps[currentStep].subtitle}</Text>
          
          {renderStep()}
        </View>
        
        <View style={styles.footer}>
          <View style={styles.navigationButtons}>
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <ChevronLeft size={20} color="#8B5CF6" />
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.nextButton, isLoading && styles.nextButtonDisabled]} 
              onPress={handleNext}
              disabled={isLoading}
            >
              <Text style={styles.nextButtonText}>
                {isLoading ? 'Creating Account...' : (currentStep === steps.length - 1 ? 'Get Started' : 'Next')}
              </Text>
              {!isLoading && <ChevronRight size={20} color="#FFFFFF" />}
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 10,
  },
  progressContainer: {
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
  progressText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  stepTitle: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  stepSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 30,
    textAlign: 'center',
  },
  welcomeContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  iconContainer: {
    width: 100,
    height: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  welcomeTitle: {
    fontSize: 36,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  welcomeSubtitle: {
    fontSize: 18,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },
  featureList: {
    alignItems: 'flex-start',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
    marginLeft: 12,
  },
  formContainer: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  textInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  optionsContainer: {
    flex: 1,
  },
  optionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderColor: '#FFFFFF',
  },
  optionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  optionDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  selectedText: {
    color: '#FFFFFF',
  },
  selectedDescription: {
    color: 'rgba(255, 255, 255, 0.9)',
  },
  multiSelectGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  multiSelectItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedMultiSelect: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderColor: '#FFFFFF',
  },
  multiSelectText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  selectedMultiSelectText: {
    color: '#FFFFFF',
  },
  footer: {
    padding: 20,
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
  },
  backButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 30,
    paddingVertical: 14,
    borderRadius: 25,
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
  },
  nextButtonDisabled: {
    opacity: 0.7,
  },
  nextButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#8B5CF6',
    marginRight: 8,
  },
});