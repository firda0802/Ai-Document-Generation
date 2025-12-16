import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  action: () => void;
  description: string;
}

interface UseKeyboardShortcutsOptions {
  onSave?: () => void;
  onNew?: () => void;
  enabled?: boolean;
}

export const useKeyboardShortcuts = ({
  onSave,
  onNew,
  enabled = true,
}: UseKeyboardShortcutsOptions = {}) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!enabled) return;

    const shortcuts: KeyboardShortcut[] = [
      // Save shortcut
      ...(onSave
        ? [{
            key: 's',
            ctrlKey: true,
            action: onSave,
            description: 'Save document',
          }]
        : []),
      // New document shortcut
      ...(onNew
        ? [{
            key: 'n',
            ctrlKey: true,
            action: onNew,
            description: 'Create new document',
          }]
        : []),
      // Navigation shortcuts
      {
        key: '1',
        ctrlKey: true,
        action: () => navigate('/tools/document-creator'),
        description: 'Go to Document Creator',
      },
      {
        key: '2',
        ctrlKey: true,
        action: () => navigate('/tools/presentation-maker'),
        description: 'Go to Presentation Maker',
      },
      {
        key: '3',
        ctrlKey: true,
        action: () => navigate('/tools/spreadsheet'),
        description: 'Go to Spreadsheet',
      },
      {
        key: '4',
        ctrlKey: true,
        action: () => navigate('/tools/voiceover'),
        description: 'Go to Voiceover',
      },
      {
        key: '5',
        ctrlKey: true,
        action: () => navigate('/tools/chat'),
        description: 'Go to Chat',
      },
      {
        key: 'h',
        ctrlKey: true,
        action: () => navigate('/'),
        description: 'Go to Home',
      },
      {
        key: 'd',
        ctrlKey: true,
        action: () => navigate('/dashboard'),
        description: 'Go to Dashboard',
      },
    ];

    const handleKeyDown = (event: KeyboardEvent) => {
      const shortcut = shortcuts.find(
        (s) =>
          s.key === event.key.toLowerCase() &&
          !!s.ctrlKey === (event.ctrlKey || event.metaKey) &&
          !!s.shiftKey === event.shiftKey &&
          !!s.altKey === event.altKey
      );

      if (shortcut) {
        event.preventDefault();
        shortcut.action();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate, onSave, onNew, enabled]);

  return null;
};
