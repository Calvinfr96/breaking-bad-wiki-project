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

//Fetching random characterfrom API
function getRandomCharacter() {
    return fetch(`${baseUrl}character/random`).then(res => res.json())
}
getRandomCharacter().then(character => console.log(character[0].name))

//Create character div
function createCharacterDiv(character) {
    const characterDiv = document.createElement('div');
    const name = document.createElement('h3');
    name.innerText = character[0].name;
    const image = document.createElement('img');
    image.src = character[0].img;
    const alias = document.createElement('p');
    alias.innerText = character[0].nickname;
    const job = document.createElement('p');
    job.innerText = character[0].occupation;
    const actor = document.createElement('p');
    actor.innerText = character[0].portrayed;
    const currentStatus = document.createElement('p')
    currentStatus.innertext = character[0].status;
    characterDiv.append(name, image, alias, job, actor, currentStatus)
    return characterDiv
}
const body = document.getElementsByTagName('body')[0]
getRandomCharacter().then(character => console.log(character))
getRandomCharacter().then(character => body.appendChild(createCharacterDiv(character)))