import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useAuth } from '../../features/auth/context/AuthContext';
import { Flame, Award, LogOut } from 'lucide-react-native';

export const HeaderBar: React.FC = () => {
  const { activeProfile, logout } = useAuth();

  if (!activeProfile) return null;

  return (
    <View style={{ paddingTop: 50 }} className="flex-row justify-between items-center px-5 pb-4 bg-[#0A0D14] border-b border-[#161B26]">
      <View className="flex-row items-center space-x-3 gap-3">
        <View style={{ backgroundColor: activeProfile.avatar_color || '#0A84FF' }} className="w-10 h-10 rounded-full justify-center items-center">
          <Text className="text-white font-bold text-base">{activeProfile.initials}</Text>
        </View>
        <View>
          <Text className="text-slate-50 text-base font-bold tracking-tight">{activeProfile.name}</Text>
        </View>
      </View>

      <View className="flex-row items-center space-x-2 gap-2">
        <View className="flex-row items-center bg-[#1E150A] border border-amber-500/30 px-2.5 py-1 rounded-2xl gap-1">
          <Flame color="#FF9F0A" size={16} />
          <Text className="text-[#FF9F0A] font-bold text-xs">{activeProfile.streak}d</Text>
        </View>

        <View className="flex-row items-center bg-[#1E1B0A] border border-yellow-500/30 px-2.5 py-1 rounded-2xl gap-1">
          <Award color="#FFD60A" size={16} />
          <Text className="text-[#FFD60A] font-bold text-xs">{activeProfile.bro_points} pts</Text>
        </View>

        <TouchableOpacity className="p-2 bg-[#161B26] rounded-xl border border-[#262F42]" onPress={logout} activeOpacity={0.7}>
          <LogOut color="#94A3B8" size={18} />
        </TouchableOpacity>
      </View>
    </View>
  );
};
