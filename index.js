const baseUrl = 'https://www.breakingbadapi.com/api/';

//Fetch character info from API
function getAllCharacters() {
    return fetch(`${baseUrl}characters`).then(resp => resp.json())
}

//Use character info to create dropdown menu with list of characters: NOT WORKING
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
    appearedIn.innerText = `Appeared in: Season(s) ${character[0].appearance}`
    const alias = document.createElement('p');
    alias.innerText = `Nickname: ${character[0].nickname}`;
    const job = document.createElement('p');
    job.innerText = `Occupation: ${character[0].occupation}`;
    const actor = document.createElement('p');
    actor.innerText = `Played by: ${character[0].portrayed}`;
    const currentStatus = document.createElement('p')
    currentStatus.innerText = `Status: ${character[0].status}`;
    const quoteButton = document.createElement('button')
    quoteButton.id = character[0].name.replaceAll(' ', '+');
    quoteButton.innerText = `Get quotes from ${character[0].name}`
    const quoteDiv = document.createElement('div')
    addQuoteEvent(quoteButton, quoteDiv)
    characterDiv.append(name, image, appearedIn, alias, job, actor, currentStatus, quoteButton, quoteDiv)
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

fetch('https://www.breakingbadapi.com/api/episodes').then(res => res.json()).then(data => console.log(data))