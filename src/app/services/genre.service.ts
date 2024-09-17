import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Genre} from "../models/genre";

@Injectable({
  providedIn: 'root'
})
export class GenreService {

  private apiUrl = 'http://localhost:8080/v1/genres'

  constructor(private http: HttpClient) {}

  getList(): Observable<Genre[]> {
    return this.http.get<Genre[]>(this.apiUrl);
  }

  create(genre: Genre): Observable<Genre> {
    return this.http.post<Genre>(this.apiUrl, {name: genre.name});
  }

  deleteById(id: number): Observable<any> {
    return this.http.delete(this.apiUrl + '/' + id);
  }
}
