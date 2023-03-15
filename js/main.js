document.addEventListener('DOMContentLoaded', () => {
    const isDarkTheme = window?.matchMedia('(prefers-color-scheme: dark)').matches;
    const currentTheme = isDarkTheme ? 'night' : 'day';
    document.documentElement.setAttribute('data-theme', currentTheme)

   navigator.geolocation.getCurrentPosition((position) => {
        console.log(position);
        fetchWeather(`${position.coords.latitude},${position.coords.longitude}`)
    }, (error) => {
        if(error.code) {
            console.log(12);
            return renderError('Вы заблокировали доступ у Вашему местоположению')
        }
    })

    const contentWrapper = document.querySelector('.weather__main-content')

    const weatherBtn = document.querySelector('.weather__theme-btn')
    const weatherAppError = document.querySelector('.weather__app-error')

    const weatherAppContainer = document.querySelector('.weather__app-container')

    const appMain = document.querySelector('.weather__app-content')
    const appHeading = appMain.querySelector('.city')
    const temp = appMain.querySelector('.temp')
    const weatherImg = appMain.querySelector('.weather__icon')
    const wind = appMain.querySelector('.wind')
    const pressure = appMain.querySelector('.pressure')
    const humidity = appMain.querySelector('.humidity')

    const searchArea = document.querySelector('.weather__app_search')
    const searchBtn = searchArea.querySelector('.button')
    const searchInput = searchArea.querySelector('.search__input')

    
    // TODO сохранять подогу в localStorage

    const toggleHandler = () => {
        weatherBtn.classList.toggle('active')
        if (weatherBtn.classList.contains('active')) {
            document.documentElement.setAttribute('data-theme', 'night')
        } else {
            document.documentElement.setAttribute('data-theme', 'day')
        }
    }

    const toggleTheme = () => {
        weatherBtn.addEventListener('click', toggleHandler)
    }

    toggleTheme()

    const renderError = (message) => {
        weatherAppError.textContent = message
    }

    const renderData = (data) => {
        renderError('')
        searchInput.value = null
        temp.innerHTML = null
        contentWrapper.classList.remove('hidden')
        appHeading.textContent = data.location.name
        temp.insertAdjacentHTML('afterbegin', `${Math.round(data.current.temp_c)} <sup>°C</sup>`)
        wind.textContent = `${data.current.wind_mph} м.с.`
        pressure.textContent = `${data.current.pressure_mb} мм рт.ст.`
        humidity.textContent = `${data.current.humidity} %.`
        
    }

    const formatToWeekDay = (date) => {
        return new Intl.DateTimeFormat('ru-RU', {weekday: 'short'}).format(new Date(`'${date}'`))
    }

    const renderWeekForecast = (data) => {
        document.querySelector('.weather__week').innerHTML = null
        data.forecastday.forEach(day => {
            formatToWeekDay(day.date).toLocaleUpperCase()
            document.querySelector('.weather__week').insertAdjacentHTML('beforeend', `
            <div class="weather__week-item">
            <div class="title">${formatToWeekDay(day.date).toLocaleUpperCase()}</div>
            <div class="temp"> ${Math.round(day.day.maxtemp_c)} <sup>°C</sup></div>
            <div class="image">
                <img src="${day.day.condition.icon}" alt="weather">
            </div>
        </div>
            `)
        })
    }

    const loader = (loading = true) => {
        if (loading) {
            document.querySelector('.loader').classList.add('active')
        } else {
            document.querySelector('.loader').classList.remove('active')
        }
    }

    const fetchWeather = async(city) => {
        const API_KEY = '62f46d9dc85f435fa9653606231503'
        const query = city
        const BASE_URL = `http://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${query}&lang=ru&days=7`
        try{
            loader()
            const response = await fetch(BASE_URL, {
                'Content-Type': 'application/json;charset=utf-8'
            }).then(data => {
                if (data.status === 200) {
                    return data.json()
                } else {
                    throw new Error('Подходящее местоположение не найдено')
                }
            })
            renderData(response)
            renderWeekForecast(response.forecast)
            loader(false)
        } catch (e) {
            renderError(e.message)
            loader(false)
        } finally {
            loader(false)
        }
    }

    searchBtn.addEventListener('click', () => {
        if (searchInput.value) {
            fetchWeather(searchInput.value)
        }
    })
    
    

})
