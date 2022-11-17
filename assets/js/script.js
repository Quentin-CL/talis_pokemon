const showPokemons = async (name = null, type = null) => {
    let pokemons
    try {
        if (name) {
            pokemons = await getPokemonsFromAPI(`https://pokebuildapi.fr/api/v1/pokemon/${name}`);
        } else if (type) {
            pokemons = await getPokemonsFromAPI(`https://pokebuildapi.fr/api/v1/pokemon/type/${type}`);
        } else {
            pokemons = await getPokemonsFromAPI("https://pokebuildapi.fr/api/v1/pokemon/limit/10");
        }
        if (typeof pokemons.data[Symbol.iterator] === "function") {
            for (const pokemon of pokemons.data) {
                makePokemonCard(pokemon);
            }
            const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]')
            const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl))
            return
        }
        makePokemonCard(pokemons.data);
    } catch (e) {
        console.log("error!!!", e)
    }
}

const getPokemonsFromAPI = async (url) => {
    try {
        const res = await axios.get(url);
        return res;
    } catch (e) {
        console.log('Error!', e)
        return
    }
}

function makePokemonCard(pokemonData) {
    const pokemonList = document.querySelector('.pokemons-list')
    const pokemonDiv = document.createElement('div');
    const pokemonImg = document.createElement('img');
    const pokemonName = document.createElement('a');
    const [borderColor, boxShadowColor] = colorOfType(pokemonData.apiTypes);
    if (borderColor.length === 1) {
        pokemonDiv.style.boxShadow = `${boxShadowColor[0]}, 0.25) 0px 6px 12px -2px, ${boxShadowColor[0]}, 0.3) 0px 3px 7px -3px`
        pokemonDiv.style.border = `2px solid ${borderColor[0]}`

    } else {
        pokemonDiv.style.boxShadow = `${boxShadowColor[0]}, 0.25) 0px 6px 12px -2px, ${boxShadowColor[1]}, 0.3) 0px 3px 7px -3px`
        pokemonDiv.style.borderWidth = `2px`
        pokemonDiv.style.borderStyle = `solid`
        pokemonDiv.style.borderColor = `${borderColor[0]} ${borderColor[0]} ${borderColor[1]} ${borderColor[1]}`
    }
    pokemonDiv.setAttribute('class', `pokemon-card-container`);
    pokemonImg.src = pokemonData.image;
    pokemonName.innerText = pokemonData.name;
    setPopover(pokemonData, pokemonName)
    pokemonDiv.append(pokemonImg, pokemonName);
    pokemonList.append(pokemonDiv);
}

function setPopover(pokemonInfo, element) {
    element.setAttribute('class', "custom-popover");
    element.setAttribute('tabindex', "0");
    element.setAttribute('role', "button");
    element.setAttribute('data-bs-toggle', "popover");
    element.setAttribute('data-bs-trigger', "focus");
    element.setAttribute('data-bs-html', "true");
    element.setAttribute('data-bs-title', `${pokemonInfo.name}`);
    let content = `Type(s) :`;
    for (let type of pokemonInfo.apiTypes) {
        content += ` <img src=${type.image} width="20px"> ${type.name}`
    }
    for (let stat of Object.entries(pokemonInfo.stats)) {
        content += `<br>${capitalizeAndDelUnderscore(stat[0])} : ${stat[1]}`
    }
    element.setAttribute('data-bs-content', content);
    element.setAttribute('data-bs-container', "body");
}
function colorOfType(types) {
    const borderColor = [];
    const boxShadowColor = [];
    for (const type of types) {
        switch (type.name) {
            case 'Feu':
                borderColor.push('rgba(191, 43, 43, 0.5)');
                boxShadowColor.push('rgba(191, 43, 43');
                break;
            case 'Eau':
                borderColor.push('rgba(43, 125, 191, 0.5)');
                boxShadowColor.push('rgba(43, 125, 191');
                break;
            case 'Plante':
                borderColor.push('rgba(62, 150, 37, 0.5)');
                boxShadowColor.push('rgba(62, 150, 37');
                break;
            case 'Électrik':
                borderColor.push('rgba(243, 230, 28, 0.5)');
                boxShadowColor.push('rgba(243, 230, 28');
                break;
            case 'Psy':
                borderColor.push('rgba(184, 28, 243, 0.5)');
                boxShadowColor.push('rgba(184, 28, 243');
                break;
            case 'Poison':
                borderColor.push('rgba(132, 15, 156, 0.5)');
                boxShadowColor.push('rgba(132, 15, 156');
                break;
            case 'Fée':
                borderColor.push('rgba(243, 28, 236, 0.5)');
                boxShadowColor.push('rgba(243, 28, 236');
                break;
            case 'Glace':
                borderColor.push('rgba(73, 213, 242, 0.5)');
                boxShadowColor.push('rgba(73, 213, 242');
                break;
            case 'Sol':
                borderColor.push('rgba(102, 58, 15, 0.5)');
                boxShadowColor.push('rgba(102, 58, 15');
                break;
            case 'Insecte':
                borderColor.push('rgba(152, 243, 111, 0.5)');
                boxShadowColor.push('rgba(152, 243, 111');
                break;
            default:
                borderColor.push('rgba(50, 50, 93, 0.5)');
                boxShadowColor.push('rgba(50, 50, 93');
        }
    }
    return [borderColor, boxShadowColor]
}


function sortPokemon() {
    const nameInput = document.querySelector('#name');
    const typeInput = document.querySelector('#type');
    const searchBtn = document.querySelector('.search-btn');
    searchBtn.addEventListener('click', (e) => {
        e.preventDefault();
        removeAllPokemons();
        const userPokemonName = nameInput.value;
        const userPokemonType = typeInput.value;
        if (userPokemonName) {
            showPokemons(userPokemonName)
        }
        else if (userPokemonType) {
            showPokemons(null, userPokemonType)
        }
        else {
            showPokemons(null, null)
        }
    })
}

function removeAllPokemons() {
    const pokemonDivs = document.querySelectorAll(".pokemon-card-container");
    for (const pokemonDiv of pokemonDivs) {
        pokemonDiv.remove()
    }
}


function capitalizeAndDelUnderscore(string) {
    let capitalize = string.charAt().toUpperCase() + string.slice(1);
    capitalize = capitalize.replace('_', ' ')
    return capitalize
}
showPokemons()
sortPokemon()
