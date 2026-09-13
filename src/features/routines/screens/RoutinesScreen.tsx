import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal, TextInput, Alert } from 'react-native';
import { useWorkout } from '../../workout';
import { HeaderBar } from '../../../shared/components/HeaderBar';
import { WorkoutRoutine } from '../../../shared/types';
import { Dumbbell, Plus, Play, X } from 'lucide-react-native';

interface RoutinesScreenProps {
  onStartWorkout: () => void;
}

export const RoutinesScreen: React.FC<RoutinesScreenProps> = ({ onStartWorkout }) => {
  const { routines, startWorkout, addRoutine, addExerciseToRoutine } = useWorkout();
  
  const [createRoutineModalVisible, setCreateRoutineModalVisible] = useState(false);
  const [createExerciseModalVisible, setCreateExerciseModalVisible] = useState(false);

  const [newTitle, setNewTitle] = useState('');
  const [newTarget, setNewTarget] = useState('');

  const [selectedRoutine, setSelectedRoutine] = useState<WorkoutRoutine | null>(null);
  const [exName, setExName] = useState('');
  const [exSets, setExSets] = useState('4');
  const [exReps, setExReps] = useState('10');

  const handleCreateRoutine = async () => {
    if (!newTitle.trim() || !newTarget.trim()) {
      Alert.alert('Campos Obrigatórios', 'Por favor, informe o nome da ficha e o grupo muscular alvo.');
      return;
    }

    const created = await addRoutine(newTitle.trim(), newTarget.trim());
    setNewTitle('');
    setNewTarget('');
    setCreateRoutineModalVisible(false);

    setSelectedRoutine(created);
    setCreateExerciseModalVisible(true);
  };

  const handleAddExercise = async () => {
    if (!selectedRoutine) return;
    if (!exName.trim()) {
      Alert.alert('Campo Obrigatório', 'Informe o nome do exercício.');
      return;
    }

    const setsNum = parseInt(exSets) || 4;
    const repsNum = parseInt(exReps) || 10;

    await addExerciseToRoutine(selectedRoutine.id, exName.trim(), setsNum, repsNum, selectedRoutine.target_muscle);
    
    setExName('');
    setExSets('4');
    setExReps('10');
    setCreateExerciseModalVisible(false);
    setSelectedRoutine(null);
  };

  return (
    <View className="flex-1 bg-[#0A0D14]">
      <HeaderBar />

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <View className="flex-row justify-between items-center px-5 mt-5 mb-4">
          <View>
            <Text className="text-slate-50 text-2xl font-bold tracking-tight">Fichas de Treino</Text>
            <Text className="text-slate-400 text-xs mt-0.5">Rotinas de alta performance</Text>
          </View>
          <TouchableOpacity
            className="bg-[#0A84FF] w-11 h-11 rounded-full justify-center items-center"
            onPress={() => setCreateRoutineModalVisible(true)}
            activeOpacity={0.8}
          >
            <Plus color="#FFFFFF" size={20} />
          </TouchableOpacity>
        </View>

        <View className="px-5 gap-4">
          {routines.map((routine) => (
            <View key={routine.id} className="bg-[#161B26] rounded-2xl p-5 border border-[#262F42]">
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
                  onPress={() => {
                    setSelectedRoutine(routine);
                    setCreateExerciseModalVisible(true);
                  }}
                  activeOpacity={0.8}
                >
                  <Plus color="#0A84FF" size={16} />
                  <Text className="text-[#0A84FF] font-semibold text-xs">Adicionar Exercício</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="flex-1 flex-row items-center justify-center bg-[#0A84FF] py-3 rounded-xl gap-2"
                  onPress={async () => {
                    await startWorkout(routine);
                    onStartWorkout();
                  }}
                  activeOpacity={0.8}
                >
                  <Play color="#FFFFFF" size={14} fill="#FFFFFF" />
                  <Text className="text-white font-bold text-xs">INICIAR FICHA (+50 pts)</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Modal 1: Criar Ficha */}
      <Modal visible={createRoutineModalVisible} transparent animationType="slide">
        <View className="flex-1 bg-[#0A0D14]/88 justify-center items-center p-5">
          <View className="bg-[#161B26] rounded-3xl p-6 w-full max-w-[340px] border border-[#262F42]">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-slate-50 text-lg font-bold">Nova Ficha de Treino</Text>
              <TouchableOpacity onPress={() => setCreateRoutineModalVisible(false)}>
                <X color="#94A3B8" size={20} />
              </TouchableOpacity>
            </View>

            <Text className="text-slate-400 text-xs font-semibold mb-1.5">Nome da Ficha</Text>
            <TextInput
              className="bg-[#0A0D14] text-white rounded-xl px-3.5 py-2.5 mb-3.5 border border-[#262F42]"
              placeholder="Ex: Treino de Braço Monstro"
              placeholderTextColor="#64748B"
              value={newTitle}
              onChangeText={setNewTitle}
            />

            <Text className="text-slate-400 text-xs font-semibold mb-1.5">Grupo Muscular Alvo</Text>
            <TextInput
              className="bg-[#0A0D14] text-white rounded-xl px-3.5 py-2.5 mb-3.5 border border-[#262F42]"
              placeholder="Ex: Bíceps e Tríceps"
              placeholderTextColor="#64748B"
              value={newTarget}
              onChangeText={setNewTarget}
            />

            <TouchableOpacity
              className="bg-[#30D158] py-3.5 rounded-xl items-center mt-2"
              onPress={handleCreateRoutine}
              activeOpacity={0.8}
            >
              <Text className="text-white font-bold text-sm">CRIAR FICHA</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal 2: Adicionar Exercício à Ficha */}
      <Modal visible={createExerciseModalVisible} transparent animationType="slide">
        <View className="flex-1 bg-[#0A0D14]/88 justify-center items-center p-5">
          <View className="bg-[#161B26] rounded-3xl p-6 w-full max-w-[340px] border border-[#262F42]">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-slate-50 text-lg font-bold">Novo Exercício</Text>
              <TouchableOpacity onPress={() => setCreateExerciseModalVisible(false)}>
                <X color="#94A3B8" size={20} />
              </TouchableOpacity>
            </View>

            <Text className="text-[#0A84FF] text-xs font-semibold mb-3.5">Ficha: {selectedRoutine?.title}</Text>

            <Text className="text-slate-400 text-xs font-semibold mb-1.5">Nome do Exercício</Text>
            <TextInput
              className="bg-[#0A0D14] text-white rounded-xl px-3.5 py-2.5 mb-3.5 border border-[#262F42]"
              placeholder="Ex: Rosca Direta com Barra W"
              placeholderTextColor="#64748B"
              value={exName}
              onChangeText={setExName}
            />

            <View className="flex-row gap-3">
              <View className="flex-1">
                <Text className="text-slate-400 text-xs font-semibold mb-1.5">Séries Padrão</Text>
                <TextInput
                  className="bg-[#0A0D14] text-white rounded-xl px-3.5 py-2.5 mb-3.5 border border-[#262F42]"
                  keyboardType="numeric"
                  value={exSets}
                  onChangeText={setExSets}
                />
              </View>

              <View className="flex-1">
                <Text className="text-slate-400 text-xs font-semibold mb-1.5">Reps Padrão</Text>
                <TextInput
                  className="bg-[#0A0D14] text-white rounded-xl px-3.5 py-2.5 mb-3.5 border border-[#262F42]"
                  keyboardType="numeric"
                  value={exReps}
                  onChangeText={setExReps}
                />
              </View>
            </View>

            <TouchableOpacity
              className="bg-[#30D158] py-3.5 rounded-xl items-center mt-2"
              onPress={handleAddExercise}
              activeOpacity={0.8}
            >
              <Text className="text-white font-bold text-sm">SALVAR EXERCÍCIO</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};
