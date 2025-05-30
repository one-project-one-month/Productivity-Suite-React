import Toolbar from "@/app/features/notes/components/Toolbar.tsx";
import {EditorContent, useEditor} from "@tiptap/react";
import {cn} from "@/lib/utils.ts";
import { debounce } from 'lodash'
import {Typography} from "@tiptap/extension-typography";
import {Placeholder} from "@tiptap/extension-placeholder";
import {StarterKit} from "@tiptap/starter-kit";
import {Underline} from "@tiptap/extension-underline";
import Link from '@tiptap/extension-link'
import {TextStyle} from "@tiptap/extension-text-style";
import {TextAlign} from "@tiptap/extension-text-align";
import {Color} from "@tiptap/extension-color";
import Highlight from '@tiptap/extension-highlight'

const Editor= ({	content,onChange}: {content:string, onChange:(content:string)=>void})=> {

    const handleUpdate = debounce((editor) => {
        onChange(editor.getHTML())
    }, 300)

    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
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
            Typography,
        ],
        content: content,
        editorProps: {
            attributes: {
                class: cn(
                    'px-4 py-3 border-b border-x w-full text-[16px] pt-4 rounded-bl-md rounded-br-md outline-none h-[200px] overflow-auto bg-slate-50 border-form-stroke/30'
                ),
            },
        },
        immediatelyRender: false,
        onUpdate: ({ editor }) => {
            handleUpdate(editor)
        },
    })

    return (
        <>
            <Toolbar
                editor={editor}
            />
            <EditorContent name="Note Taking" editor={editor} />
        </>
    )
}

export default Editor;