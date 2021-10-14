let api_url = 'http://localhost:8000/api/v1/titles/';

let app = document.getElementById('bloc_page');

let best_rated = document.createElement('div');
best_rated.setAttribute('class', 'best_rated');
app.appendChild(best_rated);

let top_ratings = document.createElement('div');
top_ratings.setAttribute('class', 'top_ratings');
app.appendChild(top_ratings);

let comedy = document.createElement('div');
comedy.setAttribute('class', 'comedy');
app.appendChild(comedy);

let thriller = document.createElement('div');
thriller.setAttribute('class', 'thriller');
app.appendChild(thriller);

let horror = document.createElement('div');
horror.setAttribute('class', 'horror');
app.appendChild(horror);

let best_movie =[]
let elements = [top_ratings, comedy, thriller, horror]
let movies = [[], [], [], []]

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

    //loop for parsing different pages of results
    request.open('GET', url, true);
    request.onload = function () {
        let data = JSON.parse(request.response);
        if (request.status === 200) {
            let results = data.results;
            movies_parsing(nb_movies, results, target);
        }
        if (movies[target].length < nb_movies){
            url = data.next;
            get_movies(nb_movies, url, target)
        }else{
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


function parsing() {
    for (i = 0; i < searchs.length; i++) {
        get_movies(searchs[i][0], api_url + searchs[i][1], i);
    }
}


function create_display(target){
    categories = ['Mieux noté', 'comédie', 'thriller', 'horreur'];
    contener = document.createElement('div');
    contener.setAttribute('class', 'contener');
    h1 = document.createElement('h1');
    h1.textContent = categories[target];
    contener.appendChild(h1);
    for (movie of movies[target]){
        let mini = document.createElement('span');
        let img = document.createElement('img');
         img.setAttribute('src',movie.image_url);
         mini.appendChild(img);
         contener.appendChild(mini)
    }
    elements[target].appendChild(contener);
}


function main(){
    parsing()
}

main()
