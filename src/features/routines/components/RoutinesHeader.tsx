import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Plus } from 'lucide-react-native';

interface RoutinesHeaderProps {
  onCreatePress: () => void;
}

export const RoutinesHeader: React.FC<RoutinesHeaderProps> = ({ onCreatePress }) => {
  return (
    <View className="flex-row justify-between items-center px-5 mt-5 mb-4">
      <View>
        <Text className="text-slate-50 text-2xl font-bold tracking-tight">Fichas de Treino</Text>
        <Text className="text-slate-400 text-xs mt-0.5">Rotinas de alta performance</Text>
      </View>
      <TouchableOpacity
        className="bg-[#0A84FF] w-11 h-11 rounded-full justify-center items-center"
        onPress={onCreatePress}
        activeOpacity={0.8}
      >
        <Plus color="#FFFFFF" size={20} />
      </TouchableOpacity>
    </View>
  );
};
