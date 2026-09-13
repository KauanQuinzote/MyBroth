import React from 'react';
import { View, Text } from 'react-native';
import { History } from 'lucide-react-native';

interface NudgeHistoryListProps {
  nudgeHistory: Array<{ id: string; sender_name: string; created_at: string; nudge_text: string }>;
}

export const NudgeHistoryList: React.FC<NudgeHistoryListProps> = ({ nudgeHistory }) => {
  return (
    <View className="px-5 mt-6 mb-3">
      <View className="flex-row items-center gap-2 mb-3">
        <History color="#94A3B8" size={18} />
        <Text className="text-slate-300 font-bold text-base">Histórico de Provocações</Text>
      </View>

      <View className="gap-2.5">
        {nudgeHistory.length === 0 ? (
          <View className="bg-[#161B26] p-4 rounded-2xl border border-[#262F42] items-center">
            <Text className="text-slate-500 text-xs">Nenhuma provocação enviada ainda.</Text>
          </View>
        ) : (
          nudgeHistory.map((item) => (
            <View key={item.id} className="bg-[#161B26] p-4 rounded-2xl border border-[#262F42]">
              <View className="flex-row justify-between items-center mb-1.5">
                <Text className="text-[#0A84FF] text-xs font-bold">{item.sender_name} (Deu a letra)</Text>
                <Text className="text-slate-500 text-[10px]">{item.created_at}</Text>
              </View>
              <Text className="text-slate-200 text-xs italic">"{item.nudge_text}"</Text>
            </View>
          ))
        )}
      </View>
    </View>
  );
};
