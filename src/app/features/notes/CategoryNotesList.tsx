import ConfirmModalBox from '@/app/features/notes/components/ConfirmModalBox';
import NoteCard from '@/app/features/notes/components/NoteCard';
import { Button } from '@/components/ui/button';
import { BookOpen, MoveLeft, Pin, Plus } from 'lucide-react';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';

const categoryNotes: CategoryNote = {
  categoryId: 1,
  categoryName: 'Work Projects',
  notes: [
    {
      id: 1,
      title: 'Weekly Sync Meeting',
      body: 'Prepare the slides for the client update by Wednesday.',
      color: '#ff0000', // yellow
      pinned: true,
    },
    {
      id: 2,
      title: 'Design Review',
      body: 'Get feedback from the UI team before pushing to staging.',
      color: '#fef08a',
      pinned: true,
    },
    {
      id: 3,
      title: 'Design Review',
      body: 'Get feedback from the UI team before pushing to staging.',
      color: '#fef08a',
      pinned: true,
    },
    {
      id: 4,
      title: 'Design Review',
      body: 'Get feedback from the UI team before pushing to staging.',
      color: '#fef08a',
      pinned: true,
    },
    {
      id: 5,
      title: 'Design Review',
      body: 'Get feedback from the UI team before pushing to staging.',
      color: '#fef08a',
      pinned: true,
    },
  ],
};

const CategoryNotesList = () => {
  const location = useLocation();

  const navigate = useNavigate();

  const category = location.state;

  const [notes, setNotes] = useState(categoryNotes.notes);

  const [openConfirmModal, setOpenConfirmModal] = useState(false);

  const [deletedId, setDeletedId] = useState<number | null>(null);

  const pinnedNotes = notes.filter((note) => note.pinned);

  const regularNotes = notes.filter((note) => !note.pinned);

  const handleDeleteNote = () => {
    setNotes((prev) => prev.filter((note) => note.id !== deletedId));
    setOpenConfirmModal(false);
  };

  const handleConfirmDelete = (noteId: number) => {
    setOpenConfirmModal(true);
    setDeletedId(noteId);
  };

  const handleTogglePin = (noteId: number) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === noteId ? { ...note, pinned: !note.pinned } : note
      )
    );
  };

  console.log(category, 'CATEGORY');

  return (
    <div className="">
      <div
        className="flex items-center space-x-2 cursor-pointer"
        onClick={() => navigate(-1)}
      >
        <MoveLeft />
        <span>Back</span>
      </div>
      <div className="flex justify-end">
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
      {pinnedNotes.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Pin className="w-4 h-4 mr-2 text-yellow-500" />
            Pinned Notes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pinnedNotes.map((note) => (
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
                onDelete={handleDeleteNote}
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
