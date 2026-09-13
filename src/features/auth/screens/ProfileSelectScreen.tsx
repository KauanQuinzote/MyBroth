import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { BroProfile } from '../../../shared/types';
import { PinLoginModal } from '../components/PinLoginModal';
import { Award, ChevronRight } from 'lucide-react-native';

export const ProfileSelectScreen: React.FC = () => {
  const { profiles, loginWithPin } = useAuth();
  const [selectedProfile, setSelectedProfile] = useState<BroProfile | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleSelect = (profile: BroProfile) => {
    setSelectedProfile(profile);
    setModalVisible(true);
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }} className="bg-[#0A0D14] px-5 pt-20 pb-10">
      <View className="items-center mb-10">
        <Text className="text-4xl font-extrabold text-slate-50 tracking-tight">MyBroth</Text>
        <Text className="text-slate-400 text-base mt-2 text-center">Selecione seu perfil para iniciar</Text>
      </View>

      <View className="space-y-4 gap-4">
        {profiles.map((profile) => (
          <TouchableOpacity
            key={profile.id}
            className="flex-row items-center bg-[#161B26] rounded-2xl p-5 border border-[#262F42] gap-4"
            onPress={() => handleSelect(profile)}
            activeOpacity={0.8}
          >
            <View style={{ backgroundColor: profile.avatar_color || '#0A84FF' }} className="w-14 h-14 rounded-full justify-center items-center">
              <Text className="text-white text-xl font-bold">{profile.initials}</Text>
            </View>

            <View className="flex-1">
              <Text className="text-slate-50 text-lg font-bold tracking-tight">{profile.name}</Text>
              
              <View className="flex-row items-center gap-1.5 mt-1">
                <Award color="#FFD60A" size={14} />
                <Text className="text-[#FFD60A] font-semibold text-xs">{profile.bro_points} Bro Points</Text>
              </View>
            </View>

            <ChevronRight color="#64748B" size={20} />
          </TouchableOpacity>
        ))}
      </View>

      <PinLoginModal
        visible={modalVisible}
        profile={selectedProfile}
        onClose={() => setModalVisible(false)}
        onSuccess={(profileId, pin) => {
          setModalVisible(false);
          loginWithPin(profileId, pin);
        }}
      />
    </ScrollView>
  );
};
