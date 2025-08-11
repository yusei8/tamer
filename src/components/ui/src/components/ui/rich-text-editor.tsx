import React, { useState, useRef, useEffect } from 'react';
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, List, ListOrdered, Undo, Redo, Type } from 'lucide-react';
import { Button } from './button';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  minHeight?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Tapez votre texte ici...",
  className = "",
  minHeight = "120px"
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isEditorFocused, setIsEditorFocused] = useState(false);

  // Initialiser le contenu de l'éditeur
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || '';
    }
  }, [value]);

  // Fonction pour exécuter une commande de formatage
  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
    editorRef.current?.focus();
  };

  // Fonction pour gérer les changements de contenu
  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  // Fonction pour gérer le collage de texte
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
    handleInput();
  };

  // Boutons de la barre d'outils
  const toolbarButtons = [
    {
      icon: <Bold className="w-4 h-4" />,
      command: 'bold',
      title: 'Gras (Ctrl+B)',
      shortcut: 'Ctrl+B'
    },
    {
      icon: <Italic className="w-4 h-4" />,
      command: 'italic',
      title: 'Italique (Ctrl+I)',
      shortcut: 'Ctrl+I'
    },
    {
      icon: <Underline className="w-4 h-4" />,
      command: 'underline',
      title: 'Souligné (Ctrl+U)',
      shortcut: 'Ctrl+U'
    },
    { type: 'separator' },
    {
      icon: <AlignLeft className="w-4 h-4" />,
      command: 'justifyLeft',
      title: 'Aligner à gauche'
    },
    {
      icon: <AlignCenter className="w-4 h-4" />,
      command: 'justifyCenter',
      title: 'Centrer'
    },
    {
      icon: <AlignRight className="w-4 h-4" />,
      command: 'justifyRight',
      title: 'Aligner à droite'
    },
    { type: 'separator' },
    {
      icon: <List className="w-4 h-4" />,
      command: 'insertUnorderedList',
      title: 'Liste à puces'
    },
    {
      icon: <ListOrdered className="w-4 h-4" />,
      command: 'insertOrderedList',
      title: 'Liste numérotée'
    },
    { type: 'separator' },
    {
      icon: <Undo className="w-4 h-4" />,
      command: 'undo',
      title: 'Annuler (Ctrl+Z)'
    },
    {
      icon: <Redo className="w-4 h-4" />,
      command: 'redo',
      title: 'Rétablir (Ctrl+Y)'
    }
  ];

  // Gestion des raccourcis clavier
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault();
          execCommand('bold');
          break;
        case 'i':
          e.preventDefault();
          execCommand('italic');
          break;
        case 'u':
          e.preventDefault();
          execCommand('underline');
          break;
        case 'z':
          e.preventDefault();
          execCommand('undo');
          break;
        case 'y':
          e.preventDefault();
          execCommand('redo');
          break;
      }
    }
  };

  return (
    <div className={`border-2 rounded-lg overflow-hidden transition-colors ${
      isEditorFocused ? 'border-emerald-300 ring-2 ring-emerald-100' : 'border-gray-200'
    } ${className}`}>
      {/* Barre d'outils */}
      <div className="bg-gray-50 border-b border-gray-200 p-2 flex items-center space-x-1">
        {/* Sélecteur de taille de police */}
        <select
          className="text-sm border border-gray-300 rounded px-2 py-1 bg-white"
          onChange={(e) => execCommand('fontSize', e.target.value)}
          defaultValue="3"
        >
          <option value="1">Très petit</option>
          <option value="2">Petit</option>
          <option value="3">Normal</option>
          <option value="4">Grand</option>
          <option value="5">Très grand</option>
          <option value="6">Énorme</option>
        </select>

        <div className="w-px h-6 bg-gray-300 mx-2" />

        {/* Boutons de formatage */}
        {toolbarButtons.map((button, index) => {
          if (button.type === 'separator') {
            return <div key={index} className="w-px h-6 bg-gray-300 mx-1" />;
          }

          return (
            <Button
              key={index}
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-emerald-100"
              onClick={() => execCommand(button.command)}
              title={button.title}
            >
              {button.icon}
            </Button>
          );
        })}

        <div className="w-px h-6 bg-gray-300 mx-2" />

        {/* Sélecteur de couleur de texte */}
        <input
          type="color"
          className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
          onChange={(e) => execCommand('foreColor', e.target.value)}
          title="Couleur du texte"
        />
      </div>

      {/* Zone d'édition */}
      <div
        ref={editorRef}
        contentEditable
        className="p-4 focus:outline-none"
        style={{ minHeight }}
        onInput={handleInput}
        onPaste={handlePaste}
        onFocus={() => setIsEditorFocused(true)}
        onBlur={() => setIsEditorFocused(false)}
        onKeyDown={handleKeyDown}
        data-placeholder={placeholder}
        suppressContentEditableWarning={true}
      />

      {/* Placeholder personnalisé */}
      <style jsx>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
};

