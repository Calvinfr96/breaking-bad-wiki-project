const baseUrl = 'https://www.breakingbadapi.com/api/';

//Fetch character info from API
function getAllCharacters() {
    return fetch(`${baseUrl}characters`).then(resp => resp.json())
}

//Create Dropdown menu of seasons
function createSeasonDropDown() {
    const seasonsObj = {
        'Season 1': 1,
        'Season 2': 2,
        'Season 3': 3,
        'Season 4': 4,
        'Season 5': 5
    }
    const select = document.createElement('select');
    const initialOption = document.createElement('option');
    initialOption.innerText = 'Select Season';
    initialOption.selected = true;
    initialOption.disabled = true;
    select.append(initialOption)
    for (property in seasonsObj) {
        const option = document.createElement('option');
        option.value = seasonsObj[property];
        option.innerText = property;
        select.appendChild(option)
    }
    return select
}

//Fetch episode data
function getEpisodes() {
    return fetch('https://www.breakingbadapi.com/api/episodes?series=Breaking+Bad').then(res => res.json())
}

//Add event listener to dropdown menu
function seasonDropdownEvent(seasonDropdown) {
    seasonDropdown.addEventListener('change', function (event) {
        const query = event.target.value
        getEpisodes().then(episodes => {
            const table = createTable(episodes, query)
            appendCharacterDiv(table)
        })
    })
}

//Append dropdown menu to DOM
function appendSeasonDropdown(dropdown) {
    const searchContainer = document.getElementById('search-container');
    seasonDropdownEvent(dropdown)
    searchContainer.appendChild(dropdown)
}

//Create table showing espidoes in selected season
function createTable(episodes, query) {
    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody')
    const headRow = document.createElement('tr');
    const episodeHeading = document.createElement('th');
    episodeHeading.innerText = 'Episode'
    const titleHeading = document.createElement('th');
    titleHeading.innerText = 'Title'
    const airDateHeading = document.createElement('th');
    airDateHeading.innerText = 'Air Date'
    const charactersHeading = document.createElement('th');
    charactersHeading.innerText = 'characters'
    headRow.append(episodeHeading, titleHeading, airDateHeading, charactersHeading)
    thead.append(headRow)
    table.append(thead, tbody)
    episodes.forEach(episodeObj => {
        if (episodeObj.season.includes(query)) {
            const bodyRow = document.createElement('tr')
            const episodeRow = document.createElement('td');
            episodeRow.innerText = episodeObj.episode
            const titleRow = document.createElement('td');
            titleRow.innerText = episodeObj.title
            const airDateRow = document.createElement('td');
            airDateRow.innerText = episodeObj['air_date']
            const charactersRow = document.createElement('td');
            charactersRow.innerText = episodeObj.characters.map(word => ' ' + word)
            bodyRow.append(episodeRow, titleRow, airDateRow, charactersRow)
            tbody.append(bodyRow)
        }
    })
    return table
}

const seasonDropdown = createSeasonDropDown();
appendSeasonDropdown(seasonDropdown)

//Use character info to create dropdown menu with list of characters
function createCharacterDropdown(characters) {
    const select = document.createElement('select');
    const initialOption = document.createElement('option');
    initialOption.innerText = 'Select Character';
    initialOption.selected = true;
    initialOption.disabled = true;
    select.appendChild(initialOption)
    characters.forEach(character => {
        const option = document.createElement('option');
        option.value = character.name.replaceAll(' ', '+');
        option.innerText = character.name
        select.appendChild(option)
    })
    return select
}

//Add event listener to dropdown menu
function dropDownEvent(dropdown) {
    dropdown.addEventListener('change', function (event) {
        const query = event.target.value
        getCharacter(query).then(character => {
            const characterDiv = createCharacterDiv(character)
            appendCharacterDiv(characterDiv)
        })
    })
}

//Append dropdown menu to DOM
function appendCharacterDropdown(dropdown) {
    const searchContainer = document.getElementById('search-container');
    dropDownEvent(dropdown)
    searchContainer.appendChild(dropdown)
}

getAllCharacters().then(characters => {
    const dropdown = createCharacterDropdown(characters)
    appendCharacterDropdown(dropdown)
})

//Create character div
function createCharacterDiv(character) {
    const characterDiv = document.createElement('div');
    const name = document.createElement('h3');
    name.innerText = character[0].name;
    const image = document.createElement('img');
    image.src = character[0].img;
    image.width = 400;
    const appearedIn = document.createElement('p')
    appearedIn.innerText = `Appeared in: Season(s) ${character[0].appearance.map(word => ' ' + word)}`
    const alias = document.createElement('p');
    alias.innerText = `Nickname: ${character[0].nickname}`;
    const job = document.createElement('p');
    job.innerText = `Occupation: ${character[0].occupation.map(word => ' ' + word)}`;
    const actor = document.createElement('p');
    actor.innerText = `Played by: ${character[0].portrayed}`;
    const deathCount = document.createElement('p')
    getDeathCount(character, deathCount)
    const currentStatus = document.createElement('p')
    currentStatus.innerText = `Status: ${character[0].status}`;
    const quoteButton = document.createElement('button')
    quoteButton.id = character[0].name.replaceAll(' ', '+');
    quoteButton.innerText = `Get quotes from ${character[0].name}`
    const quoteDiv = document.createElement('div')
    addQuoteEvent(quoteButton, quoteDiv)
    const deathButton = document.createElement('button')
    deathButton.id = character[0].name.replaceAll(' ', '+');
    deathButton.innerText = `Death Information`
    const deathDiv = document.createElement('div')
    addDeathEvent(deathButton, deathDiv)
    characterDiv.append(name, image, appearedIn, alias, job, actor, currentStatus, deathCount, quoteButton, quoteDiv, deathButton, deathDiv)
    return characterDiv
}
function appendCharacterDiv(characterDiv) {
    const characterContainer = document.getElementById('character-container')
    characterContainer.innerHTML = ''
    characterContainer.appendChild(characterDiv)
}

//Fetch specific character from API based on user search
function getCharacter(character) {
    return fetch(`${baseUrl}characters?name=${character}`).then(res => res.json())
}

//Handle fetch error and display message to user
function fetchError(query) {
    const errorMessage = document.createElement('p');
    errorMessage.innerText = `Sorry, ${query} not found. Please ensure spelling is correct with proper casing (e.g Walter White) 
    or use the dropdown menu.`
    appendCharacterDiv(errorMessage)

}

function searchCharacter() {
    const characterSearch = document.getElementById('character-search');
    const searchBtn = document.getElementById('searchbtn');
    const search = document.getElementById('search');
    searchBtn.addEventListener('click', function (event) {
        event.preventDefault()
        const query = search.value.replace(' ', '+')
        getCharacter(query).then(character => {
            const characterDiv = createCharacterDiv(character)
            appendCharacterDiv(characterDiv)
        }).catch(error => fetchError(query))
        characterSearch.reset()
    })
}
searchCharacter()

//Fetch character quotes
function getCharacterQuote(author) {
    return fetch(`${baseUrl}quote/random?author=${author}`).then(resp => resp.json())
}

//Create p tag containing random quote
function createQuote(quoteArray) {
    const p = document.createElement('p');
    p.innerText = quoteArray[0].quote;
    return p
}

//Append quote to DOM
function appendQuote(quote, quoteDiv) {
    quoteDiv.appendChild(quote)
}

//Add event listener to quote button
function addQuoteEvent(quoteButton, quoteDiv) {
    quoteButton.addEventListener('click', function () {
        const query = quoteButton.id
        getCharacterQuote(query).then(quoteArray => {
            if (quoteArray.length === 1) {
                quoteDiv.innerHTML = '';
                const quoteP = createQuote(quoteArray)
                appendQuote(quoteP, quoteDiv)
            } else {
                quoteDiv.innerHTML = '';
                const quoteP = document.createElement('p')
                quoteP.innerText = 'Sorry, no qoutes for this character.'
                appendQuote(quoteP, quoteDiv)
            }
        })
    })
}

//Get character death information
function getDeaths(query) {
    return fetch(`${baseUrl}death?name=${query}`).then(resp => resp.json())
}

//Populate death div with death information
function getDeathInfo(deathArray) {
    const deathInfo = document.createElement('p')
    deathInfo.innerText =
        `
    Season ${deathArray[0].season} Episode ${deathArray[0].episode}
    Cause: ${deathArray[0].cause}
    Last Words: ${deathArray[0]['last_words']}
    Person Responsible: ${deathArray[0].responsible}
    `
    return deathInfo
}

//Append death info to DOM
function appendDeathInfo(deathInfo, deathDiv) {
    deathDiv.append(deathInfo)
}

//Add Event Listener to Death button
function addDeathEvent(deathButton, deathDiv) {
    deathButton.addEventListener('click', function () {
        const query = deathButton.id
        getDeaths(query).then(deathArray => {
            if (deathArray.length === 1) {
                deathDiv.innerHTML = '';
                const deathInfo = getDeathInfo(deathArray)
                appendDeathInfo(deathInfo, deathDiv)
            } else {
                deathDiv.innerHTML = '';
                const deathInfo = document.createElement('p')
                deathInfo.innerText = `Still alive`
                appendDeathInfo(deathInfo, deathDiv)
            }
        })
    })
}

//Get death count for character
function fetchDeathCount(query) {
    return fetch(`${baseUrl}death-count?name=${query}`).then(resp => resp.json())
}
function getDeathCount(character, headCount) {
    const query = character[0].name.replaceAll(' ', '+')
    fetchDeathCount(query).then(death => headCount.innerText = `Death Count: ${death[0].deathCount}`)
}

fetch(`${baseUrl}deaths`).then(resp => resp.json()).then(data => console.log(data))
// fetch(`${baseUrl}death-count?name=Skyler+White`).then(resp => resp.json()).then(data => console.log(data))
const query = 'Walter+White'
fetchDeathCount(query).then(data => console.log(data))