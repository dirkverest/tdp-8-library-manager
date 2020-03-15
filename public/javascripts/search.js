
let books;
let searchInput = "";


(() => {
    document.querySelector(".searchinput").addEventListener("input", (event) => {
        searchInput = event.target.value;
        console.log(searchInput);
    })
})()

module.exports = {books, searchInput};