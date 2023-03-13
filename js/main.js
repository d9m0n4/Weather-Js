document.addEventListener('DOMContentLoaded', () => {
    const isDarkTheme = window?.matchMedia('(prefers-color-scheme: dark)').matches;
    const currentTheme = isDarkTheme ? 'night' : 'day';
    document.documentElement.setAttribute('data-theme', currentTheme)

    const weatherBtn = document.querySelector('.weather__theme-btn')

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

    const fetchWeather = async(city) => {
        const API_KEY = '89fc4e434465c884b6957a9d4d258573'
        const req = `http://api.weatherstack.com/current?access_key=${API_KEY}&language=ru&query=${city}`
        try{
            const response = await fetch(req, {
                'Content-Type': 'application/json;charset=utf-8'
            })
            console.log(response)
        } catch (e) {
            console.log(e)
        }
    }
    fetchWeather('Kirov')

})
