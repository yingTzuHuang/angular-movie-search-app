import { TestBed } from '@angular/core/testing';

import { ApiService } from './api.service';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { Movie } from '../models/domain/movie';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), ApiService],
    });
    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve all movies', () => {
    const dummyMovies: Movie[] = [
      { id: '1', title: 'Movie 1', year: 2021, poster: '/test-path1' },
      { id: '2', title: 'Movie 2', year: 2022, poster: '/test-path2' },
    ];

    service.getAllMovies$().subscribe((movies) => {
      expect(movies.length).toBe(2);
      expect(movies).toEqual(dummyMovies);
    });

    const req = httpMock.expectOne('/assets/mocks/movies.json');
    expect(req.request.method).toBe('GET');
    req.flush(dummyMovies);
  });

  it('should filter movies by title', () => {
    const dummyMovies: Movie[] = [
      { id: '1', title: 'Movie 1', year: 2021, poster: '/test-path1' },
      { id: '2', title: 'Another Movie', year: 2022, poster: '/test-path2' },
    ];

    service.getMoviesBySearchText$('movie').subscribe((movies) => {
      expect(movies.length).toBe(2);
      expect(movies).toEqual(dummyMovies);
    });

    const req = httpMock.expectOne('/assets/mocks/movies.json');
    expect(req.request.method).toBe('GET');
    req.flush(dummyMovies);
  });

  it('should filter movies by title case insensitive', () => {
    const dummyMovies: Movie[] = [
      { id: '1', title: 'Movie 1', year: 2021, poster: '/test-path1' },
      { id: '2', title: 'Another Movie', year: 2022, poster: '/test-path2' },
    ];

    service.getMoviesBySearchText$('another').subscribe((movies) => {
      expect(movies.length).toBe(1);
      expect(movies[0].title).toBe('Another Movie');
    });

    const req = httpMock.expectOne('/assets/mocks/movies.json');
    expect(req.request.method).toBe('GET');
    req.flush(dummyMovies);
  });
});
