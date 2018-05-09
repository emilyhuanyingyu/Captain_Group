import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {MainService} from "./main.service";
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { DisplayComponent } from './display/display.component';
import { CalendarComponent } from './calendar/calendar.component';
import { EventFormComponent } from './event-form/event-form.component';
import { AmazingTimePickerModule } from 'amazing-time-picker';
import { FormsModule } from '@angular/forms'; // <-- Import FormsModule
import { HttpModule } from '@angular/http';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    HeaderComponent,
    DisplayComponent,
    CalendarComponent,
    EventFormComponent
  ],
  imports: [
  BrowserModule,
    AppRoutingModule,
    AmazingTimePickerModule,
    FormsModule,
    HttpModule,
  ],
  providers: [MainService],
  bootstrap: [AppComponent]
})
export class AppModule { }
