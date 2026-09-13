import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Plus, CheckCircle2 } from 'lucide-react-native';
import { ExerciseDefinition } from '../../../shared/types';

interface SetRegisterFormProps {
  currentExercise: ExerciseDefinition;
  currentSetsCount: number;
  weightKg: string;
  reps: string;
  onChangeWeight: (value: string) => void;
  onChangeReps: (value: string) => void;
  onAddSet: () => void;
  onNextExercise?: () => void;
  hasNextExercise: boolean;
}

export const SetRegisterForm: React.FC<SetRegisterFormProps> = ({
  currentExercise,
  currentSetsCount,
  weightKg,
  reps,
  onChangeWeight,
  onChangeReps,
  onAddSet,
  onNextExercise,
  hasNextExercise,
}) => {
  const isCompleted = currentSetsCount >= (currentExercise.defaultSets || 4);

  if (isCompleted) {
    return (
      <View className="bg-[#30D158]/10 rounded-2xl p-4 border border-[#30D158]/30 items-center">
        <CheckCircle2 color="#30D158" size={24} />
        <Text className="text-[#30D158] font-bold text-sm mt-1">Exercício Concluído!</Text>
        <Text className="text-slate-400 text-xs mt-0.5">Todas as {currentExercise.defaultSets} séries programadas foram executadas.</Text>

        {hasNextExercise && onNextExercise && (
          <TouchableOpacity className="bg-[#0A84FF] px-4 py-2.5 rounded-xl mt-3" onPress={onNextExercise} activeOpacity={0.8}>
            <Text className="text-white font-bold text-xs">IR PARA O PRÓXIMO EXERCÍCIO</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  return (
    <View className="bg-[#0A0D14] rounded-2xl p-4 border border-[#262F42]">
      <Text className="text-slate-50 text-sm font-bold mb-3">
        Registrar Série #{currentSetsCount + 1} de {currentExercise.defaultSets}
      </Text>

      <View className="flex-row gap-3 mb-3.5">
        <View className="flex-1">
          <Text className="text-slate-400 text-xs font-semibold mb-1.5">Carga (KG)</Text>
          <TextInput
            className="bg-[#161B26] text-white rounded-xl px-3 py-2.5 text-lg font-bold text-center border border-[#262F42]"
            keyboardType="numeric"
            value={weightKg}
            onChangeText={onChangeWeight}
          />
        </View>

        <View className="flex-1">
          <Text className="text-slate-400 text-xs font-semibold mb-1.5">Repetições</Text>
          <TextInput
            className="bg-[#161B26] text-white rounded-xl px-3 py-2.5 text-lg font-bold text-center border border-[#262F42]"
            keyboardType="numeric"
            value={reps}
            onChangeText={onChangeReps}
          />
        </View>
      </View>

      <TouchableOpacity className="flex-row bg-[#0A84FF] py-3.5 rounded-xl justify-center items-center gap-2" onPress={onAddSet} activeOpacity={0.8}>
        <Plus color="#FFFFFF" size={18} />
        <Text className="text-white font-bold text-sm">CONCLUIR SÉRIE (+10 pts)</Text>
      </TouchableOpacity>
    </View>
  );
};
