import './global.css';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { AuthProvider, useAuth, ProfileSelectScreen } from './src/features/auth';
import { WorkoutProvider, useWorkout, ActiveWorkoutScreen } from './src/features/workout';
import { HomeScreen } from './src/features/dashboard';
import { RoutinesScreen } from './src/features/routines';
import { HistoryScreen } from './src/features/history';
import { BromanceProvider, BromanceScreen, NudgeModal } from './src/features/bromance';
import { Home, Dumbbell, Calendar, Award, Flame } from 'lucide-react-native';

type TabType = 'home' | 'workout' | 'routines' | 'bromance' | 'history';

const MainNavigation: React.FC = () => {
  const { activeProfile } = useAuth();
  const { activeSession } = useWorkout();
  const [activeTab, setActiveTab] = useState<TabType>('home');

  if (!activeProfile) {
    return <ProfileSelectScreen />;
  }

  if (activeSession && activeTab === 'workout') {
    return (
      <SafeAreaView className="flex-1 bg-[#0A0D14]">
        <NudgeModal onReplyPress={() => setActiveTab('bromance')} />
        <ActiveWorkoutScreen onFinish={() => setActiveTab('home')} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#0A0D14]">
      <StatusBar barStyle="light-content" backgroundColor="#0A0D14" />
      <NudgeModal onReplyPress={() => setActiveTab('bromance')} />

      {/* Main Content Area */}
      <View className="flex-1">
        {activeTab === 'home' && (
          <HomeScreen
            onNavigateToWorkout={() => setActiveTab('workout')}
            onNavigateToRoutines={() => setActiveTab('routines')}
            onNavigateToHistory={() => setActiveTab('history')}
          />
        )}
        {activeTab === 'workout' && !activeSession && (
          <RoutinesScreen onStartWorkout={() => setActiveTab('workout')} />
        )}
        {activeTab === 'routines' && (
          <RoutinesScreen onStartWorkout={() => setActiveTab('workout')} />
        )}
        {activeTab === 'bromance' && <BromanceScreen />}
        {activeTab === 'history' && <HistoryScreen />}
      </View>

      {/* Bottom Navigation Bar */}
      <View className="flex-row bg-[#161B26] border-t border-[#262F42] py-2.5 px-2 justify-around">
        <TouchableOpacity
          className={`items-center py-1 px-2.5 rounded-xl ${activeTab === 'home' ? 'bg-[#0A0D14]' : ''}`}
          onPress={() => setActiveTab('home')}
          activeOpacity={0.7}
        >
          <Home color={activeTab === 'home' ? '#0A84FF' : '#64748B'} size={18} />
          <Text className={`text-[10px] font-semibold mt-1 ${activeTab === 'home' ? 'text-[#0A84FF] font-bold' : 'text-slate-400'}`}>
            Home
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className={`items-center py-1 px-2.5 rounded-xl ${activeTab === 'workout' ? 'bg-[#0A0D14]' : ''}`}
          onPress={() => setActiveTab('workout')}
          activeOpacity={0.7}
        >
          <View className={activeSession ? 'border-2 border-[#30D158] rounded-xl p-0.5' : ''}>
            <Dumbbell color={activeTab === 'workout' ? '#0A84FF' : '#64748B'} size={18} />
          </View>
          <Text className={`text-[10px] font-semibold mt-1 ${activeTab === 'workout' ? 'text-[#0A84FF] font-bold' : 'text-slate-400'}`}>
            {activeSession ? 'Em Treino' : 'Treinar'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className={`items-center py-1 px-2.5 rounded-xl ${activeTab === 'routines' ? 'bg-[#0A0D14]' : ''}`}
          onPress={() => setActiveTab('routines')}
          activeOpacity={0.7}
        >
          <Calendar color={activeTab === 'routines' ? '#0A84FF' : '#64748B'} size={18} />
          <Text className={`text-[10px] font-semibold mt-1 ${activeTab === 'routines' ? 'text-[#0A84FF] font-bold' : 'text-slate-400'}`}>
            Fichas
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className={`items-center py-1 px-2.5 rounded-xl ${activeTab === 'bromance' ? 'bg-[#0A0D14]' : ''}`}
          onPress={() => setActiveTab('bromance')}
          activeOpacity={0.7}
        >
          <Flame color={activeTab === 'bromance' ? '#FF453A' : '#64748B'} size={18} />
          <Text className={`text-[10px] font-semibold mt-1 ${activeTab === 'bromance' ? 'text-[#FF453A] font-bold' : 'text-slate-400'}`}>
            Bromance
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className={`items-center py-1 px-2.5 rounded-xl ${activeTab === 'history' ? 'bg-[#0A0D14]' : ''}`}
          onPress={() => setActiveTab('history')}
          activeOpacity={0.7}
        >
          <Award color={activeTab === 'history' ? '#0A84FF' : '#64748B'} size={18} />
          <Text className={`text-[10px] font-semibold mt-1 ${activeTab === 'history' ? 'text-[#0A84FF] font-bold' : 'text-slate-400'}`}>
            Conquistas
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <WorkoutProvider>
          <BromanceProvider>
            <MainNavigation />
          </BromanceProvider>
        </WorkoutProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
