import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Funnel } from 'lucide-react';
import { SearchInput } from '@/components/todo-list/search-input';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { DropdownMenuCheckboxItemProps } from '@radix-ui/react-dropdown-menu';
import TodoItem from './TodoItem';


const TodoListContainer = () => {
  const [showStatusBar, setShowStatusBar] =
    useState<DropdownMenuCheckboxItemProps['checked']>(true);
  const [showActivityBar, setShowActivityBar] =
    useState<DropdownMenuCheckboxItemProps['checked']>(false);
  const [showPanel, setShowPanel] =
    useState<DropdownMenuCheckboxItemProps['checked']>(false);

  return (
    <Card className="w-full gap-0">
      <CardHeader className="gap-4 flex flex-col md:flex-row justify-between mb-6">
        <CardTitle className="text-xl font-semibold mb-4 text-gray-800 dark:text-white text-left">
          Your Tasks
        </CardTitle>
        <div className="flex gap-2">
          <SearchInput placeholder="Search for anything..." />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Funnel />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" side="bottom" align="end">
              <DropdownMenuLabel>Filter By Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={showStatusBar}
                onCheckedChange={setShowStatusBar}
              >
                To Do
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={showActivityBar}
                onCheckedChange={setShowActivityBar}
              >
                In Progress
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={showPanel}
                onCheckedChange={setShowPanel}
              >
                Completed
              </DropdownMenuCheckboxItem>
              <DropdownMenuLabel className="mt-4">
                Filter By Priority
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={showStatusBar}
                onCheckedChange={setShowStatusBar}
              >
                High
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={showActivityBar}
                onCheckedChange={setShowActivityBar}
              >
                Medium
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={showPanel}
                onCheckedChange={setShowPanel}
              >
                Low
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <TodoItem />
      </CardContent>
    </Card>
  );
};

export default TodoListContainer;
