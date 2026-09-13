import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Dumbbell, Plus, Play } from 'lucide-react-native';
import { WorkoutRoutine } from '../../../shared/types';

interface RoutineCardProps {
  routine: WorkoutRoutine;
  onAddExercise: () => void;
  onStartWorkout: () => void;
}

export const RoutineCard: React.FC<RoutineCardProps> = ({
  routine,
  onAddExercise,
  onStartWorkout,
}) => {
  return (
    <View className="bg-[#161B26] rounded-2xl p-5 border border-[#262F42]">
      <View className="flex-row justify-between items-center mb-2">
        <Dumbbell color="#0A84FF" size={20} />
        <Text className="text-[#0A84FF] bg-[#0A84FF]/15 px-2.5 py-1 rounded-xl text-xs font-semibold">
          {routine.target_muscle}
        </Text>
      </View>

      <Text className="text-slate-50 text-lg font-bold mb-3">{routine.title}</Text>

      <View className="bg-[#0A0D14] rounded-xl p-3 gap-1.5 mb-4">
        {routine.exercises.map((ex, idx) => (
          <Text key={ex.id || idx} className="text-slate-300 text-xs">
            • {ex.name} ({ex.defaultSets}x{ex.defaultReps})
          </Text>
        ))}

        {routine.exercises.length === 0 && (
          <Text className="text-slate-500 text-xs italic">Nenhum exercício cadastrado ainda.</Text>
        )}
      </View>

      <View className="flex-row gap-2.5">
        <TouchableOpacity
          className="flex-row items-center justify-center bg-[#0A84FF]/15 px-3 py-3 rounded-xl gap-1.5 border border-[#0A84FF]/30"
          onPress={onAddExercise}
          activeOpacity={0.8}
        >
          <Plus color="#0A84FF" size={16} />
          <Text className="text-[#0A84FF] font-semibold text-xs">Adicionar Exercício</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-1 flex-row items-center justify-center bg-[#0A84FF] py-3 rounded-xl gap-2"
          onPress={onStartWorkout}
          activeOpacity={0.8}
        >
          <Play color="#FFFFFF" size={14} fill="#FFFFFF" />
          <Text className="text-white font-bold text-xs">INICIAR FICHA (+50 pts)</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
