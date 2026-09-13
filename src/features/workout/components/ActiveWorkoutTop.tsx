import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';

interface ActiveWorkoutTopProps {
  routineName: string;
  broPointsEarned: number;
  onCancel: () => void;
  onComplete: () => void;
}

export const ActiveWorkoutTop: React.FC<ActiveWorkoutTopProps> = ({
  routineName,
  broPointsEarned,
  onCancel,
  onComplete,
}) => {
  return (
    <View style={{ paddingTop: 50 }} className="flex-row items-center justify-between px-5 pb-4 bg-[#161B26] border-b border-[#262F42]">
      <TouchableOpacity className="p-2" onPress={onCancel} activeOpacity={0.7}>
        <ArrowLeft color="#94A3B8" size={20} />
      </TouchableOpacity>

      <View className="items-center flex-1">
        <Text className="text-slate-50 text-base font-bold">{routineName}</Text>
        <Text className="text-[#FFD60A] text-xs font-semibold mt-0.5">Bro Points: {broPointsEarned} pts</Text>
      </View>

      <TouchableOpacity className="bg-[#30D158] px-3 py-1.5 rounded-xl" onPress={onComplete} activeOpacity={0.8}>
        <Text className="text-white font-bold text-xs">FINALIZAR</Text>
      </TouchableOpacity>
    </View>
  );
};
