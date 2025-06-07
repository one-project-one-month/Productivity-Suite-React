
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { SquarePen } from 'lucide-react';
import { useEffect, useState } from "react";
import { DialogClose, DialogDescription } from "@radix-ui/react-dialog";
import { usePomodoroStore } from "@/store/usePomodoroStore";

type EditProps = {
  timerType: 1 | 2 | 3,
  onDuration : (duration : number) => void
};


const Edit = ({ timerType, onDuration }: EditProps,) => {

  const workDuration = usePomodoroStore((state)=> state.workDuration)
  const shortDuration = usePomodoroStore((state)=> state.shortBreakDuration)
  const setWorkDuration = usePomodoroStore((state) => state.setWorkDuration)
  const setShortDuration = usePomodoroStore((state) => state.setShortBreakDuration)
  const longDuration = usePomodoroStore((state)=> state.longBreakDuration)
  const setLongDuration = usePomodoroStore((state) => state.setLongBreakDuration)

  const handleDurationChange = (e: any) => {
    const value = Number(e.target.value)
    const seconds = value * 60
    if(timerType === 1){
      setWorkDuration(seconds)
    }else if(timerType === 2){
      setShortDuration(seconds)
    }else{
      setLongDuration(seconds)
    }
    
  }

  const handleTimer = () => {
    const selectedDuration = 
    timerType === 1 ? workDuration : timerType === 2 ? shortDuration : longDuration
      onDuration(selectedDuration)
  }

  const getColorClass = () => {
    if (timerType === 1) return "bg-red-600 hover:bg-red-700 selection:bg-red-400";
    if (timerType === 2) return "bg-blue-600 hover:bg-blue-70 selection:bg-blue-400";
    if (timerType === 3) return "bg-green-600 hover:bg-green-700 selection:bg-green-400";
    return "";
  };


  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <SquarePen />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>Edit Timer</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="items-center gap-4">
            <Label htmlFor="name" className="text-right mb-4">
              Duration (minutes)
            </Label>
            <Input
              id="name"
              value={  timerType === 1 ? workDuration / 60 : timerType === 2 ? shortDuration / 60 : longDuration / 60}
              type="number"
              className={`col-span-3 ${
                timerType === 1
                  ? 'selection:bg-red-700'
                  : timerType === 2
                  ? 'selection:bg-blue-700'
                  : 'selection:bg-green-700'
              }`}
              onChange={handleDurationChange}
            />
          </div>
        </div>
        <DialogFooter>
        <DialogClose asChild>

          <Button type="submit" className={getColorClass()} onClick={handleTimer}>
            Set
          </Button>
      </DialogClose>
</DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Edit;
