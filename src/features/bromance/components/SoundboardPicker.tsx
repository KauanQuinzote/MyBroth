import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { MEME_SOUNDBOARD, SoundboardMemeItem } from '../data/soundboardData';
import { useBromance } from '../context/BromanceContext';
import { Volume2, Music, Send, Link as LinkIcon, Siren, Flame, Frown } from 'lucide-react-native';

export const SoundboardPicker: React.FC = () => {
  const { sendNudge } = useBromance();
  const [customUrl, setCustomUrl] = useState('');
  const [customText, setCustomText] = useState('');
  const [sendingId, setSendingId] = useState<string | null>(null);

  const handleSendMeme = async (item: SoundboardMemeItem) => {
    setSendingId(item.id);
    await sendNudge(item.nudge_text, item.category, item.audio_url);
    setSendingId(null);
  };

  const handleSendCustomUrl = async () => {
    if (!customUrl.trim()) return;
    const textToSend = customText.trim() || 'Provocação em Áudio Customizada!';
    setSendingId('custom');
    await sendNudge(textToSend, 'pesado', customUrl.trim());
    setCustomUrl('');
    setCustomText('');
    setSendingId(null);
  };

  const renderIcon = (name?: string) => {
    switch (name) {
      case 'Siren':
        return <Siren color="#FF453A" size={20} />;
      case 'Flame':
        return <Flame color="#FF9500" size={20} />;
      case 'Frown':
        return <Frown color="#FFD60A" size={20} />;
      default:
        return <Volume2 color="#00F0FF" size={20} />;
    }
  };

  return (
    <View className="bg-[#0A0D14] border border-[#1E293B] rounded-3xl p-5 my-3 shadow-xl">
      <View className="flex-row items-center gap-2.5 mb-4">
        <Music color="#00F0FF" size={22} />
        <View>
          <Text className="text-white font-extrabold text-base uppercase tracking-wider">
            SOUNDBOARD DE MEMES
          </Text>
          <Text className="text-slate-400 text-xs font-medium">
            Envie efeitos sonoros em áudio para o seu Bro
          </Text>
        </View>
      </View>

      {/* Grid de Memes Pré-definidos */}
      <View className="flex-row flex-wrap gap-2.5 mb-5">
        {MEME_SOUNDBOARD.map((meme) => {
          const isSending = sendingId === meme.id;
          return (
            <TouchableOpacity
              key={meme.id}
              className={`flex-1 min-w-[130px] p-3.5 rounded-2xl border flex-row items-center gap-3 ${
                isSending
                  ? 'bg-[#00F0FF]/20 border-[#00F0FF]'
                  : 'bg-[#161B26] border-[#262F42] active:border-[#00F0FF]/50'
              }`}
              onPress={() => handleSendMeme(meme)}
              disabled={isSending}
              activeOpacity={0.7}
            >
              <View className="w-9 h-9 rounded-xl bg-[#0A0D14] justify-center items-center">
                {renderIcon(meme.icon_name)}
              </View>
              <View className="flex-1">
                <Text className="text-slate-100 font-bold text-xs numberOfLines={1}">
                  {meme.title}
                </Text>
                <Text className="text-slate-500 text-[10px] uppercase font-semibold">
                  {meme.category}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Envio de URL Customizada (ex: MyInstants) */}
      <View className="bg-[#161B26] p-4 rounded-2xl border border-[#262F42] gap-3">
        <View className="flex-row items-center gap-2">
          <LinkIcon color="#FFD60A" size={16} />
          <Text className="text-slate-200 text-xs font-bold uppercase">
            LINK CUSTOMIZADO (MYINSTANTS / MP3)
          </Text>
        </View>

        <TextInput
          className="bg-[#0A0D14] border border-[#262F42] rounded-xl px-3.5 py-2.5 text-slate-100 text-xs"
          placeholder="Cole a URL do áudio MP3 (ex: myinstants.com/...)"
          placeholderTextColor="#64748B"
          value={customUrl}
          onChangeText={setCustomUrl}
          autoCapitalize="none"
          autoCorrect={false}
        />

        <TextInput
          className="bg-[#0A0D14] border border-[#262F42] rounded-xl px-3.5 py-2.5 text-slate-100 text-xs"
          placeholder="Frase do alerta (Opcional)"
          placeholderTextColor="#64748B"
          value={customText}
          onChangeText={setCustomText}
        />

        <TouchableOpacity
          className={`py-3 px-4 rounded-xl flex-row justify-center items-center gap-2 ${
            customUrl.trim() ? 'bg-[#00F0FF]' : 'bg-[#262F42]'
          }`}
          onPress={handleSendCustomUrl}
          disabled={!customUrl.trim() || sendingId === 'custom'}
          activeOpacity={0.8}
        >
          <Send color={customUrl.trim() ? '#0A0D14' : '#64748B'} size={16} />
          <Text
            className={`font-bold text-xs uppercase ${
              customUrl.trim() ? 'text-slate-950' : 'text-slate-500'
            }`}
          >
            DISPARAR ÁUDIO MEME
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
