"use strict";

// import all components and functions

import { sidebar } from "./sidebar.js";
import { api_key, imageBaseURL, fetchDataFromServer } from "./api.js";
import { createMovieCard } from "./movie-card.js";
import { search } from "./search.js";
import { showFavourites } from "./favourite.js";

const pageContent = document.querySelector("[page-content]");
const show_favourite = document.getElementById("show-favourite");

show_favourite.onclick = function() { 
  showFavourites();
}
sidebar();

// Home page sections (Top rated, Upcoming, Trending Movies)
const homePageSections = [
  {
    title: "Upcoming Movies",
    path: "/movie/upcoming",
  },
  {
    title: "This Week Trending Movies",
    path: "/trending/movie/week",
  },
  {
    title: "Top Rated Movies",
    path: "/movie/top_rated",
  },
];

// Fetch all genres then change genre format
const genreList = {
  // create genre string from genre_id eg: [23, 43] -> "Action, Romance".
  asString(genreIdList) {
    let newGenreList = [];

    for (const genreId of genreIdList) {
      this[genreId] && newGenreList.push(this[genreId]);
      // this.genreList;
    }
    return newGenreList.join(", ");
  },
};

fetchDataFromServer(
  `https://api.themoviedb.org/3/genre/movie/list?api_key=${api_key}`,
  function ({ genres }) {
    for (const { id, name } of genres) {
      genreList[id] = name;
    }

    fetchDataFromServer(
      `https://api.themoviedb.org/3/movie/popular?api_key=${api_key}&language=en-US&page=1`,
      heroBanner
    );
  }
);

const heroBanner = function ({ results: movieList }) {
  const banner = document.createElement("section");
  banner.classList.add("banner");
  banner.ariaLabel = "Popular Movies";

  banner.innerHTML = `
    <div class="banner-slider"></div>

    <div class="slider-control">
      <div class="control-inner">
      </div>
    </div>
  `;

  let controlItemIndex = 0;

  for (const [index, movie] of movieList.entries()) {
    const {
      backdrop_path,
      title,
      release_date,
      genre_ids,
      overview,
      poster_path,
      vote_average,
      id,
    } = movie;

    const sliderItem = document.createElement("div");
    sliderItem.classList.add("slider-item");
    sliderItem.setAttribute("slider-item", "");

    sliderItem.innerHTML = `
      <img
        src="${imageBaseURL}w1280${backdrop_path}"
        alt="${title}"
        class="img-cover"
        loading="${index === 0 ? "eager" : "lazy"}"
      />
      <div class="banner-content">
        <h2 class="heading">${title}</h2>

        <div class="meta-list">
          <div class="meta-item">${release_date.split("-")[0]}</div>
          <div class="meta-item card-badge">${vote_average.toFixed(1)}</div>
        </div>
        <p class="genre">${genreList.asString(genre_ids)}</p>
        <p class="banner-text">${overview}</p>

        <a href="./detail.html" class="btn" id="details-btn" onclick="getMovieDetail(${id})">
          <img
            src="./assets/images/more.png"
            width="32"
            height="32"
            aria-hidden="true"
            alt="play circle"
          />
          <span class="span">More details</span>
        </a>
      </div>
    `;

    banner.querySelector(".banner-slider").appendChild(sliderItem);

    const controlItem = document.createElement("button");
    controlItem.classList.add("poster-box", "slider-item");
    controlItem.setAttribute("slider-control", `${controlItemIndex}`);

    controlItemIndex++;

    controlItem.innerHTML = `
      <img
        src="${imageBaseURL}w154${poster_path}"
        alt="Slide to ${title}"
        loading="lazy"
        draggable="false"
        class="img-cover"
      />
    `;
    banner.querySelector(".control-inner").appendChild(controlItem);
  }
  pageContent.appendChild(banner);

  addHeroSlide();

  // fetch data from home page sections (top rated, upcoming,trending).
  for (const { title, path } of homePageSections) {
    fetchDataFromServer(
      `https://api.themoviedb.org/3${path}?api_key=${api_key}&page=1`,
      createMovieList,
      title
    );
  }
};

// Hero Slider Functionality
const addHeroSlide = function () {
  const sliderItems = document.querySelectorAll("[slider-item]");
  const sliderControls = document.querySelectorAll("[slider-control]");

  let lastSliderItem = sliderItems[0];
  let lastSliderControl = sliderControls[0];
  let currentSliderIndex = 0;

  lastSliderItem.classList.add("active");
  lastSliderControl.classList.add("active");

  const sliderStart = function () {
    const controlIndex = Number(this.getAttribute("slider-control"));
    if (currentSliderIndex !== controlIndex) {
      lastSliderItem.classList.remove("active");
      lastSliderControl.classList.remove("active");

      sliderItems[controlIndex].classList.add("active");
      this.classList.add("active");

      lastSliderItem = sliderItems[controlIndex];
      lastSliderControl = this;
      currentSliderIndex = controlIndex;
    }
  };

  const slideToNext = function () {
    const nextIndex = (currentSliderIndex + 1) % sliderItems.length;
    sliderControls[nextIndex].click();
  };

  // Automatic sliding every 5 seconds
  setInterval(slideToNext, 5000);

  addEventOnElements(sliderControls, "click", sliderStart);
};

const createMovieList = function ({ results: movieList }, title) {
  const movieListElem = document.createElement("section");
  movieListElem.classList.add("movie-list");
  movieListElem.ariaLabel = `${title}`;

  movieListElem.innerHTML = `
    <div class="title-wrapper">
      <h3 class="title-large">${title}</h3>
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
  pageContent.appendChild(movieListElem);
};

search();

// Sign in
// const formOpenBtn = document.querySelector(".btn-login"),
//   home = document.querySelector(".home"),
//   formContainer = document.querySelector(".form_container"),
//   formCloseBtn = document.querySelector(".form_close"),
//   signupBtn = document.querySelector("#signup"),
//   loginBtn = document.querySelector("#login"),
//   pwShowHide = document.querySelectorAll(".pw_hide"),
//   sign_upBtn = document.querySelector("#sign-up");

// formOpenBtn.addEventListener("click", () => home.classList.add("show"));
// formCloseBtn.addEventListener("click", () => home.classList.remove("show"));
// pwShowHide.forEach((icon) => {
//   icon.addEventListener("click", () => {
//     let getPwInput = icon.parentElement.querySelector("input");
//     if (getPwInput.type === "password") {
//       getPwInput.type = "text";
//       icon.classList.replace("uil-eye-slash", "uil-eye");
//     } else {
//       getPwInput.type = "password";
//       icon.classList.replace("uil-eye", "uil-eye-slash");
//     }
//   });
// });
// signupBtn.addEventListener("click", (e) => {
//   e.preventDefault();
//   formContainer.classList.add("active");
// });
// loginBtn.addEventListener("click", (e) => {
//   e.preventDefault();
//   formContainer.classList.remove("active");
// });


// sign_upBtn.addEventListener("click", () => {
//     let s_password=document.querySelector("#pass-word").value,
//         s_confirmpassword=document.querySelector("#confirm-password").value;
//     if(s_password != s_confirmpassword) {
//         alert("Password didn't match!");
//     }
// });





