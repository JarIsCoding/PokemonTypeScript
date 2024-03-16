import './App.css';
import { useEffect, useState } from 'react';
import bug from './assets/Bug.png';
import dark from './assets/Dark.png';
import dragon from './assets/Dragon.png';
import electric from './assets/Eletric.png';
import fairy from './assets/Fairy.png';
import fighting from './assets/Fighting.png';
import fire from './assets/Fire.png';
import fly from './assets/Fly.png';
import ghost from './assets/Ghost.png';
import grass from './assets/Grass.png';
import ground from './assets/Ground.png';
import ice from './assets/Ice.png';
import normal from './assets/Normal.png';
import poison from './assets/Posion.png';
import psy from './assets/Psy.png';
import rock from './assets/Rock.png';
import steel from './assets/Steel.png';
import water from './assets/Water.png';
import star from './assets/star.png'

interface PokemonData {
  name: string;
  id: number;
  types: { type: { name: string } }[];
  abilities: { ability: { name: string } }[];
  moves: { move: { name: string } }[];
  sprites: { other: { 'official-artwork': { front_default: string; front_shiny: string } } };
  species: { url: string };
  location_area_encounters: string;
}

function App() {
  const [search, setSearch] = useState<string>('Pikachu');
  const [pokemonData, setPokemonData] = useState<PokemonData | null>(null);
  const [pokemonImage, setPokemonImage] = useState<string>('');
  const [imageType, setImageType] = useState<string>('regular');
  const [pokeLoc, setPokeLoc] = useState<string>('');
  const [divType, setDivType] = useState<string>('off');
  const [pokeEvo, setPokeEvo] = useState<string>('');

  const handleSearch = async () => {
    try {
      const promise = await fetch(`https://pokeapi.co/api/v2/pokemon/${search.toLowerCase()}`);
      const data: PokemonData = await promise.json();
      setPokemonData(data);
      pokelocation(data);
      pokeEvolution(data);
      setPokemonImage(data.sprites.other['official-artwork'].front_default);
    } catch (error) {
      console.error('Error fetching data: ', error);
    }
  };

  const pokelocation = async (data: PokemonData) => {
      const promise = await fetch(data.location_area_encounters);
      const locData = await promise.json();
      if (locData.length > 0) {
        setPokeLoc(locData[0].location_area.name);
      } else {
        setPokeLoc('No location found');
      }
  };

  const pokeEvolution = async (data: PokemonData) => {
      const promise1 = await fetch(data.species.url);
      const speciesData = await promise1.json();

      const promise2 = await fetch(speciesData.evolution_chain.url);
      const chainData = await promise2.json();

      const evolutionChain = extractEvolutionChain(chainData.chain);

      if (evolutionChain.length > 0) {
        setPokeEvo(evolutionChain.join(' -> '));
      } else {
        setPokeEvo('No evolution');
      }
  };

  const extractEvolutionChain = (chain: any): string[] => {
    const evolution: string[] = [];
    if (chain.species) {
      evolution.push(capitalizeFirstLetter(chain.species.name));
    }
    if (chain.evolves_to && chain.evolves_to.length > 0) {
      chain.evolves_to.forEach((evolves_to: any) => {
        const subEvolution = extractEvolutionChain(evolves_to);
        evolution.push(...subEvolution);
      });
    }
    return evolution;
  };

  const handlerng = async () => {
      const randomId = Math.floor(Math.random() * 1025) + 1;
      const promise = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
      const rngdata: PokemonData = await promise.json();
      setPokemonData(rngdata);
      pokelocation(rngdata);
      pokeEvolution(rngdata);
      setPokemonImage(rngdata.sprites.other['official-artwork'].front_default);
  };

  const capitalizeFirstLetter = (string: string): string => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  useEffect(() => {
    handleSearch();
  }, []);

  const handleImageClick = () => {
    if (imageType === 'regular') {
      setPokemonImage(pokemonData?.sprites.other['official-artwork'].front_shiny || '');
      setImageType('shiny');
    } else {
      setPokemonImage(pokemonData?.sprites.other['official-artwork'].front_default || '');
      setImageType('regular');
    }
  };

  const saveToLocalStorage = (mon: string) => {
    let favorites = getlocalStorage();
    if (!favorites.includes(mon)) {
      favorites.push(mon);
    }
    localStorage.setItem('Favorites', JSON.stringify(favorites));
  };

  const getlocalStorage = (): string[] => {
    let localStorageData = localStorage.getItem('Favorites');

    if (localStorageData === null) {
      return [];
    }
    return JSON.parse(localStorageData);
  };

  const removeFromLocalStorage = (pokemonName: string) => {
    let favorites = getlocalStorage();
    favorites = favorites.filter((favorite) => favorite !== pokemonName);
    localStorage.setItem('Favorites', JSON.stringify(favorites));
  };

  const handleFavDiv = () => {
    if (divType === 'off') {
      setDivType('on');
    } else {
      setDivType('off');
    }
  };

  const handleFavoriteClick = async (pokemonName: string) => {
      const promise = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`);
      const data: PokemonData = await promise.json();
      setPokemonData(data);
      pokelocation(data);
      pokeEvolution(data);
      setPokemonImage(data.sprites.other['official-artwork'].front_default);
  };

  const typeImages: { [key: string]: string } = {
    bug: bug,
    dark: dark,
    dragon: dragon,
    electric: electric,
    fairy: fairy,
    fighting: fighting,
    fire: fire,
    flying: fly,
    ghost: ghost,
    grass: grass,
    ground: ground,
    ice: ice,
    normal: normal,
    poison: poison,
    psychic: psy,
    rock: rock,
    steel: steel,
    water: water,
  };

  const Types: React.FC<{ types: { type: { name: string } }[] }> = ({ types }) => {
    return (
      <div className="text-end grid grid-cols-2">
        {types.map((type, index) => (
          <div className="col-span-1 lg:ps-0 lg:ms-0 ps-4 ms-3 mb-4" key={index}>
            <img
              src={typeImages[type.type.name]}
              alt={type.type.name}
              style={{
                width: '200px',
                height: 'auto',
              }}
            />
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <div className="grid grid-cols-2 px-4 py-2 Mc navbg static">
        <div className="ft md:col-span-1 col-span-2">POKEDEX</div>
        <div className="fourty mt-1 md:text-right md:col-span-1 grid grid-cols-12">
          <div className='col-span-11 pe-5'>
          <button onClick={handleFavDiv}>Favorites</button>
          </div>
          <div className='col-span-1 pt-2 md:block hidden'>
            <img src={star} alt="star" width='70%' onClick={handleFavDiv}/>
          </div>
        </div>
        <div className={`absolute right-0 top-20 favbg mt-3 pe-4 ps-3 thirty ${divType === 'off' ? 'hidden' : ''}`}>
          {getlocalStorage().map((favorite, e) => (
            <p key={e} className="" onClick={() => handleFavoriteClick(favorite)}>
              <span className="pe-24" onClick={() => removeFromLocalStorage(favorite)}>
                X
              </span>
              {capitalizeFirstLetter(favorite)}
            </p>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 pt-3 pb-12">
        <p className="twenty flex justify-center pb-3">Search Your Favorite Pokemon!</p>
        <div className="flex justify-center">
          <input
            className="inputfield rounded-lg ps-2"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex justify-center">
          <button className="rounded-lg btnclass mt-3 Mc" onClick={handleSearch}>
            Go!
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 Mx px-4 Mc">
        <div className="lg:col-span-4 md:col-span-6 col-span-12">
          <p className=" text-yellow-300">Click Pokemon to change to shiny!</p>
          <img
            src={pokemonImage}
            width="100%"
            alt="Searched Pokemon"
            onClick={handleImageClick}
            style={{ cursor: 'pointer' }}
          />
          {pokemonData && pokemonData.name && (
            <button className="border-0 rounded-3xl mt-1 py-2 twf" onClick={() => saveToLocalStorage(pokemonData.name)}>
              Favorite
            </button>
          )}
          <br />
          <button className="border-0 rounded-3xl py-2 twf mb-5 mt-2" onClick={handlerng}>
            Random
          </button>
        </div>

        <div className="lg:col-span-8 md:col-span-6 col-span-12 pt-4 lg:ms-16">
          <div className="grid lg:grid-cols-2">
            <div className="col-span-1">
              <p className="fourty ps-4 ms-3 pb-3">
                {pokemonData && pokemonData.name && (
                  <span>
                    {capitalizeFirstLetter(pokemonData.name)}
                    {' '}
                    {'#'}
                    {pokemonData.id}
                  </span>
                )}
              </p>
            </div>
            <div className="text-end col-span-1 pt-3">
              {pokemonData && pokemonData.types && <Types types={pokemonData.types} />}
            </div>
          </div>

          <p className="ps-4 ms-3 thirty">All Abilites</p>
          <p className="ps-4 ms-3 twenty pb-10">
            {pokemonData && pokemonData.abilities && (
              <span>
                {pokemonData.abilities.map((pokeabty, e) => (
                  <span key={e}>
                    {capitalizeFirstLetter(pokeabty.ability.name)}
                    {e !== pokemonData.abilities.length - 1 && ', '}
                  </span>
                ))}
              </span>
            )}
          </p>

          <p className="ps-4 ms-3 thirty">All Moves</p>
          <div className="grid grid-cols-12">
            <div className="lg:col-span-6 col-span-12 ps-4 ms-3 twenty scrolltxt mb-5">
              {pokemonData && pokemonData.moves && (
                <span>
                  {pokemonData.moves.map((pokemove, e) => (
                    <span key={e}>
                      {capitalizeFirstLetter(pokemove.move.name)}
                      {e !== pokemonData.moves.length - 1 && ', '}
                    </span>
                  ))}
                </span>
              )}
            </div>
            <div className="lg:col-span-6"></div>
          </div>

          <p className="ps-4 ms-3 thirty">Location</p>
          <p className="ps-4 ms-3 twenty mb-5">
            <span>{capitalizeFirstLetter(pokeLoc)}</span>
          </p>

          <p className="ps-4 ms-3 thirty">Evolutions</p>
          <p className="ps-4 ms-3 twenty mb-5">
            <span>{pokeEvo}</span>
          </p>
        </div>
      </div>
    </>
  );
}

export default App;
