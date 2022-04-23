import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Pokemon {
  name: string,
  spriteUrl: string,
  id: number,
  liked: boolean,
  captured: boolean,
}

export interface SearchResults {
  results: Array<Pokemon>
}

export interface Genus {
  genus: string,
  language: { name: string }
}

export interface PokemonMove {
  move: {    
    name: string,
  },
  version_group_details: { 
    level_learned_at: number,
    move_learn_method: { 
      name: string; 
    }; 
  }[]; 
}

export interface FlavorText {
  flavor_text: string,
  language: { name: string; };
}

@Injectable({
  providedIn: 'root'
})
export class PokedexService {
  private baseUrl: string = 'https://pokeapi.co/api/v2/';
  private baseSpriteUrl: string = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/';

  constructor(private http: HttpClient) { }

  getPokemonList(): Observable<Pokemon[]> {
    // get the entire pokemon list
    return this.http.get<any>(`${this.baseUrl}pokemon/?offset=0&limit=1500`).pipe(map(res => {
      // take the results and map them to a new array of Pokemon
      return res.results.map((val: { name: string; }, index: number) => {
        const id = index + 1;
        return {
          name: val.name,
          id,
          spriteUrl: `${this.baseSpriteUrl}${id}.png`,
          liked: false,
          captured: false,
        }
      });
    }));
  }

  getPokemon(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}pokemon/${id}/`);
  }

  getSpecies(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}pokemon-species/${id}/`);
  }

  onImageError(event: any) {
    console.error(`Could not find image for ${event.target.src}. Using default image instead.`)
    event.target.src = '../../assets/unknown_pokemon.png';
  }
}
