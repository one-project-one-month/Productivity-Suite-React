import { createNote } from '@/api/notes';
import NoteForm, {
  type NoteForm as NoteTypeForm,
} from '@/app/features/notes/components/NoteForm';
import { useMutation } from '@tanstack/react-query';
import { useLocation, useNavigate } from 'react-router';
import { toast } from 'sonner';

const NoteCreate = () => {
  const location = useLocation();

  const navigate = useNavigate();

  const category = location.state;

  console.log(category, 'AAAAA');

  const { mutateAsync } = useMutation({
    mutationFn: async (payload: NoteTypeForm) =>
      await createNote(payload).then((response) => {
        if (response.data.code === 201) {
          toast.success(response.data.message);
          navigate(`/app/notes/${category.id}`, {
            state: category,
          });
        }
      }),
  });

  return <NoteForm category={category} handleSubmit={mutateAsync} />;
};

export default NoteCreate;
