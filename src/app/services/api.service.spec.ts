import { TestBed } from '@angular/core/testing';

import { ApiService } from './api.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Movie } from '../models/domain';
import { environment } from '../../environments/environment';
import { of } from 'rxjs';
import { ApiMovie } from '../models/api';

describe('ApiService', () => {
  let service: ApiService;
  let httpClientSpy: { get: jasmine.Spy };

  beforeEach(() => {
    // Create a spy for HttpClient
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);

    TestBed.configureTestingModule({
      providers: [
        { provide: HttpClient, useValue: httpClientSpy },
        provideHttpClientTesting(),
        ApiService,
      ],
    });
    service = TestBed.inject(ApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve all movies', () => {
    const dummyApiMovies: ApiMovie[] = [
      {
        id: '1',
        title: 'Movie 1',
        releaseYear: 2021,
        posterImageUrl: '/test-path1',
      },
      {
        id: '2',
        title: 'Movie 2',
        releaseYear: 2022,
        posterImageUrl: '/test-path2',
      },
    ];
    const dummyMovies: Movie[] = [
      { id: '1', title: 'Movie 1', year: 2021, poster: '/test-path1' },
      { id: '2', title: 'Movie 2', year: 2022, poster: '/test-path2' },
    ];

    // Configure the spy to return a successful response
    httpClientSpy.get.and.returnValue(of(dummyApiMovies));

    service.getAllMovies$().subscribe((movies) => {
      expect(movies.length).toBe(2);
      expect(movies).toEqual(dummyMovies);
    });

    expect(httpClientSpy.get.calls.count()).toBe(1);
    expect(httpClientSpy.get).toHaveBeenCalledWith(
      environment.apiUrl + 'movies',
      undefined
    );
  });

  it('should filter movies by title', () => {
    const dummyApiMovies: ApiMovie[] = [
      {
        id: '1',
        title: 'Movie 1',
        releaseYear: 2021,
        posterImageUrl: '/test-path1',
      },
      {
        id: '2',
        title: 'Another Movie',
        releaseYear: 2022,
        posterImageUrl: '/test-path2',
      },
    ];

    const dummyMovies: Movie[] = [
      { id: '1', title: 'Movie 1', year: 2021, poster: '/test-path1' },
      { id: '2', title: 'Another Movie', year: 2022, poster: '/test-path2' },
    ];

    // Configure the spy to return a successful response
    httpClientSpy.get.and.returnValue(of(dummyApiMovies));

    service.getMoviesBySearchText$('Movie').subscribe((movies) => {
      expect(movies.length).toBe(2);
      expect(movies).toEqual(dummyMovies);
    });

    expect(httpClientSpy.get.calls.count()).toBe(1);
    expect(httpClientSpy.get).toHaveBeenCalledWith(
      environment.apiUrl + 'movies',
      { params: new HttpParams().set('searchTerm', 'Movie') }
    );
  });

  it('should filter movies by title case insensitive', () => {
    const dummyApiMovies: ApiMovie[] = [
      {
        id: '2',
        title: 'Another Movie',
        releaseYear: 2022,
        posterImageUrl: '/test-path2',
      },
    ];

    const dummyMovies: Movie[] = [
      { id: '2', title: 'Another Movie', year: 2022, poster: '/test-path2' },
    ];

    // Configure the spy to return a successful response
    httpClientSpy.get.and.returnValue(of(dummyApiMovies));

    service.getMoviesBySearchText$('another').subscribe((movies) => {
      expect(movies.length).toBe(1);
      expect(movies).toEqual(dummyMovies);
    });

    expect(httpClientSpy.get.calls.count()).toBe(1);
    expect(httpClientSpy.get).toHaveBeenCalledWith(
      environment.apiUrl + 'movies',
      { params: new HttpParams().set('searchTerm', 'another') }
    );
  });
});
