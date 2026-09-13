import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Send, Volume2 } from 'lucide-react-native';
import { BromanceNudgeItem } from '../types';
import { SpeechService } from '../services/speechService';

interface NudgeCardProps {
  nudge: BromanceNudgeItem;
  isSent: boolean;
  onSend: (nudge: BromanceNudgeItem) => void;
}

export const NudgeCard: React.FC<NudgeCardProps> = ({ nudge, isSent, onSend }) => {
  return (
    <View className={`p-4 rounded-2xl border flex-row items-center justify-between ${isSent ? 'bg-[#30D158]/20 border-[#30D158]' : 'bg-[#161B26] border-[#262F42]'}`}>
      <Text className="text-slate-100 font-medium text-sm flex-1 pr-2 leading-snug">"{nudge.text}"</Text>
      <View className="flex-row items-center gap-2">
        <TouchableOpacity className="p-2.5 bg-[#262F42] rounded-xl border border-[#3A4763]" onPress={() => SpeechService.speak(nudge.text)} activeOpacity={0.6}>
          <Volume2 color="#FFD60A" size={18} />
        </TouchableOpacity>

        <TouchableOpacity className={`px-3 py-2.5 rounded-xl flex-row items-center gap-1.5 ${isSent ? 'bg-[#30D158]' : 'bg-[#0A84FF]'}`} onPress={() => onSend(nudge)} activeOpacity={0.8}>
          <Send color="#FFFFFF" size={14} />
          <Text className="text-white text-xs font-bold uppercase">{isSent ? 'ENVIADO!' : 'ENVIAR'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
