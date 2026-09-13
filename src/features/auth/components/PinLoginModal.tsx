import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { BroProfile } from '../../../shared/types';
import { Delete, X } from 'lucide-react-native';

interface PinLoginModalProps {
  visible: boolean;
  profile: BroProfile | null;
  onClose: () => void;
  onSuccess: (profileId: string, pin: string) => void;
}

export const PinLoginModal: React.FC<PinLoginModalProps> = ({
  visible,
  profile,
  onClose,
  onSuccess,
}) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  if (!profile) return null;

  const handleKeyPress = (num: string) => {
    if (pin.length < 4) {
      const nextPin = pin + num;
      setPin(nextPin);
      setError(false);
      if (nextPin.length === 4) {
        if (nextPin === profile.pin_code) {
          onSuccess(profile.id, nextPin);
          setPin('');
        } else {
          setError(true);
          setPin('');
        }
      }
    }
  };

  const handleDelete = () => {
    setPin((prev) => prev.slice(0, -1));
    setError(false);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 bg-[#0A0D14]/90 justify-end">
        <View className="bg-[#161B26] rounded-t-3xl p-6 items-center border-t border-[#262F42]">
          <TouchableOpacity className="self-end p-1" onPress={onClose}>
            <X color="#94A3B8" size={24} />
          </TouchableOpacity>

          <View style={{ backgroundColor: profile.avatar_color || '#0A84FF' }} className="w-16 h-16 rounded-full justify-center items-center mb-3">
            <Text className="text-white text-2xl font-bold">{profile.initials}</Text>
          </View>

          <Text className="text-slate-50 text-2xl font-bold tracking-tight">{profile.name}</Text>
          <Text className="text-slate-400 text-sm mt-1 mb-5">Digite o PIN de 4 dígitos</Text>

          <View className="flex-row gap-4 mb-4">
            {[0, 1, 2, 3].map((idx) => (
              <View
                key={idx}
                className={`w-4 h-4 rounded-full border-2 border-slate-700 ${
                  pin.length > idx ? 'bg-[#0A84FF] border-[#0A84FF]' : ''
                } ${error ? 'bg-red-500 border-red-500' : ''}`}
              />
            ))}
          </View>

          {error && <Text className="text-red-500 text-xs mb-3 font-semibold">PIN incorreto. Tente novamente.</Text>}

          <View className="flex-row flex-wrap justify-center w-full max-w-[280px] gap-4 mt-2 mb-5">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
              <TouchableOpacity
                key={digit}
                className="w-16 h-16 rounded-full bg-[#262F42] justify-center items-center"
                onPress={() => handleKeyPress(digit)}
                activeOpacity={0.7}
              >
                <Text className="text-slate-50 text-2xl font-semibold">{digit}</Text>
              </TouchableOpacity>
            ))}
            <View className="w-16 h-16" />
            <TouchableOpacity
              className="w-16 h-16 rounded-full bg-[#262F42] justify-center items-center"
              onPress={() => handleKeyPress('0')}
              activeOpacity={0.7}
            >
              <Text className="text-slate-50 text-2xl font-semibold">0</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="w-16 h-16 rounded-full bg-[#1C2333] justify-center items-center"
              onPress={handleDelete}
              activeOpacity={0.7}
            >
              <Delete color="#F8FAFC" size={22} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
