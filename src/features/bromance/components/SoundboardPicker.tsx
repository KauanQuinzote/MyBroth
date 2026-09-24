import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { MEME_SOUNDBOARD, SoundboardMemeItem } from '../data/soundboardData';
import { useBromance } from '../context/BromanceContext';
import { Volume2, Music, Send, Link as LinkIcon, Search } from 'lucide-react-native';

export const SoundboardPicker: React.FC = () => {
  const { sendNudge } = useBromance();
  const [searchQuery, setSearchQuery] = useState('');
  const [customUrl, setCustomUrl] = useState('');
  const [customText, setCustomText] = useState('');
  const [sendingId, setSendingId] = useState<string | null>(null);

  const filteredMemes = MEME_SOUNDBOARD.filter((meme) => {
    const textToMatch = (meme.name || meme.title || '').toLowerCase();
    return textToMatch.includes(searchQuery.toLowerCase().trim());
  });

  const handleSendMeme = async (item: SoundboardMemeItem) => {
    setSendingId(item.id);
    const textToSend = item.name || item.title || item.nudge_text || 'Áudio Meme!';
    const audioUrlToSend = item.url || item.audio_url || '';
    await sendNudge(textToSend, item.category || 'pesado', audioUrlToSend);
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

  return (
    <View className="bg-[#0A0D14] border border-[#1E293B] rounded-3xl p-5 my-3 shadow-xl">
      <View className="flex-row items-center gap-2.5 mb-4">
        <Music color="#00F0FF" size={22} />
        <View className="flex-1">
          <Text className="text-white font-extrabold text-base uppercase tracking-wider">
            SOUNDBOARD DE MEMES ({MEME_SOUNDBOARD.length})
          </Text>
          <Text className="text-slate-400 text-xs font-medium">
            Toque para enviar o efeito sonoro de meme ao vivo para o seu Bro
          </Text>
        </View>
      </View>

      {/* Busca de Memes */}
      <View className="bg-[#161B26] flex-row items-center gap-2.5 px-3.5 py-2 rounded-xl border border-[#262F42] mb-4">
        <Search color="#94A3B8" size={16} />
        <TextInput
          className="flex-1 text-slate-100 text-xs py-1"
          placeholder="Buscar meme (ex: sirene, chaves, goku, lula...)"
          placeholderTextColor="#64748B"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Grid de Memes */}
      <View className="flex-row flex-wrap justify-between gap-y-2 mb-5">
        {filteredMemes.map((meme) => {
          const isSending = sendingId === meme.id;
          const displayName = meme.name || meme.title || meme.id;
          return (
            <TouchableOpacity
              key={meme.id}
              className={`p-3 rounded-2xl border flex-row items-center gap-2.5 w-[48%] ${
                isSending
                  ? 'bg-[#00F0FF]/20 border-[#00F0FF]'
                  : 'bg-[#161B26] border-[#262F42] active:border-[#00F0FF]/50'
              }`}
              onPress={() => handleSendMeme(meme)}
              disabled={isSending}
              activeOpacity={0.7}
            >
              <View className="w-8 h-8 rounded-lg bg-[#0A0D14] justify-center items-center">
                <Volume2 color="#00F0FF" size={16} />
              </View>
              <View className="flex-1">
                <Text className="text-slate-100 font-bold text-xs" numberOfLines={1}>
                  {displayName}
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
