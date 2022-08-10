const bookshelf = [];
const RENDER_EVENT = 'render-bookslef';

function generateId() {
    return +new Date();
}

function generateBookObject(id, title, author, year, isComplete) {
    return {
        id,
        title,
        author,
        year,
        isComplete,
    }
}

function addBook() {
    const generateBookId = generateId();
    const bookTitleValue = document.getElementById('inputBookTitle').value;
    const bookAuthorValue = document.getElementById('inputBookAuthor').value;
    const bookYearValue = document.getElementById('inputBookYear').value;
    const isChecked = document.getElementById('inputBookIsComplete').checked;
    const bookObject = generateBookObject(generateBookId, bookTitleValue, bookAuthorValue, bookYearValue, isChecked);
    bookshelf.push(bookObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function findBook(bookId) {
    for (const bookshelfItem of bookshelf) {
        if (bookshelfItem.id == bookId) {
            return bookshelfItem;
        }
    }
    return bookshelfItem
}

function findBookIndex(bookId) {
    for (const index in bookshelf) {
        if (bookshelf[index].id === bookId) {
            return index;
        }
    }
    return -1;
}

function addBookToComplete(bookId) {
    const targetBook = findBook(bookId);

    if (targetBook == null) return;

    targetBook.isComplete = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
    swal({
        title: 'Buku ' + targetBook.title + ' berhasil dipindahkan ke tempat selesai dibaca',
        icon: "success",
    });
    //showAlert('Buku ' + targetBook.title + ' berhasil dipindahkan ke tempat selesai dibaca');
}

function returnBookToUnfinished(bookId) {
    const targetBook = findBook(bookId);

    if (targetBook == null) return;

    targetBook.isComplete = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
    swal({
        title: 'Buku ' + targetBook.title + ' berhasil dikembalikan ke tempat belum dibaca',
        icon: "success",
    });
    //showAlert('Buku ' + targetBook.title + ' berhasil dikembalikan ke tempat belum dibaca');
}

function removeBook(bookId) {
    const targetBook = findBookIndex(bookId)
    const book = findBook(bookId);

    if (targetBook === -1) return;

    bookshelf.splice(targetBook, 1);
    //showAlert('Buku ' + book.title + ' berhasil dihapus');
    swal({
        title: "Buku " + book.title + " berhasil dihapus",
        icon: "success",
    });
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function createBookshelf(bookObject) {
    const bookTitle = document.createElement('h3');
    bookTitle.innerText = bookObject.title;

    const bookAuthor = document.createElement('p');
    bookAuthor.innerText = 'Penulis: ' + bookObject.author;

    const bookYear = document.createElement('p');
    bookYear.innerText = 'Tahun: ' + bookObject.year;

    const removeBookButton = document.createElement('button');
    removeBookButton.classList.add('red');
    removeBookButton.innerText = 'Hapus buku'

    removeBookButton.addEventListener('click', function () {
        removeBook(bookObject.id);
    });

    const actionBar = document.createElement('div');
    actionBar.classList.add('action');

    const itemContainer = document.createElement('article')
    itemContainer.classList.add('book_item');
    itemContainer.setAttribute('id', `book-name-${bookObject.title}`)
    itemContainer.append(bookTitle, bookAuthor, bookYear, actionBar);

    if (!bookObject.isComplete) {
        const finishButton = document.createElement('button');
        finishButton.classList.add('green');
        finishButton.innerText = 'Selesai dibaca';

        finishButton.addEventListener('click', function () {
            addBookToComplete(bookObject.id);
        });

        actionBar.append(finishButton, removeBookButton);
    } else {
        const unfinishedButton = document.createElement('button');
        unfinishedButton.classList.add('green');
        unfinishedButton.innerText = 'Belum selesai di Baca';

        unfinishedButton.addEventListener('click', function () {
            returnBookToUnfinished(bookObject.id);
        });

        actionBar.append(unfinishedButton, removeBookButton);
    }

    return itemContainer;
}

function searchBook(bookTitle) {
    const findTitle = document.querySelectorAll('.book_item > h3')
    for (let item of findTitle) {
        const title = item.innerText.toUpperCase();
        if (title.includes(bookTitle)) {
            console.log('tes')
            item.parentElement.style.display = 'block';
        } else {
            item.parentElement.style.display = 'none';
        }
    }
}

const STORAGE_KEY = 'BOOKSHELF_DATA';
const SAVED_EVENT = 'saved-book';

function isStorageExist() {
    if (typeof (Storage) === undefined) {
        alert('Browser tidak mendukung local storage');
        return false;
    }
    return true;
}

function saveData() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(bookshelf);
        localStorage.setItem(STORAGE_KEY, parsed);
    }
}

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);

    if (data !== null) {
        for (const book of data) {
            bookshelf.push(book);
        }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
}

// function showAlert(textAlert) {
//     const displayAlert = document.querySelector('#alert > p');
//     displayAlert.innerText = textAlert;
//     customAlert.style.display = 'block'
//     customAlert.classList.remove('hidden')
//     customAlert.classList.add('show-alert');
//     setTimeout(function () {
//         customAlert.classList.remove('show-alert');
//     }, 3000);
// }

document.addEventListener('DOMContentLoaded', function () {
    const submitForm = document.getElementById('inputBook');
    const searchForm = document.getElementById('searchBook')

    if (isStorageExist()) {
        loadDataFromStorage();
    }

    submitForm.addEventListener('submit', function (event) {
        event.preventDefault();
        addBook();
        swal({
            title: "Buku berhasil ditambahkan",
            icon: "success",
        });
        //showAlert('Buku baru berhasil ditambah');
    });

    searchForm.addEventListener('submit', function (event) {
        const searchValue = document.getElementById('searchBookTitle').value.toUpperCase();
        event.preventDefault();
        searchBook(searchValue);
    });
});

// const customAlert = document.getElementById("alert");
// const sticky = customAlert.offsetTop;

// window.addEventListener('scroll', function () {
//     if (window.pageYOffset >= sticky) {
//         customAlert.classList.add("sticky")
//         customAlert.classList.add('hidden');
//     } else {
//         customAlert.classList.remove("sticky");
//     }
// });

const submitButtonText = document.querySelector('#bookSubmit > span');
const checkbox = document.getElementById('inputBookIsComplete');

checkbox.addEventListener('change', function () {
    if (this.checked) {
        submitButtonText.innerText = 'Selesai dibaca'
    } else {
        submitButtonText.innerText = 'Belum selesai dibaca'
    }
});

document.addEventListener(RENDER_EVENT, function () {
    const incompleteBookshelfList = document.getElementById('incompleteBookshelfList');
    incompleteBookshelfList.innerHTML = '';

    const completeBookshelfList = document.getElementById('completeBookshelfList');
    completeBookshelfList.innerHTML = '';

    for (const item of bookshelf) {
        const todoElement = createBookshelf(item);
        if (!item.isComplete) {
            incompleteBookshelfList.append(todoElement);
        } else {
            completeBookshelfList.append(todoElement);
        }
    }
});