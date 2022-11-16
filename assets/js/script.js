const showPokemons = async (name = null, type = null) => {
    let pokemons
    try {
        if (name) {
            pokemons = await getPokemonsFromAPI(`https://pokebuildapi.fr/api/v1/pokemon/${name}`);
        } else if (type) {
            pokemons = await getPokemonsFromAPI(`https://pokebuildapi.fr/api/v1/pokemon/type/${type}`);
        } else {
            pokemons = await getPokemonsFromAPI("https://pokebuildapi.fr/api/v1/pokemon/limit/90");
        }
        if (typeof pokemons.data[Symbol.iterator] === "function") {
            for (const pokemon of pokemons.data) {
                makePokemonCard(pokemon.name, pokemon.image, pokemon.apiTypes);
            }
            return
        }
        makePokemonCard(pokemons.data.name, pokemons.data.image, pokemons.data.apiTypes);
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

function makePokemonCard(name, img, types) {
    const pokemonList = document.querySelector('.pokemons-list')
    const pokemonDiv = document.createElement('div');
    const pokemonImg = document.createElement('img');
    const pokemonName = document.createElement('p');
    const borderColor = [];
    const boxShadowColor = [];
    for (const type of types) {
        switch (type.name) {
            case 'Feu':
                borderColor.push('rgba(191, 43, 43, 0.5)');
                boxShadowColor.push('rgba(191, 43, 43');
                break;
            case 'Eau':
                borderColor.push('rgba(43, 145, 191, 0.5)');
                boxShadowColor.push('rgba(43, 145, 191');
                break;
            case 'Plante':
                borderColor.push('rgba(62, 150, 37, 0.5)');
                boxShadowColor.push('rgba(62, 150, 37');
                break;
            default:
                borderColor.push('rgba(50, 50, 93, 0.5)');
                boxShadowColor.push('rgba(50, 50, 93');
        }
    }
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
    pokemonImg.src = img;
    pokemonName.innerText = name;
    pokemonDiv.append(pokemonImg, pokemonName);
    pokemonList.append(pokemonDiv);
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

showPokemons()
sortPokemon()
