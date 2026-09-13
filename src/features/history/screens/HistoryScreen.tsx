import React, { useEffect, useState } from 'react';
import { View, ScrollView } from 'react-native';
import { HeaderBar } from '../../../shared/components/HeaderBar';
import { LocalStorageService } from '../../../shared/services/storage';
import { WorkoutSession } from '../../../shared/types';
import { useAuth } from '../../auth';
import { AchievementsList } from '../components/AchievementsList';
import { SessionsHistoryList } from '../components/SessionsHistoryList';

export const HistoryScreen: React.FC = () => {
  const { activeProfile } = useAuth();
  const [sessions, setSessions] = useState<WorkoutSession[]>([]);

  useEffect(() => {
    LocalStorageService.getSessions().then(setSessions);
  }, []);

  return (
    <View className="flex-1 bg-[#0A0D14]">
      <HeaderBar />
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <AchievementsList activeProfile={activeProfile} />
        <SessionsHistoryList sessions={sessions} />
      </ScrollView>
    </View>
  );
};
