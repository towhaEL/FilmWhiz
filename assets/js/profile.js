"use strict";

      import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
      import { getDatabase, set, ref, update, remove, get, child } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";
      import { getAuth,EmailAuthProvider, createUserWithEmailAndPassword,signInWithEmailAndPassword,onAuthStateChanged,signOut,updatePassword,reauthenticateWithCredential  } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
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
      const analytics = getAnalytics(app);
      // Variables
      const movieId = window.localStorage.getItem("movieId");
      const userId = window.localStorage.getItem("uid");
      const userName = window.localStorage.getItem("user_name"); 

        var first_name, last_name, user_email, user_phone;


        const pageContent = document.querySelector("[profile-content]");

        const profileDetail = document.createElement("div");
        profileDetail.innerHTML = `
        <!-- <h1 class="mb-5">Account Settings</h1> -->
        <div class="bg-white shadow rounded-lg d-block d-sm-flex">
            <div class="profile-tab-nav border-right">
                <div class="p-4">
                    <div class="img-circle text-center mb-3">
                        <img src="assets/images/avatar/avatar7.png" alt="Image" class="shadow">
                    </div>
                    <h4 class="text-center">${userName}</h4>
                </div>
                <div class="nav flex-column nav-pills" id="v-pills-tab" role="tablist" aria-orientation="vertical">
                    <a class="nav-link active" id="account-tab" data-toggle="pill" href="#account" role="tab" aria-controls="account" aria-selected="true">
                        <i class="fa fa-home text-center mr-1"></i> 
                        Account
                    </a>
                    <a class="nav-link" id="password-tab" data-toggle="pill" href="#password" role="tab" aria-controls="password" aria-selected="false">
                        <i class="fa fa-key text-center mr-1"></i> 
                        Password
                    </a>
                    <!-- <a class="nav-link" id="security-tab" data-toggle="pill" href="#security" role="tab" aria-controls="security" aria-selected="false">
                        <i class="fa fa-user text-center mr-1"></i> 
                        Security
                    </a> -->
                    <a class="nav-link" id="application-tab" data-toggle="pill" href="#application" role="tab" aria-controls="application" aria-selected="false">
                        <i class="fa fa-book text-center mr-1"></i> 
                        Term & Conditions
                    </a>
                    <a class="nav-link" id="notification-tab" data-toggle="pill" href="#notification" role="tab" aria-controls="notification" aria-selected="false">
                        <i class="fa fa-ticket text-center mr-1"></i> 
                        Feedbacks
                    </a>
                </div>
            </div>
            <div class="tab-content p-4 p-md-5" id="v-pills-tabContent">
                <div class="tab-pane fade show active" id="account" role="tabpanel" aria-labelledby="account-tab">
                    <h3 class="mb-4">Account Settings</h3>
                    <div class="row">
                        <div class="col-md-6">
                            <div class="form-group">
                                  <label>First Name</label>
                                  <input type="text" class="form-control" id="first-name" >
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group">
                                  <label>Last Name</label>
                                  <input type="text" class="form-control" id="last-name" >
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group">
                                  <label>Email</label>
                                  <input type="text" class="form-control" id="user-email" >
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group">
                                  <label>Phone number</label>
                                  <input type="text" class="form-control" id="user-phone" >
                            </div>
                        </div>
                        
                    </div>
                    <div>
                        <button class="btn btn-primary" id="update-profile">Update</button>
                        <button class="btn btn-light" id="refresh-profile">Cancel</button>
                    </div>
                </div>
                <div class="tab-pane fade" id="password" role="tabpanel" aria-labelledby="password-tab">
                    <h3 class="mb-4">Password Settings</h3>
                    <div class="row">
                    <div class="col-md-6">
                        <div class="form-group">
                          <label>Old password</label>
                          <input type="password" id="old-password" class="form-control">
                        </div>
                    </div>

                    </div>
                    <div class="row">
                        <div class="col-md-6">
                            <div class="form-group">
                                  <label>New password</label>
                                  <input type="password" id="new-password" class="form-control">
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group">
                                  <label>Confirm new password</label>
                                  <input type="password" id="confirm-password" class="form-control">
                            </div>
                        </div>
                    </div>
                    <div>
                        <button class="btn btn-primary" id="refresh-password">Update</button>
                    </div>
                </div>
                <div class="tab-pane fade" id="security" role="tabpanel" aria-labelledby="security-tab">
                    <h3 class="mb-4">Security Settings</h3>
                    <div class="row">
                        <div class="col-md-6">
                            <div class="form-group">
                                  <label>Login</label>
                                  <input type="text" class="form-control">
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group">
                                  <label>Two-factor auth</label>
                                  <input type="text" class="form-control">
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group">
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" value="" id="recovery">
                                    <label class="form-check-label" for="recovery">
                                    Recovery
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <button class="btn btn-primary">Update</button>
                        <button class="btn btn-light">Cancel</button>
                    </div>
                </div>
                <div class="tab-pane fade application" id="application" role="tabpanel" aria-labelledby="application-tab">
                    <h3 class="mb-4">Term & Conditions</h3>
                    <div class="row">
                        <div class="col-md-10">
                            <div class="form-group">
                                <div class="form-check">
                                    <p>
                                    <h5>Privacy</h5>
                                    Please review our Privacy Notice, which also governs your use of any FilmWhiz Service, to understand our practices.
                                    
                                    <br><br><h5>Electronic Communications</h5>
                                    When you use any FilmWhiz Service or send e-mails to us, you are communicating with us electronically. You consent to receive communications from us electronically. We will communicate with you by e-mail or by posting notices on this site or through the other FilmWhiz Services. You agree that all agreements, notices, disclosures and other communications that we provide to you electronically satisfy any legal requirement that such communications be in writing.
                                    
                                    <br><br><h5>Copyright</h5>
                                    All content included on this site in or made available through any FilmWhiz Service, such as text, graphics, logos, button icons, images, audio clips, video clips, digital downloads, data compilations, and software, is the property of FilmWhiz or its content suppliers and protected by United States and international copyright laws. The compilation of all content included in or made available through any FilmWhiz Service is the exclusive property of FilmWhiz and protected by U.S. and international copyright laws. All software used in any FilmWhiz Service is the property of FilmWhiz or its software suppliers and protected by United States and international copyright laws.
                                    
                                    <br><br><h5>Trademarks</h5>
                                    FilmWhiz and STARMETER are registered trademarks, and the FilmWhiz logo, FilmWhizPRO, MOVIEMETER, and other marks indicated in any FilmWhiz Services are trademarks of FilmWhiz in the United States and/or other countries. Other FilmWhiz graphics, logos, page headers, button icons, scripts, and service names are trademarks or trade dress of FilmWhiz. FilmWhiz's trademarks and trade dress may not be used in connection with any product or service that is not FilmWhiz's, in any manner that is likely to cause confusion among customers, or in any manner that disparages or discredits FilmWhiz. All other trademarks not owned by FilmWhiz that appear on this site or in any FilmWhiz Service are the property of their respective owners, who may or may not be affiliated with, connected to, or sponsored by FilmWhiz.
                                    
                                    <br><br><h5>License and Site Access</h5>
                                    Subject to your compliance with these Conditions of Use and your payment of any applicable fees, FilmWhiz or its content providers grants you a limited, non-exclusive, non-transferable, non-sublicenseable license to access and make personal and non-commercial use of the FilmWhiz Services, including digital content available through the FilmWhiz Services, and not to download (other than page caching) or modify this site, or any portion of it, except with express written consent of FilmWhiz. Additional license terms may be found in the Terms. You will use all FilmWhiz Services in compliance with all applicable laws.
                                    </p>
                                    <input class="form-check-input" type="checkbox" value="true" id="app-check" checked>
                                    <label class="form-check-label" for="app-check">
                                    <h5>As a user of the system you have already accepted</h5>
                                    </label>
                                </div>
                                
                            </div>
                        </div>
                    </div>
                    
                </div>
                <div class="tab-pane fade" id="notification" role="tabpanel" aria-labelledby="notification-tab">

                <div class="row">
                <div class="col-md-9">

                <div class="feedback-box">
                    <div class="content">
                    
                      
                        <form class="feedback">
                          <label>
                            <h2>
                              How satisfied are you with our overall system?
                            </h2>
                          </label>
                          
                          <textarea property="comment"
                                 cols="30" rows="10"
                                 placeholder="Please tell us your feedback..." id="feedback-area"></textarea>
                                           
                          <div>
                            <button class="btn btn-primary" id="send-feedback">
                              Send Feedback
                            </button>
                          </div>
                        </form>
                      </main>
                    </div>
                    
                </div>

                </div>
                    <div>

              </div>
            </div>
        </div>
        `;

        pageContent.querySelector(".container").appendChild(profileDetail);

        let updateProfile = document.querySelector("#update-profile");
        let refreshProfile = document.querySelector("#refresh-profile");
        let updatePass = document.querySelector("#update-password");
        let refreshPassword = document.querySelector("#refresh-password");
        let sendFeedback = document.querySelector("#send-feedback");


        // document.getElementById("first-name").value = user_email;
        const dbref = ref(database);
        get(child(dbref, "usersInfo/" + userId + "/" ))
              .then((Snap_shot)=>{
                if (Snap_shot.exists()) {
                    first_name = Snap_shot.val().FirstName;
                    last_name = Snap_shot.val().LastName;
                    user_email = Snap_shot.val().UserEmail;
                    user_phone = Snap_shot.val().UserPhone;
                }
                document.getElementById("first-name").value = first_name;
                document.getElementById("last-name").value = last_name;
                document.getElementById("user-email").value = user_email;
                document.getElementById("user-phone").value = user_phone;
              })
        updateProfile.addEventListener('click',(e) => {
            let firstName=document.querySelector("#first-name").value;
            let lastName=document.querySelector("#last-name").value;
            let userEmail=document.querySelector("#user-email").value;
            let userPhone=document.querySelector("#user-phone").value;
            set(ref(database, "usersInfo/" + userId + "/" ),{
                FirstName : firstName,
                LastName : lastName,
                UserEmail : userEmail,
                UserPhone : userPhone
              })
              location.reload();
        });
        refreshProfile.addEventListener('click',(e) => {
                document.getElementById("first-name").value = first_name;
                document.getElementById("last-name").value = last_name;
                document.getElementById("user-email").value = user_email;
                document.getElementById("user-phone").value = user_phone;

        });

        refreshPassword.addEventListener('click',(e) => {
            let newPassword=document.querySelector("#new-password").value;
            let confirmPassword=document.querySelector("#confirm-password").value;
            let userProvidedPassword=document.querySelector("#old-password").value;

            if(newPassword != confirmPassword) {
                alert("Password didn't match!");
            }
            else {
                const auth = getAuth();
                const user = auth.currentUser;
                alert(userProvidedPassword)
                
                const credential = EmailAuthProvider.credential(
                    auth.currentUser.email,
                    userProvidedPassword
                )
                reauthenticateWithCredential(
                    auth.currentUser, 
                    credential
                )

                updatePassword(user, newPassword).then(() => {
                    alert("password updated!")
                }).catch((error) => {
                    alert(error);
                });
            }
        });

        sendFeedback.addEventListener('click',(e) => {
            let feedbackArea=document.querySelector("#feedback-area").value;
            let dt = new Date();
            alert("gg")

            const auth = getAuth();
            const userEmail = auth.currentUser.email;  

            if(feedbackArea != "") {
                set(ref(database, "usersFeedbacks/" + userId + "/" + dt),{
                    user_email: userEmail,
                    feedback: feedbackArea,
                    feedbackDate: dt,
                })
    //   location.reload();

            }  
            
            // const dbref = ref(database);
            // get(child(dbref, "users/" + userId + "/"))
            // .then((snapshot)=>{
            //     if (snapshot.exists()) {
            //         const userEmail = snapshot.val().email;  
                    
            //     }
            // })

        });

        