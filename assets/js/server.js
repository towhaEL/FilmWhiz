      // import { updateFavouriteList } from "./authentication";
  
      // Import the functions you need from the SDKs you need
      // import { updateFavouriteList } from "./authentication.js";
      import { api_key, fetchDataFromServer } from "./api.js";


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
      // Variables
      const movieId = window.localStorage.getItem("movieId");
      var uid;

      // update favourite list upon clicking heart icon database
      var SFavouritesList = [];

      export function getFavouritesList()
      { 
      var fav=[];
      const userId = window.localStorage.getItem("uid");
      const dbref = ref(database);
        get(child(dbref, "favourites/" + userId +'/'))
        .then((snapshot)=>{
          if (snapshot.exists()) {
            snapshot.forEach(function(childSnapshot) {
            let x = childSnapshot.key;
            // console.log(typeof x);
            fav.push(x);
          });  
          }
          else {
            console.log("No data available");
          }
          SFavouritesList = [...fav];
          //  console.log(SFavouritesList);
        })   
        return fav; 
        SFavouritesList = [...fav];  
      }

      // const auth_btn = document.querySelector(".auth-btn");
      // collect user uid from database
      onAuthStateChanged(auth, (user) => {
        if (user) {
          // auth_btn.style.display = "contents";
          uid = user.uid;
        } else {       
          // auth_btn.style.display = "none";   
        }
      });

      // add favourite to database
      export function addFavourites() {
        set(ref(database, 'favourites/' + uid + '/' + movieId),{
          favourite: true,
        })
        set(ref(database, 'movies_favourites/' + movieId + '/' + uid),{
          favourite: true,
        })
        getFavouritesList();

        remove(ref(database, 'recommendation/' + uid + '/' + movieId),{
        })

        fetchDataFromServer(
          `https://api.themoviedb.org/3/movie/${movieId}/recommendations?api_key=${api_key}&page=1`,
          function ({ results: movieList }, title) {
            
            var count=0;
            for (const movie of movieList) {
              count++;
              if(count==6) {
                count = 0;
                break;
              }
              const { poster_path, vote_average, id, backdrop_path } = movie;
              if(vote_average != 0 && poster_path!=null && backdrop_path!=null) {
                set(ref(database, 'recommendation/' + uid + '/' + id),{
                  recommended: true,
                })
              }
            }        
          }
        );


      }
      // remove favourite from database
      export function removeFavourites() {
        remove(ref(database, 'favourites/' + uid + '/' + movieId),{
        })
        remove(ref(database, 'movies_favourites/' + movieId + '/' + uid),{
        })
        getFavouritesList();

        fetchDataFromServer(
          `https://api.themoviedb.org/3/movie/${movieId}/recommendations?api_key=${api_key}&page=1`,
          function ({ results: movieList }, title) {
            
            var count=0;
            for (const movie of movieList) {
              count++;
              if(count==5) {
                count = 0;
                break;
              }
              const { poster_path, vote_average, id, backdrop_path } = movie;
              if(vote_average != 0 && poster_path!=null && backdrop_path!=null) {
              remove(ref(database, 'recommendation/' + uid + '/' + id),{
              })
              }
            }        
          }
        );


      }

      // check if movieId is in favourite? in database
      export function checkFavourite()
      { 
      const movie_Id = window.localStorage.getItem("movieId");
      const userId = window.localStorage.getItem("uid");
      var star = document.getElementById("star-log");
      var star_title = document.getElementById("star-title");
      const dbref = ref(database);
        get(child(dbref, "favourites/" + userId + "/" + movie_Id))
        .then((snapshot)=>{
          if (snapshot.exists()) {
            console.log(snapshot.val());
            // return true;  
            star.className = "active";
            star_title.className = "active";      
          }
          else {
            console.log("No data available");
            // return true;
            star.className = "";
            star_title.className = "";
          }
        })      
      }

      
      // comment fetch from database
      const reviewArea = document.getElementById('review-box');
      const reviewPost = document.getElementById('review-submit');
              
      reviewPost.onclick = function() {
        const userId = window.localStorage.getItem("uid");
        const movieId = window.localStorage.getItem("movieId");
        var dt = new Date();

        const dbref = ref(database);
        get(child(dbref, "users/" + userId + "/"))
        .then((snapshot)=>{
          if (snapshot.exists()) {
            const userName = snapshot.val().username;  
            if(reviewArea.value != "") {
              set(ref(database, 'reviews/' + movieId + '/' + userId + dt),{
                review: reviewArea.value,
                username: userName,
                postDate: dt,
              })
              location.reload();

            }  
          }
        }) 

        
      }


      // change Rating
      export function changeRating(x) {
        const userId = window.localStorage.getItem("uid");
        const movieId = window.localStorage.getItem("movieId");
        var prev_rate;

        const dbref = ref(database);
            get(child(dbref, 'rating/' + movieId + '/' + userId))
              .then((Snap_shot)=>{
                if (Snap_shot.exists()) {
                  prev_rate = Snap_shot.val().starCount;
                }
              })

        const DBref = ref(database);
        get(child(DBref, 'movie_rating/' + movieId ))
        .then((snapshot)=>{
          if (snapshot.exists()) {

            const dbref = ref(database);
            get(child(dbref, 'rating/' + movieId + '/' + userId))
              .then((Snap_shot)=>{
               if (Snap_shot.exists()) {

                if(x==0) {         
                  if(prev_rate!=0) {
                   var vote_avg = snapshot.val().vote_average;
                   var vote_cnt = snapshot.val().vote_count;
                
                   vote_avg = ((vote_avg*vote_cnt)-(2*prev_rate))/(vote_cnt-1);
                   vote_cnt--;

                   set(ref(database, 'movie_rating/' + movieId ),{
                     vote_average: vote_avg,
                     vote_count: vote_cnt
                    })
                  }

                }
                else {
                   
                   var vote_avg = snapshot.val().vote_average;
                   var vote_cnt = snapshot.val().vote_count;
                   vote_avg = ((vote_avg*vote_cnt)-(2*(prev_rate)))/(vote_cnt-1);
                   if(prev_rate==0)
                     vote_cnt++;

                   vote_avg = ((vote_avg*vote_cnt)+(2*x))/(vote_cnt+1);

                   set(ref(database, 'movie_rating/' + movieId ),{
                     vote_average: vote_avg,
                     vote_count: vote_cnt,
                   })


                }
            
              }
              else {
                var vote_avg = snapshot.val().vote_average;
                var vote_cnt = snapshot.val().vote_count;
                
                vote_avg = ((vote_avg*vote_cnt)+(2*x))/(vote_cnt+1);
                var vote_cnt = vote_cnt+1;

                set(ref(database, 'movie_rating/' + movieId ),{
                  vote_average: vote_avg,
                  vote_count: vote_cnt
                })

              }
        })



          }
          else {
            fetchDataFromServer(
              `https://api.themoviedb.org/3/movie/${movieId}?api_key=${api_key}`,
              function (movie) {
                const {
                  vote_average,
                  vote_count
                } = movie;

                var vote_avg = ((vote_average*vote_count)+(2*x))/(vote_count+1);
                var vote_cnt = vote_count+1;

                set(ref(database, 'movie_rating/' + movieId ),{
                  vote_average: vote_avg,
                  vote_count: vote_cnt
                })

              });

          }
        })

        set(ref(database, 'rating/' + movieId + '/' + userId),{
          starCount: x,
        })

      }

      // check rating
      export function checkRating() {
        const movieId = window.localStorage.getItem("movieId");
        const userId = window.localStorage.getItem("uid");
        var rating0 = document.getElementById("rating-none");
        var rating1 = document.getElementById("rating-1");
        var rating2 = document.getElementById("rating-2");
        var rating3 = document.getElementById("rating-3");
        var rating4 = document.getElementById("rating-4");
        var rating5 = document.getElementById("rating-5");

        const dbref = ref(database);
        get(child(dbref, 'rating/' + movieId + '/' + userId))
        .then((snapshot)=>{
          if (snapshot.exists()) {
            const x = snapshot.val().starCount;
            if(x==0)
              rating0.checked = true;
            else if(x==1)
              rating1.checked = true;
            else if(x==2)
              rating2.checked = true;
            else if(x==3)
              rating3.checked = true;
            else if(x==4)
              rating4.checked = true;
            else if(x==5)
              rating5.checked = true;

          }
          else {
            console.log("No rating available");
            rating0.checked = true;
          }
        })
      }



      


    
