import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { WorkoutSession } from '../../../shared/types';

interface ActiveWorkoutBannerProps {
  session: WorkoutSession;
  onNavigate: () => void;
}

export const ActiveWorkoutBanner: React.FC<ActiveWorkoutBannerProps> = ({ session, onNavigate }) => {
  return (
    <TouchableOpacity
      className="flex-row items-center justify-between bg-[#0A84FF] p-4 mx-5 my-2.5 rounded-2xl"
      onPress={onNavigate}
      activeOpacity={0.9}
    >
      <View className="flex-row items-center gap-2.5">
        <View className="w-2.5 h-2.5 rounded-full bg-[#30D158]" />
        <View>
          <Text className="text-white font-bold text-sm">Treino em Andamento</Text>
          <Text className="text-white/80 text-xs">{session.routine_name}</Text>
        </View>
      </View>
      <View className="flex-row items-center bg-white/20 px-3 py-1.5 rounded-xl gap-1">
        <Text className="text-white font-bold text-xs">VOLTAR</Text>
        <ChevronRight color="#FFFFFF" size={16} />
      </View>
    </TouchableOpacity>
  );
};
