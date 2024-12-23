import { Injectable } from '@angular/core';
import { Movie } from '../interfaces/movie';
import { map } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  // TODO: Replace this with the actual API URL
  private apiUrl = '/assets/mocks/movies.json';
  constructor(private http: HttpClient) {}

  public getAllMovies$() {
    return this.http.get<Movie[]>(this.apiUrl);
  }

  public getMoviesByTitle$(text: string) {
    return this.getAllMovies$().pipe(
      map((movies) =>
        movies.filter((movie) =>
          movie.title.toLowerCase().includes(text.toLowerCase())
        )
      )
    );
  }
}
