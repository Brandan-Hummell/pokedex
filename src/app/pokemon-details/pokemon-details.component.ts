import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FlavorText, Genus, PokedexService, Pokemon, PokemonMove } from '../pokedex.service';

@Component({
  selector: 'app-pokemon-details',
  templateUrl: './pokemon-details.component.html',
  styleUrls: ['./pokemon-details.component.css']
})

export class PokemonDetailsComponent implements OnInit, OnChanges {

  @Input() pokemon: Pokemon;

  public pokemonDetails: any;
  public pokemonSpecies: any;

  // the pokemon's genus
  public genus: string;

  // moves learned by leveling
  public moves: PokemonMove[];

  // flavor text in English for the pokemon
  public flavorText: string;

  constructor(private pokedexService: PokedexService) { }

  ngOnInit(): void {
    this.getDetails(this.pokemon.id);
  }

  ngOnChanges(changes: SimpleChanges) {
    this.getDetails(changes['pokemon'].currentValue.id);
  }

  private getDetails(id: number) {
    // retrieve and set the pokemon details
    this.pokedexService.getPokemon(id).subscribe(details => {
      this.pokemonDetails = details;
      // filter down the available moves to just the ones learned by leveling and sort them based on level learned
      this.moves = details.moves
      .filter((move: PokemonMove ) => move.version_group_details[0].move_learn_method.name === 'level-up')
      .sort((move1: PokemonMove, move2: PokemonMove) => move1.version_group_details[0].level_learned_at - move2.version_group_details[0].level_learned_at);
    });

    // retrieve the pokemon species for the flavor text and species information
    this.pokedexService.getSpecies(id).subscribe(species => {
      this.pokemonSpecies = species;
      // find and set the pokemons genus to the first one in English
      this.genus = species.genera.find((genus: Genus) => genus.language.name === 'en').genus;
      this.flavorText = species.flavor_text_entries.find((ft: FlavorText) => ft.language.name === 'en').flavor_text;
    });
  }
}
