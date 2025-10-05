Salesforce Pokedex Lightning Web Component (LWC)

A fun and fully functional Pokédex built on Salesforce using Lightning Web Components (LWC), Apex callouts, and the PokéAPI
.

This project demonstrates real-world Salesforce integration best practices, including:

API callouts with Named Credentials

Storing external endpoints in Custom Metadata

Debounced search to avoid API call flooding

Caching results for improved performance

Lightning Web Component UI with paginated Pokémon list

Features

Load Pokémon in batches from the PokéAPI.

Search Pokémon by name (minimum 3 characters) with debounce to reduce API calls.

Cache Pokémon details locally for instant repeated search results.

Uses Custom Metadata to store endpoints, making the integration configurable without code changes.

Works entirely inside a Salesforce org with Apex callouts and LWC front-end.

Architecture

Apex Controller (PokedexController)

getPokemonList(size, offset) → Returns a paginated list of Pokémon.

getPokemonDetails(name) → Returns detailed Pokémon data.

Uses Named Credential for secure external API calls.

Base endpoint stored in Custom Metadata (Pokedex__mdt) for flexibility.

LWC (pokedex)

Loads and displays Pokémon list with images, stats, and abilities.

Handles search input with debounce and cache.

Shows loading state and errors.
