import React from 'react';
import { Modal, View, Text, TouchableOpacity, TextInput } from 'react-native';
import { X } from 'lucide-react-native';

interface CreateRoutineModalProps {
  visible: boolean;
  title: string;
  target: string;
  onChangeTitle: (val: string) => void;
  onChangeTarget: (val: string) => void;
  onClose: () => void;
  onSubmit: () => void;
}

export const CreateRoutineModal: React.FC<CreateRoutineModalProps> = ({
  visible,
  title,
  target,
  onChangeTitle,
  onChangeTarget,
  onClose,
  onSubmit,
}) => {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 bg-[#0A0D14]/88 justify-center items-center p-5">
        <View className="bg-[#161B26] rounded-3xl p-6 w-full max-w-[340px] border border-[#262F42]">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-slate-50 text-lg font-bold">Nova Ficha de Treino</Text>
            <TouchableOpacity onPress={onClose}>
              <X color="#94A3B8" size={20} />
            </TouchableOpacity>
          </View>

          <Text className="text-slate-400 text-xs font-semibold mb-1.5">Nome da Ficha</Text>
          <TextInput
            className="bg-[#0A0D14] text-white rounded-xl px-3.5 py-2.5 mb-3.5 border border-[#262F42]"
            placeholder="Ex: Treino de Braço Monstro"
            placeholderTextColor="#64748B"
            value={title}
            onChangeText={onChangeTitle}
          />

          <Text className="text-slate-400 text-xs font-semibold mb-1.5">Grupo Muscular Alvo</Text>
          <TextInput
            className="bg-[#0A0D14] text-white rounded-xl px-3.5 py-2.5 mb-3.5 border border-[#262F42]"
            placeholder="Ex: Bíceps e Tríceps"
            placeholderTextColor="#64748B"
            value={target}
            onChangeText={onChangeTarget}
          />

          <TouchableOpacity className="bg-[#30D158] py-3.5 rounded-xl items-center mt-2" onPress={onSubmit} activeOpacity={0.8}>
            <Text className="text-white font-bold text-sm">CRIAR FICHA</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
