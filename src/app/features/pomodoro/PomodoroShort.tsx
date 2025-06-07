import { Button } from '@/components/ui/button';
import { Play, Pause, TimerReset } from 'lucide-react';
import  { useEffect, useState, useRef } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import Edit from './Edit';

const PomodoroShort = () => {
  const totalTime = 5 * 60; // 5 minutes
  const [secondsLeft, setSecondsLeft] = useState(totalTime);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const toggleTimer = () => {
    setIsRunning(prev => !prev);
  };

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft(prev => {
          console.log(secondsLeft)
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
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

  const percentage = (secondsLeft / totalTime) * 100;

  const formatTime = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60)
      .toString()
      .padStart(2, '0');
    const s = (totalSeconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const toggleReset = () => {
    setSecondsLeft(totalTime)
    setIsRunning(false)
  }

  return (
    <div className="w-full px-4 mx-auto my-8 flex flex-col items-center justify-center bg-white">
      <div className="w-full max-w-md">
        <div className="w-60 h-60 mx-auto">
          <CircularProgressbar
            value={percentage}
            text={formatTime(secondsLeft)}
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
          <Button onClick={toggleReset} variant="outline">
            <TimerReset />
          </Button>
          <Button
            className="bg-blue-500 text-white rounded-md shadow-md"
            onClick={toggleTimer}
          >
            {isRunning ? <Pause /> : <Play />}
          </Button>
          <Edit timerType='short'/>
        </div>
        <h1 className='text-center text-gray-600'>Take a Short break and relax your mind.</h1>
      </div>
    </div>
  );
};

export default PomodoroShort;