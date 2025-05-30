import type { Editor } from "@tiptap/react";
import { Bold } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { cn } from "@/lib/utils"; // optional: a utility to combine classNames

type ToolbarProps = {
    editor: Editor | null;
};

const Toolbar = ({ editor }: ToolbarProps) => {
    if (!editor) return null;

    const isBoldActive = editor.isActive("bold");

    return (
        <Button
            onClick={() => editor.chain().focus().toggleBold().run()}
            variant={isBoldActive ? "default" : "ghost"} // adjust these variants as needed
        >
            <Bold
                className={cn(
                    "h-4 w-4",
                    isBoldActive ? "text-white" : "text-muted-foreground"
                )}
            />
        </Button>
    );
};

export default Toolbar;
