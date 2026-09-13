import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { HeaderBar } from '../../../shared/components/HeaderBar';
import { BROMANCE_NUDGES } from '../data/nudges';
import { useBromance } from '../context/BromanceContext';
import { useAuth } from '../../auth/context/AuthContext';
import { NudgeCategory, BromanceNudgeItem } from '../types';
import { SpeechService } from '../services/speechService';
import { Skull, Send, Award, History, Dumbbell, Sparkles, Volume2 } from 'lucide-react-native';

export const BromanceScreen: React.FC = () => {
  const { partnerProfile } = useAuth();
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
        {/* Banner de Apresentação */}
        <View className="bg-[#161B26] p-5 mx-5 my-3 rounded-3xl border border-[#262F42]">
          <View className="flex-row items-center gap-2 mb-2">
            <Skull color="#FF453A" size={24} />
            <Text className="text-white text-lg font-bold">Trash Talk</Text>
          </View>
          <Text className="text-slate-400 text-xs leading-relaxed">
            Envie provocações instantâneas ao vivo para o seu bro. Escolha a categoria abaixo e toque em um card para disparar o alerta na tela dele!
          </Text>
        </View>

        {/* Abas de Categorias */}
        <View className="flex-row mx-5 my-2 bg-[#161B26] p-1.5 rounded-2xl border border-[#262F42] justify-between">
          <TouchableOpacity
            className={`flex-1 py-2.5 rounded-xl items-center flex-row justify-center gap-1.5 ${selectedCategory === 'pesado' ? 'bg-[#FF453A]' : ''
              }`}
            onPress={() => setSelectedCategory('pesado')}
            activeOpacity={0.8}
          >
            <Skull color={selectedCategory === 'pesado' ? '#FFFFFF' : '#94A3B8'} size={16} />
            <Text className={`text-xs font-bold ${selectedCategory === 'pesado' ? 'text-white' : 'text-slate-400'}`}>
              Pesado
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`flex-1 py-2.5 rounded-xl items-center flex-row justify-center gap-1.5 ${selectedCategory === 'frango' ? 'bg-[#FF9F0A]' : ''
              }`}
            onPress={() => setSelectedCategory('frango')}
            activeOpacity={0.8}
          >
            <Dumbbell color={selectedCategory === 'frango' ? '#FFFFFF' : '#94A3B8'} size={16} />
            <Text className={`text-xs font-bold ${selectedCategory === 'frango' ? 'text-white' : 'text-slate-400'}`}>
              Frango
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`flex-1 py-2.5 rounded-xl items-center flex-row justify-center gap-1.5 ${selectedCategory === 'brother' ? 'bg-[#30D158]' : ''
              }`}
            onPress={() => setSelectedCategory('brother')}
            activeOpacity={0.8}
          >
            <Sparkles color={selectedCategory === 'brother' ? '#FFFFFF' : '#94A3B8'} size={16} />
            <Text className={`text-xs font-bold ${selectedCategory === 'brother' ? 'text-white' : 'text-slate-400'}`}>
              Brother
            </Text>
          </TouchableOpacity>
        </View>

        {/* Lista de Provocações da Categoria */}
        <View className="px-5 my-3 gap-3">
          {filteredNudges.map((nudge) => {
            const isSent = sentSuccessId === nudge.id;
            return (
              <View
                key={nudge.id}
                className={`p-4 rounded-2xl border flex-row items-center justify-between ${isSent
                  ? 'bg-[#30D158]/20 border-[#30D158]'
                  : 'bg-[#161B26] border-[#262F42]'
                  }`}
              >
                <Text className="text-slate-100 font-medium text-sm flex-1 pr-2 leading-snug">
                  "{nudge.text}"
                </Text>
                <View className="flex-row items-center gap-2">
                  <TouchableOpacity
                    className="p-2.5 bg-[#262F42] rounded-xl border border-[#3A4763]"
                    onPress={() => SpeechService.speak(nudge.text)}
                    activeOpacity={0.6}
                  >
                    <Volume2 color="#FFD60A" size={18} />
                  </TouchableOpacity>

                  <TouchableOpacity
                    className={`px-3 py-2.5 rounded-xl flex-row items-center gap-1.5 ${isSent ? 'bg-[#30D158]' : 'bg-[#0A84FF]'}`}
                    onPress={() => handleSendNudge(nudge)}
                    activeOpacity={0.8}
                  >
                    <Send color="#FFFFFF" size={14} />
                    <Text className="text-white text-xs font-bold uppercase">
                      {isSent ? 'ENVIADO!' : 'ENVIAR'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>

        {/* Histórico Recente de Zoeiras */}
        <View className="mx-5 mt-6 mb-3 flex-row items-center gap-2">
          <History color="#94A3B8" size={18} />
          <Text className="text-slate-300 font-bold text-base">Histórico de Provocações</Text>
        </View>

        <View className="px-5 gap-2.5">
          {nudgeHistory.length === 0 ? (
            <View className="bg-[#161B26] p-4 rounded-2xl border border-[#262F42] items-center">
              <Text className="text-slate-500 text-xs">Nenhuma provocação enviada ainda.</Text>
            </View>
          ) : (
            nudgeHistory.map((item) => (
              <View key={item.id} className="bg-[#161B26] p-4 rounded-2xl border border-[#262F42]">
                <View className="flex-row justify-between items-center mb-1.5">
                  <Text className="text-[#0A84FF] text-xs font-bold">
                    {item.sender_name} (Deu a letra)
                  </Text>
                  <Text className="text-slate-500 text-[10px]">{item.created_at}</Text>
                </View>
                <Text className="text-slate-200 text-xs italic">"{item.nudge_text}"</Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
};
