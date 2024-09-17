import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Auditorium} from "../models/auditorium";

@Injectable({
  providedIn: 'root'
})
export class AuditoriumService {

  private apiUrl = "http://localhost:8080/v1/auditoriums"

  constructor(private http:HttpClient) { }

  getByMovieId(movieId: number): Observable<Auditorium[]> {
    return this.http.get<Auditorium[]>(this.apiUrl + "?movieId=" + movieId);
  }

  getList(): Observable<Auditorium[]> {
    return this.http.get<Auditorium[]>(this.apiUrl);
  }

  getById(id: number): Observable<Auditorium> {
    return this.http.get<Auditorium>(this.apiUrl + "/" + id);
  }
}
