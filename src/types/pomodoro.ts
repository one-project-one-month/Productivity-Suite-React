export const Categories: Record<number, string> = {
  1: "Work",
  2: "Study",
  3: "Personal",
  4: "Other",
};

export type Category = keyof typeof Categories

type MinimalSequence = Pick<Sequence, 'mode' | 'id'>;


export type Timer ={
  id? :  number,
  duration : number,
  remainingTime : number,
  timerType : number // work,short,long
}

export type Sequence = {
  id? :  number | null,
  mode : 'new' | 'existing'
  description : string | undefined,
  status : boolean,
  type : number, //category(work ,study,personal and other)
}

export type TimerSequence = {
  step: number; // 0 to 7
};

export type StartPomodoroPayload = {
  timerRequest: Timer;
  sequenceRequest: Sequence;
  timerSequenceRequest: TimerSequence;
};

export type ResumeRequestPayload = {
  remainingTime: number;
  timerId: number;
  sequenceId: number;
};

export type ResetPomodoroPayload = {
  timerId: number;
}

export type StartExistingPomodoroPayload = {
  timerRequest : Timer,
  sequenceRequest : MinimalSequence
} 