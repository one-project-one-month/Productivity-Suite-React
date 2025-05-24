import React from 'react';
import { Button } from '@/components/ui/button';
import {
  PlusIcon,
  FileTextIcon,
  TrashIcon,
  PanelLeftIcon,
  PanelRightIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
}

interface NoteSidebarProps {
  notes: Note[];
  sidebarVisible: boolean;
  activeNoteId: string | null;
  onNewNote: () => void;
  toggleSidebar: () => void;
  onDeleteNote: (noteId: string) => void;
  onNoteSelect: (noteId: string) => void;
}

const NoteSidebar: React.FC<NoteSidebarProps> = ({
  notes,
  activeNoteId,
  onNoteSelect,
  onNewNote,
  onDeleteNote,
  toggleSidebar,
  sidebarVisible,
}) => {
  return (
    <div className="w-full h-full bg-sidebar border-r border-border flex flex-col">
      <div className="p-4 flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          title="Toggle Sidebar"
        >
          {sidebarVisible ? <PanelLeftIcon /> : <PanelRightIcon />}
        </Button>
        {sidebarVisible && (
          <div className="animate-fade-in duration-500 flex space-x-5">
            <h1 className="font-bold text-lg">Notes</h1>
            <Button
              size="sm"
              onClick={onNewNote}
              className="bg-note-purple hover:bg-note-deep"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              New
            </Button>
          </div>
        )}
      </div>
      <Separator />
      <div
        className={cn(
          'flex-1 overflow-y-auto p-2 hidden animate-fade-in',
          sidebarVisible && 'block'
        )}
      >
        {notes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
            <FileTextIcon className="h-8 w-8 mb-2 opacity-50" />
            <p className="text-sm">No notes yet</p>
            <p className="text-xs">Create your first note</p>
          </div>
        ) : (
          <div className="space-y-1">
            {notes.map((note) => (
              <div
                key={note.id}
                className={cn(
                  'group flex items-center justify-between px-3 py-2 rounded-md animate-fade-in',
                  activeNoteId === note.id
                    ? 'bg-note-lavender text-note-deep'
                    : 'hover:bg-secondary/50 text-foreground'
                )}
              >
                <button
                  className="flex-1 text-left overflow-hidden"
                  onClick={() => onNoteSelect(note.id)}
                >
                  <h3 className="font-medium truncate">
                    {note.title || 'Untitled Note'}
                  </h3>
                  <p className="text-xs text-muted-foreground truncate">
                    {new Date(note.updatedAt).toLocaleDateString()}
                  </p>
                </button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="opacity-0 group-hover:opacity-100 h-7 w-7"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteNote(note.id);
                  }}
                >
                  <TrashIcon className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NoteSidebar;
