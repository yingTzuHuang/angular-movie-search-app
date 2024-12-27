import { Component } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Movie } from './models/domain/movie';
import { ApiService } from './services/api.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-root',
  imports: [CommonModule, MatCardModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  public movies$: Observable<Movie[] | undefined> = of(undefined);

  constructor(private api: ApiService) {}

  public ngOnInit(): void {
    this.movies$ = this.api.getAllMovies$();
  }

  public searchMovies(text: string) {
    this.movies$ = this.api.getMoviesBySearchText$(text);
  }
}
