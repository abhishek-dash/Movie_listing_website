'use strict';

const api_key = '7f14f0bddfa1a65040c860a8c9c6ca0b';

const imageBaseUrl = 'https://image.tmdb.org/t/p/';

// fetch data from a server using the `url` and passes the result in JSON data to a `callback` 
// fuction, along with an optional parameter if has 'optionalParam'.


const fetchDataFromServer =  function(url, callback, optionalParam) {
    fetch(url)
    .then(response => response.json())
    .then(data => callback(data, optionalParam))
}

export {imageBaseUrl, api_key, fetchDataFromServer};

