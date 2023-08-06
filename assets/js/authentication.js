// signIn / signUp variables
const formOpenBtn = document.querySelector(".btn-login"),
menu_logout = document.querySelector("#menu-logout"),
logout_Btn = document.querySelector(".btn-logout"),
home = document.querySelector(".home"),
formContainer = document.querySelector(".form_container"),
formCloseBtn = document.querySelector(".form_close"),
signupBtn = document.querySelector("#signup"),
loginBtn = document.querySelector("#login"),
pwShowHide = document.querySelectorAll(".pw_hide"),
sign_upBtn = document.querySelector("#sign-up"),
sign_inBtn = document.querySelector("#sign-in"),
sign_outBtn = document.querySelector("#sign-out"),
forgot_pwBtn = document.querySelector("#forgot-pw");

// signIn / signUp actions
formOpenBtn.addEventListener("click", () => home.classList.add("show"));
formCloseBtn.addEventListener("click", () => home.classList.remove("show"));
pwShowHide.forEach((icon) => {
icon.addEventListener("click", () => {
  let getPwInput = icon.parentElement.querySelector("input");
  if (getPwInput.type === "password") {
    getPwInput.type = "text";
    icon.classList.replace("uil-eye-slash", "uil-eye");
  } else {
    getPwInput.type = "password";
    icon.classList.replace("uil-eye", "uil-eye-slash");
  }
});
});
signupBtn.addEventListener("click", (e) => {
e.preventDefault();
formContainer.classList.add("active");
});
loginBtn.addEventListener("click", (e) => {
e.preventDefault();
formContainer.classList.remove("active");
});



// connection to Database
      // Import the functions you need from the SDKs you need
      import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
      import { getDatabase, set, ref, update, get, child } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";
      import { getAuth, createUserWithEmailAndPassword,signInWithEmailAndPassword,onAuthStateChanged,signOut,sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
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
    //   const sign_upBtn = document.querySelector("#sign-up");

    // update favourite list upon signIn database
    export var AFavouritesList = [];

    function getFavouritesList()
      { 
      const movie_Id = window.localStorage.getItem("movieId");
      const userId = window.localStorage.getItem("uid");
      const dbref = ref(database);
        get(child(dbref, "favourites/" + userId +'/'))
        .then((snapshot)=>{
          var fav=[];
          if (snapshot.exists()) {
            snapshot.forEach(function(childSnapshot) {
            fav.push(childSnapshot.key);
          });  
          }
          else {
            console.log("No data available");
          }
          AFavouritesList = [...fav];
          console.log(AFavouritesList);
        }) 
             
      }

      // reset password
      forgot_pwBtn.addEventListener("click", (e) => {
        // alert("Buddy take some rest, drink some water and try to remember your password.")
        var email = document.getElementById('login-email').value;

        if(email == ""){
          alert("Email field cannot be empty!")
        }
        else{
          sendPasswordResetEmail(auth, email)
          .then(() => {
            alert("Password reset email has been sent.")

          })
          .catch((error) => {
            alert(error)
            const errorCode = error.code;
            const errorMessage = error.message;
            // ..
          });
        }
      });

      
      // signUp database
      sign_upBtn.addEventListener('click',(e) => {

        let s_password=document.querySelector("#pass-word").value,
            s_confirmpassword=document.querySelector("#confirm-password").value;
        if(s_password != s_confirmpassword) {
            alert("Password didn't match!");
        }
        else {
        var username = document.getElementById('user-name').value;
        var email = document.getElementById('e-mail').value;
        var password = document.getElementById('confirm-password').value;
    
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
            // Signed up
            const user = userCredential.user;

            set(ref(database, 'users/' + user.uid),{
                username: username,
                email: email
            })
            alert('user created');
            signOut(auth).then(() => {
            getUserUid(null);
            })
            formContainer.classList.remove("active");
            // ...
            })
            .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
    
            alert(errorMessage);
            // ..
        
        });
    }
    });
    
    // signIn database
    sign_inBtn.addEventListener("click", () => {
        var email = document.getElementById('login-email').value;
        var password = document.getElementById('login-password').value;
        signInWithEmailAndPassword(auth, email, password)
         .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            
            const dt = new Date();
            update(ref(database, 'users/' + user.uid),{
                last_loginTime: dt,
            })
            // var userName;
            const dbref = ref(database);
            get(child(dbref, "users/" + user.uid +'/'))
            .then((snapshot)=>{
              if (snapshot.exists()) {
                const userName = snapshot.val().username; 
                getUserUsername(userName);
              }
            })  

            home.classList.remove("show");
            getUserUid(user.uid);
            getFavouritesList();
            location.reload();
            alert('user logged in');

            // console.log(FavouritesList);   

            // ...
         })
         .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;

            alert(errorMessage);
         });
    });

    // signOut database
    menu_logout.addEventListener("click", () => {
      const auth = getAuth();
      signOut(auth).then(() => {
          alert('user logged out');
          getUserUid(null);
          AFavouritesList = [];
          console.log(AFavouritesList);   
          // Sign-out successful.
      }).catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;

          alert(errorMessage);
          // An error happened.
      });
    });
  
    // Authentication change database
    const uid=null;
    onAuthStateChanged(auth, (user) => {
        if (user) {
          // User is signed in, see docs for a list of available properties
          // https://firebase.google.com/docs/reference/js/auth.user
          formOpenBtn.style.display = "none";
          logout_Btn.style.display = "flex";
          // profile_btn.style.display = "flex";
          // alert('ok! user is logged in');
          uid = user.uid;
          // ...
        } else {
          formOpenBtn.style.display = "flex";
          logout_Btn.style.display = "none";
          // profile_btn.style.display = "none";
          // alert('ok! user is not logged in');
          // User is signed out
          // ...
        }
      });

    


      

      

            



      

