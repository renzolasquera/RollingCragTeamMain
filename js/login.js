//creating background blocks
const spans = new Array(263).fill(null).map(() => document.createElement('span'));
spans.forEach(span => span.classList='block')
spans.forEach(span => document.querySelector('.container').appendChild(span));

//get events
let btnLogin=document.querySelector('#btn__login')
let btnSignup=document.querySelector('#btn__signup')
btnLogin.addEventListener("click", displayLogin)
btnSignup?btnSignup.addEventListener("click", displayRegister):
window.addEventListener("resize", broadPage)

//Declaring Variables
let loginForm = document.querySelector(".form__login")
let registerForm = document.querySelector(".form__register")
let formsContainer = document.querySelector(".container__login-register")
let rearBoxLogin = document.querySelector(".forms__rearbox-login")
let rearBoxRegister = document.querySelector(".forms__rearbox-register")



//functions
function broadPage(){

    if (window.innerWidth > 850){
        rearBoxRegister.style.display = "block"
        rearBoxLogin.style.display = "block"
    }else{
        rearBoxRegister.style.display = "block"
        rearBoxRegister.style.opacity = "1"
        rearBoxLogin.style.display = "none"
        loginForm.style.display = "block"
        formsContainer.style.left = "0px"
        registerForm.style.display = "none" 
    }
}

broadPage();


function displayLogin(){
        if (window.innerWidth > 850){
            loginForm.style.display = "block"
            formsContainer.style.left = "10px"
            registerForm.style.display = "none"
            rearBoxRegister.style.opacity = "1"
            rearBoxLogin.style.opacity = "0"
        }else{
            loginForm.style.display = "block"
            formsContainer.style.left = "0px"
            registerForm.style.display = "none"
            rearBoxRegister.style.display = "block"
            rearBoxLogin.style.display = "none"
        }
        clear()
    }

function displayRegister(){
        if (window.innerWidth > 850){
            registerForm.style.display = "block"
            formsContainer.style.left = "410px"
            loginForm.style.display = "none"
            rearBoxRegister.style.opacity = "0"
            rearBoxLogin.style.opacity = "1"
        }else{
            registerForm.style.display = "block"
            formsContainer.style.left = "0px"
            loginForm.style.display = "none"
            rearBoxRegister.style.display = "none"
            rearBoxLogin.style.display = "block"
            rearBoxLogin.style.opacity = "1"
        }
        clear()
}

// USERS

//login inputs
let username=document.querySelector('#login-username')
let password=document.querySelector('#login-password')
//register inputs
let registerUsername=document.querySelector('#register-username')
let registerEmail=document.querySelector('#register-email')
let registerPassword=document.querySelector('#register-password')
let confirmPassword=document.querySelector('#confirm-password')
//modal input
let forgotPassword=document.querySelector('#forgot-password-input')

let defaultAvatar=new Image()
let defaultBanner='var(--DewbieViolet)'
defaultAvatar.src='/assets/img/profile-avatar-example.png'
// defaultBanner.src='/assets/img/profile-banner.jpg'
class user{
    constructor(username,password,email,id,admin=false,photo=defaultAvatar,banner=defaultBanner,favorites=[]){
        this.username=username
        this.password=password
        this.email=email
        this.id=id
        this.admin=admin
        this.photo=photo.src
        this.banner=banner
        this.favorites=favorites
    }
}

//default users
const admin = new user('admin','cragteam','cragteam@gmail.com',0,true)
const defaultUser=new user('user','1234','user@gmail.com',1)


//users registered
let users=JSON.parse(localStorage.getItem('users'))||[admin,defaultUser]
localStorage.setItem('users',JSON.stringify(users))
//users that require admin approval
let queue=JSON.parse(localStorage.getItem('queue'))||[]
localStorage.setItem('queue',JSON.stringify(queue))
//users who sent password change request
let passwordsChangeRequest=JSON.parse(localStorage.getItem('passwordsChangeRequest'))||[]
localStorage.setItem('passwordsChangeRequest',JSON.stringify(passwordsChangeRequest))

//functions to save data in local storage
const saveUsersInLS=()=>localStorage.setItem('users',JSON.stringify(users))
const saveQueueInLS=()=>localStorage.setItem('queue',JSON.stringify(queue))
const saveRequestsInLS=()=>localStorage.setItem('passwordsChangeRequest',JSON.stringify(passwordsChangeRequest))

//clear errors
//login
username.addEventListener('focus',clear)
password.addEventListener('focus',clear)
//register
registerUsername.addEventListener('focus',clear)
registerEmail.addEventListener('focus',clear)
registerPassword.addEventListener('focus',clear)
confirmPassword.addEventListener('focus',clear)
//modal
forgotPassword.addEventListener('focus',clear)
//function
function clear() {
    //login inputs
    document.querySelector('#UserNotFound').style.display='none'
    username.style.outline='none'

    document.querySelector('#IncorrectPassword').style.display='none'
    password.style.outline='none'
    //register inputs
    document.querySelector('#UserAlreadyExist').style.display='none'
    registerUsername.style.outline='none'

    document.querySelector('#EmailInUse').style.display='none'
    registerEmail.style.outline='none'

    document.querySelector('#PasswordMinLength').style.display='none'
    registerPassword.style.outline='none'

    document.querySelector('#MismatchPasswords').style.display='none'
    confirmPassword.style.outline='none'
    //modal input
    document.querySelector('#EmailNotFound').style.display='none'
    document.querySelector('#EmailAlreadyRequested').style.display='none'
}

let modal=document.querySelector('#modal')

//this variable finds an existing user
let findUser=''
//log in func
const logIn=(event)=>{
    event.preventDefault()

    let usernameValue=username.value
    let passwordValue=password.value

    findUser=users.find(user=>user.username===usernameValue)

    if(findUser){
        if(usernameValue===findUser.username&&passwordValue===findUser.password){
            localStorage.setItem('session',JSON.stringify(findUser))
            username.value=''
            password.value=''
            clear()
            if(findUser.admin){
                location.replace('/pages/admin.html')
            }else{
                location.replace('/index.html')
            }
            
            // location.replace('/pages/index.html')
        }else{
            document.querySelector('#IncorrectPassword').style.display='inline'
            password.style.outline='2px solid red'
        } 
    }else{
        document.querySelector('#UserNotFound').style.display='inline'
        username.style.outline='2px solid red'
    }
}

//user verification
//approved users
let userExist=false
let usedEmail=false
//users in queue
let queueUserExist=false
let queueUsedEmail=false

//register users func
const signUp=(event)=>{
    event.preventDefault()

    let registerUsernameValue=registerUsername.value
    let registerEmailValue=registerEmail.value
    let registerPasswordValue=registerPassword.value
    let confirmPasswordValue=confirmPassword.value

    userExist=users.find(user=>user.username==registerUsernameValue)
    usedEmail=users.find(user=>user.email==registerEmailValue)

    queueUserExist=queue.find(queue=>queue.username==registerUsernameValue)
    queueUsedEmail=queue.find(queue=>queue.email==registerEmailValue)


    if(!userExist&&!queueUserExist){
        if(!usedEmail&&!queueUsedEmail){
            if(registerPasswordValue.length>=7){
                if(registerPasswordValue===confirmPasswordValue){
                    let newUser=new user(registerUsernameValue,registerPasswordValue,registerEmailValue,new Date().getTime())
                    queue.push(newUser)
                    saveQueueInLS()
        
                    registerUsername.value=''
                    registerEmail.value=''
                    registerPassword.value=''
                    confirmPassword.value=''
                    clear()
                    alert('User registered successfully! Our admins will review your registration request')
                }else{
                    document.querySelector('#MismatchPasswords').style.display='inline'
                    confirmPassword.style.outline='2px solid red'
                }
            }else{
                document.querySelector('#PasswordMinLength').style.display='inline'
                registerPassword.style.outline='2px solid red'
            }
        }else{
            document.querySelector('#EmailInUse').style.display='inline'
            registerEmail.style.outline='2px solid red'
        }
    }else{
        document.querySelector('#UserAlreadyExist').style.display='inline'
        registerUsername.style.outline='2px solid red'
    }

    userExist=false
    usedEmail=false

    queueUserExist=false
    queueUsedEmail=false
}

//modal functions

const openModal=(event)=>{
    event.preventDefault()
    modal.style.display='flex'
}

const closeModal=(event)=>{
    event.preventDefault()
    modal.style.display='none'
    forgotPassword.value=''
    clear()
}

const sendChangePasswordRequest=(event)=>{
    event.preventDefault()
    let forgotPasswordValue=forgotPassword.value

    usedEmail=users.find(user=>user.email==forgotPasswordValue)
    queueUsedEmail=queue.find(queue=>queue.email==forgotPasswordValue)

    userExist=users.find(user=>user.username==forgotPasswordValue)
    queueUserExist=queue.find(queue=>queue.username==forgotPasswordValue)
    
    let requestSent=users.find(user=>user.username==forgotPasswordValue||user.email==forgotPasswordValue)||queue.find(UserInQueue=>UserInQueue.username==forgotPasswordValue||UserInQueue.email==forgotPasswordValue)
    let passwordChangeRequestAlreadySent=passwordsChangeRequest.find(request=>request.id==requestSent.id)

    if(usedEmail||queueUsedEmail||userExist||queueUserExist){
        if(!passwordChangeRequestAlreadySent){
            passwordsChangeRequest.push(requestSent)
            saveRequestsInLS()
            alert('Change password request sent successfully!')
            closeModal(event)
            forgotPassword.value=''
        }else{
            document.querySelector('#EmailAlreadyRequested').style.display='block'
        }
    }else{
        document.querySelector('#EmailNotFound').style.display='block'
    }

    usedEmail=false
    queueUsedEmail=false
    userExist=false
    queueUserExist=false
}
