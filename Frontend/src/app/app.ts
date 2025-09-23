import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {MatInput} from '@angular/material/input'

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatInput],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Frontend');
}
