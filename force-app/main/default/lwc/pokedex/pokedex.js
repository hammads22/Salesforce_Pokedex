import { LightningElement, track } from 'lwc';
import getPokemonList from '@salesforce/apex/PokedexController.getPokemonList';
import getPokemonDetails from '@salesforce/apex/PokedexController.getPokemonDetails';

export default class Pokedex extends LightningElement {
    @track searchKey = '';
    @track allPokemon = [];
    @track filteredPokemon = [];
    @track isLoading = false;
    @track error;
    @track offset = 0;
    limit = 24;

    // Debounce timer and cache
    debounceTimeout;
    pokemonCache = new Map();

    connectedCallback() {
        this.loadPokemonBatch();
    }

    // Load main Pokémon list
    async loadPokemonBatch() {
        this.isLoading = true;
        try {
            const result = await getPokemonList({ size: this.limit, offset: this.offset });
            const data = JSON.parse(result);

            const newPokemon = await Promise.all(
                data.results.map(async (p, index) => {
                    try {
                        // Check cache first
                        if (this.pokemonCache.has(p.name)) {
                            return this.pokemonCache.get(p.name);
                        }

                        const details = await getPokemonDetails({ name: p.name });
                        const pokeData = JSON.parse(details);

                        const pokeObj = {
                            id: this.offset + index + 1,
                            name: pokeData.name,
                            image: pokeData.sprites.other['official-artwork'].front_default || pokeData.sprites.front_default,
                            height: pokeData.height,
                            weight: pokeData.weight,
                            abilities: pokeData.abilities.map(a => a.ability.name),
                            stats: pokeData.stats.map(stat => ({ name: stat.stat.name, value: stat.base_stat }))
                        };

                        // Cache it
                        this.pokemonCache.set(p.name, pokeObj);
                        return pokeObj;
                    } catch (err) {
                        return null;
                    }
                })
            );

            const validPokemon = newPokemon.filter(Boolean);
            this.allPokemon = [...this.allPokemon, ...validPokemon];
            this.filteredPokemon = this.allPokemon;
            this.offset += this.limit;
        } catch (e) {
            this.error = 'Error loading Pokémon data';
            console.error(e);
        } finally {
            this.isLoading = false;
        }
    }

    // Search input handler with debounce
    handleSearchChange(event) {
        this.searchKey = event.target.value.toLowerCase();

        // Clear previous debounce
        clearTimeout(this.debounceTimeout);

        if (this.searchKey.length >= 3) {
            this.debounceTimeout = setTimeout(() => {
                this.searchPokemon(this.searchKey);
            }, 400); // 400ms debounce
        } else {
            this.filteredPokemon = this.allPokemon;
            this.error = null;
        }
    }

    // Search Pokémon via API (with caching)
    async searchPokemon(name) {
        this.isLoading = true;
        try {
            // Use cached data if available
            if (this.pokemonCache.has(name)) {
                this.filteredPokemon = [this.pokemonCache.get(name)];
                return;
            }

            const details = await getPokemonDetails({ name });
            const pokeData = JSON.parse(details);

            const searchResult = {
                id: 0,
                name: pokeData.name,
                image: pokeData.sprites.other['official-artwork'].front_default || pokeData.sprites.front_default,
                height: pokeData.height,
                weight: pokeData.weight,
                abilities: pokeData.abilities.map(a => a.ability.name),
                stats: pokeData.stats.map(stat => ({ name: stat.stat.name, value: stat.base_stat }))
            };

            // Cache the result
            this.pokemonCache.set(name, searchResult);

            this.filteredPokemon = [searchResult];
            this.error = null;
        } catch (err) {
            this.filteredPokemon = [];
            this.error = `Pokémon "${name}" not found.`;
        } finally {
            this.isLoading = false;
        }
    }
}