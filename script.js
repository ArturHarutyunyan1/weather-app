const container = document.querySelector('.container')
const form      = document.querySelector('.searchForm')
const input     = document.querySelector('.searchValue')
const sidebar   = document.querySelector('.sidebar')
const hamburger = document.querySelector('.hamburger')
const loader    = document.querySelector('.loader')
const apiKey    = 'ab099c415ea5facca26607978a744fb2'
const hours     = new Date().getHours()
const isDayTime = hours > 6 && hours < 20

let clientIP      = ''
let clientAddress = ''
let cityID        = ''


showLoader()

async function getClientIP(){
    try {
        showLoader()
        const res = await fetch(`https://api.ipify.org?format=json`)
        clientIP  = res
    } catch (error) {
        console.error(error);
    }
}

async function getClientIPData(){
    try {
        showLoader()
        const res  = await fetch(`https://geo.ipify.org/api/v2/country?apiKey=at_pxdirO1Ys3eP75aupM48q2lGrB7ap&ipAddress=${clientIP}`)
        const data = await res.json()
        clientAddress = data.location.region
        getWeatherData(clientAddress)
    } catch (error) {
        console.error(error);
    }
}

async function getWeatherData(clientAddress){
    try {
        showLoader()
        const res  = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${clientAddress}&appid=${apiKey}&units=metric`)
        const data = await res.json()
        cityID = data.id
        displayWeatherData(data)
        getWeatherForecast(cityID)
    } catch (error) {
        console.error(error);
    }
}

form.addEventListener('submit', (e)=>{
    e.preventDefault()

    if(hamburger.classList.contains('active') && sidebar.classList.contains('active')){
        hamburger.classList.remove('active')
        sidebar.classList.remove('active')
    }

    if(input.value == ''){
        alert('You must fill in the input field')
        hideLoader()
    }else{
        showLoader()
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${input.value}&appid=${apiKey}&units=metric`)
        .then((res) => res.json())
        .then((data) => {
            cityID = data.id
            getWeatherForecast(cityID)
            displayWeatherData(data)
        })
    }
})

async function getWeatherForecast(cityID){
    try {
        showLoader()
        const res  = await fetch(`https://api.openweathermap.org/data/2.5/forecast?id=${cityID}&appid=${apiKey}`)
        const data = await res.json()
        displayForecast(data)
        console.log(data);
    } catch (error) {
        console.error(error);
    }
}

function displayWeatherData(data){
    showLoader()
    const body    = document.body
    const main    = document.querySelector('.main')
    const details = document.querySelector('.details')
    let url    = ''
    let date   = new Date()
    
    if(data.weather[0].main == 'Clear'){
            body.classList.add('clear')
            body.classList.remove('rain')
            body.classList.remove('thunderstorm')
            body.classList.remove('snow')
            body.classList.remove('clouds')
        if(isDayTime){
            url = './img/clear-day.svg'
        }else{
            url = './img/clear-night.svg'
        }
    }else if(data.weather[0].main == 'Clouds'){
            body.classList.remove('clear')
            body.classList.remove('rain')
            body.classList.remove('thunderstorm')
            body.classList.remove('snow')
            body.classList.add('clouds')
        if(isDayTime){
            url = './img/partly-cloudy-day.svg'
        }else{
            url = './img/partly-cloudy-night.svg'
        }
    }else if(data.weather[0].main == 'Rain'){
            body.classList.remove('clear')
            body.classList.add('rain')
            body.classList.remove('thunderstorm')
            body.classList.remove('snow')
            body.classList.remove('clouds')
        if(isDayTime){
            url = './img/partly-cloudy-day-rain.svg'
        }else{
            url = './img/partly-cloudy-night-rain.svg'
        }
    }else if(data.weather[0].main == 'Thunderstorm'){
            body.classList.remove('clear')
            body.classList.remove('rain')
            body.classList.add('thunderstorm')
            body.classList.remove('snow')
            body.classList.remove('clouds')
        if(isDayTime){
            url = './img/thunderstorms-day.svg'
        }else{
            url = './img/thunderstorms-night.svg'
        }
    }else if(data.weather[0].main == 'Snow'){
            body.classList.remove('clear')
            body.classList.remove('rain')
            body.classList.remove('thunderstorm')
            body.classList.remove('snow')
            body.classList.add('clouds')
        if(isDayTime){
            url = './img/partly-cloudy-day-snow.svg'
        }else{
            url = './img/partly-cloudy-night-snow.svg'
        }
    }else if(data.weather[0].main == 'Mist' || data.weather[0].main == 'Smoke' || data.weather[0].main == 'Haze' || data.weather[0].main == 'Dust' || data.weather[0].main == 'Fog' || data.weather[0].main == 'Sand' || data.weather[0].main == 'Ash' || data.weather[0].main == 'Squall' || data.weather[0].main == 'Tornado'){
        url = './img/mist.svg'
    }
    
    main.innerHTML = 
    `
    <div class="weather">
        <div class="col">
            <img src="${url}" class="weather-icon" alt="Weather">
            <h1>
                ${data.weather[0].main}
            </h1>
            <h1 class="temp">
                ${Math.floor(data.main.temp)}°
            </h1>
            <h1 class="city">
                ${data.name}, ${data.sys.country}
            </h1>
            <h3 class="date">
                ${date.getHours()}:${date.getMinutes()}, ${date.getDate()}/${date.getMonth()}/${date.getFullYear()}
            </h3>
        </div>
        <div class="row"></div>
      </div>
    </div>
    `
    details.innerHTML = 
    `
    <h1>Weather Details</h1>
    <div class="col">
        <div class="space-btw">
            <h4>Cloudy</h4>
            <h4>${data.clouds.all}%</h4>
        </div>
        <div class="space-btw">
            <h4>Wind</h4>
            <h4>${data.wind.speed}km/h</h4>
        </div>
        <div class="space-btw">
            <h4>Fells like</h4>
            <h4>${data.main.feels_like}°</h4>
        </div>
        <div class="space-btw">
            <h4>Humidity</h4>
            <h4>${data.main.humidity}%</h4>
        </div>
        <div class="space-btw">
            <h4>Visibility</h4>
            <h4>${data.visibility / 1000}km</h4>
        </div>
    <div>
    `
}

function displayForecast(data){
    showLoader()
    if(!data.list){
        alert('Make sure you spell the city correctly')
        hideLoader()
    }
    for(let i = 0; i < data.list.length - 36; i++){
            const row = document.querySelector('.row')
            const rowItem = document.createElement('div')
            let url 
            row.append(rowItem)
            console.log(data.list[i]);
            rowItem.classList.add('row-item')

            if(data.list[i].weather[0].main == 'Clear'){
                if(isDayTime){
                    url = './img/clear-day.svg'
                }else{
                    url = './img/clear-night.svg'
                }
            }else if(data.list[i].weather[0].main == 'Clouds'){
                if(isDayTime){
                    url = './img/partly-cloudy-day.svg'
                }else{
                    url = './img/partly-cloudy-night.svg'
                }
            }else if(data.list[i].weather[0].main == 'Rain'){
                if(isDayTime){
                    url = './img/partly-cloudy-day-rain.svg'
                }else{
                    url = './img/partly-cloudy-night-rain.svg'
                }
            }else if(data.list[i].weather[0].main == 'Thunderstorm'){
                if(isDayTime){
                    url = './img/thunderstorms-day.svg'
                }else{
                    url = './img/thunderstorms-night.svg'
                }
            }else if(data.list[i].weather[0].main == 'Snow'){
                if(isDayTime){
                    url = './img/partly-cloudy-day-snow.svg'
                }else{
                    url = './img/partly-cloudy-night-snow.svg'
                }
            }else if(data.list[i].weather[0].main == 'Mist' || data.list[i].weather[0].main == 'Smoke' || data.list[i].weather[0].main == 'Haze' || data.list[i].weather[0].main == 'Dust' || data.list[i].weather[0].main == 'Fog' || data.list[i].weather[0].main == 'Sand' || data.list[i].weather[0].main == 'Ash' || data.list[i].weather[0].main == 'Squall' || data.list[i].weather[0].main == 'Tornado'){
                url = './img/mist.svg'
            }

            rowItem.innerHTML = 
            `
            <img src="${url}">
            <h2>
                ${data.list[i].weather[0].main}
            </h2>
            <h3>
                ${Math.round(data.list[i].main.temp / 10)}°
            </h3>
            <p>
                ${data.list[i].dt_txt.slice(-8, 16)}
            </p>
            `
    }
    hideLoader()
}

hamburger.addEventListener('click', ()=>{
    hamburger.classList.toggle('active')
    sidebar.classList.toggle('active')
})

function showLoader(){
    container.classList.add('loading')
    if(loader.classList.contains('loaded')){
        loader.classList.remove('loaded')
    }
}

function hideLoader(){
    loader.classList.add('loaded-loader')
    container.classList.replace('loading', 'loaded')
}

getClientIP()
getClientIPData()
