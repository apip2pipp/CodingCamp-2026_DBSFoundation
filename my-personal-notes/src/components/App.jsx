import React from 'react';
import { getInitialData } from '../utils';
import NoteInput from './NoteInput';
import NotesList from './NotesList';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // simpan data catatan dari util getInitialData supaya daftar awal langsung tampil.
      notes: getInitialData(),

      // state untuk kata kunci pencarian.
      searchKeyword: ''
    };

    this.onAddNoteHandler = this.onAddNoteHandler.bind(this);
    this.onDeleteHandler = this.onDeleteHandler.bind(this);
    this.onArchiveHandler = this.onArchiveHandler.bind(this);
    this.onSearchHandler = this.onSearchHandler.bind(this);
  }

  onAddNoteHandler({ title, body }) {
    const newNote = {
      id: +new Date(),
      title,
      body,
      createdAt: new Date().toISOString(),
      archived: false
    };

    this.setState((prev) => ({
      notes: [newNote, ...prev.notes]
    }));
  }

  onDeleteHandler(id) {
    this.setState((prev) => ({
      notes: prev.notes.filter((note) => note.id !== id)
    }));
  }

  onArchiveHandler(id) {
    this.setState((prev) => ({
      notes: prev.notes.map((note) =>
        note.id === id ? { ...note, archived: !note.archived } : note
      )
    }));
  }

  onSearchHandler(keyword) {
    this.setState({ searchKeyword: keyword });
  }

  render() {
    const { notes, searchKeyword } = this.state;

    const filteredNotes = Array.isArray(notes)
      ? notes.filter((note) => {
          if (!searchKeyword) return true;
          const kw = searchKeyword.toLowerCase();
          return (
            note.title.toLowerCase().includes(kw) ||
            note.body.toLowerCase().includes(kw)
          );
        })
      : [];

    const sortByDateDesc = (a, b) =>
      new Date(b.createdAt) - new Date(a.createdAt);

    const activeNotes = filteredNotes
      .filter((n) => !n.archived)
      .sort(sortByDateDesc);

    const archivedNotes = filteredNotes
      .filter((n) => n.archived)
      .sort(sortByDateDesc);

    return (
      <div className="note-app" data-testid="note-app">
        <div className="note-app__header" data-testid="note-app-header">
          <h1>Notes</h1>
        </div>
        <div className="note-app__body" data-testid="note-app-body">
          <NoteInput addNote={this.onAddNoteHandler} />

          <div data-testid="note-search" className="note-search">
            <input
              data-testid="note-search-input"
              type="text"
              placeholder="Cari catatan..."
              value={this.state.searchKeyword}
              onChange={(e) => this.onSearchHandler(e.target.value)}
            />
          </div>
          <section
            aria-labelledby="active-notes-title"
            data-testid="active-notes-section"
          >
            <h2 id="active-notes-title">Catatan Aktif</h2>
            <NotesList
              notes={activeNotes}
              onDelete={this.onDeleteHandler}
              onArchive={this.onArchiveHandler}
              dataTestId="active-notes-list"
              searchKeyword={this.state.searchKeyword}
            />
          </section>
          <section
            aria-labelledby="archived-notes-title"
            data-testid="archived-notes-section"
          >
            <h2 id="archived-notes-title">Arsip</h2>
            <NotesList
              notes={archivedNotes}
              onDelete={this.onDeleteHandler}
              onArchive={this.onArchiveHandler}
              dataTestId="archived-notes-list"
              searchKeyword={this.state.searchKeyword}
            />
          </section>
        </div>
      </div>
    );
  }
}

export default App;
