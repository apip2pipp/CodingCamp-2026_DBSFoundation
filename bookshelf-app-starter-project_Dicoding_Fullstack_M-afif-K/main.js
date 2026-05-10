// ==========================================
// BOOKSHELF APP - Main JavaScript
// ==========================================

// Data buku disimpan dalam array
let books = [];

// Kunci untuk localStorage
const STORAGE_KEY = 'bookshelf_books';

// ==========================================
// 1. FUNGSI UNTUK LOAD DATA DARI LOCALSTORAGE
// ==========================================
function loadBooksFromStorage() {
  const storedBooks = localStorage.getItem(STORAGE_KEY);
  if (storedBooks) {
    books = JSON.parse(storedBooks);
  }
}

// ==========================================
// 2. FUNGSI UNTUK SIMPAN DATA KE LOCALSTORAGE
// ==========================================
function saveBooksToStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
}

// ==========================================
// 3. FUNGSI UNTUK GENERATE ID UNIK
// ==========================================
function generateId() {
  return Date.now().toString();
}

// ==========================================
// 4. FUNGSI UNTUK TAMBAH BUKU BARU
// ==========================================
function addBook(title, author, year, isComplete) {
  const newBook = {
    id: generateId(),
    title: title,
    author: author,
    year: year,
    isComplete: isComplete
  };
  books.push(newBook);
  saveBooksToStorage();
}

// ==========================================
// 5. FUNGSI UNTUK HAPUS BUKU
// ==========================================
function deleteBook(bookId) {
  books = books.filter(book => book.id !== bookId);
  saveBooksToStorage();
}

// ==========================================
// 6. FUNGSI UNTUK UBAH STATUS BUKU
// ==========================================
function toggleBookComplete(bookId) {
  const book = books.find(book => book.id === bookId);
  if (book) {
    book.isComplete = !book.isComplete;
    saveBooksToStorage();
  }
}

// ==========================================
// 7. FUNGSI UNTUK CARI BUKU BERDASARKAN JUDUL
// ==========================================
function searchBooks(query) {
  return books.filter(book =>
    book.title.toLowerCase().includes(query.toLowerCase())
  );
}

// ==========================================
// 8. FUNGSI UNTUK CREATE ELEMENT BUKU
// ==========================================
function createBookElement(book) {
  const bookDiv = document.createElement('div');
  bookDiv.setAttribute('data-bookid', book.id);
  bookDiv.setAttribute('data-testid', 'bookItem');

  const title = document.createElement('h3');
  title.setAttribute('data-testid', 'bookItemTitle');
  title.textContent = book.title;

  const author = document.createElement('p');
  author.setAttribute('data-testid', 'bookItemAuthor');
  author.textContent = `Penulis: ${book.author}`;

  const year = document.createElement('p');
  year.setAttribute('data-testid', 'bookItemYear');
  year.textContent = `Tahun: ${book.year}`;

  const buttonContainer = document.createElement('div');

  const completeButton = document.createElement('button');
  completeButton.setAttribute('data-testid', 'bookItemIsCompleteButton');
  completeButton.textContent = book.isComplete ? 'Belum selesai dibaca' : 'Selesai dibaca';
  completeButton.addEventListener('click', () => {
    toggleBookComplete(book.id);
    renderBooks();
  });

  const deleteButton = document.createElement('button');
  deleteButton.setAttribute('data-testid', 'bookItemDeleteButton');
  deleteButton.textContent = 'Hapus Buku';
  deleteButton.addEventListener('click', () => {
    deleteBook(book.id);
    renderBooks();
  });

  const editButton = document.createElement('button');
  editButton.setAttribute('data-testid', 'bookItemEditButton');
  editButton.textContent = 'Edit Buku';
  editButton.addEventListener('click', () => {
    editBook(book.id);
  });

  buttonContainer.appendChild(completeButton);
  buttonContainer.appendChild(deleteButton);
  buttonContainer.appendChild(editButton);

  bookDiv.appendChild(title);
  bookDiv.appendChild(author);
  bookDiv.appendChild(year);
  bookDiv.appendChild(buttonContainer);

  return bookDiv;
}

// ==========================================
// 9. FUNGSI UNTUK RENDER SEMUA BUKU
// ==========================================
function renderBooks(booksToRender = books) {
  const incompleteList = document.getElementById('incompleteBookList');
  const completeList = document.getElementById('completeBookList');

  // Hapus child yang ada sebelumnya
  incompleteList.innerHTML = '';
  completeList.innerHTML = '';

  // Filter dan tampilkan buku
  const incompleteBooks = booksToRender.filter(book => !book.isComplete);
  const completeBooks = booksToRender.filter(book => book.isComplete);

  // Tambahkan buku belum selesai
  incompleteBooks.forEach(book => {
    incompleteList.appendChild(createBookElement(book));
  });

  // Tambahkan buku selesai
  completeBooks.forEach(book => {
    completeList.appendChild(createBookElement(book));
  });

  // Tampilkan pesan jika tidak ada buku
  if (incompleteBooks.length === 0) {
    const emptyMsg = document.createElement('p');
    emptyMsg.textContent = 'Tidak ada buku di kategori ini';
    incompleteList.appendChild(emptyMsg);
  }

  if (completeBooks.length === 0) {
    const emptyMsg = document.createElement('p');
    emptyMsg.textContent = 'Tidak ada buku di kategori ini';
    completeList.appendChild(emptyMsg);
  }
}

// ==========================================
// 10. FUNGSI UNTUK EDIT BUKU
// ==========================================
function editBook(bookId) {
  const book = books.find(book => book.id === bookId);
  if (!book) return;

  const newTitle = prompt('Masukkan judul baru:', book.title);
  if (newTitle === null) return;

  const newAuthor = prompt('Masukkan penulis baru:', book.author);
  if (newAuthor === null) return;

  const newYear = prompt('Masukkan tahun baru:', book.year);
  if (newYear === null) return;

  book.title = newTitle;
  book.author = newAuthor;
  book.year = parseInt(newYear);

  saveBooksToStorage();
  renderBooks();
}

// ==========================================
// 11. EVENT LISTENER - FORM TAMBAH BUKU
// ==========================================
const bookForm = document.getElementById('bookForm');
bookForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const titleInput = document.getElementById('bookFormTitle');
  const authorInput = document.getElementById('bookFormAuthor');
  const yearInput = document.getElementById('bookFormYear');
  const isCompleteCheckbox = document.getElementById('bookFormIsComplete');

  const title = titleInput.value;
  const author = authorInput.value;
  const year = parseInt(yearInput.value);
  const isComplete = isCompleteCheckbox.checked;

  addBook(title, author, year, isComplete);
  renderBooks();

  // Reset form
  bookForm.reset();
});

// ==========================================
// 12. EVENT LISTENER - FORM CARI BUKU
// ==========================================
const searchForm = document.getElementById('searchBook');
searchForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const searchInput = document.getElementById('searchBookTitle');
  const query = searchInput.value;

  if (query.trim() === '') {
    renderBooks();
  } else {
    const searchResults = searchBooks(query);
    renderBooks(searchResults);
  }
});

// ==========================================
// 13. JALANKAN APLIKASI
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  loadBooksFromStorage();
  renderBooks();
});
