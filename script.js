const BASE_URL = "https://imdb-api.com/en/API";
const apiKey1 = "k_llv9171e";
const apiKey2 = "k_v02me0d7";
const apiKey3 = "k_aaaaaaaa";
let selectedList = "MostPopularMovies";

const loadingScreen = () => {
  $(".container").html(`
    <div class="loading">
      <div class="loader"></div>
    </div>`);
};

//search movie title and display the list of the result
const searchMovie = async (keyword) => {
  const xhr = new XMLHttpRequest();

  xhr.open("GET", `${BASE_URL}/SearchMovie/${apiKey1}/${keyword}`, true);

  xhr.onprogress = loadingScreen();

  xhr.onload = () => {
    if (xhr.status == 200) {
      const data = JSON.parse(xhr.response);
      $(".container").empty().append("<div class='movie-list'></div>");
      if (data.results.length > 0) {
        $(".container").empty().append("<div class='movie-list'></div>");
        $(".movie-list").html(displayMovie(data.results));
        $("#text-field").val("");
      } else {
        $(".movie-list").append(`
          <div class="error">
            <h1>no result found try another one!</h1>  
          </div>`);
      }
    }
  };

  xhr.send();
};

//filter movie-list based on the input when click
$("#search-btn").on("click", async () => {
  searchMovie($("#text-field").val());
});

//select category of the movie-list
$(".selection > h3").on("click", ({ target: { id } }) => {
  selectedList = id;
  displayMovieList(selectedList);
  $(".selection > h3").each((i, item) => {
    if (item.id == selectedList) {
      $(`#${item.id}`).addClass("selected");
    } else {
      $(`#${item.id}`).removeClass("selected");
    }
  });
});

//display movie based on the category by default it's by MostPopularMovies
const displayMovieList = async (selected) => {
  const xhr = new XMLHttpRequest();

  xhr.open("GET", `${BASE_URL}/${selected}/${apiKey2}`, true);

  xhr.onprogress = loadingScreen();

  xhr.onload = () => {
    if (xhr.status == 200) {
      const { items } = JSON.parse(xhr.response);
      console.log(items);
      $(".container").empty().append("<div class='movie-list'></div>");

      $(window).scrollTop(0);

      $(".movie-list").html(displayMovie(items));
    }
  };

  xhr.send();
};

//container of every single movie displayed in movie-list
const displayMovie = (data) => {
  return data
    .map((item) => {
      const { title, image, imDbRating, id, rank } = item;
      return `
        <div class="single-movie" onclick="displayMovieInfo('${id}')">
            <div class="rating">
                ${rank ? `<h4 class="rank">${rank}</h4>` : ""}
               ${
                 imDbRating
                   ? `<h4>
                   ${imDbRating} <i class="fa-solid fa-star"></i>
                 </h4>`
                   : ""
               } 
            </div>
            <img src=${image} alt="movie image"/>
            <h3>${title}</h3>
        </div>`;
    })
    .join("");
};

//info of the movie you selected
const displayMovieInfo = async (id) => {
  const xhr = new XMLHttpRequest();

  xhr.open("GET", `${BASE_URL}/Title/${apiKey2}/${id}`, true);

  xhr.onprogress = loadingScreen();

  xhr.onload = async () => {
    if (xhr.status == 200) {
      const data = JSON.parse(xhr.response);

      $(".container").empty().append("<div class='movie-info'></div>");

      $(window).scrollTop(0);

      const {
        genreList,
        year,
        title,
        actorList,
        plot,
        directorList,
        writerList,
        releaseDate,
        runtimeStr,
        imDbRating,
        imDbRatingVotes,
        similars,
        image,
        id,
      } = data;

      $(".movie-info").html(`
        <div class="cast-and-poster">
          <div class="poster">
            <img src=${image} alt="poster image"/>
            <div class="more-info">
              <h3>${title} <span>${year}</span></h3>
              <div>
                ${displayGenre(genreList)}
              </div>
              <button onclick="showTrailer('${id}')">
                watch trailer
              </button>
              <button onclick="showAllReviews('${id}')">
                view reviews
              </button>
              <p>${imDbRating} <i class="fa-solid fa-star"></i></p>
            </div>
          </div>
          <div class="casts">
            ${displayCasts(actorList)}
          </div>
        </div>
        <div class="others">
          <div class="plot">
            <h3>PLOT of the Story</h3>
            <p>${plot}</p>
          </div>
          <div class="credits">
            <div>
              <p>directed by:</p>
              <p>${displayDirectors(directorList)}</p>
            </div>
            <div>
              <p>written by:</p>
              <p>${displayWriters(writerList)}</p>
            </div>
            <div>
              <p>releaseDate:</p>
              <p>${releaseDate}</p>
            </div>
            <div>
              <p>runtime:</p>
              <p>${runtimeStr}</p>
            </div>
            <div>
              <p>imDbRatingVotes:</p>
              <p>${imDbRatingVotes}</p>
            </div>
          </div>
        </div>
        <h3 class="similar-header">Related to this topic</h3>
        <div class="related-movie">
            ${displayRelated(similars)}
        </div>`);
    }
  };

  xhr.send();
};

//display genre of the movie you selected
const displayGenre = (data) =>
  data.map(({ value }) => `<p>${value}</p>`).join("");

//display casts of the movie you selected
const displayCasts = (data) =>
  data
    .map((cast) => {
      const { image, asCharacter, name } = cast;
      console.log(asCharacter);
      return `
        <div>
          <img src=${image} alt="cast image"/>
          <p>${name}</p>
          <p>${asCharacter}</p>
        </div>`;
    })
    .join("");

//display related movie you selected
const displayRelated = (data) =>
  data
    .map(({ image, title, imDbRating, id }) => {
      return `
    <div>
      <img src=${image} alt="poster image" onclick="displayMovieInfo('${id}')"/>
      <div>
          <p>${title}</p>
          <p>${imDbRating}  <i class="fa-solid fa-star"></i></p>
      </div>
    </div>`;
    })
    .join("");

//display the directors of the movie you selected
const displayDirectors = (data) => data.map(({ name }) => name).join(", ");

//display the writers of the movie you selected
const displayWriters = (data) => data.map(({ name }) => name).join(", ");

//fetch the reviews of the movie you selected
const getReviews = async (id) => {
  const xhr = new XMLHttpRequest();

  xhr.open("GET", `${BASE_URL}/Reviews/${apiKey1}/${id}`, true);

  xhr.onload = () => {
    if (xhr.status == 200) {
      const data = JSON.parse(xhr.response);
      displayReviews(data.items);
    }
  };

  xhr.send();
};

//display reviews on the movie you selected
const displayReviews = (data) => {
  $(".movie-info").append("<div class='reviews'></div>");
  $(".reviews").append(`
  <button class="close-btn" onclick="closeReviews()">
    <i class="fas fa-times"></i>
  </button>`);

  if (data.length > 0) {
    const reviews = data.map((item, i) => {
      const { username, title, date, content } = item;
      return `
      <div class="review">
        <h3>${username}</h3>
        <h5>${title}</h5>
        <p id="${i}">${content}</p>
        <p class="date">${date}</p>
      </div>`;
    });

    $(".reviews").append(reviews.join(""));
  } else {
    $(".reviews").append(`
      <div class="no-reviews error">
        <h1>no reviews yet!</h1>  
      </div>`);
  }
};

//check if div with reviews class is included in movie-info then we will change it's display,
// if else then we will fetch the data and display it.
const showAllReviews = (id) => {
  if ($(".movie-info").find(".reviews").length > 0) {
    $(".reviews").css("display", "block");
  } else {
    getReviews(id);
  }
};

//hide the reviews division for later use :p
const closeReviews = () => {
  $(".reviews").css("display", "none");
  $(window).scrollTop(0);
};

//check if div with trailer class is included in container then we will change it's display,
// if else then we will fetch the data and display it.
const showTrailer = (id) => {
  if ($(".container").find(".trailer").length > 0) {
    $(".trailer").css("display", "grid");
  } else {
    watchTrailer(id);
  }
};

//fetch the trailer of the movie you selected and display it after you click
const watchTrailer = async (id) => {
  const xhr = new XMLHttpRequest();

  xhr.open("GET", `${BASE_URL}/Trailer/${apiKey1}/${id}`, true);

  xhr.onload = () => {
    if (xhr.status == 200) {
      const data = JSON.parse(xhr.response);
      $(".container").append("<div class='trailer'></div>");

      if (data.linkEmbed) {
        $(".trailer").html(`
        <div>
          <h1>${data.title}</h1>
          <iframe
            src="${data.linkEmbed}?autoplay=false&width=500"
            width="500"
            height="300"
            allowfullscreen="true"
            mozallowfullscreen="true"
            webkitallowfullscreen="true"
            frameborder="no"
            scrolling="no"
          ></iframe>
        </div>`);
      } else {
        $(".trailer").append(`
          <div class="error">
            <h1>no trailer available!</h1>  
          </div>`);
      }

      $(".trailer").on("click", () => {
        $(".trailer").css("display", "none");
      });
    }
  };

  xhr.send();
};

displayMovieList(selectedList);
