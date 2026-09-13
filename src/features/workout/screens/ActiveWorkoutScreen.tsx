import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Modal,
  Alert,
} from 'react-native';
import { useWorkout } from '../context/WorkoutContext';
import { RestTimerBar } from '../components/RestTimerBar';
import {
  CheckCircle2,
  Dumbbell,
  Plus,
  Zap,
  ArrowLeft,
  Award,
} from 'lucide-react-native';

interface ActiveWorkoutScreenProps {
  onFinish: () => void;
}

export const ActiveWorkoutScreen: React.FC<ActiveWorkoutScreenProps> = ({ onFinish }) => {
  const {
    activeSession,
    currentSetLogs,
    logSet,
    finishWorkout,
    cancelWorkout,
    routines,
  } = useWorkout();

  const [weightKg, setWeightKg] = useState('60');
  const [reps, setReps] = useState('10');
  const [activeExerciseIndex, setActiveExerciseIndex] = useState(0);
  const [finishModalVisible, setFinishModalVisible] = useState(false);
  const [earnedPoints, setEarnedPoints] = useState(0);

  if (!activeSession) return null;

  const currentRoutine = routines.find((r) => r.title === activeSession.routine_name);
  const exercises = currentRoutine ? currentRoutine.exercises : [
    { id: 'ex-def-1', name: activeSession.current_exercise || 'Supino Reto', defaultSets: 4, defaultReps: 10, targetMuscle: 'Geral' },
  ];

  const currentExercise = exercises[activeExerciseIndex] || exercises[0];
  const logsForCurrentExercise = currentSetLogs.filter(
    (l) => l.exercise_name === currentExercise.name
  );

  const handleAddSet = async () => {
    const w = parseFloat(weightKg) || 0;
    const r = parseInt(reps) || 0;
    if (w <= 0 || r <= 0) {
      Alert.alert('Atenção', 'Insira uma carga e repetições válidas!');
      return;
    }

    await logSet(currentExercise.name, w, r);
  };

  const handleCompleteWorkout = async () => {
    const result = await finishWorkout();
    setEarnedPoints(result.broPointsEarned);
    setFinishModalVisible(true);
  };

  return (
    <View className="flex-1 bg-[#0A0D14]">
      <View style={{ paddingTop: 50 }} className="flex-row items-center justify-between px-5 pb-4 bg-[#161B26] border-b border-[#262F42]">
        <TouchableOpacity className="p-2" onPress={cancelWorkout} activeOpacity={0.7}>
          <ArrowLeft color="#94A3B8" size={20} />
        </TouchableOpacity>
        <View className="items-center flex-1">
          <Text className="text-slate-50 text-base font-bold">{activeSession.routine_name}</Text>
          <Text className="text-[#FFD60A] text-xs font-semibold mt-0.5">Bro Points: {activeSession.bro_points_earned} pts</Text>
        </View>
        <TouchableOpacity className="bg-[#30D158] px-3 py-1.5 rounded-xl" onPress={handleCompleteWorkout} activeOpacity={0.8}>
          <Text className="text-white font-bold text-xs">FINALIZAR</Text>
        </TouchableOpacity>
      </View>

      <RestTimerBar />

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-5 my-3">
          {exercises.map((ex, idx) => {
            const isCurrent = idx === activeExerciseIndex;
            const completedSetsCount = currentSetLogs.filter((l) => l.exercise_name === ex.name).length;
            return (
              <TouchableOpacity
                key={ex.id || idx}
                className={`flex-row items-center px-3.5 py-2.5 rounded-xl mr-2.5 border gap-1.5 ${
                  isCurrent ? 'bg-[#0A84FF] border-[#0A84FF]' : 'bg-[#161B26] border-[#262F42]'
                }`}
                onPress={() => setActiveExerciseIndex(idx)}
                activeOpacity={0.8}
              >
                <Text className={`text-xs ${isCurrent ? 'text-white font-bold' : 'text-slate-400 font-semibold'}`}>
                  {idx + 1}. {ex.name}
                </Text>
                {completedSetsCount > 0 && (
                  <View className="bg-[#30D158] w-4 h-4 rounded-full justify-center items-center">
                    <Text className="text-white text-[10px] font-bold">{completedSetsCount}</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View className="bg-[#161B26] mx-5 rounded-3xl p-5 border border-[#262F42]">
          <View className="flex-row items-center gap-2.5">
            <Dumbbell color="#0A84FF" size={22} />
            <Text className="text-slate-50 text-lg font-bold flex-1">{currentExercise.name}</Text>
          </View>
          <Text className="text-slate-400 text-xs mt-1.5 mb-4">
            Alvo: {currentExercise.targetMuscle} | Meta: {currentExercise.defaultSets} Séries x {currentExercise.defaultReps} Reps
          </Text>

          <View className="bg-[#0A0D14] rounded-2xl p-3 mb-4">
            <View className="flex-row justify-between pb-2 border-b border-[#161B26]">
              <Text className="text-slate-500 text-xs font-semibold flex-1 text-center">Série</Text>
              <Text className="text-slate-500 text-xs font-semibold flex-1 text-center">Carga (kg)</Text>
              <Text className="text-slate-500 text-xs font-semibold flex-1 text-center">Reps</Text>
              <Text className="text-slate-500 text-xs font-semibold flex-1 text-center">Status</Text>
            </View>

            {logsForCurrentExercise.map((log) => (
              <View key={log.id} className="flex-row justify-between items-center py-2.5 border-b border-[#161B26]">
                <Text className="text-[#0A84FF] text-sm font-bold flex-1 text-center">#{log.set_number}</Text>
                <Text className="text-slate-50 text-sm flex-1 text-center">{log.weight_kg} kg</Text>
                <Text className="text-slate-50 text-sm flex-1 text-center">{log.reps} reps</Text>
                <View className="flex-1 flex-row justify-center items-center gap-1">
                  {log.is_pr && <Text className="text-[#FFD60A] text-[10px] font-bold">PR (+25 pts)</Text>}
                  <CheckCircle2 color="#30D158" size={18} />
                </View>
              </View>
            ))}

            {logsForCurrentExercise.length === 0 && (
              <Text className="text-slate-500 text-center py-3 text-xs">Nenhuma série registrada ainda neste exercício.</Text>
            )}
          </View>

          <View className="bg-[#0A0D14] rounded-2xl p-4 border border-[#262F42]">
            <Text className="text-slate-50 text-sm font-bold mb-3">Registrar Série #{logsForCurrentExercise.length + 1}</Text>
            
            <View className="flex-row gap-3 mb-3.5">
              <View className="flex-1">
                <Text className="text-slate-400 text-xs font-semibold mb-1.5">Carga (KG)</Text>
                <TextInput
                  className="bg-[#161B26] text-white rounded-xl px-3 py-2.5 text-lg font-bold text-center border border-[#262F42]"
                  keyboardType="numeric"
                  value={weightKg}
                  onChangeText={setWeightKg}
                />
              </View>

              <View className="flex-1">
                <Text className="text-slate-400 text-xs font-semibold mb-1.5">Repetições</Text>
                <TextInput
                  className="bg-[#161B26] text-white rounded-xl px-3 py-2.5 text-lg font-bold text-center border border-[#262F42]"
                  keyboardType="numeric"
                  value={reps}
                  onChangeText={setReps}
                />
              </View>
            </View>

            <TouchableOpacity className="flex-row bg-[#0A84FF] py-3.5 rounded-xl justify-center items-center gap-2" onPress={handleAddSet} activeOpacity={0.8}>
              <Plus color="#FFFFFF" size={18} />
              <Text className="text-white font-bold text-sm">CONCLUIR SÉRIE (+10 pts)</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <Modal visible={finishModalVisible} transparent animationType="fade">
        <View className="flex-1 bg-[#0A0D14]/88 justify-center items-center p-5">
          <View className="bg-[#161B26] rounded-3xl p-8 items-center w-full max-w-[320px] border border-[#FFD60A]">
            <View className="w-18 h-18 rounded-full bg-[#FFD60A]/15 justify-center items-center mb-4 p-4">
              <Award color="#FFD60A" size={40} />
            </View>
            <Text className="text-slate-50 text-2xl font-extrabold text-center">Treino Concluído</Text>
            <Text className="text-slate-400 text-sm mt-1 text-center">Seus dados e pontos foram atualizados.</Text>

            <View className="flex-row items-center bg-[#FFD60A]/15 border border-[#FFD60A] px-4 py-2.5 rounded-2xl gap-2 my-5">
              <Zap color="#FFD60A" size={24} />
              <Text className="text-[#FFD60A] text-lg font-extrabold">+{earnedPoints} Bro Points</Text>
            </View>

            <TouchableOpacity
              className="bg-[#30D158] w-full py-3.5 rounded-2xl items-center"
              onPress={() => {
                setFinishModalVisible(false);
                onFinish();
              }}
              activeOpacity={0.8}
            >
              <Text className="text-white font-bold text-sm">CONCLUIR & SALVAR</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};
