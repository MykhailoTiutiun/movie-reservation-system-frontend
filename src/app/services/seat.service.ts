import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Seat} from "../models/seat";
import {AuthService} from "./auth.service";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class SeatService {

  private apiUrl = "http://localhost:8080/v1/seats"

  constructor(private http: HttpClient, private authService: AuthService, private router: Router) {
  }

  getAllByShowtimeId(showtimeId: number): Observable<Seat[]> {
    return this.http.get<Seat[]>(this.apiUrl + "?showtimeId=" + showtimeId);
  }

  reserveSeat(seatIds: number[], userId: number | null): Observable<any> {
    return this.http.post(this.apiUrl + "/reserve", {seatIds, userId})
  }
}
