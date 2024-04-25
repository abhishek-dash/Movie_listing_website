'use strict';

import { sidebar } from "./sidebar.js";
import { api_key,imageBaseUrl,fetchDataFromServer } from "./api.js";
import {createMovieCard} from "./movie-card.js";

const pageContent = document.querySelector("[page-content]");

sidebar();


/**
 * Home page section (Top rated, Upcoming, Trending movies)
 */

const homePageSection = [
    {
        title : "Upcoming Movies",
        path : "/movie/upcoming"
    },
    {
        title : "Weekly Trending Movies",
        path : "/trending/movie/week"
    },
    {
        title : "Top Rated Movies",
        path : "/movie/top_rated"
    },
]

const genreList = {
    // create genre string from genre id eg: [23,42] --> "Action,Romance"
    asString(genreIdList){
        let newGenreList = [];

        for(const genreId of genreIdList) {
            this[genreId] && newGenreList.push(this[genreId]); // this == genreList
        }
        
        return newGenreList.join(", ")
    }
};

// fetch all genres e.g. :[{"id":"123","name","Action"}] then change genre format e.g. :{"123":"Action"}
fetchDataFromServer(`https://api.themoviedb.org/3/genre/movie/list?api_key=${api_key}`, function({ genres }) {

    for(const { id , name } of genres){
        genreList[id] = name
    }
    fetchDataFromServer(`https://api.themoviedb.org/3/movie/popular?api_key=${api_key}&language=en-US&page=1`,heroBanner);

});


const heroBanner = ({results:movieList}) =>{
    const banner = document.createElement("section");
    banner.ariaLabel = "Popular Movies";
    banner.classList.add("banner");

    banner.innerHTML = `
        <div class="banner-slider"></div>
        <div class="slider-control">
            <div class="control-inner"></div>
        </div>
    `;

    let controlItemIndex = 0;

    for (const [index,movie] of movieList.entries()) {
        const {
            backdrop_path,
            title,
            release_date,
            genre_ids,
            overview,
            poster_path,
            vote_average,
            id
        } = movie;

        const sliderItem = document.createElement('div');
        sliderItem.classList.add("slider-item");
        sliderItem.setAttribute("slider-item","");

        sliderItem.innerHTML = `
            <img
                src="${imageBaseUrl}w1280${backdrop_path}"
                class="img-cover"
                alt="${title}"
                loading=${index === 0 ? "eager":"lazy"}
            />
            <div class="banner-content">
                <h2 class="heading">${title}</h2>
                <div class="meta-list">
                    <div class="meta-item">${release_date.split("-")[0]}</div>
                    <div class="meta-item card-badge">${vote_average.toFixed(1)}</div>
                </div>
                <p class="genre">${genreList.asString(genre_ids)}</p>
                <p class="banner-text">${overview}</p>
                <a href="./detail.html" class="btn">
                    <img src="./assets/images/play_circle.png" width="24" height="24" aria-hidden="true" alt="play circle">
                    <span class="span">Watch Now</span>
                </a>
            </div>
        `;
        banner.querySelector(".banner-slider").appendChild(sliderItem);

        const controlItem = document.createElement("button");
        controlItem.classList.add("poster-box","slider-item");
        controlItem.setAttribute("slider-control",`${controlItemIndex}`);

        controlItemIndex++ ;
        controlItem.innerHTML = `
            <img src="${imageBaseUrl}w154${poster_path}" 
                loading="lazy" 
                draggable="false" 
                alt="Slide to ${title}"
                class="img-cover"
            >
        `;
        banner.querySelector(".control-inner").appendChild(controlItem)
    }

    pageContent.appendChild(banner);

    addHeroSlide();

    /**
     * fetch data for home page sections (top rated, upcoming, trending )
     */

    for(const {title, path} of homePageSection) {
        fetchDataFromServer(`http://api.themoviedb.org/3${path}?api_key=${api_key}&page=1`,createMovieList,title)
    }
    
}

// Hero slider functionality
const addHeroSlide = function() {
    const sliderItems = document.querySelectorAll("[slider-item]");
    const sliderControls = document.querySelectorAll("[slider-control]");

    let lastSliderItem = sliderItems[0];
    let lastSliderControl = sliderControls[0];

    lastSliderItem.classList.add("active");
    lastSliderControl.classList.add("active");

    const sliderStart = function (){
        lastSliderItem.classList.remove("active");
        lastSliderControl.classList.remove("active");

        // 'this' == slider-control
        sliderItems[Number(this.getAttribute("slider-control"))].classList.add("active");
        this.classList.add("active");

        lastSliderItem = sliderItems[Number(this.getAttribute("slider-control"))];
        lastSliderControl = this;
    }

    addEventOnElements(sliderControls,"click",sliderStart);
}


const createMovieList = function({ results : movieList}, title) {
    const movieListElem = document.createElement("section");
    movieListElem.classList.add("movie-list");
    movieListElem.ariaLabel = `${title}`;

    movieListElem.innerHTML = `
        <div class="title-wrapper">
            <h3 class="title-large">
                ${title}
            </h3>
        </div>

        <div class="slider-list">
            <div class="slider-inner"></div>
        </div>
    `;

    for(const movie of movieList){
        const movieCard = createMovieCard(movie); //called from movie-card.js

        movieListElem.querySelector(".slider-inner").appendChild(movieCard);
    }

    pageContent.appendChild(movieListElem);
}