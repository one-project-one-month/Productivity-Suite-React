import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router';
import { MoveLeft, Save } from 'lucide-react';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import Editor from '@/app/features/notes/components/Editor.tsx';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

type NoteFormProps = {
  category: NoteCategory;
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

  console.log(form.getValues());

  return (
    <div className="bg-white p-6 rounded-lg shadow-md ">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex justify-between items-center mb-4">
            <div
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => navigate(-1)}
            >
              <MoveLeft />
              <span>Back</span>
            </div>
            <Button variant="default" type="submit">
              <Save />
              Save
            </Button>
          </div>
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="mb-5">
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="title" type="" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="body"
            render={({ field }) => (
              <>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Editor
                    name="body"
                    content={field.value}
                    onChange={(content) => {
                      form.setValue('body', content);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </>
            )}
          />
        </form>
      </Form>
    </div>
  );
};

export default NoteForm;
