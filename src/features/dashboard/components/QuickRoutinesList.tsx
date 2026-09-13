import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Dumbbell, Play } from 'lucide-react-native';
import { WorkoutRoutine } from '../../../shared/types';

interface QuickRoutinesListProps {
  routines: WorkoutRoutine[];
  onSeeAll: () => void;
  onStartRoutine: (routine: WorkoutRoutine) => void;
}

export const QuickRoutinesList: React.FC<QuickRoutinesListProps> = ({
  routines,
  onSeeAll,
  onStartRoutine,
}) => {
  return (
    <View>
      <View className="flex-row justify-between items-center px-5 mt-5 mb-3">
        <Text className="text-slate-50 text-lg font-bold tracking-tight">Iniciar Treino do Dia</Text>
        <TouchableOpacity onPress={onSeeAll}>
          <Text className="text-[#0A84FF] text-sm font-semibold">Ver Todas</Text>
        </TouchableOpacity>
      </View>

      <View className="px-5 gap-3.5">
        {routines.slice(0, 3).map((routine) => (
          <TouchableOpacity
            key={routine.id}
            className="bg-[#161B26] rounded-2xl p-6 border border-[#262F42]"
            onPress={() => onStartRoutine(routine)}
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
    </View>
  );
};
