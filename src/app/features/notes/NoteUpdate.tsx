import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useLocation, useNavigate, useParams } from 'react-router';
import NoteForm, {
  type NoteForm as NoteTypeForm,
} from '@/app/features/notes/components/NoteForm';
import { getNotesById, updateNote } from '@/api/notes';
import { toast } from 'sonner';
import { LoaderCircle } from 'lucide-react';

const NoteUpdate = () => {
  const location = useLocation();

  const { noteId } = useParams();

  const query = useQueryClient();

  const navigate = useNavigate();

  const dataState = location.state;

  const { data, isLoading } = useQuery<NoteShow>({
    queryKey: ['get-notes-id', noteId],
    queryFn: async (): Promise<NoteShow> =>
      await getNotesById(noteId!).then((response) => {
        if (response.data.code === 200) {
          return response.data.data;
        }
        throw new Error('Fail to fetch note show');
      }),
  });

  console.log(data, 'DDDDAAAs');

  console.log(noteId);

  const { mutateAsync } = useMutation({
    mutationFn: async (payload: NoteTypeForm) =>
      await updateNote(noteId!, payload).then((response) => {
        if (response.status === 200) {
          toast.success(response.data.message);
          navigate(`/app/notes/${dataState.category.categoryId}`, {
            state: dataState.category,
          });
          query.invalidateQueries({
            queryKey: ['get-all-notes-by-category-id'],
          });
          return response.data;
        }
        throw new Error('Failed to create note');
      }),
  });

  // console.log(category, 'DATA');

  return (
    <>
      {data && !isLoading ? (
        <NoteForm
          initialData={{
            title: data.noteTitle,
            body: data.noteBody,
            color: data.categoryColor,
            categoryId: data.categoryId,
          }}
          category={dataState.category}
          handleSubmit={mutateAsync}
        />
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-md min-h-[75vh] flex justify-center items-center">
          <LoaderCircle className="mx-auto size-10 animate-spin text-muted-foreground" />
        </div>
      )}
    </>
  );
};

export default NoteUpdate;
