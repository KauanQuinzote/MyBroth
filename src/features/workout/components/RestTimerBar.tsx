import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { useWorkout } from '../context/WorkoutContext';
import { Plus, RotateCcw, Timer } from 'lucide-react-native';

export const RestTimerBar: React.FC = () => {
  const { restTimerSeconds, isTimerRunning, startRestTimer } = useWorkout();
  const [initialDuration, setInitialDuration] = useState(60);

  useEffect(() => {
    if (restTimerSeconds > initialDuration) {
      setInitialDuration(restTimerSeconds);
    }
  }, [restTimerSeconds, initialDuration]);

  if (!isTimerRunning && restTimerSeconds === 0) return null;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Cálculo das dimensões do anel circular SVG
  const radius = 26;
  const strokeWidth = 4;
  const circumference = 2 * Math.PI * radius; // ~163.36
  const maxSecs = Math.max(initialDuration, restTimerSeconds, 1);
  const progress = Math.min(1, Math.max(0, restTimerSeconds / maxSecs));
  const strokeDashoffset = circumference * (1 - progress);

  // Paleta de Cores Dinâmicas por Estágio
  const getStageColors = () => {
    if (restTimerSeconds > 30) {
      return { start: '#30D158', stop: '#0A84FF', text: 'text-[#30D158]' }; // Verde Apple
    }
    if (restTimerSeconds >= 10) {
      return { start: '#FF9F0A', stop: '#FFD60A', text: 'text-[#FF9F0A]' }; // Laranja
    }
    return { start: '#FF453A', stop: '#FF9F0A', text: 'text-[#FF453A]' }; // Vermelho Alerta
  };

  const colors = getStageColors();

  return (
    <View className="flex-row items-center justify-between bg-[#161B26] p-4 rounded-3xl mx-5 my-3 border border-[#262F42]">
      {/* Esquerda: Anel Circular SVG com Contador de Tempo */}
      <View className="flex-row items-center gap-3">
        <View className="relative w-16 h-16 justify-center items-center">
          <Svg width={64} height={64} style={{ transform: [{ rotate: '-90deg' }] }}>
            <Defs>
              <LinearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor={colors.start} />
                <Stop offset="100%" stopColor={colors.stop} />
              </LinearGradient>
            </Defs>

            {/* Trilha de Fundo do Anel */}
            <Circle
              cx={32}
              cy={32}
              r={radius}
              stroke="#262F42"
              strokeWidth={strokeWidth}
              fill="transparent"
            />

            {/* Arco de Progresso em Gradiente */}
            <Circle
              cx={32}
              cy={32}
              r={radius}
              stroke="url(#timerGradient)"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
            />
          </Svg>

          {/* Ícone no Centro do Anel */}
          <View className="absolute inset-0 justify-center items-center">
            <Timer color={colors.start} size={18} />
          </View>
        </View>

        <View>
          <Text className="text-slate-400 text-xs font-semibold">Descanso Ativo</Text>
          <Text
            style={{ fontVariant: ['tabular-nums'] }}
            className={`text-2xl font-extrabold tracking-tight ${colors.text}`}
          >
            {formatTime(restTimerSeconds)}
          </Text>
        </View>
      </View>

      {/* Direita: Botões de Ação de Tempo */}
      <View className="flex-row items-center gap-2">
        <TouchableOpacity
          className="flex-row items-center bg-[#262F42] px-3 py-2 rounded-xl gap-1"
          onPress={() => {
            const nextTime = restTimerSeconds + 30;
            setInitialDuration(Math.max(initialDuration, nextTime));
            startRestTimer(nextTime);
          }}
          activeOpacity={0.7}
        >
          <Plus color="#F8FAFC" size={14} />
          <Text className="text-white text-xs font-bold">+30s</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-[#262F42] p-2.5 rounded-xl"
          onPress={() => {
            setInitialDuration(60);
            startRestTimer(60);
          }}
          activeOpacity={0.7}
        >
          <RotateCcw color="#94A3B8" size={16} />
        </TouchableOpacity>
      </View>
    </View>
  );
};
