import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Gift, Sparkles, Star, Crown, Zap, Lock, Check } from 'lucide-react-native';
import { useUser } from '@/components/UserContext';

export default function RewardsScreen() {
  const { profile, rewards, redeemReward } = useUser();

  const handleRedeemReward = (reward: any) => {
    if (reward.redeemed) {
      Alert.alert('Already Redeemed', 'You have already redeemed this reward.');
      return;
    }

    if (!reward.unlocked) {
      Alert.alert('Locked', 'This reward is not yet unlocked. Complete more quests to unlock it!');
      return;
    }

    if (profile.sparkPoints < reward.cost) {
      Alert.alert('Insufficient Points', `You need ${reward.cost - profile.sparkPoints} more Spark Points to redeem this reward.`);
      return;
    }

    Alert.alert(
      'Redeem Reward',
      `Are you sure you want to redeem "${reward.title}" for ${reward.cost} Spark Points?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Redeem',
          onPress: () => {
            redeemReward(reward.id);
            // In a real app, you would also deduct the points
            Alert.alert('Success!', `You have successfully redeemed "${reward.title}"!`);
          }
        }
      ]
    );
  };

  const getRewardIcon = (type: string) => {
    switch (type) {
      case 'profile-boost':
        return <Star size={24} color="#F59E0B" />;
      case 'exclusive-content':
        return <Crown size={24} color="#8B5CF6" />;
      case 'custom-prompt':
        return <Zap size={24} color="#EC4899" />;
      case 'surprise-token':
        return <Gift size={24} color="#10B981" />;
      default:
        return <Gift size={24} color="#6B7280" />;
    }
  };

  const getProgressToNext = () => {
    const nextLevelPoints = profile.level * 100;
    const currentLevelPoints = (profile.level - 1) * 100;
    const progressPoints = profile.sparkPoints - currentLevelPoints;
    const neededPoints = nextLevelPoints - currentLevelPoints;
    
    return {
      current: progressPoints,
      needed: neededPoints,
      percentage: (progressPoints / neededPoints) * 100
    };
  };

  const progress = getProgressToNext();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Rewards Store</Text>
          <Text style={styles.subtitle}>Redeem your Spark Points for amazing rewards</Text>
        </View>

        {/* Points Balance */}
        <LinearGradient
          colors={['#8B5CF6', '#EC4899']}
          style={styles.balanceCard}
        >
          <View style={styles.balanceHeader}>
            <View style={styles.balanceInfo}>
              <Text style={styles.balanceLabel}>Your Balance</Text>
              <View style={styles.balanceAmount}>
                <Sparkles size={24} color="#FFFFFF" />
                <Text style={styles.balanceNumber}>{profile.sparkPoints}</Text>
                <Text style={styles.balanceText}>Spark Points</Text>
              </View>
            </View>
            
            <View style={styles.levelInfo}>
              <Text style={styles.levelLabel}>Level {profile.level}</Text>
              <View style={styles.levelProgress}>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${progress.percentage}%` }]} />
                </View>
                <Text style={styles.progressText}>
                  {progress.current}/{progress.needed} to Level {profile.level + 1}
                </Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* Rewards Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Available Rewards</Text>
          
          <View style={styles.rewardsGrid}>
            {rewards.map((reward) => (
              <View key={reward.id} style={styles.rewardCard}>
                <View style={styles.rewardHeader}>
                  <View style={styles.rewardIconContainer}>
                    {getRewardIcon(reward.type)}
                  </View>
                  
                  <View style={styles.rewardStatus}>
                    {reward.redeemed ? (
                      <View style={styles.redeemedBadge}>
                        <Check size={12} color="#10B981" />
                      </View>
                    ) : !reward.unlocked ? (
                      <View style={styles.lockedBadge}>
                        <Lock size={12} color="#6B7280" />
                      </View>
                    ) : null}
                  </View>
                </View>

                <Text style={styles.rewardTitle}>{reward.title}</Text>
                <Text style={styles.rewardDescription}>{reward.description}</Text>

                <View style={styles.rewardFooter}>
                  <View style={styles.rewardCost}>
                    <Sparkles size={16} color="#F59E0B" />
                    <Text style={styles.rewardCostText}>{reward.cost}</Text>
                  </View>

                  <TouchableOpacity
                    style={[
                      styles.redeemButton,
                      reward.redeemed && styles.redeemedButton,
                      !reward.unlocked && styles.lockedButton,
                      profile.sparkPoints < reward.cost && reward.unlocked && !reward.redeemed && styles.insufficientButton
                    ]}
                    onPress={() => handleRedeemReward(reward)}
                    disabled={reward.redeemed}
                  >
                    <Text style={[
                      styles.redeemButtonText,
                      reward.redeemed && styles.redeemedButtonText,
                      !reward.unlocked && styles.lockedButtonText,
                      profile.sparkPoints < reward.cost && reward.unlocked && !reward.redeemed && styles.insufficientButtonText
                    ]}>
                      {reward.redeemed ? 'Redeemed' : 
                       !reward.unlocked ? 'Locked' :
                       profile.sparkPoints < reward.cost ? 'Not Enough Points' : 'Redeem'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Earning Tips */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How to Earn More Points</Text>
          <View style={styles.tipsContainer}>
            <View style={styles.tipItem}>
              <View style={styles.tipIcon}>
                <Target size={20} color="#8B5CF6" />
              </View>
              <View style={styles.tipContent}>
                <Text style={styles.tipTitle}>Complete Daily Quests</Text>
                <Text style={styles.tipDescription}>Earn 25-50 points per quest</Text>
              </View>
            </View>

            <View style={styles.tipItem}>
              <View style={styles.tipIcon}>
                <Zap size={20} color="#EC4899" />
              </View>
              <View style={styles.tipContent}>
                <Text style={styles.tipTitle}>Submit Reflections</Text>
                <Text style={styles.tipDescription}>Get bonus points for sharing your thoughts</Text>
              </View>
            </View>

            <View style={styles.tipItem}>
              <View style={styles.tipIcon}>
                <Star size={20} color="#F59E0B" />
              </View>
              <View style={styles.tipContent}>
                <Text style={styles.tipTitle}>Maintain Streaks</Text>
                <Text style={styles.tipDescription}>Streak bonuses multiply your rewards</Text>
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
  balanceCard: {
    margin: 20,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  balanceInfo: {
    flex: 1,
  },
  balanceLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 8,
  },
  balanceAmount: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  balanceNumber: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginLeft: 8,
    marginRight: 8,
  },
  balanceText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  levelInfo: {
    alignItems: 'flex-end',
    flex: 1,
  },
  levelLabel: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  levelProgress: {
    alignItems: 'flex-end',
    width: '100%',
  },
  progressBar: {
    width: '100%',
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 3,
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.8)',
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
  rewardsGrid: {
    gap: 16,
  },
  rewardCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  rewardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  rewardIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rewardStatus: {
    width: 20,
    height: 20,
  },
  redeemedBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#D1FAE5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockedBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rewardTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 8,
  },
  rewardDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 16,
    lineHeight: 20,
  },
  rewardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rewardCost: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  rewardCostText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#92400E',
    marginLeft: 4,
  },
  redeemButton: {
    backgroundColor: '#8B5CF6',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  redeemButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  redeemedButton: {
    backgroundColor: '#D1FAE5',
  },
  redeemedButtonText: {
    color: '#059669',
  },
  lockedButton: {
    backgroundColor: '#F3F4F6',
  },
  lockedButtonText: {
    color: '#9CA3AF',
  },
  insufficientButton: {
    backgroundColor: '#FEE2E2',
  },
  insufficientButtonText: {
    color: '#DC2626',
  },
  tipsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  tipIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  tipDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
});