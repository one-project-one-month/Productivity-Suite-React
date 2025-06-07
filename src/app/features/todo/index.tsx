import TodoForm from '@/components/todo-list/TodoForm';
import TodoListContainer from '@/components/todo-list/TodoListContainer';
import { connectWebSocket, disconnectWebSocket } from '@/service/WebsocketService';
import { useEffect } from 'react';

const TodoList = () => {

  return (
    <div className="overflow-x-hidden">
      <div className="">
        <div className="grid gap-8 md:grid-cols-[300px_1fr] lg:grid-cols-[350px_1fr]">
          <TodoForm />
          <TodoListContainer />
        </div>
      </div>
    </div>
  );
};

export default TodoList;
