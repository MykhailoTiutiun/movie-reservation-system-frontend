import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Showtime} from "../models/showtime";

@Injectable({
  providedIn: 'root'
})
export class ShowtimeService {

  private apiUrl = "http://localhost:8080/v1/showtimes"

  constructor(private http:HttpClient) { }

  getByAuditoriumId(auditoriumId: number): Observable<Showtime[]> {
    return this.http.get<Showtime[]>(this.apiUrl + "?auditoriumId=" + auditoriumId);
  }

  getByMovieIdAndDate(movieId: number, dateString: string): Observable<Showtime[]> {
    return this.http.get<Showtime[]>(this.apiUrl + "?movieId=" + movieId + "&date=" + dateString);
  }

  getByDate(dateString: string): Observable<Showtime[]> {
    return this.http.get<Showtime[]>(this.apiUrl + "?date=" + dateString);
  }

  getById(id: number): Observable<Showtime> {
    return this.http.get<Showtime>(this.apiUrl + "/" + id);
  }

  create(showtime: Showtime): Observable<Showtime> {
    return this.http.post<Showtime>(this.apiUrl, {
      date: showtime.date,
      startTime: showtime.startTime,
      endTime: showtime.endTime,
      auditoriumId: showtime.auditoriumId,
      movieId: showtime.movieId
    });
  }

  update(showtime: Showtime): Observable<Showtime> {
    return this.http.put<Showtime>(this.apiUrl, {
      id: showtime.id,
      date: showtime.date,
      startTime: showtime.startTime,
      endTime: showtime.endTime
    });
  }

  deleteById(id: number): Observable<any> {
    return this.http.delete(this.apiUrl + "/" + id);
  }
}
