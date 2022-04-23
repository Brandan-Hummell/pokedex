import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PokedexService } from './pokedex.service';
import { PokedexComponent } from './pokedex/pokedex.component';
import { PokemonDetailsComponent } from './pokemon-details/pokemon-details.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [
    AppComponent,
    PokedexComponent,
    PokemonDetailsComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    InfiniteScrollModule,
    FontAwesomeModule
  ],
  providers: [PokedexService],
  bootstrap: [AppComponent]
})
export class AppModule { }
