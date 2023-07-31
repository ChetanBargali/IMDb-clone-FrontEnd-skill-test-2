
    const key='2b1848eb';
    var searchInput=document.getElementById('input');
    var displaySearchList=document.getElementsByClassName('search-display-container');

    fetch('http://www.omdbapi.com/?i=tt3896198&apikey=2b1848eb') // Making the API call using fetch()
        .then(res => res.json()) //this is used to handle the response received from the API call.
        .then(data => console.log(data));// Use the data returned from the API

    // Upon keypress - function findMovies is initiated
    searchInput.addEventListener('input', findMovies);
    async function findMovies() {
        // Compose the URL for the OMDB API request based on the user's search input and API key
        const url = `https://www.omdbapi.com/?s=${(searchInput.value).trim()}&page=1&apikey=${key}`;
    
        // Make an API call using fetch() and await for the response
        const res = await fetch(url);
    
        // Parse the response body as JSON and await for the result
        const data = await res.json();
    
        // Check if the response contains movie data in the 'Search' property
        if (data.Search) {
        // Calling the function to display a list of movies related to the user's search
        displayMovieList(data.Search);
        }
    }


    //Displaying the movie list on the search page according to the user list
    async function displayMovieList(movies) {
        var output='';
        //Traversing over the movies list which is passed as an argument to our function
        for(i of movies){
            var img='';
            if(i.Poster!='N/A'){
                img = i.Poster;
            }else {
                img = 'Assets/notFound.png';
            }
            var id = i.imdbID;
            //Appending the output through string interpolition
            output+=`
            <div class="search-item">
                <div class="search-poster">
                    <a href="movie-details.html?id=${id}"><img src=${img} alt="Favourites Poster"></a>
                </div>
                <div class="search-details">
                    <div class="search-details-box">
                        <div>
                            <p class="search-movie-name"><a href="movie-details.html?id=${id}">${i.Title}</a></p>
                            <p class="search-movie-year"><a href="movie-details.html?id=${id}">${i.Year}</a></p>
                        </div>
                        <div>
                            <i class="fa-solid fa-bookmark" style="cursor:pointer;" onClick=addTofavorites('${id}')></i>
                        </div>
                    </div>
                </div>
            </div>
            `
        }
        //Appending this to the movie-display class of our html page
        document.querySelector('.search-display-container').innerHTML = output;
        console.log("here is movie list ..", movies);
    }

    async function addTofavorites(id) {
        console.log("fav-item", id);
    
        // Check if the movie's ID already exists in local storage
        for (let key in localStorage) {
            if (localStorage[key] === id) {
                alert('Movie already added to Watchlist!');
                return; // Exit the function if the movie is already added
            }
        }
    
        // If the movie is not already added, add it to local storage with a unique key
        localStorage.setItem(Math.random().toString(36).slice(2, 7), id);
        alert('Movie Added to Watchlist!');
    }
    

    //Favorites movies are loaded on to the fav page from localstorage
    async function favoritesMovieLoader() {
        var output = ''
        var watchlistContainer = document.querySelector('.watchList-container');

        // Clear the watchlist container before displaying new items
        watchlistContainer.innerHTML = '';

        //Traversing over all the movies in the localstorage
        for (i in localStorage) {
            var id = localStorage.getItem(i);
            if (id != null) {
                //Fetching the movie through id 
                const url = `https://www.omdbapi.com/?i=${id}&plot=full&apikey=${key}`
                const res = await fetch(`${url}`);
                const data = await res.json();
                console.log(data);


                var img = ''
                if (data.Poster) {
                    img = data.Poster
                }else { 
                    img = 'Assets/notFound.png'
                }
                var Id = data.imdbID;
                //Adding all the movie html in the output using interpolition
                output += `
                <div class="watchList-item">
                    <div class="watchList-poster">
                        <a href="movie-details.html?id=${id}"><img src=${img} alt="Favourites Poster"></a>
                    </div>
                    <div class="watchList-details">
                        <div class="watchList-details-box">
                            <div>
                                <p class="watchList-movie-name">${data.Title}</p>
                                <p class="watchList-movie-rating">${data.Year} &middot; <span style="font-size: 18px; font-weight: 600;">${data.imdbRating}</span>/10</p>
                            </div>
                            <div >
                                <i class="fa-solid fa-trash" style="cursor:pointer;" onClick=removeFromfavorites('${Id}')></i>
                            </div>
                        </div>
                    </div>
                </div>`;
            }
        }
        //Appending the html to the movie-display class in favorites page 
        watchlistContainer.innerHTML = output;
    }

    //Removing the movie from the favorites list  and also from the localstorage
    async function removeFromfavorites(id) {
        console.log('Removing movie with ID:',id);
        for (i in localStorage) {
            // If the ID passed as argument matches with value associated with key, then removing it 
            if (localStorage[i] === id) {
                localStorage.removeItem(i)
                break;
            }
        
        }
        //Alerting the user and refreshing the page
        alert('Movie Removed from Watchlist');
        window.location.replace('watchList.html');
    }


    async function MovieInfo() {
        // Finding ID of the movie from the URL
        var urlQueryParams = new URLSearchParams(window.location.search);
        var id = urlQueryParams.get('id');
        console.log(id);
    
        // Compose the URL for the OMDB API request based on the movie ID and API key
        const url = `https://www.omdbapi.com/?i=${id}&apikey=${key}`;
    
        // Make an API call using fetch() and await for the response
        const res = await fetch(`${url}`);
    
        // Parse the response body as JSON and await for the result
        const data = await res.json();
        console.log(data);
        console.log(url);
    
        // Making the output HTML using string interpolation
        var output = `
            <div class="movie-poster">
                <img src=${data.Poster} alt="Movie Poster">
            </div>
            <div class="movie-details">
                <div class="details-header">
                    <div class="title">
                        <h2>${data.Title}</h2>
                    </div>
                    <div class="icon">
                        <i " class="fa-solid fa-bookmark" onClick=addTofavorites('${id}') style="cursor: pointer;"></i>
                    </div>
                </div>
                <span class="italics-text"><i>${data.Year} &#x2022; <span style="color:#CF1CE7; font-weight:600;">${data.Country}</span> &#x2022; Rating - <span
                    style="font-size: 18px; color:#CD26E8; font-weight: 600;">${data.imdbRating}</span>/10 </i></span>
                <ul class="details-ul">
                    <li><strong>Actors: </strong>${data.Actors}</li>
                    <li><strong>Director: </strong>${data.Director}</li>
                    <li><strong>Writers: </strong>${data.Writer}</li>
                </ul>
                <ul class="details-ul">
                    <li><strong>Genre: </strong>${data.Genre}</li>
                    <li><strong>Release Date: </strong>${data.DVD}</li>
                    <li><strong>Box Office: </strong><span style="color:#431A80; font-weight:600;">${data.BoxOffice}</span></li>
                    <li><strong>Movie Runtime: </strong>${data.Runtime}</li>
                </ul>
                <p style="font-size: 14px; font-weight:500; margin-top:10px;">${data.Plot}</p>
                <p style="font-size: 15px; font-style: italic; color: #222; margin-top: 10px;">
                    <i class="fa-solid fa-award"></i>
                    &thinsp; <span style="color:#4244BF; font-weight:600;">${data.Awards}</span>
                </p>
            </div>
        `;
    
        // Appending the output HTML to the movie-container element in the DOM
        document.querySelector('.movie-container').innerHTML = output;
    }
    