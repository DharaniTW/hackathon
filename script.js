//creating html element
document.body.innerHTML = `<nav class="row">
<div class="nav-wrapper">
    <div class="col s12">
        <a href="#" class="brand-logo">Anime</a>
        <ul id="nav-mobile" class="right hide-on-med-and-down">
        </ul>
    </div>
</div>
</nav>
<div class="container">
<div class="row">
    <form id="search_form" class="col s12">
        <div class="row">
            <div class="input-field col s6">
                <input placeholder="Series" name="search" id="search" type="text" class="validate">
                <label for="search">Search</label>
            </div>
        </div>
    </form>
</div>
</div>
<div id="search-results" class="container">

</div>`;
const base_url = "https://api.jikan.moe/v3";

function searchAnime(event) {
  event.preventDefault();

  const form = new FormData(this);
  const query = form.get("search");
  //   const fetchData = async () => {
  //     try {
  //       const response = await fetch(
  //         `${base_url}/search/anime?q=${query}&page=1`
  //       );
  //       const data = await response.json();
  //       console.log(data);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  //   fetchData();

  fetch(`${base_url}/search/anime?q=${query}&page=1`)
    .then((res) => res.json())

    .then(updateDom)
    .catch((err) => console.warn(err.message));
}

function updateDom(data) {
  const searchResults = document.getElementById("search-results");

  const animeByCategories = data.results.reduce((acc, anime) => {
    const { type } = anime;
    if (acc[type] === undefined) acc[type] = [];
    acc[type].push(anime);
    return acc;
  }, {});

  searchResults.innerHTML = Object.keys(animeByCategories)
    .map((key) => {
      const animesHTML = animeByCategories[key]
        .sort((a, b) => a.episodes - b.episodes)
        .map((anime) => {
          return `
                    <div class="card">
                        <div class="card-image">
                            <img src="${anime.image_url}">
                        </div>
                        <div class="card-content">
                            <span class="card-title">${anime.title}</span>
                            <p >START DATE:${anime.start_date}</p><span>END DATE:${anime.end_date}</span>
                            <p>TYPE:${anime.type}</p>
                            <p >SCORE:${anime.score}</p>
                           
                        </div>
                       
                    </div>
                `;
        })
        .join("");

      return `
                <section>
                   
                    <div class="anime-row">${animesHTML}</div>
                </section>
            `;
    })
    .join("");
}

function pageLoaded() {
  const form = document.getElementById("search_form");
  form.addEventListener("submit", searchAnime);
}

window.addEventListener("load", pageLoaded);
