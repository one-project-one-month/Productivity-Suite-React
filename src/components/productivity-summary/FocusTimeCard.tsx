import { Card, CardContent } from "@/components/ui/card";

type FocusTimeCardProps = {
    hours: number;
    minutes: number;
}

const FocusTimeCard = ({ hours, minutes } : FocusTimeCardProps) => {
    return (
      <Card className="w-full max-w-sm border-0 border-gray-200  shadow-xl">
        <CardContent>
          <div className="text-sm font-semibold text-black my-1">
            Focus Time
          </div>
          <div className="text-2xl font-bold text-blue-900">
            {hours} h {minutes} m
          </div>

          <div className="text-sm text-gray-500 mt-1">Total focused time</div>
        </CardContent>
      </Card>
    );
};

export default FocusTimeCard;
