import { Button } from '@/components/ui/button';
import { Play, Pause, TimerReset } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
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

export const categories = ["Work", "Study", "Personal", "Other"];

const PomodoroWork = () => {
  const totalTime = 25 * 60; // 25 minutes
  const [secondsLeft, setSecondsLeft] = useState(totalTime);
  const [isRunning, setIsRunning] = useState(false);
  const [task, setTask] = useState("");
  const [category, setCategory] = useState("");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const toggleTimer = () => {
    setIsRunning(prev => !prev);
  };

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  const percentage = (secondsLeft / totalTime) * 100;

  const formatTime = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const s = (totalSeconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const toggleReset = () => {
    setSecondsLeft(totalTime);
    setIsRunning(false);
  };

  return (
    <div className="w-full m-0 p-0 flex flex-col items-center justify-center bg-white">
      <div className="w-full max-w-md">
        <div className="text-center  mb-8 mt-3">
          <h1 className='text-gray-700'>Your Task</h1>
          <p className='text-sm text-gray-600'>Work</p>
        </div>

        
        <div className="w-60 h-60 ml-27">
          <CircularProgressbar
            value={percentage}
            text={formatTime(secondsLeft)}
            strokeWidth={7}
            styles={buildStyles({
              strokeLinecap: 'square',
              textColor: '#333',
              pathColor: '#FF6467',
              trailColor: '#d6d6d6',
            })}
          />
        </div>

        <div className="flex gap-3 items-center justify-center my-8">
          <Button onClick={toggleReset} variant="outline">
            <TimerReset />
          </Button>
          <Button
            className="bg-red-500 text-white rounded-md shadow-md hover:bg-red-700"
            onClick={toggleTimer}
          >
            {isRunning ? <Pause /> : <Play />}
          </Button>
          <Edit timerType='work'/>
        </div>

        <div className="w-full mb-6">
          <Label htmlFor="task" className="block mb-2 text-left">
            What are you working on?
          </Label>
          <div className="flex gap-2">
            <Input
              id="task"
              type="text"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              placeholder="Enter your task..."
              className="flex-1"
            />
            <Button 
              className="bg-red-500 hover:bg-red-700 text-white"
              onClick={() => console.log("Task set:", task)}
            >
              Set
            </Button>
          </div>
        </div>

        <div className="w-full mb-6">
          <Label htmlFor="category" className="block mb-2 text-left">
            Task Category
          </Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default PomodoroWork;