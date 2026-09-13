import React, { useState } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { useWorkout } from '../../workout';
import { HeaderBar } from '../../../shared/components/HeaderBar';
import { WorkoutRoutine } from '../../../shared/types';
import { RoutinesHeader } from '../components/RoutinesHeader';
import { RoutineCard } from '../components/RoutineCard';
import { CreateRoutineModal } from '../components/CreateRoutineModal';
import { CreateExerciseModal } from '../components/CreateExerciseModal';

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
        <RoutinesHeader onCreatePress={() => setCreateRoutineModalVisible(true)} />
        <View className="px-5 gap-4">
          {routines.map((routine) => (
            <RoutineCard key={routine.id} routine={routine} onAddExercise={() => { setSelectedRoutine(routine); setCreateExerciseModalVisible(true); }} onStartWorkout={async () => { await startWorkout(routine); onStartWorkout(); }} />
          ))}
        </View>
      </ScrollView>

      <CreateRoutineModal visible={createRoutineModalVisible} title={newTitle} target={newTarget} onChangeTitle={setNewTitle} onChangeTarget={setNewTarget} onClose={() => setCreateRoutineModalVisible(false)} onSubmit={handleCreateRoutine} />
      <CreateExerciseModal visible={createExerciseModalVisible} routineTitle={selectedRoutine?.title} exName={exName} exSets={exSets} exReps={exReps} onChangeName={setExName} onChangeSets={setExSets} onChangeReps={setExReps} onClose={() => setCreateExerciseModalVisible(false)} onSubmit={handleAddExercise} />
    </View>
  );
};
