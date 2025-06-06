import { createNote } from '@/api/notes';
import NoteForm, {
  type NoteForm as NoteTypeForm,
} from '@/app/features/notes/components/NoteForm';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation, useNavigate } from 'react-router';
import { toast } from 'sonner';

const NoteCreate = () => {
  const location = useLocation();

  const query = useQueryClient();

  const navigate = useNavigate();

  const category = location.state;

  const { mutateAsync } = useMutation({
    mutationFn: async (payload: NoteTypeForm) =>
      await createNote(payload).then((response) => {
        if (response.status === 200) {
          toast.success(response.data.message);
          navigate(`/app/notes/${category.categoryId}`, {
            state: category,
          });
          query.invalidateQueries({
            queryKey: ['get-all-notes-by-category-id'],
          });
          return response.data;
        }
        throw new Error('Failed to create note');
      }),
  });

  return <NoteForm category={category} handleSubmit={mutateAsync} />;
};

export default NoteCreate;
