// Book class
class Book{
    constructor(title,author,isbn){
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

class UI{
    addBookToList(book){
        const list = document.getElementById('table-body');

        // Create tr element
        const row = document.createElement('tr');
             
        // Insert columns
        row.innerHTML =`
         <td>${book.title}</td>
         <td>${book.author}</td>
         <td>${book.isbn}</td>
         <td><a href="#" class="delete">X</a></td>
        `;
        
        list.appendChild(row);
    }

    showAlert(message,className){
       // create div element
       const div = document.createElement('div');
       // Add classname
       div.className = `alert ${className}`;
       // Add text
       div.appendChild(document.createTextNode(message));
       // Get parent
       const container = document.querySelector('.container');
       const form = document.querySelector('#form');
 
       // Insert alert
       container.insertBefore(div, form);

        // Timeout after 3 seconds
        setTimeout(function(){
        document.querySelector('.alert').remove();
        },3000);
    }

    deleteBook(target){
        if(target.className === 'delete'){
            target.parentElement.parentElement.remove();
        }
    }

    clearFields(){
        document.getElementById('title').value ='';
        document.getElementById('author').value ='';
        document.getElementById('isbn').value ='';
    } 
}

// Local Storage class
class Store{
    static getBooks() {
      let books;
      if(localStorage.getItem('books') === null){
        books = [];
      }else{
          books = JSON.parse(localStorage.getItem('books'));
      }
      return books;
    }

    static displayBooks(){
      const books = Store.getBooks();
      books.forEach(function(book){
          
        const ui = new UI;
        // Add book to ui
        ui.addBookToList(book);

      });
    }

    static addBook(book){
      const books = Store.getBooks();
      books.push(book);
      localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBooks(isbn){
        const books = Store.getBooks();

        books.forEach(function(book, index){
          if(book.isbn === isbn){
              books.splice(index , 1);
          }
        });
        localStorage.setItem('books', JSON.stringify(books));
    }
}
// DOM load event
document.addEventListener('DOMContentLoaded',Store.displayBooks)

//  Event Listener for adding book
document.getElementById('form').addEventListener('submit',
function(e){
    // Get Form Values
    const title = document.getElementById('title').value,
          author = document.getElementById('author').value,
          isbn = document.getElementById('isbn').value ;
    
    // Instantiate book   
    const book = new Book(title,author,isbn);

    // Instantiate UI
    const ui = new UI();

    // Validation
    if(title ==='' || author ==='' || isbn ===''){
       // Error alert
       ui.showAlert('Please fill all the fields','error');  
    }else{
       // Add book to list
       ui.addBookToList(book);

      // Add to Local Storage 
      Store.addBook(book);   

      //Show books added 
       ui.showAlert('Book Added ','success');

       // clear fields
       ui.clearFields();   
    }
    e.preventDefault();
});

//  EventListener for delete
document.getElementById('table-body').addEventListener('click',function(e){

    // Instantiate UI
    const ui = new UI();
  
    // Delete book
    ui.deleteBook(e.target);

    // Remove from local storage
    Store.removeBooks(e.target.parentElement.previousElementSibling.textContent);
  
    // Show message
    ui.showAlert('Book Removed!','success');
  
    e.preventDefault();
  });