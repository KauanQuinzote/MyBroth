import React from 'react';
import { View, Text } from 'react-native';
import { Calendar, Dumbbell, Zap } from 'lucide-react-native';
import { WorkoutSession } from '../../../shared/types';

interface SessionsHistoryListProps {
  sessions: WorkoutSession[];
}

export const SessionsHistoryList: React.FC<SessionsHistoryListProps> = ({ sessions }) => {
  return (
    <View className="px-5 mt-5">
      <View className="flex-row items-center gap-2 mb-3.5">
        <Calendar color="#0A84FF" size={22} />
        <Text className="text-slate-50 text-lg font-bold tracking-tight">Histórico de Treinos</Text>
      </View>

      <View className="gap-3">
        {sessions.length > 0 ? (
          sessions.map((sess) => (
            <View key={sess.id} className="bg-[#161B26] rounded-2xl p-4 border border-[#262F42]">
              <View className="flex-row items-center gap-2.5 mb-2.5">
                <Dumbbell color="#30D158" size={18} />
                <Text className="text-slate-50 text-base font-bold">{sess.routine_name}</Text>
              </View>

              <View className="flex-row justify-between items-center">
                <Text className="text-slate-400 text-xs">
                  {new Date(sess.started_at).toLocaleDateString('pt-BR')} às{' '}
                  {new Date(sess.started_at).toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>

                <View className="flex-row items-center bg-[#FFD60A]/15 px-2.5 py-1 rounded-xl gap-1">
                  <Zap color="#FFD60A" size={12} />
                  <Text className="text-[#FFD60A] text-xs font-bold">+{sess.bro_points_earned} pts</Text>
                </View>
              </View>
            </View>
          ))
        ) : (
          <Text className="text-slate-500 text-center py-5 text-xs">Nenhum treino registrado ainda.</Text>
        )}
      </View>
    </View>
  );
};
