import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { BroProfile } from '../../../shared/types';
import { PinLoginModal } from '../components/PinLoginModal';
import { CreateProfileModal } from '../components/CreateProfileModal';
import { Award, ChevronRight, UserPlus } from 'lucide-react-native';

export const ProfileSelectScreen: React.FC = () => {
  const { profiles, loginWithPin, registerProfile } = useAuth();
  const [selectedProfile, setSelectedProfile] = useState<BroProfile | null>(null);
  const [pinModalVisible, setPinModalVisible] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }} className="bg-[#0A0D14] px-5 pt-16 pb-10">
      <View className="items-center mb-8">
        <Text className="text-4xl font-extrabold text-slate-50 tracking-tight">MyBroth</Text>
        <Text className="text-slate-400 text-base mt-1 text-center">Selecione seu perfil para iniciar</Text>
      </View>

      <View className="space-y-3 gap-3 mb-6">
        {profiles.map((profile) => (
          <TouchableOpacity
            key={profile.id}
            className="p-4 flex-row items-center bg-[#161B26] rounded-2xl p-4.5 border border-[#262F42] gap-4"
            onPress={() => { setSelectedProfile(profile); setPinModalVisible(true); }}
            activeOpacity={0.8}
          >
            <View style={{ backgroundColor: profile.avatar_color || '#0A84FF' }} className="w-12 h-12 rounded-full justify-center items-center">
              <Text className="text-white text-lg font-bold">{profile.initials}</Text>
            </View>

            <View className="flex-1">
              <Text className="text-slate-50 text-base font-bold tracking-tight">{profile.name}</Text>
              <View className="flex-row items-center gap-1.5 mt-0.5">
                <Award color="#FFD60A" size={13} />
                <Text className="text-[#FFD60A] font-semibold text-xs">{profile.bro_points} Bro Points</Text>
              </View>
            </View>

            <ChevronRight color="#64748B" size={18} />
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        className="flex-row items-center justify-center bg-[#0A84FF]/15 border border-[#0A84FF]/40 p-4 rounded-2xl gap-2"
        onPress={() => setCreateModalVisible(true)}
        activeOpacity={0.8}
      >
        <UserPlus color="#0A84FF" size={20} />
        <Text className="text-[#0A84FF] font-bold text-sm">CRIAR NOVO PERFIL DE BRO</Text>
      </TouchableOpacity>

      <PinLoginModal
        visible={pinModalVisible}
        profile={selectedProfile}
        onClose={() => setPinModalVisible(false)}
        onSuccess={(profileId, pin) => { setPinModalVisible(false); loginWithPin(profileId, pin); }}
      />

      <CreateProfileModal
        visible={createModalVisible}
        onClose={() => setCreateModalVisible(false)}
        onSubmit={async (name, email, pin, color) => {
          await registerProfile(name, email, pin, color);
        }}
      />
    </ScrollView>
  );
};
