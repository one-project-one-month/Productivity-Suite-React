import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getPreviewText } from '@/lib/stringUtils';
import { Edit, Pin, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router';

interface NoteCardProps {
  category?: NoteCategory;
  note: Note;
  onDelete: (noteId: number) => void;
  onTogglePin: (noteId: number) => void;
}

const NoteCard = ({ category, note, onDelete, onTogglePin }: NoteCardProps) => {
  const navigate = useNavigate();

  return (
    <Card
      className="group hover:shadow-lg transition-all duration-200 py-3 gap-1 cursor-pointer bg-white/70 backdrop-blur-sm border-gray-200"
      style={{ borderLeftColor: note?.color, borderLeftWidth: '4px' }}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle
            className="text-lg font-medium line-clamp-2 group-hover:text-purple-600 transition-colors truncate max-w-28"
            title={note.title}
          >
            {note.title}
          </CardTitle>
          <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                onTogglePin(note.id);
              }}
              className={note.pinned ? 'text-yellow-500' : 'text-gray-400'}
            >
              <Pin className="w-3 h-3" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() =>
                navigate(`/app/notes/${category?.categoryId}/edit/${note.id}`, {
                  state: {
                    note: note,
                    category: category,
                  },
                })
              }
            >
              <Edit className="w-3 h-3" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(note.id);
              }}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 text-sm line-clamp-4">
          {getPreviewText(note.body)}
        </p>
      </CardContent>
    </Card>
  );
};

export default NoteCard;
