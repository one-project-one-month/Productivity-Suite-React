import React, { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';

interface NoteEditorProps {
  noteTitle: string;
  noteContent: string;
  onTitleChange: (title: string) => void;
  onNoteChange: (content: string) => void;
}

const NoteEditor = ({
  noteTitle,
  noteContent,
  onTitleChange,
  onNoteChange,
}: NoteEditorProps) => {
  const [title, setTitle] = useState(noteTitle);
  const [content, setContent] = useState(noteContent);

  useEffect(() => {
    setTitle(noteTitle);
    setContent(noteContent);
  }, [noteContent, noteTitle]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    onTitleChange(newTitle);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    onNoteChange(newContent);
  };

  return (
    <div className="h-full flex flex-col">
      <Input
        className="text-lg font-semibold px-3 py-2 focus-visible:ring-0 focus-visible:border-0 focus-visible:shadow-none shadow-none border-0"
        placeholder="Note title..."
        value={title}
        onChange={handleTitleChange}
      />
      <Textarea
        className="note-editor flex-1 min-h-[calc(100vh-12rem)] resize-none focus-visible:ring-0 focus-visible:border-0 shadow-none border-0"
        placeholder="Start writing your markdown note..."
        value={content}
        onChange={handleContentChange}
      />
    </div>
  );
};

export default NoteEditor;
