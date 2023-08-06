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




export function showFollower() {
    const searchResultModal = document.createElement("div");
    searchResultModal.classList.add("search-modal");
    document.querySelector("main").appendChild(searchResultModal);
    searchResultModal.classList.add("active");
          // searchResultModal.innerHTML = ""; // removing old search results
  
          searchResultModal.innerHTML = `

          <div class="search-box" search-box>
          <div class="search-wrapper" search-wrapper>
            <input
              type="text"
              name="search"
              aria-label="search movies"
              placeholder="Search..."
              class="search-field"
              autocomplete="off"
              search-field
            />
            <img
              src="./assets/images/search.png"
              alt="search"
              class="leading-icon"
              width="24"
              height="24"
            />
          </div>
          <div class="container">
  <div class="row">
    <div class="col-md-6 col-xl-4">                       
      <div class="card">
        <div class="card-body">
          <div class="media align-items-center"><span style="background-image: url(https://bootdey.com/img/Content/avatar/avatar6.png)" class="avatar avatar-xl mr-3"></span>
            <div class="media-body overflow-hidden">
              <h5 class="card-text mb-0">Nielsen Cobb</h5>
              <p class="card-text text-uppercase text-muted">Memora</p>
              <p class="card-text">
                 
                nielsencobb@memora.com<br><abbr title="Phone">P:  </abbr>+1 (851) 552-2735
              </p>
            </div>
          </div><a href="#" class="tile-link"></a>
        </div>
      </div>
    </div>
    
  
            <h1 class="heading">Following</h1>
  
            <div class="movie-list">
                <div class="grid-list"></div>
            </div>
            <br><br><br>
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
  
  
}

