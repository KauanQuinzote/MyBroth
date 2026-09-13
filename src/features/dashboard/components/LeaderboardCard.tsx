import React from 'react';
import { View, Text } from 'react-native';
import { Award } from 'lucide-react-native';
import { BroProfile } from '../../../shared/types';

interface LeaderboardCardProps {
  activeProfile: BroProfile;
  partnerProfile: BroProfile | null;
}

export const LeaderboardCard: React.FC<LeaderboardCardProps> = ({
  activeProfile,
  partnerProfile,
}) => {
  const partnerPoints = partnerProfile ? partnerProfile.bro_points : 0;
  const isLeader = activeProfile.bro_points >= partnerPoints;
  const totalPoints = activeProfile.bro_points + (partnerProfile?.bro_points || 0) || 1;
  const progressPercent = Math.min(100, (activeProfile.bro_points / totalPoints) * 100);

  return (
    <View className="bg-[#161B26] rounded-3xl p-5 mx-5 my-2.5 border border-[#262F42]">
      <View className="flex-row items-center gap-2 mb-4">
        <Award color="#FFD60A" size={22} />
        <Text className="text-slate-50 text-lg font-bold tracking-tight">Placar Bro Points</Text>
      </View>

      <View className="flex-row justify-around items-center my-2.5">
        <View className="items-center">
          <View style={{ backgroundColor: activeProfile.avatar_color || '#0A84FF' }} className="w-12 h-12 rounded-full justify-center items-center">
            <Text className="text-white text-lg font-bold">{activeProfile.initials}</Text>
          </View>
          <Text className="text-slate-50 font-semibold text-sm mt-2">{activeProfile.name}</Text>
          <Text className="text-[#FFD60A] font-extrabold text-base mt-0.5">{activeProfile.bro_points} pts</Text>
          {isLeader && <Text className="text-[#30D158] text-[11px] font-bold mt-1">Líder</Text>}
        </View>

        <Text className="text-slate-500 font-extrabold text-sm">VS</Text>

        {partnerProfile ? (
          <View className="items-center">
            <View style={{ backgroundColor: partnerProfile.avatar_color || '#30D158' }} className="w-12 h-12 rounded-full justify-center items-center">
              <Text className="text-white text-lg font-bold">{partnerProfile.initials}</Text>
            </View>
            <Text className="text-slate-50 font-semibold text-sm mt-2">{partnerProfile.name}</Text>
            <Text className="text-[#FFD60A] font-extrabold text-base mt-0.5">{partnerProfile.bro_points} pts</Text>
            {!isLeader && <Text className="text-[#30D158] text-[11px] font-bold mt-1">Líder</Text>}
          </View>
        ) : null}
      </View>

      {partnerProfile && (
        <View className="h-2 bg-[#262F42] rounded-full overflow-hidden mt-4 mb-2">
          <View style={{ width: `${progressPercent}%` }} className="h-full bg-[#0A84FF] rounded-full" />
        </View>
      )}

      <Text className="text-slate-400 text-xs text-center mt-2">
        {isLeader ? 'Você lidera a pontuação acumulada.' : 'Seu parceiro está na frente da pontuação.'}
      </Text>
    </View>
  );
};
