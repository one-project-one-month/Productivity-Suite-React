import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { EllipsisVertical, CircleAlert, SquarePen, Trash2 } from 'lucide-react';

const TodoItem = () => {
  return (
    <div className="border rounded-lg p-4 transition-all bg-white dark:bg-gray-800">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="text-gray-400 mt-1">
            <CircleAlert />
          </div>
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white">
              Complete project proposal
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
              Finish the draft and send it to the team for review
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge className="bg-[#FEE2E2] text-[#991B1B]">High</Badge>
              <Badge className="bg-[#FEE2E2] text-[#991B1B]">Overdue</Badge>
              <Badge className="bg-[#f3f4f6] text-[#1f293f]">
                Due: May 16, 2023
              </Badge>
            </div>
          </div>
        </div>
        <Button variant={'outline'} className="border-none">
          <Dialog>
            <DropdownMenu>
              <DropdownMenuTrigger className="cursor-pointer">
                <EllipsisVertical />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="min-w-[8rem]"
                side="bottom"
                align="end"
              >
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <DialogTrigger asChild className="text-[#09090B] w-full">
                      <span className="text-[#09090B]">View Details</span>
                    </DialogTrigger>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <SquarePen className="text-[#09090B]" />
                    <span className="text-[#09090B]">Edit</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Trash2 className="text-[#DC2626]" />
                    <span className="text-[#DC2626]">Delete</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Complete Project Proposal</DialogTitle>
                <DialogDescription>Created on May 10, 2023</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Description
                  </h4>
                  <p className="mt-1">
                    Finish the draft and send it to the team for review
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Status
                    </h4>
                    <p className="mt-1 capitalize">todo</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Priority
                    </h4>
                    <p className="mt-1 capitalize">high</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Due Date
                    </h4>
                    <p className="mt-1">May 16, 2023</p>
                  </div>
                </div>
              </div>
              <DialogFooter className="sm:justify-end">
                <DialogClose asChild>
                  <Button
                    size={'lg'}
                    type="button"
                    variant="outline"
                    className="cursor-pointer"
                  >
                    Close
                  </Button>
                </DialogClose>
                <Button size={'lg'} className="cursor-pointer">
                  Mark as Completed
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </Button>
      </div>
    </div>
  );
};

export default TodoItem;
