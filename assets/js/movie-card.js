'use strict';

import { imageBaseUrl } from "./api.js";

/**
 * movie card
 */

export function createMovieCard(movie){
    const {
        poster_path,
        title,
        vote_average,
        release_date,
        id
    } = movie;

    const card = document.createElement("div");
    card.classList.add("movie-card");

    card.innerHTML = `
        
    `
}
