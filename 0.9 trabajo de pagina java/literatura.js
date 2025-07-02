function loadLiterature() {
    const literature = JSON.parse(localStorage.getItem('literature')) || [];
    literatureList.innerHTML = '';
    document.getElementById("registro de libros").addEventListener("submit", (event) => {
        event.preventDefault();
        const newLiterature = {
            title: "El señor de los anillos",
            author: "J.R.R. Tolkien",
            genre: "Fantasía",
            year: 1984
        };
        literature.push(newLiterature);
        localStorage.setItem('literature', JSON.stringify(literature));
        loadLiterature();
        document.getElementById("registro de libros").reset();
        let tipodelibro = document.getElementById("tipo de libro");
        let author= document.getElementById("autor");
        let nombredellibro= document.getElementById("titulo");
        let añodepublicacion= document.getElementById("año de publicación");
        let generodelibro=document.getElementById
    });
}
const literatureForm = document.getElementById('literature-form');
const literatureList = document.getElementById('literature-list');
const titleInput = document.getElementById('title');
const authorInput = document.getElementById('author');
const genreInput = document.getElementById('genre');
const yearInput = document.getElementById('year');
const tipoDeLibro = document.getElementById("tipo de libro");
const autor = document.getElementById("autor");
const nombreDelLibro = document.getElementById("titulo");
const añoDePublicacion = document.getElementById("año de publicación");
const generoDelLibro = document.getElementById("género");
