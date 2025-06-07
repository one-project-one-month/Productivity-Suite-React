import { getPomodoroData } from "@/api/pomodoro/api";

type PomodoroData = {
  durationSeconds: number;
  timerType: number;
  id : number;
};

const parseDuration = (durationStr: string): number => {
  const [minutes, seconds] = durationStr.split(':').map(Number);
  return minutes * 60 + seconds;
}

export const fetchPomodoroSession = async (): Promise<PomodoroData> => {
  const rawData = await getPomodoroData();

  const {timerResponse,sequenceResponse} = rawData.data
  if (!timerResponse || !sequenceResponse) {
    throw new Error('Missing timerResponse or sequenceResponse in API response');
  }

  return {
    durationSeconds: parseDuration(timerResponse.duration),
    timerType: timerResponse.type,
    id : sequenceResponse.id
  };
};

