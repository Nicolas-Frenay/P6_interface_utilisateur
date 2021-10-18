let api_url = 'http://localhost:8000/api/v1/titles/';

let best_rated = document.getElementById('best_rated');

let top_ratings = document.getElementById('top_ratings');

let comedy = document.getElementById('comedy');

let thriller = document.getElementById('thriller');

let horror = document.getElementById('horror');

// array to store best rated movie
let best_movie =[]
//array to store categories elements to be displayed
let elements = [top_ratings, comedy, thriller, horror]
//array that store arrays of movies objects, by category
let movies = [[], [], [], []]

//array of arrays : [number of movie to find, api search term]
let searchs = [
    [8, '?sort_by=-imdb_score'],
    [7, '?genre=comedy&sort_by=-imdb_score'],
    [7, '?genre=thriller&sort_by=-imdb_score'],
    [7, '?genre=horror&sort_by=-imdb_score']
];

// function to request movies from API
function get_movies (nb_movies, url, target){
    // index for parsing next page if needed
    page_to_search = nb_movies%5;
    let request = new XMLHttpRequest();

    request.open('GET', url, true);
    request.onload = function () {
        let data = JSON.parse(request.response);
        if (request.status === 200) {
            let results = data.results;
            movies_parsing(nb_movies, results, target);
        }
        // check to see if all movies have been parsed
        if (movies[target].length < nb_movies){
            url = data.next;
            get_movies(nb_movies, url, target)
        }else{
            // if getting top rated movies, move the best one
            if (target === 0){
                move_best_movie();
            }
            create_display(target);
        }
    }
    request.send();
}


//function to had movies info into movies array
function movies_parsing(nb_movies, data, target){
    for (movie of data){
        if (movies[target].length < nb_movies) {
            movies[target].push(movie);
        }
    }
}


// function to move the movie with the best imdb score into its own element
function move_best_movie(){
    best_movie[0] = movies[0][0];

    movies[0].shift();

    contener = document.createElement('span');
    contener.setAttribute('class', 'contener');

    h1 = document.createElement('h1');
    h1.textContent = "Meilleur film";

    contener.appendChild(h1);

    let img = document.createElement('img');
    img.setAttribute('src',best_movie[0].image_url);

    contener.appendChild(img);
    best_rated.appendChild(contener);
}


// function for looping through categories
function parsing() {
    for (i = 0; i < searchs.length; i++) {
        get_movies(searchs[i][0], api_url + searchs[i][1], i);
    }
}


//function to create elements for displaying movies
function create_display(target){
    contener = document.createElement('div');
    contener.setAttribute('class', 'contener');

    for (movie of movies[target]){
        let mini = document.createElement('span');
        let img = document.createElement('img');
         img.setAttribute('src',movie.image_url);

         mini.appendChild(img);
         contener.appendChild(mini);
    }
    elements[target].appendChild(contener);
}


function main(){
    parsing()
}

let tr_left = document.getElementById('tr_right');
tr_left.onclick = function (){
    top_ratings.scrollLeft +=250;
}

let tr_right = document.getElementById('tr_left');
tr_right.onclick = function (){
    top_ratings.scrollLeft -=250;
}

let c_left = document.getElementById('c_right');
c_left.onclick = function (){
    comedy.scrollLeft +=250;
}

let c_right = document.getElementById('c_left');
c_right.onclick = function (){
    comedy.scrollLeft -=250;
}

let t_left = document.getElementById('t_right');
t_left.onclick = function (){
    thriller.scrollLeft +=250;
}

let t_right = document.getElementById('t_left');
t_right.onclick = function (){
    thriller.scrollLeft -=250;
}

let h_left = document.getElementById('h_right');
h_left.onclick = function (){
    horror.scrollLeft +=250;
}

let h_right = document.getElementById('h_left');
h_right.onclick = function (){
    horror.scrollLeft -=250;
}

main()

