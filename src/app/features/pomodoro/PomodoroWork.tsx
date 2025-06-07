import { Button } from '@/components/ui/button';
import { Play, Pause, TimerReset, DeleteIcon, Trash, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import Edit from './Edit';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { connectWebSocket, disconnectWebSocket, resettPomodoro, resumePomodoro, startPomodoro, stopPomodoro } from '@/service/WebsocketService';
import { Categories, type ResetPomodoroPayload, type ResumeRequestPayload, type StartExistingPomodoroPayload, type StartPomodoroPayload } from '@/types/pomodoro';
import { usePomodoroStore } from '@/store/usePomodoroStore';

export const categories = ["Work", "Study", "Personal", "Other"];

type PomodoroWorkProps = {
  initialRemainingTime?: number;  // optional number
};
const PomodoroWork = () => {
  const timerType = usePomodoroStore((state) => state.timerType)
  const step = usePomodoroStore((state) => state.step)
  const mode = usePomodoroStore((state) => state.mode)
  const description = usePomodoroStore((state) => state.description)
  const setDescription = usePomodoroStore((state) => state.setDescription)
  const type = usePomodoroStore((state)=>state.type)
  const setType = usePomodoroStore((state)=> state.setType)
  const isRunning = usePomodoroStore((state) => state.isRunning)
  const setIsRunning = usePomodoroStore((state)=> state.setIsRunning)
  const isPaused = usePomodoroStore((state)=> state.isPaused)
  const setIsPaused = usePomodoroStore((state) => state.setIsPaused)
  const timerId = usePomodoroStore((state)=> state.timerId)
  const setTimerId = usePomodoroStore((state) => state.setTimerId)
  const sequenceId = usePomodoroStore((state)=> state.sequenceId)
  const setSequenceId = usePomodoroStore((state) => state.setSequenceId)
  const duration = usePomodoroStore((state)=> state.workDuration)
  const setDuration = usePomodoroStore((state) => state.setWorkDuration)
  const shortDuration = usePomodoroStore((state)=> state.shortBreakDuration)
  const longDuration = usePomodoroStore((state)=> state.longBreakDuration)

  const [remainingTime , setRemainingTime ] = useState(duration)
  const [isTaskSet,setIsTaskSet] = useState<boolean>(true) // start true so Play enabled with empty description
   useEffect(() => {
    const messageHandler = (message : any) => {
      console.log('Message from server:', message);
      if(message.data?.timerId !== undefined){
        setTimerId(message.data?.timerId)
      }
      if(message.data?.sequenceId !== undefined){
        setSequenceId(message.data?.sequenceId)
      }
    };
    console.log('pomodoro mounted')
    connectWebSocket(messageHandler);

    return () => {
      disconnectWebSocket();
    };
  }, []);

  useEffect(() => {
  if (!isRunning && !isPaused) {
    const durations = timerType === 1 ? duration : 
                    timerType === 2 ? shortDuration : 
                    longDuration;
    setRemainingTime(durations);
  }
}, [timerType, duration, shortDuration, longDuration, isRunning, isPaused]);

useEffect(() => {
    setRemainingTime(duration);
  }, [duration]);

  useEffect(() => {
  if (!isRunning) return;

  const interval = setInterval(() => {
    setRemainingTime((prev) => {
      if (prev <= 1) {
        clearInterval(interval);
        usePomodoroStore.getState().handleCompletedSessions();  // Session is done
        setIsRunning(false); // stop timer
        return 0;
      }
      return prev - 1;
    });
  }, 1000);

  return () => clearInterval(interval);
}, [isRunning,isPaused]);

  useEffect(() => {
  // Only reset if the timer is starting fresh (not resuming)
  if (isRunning && !isPaused && remainingTime === duration) {
    setRemainingTime(duration);
  }
}, [duration, isRunning, isPaused]);

  const handleStart = () => {
    setIsRunning(true)
    setIsPaused(false)
    setRemainingTime(duration) // set remainingType = 25
    if(sequenceId){ //existing session
      const payload : StartExistingPomodoroPayload = {
        timerRequest : {
          duration,
          remainingTime : duration,
          timerType ,
        },
        sequenceRequest : {
          mode,
          id : sequenceId,
        },
      }
      startPomodoro(payload)
      console.log(" Existing Data : ",payload)
    }else{ //new session
      const payload : StartPomodoroPayload = {
      timerRequest : {
        duration,
        remainingTime : duration,
        timerType
      },
      sequenceRequest : {
        mode,
        description : mode === 'new' ? description : undefined,
        status : false,
        type ,
      },
      timerSequenceRequest : {
        step,
      }
    }
    startPomodoro(payload)
    console.log("New Data : ",payload)
    }
  }

  const handleStop = () => {
    setIsRunning(false);
    setIsPaused(true)
    stopPomodoro();
    console.log("Stop pomodoro")
  }

  const handleResume = () => {
    setIsRunning(true)
    if (timerId === null || sequenceId === null) {
    console.error("Missing timer or sequence ID");
    return;
  }
    const payload : ResumeRequestPayload ={
      remainingTime : remainingTime,
      timerId ,
      sequenceId
    }
    resumePomodoro(payload)
    console.log("Resume pomodoro : ",payload)
  }

  const handleReset = () => {
    if(timerId !== null){
      setRemainingTime(duration) 
      const payload : ResetPomodoroPayload = {
        timerId ,
      }
      setIsRunning(false)
      setIsPaused(false)
      setIsTaskSet(description.trim() !== '' ? false : true)
      setDescription('');
      resettPomodoro(payload)
      console.log()
    }
  }
  
  const handleTimer = ()=> {
    if(isRunning) {
      handleStop()
    }else if(!isRunning && remainingTime < duration){
      handleResume()
    }else{
      handleStart()
    }
  }

  const handleTaskSet = ()=>{
    setIsTaskSet(true)
    console.log("task : ",description)
  }

  const handleDurationChange = (newDuration : number)=>{
    setDuration(newDuration)
    if (!isRunning && !isPaused) {
    setRemainingTime(newDuration); // update circular text immediately
  }
  }

  const percentage = (remainingTime / duration) * 100;

  const formatTime = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const s = (totalSeconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="w-full m-0 p-0 flex flex-col items-center justify-center bg-white">
      <div className="w-full max-w-md">
        <div className="text-center  mb-8 mt-4">
          <h1 className='text-gray-700 text-lg'>{description}</h1>
          <p className='text-md text-gray-600'>{Categories[type]}</p>
        </div>

        <div className="w-60 h-60 ml-27">
          <CircularProgressbar
            value={percentage}
            text={formatTime(remainingTime)}
            strokeWidth={7}
            styles={buildStyles({
               rotation: 0.5,
              strokeLinecap: 'square',
              textColor: '#333',
              pathColor: '#FF6467',
              trailColor: '#d6d6d6',
            })}
          />
        </div>

        <div className="flex gap-3 items-center justify-center my-8">
          <Button onClick={handleReset} variant="outline">
            <TimerReset />
          </Button>
          <Button
            className="bg-red-500 text-white rounded-md shadow-md hover:bg-red-700"
            onClick={handleTimer}
            disabled={!isTaskSet}
          >
            {isRunning ? <Pause /> : <Play/>
            }
          </Button>
          <Edit timerType={1} onDuration={handleDurationChange}/>
          <Button  variant="outline">
            <Trash2/>
          </Button>
        </div>

        <div className="w-full mb-6">
          <Label htmlFor="task" className="block mb-2 text-left">
            What are you working on?
          </Label>
          <div className="flex gap-2">
            <Input
              id="task"
              type="text"
              value={description}
              onChange={(e) => {
                  const newVal = e.target.value;
                  if (description !== newVal) {
                    setDescription(newVal);
                    setIsTaskSet(false);
                  }
                }}
              disabled= {isRunning || isPaused}
              placeholder="Enter your task..."
              className="flex-1"
            />
            <Button 
              className="bg-red-500 hover:bg-red-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleTaskSet}
              disabled={!description.trim() || isRunning || isPaused}
            >
              Set
            </Button>
          </div>
        </div>

        <div className="w-full mb-6">
          <Label htmlFor="category" className="block mb-2 text-left">
            Task Category
          </Label>
          <Select 
          value={type?.toString() ?? ''}
          onValueChange={(val) => setType(Number(val))}
          disabled={isRunning || isPaused}
            >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {Object.entries(Categories).map(([key,name])=> (
                    <SelectItem key={key} value={key}>
                    {name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
           {
            (isRunning || isPaused) && (
              <p className='text-xs mt-2 ml-2 text-red-500'>
                You can only edit when you reset the timer.
            </p>
            )
          }
        </div>
      </div>
    </div>
  );
};

export default PomodoroWork;