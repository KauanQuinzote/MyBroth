import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { UserPlus, X } from 'lucide-react-native';
import { BroProfile } from '../../../shared/types';

interface CreateProfileModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<BroProfile, 'id' | 'bro_points' | 'streak'>) => Promise<void>;
}

const AVATAR_COLORS = ['#0A84FF', '#30D158', '#FF9F0A', '#BF5AF2', '#FF375F', '#64D2FF'];

export const CreateProfileModal: React.FC<CreateProfileModalProps> = ({
  visible,
  onClose,
  onSubmit,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pin, setPin] = useState('');
  const [color, setColor] = useState(AVATAR_COLORS[0]);
  const [loading, setLoading] = useState(false);

  const getInitials = (str: string) => {
    const parts = str.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return (parts[0]?.[0] || 'B').toUpperCase();
  };

  const handleCreate = async () => {
    if (!name.trim() || pin.length < 4) return;
    setLoading(true);
    try {
      await onSubmit({
        name: name.trim(),
        email: email.trim(),
        pin_code: pin,
        initials: getInitials(name),
        avatar_color: color,
      });
      setName('');
      setEmail('');
      setPin('');
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 bg-black/80 justify-center items-center px-6">
        <View className="w-full bg-[#161B26] border border-[#262F42] rounded-3xl p-6">
          <View className="flex-row justify-between items-center mb-6">
            <View className="flex-row items-center gap-2">
              <UserPlus color="#0A84FF" size={22} />
              <Text className="text-xl font-bold text-white tracking-tight">Criar Perfil de Bro</Text>
            </View>
            <TouchableOpacity onPress={onClose}>
              <X color="#94A3B8" size={22} />
            </TouchableOpacity>
          </View>

          <View className="space-y-4 gap-4">
            <TextInput
              placeholder="Nome Completo"
              placeholderTextColor="#64748B"
              value={name}
              onChangeText={setName}
              className="bg-[#0A0D14] border border-[#262F42] rounded-xl px-4 py-3 text-white text-base"
            />
            <TextInput
              placeholder="E-mail"
              placeholderTextColor="#64748B"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
              className="bg-[#0A0D14] border border-[#262F42] rounded-xl px-4 py-3 text-white text-base"
            />
            <TextInput
              placeholder="PIN de Acesso (4 dígitos)"
              placeholderTextColor="#64748B"
              keyboardType="number-pad"
              secureTextEntry
              maxLength={4}
              value={pin}
              onChangeText={setPin}
              className="bg-[#0A0D14] border border-[#262F42] rounded-xl px-4 py-3 text-white text-base"
            />

            <View className="flex-row justify-between items-center my-2">
              {AVATAR_COLORS.map((c) => (
                <TouchableOpacity
                  key={c}
                  style={{ backgroundColor: c }}
                  className={`w-10 h-10 rounded-full ${color === c ? 'border-2 border-white' : ''}`}
                  onPress={() => setColor(c)}
                />
              ))}
            </View>

            <TouchableOpacity
              disabled={loading || !name.trim() || pin.length < 4}
              onPress={handleCreate}
              className={`py-4 rounded-xl items-center justify-center ${
                !name.trim() || pin.length < 4 ? 'bg-[#1E293B]' : 'bg-[#0A84FF]'
              }`}
            >
              <Text className="text-white font-bold text-base">
                {loading ? 'Criando...' : 'Cadastrar Bro'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
