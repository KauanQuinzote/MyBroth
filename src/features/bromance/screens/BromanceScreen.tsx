import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { HeaderBar } from '../../../shared/components/HeaderBar';
import { BROMANCE_NUDGES } from '../data/nudges';
import { useBromance } from '../context/BromanceContext';
import { NudgeCategory, BromanceNudgeItem } from '../types';
import { NudgeCategoryTabs } from '../components/NudgeCategoryTabs';
import { NudgeCard } from '../components/NudgeCard';
import { NudgeHistoryList } from '../components/NudgeHistoryList';
import { SoundboardPicker } from '../components/SoundboardPicker';
import { Skull } from 'lucide-react-native';

export const BromanceScreen: React.FC = () => {
  const { sendNudge, nudgeHistory } = useBromance();
  const [selectedCategory, setSelectedCategory] = useState<NudgeCategory>('pesado');
  const [sentSuccessId, setSentSuccessId] = useState<string | null>(null);

  const filteredNudges = BROMANCE_NUDGES.filter((n) => n.category === selectedCategory);

  const handleSendNudge = async (nudge: BromanceNudgeItem) => {
    await sendNudge(nudge.text, nudge.category);
    setSentSuccessId(nudge.id);
    setTimeout(() => setSentSuccessId(null), 2000);
  };

  return (
    <View className="flex-1 bg-[#0A0D14]">
      <HeaderBar />
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <View className="bg-[#161B26] p-5 mx-5 my-3 rounded-3xl border border-[#262F42]">
          <View className="flex-row items-center gap-2 mb-2">
            <Skull color="#FF453A" size={24} />
            <Text className="text-white text-lg font-bold">Trash Talk & Soundboard</Text>
          </View>
          <Text className="text-slate-400 text-xs leading-relaxed">
            Envie provocações instantâneas e efeitos sonoros virais para o seu bro. Escolha um meme abaixo ou digite o link do áudio!
          </Text>
        </View>

        <View className="px-5">
          <SoundboardPicker />
        </View>

        <NudgeCategoryTabs selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />

        <View className="px-5 my-3 gap-3">
          {filteredNudges.map((nudge) => (
            <NudgeCard key={nudge.id} nudge={nudge} isSent={sentSuccessId === nudge.id} onSend={handleSendNudge} />
          ))}
        </View>

        <NudgeHistoryList nudgeHistory={nudgeHistory} />
      </ScrollView>
    </View>
  );
};
