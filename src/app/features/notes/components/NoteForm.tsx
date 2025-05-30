import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router';
import { Check, ChevronsUpDown, MoveLeft } from 'lucide-react';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

import { Button } from '@/components/ui/button';

import { cn } from '@/lib/utils';

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import Editor from "@/app/features/notes/components/Editor.tsx";

type NoteFormProps = {
  category: Category;
  initialData?: NoteForm;
  handleSubmit: (payload: NoteForm) => void;
};

const formSchema = z.object({
  title: z.string().nonempty('Title is Required'),
  body: z.string().nonempty('Body is Required'),
  color: z.string().optional(),
  categoryId: z.number(),
});

export type NoteForm = z.infer<typeof formSchema>;

const languages = [
  {
    label: 'English',
    value: 1,
  },
  {
    label: 'French',
    value: 2,
  },
  {
    label: 'German',
    value: 3,
  },
  {
    label: 'Spanish',
    value: 4,
  },
  {
    label: 'Portuguese',
    value: 5,
  },
  {
    label: 'Russian',
    value: 6,
  },
  {
    label: 'Japanese',
    value: 7,
  },
  {
    label: 'Korean',
    value: 8,
  },
  {
    label: 'Chinese',
    value: 9,
  },
] as const;

const NoteForm = ({ category, initialData, handleSubmit }: NoteFormProps) => {
  const navigate = useNavigate();

  const form = useForm<NoteForm>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ?? {
      title: '',
      body: '',
      color: '#000000',
      categoryId: category.categoryId,
    },
  });

  const onSubmit = async (data: NoteForm) => {
    handleSubmit(data);
  };
  return (
    <div className="bg-white p-6 rounded-lg shadow-md ">
      <div
        className="flex items-center space-x-2 cursor-pointer"
        onClick={() => navigate(-1)}
      >
        <MoveLeft />
        <span>Back</span>
      </div>
      <Editor content={""} onChange={(content)=> {

        console.log(content)
      }}/>
      {/* <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Language</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          'w-[200px] justify-between',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value
                          ? languages.find(
                              (language) => language.value === field.value
                            )?.label
                          : 'Select language'}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <Command>
                      <CommandInput placeholder="Search language..." />
                      <CommandList>
                        <CommandEmpty>No language found.</CommandEmpty>
                        <CommandGroup>
                          {languages.map((language) => (
                            <CommandItem
                              value={language.label}
                              key={language.value}
                              onSelect={() => {
                                form.setValue('categoryId', language.value);
                              }}
                            >
                              <Check
                                className={cn(
                                  'mr-2 h-4 w-4',
                                  language.value === field.value
                                    ? 'opacity-100'
                                    : 'opacity-0'
                                )}
                              />
                              {language.label}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form> */}
    </div>
  );
};

export default NoteForm;
