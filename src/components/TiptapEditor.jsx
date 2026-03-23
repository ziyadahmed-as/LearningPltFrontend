import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'

const MenuButton = ({ onClick, isActive, icon, label, title }) => (
  <button
    type="button"
    onClick={onClick}
    className={`tiptap-btn ${isActive ? 'is-active' : ''}`}
    title={title}
    style={{
      padding: '6px 10px',
      fontSize: '0.8rem',
      background: isActive ? 'var(--primary)' : 'var(--bg-elevated)',
      border: '1px solid var(--border)',
      borderRadius: '6px',
      color: isActive ? '#fff' : 'var(--text-primary)',
      cursor: 'pointer',
      fontWeight: '600',
      transition: 'all 0.2s',
      display: 'flex',
      alignItems: 'center',
      gap: '4px'
    }}
  >
    {icon && <span>{icon}</span>}
    {label && <span>{label}</span>}
  </button>
)

const MenuBar = ({ editor }) => {
  if (!editor) return null

  const addImage = () => {
    const url = window.prompt('Enter image URL')
    if (url) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }

  const setLink = () => {
    const url = window.prompt('Enter URL')
    if (url) {
      editor.chain().focus().setLink({ href: url }).run()
    }
  }

  return (
    <div className="tiptap-menubar" style={{ 
      display: 'flex', 
      flexWrap: 'wrap', 
      gap: '6px', 
      padding: '10px', 
      background: 'var(--bg-card)', 
      border: '1px solid var(--border)',
      borderBottom: 'none',
      borderTopLeftRadius: '12px',
      borderTopRightRadius: '12px',
      position: 'sticky',
      top: 0,
      zIndex: 10
    }}>
      <MenuButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')} label="B" title="Bold" />
      <MenuButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')} label="I" title="Italic" />
      <MenuButton onClick={() => editor.chain().focus().toggleUnderline().run()} isActive={editor.isActive('underline')} label="U" title="Underline" />
      <MenuButton onClick={() => editor.chain().focus().toggleStrike().run()} isActive={editor.isActive('strike')} label="S" title="Strikethrough" />
      
      <div style={{ width: '1px', background: 'var(--border)', margin: '0 4px' }} />
      
      <MenuButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} isActive={editor.isActive('heading', { level: 1 })} label="H1" title="Heading 1" />
      <MenuButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} isActive={editor.isActive('heading', { level: 2 })} label="H2" title="Heading 2" />
      <MenuButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} isActive={editor.isActive('heading', { level: 3 })} label="H3" title="Heading 3" />
      
      <div style={{ width: '1px', background: 'var(--border)', margin: '0 4px' }} />
      
      <MenuButton onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')} label="• List" title="Bullet List" />
      <MenuButton onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList')} label="1. List" title="Ordered List" />
      <MenuButton onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive('blockquote')} label="❝ Quote" title="Blockquote" />
      <MenuButton onClick={() => editor.chain().focus().toggleCodeBlock().run()} isActive={editor.isActive('codeBlock')} label="</> Code" title="Code Block" />
      <MenuButton onClick={() => editor.chain().focus().setHorizontalRule().run()} label="— Rule" title="Horizontal Rule" />
      
      <div style={{ width: '1px', background: 'var(--border)', margin: '0 4px' }} />
      
      <MenuButton onClick={setLink} isActive={editor.isActive('link')} label="🔗 Link" title="Add Link" />
      <MenuButton onClick={addImage} label="🖼️ Image" title="Insert Image via Link" />
      <MenuButton onClick={() => editor.chain().focus().undo().run()} label="↺" title="Undo" />
      <MenuButton onClick={() => editor.chain().focus().redo().run()} label="↻" title="Redo" />
    </div>
  )
}

const TiptapEditor = ({ value, onChange, placeholder }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: false }),
      Image,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'tiptap-editor-content',
        style: `
          min-height: 250px;
          outline: none;
          padding: 20px;
          line-height: 1.6;
          color: var(--text-primary);
        `
      }
    }
  })

  // Handle value change from outside (e.g. data loading)
  if (editor && value !== editor.getHTML() && !editor.isFocused) {
    editor.commands.setContent(value, false)
  }

  return (
    <div style={{ 
      border: '1px solid var(--border)', 
      borderRadius: '12px', 
      background: 'var(--bg-elevated)',
      overflow: 'hidden'
    }}>
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
      
      <style>{`
        .tiptap-editor-content h1 { font-size: 2rem; margin-bottom: 1rem; color: var(--primary); }
        .tiptap-editor-content h2 { font-size: 1.5rem; margin-bottom: 0.75rem; border-bottom: 1px solid var(--border); padding-bottom: 0.25rem; }
        .tiptap-editor-content h3 { font-size: 1.25rem; margin-bottom: 0.5rem; }
        .tiptap-editor-content ul, .tiptap-editor-content ol { padding-left: 1.5rem; margin-bottom: 1rem; }
        .tiptap-editor-content blockquote { border-left: 4px solid var(--primary); padding-left: 1rem; font-style: italic; color: var(--text-muted); margin: 1rem 0; }
        .tiptap-editor-content img { max-width: 100%; height: auto; border-radius: 8px; margin: 1rem 0; }
        .tiptap-editor-content a { color: var(--primary); cursor: pointer; text-decoration: underline; }
        .tiptap-editor-content p { margin-bottom: 0.75rem; }
      `}</style>
    </div>
  )
}

export default TiptapEditor;
