import React from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import { Award, Zap } from 'lucide-react-native';

interface WorkoutFinishModalProps {
  visible: boolean;
  earnedPoints: number;
  onConfirm: () => void;
}

export const WorkoutFinishModal: React.FC<WorkoutFinishModalProps> = ({
  visible,
  earnedPoints,
  onConfirm,
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
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

          <TouchableOpacity className="bg-[#30D158] w-full py-3.5 rounded-2xl items-center" onPress={onConfirm} activeOpacity={0.8}>
            <Text className="text-white font-bold text-sm">CONCLUIR & SALVAR</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
