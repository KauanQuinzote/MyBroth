import React from 'react';
import { Modal, View, Text, TouchableOpacity, TextInput } from 'react-native';
import { X } from 'lucide-react-native';

interface CreateExerciseModalProps {
  visible: boolean;
  routineTitle?: string;
  exName: string;
  exSets: string;
  exReps: string;
  onChangeName: (val: string) => void;
  onChangeSets: (val: string) => void;
  onChangeReps: (val: string) => void;
  onClose: () => void;
  onSubmit: () => void;
}

export const CreateExerciseModal: React.FC<CreateExerciseModalProps> = ({
  visible,
  routineTitle,
  exName,
  exSets,
  exReps,
  onChangeName,
  onChangeSets,
  onChangeReps,
  onClose,
  onSubmit,
}) => {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 bg-[#0A0D14]/88 justify-center items-center p-5">
        <View className="bg-[#161B26] rounded-3xl p-6 w-full max-w-[340px] border border-[#262F42]">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-slate-50 text-lg font-bold">Novo Exercício</Text>
            <TouchableOpacity onPress={onClose}>
              <X color="#94A3B8" size={20} />
            </TouchableOpacity>
          </View>

          <Text className="text-[#0A84FF] text-xs font-semibold mb-3.5">Ficha: {routineTitle}</Text>

          <Text className="text-slate-400 text-xs font-semibold mb-1.5">Nome do Exercício</Text>
          <TextInput
            className="bg-[#0A0D14] text-white rounded-xl px-3.5 py-2.5 mb-3.5 border border-[#262F42]"
            placeholder="Ex: Rosca Direta com Barra W"
            placeholderTextColor="#64748B"
            value={exName}
            onChangeText={onChangeName}
          />

          <View className="flex-row gap-3">
            <View className="flex-1">
              <Text className="text-slate-400 text-xs font-semibold mb-1.5">Séries Padrão</Text>
              <TextInput className="bg-[#0A0D14] text-white rounded-xl px-3.5 py-2.5 mb-3.5 border border-[#262F42]" keyboardType="numeric" value={exSets} onChangeText={onChangeSets} />
            </View>

            <View className="flex-1">
              <Text className="text-slate-400 text-xs font-semibold mb-1.5">Reps Padrão</Text>
              <TextInput className="bg-[#0A0D14] text-white rounded-xl px-3.5 py-2.5 mb-3.5 border border-[#262F42]" keyboardType="numeric" value={exReps} onChangeText={onChangeReps} />
            </View>
          </View>

          <TouchableOpacity className="bg-[#30D158] py-3.5 rounded-xl items-center mt-2" onPress={onSubmit} activeOpacity={0.8}>
            <Text className="text-white font-bold text-sm">SALVAR EXERCÍCIO</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
