import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Movie} from '../models/movie';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  private apiUrl = 'http://localhost:8080/v1/movies';

  constructor(private http: HttpClient) {}

  getMovies(): Observable<Movie[]> {
    return this.http.get<Movie[]>(this.apiUrl);
  }

  getById(id: number): Observable<Movie> {
    return this.http.get<Movie>(this.apiUrl + "/" + id);
  }

  create(movie: Movie): Observable<any> {
    const title = movie.title;
    const description = movie.description;
    const imageId = movie.imageId;
    return this.http.post(this.apiUrl, {title, description, imageId});
  }

  addGenre(movieId: number, genreId: number): Observable<any> {
    return this.http.put(this.apiUrl + '/addGenre', {movieId, genreId});
  }

  removeGenre(movieId: number, genreId: number): Observable<any> {
    return this.http.put(this.apiUrl + '/removeGenre', {movieId, genreId});
  }

  delete(id: number): Observable<any> {
    return this.http.delete(this.apiUrl + "/" + id);
  }
}
