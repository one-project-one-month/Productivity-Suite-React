interface Category {
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
