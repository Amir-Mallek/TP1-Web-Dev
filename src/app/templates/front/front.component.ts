import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TTCComponent } from 'src/app/ttc/ttc.component';

@Component({
  selector: 'app-front',
  templateUrl: './front.component.html',
  styleUrls: ['./front.component.css'],
  standalone: true,
  imports: [RouterOutlet, TTCComponent],
})
export class FrontComponent {}
