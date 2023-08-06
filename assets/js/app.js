// // database connection
// import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
// import { getDatabase, set, ref, update, } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries
    
// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//     apiKey: "AIzaSyCRhnIOB6hPf6YYs0RuJ-qBfenWP3iNBj0",
//     authDomain: "filmwhiz.firebaseapp.com",
//     databaseURL: "https://filmwhiz-default-rtdb.asia-southeast1.firebasedatabase.app",
//     projectId: "filmwhiz",
//     storageBucket: "filmwhiz.appspot.com",
//     messagingSenderId: "119069805650",
//     appId: "1:119069805650:web:1ebf405505f890ff35238b",
//     measurementId: "G-JRMWJS8WCB"
// };
    
//     // Initialize Firebase
//     const app = initializeApp(firebaseConfig);
//     const database = getDatabase(app);
//     const auth = getAuth();
//     const analytics = getAnalytics(app);
    



// Variables
const movieId = window.localStorage.getItem("movieId");
const userId = window.localStorage.getItem("uid");
var star = document.getElementById("star-log");
var star_title = document.getElementById("star-title");

import { removeFavourites, addFavourites, changeRating } from "./server.js";
// import { getFavouritesList } from "./authentication.js";




// update favourites
star.onclick = function() {
  if (star.className == "active") {
    star.className = "";
    star_title.className = "";
    
    removeFavourites();    

  } else {
    star.className = "active";
    star_title.className = "active";

    addFavourites();

  }
  // FavouritesList = [];
  // getFavouritesList();
};

var rating0 = document.getElementById("rating-none");
var rating1 = document.getElementById("rating-1");
var rating2 = document.getElementById("rating-2");
var rating3 = document.getElementById("rating-3");
var rating4 = document.getElementById("rating-4");
var rating5 = document.getElementById("rating-5");

rating0.onclick = function() {
  changeRating(0);
}
rating1.onclick = function() {
  changeRating(1);
}
rating2.onclick = function() {
  changeRating(2);
}
rating3.onclick = function() {
  changeRating(3);
}
rating4.onclick = function() {
  changeRating(4);
}
rating5.onclick = function() {
  changeRating(5);
}






// const sub_Menu = document.querySelector("[sub-menu-wrap]");
// const subDetails = document.createElement("div");
//     subDetails.classList.add("sub-menu");
//     subDetails.innerHTML = `
//     <div class="user-info">
//     <img src="assets/images/profile/user.png">
//     <h3>towha.e</h3>
//     </div>
//     <hr>

//     <a href="#" class="sub-menu-link">
//         <img src="assets/images/profile/profile.png">
//         <p>Profile</p>
//         <span>></span>
//     </a>
//     <a href="#" class="sub-menu-link" id="show-favourite" onclick="toggleMenu()">
//         <img src="assets/images/profile/profile.png">
//         <p>Favourites</p>
//         <span>></span>
//     </a>
//     <a href="#" class="sub-menu-link" id="menu-logout" onclick="toggleMenu()">
//         <img src="assets/images/profile/logout.png">
//         <p>Logout</p>
//         <span>></span>
//     </a>
// `;
// sub_Menu.appendChild(subDetails);




