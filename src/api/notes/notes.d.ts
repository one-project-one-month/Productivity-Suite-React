interface NoteCategory {
  categoryId: number;
  categoryName: string;
  color: string;
  numberOfNotes: number;
}

interface CategoryNote {
  categoryId: number;
  categoryName: string;
  notes: Note[];
}

interface Note {
  id: number;
  title: string;
  body: string;
  color: string;
  pinned: boolean;
}

interface NoteShow  {
  categoryId: number;
  categoryName: string;
  categoryColor: string;
  noteId: number;
  noteTitle: string;
  noteBody: string;
  noteColor: string;
  pinned: boolean;
}