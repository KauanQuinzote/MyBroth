import React from 'react';
import { View, Text } from 'react-native';
import { useAuth } from '../../auth/context/AuthContext';
import { useWorkout } from '../../workout/context/WorkoutContext';
import { Activity, Dumbbell, UserCheck } from 'lucide-react-native';

export const LivePartnerBadge: React.FC = () => {
  const { partnerProfile, isPartnerOnline, partnerStatus } = useAuth();
  const { partnerActiveSession } = useWorkout();

  if (!partnerProfile) return null;

  const isInWorkout = Boolean(
    partnerStatus === 'TRAINING' || (partnerActiveSession && partnerActiveSession.status === 'in_progress')
  );

  return (
    <View
      className={`rounded-2xl p-4 mx-5 my-2.5 border ${
        isInWorkout
          ? 'bg-[#0A1A10] border-emerald-500/40'
          : isPartnerOnline
          ? 'bg-[#0A1628] border-[#0A84FF]/40'
          : 'bg-[#161B26] border-[#262F42]'
      }`}
    >
      <View className="flex-row justify-between items-center">
        <View className="flex-row items-center gap-3">
          <View
            style={{ backgroundColor: partnerProfile.avatar_color || '#30D158' }}
            className="w-9 h-9 rounded-full justify-center items-center"
          >
            <Text className="text-white text-sm font-bold">{partnerProfile.initials}</Text>
          </View>
          <View>
            <Text className="text-slate-50 text-base font-bold">{partnerProfile.name}</Text>
            <Text className="text-slate-400 text-xs">{partnerProfile.bro_points} Bro Points</Text>
          </View>
        </View>

        {/* Indicadores de Status */}
        {isInWorkout ? (
          <View className="flex-row items-center bg-emerald-500/20 px-2.5 py-1 rounded-xl gap-1.5 border border-emerald-500/30">
            <View className="w-2 h-2 rounded-full bg-[#30D158]" />
            <Text className="text-[#30D158] text-[11px] font-bold">TREINANDO AGORA</Text>
          </View>
        ) : isPartnerOnline ? (
          <View className="flex-row items-center bg-[#0A84FF]/20 px-2.5 py-1 rounded-xl gap-1.5 border border-[#0A84FF]/30">
            <View className="w-2 h-2 rounded-full bg-[#0A84FF]" />
            <Text className="text-[#0A84FF] text-[11px] font-bold">ONLINE NO APP</Text>
          </View>
        ) : (
          <View className="bg-[#262F42] px-2.5 py-1 rounded-xl">
            <Text className="text-slate-400 text-[11px] font-semibold">OFFLINE</Text>
          </View>
        )}
      </View>

      {/* Detalhes do Treino ou Presença */}
      {isInWorkout && partnerActiveSession ? (
        <View className="mt-3 pt-3 border-t border-emerald-500/20 gap-1.5">
          <View className="flex-row items-center gap-2">
            <Dumbbell color="#30D158" size={16} />
            <Text className="text-slate-400 text-xs">
              Treino: <Text className="font-bold text-slate-50">{partnerActiveSession.routine_name}</Text>
            </Text>
          </View>

          <View className="flex-row items-center gap-2">
            <Activity color="#0A84FF" size={16} />
            <Text className="text-slate-400 text-xs">
              Exercício: <Text className="font-bold text-slate-50">{partnerActiveSession.current_exercise || 'Aquecendo'}</Text>
            </Text>
          </View>

          {partnerActiveSession.current_weight_kg ? (
            <Text className="text-[#FFD60A] text-xs font-bold mt-0.5">
              Carga: {partnerActiveSession.current_weight_kg} kg (Série {partnerActiveSession.current_set})
            </Text>
          ) : null}
        </View>
      ) : isPartnerOnline ? (
        <View className="mt-3 pt-3 border-t border-[#0A84FF]/20 flex-row items-center gap-2">
          <UserCheck color="#0A84FF" size={16} />
          <Text className="text-slate-300 text-xs font-medium">
            Seu bro está ativo e navegando no app agora!
          </Text>
        </View>
      ) : (
        <Text className="text-slate-500 text-xs mt-2 font-normal">
          Parceiro inativo no momento. Os dados serão sincronizados ao entrar no app.
        </Text>
      )}
    </View>
  );
};
