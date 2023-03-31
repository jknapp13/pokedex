import React, { useState, useEffect } from "react";
import PokemonAutocomplete from "./components/Autocomplete/Autocomplete";
import EvolutionChain from "./EvolutionChain";
import useSelectedPokemon from "./useSelectedPokemon";
import { fetchPokemonList } from "./api";
import Sparkles from "./components/Sparkles/Sparkles";
import useStyles from "./Pokedex.styles.js";

function Pokedex() {
  const classes = useStyles();
  const [pokemonList, setPokemonList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const list = await fetchPokemonList();
      setPokemonList(list);
    };
    fetchData();
  }, []);

  const filteredPokemonList = pokemonList.filter((pokemon) =>
    pokemon.name.includes(searchQuery)
  );

  const {
    selectedPokemon,
    pokemonSpecies,
    evolutionChain,
    handlePokemonSelection,
  } = useSelectedPokemon();

  return (
    <div>
      <PokemonAutocomplete
        filteredPokemonList={filteredPokemonList}
        handlePokemonSelection={handlePokemonSelection}
        handleSearchInputChange={(event) => setSearchQuery(event.target.value)}
      />
      {selectedPokemon && (
        <div className={classes.selectedPokemonContainer}>
          <h2 className={classes.pokemonName}>
            {selectedPokemon.name.charAt(0).toUpperCase() +
              selectedPokemon.name.slice(1)}
          </h2>
          {pokemonSpecies ? (
            <h4 className={classes.pokemonInfoItem}>
              <p>
                {
                  pokemonSpecies.genera.find((g) => g.language.name === "en")
                    .genus
                }
              </p>
            </h4>
          ) : (
            <p>Loading...</p>
          )}
          <img
            src={selectedPokemon.sprites.front_default}
            alt={selectedPokemon.name}
            className={classes.pokemonInfoItem}
          />
          <Sparkles>
            <img
              src={selectedPokemon.sprites.front_shiny}
              alt={`shiny-${selectedPokemon.name}`}
              className={classes.pokemonInfoItem}
            />
          </Sparkles>
          <div className={classes.pokemonInfoContainer}>
            <p className={classes.pokemonInfoItem}>
              Average Height: {selectedPokemon.height / 10} m
            </p>
            <p className={classes.pokemonInfoItem}>
              Average Weight: {selectedPokemon.weight / 10} kg
            </p>
            <p className={classes.pokemonInfoItem}>
              Abilities:{" "}
              {selectedPokemon.abilities
                .map((ability) => ability.ability.name)
                .join(", ")}
            </p>
            <p className={classes.pokemonInfoItem}>
              Type:{" "}
              {selectedPokemon.types
                .map(
                  (type) =>
                    type.type.name.charAt(0).toUpperCase() +
                    type.type.name.slice(1)
                )
                .join("/")}
            </p>
          </div>
          {pokemonSpecies && (
            <div className={classes.pokemonDescriptionContainer}>
              <h3 className={classes.pokemonInfoItem}>Description</h3>
              {(() => {
                let lastEnglishDescription = null;
                for (const entry of pokemonSpecies.flavor_text_entries.reverse()) {
                  if (entry.language.name === "en") {
                    lastEnglishDescription = entry.flavor_text;
                    break;
                  }
                }
                if (lastEnglishDescription) {
                  // replace the Unicode characters returned from PokeAPI data
                  lastEnglishDescription = lastEnglishDescription
                    .replace(/\u2191/g, "")
                    .replace(/\f/g, "\n")
                    .replace(/\u00ad\n/g, "")
                    .replace(/\u00ad/g, "")
                    .replace(/ -\n/g, " - ")
                    .replace(/-\n/g, "-")
                    .replace(/\n/g, " ");
                  return (
                    <div style={{ marginLeft: "20px" }}>
                      <p>{lastEnglishDescription}</p>
                    </div>
                  );
                } else {
                  return null;
                }
              })()}
            </div>
          )}
          {pokemonSpecies && (
            <div className={classes.pokemonInfoItem}>
              <h3>Evolution Chain</h3>
              {pokemonSpecies && <EvolutionChain chain={evolutionChain} />}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Pokedex;
