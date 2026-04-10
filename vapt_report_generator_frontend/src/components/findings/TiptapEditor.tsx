import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";
import { IconButton } from "@/components/ui/IconButton";

interface TiptapEditorProps {
  value: string;
  onChange: (html: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

// ── Toolbar button ────────────────────────────────────────────────────────────
function ToolbarBtn({
  active,
  onClick,
  tooltip,
  children,
}: {
  active?: boolean;
  onClick: () => void;
  tooltip: string;
  children: React.ReactNode;
}) {
  return (
    <IconButton
      size="sm"
      tooltip={tooltip}
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
      className={
        active ? "bg-[var(--c-accent-dim)] text-[var(--c-accent)]" : ""
      }>
      {children}
    </IconButton>
  );
}

export function TiptapEditor({
  value,
  onChange,
  disabled = false,
  placeholder = "Describe the vulnerability…",
}: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Remove everything we don't want
        heading: false,
        blockquote: false,
        codeBlock: false,
        horizontalRule: false,
        // Keep: bold, italic, code (inline), bulletList, orderedList, paragraph
      }),
    ],
    content: value,
    editable: !disabled,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Sync external value changes (e.g. switching active finding)
  useEffect(() => {
    if (!editor) return;
    if (editor.getHTML() !== value) {
      editor.commands.setContent(value, { emitUpdate: false });
    }
  }, [value, editor]);

  // Sync disabled state
  useEffect(() => {
    if (!editor) return;
    editor.setEditable(!disabled);
  }, [disabled, editor]);

  if (!editor) return null;

  return (
    <div
      className={`flex flex-col rounded-[var(--radius-sm)] border transition-colors duration-150 ${
        disabled
          ? "border-[var(--c-border-soft)] opacity-50"
          : "border-[var(--c-border-soft)] focus-within:border-[var(--c-border)] focus-within:ring-1 focus-within:ring-[var(--c-accent)] focus-within:ring-opacity-30"
      }`}>
      {/* Toolbar */}
      {!disabled && (
        <div className="flex items-center gap-0.5 px-2 py-1.5 border-b border-[var(--c-border-soft)] bg-[var(--c-bg-3)]">
          <ToolbarBtn
            active={editor.isActive("bold")}
            onClick={() => editor.chain().focus().toggleBold().run()}
            tooltip="Bold">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path
                d="M3 2h4a2 2 0 010 4H3V2zM3 6h4.5a2 2 0 010 4H3V6z"
                stroke="currentColor"
                strokeWidth="1.3"
                fill="none"
                strokeLinejoin="round"
              />
            </svg>
          </ToolbarBtn>

          <ToolbarBtn
            active={editor.isActive("italic")}
            onClick={() => editor.chain().focus().toggleItalic().run()}
            tooltip="Italic">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path
                d="M7 2H5m2 8H5m1-8l-2 8"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
              />
            </svg>
          </ToolbarBtn>

          <ToolbarBtn
            active={editor.isActive("code")}
            onClick={() => editor.chain().focus().toggleCode().run()}
            tooltip="Inline code">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path
                d="M4 3L1 6l3 3M8 3l3 3-3 3"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </ToolbarBtn>

          <div className="w-px h-4 bg-[var(--c-border-soft)] mx-1" />

          <ToolbarBtn
            active={editor.isActive("bulletList")}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            tooltip="Bullet list">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <circle cx="2" cy="3" r="1" fill="currentColor" />
              <circle cx="2" cy="6" r="1" fill="currentColor" />
              <circle cx="2" cy="9" r="1" fill="currentColor" />
              <path
                d="M5 3h6M5 6h6M5 9h6"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
              />
            </svg>
          </ToolbarBtn>

          <ToolbarBtn
            active={editor.isActive("orderedList")}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            tooltip="Ordered list">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path
                d="M1.5 2v2.5M1 4.5h1"
                stroke="currentColor"
                strokeWidth="1.1"
                strokeLinecap="round"
              />
              <path
                d="M1 7.5h1c0 0 0 1-1 1.5h1"
                stroke="currentColor"
                strokeWidth="1.1"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M5 3h6M5 6h6M5 9h6"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
              />
            </svg>
          </ToolbarBtn>
        </div>
      )}

      {/* Editor area */}
      <EditorContent
        editor={editor}
        className="tiptap-editor px-3 py-2.5 min-h-[120px] text-sm text-[var(--c-text-primary)] bg-[var(--c-bg)]"
        placeholder={placeholder}
      />
    </div>
  );
}
