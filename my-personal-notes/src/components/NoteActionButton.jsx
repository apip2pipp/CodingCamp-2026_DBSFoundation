import React from 'react';

function NoteActionButton({ variant = 'default', onClick, children }) {
  const dataTestId =
    variant === 'delete' ? 'note-item-delete-button' : 'note-item-archive-button';

  return (
    <button
      type="button"
      className={`note-action-button note-action-button--${variant}`}
      onClick={onClick}
      data-testid={dataTestId}
    >
      {children}
    </button>
  );
}

export default NoteActionButton;
