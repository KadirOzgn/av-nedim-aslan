"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Image from '@tiptap/extension-image';
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon, 
  Strikethrough, 
  Heading1, 
  Heading2, 
  Heading3, 
  List, 
  ListOrdered, 
  Quote, 
  Undo, 
  Redo, 
  Link as LinkIcon,
  Image as ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify
} from 'lucide-react';
import { useCallback, useRef } from 'react';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) {
    return null;
  }

  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL Girin:', previousUrl);

    // cancelled
    if (url === null) {
      return;
    }

    // empty
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    // update link
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const addImage = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, []);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        editor.chain().focus().setImage({ src: data.url }).run();
      } else {
        alert('Görsel yüklenirken bir hata oluştu.');
      }
    } catch (error) {
      console.error(error);
      alert('Görsel yüklenemedi.');
    } finally {
      // Reset input value so same file can be uploaded again if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const toggleClass = (isActive: boolean) => 
    `p-2 rounded hover:bg-navy-primary/10 transition-colors ${isActive ? 'bg-navy-primary/20 text-navy-primary' : 'text-text-secondary'}`;

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 border-b border-border-primary bg-bg-secondary rounded-t-lg">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={toggleClass(editor.isActive('bold'))}
        title="Kalın"
      >
        <Bold size={18} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={toggleClass(editor.isActive('italic'))}
        title="İtalik"
      >
        <Italic size={18} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        disabled={!editor.can().chain().focus().toggleUnderline().run()}
        className={toggleClass(editor.isActive('underline'))}
        title="Altı Çizili"
      >
        <UnderlineIcon size={18} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        className={toggleClass(editor.isActive('strike'))}
        title="Üstü Çizili"
      >
        <Strikethrough size={18} />
      </button>

      <div className="w-px h-6 bg-border-primary mx-1" />

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={toggleClass(editor.isActive('heading', { level: 1 }))}
        title="Başlık 1"
      >
        <Heading1 size={18} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={toggleClass(editor.isActive('heading', { level: 2 }))}
        title="Başlık 2"
      >
        <Heading2 size={18} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={toggleClass(editor.isActive('heading', { level: 3 }))}
        title="Başlık 3"
      >
        <Heading3 size={18} />
      </button>

      <div className="w-px h-6 bg-border-primary mx-1" />

      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        className={toggleClass(editor.isActive({ textAlign: 'left' }))}
        title="Sola Hizala"
      >
        <AlignLeft size={18} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        className={toggleClass(editor.isActive({ textAlign: 'center' }))}
        title="Ortala"
      >
        <AlignCenter size={18} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        className={toggleClass(editor.isActive({ textAlign: 'right' }))}
        title="Sağa Hizala"
      >
        <AlignRight size={18} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign('justify').run()}
        className={toggleClass(editor.isActive({ textAlign: 'justify' }))}
        title="Yasla"
      >
        <AlignJustify size={18} />
      </button>

      <div className="w-px h-6 bg-border-primary mx-1" />

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={toggleClass(editor.isActive('bulletList'))}
        title="Madde İşaretli Liste"
      >
        <List size={18} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={toggleClass(editor.isActive('orderedList'))}
        title="Numaralı Liste"
      >
        <ListOrdered size={18} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={toggleClass(editor.isActive('blockquote'))}
        title="Alıntı"
      >
        <Quote size={18} />
      </button>
      
      <div className="w-px h-6 bg-border-primary mx-1" />

      <button
        type="button"
        onClick={setLink}
        className={toggleClass(editor.isActive('link'))}
        title="Link Ekle"
      >
        <LinkIcon size={18} />
      </button>
      <button
        type="button"
        onClick={addImage}
        className={toggleClass(false)}
        title="Görsel Ekle"
      >
        <ImageIcon size={18} />
      </button>

      <div className="flex-grow" />

      <button
        type="button"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
        className={toggleClass(false)}
        title="Geri Al"
      >
        <Undo size={18} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
        className={toggleClass(false)}
        title="İleri Al"
      >
        <Redo size={18} />
      </button>

      {/* Gizli dosya yükleme inputu */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        style={{ display: 'none' }} 
      />
    </div>
  );
};

export default function RichTextEditor({ content, onChange, placeholder }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-lg max-w-full h-auto',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-navy-primary underline cursor-pointer',
        },
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose-base dark:prose-invert max-w-none focus:outline-none min-h-[300px] p-4 bg-bg-primary rounded-b-lg border border-t-0 border-border-primary',
      },
    },
  });

  return (
    <div className="w-full flex flex-col">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} className="editor-content" />
      <style jsx global>{`
        .editor-content .ProseMirror h1 { font-family: serif; font-size: 1.5rem; font-weight: 700; color: var(--text-primary); margin-top: 2rem; margin-bottom: 1rem; padding-bottom: 0.5rem; border-bottom: 1px solid rgba(0, 0, 0, 0.05); }
        .editor-content .ProseMirror h2 { font-family: serif; font-size: 1.25rem; font-weight: 700; color: var(--text-primary); margin-top: 2rem; margin-bottom: 1rem; padding-bottom: 0.5rem; border-bottom: 1px solid rgba(0, 0, 0, 0.05); }
        .editor-content .ProseMirror h3 { font-family: serif; font-size: 1.125rem; font-weight: 600; color: var(--text-primary); margin-top: 1.5rem; margin-bottom: 0.5rem; }
        .editor-content .ProseMirror p { font-size: 0.875rem; color: var(--text-secondary); font-weight: 300; line-height: 1.625; margin-bottom: 1.25rem; text-align: justify; }
        .editor-content .ProseMirror ul { list-style-type: disc; padding-left: 1.25rem; margin-bottom: 1.25rem; font-size: 0.75rem; color: var(--text-secondary); font-weight: 300; display: flex; flex-direction: column; gap: 0.5rem; }
        .editor-content .ProseMirror ol { list-style-type: decimal; padding-left: 1.25rem; margin-bottom: 1.25rem; font-size: 0.75rem; color: var(--text-secondary); font-weight: 300; display: flex; flex-direction: column; gap: 0.5rem; }
        .editor-content .ProseMirror strong { font-weight: 600; color: var(--text-primary); }
        .editor-content .ProseMirror em { font-style: italic; color: var(--text-secondary); }
        .editor-content .ProseMirror a { color: var(--navy-primary); text-decoration: underline; }
        .editor-content .ProseMirror blockquote { border-left: 3px solid rgba(0, 0, 0, 0.1); margin-left: 0; padding-left: 1rem; font-style: italic; color: var(--text-secondary); }
        .editor-content .ProseMirror img { max-width: 100%; height: auto; border-radius: 0.5rem; margin-top: 1em; margin-bottom: 1em; }
        .editor-content .ProseMirror img.ProseMirror-selectednode { outline: 3px solid var(--navy-primary); }
      `}</style>
    </div>
  );
}
