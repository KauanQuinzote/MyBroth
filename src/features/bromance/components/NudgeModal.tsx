import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { useBromance } from '../context/BromanceContext';
import { SpeechService } from '../services/speechService';
import { Flame, X, MessageSquareReply, Volume2, VolumeX } from 'lucide-react-native';

interface NudgeModalProps {
  onReplyPress?: () => void;
}

export const NudgeModal: React.FC<NudgeModalProps> = ({ onReplyPress }) => {
  const { activeIncomingNudge, dismissIncomingNudge } = useBromance();

  useEffect(() => {
    if (activeIncomingNudge) {
      // Fala automaticamente a frase da provocação assim que o modal abre
      SpeechService.speak(activeIncomingNudge.nudge_text);
    } else {
      SpeechService.stop();
    }
  }, [activeIncomingNudge]);

  if (!activeIncomingNudge) return null;

  const handleReplayAudio = () => {
    SpeechService.speak(activeIncomingNudge.nudge_text);
  };

  const handleClose = async () => {
    SpeechService.stop();
    await dismissIncomingNudge();
  };

  return (
    <Modal animationType="slide" transparent visible={Boolean(activeIncomingNudge)}>
      <View className="flex-1 bg-[#0A0D14]/95 justify-center items-center p-6">
        <View className="w-full bg-[#161B26] border border-[#FF453A] rounded-3xl p-6 items-center shadow-2xl">
          {/* Header Warning */}
          <View className="w-14 h-14 rounded-full bg-[#FF453A]/15 justify-center items-center mb-4">
            <Flame color="#FF453A" size={30} />
          </View>

          <Text className="text-[#FF453A] font-extrabold text-xs tracking-widest uppercase mb-1">
            PROVOCAÇÃO RECEBIDA DO BRO!
          </Text>

          <Text className="text-white text-xl font-black text-center my-2">
            {activeIncomingNudge.sender_name} manda avisar:
          </Text>

          {/* Card da Frase */}
          <View className="bg-[#0A0D14] w-full p-5 rounded-2xl border border-[#262F42] my-3">
            <Text className="text-slate-100 font-bold text-base text-center italic leading-relaxed">
              "{activeIncomingNudge.nudge_text}"
            </Text>
          </View>

          {/* Botão de Ouvir de Novo */}
          <TouchableOpacity
            className="flex-row items-center gap-2 bg-[#FFD60A]/15 px-4 py-2.5 rounded-xl border border-[#FFD60A] my-2"
            onPress={handleReplayAudio}
            activeOpacity={0.8}
          >
            <Volume2 color="#FFD60A" size={18} />
            <Text className="text-[#FFD60A] font-bold text-xs uppercase">OUVIR EM ÁUDIO NOVAMENTE</Text>
          </TouchableOpacity>

          {/* Action Buttons */}
          <View className="w-full gap-3 mt-4">
            <TouchableOpacity
              className="bg-[#0A84FF] py-3.5 px-4 rounded-xl flex-row justify-center items-center gap-2"
              onPress={() => {
                handleClose();
                if (onReplyPress) onReplyPress();
              }}
              activeOpacity={0.8}
            >
              <MessageSquareReply color="#FFFFFF" size={18} />
              <Text className="text-white font-bold text-sm uppercase">REVIDAR AGORA</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-[#262F42]/60 py-3 px-4 rounded-xl flex-row justify-center items-center gap-2 border border-[#262F42]"
              onPress={handleClose}
              activeOpacity={0.7}
            >
              <X color="#94A3B8" size={18} />
              <Text className="text-slate-300 font-semibold text-xs uppercase">ENGOLIR & FECHAR</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
