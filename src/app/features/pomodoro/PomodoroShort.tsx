import { Button } from '@/components/ui/button';
import { Play, Pause, TimerReset, Trash2 } from 'lucide-react';
import  { useEffect, useState, useRef } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import Edit from './Edit';
import type { ResetPomodoroPayload, ResumeRequestPayload, StartExistingPomodoroPayload, StartPomodoroPayload } from '@/types/pomodoro';
import { connectWebSocket, disconnectWebSocket, resettPomodoro, resumePomodoro, startPomodoro, stopPomodoro } from '@/service/WebsocketService';
import { usePomodoroStore } from '@/store/usePomodoroStore';
import { toast } from 'sonner';

const PomodoroShort = () => {
  const mode = usePomodoroStore((state) => state.mode)
  const isRunning = usePomodoroStore((state) => state.isRunning)
  const setIsRunning = usePomodoroStore((state)=> state.setIsRunning)
  const setIsPaused = usePomodoroStore((state) => state.setIsPaused)
  const timerId = usePomodoroStore((state)=> state.timerId)
  const setTimerId = usePomodoroStore((state) => state.setTimerId)
  const sequenceId = usePomodoroStore((state)=> state.sequenceId)
  const setSequenceId = usePomodoroStore((state) => state.setSequenceId)
  const duration = usePomodoroStore((state)=> state.shortBreakDuration)
  const setDuration = usePomodoroStore((state) => state.setShortBreakDuration)

  const [remainingTime , setRemainingTime ] = useState(duration)
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setRemainingTime(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            setIsRunning(false)
            setRemainingTime(duration)
            toast.success("Completed Work Session")
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => clearInterval(intervalRef.current!);
  }, [isRunning]);

  useEffect(() => {
    setRemainingTime( duration);
  }, [duration]);

  if (!sequenceId) {
  toast.error("Start a Work session first to initialize the Pomodoro cycle.");
  return;
}

  useEffect(()=> {
    const messageHandler = (message: any) => {
      console.log("Received raw WebSocket message:", message);
      const { sequenceResponse } = message.data ?? {};

      // if (timerResponse?.id !== undefined) {
      //   setTimerId(timerResponse.id);
      // }
      if (sequenceResponse?.id !== undefined && !sequenceId) {
  setSequenceId(sequenceResponse.id);
}
    }
    connectWebSocket(messageHandler)
    return () => {disconnectWebSocket()}
  },[])


  const handleStart = () => {
    setIsRunning(true);
    setRemainingTime(duration);
     const payload : StartExistingPomodoroPayload = {
      timerRequest : {
        duration,
        remainingTime : duration,
        timerType : 2,
      },
      sequenceRequest : {
        mode,
        id : sequenceId,
      },
    }
    startPomodoro(payload)
    console.log("Short Break : " ,payload)
  }

  const handleStop = () => {
    setIsRunning(false)
    setIsPaused(true)
    stopPomodoro()
  }

  const handleResume = () => {
    setIsRunning(true);
    if (timerId === null || sequenceId === null) {
    console.error("Missing timer or sequence ID");
    return;
  }
  const payload : ResumeRequestPayload = {
    remainingTime : remainingTime,
    timerId,
    sequenceId
  }
  resumePomodoro(payload)
  }

  const handleTimer = () => {
    console.log("handleTimer called");
  console.log("timerId:", timerId);
  console.log("sequenceId:", sequenceId);
  console.log("isRunning:", isRunning);
  console.log("remainingTime:", remainingTime);
    if(timerId && sequenceId){
     if(isRunning) {
      handleStop()
      }else if(!isRunning && remainingTime < duration){
        handleResume()
      }else{
        handleStart()
      }
    }
  }

  const percentage = (remainingTime / duration) * 100;

  const formatTime = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60)
      .toString()
      .padStart(2, '0');
    const s = (totalSeconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleDurationChange = (newDuration : number)=>{
    setDuration(newDuration)
    if(!isRunning){
      setRemainingTime(newDuration)
    }
  }

  const handleReset = () => {
    if(timerId !== null){
      setRemainingTime(duration) 
      const payload : ResetPomodoroPayload = {
        timerId : timerId ,
      }
      setIsRunning(false)
      setIsPaused(false)
      resettPomodoro(payload)
      console.log()
    }
  }

  return (
    <div className="w-full px-4 mx-auto my-8 flex flex-col items-center justify-center bg-white">
      <div className="w-full max-w-md">
        <div className="w-60 h-60 mx-auto">
          <CircularProgressbar
            value={percentage}
            text={formatTime(remainingTime)}
            strokeWidth={7}
            styles={buildStyles({
              strokeLinecap: 'square',
              textColor: '#333',
              pathColor: '#50a2ff',
              trailColor: '#d6d6d6',
            })}
          />
        </div>

        <div className="flex gap-3 items-center justify-center my-8">
          <Button onClick={handleReset} variant="outline">
            <TimerReset />
          </Button>
          <Button
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-md shadow-md"
            onClick={handleTimer}
          >
            {isRunning ? <Pause /> : <Play />}
          </Button>
          <Edit timerType = {2} onDuration={handleDurationChange} />
          {/* <Button  variant="outline">
            <Trash2/>
          </Button> */}
        </div>
        <h1 className='text-center text-gray-600'>Take a Short break and relax your mind.</h1>
      </div>
    </div>
  );
};

export default PomodoroShort;