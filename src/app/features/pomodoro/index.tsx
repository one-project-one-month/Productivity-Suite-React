
import { usePomodoroQuery } from '@/hooks/usePomodoroQuery';
import PomodoroLong from './PomodoroLong';
import PomodoroShort from './PomodoroShort';
import PomodoroWork from './PomodoroWork';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePomodoroStore } from '@/store/usePomodoroStore';
import { useEffect } from 'react';

const Pomodoro = () => {
    const {data} = usePomodoroQuery()
    const setWorkDuration = usePomodoroStore(state => state.setWorkDuration)
    const setShortBreakDuration = usePomodoroStore(state => state.setShortBreakDuration)
    const setLongBreakDuration = usePomodoroStore(state => state.setLongBreakDuration)

     useEffect(() => {
      console.log("Data : ",data)
      if (data) {
        const { timerType, durationSeconds } = data
        if (timerType === 1) setWorkDuration(durationSeconds)
        else if (timerType === 2) setShortBreakDuration(durationSeconds)
        else if (timerType === 3) setLongBreakDuration(durationSeconds)
      }
  }, [data])
  
    return (
    <div className="w-full overflow-x-hidden">
      <Tabs defaultValue="pomodoro" className="w-full">
        <div className="flex justify-center w-full">
          <TabsList className="flex justify-center">
            <TabsTrigger
              value="pomodoro"
              className="text-sm sm:text-md text-gray-600 px-4 sm:px-6 py-3"
            >
              Pomodoro
            </TabsTrigger>
            <TabsTrigger
              value="short"
              className="text-sm sm:text-md text-gray-600 px-4 sm:px-6 py-3"
            >
              Short Break
            </TabsTrigger>
            <TabsTrigger
              value="long"
              className="text-sm sm:text-md text-gray-600 px-4 sm:px-6 py-3"
            >
              Long Break
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="pomodoro">
          <PomodoroWork  />
        </TabsContent>
        <TabsContent value="short">
          <PomodoroShort />
        </TabsContent>
        <TabsContent value="long">
          <PomodoroLong />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Pomodoro;
