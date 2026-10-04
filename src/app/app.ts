import { Component } from '@angular/core';
import { ConferenceList } from './conference-list/conference-list';

@Component({
  imports: [ConferenceList],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {}
