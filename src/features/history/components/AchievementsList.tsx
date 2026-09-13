import React from 'react';
import { View, Text } from 'react-native';
import { Award } from 'lucide-react-native';
import { BroProfile } from '../../../shared/types';
import { Dumbbell, Flame, Zap, ShieldCheck } from 'lucide-react-native';

interface AchievementsListProps {
  activeProfile: BroProfile | null;
}

export const AchievementsList: React.FC<AchievementsListProps> = ({ activeProfile }) => {
  const achievements = [
    {
      id: 'ach-1',
      title: 'Clube 100kg',
      desc: 'Completou uma série com 100kg ou mais no treino',
      IconComponent: Dumbbell,
      iconColor: '#0A84FF',
      unlocked: true,
    },
    {
      id: 'ach-2',
      title: 'Consistência de Aço',
      desc: 'Alcançou uma sequência de 3 dias seguidos de treino',
      IconComponent: Flame,
      iconColor: '#FF9F0A',
      unlocked: Boolean(activeProfile && activeProfile.streak >= 3),
    },
    {
      id: 'ach-3',
      title: 'Bro de Elite',
      desc: 'Acumulou mais de 200 Bro Points',
      IconComponent: Zap,
      iconColor: '#FFD60A',
      unlocked: Boolean(activeProfile && activeProfile.bro_points >= 200),
    },
    {
      id: 'ach-4',
      title: 'Alta Performance',
      desc: 'Concluiu um treino com 100% de presença',
      IconComponent: ShieldCheck,
      iconColor: '#30D158',
      unlocked: false,
    },
  ];

  return (
    <View className="px-5 mt-5">
      <View className="flex-row items-center gap-2 mb-3.5">
        <Award color="#FFD60A" size={22} />
        <Text className="text-slate-50 text-lg font-bold tracking-tight">Conquistas Ativas</Text>
      </View>

      <View className="gap-3">
        {achievements.map((ach) => {
          const IconComp = ach.IconComponent;
          return (
            <View
              key={ach.id}
              className={`flex-row items-center rounded-2xl p-3.5 border gap-3 ${
                ach.unlocked ? 'bg-[#161B26] border-[#262F42]' : 'bg-[#0A0D14] border-[#161B26] opacity-50'
              }`}
            >
              <View style={{ backgroundColor: `${ach.iconColor}20` }} className="w-10 h-10 rounded-full justify-center items-center">
                <IconComp color={ach.iconColor} size={20} />
              </View>
              <View className="flex-1">
                <Text className={`font-bold text-sm ${ach.unlocked ? 'text-slate-50' : 'text-slate-500'}`}>{ach.title}</Text>
                <Text className="text-slate-400 text-xs mt-0.5">{ach.desc}</Text>
              </View>
              <View className={`px-2 py-1 rounded-lg ${ach.unlocked ? 'bg-emerald-500/15' : 'bg-[#262F42]'}`}>
                <Text className="text-[#30D158] text-[9px] font-bold">{ach.unlocked ? 'CONCLUÍDO' : 'BLOQUEADO'}</Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};
