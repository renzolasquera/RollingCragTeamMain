let mainTag=document.querySelector('#main')

if(!session.admin){
  let accessDenied=`
  <div class="vh-100 d-flex justify-content-center align-items-center">
  <div class="alert alert-danger mx-4" role="alert" id="access-denied">
  You do not have permission to access this page
  </div>
  </div>
  `
  mainTag.innerHTML=accessDenied
}

function validateURL(urlImage){
  try {
      new URL(urlImage)
      return true
  } catch (err) {
      return false
  }
}

const editGameModal = new bootstrap.Modal(document.getElementById('editGameModal'))

//games table
let gameTableBody=document.querySelector('#game-table__body')

const loadTable=()=>{
  gameTableBody.innerHTML=''

  games.forEach(game=>{
    let tr=document.createElement('tr')

    let content=`
    <th scope="row" class="d-none d-md-table-cell text-center">${game.id}</th>
    <th scope="row">${game.title}</th>
    <td class="text-justify d-none d-md-table-cell">${game.description}</td>
    <td class="d-none d-lg-table-cell"><span class="badge rounded-pill text-bg-default text-bg-${game.category.toLowerCase()}">${game.category}</span></td>
    <td class="text-center fs-4">
        <div class="form-check form-switch d-flex justify-content-center align-items-center">
        <input class="form-check-input" type="checkbox" role="switch" ${game.published?'checked':''} ${game.id==featuredGame.id?'disabled':''} onchange="publish(${game.id})">
        </div>
    </td>
    <td class="text-center fs-3"><i class="bi bi-pencil-square" onclick="showEditGameModal(${game.id})"></i></td>
    <td class="text-center fs-3">${game.id==featuredGame.id?'':`<i class="text-danger mx-1 bi bi-trash-fill" onclick="deleteGame(${game.id})"></i>`}</td>
    `
    tr.innerHTML=content
    gameTableBody.appendChild(tr)
  })
}

const saveGamesInLS=()=>localStorage.setItem('games',JSON.stringify(games))

const publish=(id)=>{
  let foundGame=games.find(game=>game.id==id)
  let foundGameIndex=games.findIndex(game=>game.id==id)

  if(foundGame==featuredGame){
    return alert(`Can't unpublish featured game`)
  }
  foundGame.published= !foundGame.published
  games[foundGameIndex]=foundGame

  // let userContainsFavIndex=users.findIndex(user=>user.favorites.find(fav=>fav.id===foundGame.id).id===foundGame.id)
  // let favGameIndex=users[userContainsFavIndex].favorites.find()
  // users[userContainsFavIndex].favorites[favGameIndex]=foundGame

  loadFeatureOptions()
  selectFeatured()
  saveGamesInLS()
  loadTable()
}

const deleteGame=(id)=>{
  let findGame=games.find(game=>game.id==id)
  let indexgame=games.findIndex(game=>game.id==id)

  let confirmDelete=confirm(`Are you sure to want to delete ${findGame.title} from Dewbie?`)

  confirmDelete?games.splice(indexgame,1):
  localStorage.removeItem('games')
  saveGamesInLS()
  loadFeatureOptions()
  selectFeatured()
  loadTable()
}

const addNewGame=(event)=>{
  event.preventDefault()
  let nameInput=document.querySelector('#game-name')
  let urlInput=document.querySelector('#game-url')
  let descInput=document.querySelector('#game-description')
  let categorySelect=document.querySelector('#game-category')
  let urlImageInput=document.querySelector('#game-imageURL')
  let urlVideoInput=document.querySelector('#video-url')

  if(validateURL(urlImageInput.value) && validateURL(urlInput.value) && validateURL(urlVideoInput.value)){
    let newGame=new game(
      new Date().getTime(),
      nameInput.value,
      descInput.value,
      categorySelect.value,
      urlImageInput.value,
      urlInput.value,
      urlVideoInput.value,
      )
  
    games.push(newGame)
    loadFeatureOptions()
    selectFeatured()
    saveGamesInLS()
    loadTable()
  
    nameInput.value=''
    descInput.value=''
    categorySelect.value='Others'
    urlImageInput.value=''
    urlInput.value=''
    urlVideoInput.value=''
  }else{
    alert('Invalid URL')
  }

}

let gameData=null

const showEditGameModal=(id)=>{
  editGameModal.show()
  gameData=games.find(game=>game.id==id)

  let imgPreview=document.querySelector('#modal-img-preview')

  let nameInput=document.querySelector('#game-name__edit-modal')
  let urlInput=document.querySelector('#game-url__edit-modal')
  let urlVideoInput=document.querySelector('#video-url__edit-modal')
  let descInput=document.querySelector('#game-description__edit-modal')
  let categorySelect=document.querySelector('#game-category__edit-modal')
  let urlImageInput=document.querySelector('#game-imageURL__edit-modal')

  nameInput.value=gameData.title
  descInput.value=gameData.description
  categorySelect.value=gameData.category
  urlImageInput.value=gameData.img
  urlInput.value=gameData.url
  urlVideoInput.value=gameData.video

  imgPreview.src=gameData.img
}

const onChangeImgPreview=()=>{
  let imgPreview=document.querySelector('#modal-img-preview')
  imgPreview.src=gameData.img
}

const editGame=(event)=>{
  let index=games.findIndex(game=>game.id==gameData.id)
  event.preventDefault()

  let nameInput=document.querySelector('#game-name__edit-modal')
  let urlInput=document.querySelector('#game-url__edit-modal')
  let urlVideoInput=document.querySelector('#video-url__edit-modal')
  let descInput=document.querySelector('#game-description__edit-modal')
  let categorySelect=document.querySelector('#game-category__edit-modal')
  let urlImageInput=document.querySelector('#game-imageURL__edit-modal')


  games[index].title=nameInput.value
  games[index].description=descInput.value
  games[index].category=categorySelect.value
  games[index].img=urlImageInput.value
  games[index].url=urlInput.value
  games[index].video=urlVideoInput.value

  saveGamesInLS()
  loadTable()
  loadFeatureOptions()
  selectFeatured()
  editGameModal.hide()
}

//select featured
let featuredSelect=document.querySelector('#featured-select')

const loadFeatureOptions=()=>{
  featuredSelect.innerHTML=''
  
  games.forEach(game=>{
    let option=document.createElement('option')
    let title=game.title
    if(title==featuredGame.title){option.setAttribute('selected','')}
    if(!game.published){option.setAttribute('disabled','')}
    option.innerHTML=title
    featuredSelect.appendChild(option)
  })
}

const selectFeatured=()=>{
  featuredGame=games.find(game=>game.title==featuredSelect.value)
  localStorage.setItem('featured',JSON.stringify(featuredGame))
  loadTable()
}


//user admins

let userTableBody=document.querySelector('#user-table__body')
let users=JSON.parse(localStorage.getItem('users'))

const saveUsersInLS=()=>localStorage.setItem('users',JSON.stringify(users))

const loadUserTable=()=>{
  userTableBody.innerHTML=''
  
  users.forEach(user=>{
    let tr=document.createElement('tr')

    let content=`
    <th scope="row" ${user.id==0?'class="text-danger-emphasis"':''}>${user.username}</th>
    <td class="d-none d-md-table-cell ${user.id==0?'text-danger-emphasis':''}">${user.email}</td>
    <td class="text-center fs-4">
        <div class="form-check form-switch d-flex justify-content-center align-items-center">
        <input class="form-check-input" type="checkbox" role="switch" ${user.admin?'checked':''} ${user.id==0?'disabled':''} onchange="setAdmin(${user.id})">
        </div>
    </td>
    <td class="text-center fs-3">${user.id==0?'':`<i class="text-danger bi bi-trash-fill" onclick="deleteUser(${user.id})"></i>`}</td>
    `

    tr.innerHTML=content
    userTableBody.appendChild(tr)
  })

}

const setAdmin=(id)=>{
  let userFound=users.find(user=>user.id==id)
  if(userFound.id==0){return alert('Access Denied')}
  let userFoundIndex=users.findIndex(user=>user.id==id)

  userFound.admin= !userFound.admin
  users[userFoundIndex]=userFound

  localStorage.setItem('session',JSON.stringify(userFound))
  saveUsersInLS()
  loadUserTable()
}

const deleteUser=(id)=>{
  let userFound=users.find(user=>user.id==id)
  if(userFound.id==0){return alert('Access Denied')}
  let userFoundIndex=users.findIndex(user=>user.id==id)

  let confirmDelete=confirm(`Are you sure to want to delete ${userFound.username} from users?`)

  if(confirmDelete){
    users.splice(userFoundIndex,1)
    localStorage.removeItem('users')
    saveUsersInLS()

    let session=JSON.parse(localStorage.getItem('session'))
    session=[]
    localStorage.setItem('session',JSON.stringify(session))
    loadUserTable()
  }
}

//queue

let queueTableBody=document.querySelector('#queue-table__body')
let queue=JSON.parse(localStorage.getItem('queue'))||[]

const saveQueueInLS=()=>localStorage.setItem('queue',JSON.stringify(queue))

const loadQueueTable=()=>{
  queueTableBody.innerHTML=''

  queue.forEach(user=>{
    let tr=document.createElement('tr')

    let content=`
    <th class="vertical-align-center" scope="row">${user.username}</th>
    <td class="vertical-align-center d-none d-md-table-cell">${user.email}</td>
    <td class="text-center fs-3"><i class="text-success mx-1 bi bi-check-lg" onclick="acceptUser(${user.id})"></i></td>
    <td class="text-center fs-3"><i class="text-danger mx-1 bi bi-x-lg" onclick="rejectUser(${user.id})"></i></td>
  `

  tr.innerHTML=content
  queueTableBody.appendChild(tr)
  })
}

const rejectUser=(id)=>{
  let userInQueueFound=queue.find(user=>user.id==id)
  let userInQueueFoundIndex=queue.findIndex(user=>user.id==id)

  let deleteConfirm=confirm(`Are you sure you want to reject the registration request of: ${userInQueueFound.username}?`)
  deleteConfirm?queue.splice(userInQueueFoundIndex,1):

  localStorage.removeItem('queue')
  saveQueueInLS()
  loadQueueTable()
}

const acceptUser=(id)=>{
  let userInQueueFound=queue.find(user=>user.id==id)
  let userInQueueFoundIndex=queue.findIndex(user=>user.id==id)

  let accept=confirm(`Add ${userInQueueFound.username}?`)
  if(accept){
    users.push(userInQueueFound)
    loadUserTable()
    saveUsersInLS()

    queue.splice(userInQueueFoundIndex,1)
    loadQueueTable()
    saveQueueInLS()

  }
}

if(session.admin){
  loadFeatureOptions()
  loadTable()
  loadUserTable()
  loadQueueTable()
}