import React from 'react';
import { View, Text, Trophy, Award } from 'lucide-react-native';
import { BroProfile } from '../../../shared/types';

interface LeaderboardCardProps {
  profiles: BroProfile[];
  activeProfile: BroProfile;
}

export const LeaderboardCard: React.FC<LeaderboardCardProps> = ({ profiles = [], activeProfile }) => {
  const sortedProfiles = Array.isArray(profiles) ? [...profiles].sort((a, b) => b.bro_points - a.bro_points) : [activeProfile];
  const top3 = sortedProfiles.slice(0, 3);
  const rest = sortedProfiles.slice(3);

  const getPodiumColor = (index: number) => {
    if (index === 0) return '#FFD60A';
    if (index === 1) return '#C0C0C0';
    return '#CD7F32';
  };

  return (
    <View className="bg-[#161B26] rounded-3xl p-5 mx-5 my-2.5 border border-[#262F42]">
      <View className="flex-row items-center gap-2 mb-4">
        <Award color="#FFD60A" size={22} />
        <Text className="text-slate-50 text-lg font-bold tracking-tight">Placar Bro Points</Text>
      </View>

      <View className="flex-row justify-around items-end mb-5 pt-2 border-b border-[#262F42] pb-5">
        {top3.map((profile, idx) => {
          const medalColor = getPodiumColor(idx);
          const isMe = profile.id === activeProfile?.id;
          return (
            <View key={profile.id} className="items-center">
              <View className="items-center mb-1">
                <Trophy color={medalColor} size={16} />
                <Text style={{ color: medalColor }} className="text-[10px] font-extrabold">{idx + 1}º LUGAR</Text>
              </View>
              <View style={{ backgroundColor: profile.avatar_color || '#0A84FF' }} className={`w-12 h-12 rounded-full justify-center items-center ${isMe ? 'border-2 border-[#0A84FF]' : ''}`}>
                <Text className="text-white text-base font-bold">{profile.initials}</Text>
              </View>
              <Text className="text-slate-50 font-bold text-xs mt-1.5">{profile.name.split(' ')[0]}</Text>
              <Text className="text-[#FFD60A] font-extrabold text-xs">{profile.bro_points} pts</Text>
            </View>
          );
        })}
      </View>

      {rest.length > 0 && (
        <View className="gap-2">
          {rest.map((p, idx) => (
            <View key={p.id} className="flex-row items-center justify-between bg-[#0A0D14] p-3 rounded-xl border border-[#262F42]">
              <View className="flex-row items-center gap-2.5">
                <Text className="text-slate-400 font-bold text-xs w-5">#{idx + 4}</Text>
                <View style={{ backgroundColor: p.avatar_color || '#0A84FF' }} className="w-8 h-8 rounded-full justify-center items-center">
                  <Text className="text-white text-xs font-bold">{p.initials}</Text>
                </View>
                <Text className="text-slate-200 text-xs font-bold">{p.name}</Text>
              </View>
              <Text className="text-[#FFD60A] font-extrabold text-xs">{p.bro_points} pts</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};
