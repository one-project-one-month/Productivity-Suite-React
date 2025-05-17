import BudgetCard from '@/components/productivity-summary/BudgetCard';
import BudgetChart from '@/components/productivity-summary/BudgetChart';
import FocusTimeCard from '@/components/productivity-summary/FocusTimeCard';
import FocusTimeChart from '@/components/productivity-summary/FocusTimeChart';
import TasksCard from '@/components/productivity-summary/TasksCard';
import TaskCompletionChart from '@/components/productivity-summary/TasksCompletionChart';

const Summary = () => {
    return (
        <>
        <div className="container max-w-7xl mx-auto px-5 py-8">
            <h2 className="text-2xl font-semibold my-6">Productivity Summary</h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <FocusTimeCard hours={1} minutes={50} />
            <BudgetCard percentage={40} />
            <TasksCard percentage={75} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-10">
            <FocusTimeChart />
            <BudgetChart />
            </div>

            <div className="mt-10">
            <TaskCompletionChart />
            </div>
        </div>
        </>
    );
};

export default Summary;
