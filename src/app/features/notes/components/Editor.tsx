import Toolbar from '@/app/features/notes/components/Toolbar.tsx';
import { EditorContent, useEditor } from '@tiptap/react';
import { cn } from '@/lib/utils.ts';
import { debounce } from 'lodash';
import { Typography } from '@tiptap/extension-typography';
import { Placeholder } from '@tiptap/extension-placeholder';
import { StarterKit } from '@tiptap/starter-kit';
import { Underline } from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import { TextStyle } from '@tiptap/extension-text-style';
import { TextAlign } from '@tiptap/extension-text-align';
import { Color } from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import { Superscript } from '@tiptap/extension-superscript';
import { Subscript } from '@tiptap/extension-subscript';
import { CodeBlockLowlight } from '@tiptap/extension-code-block-lowlight';
import { all, createLowlight } from 'lowlight';
import { Markdown } from 'tiptap-markdown';

const lowlight = createLowlight(all);

const Editor = ({
  name,
  content,
  onChange,
}: {
  name: string;
  content: string;
  onChange: (content: string) => void;
}) => {
  const handleUpdate = debounce((editor) => {
    onChange(editor.getHTML());
  }, 300);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Subscript,
      Superscript,
      Link.configure({
        autolink: true,
        defaultProtocol: 'https',
        HTMLAttributes: {
          class: 'text-editor-link',
        },
      }),
      TextStyle,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Color.configure({ types: ['textStyle'] }),
      Highlight.configure({ multicolor: true }),
      Placeholder.configure({
        placeholder: 'Start typing here...',
      }),
      CodeBlockLowlight.configure({
        lowlight,
      }),
      Markdown.configure({
        html: true, // Allow HTML input/output
        tightLists: true, // No <p> inside <li> in markdown output
        bulletListMarker: '-', // <li> prefix in markdown output
        linkify: true, // Create links from "https://..." text
        breaks: true, // New lines (\n) in markdown input are converted to <br>
        transformPastedText: true, // Allow to paste markdown text in the editor
        transformCopiedText: true, // Copied text is transformed to markdown
      }),
      Typography,
    ],
    content: content,
    editorProps: {
      attributes: {
        class: cn(
          'px-4 py-3 border-b border-x w-full text-[16px] pt-4 rounded-bl-md rounded-br-md outline-none min-h-[45vh] overflow-auto bg-slate-50 border-form-stroke/30'
        ),
      },
    },
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      handleUpdate(editor);
    },
  });

  return (
    <>
      <Toolbar editor={editor} />
      <EditorContent name={name} editor={editor} />
    </>
  );
};

export default Editor;
