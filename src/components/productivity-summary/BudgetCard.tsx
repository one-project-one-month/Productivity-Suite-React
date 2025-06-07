import { getSummaryPercentage } from "@/api/summary";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";

    type BudgetCardProps = {
        percentage: number;
    };

const BudgetCard = ( {percentage} : BudgetCardProps) => {

  const {data} = useQuery({
    queryKey : ["budget"],
    queryFn : getSummaryPercentage
  })
  console.log(data)

    return (
      <Card className="w-full max-w-sm rounded-lg border-0 shadow-xl border-gray-200 ">
        <CardContent>
          <div className="text-sm font-semibold text-black my-1">Budget</div>
          <div className="text-2xl font-bold text-emerald-900">
            {percentage}%
          </div>
          <div className="text-sm text-gray-500">Of budget spent</div>
        </CardContent>
      </Card>
    );
};

export default BudgetCard;
