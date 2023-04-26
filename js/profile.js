let mainTag=document.querySelector('#main')
if(session.length<1){
    let accessDenied=`
    <div class="vh-100 d-flex justify-content-center align-items-center">
    <div class="alert alert-danger mx-4" role="alert" id="access-denied">
    You need to Log In to view this page
    </div>
    </div>
    `
    mainTag.innerHTML=accessDenied
  }

window.addEventListener("scroll", function(){
    var nav = document.querySelector(".navbar");
    nav.classList.toggle("navbar-color",window.scrollY>0)
})

//load user images
const userPhoto=document.querySelector('.banner__user__img')
const banner=document.querySelector('.banner')

const loadUserImages=()=>{
    userPhoto.style.backgroundImage=`url(${session.photo})`
    banner.style.background=session.banner
}

const changeUserPhotoModal=new bootstrap.Modal(document.getElementById('changeUserPhotoModal'))
const changeBannerModal=new bootstrap.Modal(document.getElementById('changeBannerModal'))

let imgPreview=document.querySelector('#modal-img-preview')
let changeAvatarInput=document.querySelector('#avatarURLInput')

const openEditPhotoModal=()=>{
    changeUserPhotoModal.show()
    imgPreview.src=session.photo
}

function validateURL(urlImage){
    try {
        new URL(urlImage)
        return true
    } catch (err) {
        return false
    }
}

const onChangeImgPreview=()=>{
    if(validateURL(changeAvatarInput.value)){
        document.querySelector('#InvalidURL').style.opacity="0%"
        imgPreview.src=changeAvatarInput.value
    }else{
        document.querySelector('#InvalidURL').style.opacity="100%"
    }
  }

const openEditBannerModal=()=>{
    changeBannerModal.show()
}

const changeAvatar=(event)=>{
    event.preventDefault()

    let users=JSON.parse(localStorage.getItem('users'))
    let logedUserIndex=users.findIndex(user=>user.id==session.id)

        if(validateURL(changeAvatarInput.value)){
            users[logedUserIndex].photo=imgPreview.src
            session.photo=imgPreview.src
            document.querySelector('#InvalidURL').style.opacity="0%"
            localStorage.setItem('users',JSON.stringify(users))
            localStorage.setItem('session',JSON.stringify(session))
        
            loadUserImages()
        
            clearInputs()
            changeUserPhotoModal.hide()
        }else{
            document.querySelector('#InvalidURL').style.opacity="100%"
        }

    
}

const deleteAvatar=()=>{
    if(confirm('Are you sure to delete profile avatar?')){
        let users=JSON.parse(localStorage.getItem('users'))
        let logedUserIndex=users.findIndex(user=>user.id==session.id)
    
        users[logedUserIndex].photo=defaultAvatar.src
        session.photo=defaultAvatar.src
    
        localStorage.setItem('users',JSON.stringify(users))
        localStorage.setItem('session',JSON.stringify(session))
    
        loadUserImages()
    
        clearInputs()
        changeUserPhotoModal.hide()
    }
}

const changeBanner=(value)=>{
    let users=JSON.parse(localStorage.getItem('users'))
    let logedUserIndex=users.findIndex(user=>user.id==session.id)

    let getSelectedBGStyles=''
    if(value==='c'){
        getSelectedBGStyles=document.querySelector('#b-btn-c').value
        
        alert('func encabled () '+getSelectedBGStyles)

        users[logedUserIndex].banner=getSelectedBGStyles
        session.banner=getSelectedBGStyles
    }else{
        getSelectedBGStyles=window.getComputedStyle(document.querySelector(`#b-btn-${value}`)).background
        users[logedUserIndex].banner=getSelectedBGStyles
        session.banner=getSelectedBGStyles
    }
    localStorage.setItem('users',JSON.stringify(users))
    localStorage.setItem('session',JSON.stringify(session))
    loadUserImages()
}

function clearInputs(event){
    changeAvatarInput.value=''
    document.querySelector('#InvalidURL').style.opacity="0%"
}

let favoritesContainer=document.querySelector('#favorites-container')

const loadFavs = () => {
    favoritesContainer.innerHTML = "";

    if(session.favorites.length<1){
        let noFavsMsg=document.createElement('div')
        noFavsMsg.classList='no-favs'
        let content=`You don't have any favorites yet :(`
        noFavsMsg.innerHTML=content
        favoritesContainer.appendChild(noFavsMsg)
    }else{
        session.favorites.forEach((game) => {
          if(game.published){
            let favDetail = document.createElement("div");
            favDetail.className = "game-data d-flex flex-column flex-md-row position-relative";
            let content = `
            <a href="/pages/games.html?id=${game.id}" style="background-image:url(${game.img})" class="game-img">
            <div class="game-card-overlay p-5 w-100 h-100 d-flex align-items-center justify-content-center flex-column-reverse">
              <h2>${game.title}</h2>
              <p>${game.category}</p>
            </div>
            </a>
            <article class="game-info d-flex flex-column justify-content-around">
              <header class="position-relative">
                <span class="badge rounded-pill text-bg-default text-bg-${game.category.toLowerCase()} mb-5 fs-5" id="featured-badge">${game.category}</span>
                <span class="text-warning favorite-badge fs-1" id="favorite-button" onclick="toggleFavorite(${game.id})"><i class="bi bi-star${session.favorites.find(fav=>fav.id===game.id)?'-fill':''}" id="favorite-star"></i></span>
              </header>
              <main>
                <h2 class="mb-2">${game.title}</h2>
                <p>${game.description}</p>
              </main>
              <footer class="bg-transparent justify-content-end">
                <a href="/pages/games.html?id=${game.id}" class="btn btn-outline-light d-block rounded-5">View More...</a>
              </footer>
            </article>
            `;
            
            favDetail.innerHTML = content;
            favoritesContainer.appendChild(favDetail);
          }

      
        });
    }

  };

//load functions
if(session){
    loadUserImages()
    loadFavs()
    let sessionName=session.username.charAt(0).toUpperCase()+session.username.substring(1)
    document.querySelector('#sessionUsername').innerHTML=sessionName
    document.querySelector('#sessionEmail').innerHTML=session.email
    document.querySelector('#sessionUsernameProfile').innerHTML=sessionName+"'s"+' Profile'
  }