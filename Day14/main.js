window.onload = fetchBooks;
const bookList = getNodeByID("book-list");
function renderBook(book) {
  const row = `<tr id="${book.id}">
                 <td>${book.title}</td>
                 <td>${book.description}</td>
                 <td>${book.price}</td>
                 <td>
                   <button class="btn btn-warning" onclick='editBook(${JSON.stringify(
                     book
                   )})''>Edit</button>
                   <button class="btn btn-danger" onclick='deleteBook("${
                     book.id
                   }")''>Delete</button>
                 </td>
               </tr>`;

  bookList.innerHTML += row;
}

function renderBooks(books) {
  for (const book of books) {
    renderBook(book);
  }
}

function rerenderForEdit(book) {
  let editedRow = document.getElementById(book.id);
  document.getElementById(book.id).childNodes.forEach((x) => x.remove());
  editedRow.innerHTML = `<td>${book.title}</td>
                 <td>${book.description}</td>
                 <td>${book.price}</td>
                 <td>
                   <button class="btn btn-warning" onclick='editBook(${JSON.stringify(
                     book
                   )})''>Edit</button>
                   <button class="btn btn-danger" onclick='deleteBook("${
                     book.id
                   }")''>Delete</button>
                 </td>`;
}

function fetchBooks() {
  fetch("http://localhost:5000/books")
    .then((response) => response.json())
    .then((data) => {
      bookList.innerHTML = "";
      data.forEach((book) => {
        renderBook(book);
      });
    })
    .catch((error) => console.error(error));
}

getNodeByID("addBook").addEventListener("submit", async (event) => {
  event.preventDefault();

  const form = getNodeByID("book-form");
  const titleInput = getNodeByID("title");
  const descriptionInput = getNodeByID("description");
  const priceInput = getNodeByID("price");

  const title = titleInput.value;
  const description = descriptionInput.value;
  const price = priceInput.value;

  const book = { title, description, price };

  try {
    const response = await fetch("http://localhost:5000/books", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(book),
    });

    if (response.ok) {
      const data = await response.json();
      renderBooks([data]);
      getNodeByID("reset").click();
    } else {
      console.error("Error:", response.status, response.statusText);
    }
  } catch (error) {
    console.error("Error:", error);
  }
});

async function editBook(book) {
  const newTitle = prompt("Enter the new title", book.title);
  const newDescription = prompt(
    "Enter the new description",
    book.description
  );
  const newPrice = prompt("Enter the new price", book.price);

  const updatedBook = {
    ...book,
    title: newTitle,
    description: newDescription,
    price: newPrice,
  };

  try {
    const response = await fetch(
      `http://localhost:5000/books/${book.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedBook),
      }
    );

    if (response.ok) {
      const data = await response.json();
      rerenderForEdit(data);
    } else {
      console.error("Error:", response.status, response.statusText);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

function deleteBook(bookId) {
  fetch(`http://localhost:5000/books/${bookId}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (response.ok) {
        const row = document.getElementById(bookId);
        row.remove();
      } else {
        console.error(
          "Error deleting book:",
          response.status,
          response.statusText
        );
      }
    })
    .catch((error) => {
      console.error("Error deleting book:", error);
    });
}

function getNodeByID(id) {
  return document.getElementById(id);
}