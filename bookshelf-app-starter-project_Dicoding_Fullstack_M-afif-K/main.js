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
  try {
    const storedBooks = localStorage.getItem(STORAGE_KEY);
    books = storedBooks ? JSON.parse(storedBooks) : [];
    console.log('Books loaded from localStorage:', books);
  } catch (err) {
    console.error('Gagal parse localStorage, reset data:', err);
    books = [];
    saveBooksToStorage();
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
    title: title.trim(),
    author: author.trim(),
    year: year,
    isComplete: isComplete
  };
  books.push(newBook);
  saveBooksToStorage();
  console.log('Buku ditambahkan:', newBook);
  console.log('Total books sekarang:', books.length);
}

// ==========================================
// 5. FUNGSI UNTUK HAPUS BUKU
// ==========================================
function deleteBook(bookId) {
  try {
    const beforeCount = books.length;
    books = books.filter(book => book.id !== bookId);
    saveBooksToStorage();
    console.log(`Buku dengan ID ${bookId} dihapus. Sebelum: ${beforeCount}, Sesudah: ${books.length}`);
  } catch (err) {
    console.error('Gagal hapus buku:', err);
  }
}

// ==========================================
// 6. FUNGSI UNTUK UBAH STATUS BUKU
// ==========================================
function toggleBookComplete(bookId) {
  try {
    const book = books.find(book => book.id === bookId);
    if (book) {
      book.isComplete = !book.isComplete;
      saveBooksToStorage();
      console.log(`Status buku ID ${bookId} diubah menjadi isComplete: ${book.isComplete}`);
    }
  } catch (err) {
    console.error('Gagal ubah status buku:', err);
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

  // tambahkan class agar styling dari index.html diterapkan juga ke elemen dinamis
  bookDiv.setAttribute('class', 'book-item');

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
  // tambahkan class untuk konsistensi styling tombol
  buttonContainer.setAttribute('class', 'book-actions');

  const completeButton = document.createElement('button');
  completeButton.setAttribute('data-testid', 'bookItemIsCompleteButton');
  completeButton.textContent = book.isComplete ? 'Belum selesai dibaca' : 'Selesai dibaca';
  completeButton.addEventListener('click', () => {
    toggleBookComplete(book.id);
    // jika ada kata di kolom pencarian, lakukan render ulang berdasarkan filter saat ini
    const searchInput = document.getElementById('searchBookTitle');
    if (searchInput && searchInput.value.trim() !== '') {
      const results = searchBooks(searchInput.value);
      renderBooks(results);
    } else {
      renderBooks();
    }
  });

  const deleteButton = document.createElement('button');
  deleteButton.setAttribute('data-testid', 'bookItemDeleteButton');
  deleteButton.textContent = 'Hapus Buku';
  deleteButton.addEventListener('click', () => {
    deleteBook(book.id);
    // jika sedang dalam mode pencarian, pertahankan hasil pencarian setelah hapus
    const searchInput = document.getElementById('searchBookTitle');
    if (searchInput && searchInput.value.trim() !== '') {
      const results = searchBooks(searchInput.value);
      renderBooks(results);
    } else {
      renderBooks();
    }
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
  try {
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

    console.log('Render selesai:', { incomplete: incompleteBooks.length, complete: completeBooks.length });
  } catch (err) {
    console.error('Render gagal:', err);
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

  const parsedYear = parseInt(newYear, 10);
  if (Number.isNaN(parsedYear)) {
    alert('Tahun harus berupa angka.');
    return;
  }

  book.title = newTitle.trim();
  book.author = newAuthor.trim();
  book.year = parsedYear;

  saveBooksToStorage();
  renderBooks();
}

function updateSubmitButtonText() {
  const submitButton = document.getElementById('bookFormSubmit');
  const checkbox = document.getElementById('bookFormIsComplete');

  if (!submitButton || !checkbox) return;

  const rak = checkbox.checked ? 'Selesai dibaca' : 'Belum selesai dibaca';
  submitButton.textContent = `Masukkan Buku ke rak ${rak}`;
}

// ==========================================
// 11. EVENT LISTENER - FORM TAMBAH BUKU
// ==========================================
const bookForm = document.getElementById('bookForm');
const isCompleteCheckbox = document.getElementById('bookFormIsComplete');

updateSubmitButtonText();

isCompleteCheckbox.addEventListener('change', updateSubmitButtonText);

bookForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const titleInput = document.getElementById('bookFormTitle');
  const authorInput = document.getElementById('bookFormAuthor');
  const yearInput = document.getElementById('bookFormYear');

  const title = titleInput.value;
  const author = authorInput.value;
  const year = parseInt(yearInput.value, 10);
  const isComplete = isCompleteCheckbox.checked;

  addBook(title, author, year, isComplete);
  renderBooks();

  // Reset form
  bookForm.reset();
  updateSubmitButtonText();
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
  updateSubmitButtonText();
});
