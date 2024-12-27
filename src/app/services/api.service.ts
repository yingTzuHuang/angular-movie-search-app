import { Injectable } from '@angular/core';
import { Movie } from '../models/domain';
import { catchError, map, Observable, throwError } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ApiMovie } from '../models/api';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  private mapApiMovieToMovie(apiMovie: ApiMovie): Movie {
    return {
      id: apiMovie.id,
      title: apiMovie.title,
      year: apiMovie.releaseYear,
      poster: apiMovie.posterImageUrl,
    };
  }

  public getMoviesBySearchText$(text: string): Observable<Movie[]> {
    let options = text
      ? { params: new HttpParams().set('searchTerm', text) }
      : undefined;

    return this.http
      .get<ApiMovie[]>(environment.apiUrl + 'movies', options)
      .pipe(
        map((apiMovies) =>
          apiMovies.map((apiMovie) => this.mapApiMovieToMovie(apiMovie))
        )
      )
      .pipe(
        catchError((error) => {
          console.error('API Error:', error);
          return throwError(
            () => new Error('Something went wrong. Please try again later.')
          );
        })
      );
  }

  public getAllMovies$(): Observable<Movie[]> {
    return this.getMoviesBySearchText$('');
  }
}
