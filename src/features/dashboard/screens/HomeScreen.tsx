import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useAuth } from '../../auth/context/AuthContext';
import { useWorkout } from '../../workout/context/WorkoutContext';
import { LivePartnerBadge } from '../../gamification';
import { HeaderBar } from '../../../shared/components/HeaderBar';
import { Award, Play, Dumbbell, ChevronRight } from 'lucide-react-native';

interface HomeScreenProps {
  onNavigateToWorkout: () => void;
  onNavigateToRoutines: () => void;
  onNavigateToHistory: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigateToWorkout,
  onNavigateToRoutines,
  onNavigateToHistory,
}) => {
  const { activeProfile, partnerProfile } = useAuth();
  const { activeSession, routines, startWorkout } = useWorkout();

  if (!activeProfile) return null;

  const partnerPoints = partnerProfile ? partnerProfile.bro_points : 0;
  const isLeader = activeProfile.bro_points >= partnerPoints;

  return (
    <View className="flex-1 bg-[#0A0D14]">
      <HeaderBar />

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <LivePartnerBadge />

        {activeSession && (
          <TouchableOpacity
            className="flex-row items-center justify-between bg-[#0A84FF] p-4 mx-5 my-2.5 rounded-2xl"
            onPress={onNavigateToWorkout}
            activeOpacity={0.9}
          >
            <View className="flex-row items-center gap-2.5">
              <View className="w-2.5 h-2.5 rounded-full bg-[#30D158]" />
              <View>
                <Text className="text-white font-bold text-sm">Treino em Andamento</Text>
                <Text className="text-white/80 text-xs">{activeSession.routine_name}</Text>
              </View>
            </View>
            <View className="flex-row items-center bg-white/20 px-3 py-1.5 rounded-xl gap-1">
              <Text className="text-white font-bold text-xs">VOLTAR</Text>
              <ChevronRight color="#FFFFFF" size={16} />
            </View>
          </TouchableOpacity>
        )}

        {/* Leaderboard Card */}
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
              <View
                style={{
                  width: `${Math.min(
                    100,
                    (activeProfile.bro_points /
                      (activeProfile.bro_points + partnerProfile.bro_points || 1)) *
                    100
                  )}%`,
                }}
                className="h-full bg-[#0A84FF] rounded-full"
              />
            </View>
          )}

          <Text className="text-slate-400 text-xs text-center mt-2">
            {isLeader
              ? 'Você lidera a pontuação acumulada.'
              : 'Seu parceiro está na frente da pontuação.'}
          </Text>
        </View>

        {/* Routines Quick Start */}
        <View className="flex-row justify-between items-center px-5 mt-5 mb-3">
          <Text className="text-slate-50 text-lg font-bold tracking-tight">Iniciar Treino do Dia</Text>
          <TouchableOpacity onPress={onNavigateToRoutines}>
            <Text className="text-[#0A84FF] text-sm font-semibold">Ver Todas</Text>
          </TouchableOpacity>
        </View>

        <View className="px-5 gap-3.5">
          {routines.slice(0, 3).map((routine) => (
            <TouchableOpacity
              key={routine.id}
              className="bg-[#161B26] rounded-2xl p-6 border border-[#262F42]"
              onPress={async () => {
                await startWorkout(routine);
                onNavigateToWorkout();
              }}
              activeOpacity={0.8}
            >
              <View className="flex-row justify-between items-center mb-2">
                <Dumbbell color="#0A84FF" size={20} />
                <Text className="text-[#0A84FF] text-xs font-semibold bg-[#0A84FF]/15 px-2.5 py-1 rounded-xl">
                  {routine.target_muscle}
                </Text>
              </View>
              <Text className="text-slate-50 text-base font-bold">{routine.title}</Text>
              <Text className="text-slate-400 text-xs mt-1 mb-4">{routine.exercises.length} Exercícios</Text>

              <View className="flex-row items-center justify-center bg-[#0A84FF] py-3 rounded-xl gap-2">
                <Play color="#FFFFFF" size={14} fill="#FFFFFF" />
                <Text className="text-white font-bold text-xs">INICIAR FICHA (+50 pts)</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};
