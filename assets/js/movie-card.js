"use strict";

import { imageBaseURL } from "./api.js";

export function createMovieCard(movie) {
  const { poster_path, title, vote_average, release_date, id } = movie;

  if(poster_path==null) return;

  const card = document.createElement("div");
  card.classList.add("movie-card");

  card.innerHTML = `
    <figure class="poster-box card-banner">
      <img
        src="${imageBaseURL}w342${poster_path}"
        alt="${title}"
        class="img-cover"
        loading="lazy"
      />
    </figure>

    <h4 class="title">${title}</h4>

    <div class="meta-list">
      <div class="meta-item">
        <img
          src="./assets/images/star.png"
          width="20"
          height="20"
          loading="lazy"
          alt="rating"
        />
        <span class="span">${vote_average.toFixed(1)}</span>
      </div>

      <div class="card-badge">${release_date.split("-")[0]}</div>
    </div>
    <div class="card-link"></div>
  `;

  const userId = window.localStorage.getItem("uid");
  const card_link = document.createElement("div");

  if(userId != "null") {
    card_link.innerHTML = `
     <a href="./detail.html" class="card-btn" title="${title}" onclick="getMovieDetail(${id})"></a>
    `;
  }
  else {
    card_link.innerHTML = `
     <a href="" class="card-btn" title="${title}" onclick="getMovieDetail(${id})"></a>
    `;
  }

  card.querySelector(".card-link").appendChild(card_link);
  return card;
}
