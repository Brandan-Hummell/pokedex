import { Component, Injectable, OnInit } from '@angular/core';
import { PokedexService } from '../pokedex.service';
import { Pokemon } from '../pokedex.service';
import { faSearch } from '@fortawesome/free-solid-svg-icons'


export enum ListType {
  All = 'all',
  Liked = 'liked',
  Captured = 'captured'
}

@Component({
  selector: 'app-pokedex',
  templateUrl: './pokedex.component.html',
  styleUrls: ['./pokedex.component.css']
})

@Injectable()
export class PokedexComponent implements OnInit {

  // the total pokemon list
  public pokemonList: Pokemon[];

  // the current list of pokemon displayed
  public activeList: Pokemon[];

  // indicates whether the active list is all, liked, or captured pokemon
  public activeListType = ListType.All;

  // pokemon selected by user
  public selectedPokemon: Pokemon;

  // current search text
  public searchText = '';
  
  // boolean to keep track if the user is currently searching used to disable infinite scroll
  public isSearching = false;

  // boolean to signify that data is loading from API
  public isLoading: boolean = false;

  // user-readable error message for when something goes wrong
  public errorMessage: string;

  // fa search icon used for search bar
  public faSearch = faSearch;

  // the total number of pokemon shown in the default view
  private displayIndex = 50;

  // the amount to increment the index each time the infinite scroll event fires
  private indexIncrement = 50;

  constructor(private pokedexService: PokedexService) {}

  ngOnInit(): void {
    this.pokedexService.getPokemonList().subscribe({
      next: this.handlePokemonList.bind(this),
      error: this.handlePokemonListError.bind(this),
    });
  }

  public selectPokemon(pokemon: Pokemon) {
    this.selectedPokemon = pokemon;
  }

  // event only fires on the all pokemone view when the user scrolls 80% down the list
  public loadMore() {
    // update the display index
    this.displayIndex += this.indexIncrement;
    // concat the next batch of pokemon from the total pokemon list
    this.activeList = this.pokemonList.slice(0, this.displayIndex);
  }

  public likedOrCaptured(pokemon: Pokemon) {
    // update both the pokemonList and the activeList
    this.updatePokemonInList(pokemon, this.pokemonList);
    this.updatePokemonInList(pokemon, this.activeList);
  }

  public changeList(type: ListType): void {
    // reset search when the active list type is changed
    this.isSearching = false;
    this.searchText = '';
    this.activeListType = type;
    switch(type) {
      case ListType.Captured:
        this.activeList = this.pokemonList.filter(poke => poke.captured);
        break;
      case ListType.Liked:
        this.activeList = this.pokemonList.filter(poke => poke.liked);
        break;
      default:
        this.activeList = this.pokemonList.slice(0, this.displayIndex);
    }
    if (this.activeList.length !==0 ) {
      this.selectedPokemon = this.activeList[0];
    }
  }

  public search(): void {
    // do nothing if there is no search text or pokemon lists
    if (!this.pokemonList || !this.activeList) {
      return;
    } else if (!this.searchText) {
      // if there is no search text, return the full list for liked and captured and the list up to the current displayed index otherwise 
      this.changeList(this.activeListType);
      return;
    }

    // if looking at all pokemon, search the whole list (not just where the user has scrolled to), otherwise use the active list
    const searchList = this.activeListType === ListType.All ? this.pokemonList : this.activeList;

    this.activeList = searchList.filter(poke => poke.name.toLocaleLowerCase().includes(this.searchText.toLocaleLowerCase()));
    // set isSearching to true to disable further infinite scroll loads
    this.isSearching = true;
  }

  // use default image for pokemon if the sprite url returns an error
  public onImageError(event: any) {
    this.pokedexService.onImageError(event);
  }

  // find a pokemon in a list and update it accordingly
  private updatePokemonInList(pokemon: Pokemon, pokemonList: Pokemon[]) {
    const foundIndex = pokemonList.findIndex(p => p.id === pokemon.id);
    if (foundIndex >= 0) {  
      pokemonList[foundIndex] = pokemon;
    }
  }

  // handler for successful response when getting the pokemon list
  private handlePokemonList(pokemon: Pokemon[]) {    
    this.pokemonList = pokemon;
    // only display the first section of pokemon determined by the initial display index
    this.activeList = pokemon.slice(0, this.displayIndex);
    this.selectedPokemon = pokemon[0];
  }

  // handler for error response when getting the pokemon list
  private handlePokemonListError(error: any){
    console.error(error);
    this.errorMessage = 'There was a problem retrieving the list of pokemon. Refresh the page to try again.'
  }
  
}
