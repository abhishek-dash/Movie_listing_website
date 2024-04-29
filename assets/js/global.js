'use strict';

const addEventOnElements = (elements,eventType,callback) =>{
    for(const elem of elements) elem.addEventListener(eventType,callback);
}

const searchBox = document.querySelector('[search-box]')
const searchTogglers = document.querySelectorAll('[search-toggler]')

addEventOnElements(searchTogglers,'click',() => {
    searchBox.classList.toggle('active')
})


/**
 * store movieId in `localStorage` when you click any movie-card
 */
const getMovieDetail = (movieId) => {
    window.localStorage.setItem("movieId", String(movieId));
}