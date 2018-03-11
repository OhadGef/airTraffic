import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { GraphQLConfigModule } from './apollo.config';
import { AppComponent } from './app.component';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    GraphQLConfigModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
