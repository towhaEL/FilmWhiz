      import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
      import { getDatabase, set, ref, update, remove, get, child } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";
      import { getAuth, createUserWithEmailAndPassword,signInWithEmailAndPassword,onAuthStateChanged,signOut  } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
      import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-analytics.js";
      // TODO: Add SDKs for Firebase products that you want to use
      // https://firebase.google.com/docs/web/setup#available-libraries
    
      // Your web app's Firebase configuration
      // For Firebase JS SDK v7.20.0 and later, measurementId is optional
      const firebaseConfig = {
        apiKey: "AIzaSyCRhnIOB6hPf6YYs0RuJ-qBfenWP3iNBj0",
        authDomain: "filmwhiz.firebaseapp.com",
        databaseURL: "https://filmwhiz-default-rtdb.asia-southeast1.firebasedatabase.app",
        projectId: "filmwhiz",
        storageBucket: "filmwhiz.appspot.com",
        messagingSenderId: "119069805650",
        appId: "1:119069805650:web:1ebf405505f890ff35238b",
        measurementId: "G-JRMWJS8WCB"
      };
    
      // Initialize Firebase
      const app = initializeApp(firebaseConfig);
      const database = getDatabase(app);
      const auth = getAuth();
      const analytics = getAnalytics(app);



"use strict";

import { api_key, imageBaseURL, fetchDataFromServer } from "./api.js";

import { sidebar } from "./sidebar.js";

import { createMovieCard } from "./movie-card.js";

import { search } from "./search.js";

import { checkFavourite, checkRating } from "./server.js";

import { showFavourites } from "./favourite.js";

const movieId = window.localStorage.getItem("movieId");
const show_favourite = document.getElementById("show-favourite");
const pageContent = document.querySelector("[page-content]");


show_favourite.onclick = function() { 
  showFavourites();
}
sidebar();

const getGenres = function (genreList) {
  const newGenreList = [];

  for (const { name } of genreList) newGenreList.push(name);
  return newGenreList.join(", ");
};

const getCasts = function (castList) {
  const newCastList = [];

  for (let i = 0, len = castList.length; i < len && len && i < 10; i++) {
    const { name } = castList[i];
    newCastList.push(name);
  }
  return newCastList.join(", ");
};

const getDirectors = function (crewList) {
  const directors = crewList.filter(({ job }) => job === "Director");

  const directorList = [];
  for (const { name } of directors) directorList.push(name);
  return directorList.join(", ");
};

// returns only trailers and teasers as array
const filterVideos = function (videoList) {
  return videoList.filter(
    ({ type, site }) =>
      (type === "Trailer" || type === "Teaser")
  );
};

fetchDataFromServer(
  `https://api.themoviedb.org/3/movie/${movieId}?api_key=${api_key}&append_to_response=casts,videos,images,releases`,
  function (movie) {
    const {
      backdrop_path,
      poster_path,
      title,
      release_date,
      runtime,
      vote_average,
      vote_count,
      releases: {
        countries: [{ certification }],
      },
      genres,
      overview,
      casts: { cast, crew },
      videos: { results: videos },
    } = movie;

    document.title = `${title} - FilmWhiz`;

    const DBref = ref(database);
    var vote_avg = vote_average;
    var vote_cnt = vote_count;
    const movieid = window.localStorage.getItem("movieId");
        get(child(DBref, 'movie_rating/' + movieid ))
        .then((snapshot)=>{
          if (snapshot.exists()) {
            vote_avg = snapshot.val().vote_average;
            vote_cnt = snapshot.val().vote_count;
          }
        })
    // alert(vote_cnt)

    const movieDetail = document.createElement("div");
    movieDetail.classList.add("movie-detail");
    movieDetail.innerHTML = `
                <div 
                class="backdrop-image" 
                style="background-image: url('${imageBaseURL}${
      "w1280" || "original"
    }${backdrop_path || poster_path}')">
                </div>

                <figure class="poster-box movie-poster">
                <img
                    src="${imageBaseURL}w342${poster_path}"
                    alt="${title} poster"
                    class="img-cover"
                />
                </figure>

                <div class="detail-box">
                <div class="detail-content">
                    <h1 class="heading">${title}</h1>

                    <div class="meta-list">
                    <div class="meta-item">
                        <img
                        src="./assets/images/star.png"
                        width="20"
                        height="20"
                        alt="rating"
                        />
                        <span class="span">${vote_avg.toFixed(1)} (${vote_cnt})</span>
                    </div>

                    <div class="separator"></div>

                    <div class="meta-item">${runtime}m</div>

                    <div class="separator"></div>

                    <div class="meta-item">${release_date.split("-")[0]}</div>

                    <div class="meta-item card-badge">${certification}</div>
                    </div>

                    <p class="genre">${getGenres(genres)}</p>

                    <p class="overview">${overview}</p>

                    <ul class="detail-list">
                    <div class="list-item">
                        <p class="list-name">Starring</p>
                        <p>${getCasts(cast)}</p>
                    </div>

                    <div class="list-item">
                        <p class="list-name">Directed By</p>
                        <p>${getDirectors(crew)}</p>
                    </div>
                    </ul>
                </div>
                
                
                <p class="title-wrapper">
                    <h3 class="title-large">Trailer and Clips</h3>
                </p>

                <div class="slider-list">
                    <div class="slider-inner"></div>
                </div>
                </div>
                           
    `;

    

    for (const { key, name } of filterVideos(videos)) {
      const videoCard = document.createElement("div");
      videoCard.classList.add("video-card");

      videoCard.innerHTML = `
        <iframe width="500" height="294" src="https://www.youtube.com/embed/${key}?&theme=dark&color=white&rel=0" frameborder="0" 
        allowfullscreen="1" title="${name}" class="img-cover" loading="lazy"></iframe>
        `;

      movieDetail.querySelector(".slider-inner").appendChild(videoCard);

    }


    var comment_count=0;
    const commentDetail = document.createElement("div");
    commentDetail.innerHTML = `
    <section class="content-item" id="comments">
    <div class="row">
          <div class="col-sm-8">   
              <div class="comment-list">
                <h3>Comments</h3>
                <!-- COMMENT 1 - START -->
                <div class="media">
                    
                </div>
                <!-- COMMENT 1 - END -->
              </div>
          </div>
      </div>
  </section>
    `;

    const userId = window.localStorage.getItem("uid");
    const movieId = window.localStorage.getItem("movieId");
    // var comment_count=0;
    const dbref = ref(database);
        get(child(dbref, "reviews/" + movieId +'/'))
        .then((snapshot)=>{
          if (snapshot.exists()) {
            snapshot.forEach(function(childSnapshot) {
            comment_count++;
            let x = childSnapshot.key;

            get(child(dbref, "reviews/" + movieId + '/' + x))
            .then((snapshot)=>{
              if (snapshot.exists()) {
                const userName = snapshot.val().username;  
                const review = snapshot.val().review;

                const commentmedia = document.createElement("div");
                commentmedia.innerHTML = `
                <a class="pull-left" href="#"><img class="media-object" src="assets/images/avatar/avatar7.png" alt=""></a>
                <div class="media-body">
                <h3 class="media-heading">${userName}</h3>
                <p>${review}.</p>
                <ul class="list-unstyled list-inline media-detail pull-left">
                <li><i class="fa fa-calendar"></i>25/07/2023</li>
                </ul>
                </div>
                <br><br>
                `;
                commentDetail.querySelector(".media").appendChild(commentmedia);
                
                // <ul class="list-unstyled list-inline media-detail pull-right">
                // <li class=""><a href="">Like</a></li>
                // </ul>
              }
            }) 


          });  
          }
          else {
            console.log("No reviews available");
          }
          
        }) 



     

    //  for (var i=0; i<5; i++) {
      // const commentmedia = document.createElement("div");
      // commentmedia.innerHTML = `
      // <a class="pull-left" href="#"><img class="media-object" src="https://bootdey.com/img/Content/avatar/avatar1.png" alt=""></a>
      // <div class="media-body">
      //     <h4 class="media-heading">John Doe</h4>
      //     <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
      //     <ul class="list-unstyled list-inline media-detail pull-left">
      //         <li><i class="fa fa-calendar"></i>27/02/2014</li>
      //     </ul>
      //     <ul class="list-unstyled list-inline media-detail pull-right">
      //         <li class=""><a href="">Like</a></li>
      //     </ul>
      // </div>
      // <br><br><br>
      // `;
      // commentDetail.querySelector(".media").appendChild(commentmedia);
    //  }

    
    pageContent.querySelector(".review-section").appendChild(commentDetail);
    pageContent.querySelector(".info-inner").appendChild(movieDetail);

    fetchDataFromServer(
      `https://api.themoviedb.org/3/movie/${movieId}/recommendations?api_key=${api_key}&page=1`,
      addSuggestedMovies
    );
  }
);


const addSuggestedMovies = function ({ results: movieList }, title) {
  const movieListElem = document.createElement("section");
  movieListElem.classList.add("movie-list");
  movieListElem.ariaLabel = "You May Also Like";

  movieListElem.innerHTML = `
    <div class="title-wrapper">
      <h3 class="title-large">You May Also Like</h3>
    </div>

    <div class="slider-list">
      <div class="slider-inner"></div>
    </div>
  `;

  for (const movie of movieList) {
    // Called from movie_card.js
    const movieCard = createMovieCard(movie);

    movieListElem.querySelector(".slider-inner").appendChild(movieCard);
  }
  // pageContent.querySelector(".may-like").appendChild(movieListElem);
};

search();
checkFavourite();
checkRating();

