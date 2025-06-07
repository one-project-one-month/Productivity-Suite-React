import type { Editor } from '@tiptap/react';
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Braces,
  Code,
  EggOff,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  Highlighter,
  Italic,
  Link2,
  List,
  ListCollapse,
  ListOrdered,
  ListPlus,
  ListTree,
  Minus,
  Redo,
  Strikethrough,
  Subscript,
  Superscript,
  TextQuote,
  Underline,
  Undo,
} from 'lucide-react';
import { Button } from '@/components/ui/button.tsx';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog.tsx';
import { Label } from '@/components/ui/label.tsx';
import { Input } from '@/components/ui/input.tsx';
import { useState, type JSX } from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select.tsx';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover.tsx';

type ToolbarProps = {
  editor: Editor | null;
};

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

const headingIcons: { level: HeadingLevel; icon: JSX.Element }[] = [
  { level: 1, icon: <Heading1 /> },
  { level: 2, icon: <Heading2 /> },
  { level: 3, icon: <Heading3 /> },
  { level: 4, icon: <Heading4 /> },
  { level: 5, icon: <Heading5 /> },
  { level: 6, icon: <Heading6 /> },
];

const Toolbar = ({ editor }: ToolbarProps) => {
  const [url, setUrl] = useState<string>('');

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [textColor, setTextColor] = useState<string>('#000000');

  const [backgroundColor, setBackgroundColor] = useState<string>('#ffffff');

  const [textAlgin, setTextAlgin] = useState('left');

  const [highlightColor, setHighlightColor] = useState('#fef08a');

  const [highLightPopover, setHighLightPopover] = useState(false);

  if (!editor) {
    return null;
  }

  const isBoldActive = editor.isActive('bold');
  const isItalicActive = editor.isActive('italic');
  const isStrikeActive = editor.isActive('strike');
  const isUnderlineActive = editor.isActive('underline');
  const isBulletListActive = editor.isActive('bulletList');
  const isOrderListActive = editor.isActive('orderedList');
  const isListItemDisable = !editor.can().splitListItem('listItem');
  const isListLeftDisable = !editor.can().liftListItem('listItem');
  const isListRightDisable = !editor.can().sinkListItem('listItem');
  const isBlockquoteActive = editor.isActive('blockquote');
  const isSubscriptActive = editor.isActive('subscript');
  const isSuperscriptActive = editor.isActive('superscript');
  const isHighlightActive = editor.isActive('highlight');
  const isCodeActive = editor.isActive('code');
  const hideBackgroundColor =
    'bg-transparent hover:bg-transparent hover:cursor-pointer';
  const isCodeBlockActive = editor.isActive('codeBlock');

  const applyHighlight = (color: string) => {
    editor.chain().focus().toggleHighlight({ color }).run();
    setHighlightColor(color);
  };

  const applyTextColor = (color: string) => {
    setTextColor(color);
    editor.chain().focus().setColor(color).run();
  };

  const applyBackgroundColor = (color: string) => {
    setBackgroundColor(color);
    editor.chain().focus().setHighlight({ color }).run();
  };

  const handleAddOrRemoveLink = () => {
    if (editor.isActive('link')) {
      editor.chain().focus().unsetLink().run();
      setIsDialogOpen(false);
    } else {
      setIsDialogOpen(true);
    }
  };

  const handleAddLink = () => {
    if (url) {
      editor.chain().focus().toggleLink({ href: url }).run();
      setUrl('');
    }
  };

  const handleAlginChange = (value: string) => {
    setTextAlgin(value);
    editor?.chain().focus().setTextAlign(value).run();
  };

  return (
    <div className="flex items-center gap-x-2 gap-y-1 p-2 bg-gray-100 border-b rounded-t-md border-gray-300 flex-wrap">
      {headingIcons.map(({ level, icon }) => (
        <Button
          key={level}
          type="button"
          variant={editor.isActive('heading', { level }) ? 'default' : 'ghost'}
          onClick={() => editor.chain().focus().toggleHeading({ level }).run()}
        >
          {icon}
        </Button>
      ))}
      <Button
        type="button"
        className="hover:cursor-pointer"
        onClick={() => editor.chain().focus().toggleBold().run()}
        variant={isBoldActive ? 'default' : 'ghost'}
      >
        <Bold
          className={cn(
            'h-4 w-4',
            isBoldActive ? 'text-white' : 'text-muted-foreground'
          )}
        />
      </Button>
      <Button
        type="button"
        className="hover:cursor-pointer"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        variant={isItalicActive ? 'default' : 'ghost'}
      >
        <Italic
          className={cn(
            'h-4 w-4',
            isItalicActive ? 'text-white' : 'text-muted-foreground'
          )}
        />
      </Button>

      <Button
        type="button"
        className="hover:cursor-pointer"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        variant={isStrikeActive ? 'default' : 'ghost'}
      >
        <Strikethrough
          className={cn(
            'h-4 w-4',
            isStrikeActive ? 'text-white' : 'text-muted-foreground'
          )}
        />
      </Button>
      <Button
        type="button"
        className="hover:cursor-pointer"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        variant={isUnderlineActive ? 'default' : 'ghost'}
      >
        <Underline
          className={cn(
            'h-4 w-4',
            isUnderlineActive ? 'text-white' : 'text-muted-foreground'
          )}
        />
      </Button>
      <Button
        type="button"
        className="hover:cursor-pointer"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        variant={isBulletListActive ? 'default' : 'ghost'}
      >
        <List
          className={cn(
            'h-4 w-4',
            isBulletListActive ? 'text-white' : 'text-muted-foreground'
          )}
        />
      </Button>

      <Button
        type="button"
        className="hover:cursor-pointer"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        variant={isOrderListActive ? 'default' : 'ghost'}
      >
        <ListOrdered
          className={cn(
            'h-4 w-4',
            isOrderListActive ? 'text-white' : 'text-muted-foreground'
          )}
        />
      </Button>

      <Button
        type="button"
        variant={isCodeBlockActive ? 'default' : 'ghost'}
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
      >
        <Code
          className={cn(
            isCodeBlockActive ? 'text-white' : 'text-muted-foreground'
          )}
        />
      </Button>

      <Button
        type="button"
        onClick={() => editor.chain().focus().splitListItem('listItem').run()}
        variant="default"
        className={hideBackgroundColor}
        disabled={isListItemDisable}
      >
        <ListPlus
          className={cn(
            isListItemDisable && 'text-black',
            'text-muted-foreground'
          )}
        />
      </Button>

      <Button
        type="button"
        onClick={() => editor.chain().focus().sinkListItem('listItem').run()}
        variant="default"
        className={hideBackgroundColor}
        disabled={isListRightDisable}
      >
        <ListTree
          className={cn(
            isListRightDisable && 'text-black',
            'text-muted-foreground'
          )}
        />
      </Button>

      <Button
        type="button"
        onClick={() => editor.chain().focus().liftListItem('listItem').run()}
        variant="default"
        className={hideBackgroundColor}
        disabled={isListLeftDisable}
      >
        <ListCollapse
          className={cn(
            isListLeftDisable && 'text-black',
            'text-muted-foreground'
          )}
        />
      </Button>

      <Button
        type="button"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        variant={isBlockquoteActive ? 'default' : 'ghost'}
      >
        <TextQuote
          className={cn(
            'h-4 w-4',
            isBlockquoteActive ? 'text-white' : 'text-muted-foreground'
          )}
        />
      </Button>

      <Button
        type="button"
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        variant="ghost"
      >
        <Minus className={cn('text-muted-foreground h-4 w-4')} />
      </Button>

      <Popover open={highLightPopover} onOpenChange={setHighLightPopover}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant={isHighlightActive ? 'default' : 'ghost'}
            className="p-2"
            onClick={() => {
              setHighLightPopover(true);
            }}
          >
            <Highlighter
              className={cn(
                'h-4 w-4',
                isHighlightActive ? 'text-white' : 'text-muted-foreground'
              )}
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-fit p-0">
          <p
            className="flex items-center justify-center px-2 pt-2 cursor-pointer"
            onClick={() => editor.chain().focus().unsetHighlight().run()}
          >
            <EggOff className="h-4 w-4" />
            <span className="text-md ms-1">None </span>
          </p>
          <Input
            type="color"
            value={highlightColor}
            onChange={(e) => applyHighlight(e.target.value)}
            className="cursor-pointer border-none bg-transparent p-1 h-12 w-full"
          />
        </PopoverContent>
      </Popover>

      <Button
        type="button"
        onClick={() => editor.chain().focus().toggleCode().run()}
        variant={isCodeActive ? 'default' : 'ghost'}
      >
        <Braces
          className={cn(
            'h-4 w-4',
            isCodeActive ? 'text-white' : 'text-muted-foreground'
          )}
        />
      </Button>

      <Button
        type="button"
        onClick={() => editor.chain().focus().toggleSubscript().run()}
        variant={isSubscriptActive ? 'default' : 'ghost'}
      >
        <Subscript className={cn('h-4 w-4')} />
      </Button>

      <Button
        type="button"
        onClick={() => editor.chain().focus().toggleSuperscript().run()}
        variant={isSuperscriptActive ? 'default' : 'ghost'}
      >
        <Superscript
          className={cn(
            'h-4 w-4',
            isSuperscriptActive ? 'text-white' : 'text-muted-foreground'
          )}
        />
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <Button
          type="button"
          variant="default"
          className={hideBackgroundColor}
          onClick={handleAddOrRemoveLink}
        >
          <Link2 className="text-black" />
        </Button>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add URL</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                name="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter URL"
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button type="button" onClick={handleAddLink}>
                Add
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Select value={textAlgin} onValueChange={handleAlginChange}>
        <SelectTrigger type="button" className="inline-flex">
          <SelectValue placeholder="Select Align" defaultValue={textAlgin} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Align</SelectLabel>
            <SelectItem value="left">
              <AlignLeft />
            </SelectItem>
            <SelectItem value="right">
              <AlignRight />
            </SelectItem>
            <SelectItem value="center">
              <AlignCenter />
            </SelectItem>
            <SelectItem value="justify">
              <AlignJustify />
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      <input
        type="color"
        name="text-color"
        value={textColor}
        onChange={(e) => applyTextColor(e.target.value as string)}
        className="h-8 w-8 rounded border"
      />

      <input
        type="color"
        name="bg-color"
        value={backgroundColor}
        onChange={(e) => applyBackgroundColor(e.target.value as string)}
        className="h-8 w-8 rounded border"
      />

      <Button
        type="button"
        className={hideBackgroundColor}
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().undo().run();
        }}
      >
        <Undo className="text-black" />
      </Button>

      <Button
        type="button"
        className={hideBackgroundColor}
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().redo().run();
        }}
      >
        <Redo className="text-black" />
      </Button>
    </div>
  );
};

export default Toolbar;
