import React from 'react';
import { ScrollView, TouchableOpacity, View, Text } from 'react-native';
import { ExerciseDefinition, WorkoutSetLog } from '../../../shared/types';

interface ExerciseTabListProps {
  exercises: ExerciseDefinition[];
  activeExerciseIndex: number;
  currentSetLogs: WorkoutSetLog[];
  onSelectExercise: (index: number) => void;
}

export const ExerciseTabList: React.FC<ExerciseTabListProps> = ({
  exercises,
  activeExerciseIndex,
  currentSetLogs,
  onSelectExercise,
}) => {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-5 my-3">
      {exercises.map((ex, idx) => {
        const isCurrent = idx === activeExerciseIndex;
        const completedSetsCount = currentSetLogs.filter((l) => l.exercise_name === ex.name).length;
        const exTargetSets = ex.defaultSets || 4;
        const isDone = completedSetsCount >= exTargetSets;

        return (
          <TouchableOpacity
            key={ex.id || idx}
            className={`flex-row items-center px-3.5 py-2.5 rounded-xl mr-2.5 border gap-1.5 ${
              isCurrent ? 'bg-[#0A84FF] border-[#0A84FF]' : 'bg-[#161B26] border-[#262F42]'
            }`}
            onPress={() => onSelectExercise(idx)}
            activeOpacity={0.8}
          >
            <Text className={`text-xs ${isCurrent ? 'text-white font-bold' : 'text-slate-400 font-semibold'}`}>
              {idx + 1}. {ex.name}
            </Text>
            {completedSetsCount > 0 && (
              <View className={`${isDone ? 'bg-[#30D158]' : 'bg-[#0A84FF]'} px-1.5 py-0.5 rounded-full justify-center items-center`}>
                <Text className="text-white text-[10px] font-bold">{completedSetsCount}/{exTargetSets}</Text>
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};
