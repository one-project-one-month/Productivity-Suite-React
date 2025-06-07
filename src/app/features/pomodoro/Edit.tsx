
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

type EditProps = {
  timerType: "work" | "short" | "long";
};

const Edit = ({ timerType }: EditProps) => {
  const getColorClass = () => {
    if (timerType === "work") return "bg-red-600 hover:bg-red-700 selection:bg-red-400";
    if (timerType === "short") return "bg-blue-600 hover:bg-blue-70 selection:bg-blue-400";
    if (timerType === "long") return "bg-green-600 hover:bg-green-700 selection:bg-green-400";
    return "";
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <SquarePen />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
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
              value="11"
              type="number"
              className={`col-span-3 ${
                timerType === 'work'
                  ? 'selection:bg-red-700'
                  : timerType === 'short'
                  ? 'selection:bg-blue-700'
                  : 'selection:bg-green-700'
              }`}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" className={getColorClass()}>
            Set
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Edit;
