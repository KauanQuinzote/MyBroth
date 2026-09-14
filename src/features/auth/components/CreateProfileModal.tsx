import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, TextInput, Alert } from 'react-native';
import { X, UserPlus, Check } from 'lucide-react-native';

interface CreateProfileModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (name: string, email: string, pin: string, color: string) => Promise<void>;
}

const AVATAR_COLORS = ['#0A84FF', '#30D158', '#FF9F0A', '#BF5AF2', '#FF453A'];

export const CreateProfileModal: React.FC<CreateProfileModalProps> = ({
  visible,
  onClose,
  onSubmit,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pin, setPin] = useState('');
  const [selectedColor, setSelectedColor] = useState(AVATAR_COLORS[0]);

  const handleCreate = async () => {
    if (!name.trim() || !email.trim() || pin.length !== 4) {
      Alert.alert('Dados Inválidos', 'Por favor preencha o nome, e-mail válido e um PIN de 4 dígitos.');
      return;
    }

    await onSubmit(name, email, pin, selectedColor);
    setName('');
    setEmail('');
    setPin('');
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 bg-[#0A0D14]/90 justify-center items-center p-5">
        <View className="bg-[#161B26] rounded-3xl p-6 w-full max-w-[340px] border border-[#262F42]">
          <View className="flex-row justify-between items-center mb-4">
            <View className="flex-row items-center gap-2">
              <UserPlus color="#0A84FF" size={20} />
              <Text className="text-slate-50 text-lg font-bold">Novo Bro</Text>
            </View>
            <TouchableOpacity onPress={onClose}>
              <X color="#94A3B8" size={20} />
            </TouchableOpacity>
          </View>

          <Text className="text-slate-400 text-xs font-semibold mb-1">Nome Completo</Text>
          <TextInput
            className="bg-[#0A0D14] text-white rounded-xl px-3.5 py-2.5 mb-3 border border-[#262F42]"
            placeholder="Ex: Lucas Silva"
            placeholderTextColor="#64748B"
            value={name}
            onChangeText={setName}
          />

          <Text className="text-slate-400 text-xs font-semibold mb-1">E-mail</Text>
          <TextInput
            className="bg-[#0A0D14] text-white rounded-xl px-3.5 py-2.5 mb-3 border border-[#262F42]"
            placeholder="Ex: lucas@gmail.com"
            placeholderTextColor="#64748B"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <Text className="text-slate-400 text-xs font-semibold mb-1">PIN de Acesso (4 Dígitos)</Text>
          <TextInput
            className="bg-[#0A0D14] text-white rounded-xl px-3.5 py-2.5 mb-3.5 border border-[#262F42] text-center font-bold tracking-widest"
            placeholder="Ex: 1234"
            placeholderTextColor="#64748B"
            keyboardType="numeric"
            maxLength={4}
            secureTextEntry
            value={pin}
            onChangeText={setPin}
          />

          <Text className="text-slate-400 text-xs font-semibold mb-2">Cor do Avatar</Text>
          <View className="flex-row justify-between mb-5">
            {AVATAR_COLORS.map((c) => (
              <TouchableOpacity
                key={c}
                style={{ backgroundColor: c }}
                className="w-10 h-10 rounded-full justify-center items-center"
                onPress={() => setSelectedColor(c)}
                activeOpacity={0.8}
              >
                {selectedColor === c && <Check color="#FFFFFF" size={18} />}
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity className="bg-[#30D158] py-3.5 rounded-xl items-center" onPress={handleCreate} activeOpacity={0.8}>
            <Text className="text-white font-bold text-sm">CRIAR MEU PERFIL</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
