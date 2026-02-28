const name = document.getElementById('name')
const email = document.getElementById('email')
const mobile = document.getElementById('mobile')
const password = document.getElementById('password')
const form = document.getElementById('form')
const Errorr = document.getElementById('error')

form.addEventListener('submit',(e)=>{
    let messages = []

    if(name && (name.value === '' || name.value == null)){
        messages.push('Name is Required')
    }

    if(mobile && mobile.value.length !== 10){
        messages.push('Enter a valid phone number')
    }

    if(email && !email.value.includes("@")){
        messages.push('Enter a valid Email')
    }

    if(password && password.value.length < 6){
        messages.push('Password must be at least 6 characters')
    }

    if(messages.length > 0){
        e.preventDefault()
        Errorr.innerText = messages.join(', ')
    }
})