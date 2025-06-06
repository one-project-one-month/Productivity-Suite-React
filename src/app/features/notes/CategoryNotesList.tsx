import { deleteNote, getAllNotesByCategoryId, notePinned } from '@/api/notes';
import ConfirmModalBox from '@/app/features/notes/components/ConfirmModalBox';
import NoteCard from '@/app/features/notes/components/NoteCard';
import { Button } from '@/components/ui/button';
import { useMutation, useQuery } from '@tanstack/react-query';
import { BookOpen, MoveLeft, Pin, Plus } from 'lucide-react';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';

const CategoryNotesList = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const category = location.state;

  const [notes, setNotes] = useState<Note[]>([]);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [deletedId, setDeletedId] = useState<number | null>(null);

  const pinnedNotes = notes?.filter((note) => note.pinned);
  const regularNotes = notes?.filter((note) => !note.pinned);

  const { isLoading, refetch } = useQuery({
    queryKey: ['get-all-notes-by-category-id', category.categoryId],
    queryFn: async (): Promise<CategoryNote> =>
      await getAllNotesByCategoryId(`categoryId=${category.categoryId}`).then(
        (res) => {
          if (res.data.code === 200) {
            setNotes(res.data.data.notes);
            return res.data.data;
          }
          throw new Error('Failed to fetch notes for this category');
        }
      ),
    refetchOnMount: true,
  });

  const { mutateAsync } = useMutation({
    mutationFn: async (noteId: number) =>
      await notePinned(noteId.toString()).then((res) => {
        if (res.data.code === 200) {
          const updatedNotes = notes.map((note) =>
            note.id === noteId ? { ...note, pinned: !note.pinned } : note
          );
          setNotes(updatedNotes);
          return res.data.data;
        }
        throw new Error('Failed to pin/unpin note');
      }),
  });

  const { mutateAsync: deleteNoteMutation } = useMutation({
    mutationFn: async (noteId: number) =>
      await deleteNote(noteId.toString()).then((res) => {
        if (res.data.code === 200) {
          const updatedNotes = notes.filter((note) => note.id !== noteId);
          setNotes(updatedNotes);
          refetch();
          setDeletedId(null);
          return res.data.data;
        }
        throw new Error('Failed to delete note');
      }),
  });

  const handleDeleteNote = () => {
    if (deletedId === null) return;
    deleteNoteMutation(deletedId);
    setOpenConfirmModal(false);
  };

  const handleConfirmDelete = (noteId: number) => {
    setOpenConfirmModal(true);
    setDeletedId(noteId);
  };

  const handleTogglePin = (noteId: number) => {
    mutateAsync(noteId);
  };

  const renderSkeletons = (count = 6) =>
    new Array(count)
      .fill(null)
      .map((_, i) => (
        <div key={i} className="h-40 rounded-md bg-gray-200 animate-pulse" />
      ));

  console.log(openConfirmModal);

  return (
    <div>
      <div
        className="flex items-center space-x-2 cursor-pointer"
        onClick={() => navigate('/app/notes')}
      >
        <MoveLeft />
        <span>Back</span>
      </div>

      <div className="flex justify-end mb-4">
        <Button
          className="bg-purple-600 hover:bg-purple-700"
          onClick={() =>
            navigate(`/app/notes/${category.categoryId}/create`, {
              state: category,
            })
          }
        >
          <Plus className="w-4 h-4 mr-1" />
          Create Note
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {renderSkeletons(6)}
        </div>
      ) : (
        <>
          {pinnedNotes?.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Pin className="w-4 h-4 mr-2 text-yellow-500" />
                Pinned Notes
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pinnedNotes?.map((note) => (
                  <NoteCard
                    key={note.id}
                    category={category}
                    note={note}
                    onDelete={handleConfirmDelete}
                    onTogglePin={handleTogglePin}
                  />
                ))}
              </div>
            </div>
          )}

          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Notes</h2>
            {regularNotes?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {regularNotes?.map((note) => (
                  <NoteCard
                    key={note.id}
                    category={category}
                    note={note}
                    onDelete={handleConfirmDelete}
                    onTogglePin={handleTogglePin}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg mb-4">
                  {'No notes in this category yet'}
                </p>
                <Button
                  className="bg-purple-600 hover:bg-purple-700"
                  onClick={() =>
                    navigate(`/app/notes/${category.categoryId}/create`, {
                      state: category,
                    })
                  }
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create your first note
                </Button>
              </div>
            )}
          </div>
        </>
      )}

      <ConfirmModalBox
        open={openConfirmModal}
        setOpen={setOpenConfirmModal}
        title="Delete Note"
        description="Are u sure to delete this"
        handleAction={handleDeleteNote}
      />
    </div>
  );
};

export default CategoryNotesList;
