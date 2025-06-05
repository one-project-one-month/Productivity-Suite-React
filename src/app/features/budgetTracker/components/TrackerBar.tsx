import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';

interface TrackerBarProps {
  id: number;
  category: string;
  budget: number;
  spent: number;
  handleUpdate: (id: number) => void;
  handleDelete: (id: number) => void;
}

const TrackerBar: React.FC<TrackerBarProps> = ({
  id,
  category,
  budget,
  spent,

  handleDelete,
}) => {
  const remaining = budget - spent;
  const progress = budget > 0 ? (spent / budget) * 100 : 0;

  return (
    <Card className="mb-4 p-0">
      <CardHeader className="py-2 px-4">
        <CardTitle className="text-base font-semibold leading-tight">
          <div className="flex justify-between">
            {category}
            <button
              onClick={() => handleDelete(id)}
              className="px-3 py-1 text-sm text-white rounded "
            >
              ❌
            </button>
          </div>
        </CardTitle>

        <CardDescription className="text-sm mt-1">
          <div className="flex justify-between">
            <span>Budget: {budget.toLocaleString()}</span>
            <span>Used: {(budget - remaining).toLocaleString()} </span>
          </div>

          <div className="relative w-full bg-gray-200 rounded-full h-2 mt-6">
            <div
              className="bg-purple-500 h-2 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
            {progress > 0 && (
              <div
                className="absolute -top-5 text-xs font-medium text-purple-600"
                style={{
                  left: `calc(min(max(${progress}%, 5%), 95%) - 0.75rem)`,
                  transition: 'left 0.3s ease',
                }}
              >
                {progress.toFixed(0)}%
              </div>
            )}
          </div>
        </CardDescription>
      </CardHeader>

      {/* <CardContent>
        <div className="space-y-4">
      

          <div className="flex justify-between items-center">
            <p className="text-green-500">
              {remaining.toLocaleString()} MMK remaining
            </p>
            <p className="text-sm text-gray-600">{progress.toFixed(0)}% used</p>
          </div>
        </div>
      </CardContent> */}
    </Card>
  );
};

export default TrackerBar;
