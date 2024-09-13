import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Showtime} from "../models/showtime";

@Injectable({
  providedIn: 'root'
})
export class ShowtimeService {

  private apiUrl = "http://localhost:8080/v1/showtimes"

  constructor(private http:HttpClient) { }

  getByAuditoriumIdAndDate(auditoriumId: number, dateString: string): Observable<Showtime[]> {
    return this.http.get<Showtime[]>(this.apiUrl + "?auditoriumId=" + auditoriumId + "&date=" + dateString);
  }

  getById(id: number): Observable<Showtime> {
    return this.http.get<Showtime>(this.apiUrl + "/" + id);
  }
}
