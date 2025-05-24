import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { BookTextIcon, PencilIcon, PlusIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

import NoteSidebar from './NoteSidebar';
import NoteEditor from './NoteEditor';
import MarkdownPreview from './MarkdownPreview';

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
}

const NoteLayout: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const activeNote = notes.find((note) => note.id === activeNoteId) || null;

  const handleNewNote = () => {
    const newNote: Note = {
      id: `note-${Date.now()}`,
      title: 'Untitled Note',
      content: '',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    const updatedNotes = [newNote, ...notes];
    setNotes(updatedNotes);
    setActiveNoteId(newNote.id);
  };

  const handleTitleChange = (title: string) => {
    if (!activeNoteId) return;

    setNotes((prevNotes) =>
      prevNotes.map((note) => {
        if (note.id === activeNoteId) {
          return {
            ...note,
            title,
            updatedAt: Date.now(),
          };
        }
        return note;
      })
    );
  };

  const handleNoteChange = (content: string) => {
    if (!activeNoteId) return;

    setNotes((prevNotes) =>
      prevNotes.map((note) => {
        if (note.id === activeNoteId) {
          return {
            ...note,
            content,
            updatedAt: Date.now(),
          };
        }
        return note;
      })
    );
  };

  const handleDeleteNote = (noteId: string) => {
    const updatedNotes = notes.filter((note) => note.id !== noteId);
    setNotes(updatedNotes);

    if (activeNoteId === noteId) {
      setActiveNoteId(updatedNotes.length > 0 ? updatedNotes[0].id : null);
    }
  };

  const toggleSidebar = () => {
    setSidebarVisible((prev) => !prev);
  };

  // Save notes to localStorage whenever they change
  useEffect(() => {
    if (notes.length > 0) {
      localStorage.setItem('notes', JSON.stringify(notes));
    }
  }, [notes]);

  useEffect(() => {
    const savedNotes = localStorage.getItem('notes');
    if (savedNotes) {
      try {
        const parsedNotes = JSON.parse(savedNotes);
        setNotes(parsedNotes);
        if (parsedNotes.length > 0) {
          setActiveNoteId(parsedNotes[0].id);
        }
      } catch (error) {
        console.error('Error parsing notes from localStorage', error);
      }
    }
  }, []);

  return (
    <div className="h-screen flex flex-col">
      <div className="flex flex-1 overflow-hidden">
        <div
          className={cn(
            'transition-all duration-300 ease-in-out',
            sidebarVisible ? 'w-64' : 'w-16'
          )}
        >
          <NoteSidebar
            notes={notes}
            activeNoteId={activeNoteId}
            onNoteSelect={setActiveNoteId}
            onNewNote={handleNewNote}
            onDeleteNote={handleDeleteNote}
            toggleSidebar={toggleSidebar}
            sidebarVisible={sidebarVisible}
          />
          {/* {sidebarVisible && (
          
          )} */}
        </div>

        {activeNoteId && activeNote ? (
          <div className="flex-1 overflow-hidden">
            <Tabs defaultValue="edit" className="h-full flex flex-col">
              <div className="flex justify-between items-center px-4 pt-2">
                <TabsList className="grid w-[200px] grid-cols-2">
                  <TabsTrigger value="edit" className="flex items-center gap-2">
                    <PencilIcon className="h-4 w-4" /> Edit
                  </TabsTrigger>
                  <TabsTrigger
                    value="preview"
                    className="flex items-center gap-2"
                  >
                    <BookTextIcon className="h-4 w-4" /> Preview
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="edit" className="mt-0 flex-1 overflow-hidden">
                <NoteEditor
                  noteTitle={activeNote?.title ?? ''}
                  noteContent={activeNote?.content ?? ''}
                  onTitleChange={handleTitleChange}
                  onNoteChange={handleNoteChange}
                />
              </TabsContent>

              <TabsContent
                value="preview"
                className="mt-0 flex-1 overflow-hidden"
              >
                <MarkdownPreview
                  title={activeNote?.title ?? ''}
                  content={activeNote?.content ?? ''}
                />
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-muted/10">
            <div className="text-center">
              <BookTextIcon className="h-16 w-16 mx-auto text-muted-foreground opacity-50 mb-4" />
              <h2 className="text-xl font-semibold mb-2">No Note Selected</h2>
              <p className="text-muted-foreground mb-4">
                Create a new note or select an existing one to start editing
              </p>
              <Button
                onClick={handleNewNote}
                className="bg-note-purple hover:bg-note-deep"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Create New Note
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NoteLayout;
