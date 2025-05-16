

import TodoForm from '@/components/todo-list/TodoForm';
import TodoListContainer from '@/components/todo-list/TodoListContainer';

const TodoList = () => {
  return (
    <div className="overflow-x-hidden">
      <div className="">
        <h1 className=" text-3xl md:text-[50px] font-bold mb-8 text-gray-800 text-center">
          Todo List
        </h1>
        <div className="grid gap-8 md:grid-cols-[300px_1fr] lg:grid-cols-[350px_1fr]">
          <TodoForm />
          <TodoListContainer />
        </div>
      </div>
    </div>
  );
};

export default TodoList;
