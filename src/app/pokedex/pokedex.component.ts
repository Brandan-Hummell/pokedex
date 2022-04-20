import { Component, Injectable, OnInit } from '@angular/core';
import { PokedexService } from '../pokedex.service';
import { Pokemon } from '../pokedex.service';

@Component({
  selector: 'app-pokedex',
  templateUrl: './pokedex.component.html',
  styleUrls: ['./pokedex.component.css']
})

@Injectable()
export class PokedexComponent implements OnInit {

  public pokemonList: Pokemon[];

  public selectedPokemon: Pokemon;

  // boolean to signify that data is loading from API
  public isLoading: boolean = false;

  constructor(private pokedexService: PokedexService) {
    this.pokemonList = [];
  }

  ngOnInit(): void {
    this.pokedexService.getPokemonList(0, 20).subscribe(pokemon => {
      this.pokemonList = pokemon;
      this.selectedPokemon = pokemon[0];
    });
  }

  public selectPokemon(pokemon: Pokemon) {
    this.selectedPokemon = pokemon;
  }
}
