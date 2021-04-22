const baseUrl = 'https://www.breakingbadapi.com/api/';

//Fetching character info from API
function getAllCharacters() {
    return fetch(`${baseUrl}characters`).then(resp => resp.json())
}
// getAllCharacters().then(characters => console.log(characters[0].name.replace(' ', '+')))

//Using character info to create dropdown menu with list of characters: NOT WORKING
function createCharacterDropdown() {
    const select = document.createElement('select');
    getAllCharacters().then(characters => {
        characters.forEach(character => {
            const option = document.createElement('option');
            option.value = character.name.replaceAll(' ', '+');
            option.innerText = character.name
            select.appendChild(option)
        })
        // console.log(select)//console log from .then()
    })
    return select
}

//Fetching random character from API
function getRandomCharacter() {
    return fetch(`${baseUrl}character/random`).then(res => res.json())
}

//Create character div
function createCharacterDiv(character) {
    const characterDiv = document.createElement('div');
    const name = document.createElement('h3');
    name.innerText = character[0].name;
    const image = document.createElement('img');
    image.src = character[0].img;
    image.width = 400;
    const alias = document.createElement('p');
    alias.innerText = `Nickname: ${character[0].nickname}`;
    const job = document.createElement('p');
    job.innerText = `Occupation: ${character[0].occupation}`;
    const actor = document.createElement('p');
    actor.innerText = `Played by: ${character[0].portrayed}`;
    const currentStatus = document.createElement('p')
    currentStatus.innertext = `Status: ${character[0].status}`;
    characterDiv.append(name, image, alias, job, actor, currentStatus)
    return characterDiv
}
function appendCharacterDiv(characterDiv) {
    const characterContainer = document.getElementById('character-container')
    characterContainer.innerHTML = ''
    characterContainer.appendChild(characterDiv)
}
getRandomCharacter().then(character => {
    const characterDiv = createCharacterDiv(character)
    appendCharacterDiv(characterDiv)
})

//Fetching specific character from API based on user search
function getCharacter(character) {
    return fetch(`${baseUrl}characters?name=${character}`).then(res => res.json())
}

function searchCharacter() {
    const searchBtn = document.getElementById('searchbtn');
    const search = document.getElementById('search');
    searchBtn.addEventListener('click', function (event) {
        event.preventDefault()
        const query = search.value.replace(' ', '+')
        getCharacter(query).then(character => {
            const characterDiv = createCharacterDiv(character)
            appendCharacterDiv(characterDiv)
        })
    })
}

searchCharacter()