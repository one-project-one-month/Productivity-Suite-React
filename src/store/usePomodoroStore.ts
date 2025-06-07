import { create } from "zustand";
type TimerType = 1| 2| 3;
type Mode = "new" | "existing";
type PomodoroState = {
  timerType : TimerType,
  step : number,
  completedSessions : number, // only work
  mode : Mode,
  description : string,
  type : number, //category
  isRunning : boolean ,
  isPaused : boolean ,
  timerId : number | null,
  sequenceId : number | null,
  workDuration: number,
  shortBreakDuration: number,
  longBreakDuration: number,

  setWorkDuration: (duration : number) => void,
  setShortBreakDuration: (duration : number) => void,
  setLongBreakDuration: (duration : number) => void,
  setTimerId : (timerId : number | null) => void,
  setSequenceId : (sequenceId : number | null) => void,
  setTimerType : (type : TimerType) => void,
  setStep : (step : number) => void,
  setMode : (mode : Mode) => void,
  setDescription : (desc : string) => void,
  setType : (type : number) => void,
  setIsRunning : (running : boolean) => void,
  setIsPaused : (pause : boolean) => void,
  setPomodoroData: (data: Partial<PomodoroState>) => void;
  incrementStep : ()=> void,
  incrementCompletedSessions : () => void,
  handleCompletedSessions : () => void,
}
export const usePomodoroStore = create<PomodoroState>((set,get)=>({
  timerType : 1,
  step : 0,
  completedSessions : 0,
  mode : "new",
  description : '',
  type : 1,
  isRunning : false,
  isPaused : false,
  timerId : null,
  sequenceId : null,
  workDuration: 25 * 60,
  shortBreakDuration: 5 * 60,
  longBreakDuration: 15 * 60,
  setTimerType : (type) => set({timerType : type}),
  setStep : (step : number) => set({step : step}),
  incrementStep : () => set((state)=>({step : state.step < 7 ? state.step +1 : 0})),
  setMode : (mode) => set({mode : mode}),
  setDescription : (desc : string) => set({description : desc}),
  setType : (type : number) => set({type : type}),
  setIsRunning : (running : boolean) => set({isRunning : running}),
  setIsPaused : (pause :boolean) => set({isPaused : pause}),
  setTimerId : (timerId : number | null) => set({timerId : timerId}),
  setSequenceId : (sequenceId : number | null) => set({sequenceId : sequenceId}),
  setWorkDuration: (duration : number) => set({ workDuration : duration}),
  setShortBreakDuration: (duration : number) => set({shortBreakDuration : duration}),
  setLongBreakDuration: (duration : number) => set({longBreakDuration : duration}),
  setPomodoroData: (data) => set((state) => ({ ...state, ...data })),
  incrementCompletedSessions : () => 
    set((state)=> ({
      completedSessions : state.completedSessions +1
    })),
  handleCompletedSessions: () => {
  const { timerType, incrementCompletedSessions, step, setStep, setTimerType, setMode, 
  setIsRunning } = get()

  // Count only completed work sessions
  if (timerType === 1) { 
    incrementCompletedSessions()
  }

  const nextStep = step < 7 ? step + 1 : 0
  setStep(nextStep)

  let nextTimerType: TimerType;
  if (nextStep % 2 === 0) {
    nextTimerType = 1; 
  } else if (nextStep === 7) {
    nextTimerType = 3; 
  } else {
    nextTimerType = 2;
  }
  setTimerType(nextTimerType);

  const nextMode: Mode = nextStep === 0 ? "new" : "existing";
  setMode(nextMode);
  setIsRunning(false);
} 
}))