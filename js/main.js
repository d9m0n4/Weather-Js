document.documentElement.setAttribute('data-theme', 'day')

document.querySelector('.weather__theme-btn').addEventListener('click', (e) => {
    document.documentElement.setAttribute('data-theme', 'night')
})