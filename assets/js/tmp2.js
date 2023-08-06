// const formOpenBtn = document.querySelector(".btn-login"),
// logout_Btn = document.querySelector(".btn-logout"),
// home = document.querySelector(".home"),
// formContainer = document.querySelector(".form_container"),
// formCloseBtn = document.querySelector(".form_close"),
// signupBtn = document.querySelector("#signup"),
// loginBtn = document.querySelector("#login"),
// pwShowHide = document.querySelectorAll(".pw_hide"),
// sign_upBtn = document.querySelector("#sign-up"),
// sign_inBtn = document.querySelector("#sign-in"),
// sign_outBtn = document.querySelector("#sign-out");

// // formOpenBtn.addEventListener("click", () => home.classList.add("show"));
// formCloseBtn.addEventListener("click", () => home.classList.remove("show"));
// pwShowHide.forEach((icon) => {
// icon.addEventListener("click", () => {
//   let getPwInput = icon.parentElement.querySelector("input");
//   if (getPwInput.type === "password") {
//     getPwInput.type = "text";
//     icon.classList.replace("uil-eye-slash", "uil-eye");
//   } else {
//     getPwInput.type = "password";
//     icon.classList.replace("uil-eye", "uil-eye-slash");
//   }
// });
// });
// signupBtn.addEventListener("click", (e) => {
// e.preventDefault();
// formContainer.classList.add("active");
// });
// loginBtn.addEventListener("click", (e) => {
// e.preventDefault();
// formContainer.classList.remove("active");
// });



//       // Import the functions you need from the SDKs you need
//       import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
//       import { getDatabase, set, ref, update, } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";
//       import { getAuth, createUserWithEmailAndPassword,signInWithEmailAndPassword,onAuthStateChanged,signOut  } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
//       import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-analytics.js";
//       // TODO: Add SDKs for Firebase products that you want to use
//       // https://firebase.google.com/docs/web/setup#available-libraries
    
//       // Your web app's Firebase configuration
//       // For Firebase JS SDK v7.20.0 and later, measurementId is optional
//       const firebaseConfig = {
//         apiKey: "AIzaSyCRhnIOB6hPf6YYs0RuJ-qBfenWP3iNBj0",
//         authDomain: "filmwhiz.firebaseapp.com",
//         databaseURL: "https://filmwhiz-default-rtdb.asia-southeast1.firebasedatabase.app",
//         projectId: "filmwhiz",
//         storageBucket: "filmwhiz.appspot.com",
//         messagingSenderId: "119069805650",
//         appId: "1:119069805650:web:1ebf405505f890ff35238b",
//         measurementId: "G-JRMWJS8WCB"
//       };
    
//       // Initialize Firebase
//       const app = initializeApp(firebaseConfig);
//       const database = getDatabase(app);
//       const auth = getAuth();
//       const analytics = getAnalytics(app);
//     //   const sign_upBtn = document.querySelector("#sign-up");
    
//       sign_upBtn.addEventListener('click',(e) => {

//         let s_password=document.querySelector("#pass-word").value,
//             s_confirmpassword=document.querySelector("#confirm-password").value;
//         if(s_password != s_confirmpassword) {
//             alert("Password didn't match!");
//         }
//         else {
//         var username = document.getElementById('user-name').value;
//         var email = document.getElementById('e-mail').value;
//         var password = document.getElementById('confirm-password').value;
    
//         createUserWithEmailAndPassword(auth, email, password)
//             .then((userCredential) => {
//             // Signed in 
//             const user = userCredential.user;

//             set(ref(database, 'users/' + user.uid),{
//                 username: username,
//                 email: email
//             })
//             alert('user created');
//             // ...
//             })
//             .catch((error) => {
//             const errorCode = error.code;
//             const errorMessage = error.message;
    
//             alert(errorMessage);
//             // ..
        
//         });
//     }
//     });

//     formOpenBtn.addEventListener("click", () => {
//       onAuthStateChanged(auth, (user) => {
//         if (user) {
          
//           formOpenBtn.style.display = "none";
//           logout_Btn.style.display = "flex";

//           const uid = user.uid;
//           alert('user is already logged in');
//           sign_outBtn.addEventListener("click", () => {
//             const auth = getAuth();
//             signOut(auth).then(() => {
    
//                 formOpenBtn.style.display = "flex";
//                 logout_Btn.style.display = "none";
    
//                 alert('user logged out');
//                 // Sign-out successful.
//             }).catch((error) => {
//                 const errorCode = error.code;
//                 const errorMessage = error.message;
    
//                 alert(errorMessage);
//                 // An error happened.
//             });
//           });
//           // ...
//         } else {
//           alert('user is not logged in');
//           home.classList.add("show");
//           sign_inBtn.addEventListener("click", () => {
//             var email = document.getElementById('login-email').value;
//             var password = document.getElementById('login-password').value;
//             signInWithEmailAndPassword(auth, email, password)
//              .then((userCredential) => {
//                 // Signed in 
//                 const user = userCredential.user;
                
//                 const dt = new Date();
//                 update(ref(database, 'users/' + user.uid),{
//                     last_login: dt,
//                 })
    
//                 formOpenBtn.style.display = "none";
//                 logout_Btn.style.display = "flex";
//                 home.classList.remove("show");
                
//                 alert('user logged in');
//                 // ...
//              })
//              .catch((error) => {
//                 const errorCode = error.code;
//                 const errorMessage = error.message;
    
//                 alert(errorMessage);
//              });
//         });
//           // User is signed out
//           // ...
//         }
//       });
//     });
    
//     // home.classList.add("show")

    
//     // const uid=null;

    
    


//       // sign_outBtn.addEventListener("click", () => {
//       //   const auth = getAuth();
//       //   signOut(auth).then(() => {

//       //       formOpenBtn.style.display = "flex";
//       //       logout_Btn.style.display = "none";

//       //       alert('user logged out');
//       //       // Sign-out successful.
//       //   }).catch((error) => {
//       //       const errorCode = error.code;
//       //       const errorMessage = error.message;

//       //       alert(errorMessage);
//       //       // An error happened.
//       //   });
//       // });
