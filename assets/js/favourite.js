"use strict";

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

// // import all components and functions
import { api_key, fetchDataFromServer } from "./api.js";
import { createMovieCard } from "./movie-card.js";
// import { getFavouritesList, favList } from "./server.js";




export function showFavourites() {
  var FavouritesList = [];
  var RecommendationList = [];
  const searchResultModal = document.createElement("div");
  searchResultModal.classList.add("search-modal");
  document.querySelector("main").appendChild(searchResultModal);
  searchResultModal.classList.add("active");
        // searchResultModal.innerHTML = ""; // removing old search results

        searchResultModal.innerHTML = `

          <h1 class="heading">Favourites Movies</h1>

          <div class="movie-list">
              <div class="grid-list"></div>
          </div>
          <br><br><br>
          
          <h1 class="heading">You may also like</h1>

          <div class="movie-list">
              <div class="grid-list2"></div>
          </div>

        `;

const userId = window.localStorage.getItem("uid");
const dbref = ref(database);
  get(child(dbref, "favourites/" + userId +'/'))
  .then((snapshot)=>{
    if (snapshot.exists()) {
      snapshot.forEach(function(childSnapshot) {
      let x = childSnapshot.key;
      // console.log(typeof x);
      FavouritesList.push(x);
    });  
    }
    else {
      console.log("No favourite available");
    }


    for (const movieId of FavouritesList) {

        remove(ref(database, 'recommendation/' + userId + '/' + movieId),{
        })
          
        fetchDataFromServer(
            `https://api.themoviedb.org/3/movie/${movieId}?api_key=${api_key}&append_to_response=casts,videos,images,releases`,
            function (movie) {
              const movieCard = createMovieCard(movie);

          searchResultModal
            .querySelector(".grid-list")
            .appendChild(movieCard);
              
            }
        );       
      }  
  }); 

  get(child(dbref, "recommendation/" + userId +'/'))
  .then((snapshot)=>{
    if (snapshot.exists()) {
      snapshot.forEach(function(childSnapshot) {
      let x = childSnapshot.key;
      // console.log(typeof x);
      RecommendationList.push(x);
    });  
    }
    else {
      console.log("No data available");
    }
    
    for (const movieId of RecommendationList) {
          
      fetchDataFromServer(
          `https://api.themoviedb.org/3/movie/${movieId}?api_key=${api_key}&append_to_response=casts,videos,images,releases`,
          function (movie) {
            const movieCard = createMovieCard(movie);

        searchResultModal
          .querySelector(".grid-list2")
          .appendChild(movieCard);
            
          }
      );       
    }  

  });
  
  
}

