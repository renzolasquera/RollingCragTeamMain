const parametroPaginaPrincipal= new URLSearchParams(location.search)
const idGame=parametroPaginaPrincipal.get("id")

let favoriteButton=document.querySelector('#favorite-button')
let gameCategory=document.querySelector('#game-category')
let gameTitle=document.querySelector('#game-title')
let gameVideo=document.querySelector('#game-video')
let gameDesc=document.querySelector('#game-desc')

let contenedor = document.querySelector("#contenedorJuego");


const traerDatosJuegos=()=>{
//encontrar el juego
let game=games.find(item=>item.id==idGame)
if(game){
  //si existe el juego, se crea la tarjeta

  let detalleJuego = document.createElement("div")
  let tarjeta = `<div class="row p-3 row-cols-1 row-cols-lg-2 position-relative">
  <div class="col d-flex justify-content-center align-items-center">
  <span class="text-warning favorite-badge fs-1" id="favorite-button" onclick="toggleFavorite(${game.id})"><i class="bi bi-star${session.favorites.find(fav=>fav.id===game.id)?'-fill':''}" id="favorite-star"></i></span>
    <iframe
      width="100%"
      height="309"
      src="${game.video}"
      title="${game.title}"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowfullscreen
      class="mt-5 mt-lg-0"
      id="game-video"
    ></iframe>
  </div>
  <article class="col">
    <header>
      <span class="badge rounded-pill text-bg-${game.category.toLowerCase()} mt-3" id="game-category">
        ${game.category}
      </span>
      <h1 class="text-center" id="game-title">${game.title}</h1>
    </header>
    <main>
      <p id="game-desc">
      ${game.description}</p>
    </main>
    <footer class="bg-transparent">
      <a class="btn btn-dewbieviolet w-100 rounded-5" href="/pages/404.html">Buy Game</a>
    </footer>
  </article>
</div> `
detalleJuego.innerHTML=tarjeta;
contenedor.appendChild(detalleJuego)  
  }
else{
  // si no existe el juego, se muestra el siguiente alert
  alert('juego no encontrado')
}
}
traerDatosJuegos()

