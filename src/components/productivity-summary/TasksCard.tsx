import { Card, CardContent } from "../ui/card";
import { useQuery } from "@tanstack/react-query";

    type TasksCardProps = {
        percentage : number
    }

const TasksCard = ({percentage} : TasksCardProps) => {

  // const { data } = useQuery({
  //   queryKey: ['Tasks'],
  //   queryFn: getSummaryPercentage,
  // });
  


    return (
      <Card className="w-full max-w-sm border-gray-200 border-0 shadow-xl">
        <CardContent>
          <div className="text-sm font-semibold text-black my-1">
            Tasks
          </div>
          <div className="text-2xl font-bold text-blue-950">
            {percentage}%
          </div>
          <div className="text-sm text-gray-500 mt-1">Task Completion Rate</div>
        </CardContent>
      </Card>
    );
}

export default TasksCard