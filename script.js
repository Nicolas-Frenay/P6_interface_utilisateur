let api_url = 'http://localhost:8000/api/v1/titles/';

let top_ratings = document.getElementById('top_ratings');

let comedy = document.getElementById('comedy');

let thriller = document.getElementById('thriller');

let horror = document.getElementById('horror');

// array to store the best rated movie
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


//function to had movies infos into movies array
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

    let img = document.getElementById('best_movie_picture');
    let title = document.getElementById('best_title');
    title.textContent = best_movie[0].title
    img.setAttribute('src',best_movie[0].image_url);
    img.setAttribute("id", best_movie[0].id)
    img.onclick = function (){
        movie_infos(img.id);
    }
}

//function to create elements for displaying movies
function create_display(target){
    let contener = document.createElement('div');
    contener.setAttribute('class', 'contener');

    for (movie of movies[target]){
        let mini = document.createElement('span');
        let img = document.createElement('img');
        img.setAttribute('src',movie.image_url);
        img.setAttribute("id", movie.id)
        img.onclick = function (){
            movie_infos(img.id);
        }

         mini.appendChild(img);
         contener.appendChild(mini);
    }
    elements[target].appendChild(contener);
}

//Scrolling buttons functions
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


//loading content in modal window
function movie_infos(id){
    let modal = document.getElementById('modal');
    let btn = document.getElementById('modal_close');

    modal.style.display = "flex";

    btn.onclick = function (){
        modal.style.display = "none";
    }

    //closing modal window if user click outside of it
    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    }

    let request = new XMLHttpRequest();
    request.open('GET', api_url + id, true);
    request.onload = function () {
        let data = JSON.parse(request.response);
        if (request.status === 200) {
            let picture = document.getElementById('modal_movie_picture');
            picture.setAttribute('src', data.image_url);

            let title = document.getElementById('modal_title');
            title.textContent = data.title;

            let duration = document.getElementById('modal_duration');
            duration.textContent = data.duration + ' minutes'

            let genre = document.getElementById('modal_genre');
            genre.textContent = data.genres

            let date = document.getElementById('modal_date');
            date.textContent = data.year;

            let country = document.getElementById('modal_country');
            country.textContent = 'Pays : ' + data.countries;

            let rated = document.getElementById('modal_rated');
            if (data.rated === 'Not rated or unkown rating'){
                rated.textContent = "Classement inconnu";
            }else{
                rated.textContent = 'Classement : ' + data.rated;
            }

            let imdb = document.getElementById('modal_imdb');
            imdb.textContent = 'IMDB : ' + data.imdb_score;

            let director = document.getElementById('modal_director');
            director.textContent = 'réalisateur(s) : ' + data.directors;

            let actors = document.getElementById('modal_actors');
            actors.textContent = 'Comédien(ne)s : ' + data.actors;

            let box_office = document.getElementById('modal_box_office');
            if (data.worldwide_gross_income) {
                box_office.textContent = 'Résultats au box-office (mondial) : '
                    + data.worldwide_gross_income.toLocaleString() + ' $';
            } else {
                box_office.textContent = 'Résultats au box-office : inconus';
            }

            let desc = document.getElementById('modal_description');
            if (data.long_description.length > 1) {
                desc.textContent = "Résumé : " + data.long_description;
            } else {
                desc.textContent = "Aucun résumé disponible";
            }
        }
    }
    request.send()
}

// main function : looping through categories
function main() {
    for (i = 0; i < searchs.length; i++) {
        get_movies(searchs[i][0], api_url + searchs[i][1], i);
    }
}

main()
