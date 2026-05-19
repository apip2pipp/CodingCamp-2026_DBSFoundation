import React from 'react';
import NoteItem from './NoteItem';

function NotesList({ notes, onDelete, onArchive, dataTestId = 'notes-list', searchKeyword = '' }) {
  // validasi notes agar tidak kosong.
  const hasNotes = Array.isArray(notes) && notes.length > 0;

  if (!hasNotes) {
    return (
      <div className="notes-list" data-testid={dataTestId}>
        {/* TODO [Basic] tampilkan pesan kosong yang informatif ketika tidak ada catatan. */}
        <p
          className="notes-list__empty-message"
          data-testid={`${dataTestId}-empty`}
        ></p>
      </div>
    );
  }

  // kelompokkan per bulan-tahun (YYYY-MM)
  const grouped = notes.reduce((acc, note) => {
    const d = new Date(note.createdAt);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(note);
    return acc;
  }, {});

  const formatGroupHeader = (key) => {
    const [year, month] = key.split('-');
    const dt = new Date(Number(year), Number(month) - 1);
    return dt.toLocaleString('id-ID', { month: 'long', year: 'numeric' });
  };

  return (
    <div className="notes-list" data-testid={dataTestId}>
      {Object.entries(grouped).map(([groupKey, items]) => (
        <section key={groupKey} data-testid={`${groupKey}-group`} className="notes-group">
          <h3>{formatGroupHeader(groupKey)}</h3>
          <span data-testid={`${groupKey}-group-count`}>{items.length} catatan</span>
          {items.map((note) => (
            <NoteItem
              key={note.id}
              note={note}
              onDelete={onDelete}
              onArchive={onArchive}
              searchKeyword={searchKeyword}
            />
          ))}
        </section>
      ))}
    </div>
  );
}

export default NotesList;
