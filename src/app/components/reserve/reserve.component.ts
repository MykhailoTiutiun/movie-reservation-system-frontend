import {Component, OnInit} from '@angular/core';
import {CommonModule} from "@angular/common";
import {Seat} from "../../models/seat";
import {ActivatedRoute, Router} from "@angular/router";
import {SeatService} from "../../services/seat.service";
import {Auditorium} from "../../models/auditorium";
import {AuditoriumService} from "../../services/auditorium.service";
import {ShowtimeService} from "../../services/showtime.service";
import {MovieService} from "../../services/movie.service";
import {Showtime} from "../../models/showtime";
import {Movie} from "../../models/movie";
import {catchError, forkJoin, map, switchMap} from "rxjs";
import {AuthService} from "../../services/auth.service";
import {routes} from "../../app.routes";

@Component({
  selector: 'app-reserve',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reserve.component.html',
  styleUrl: './reserve.component.css'
})
export class ReserveComponent implements OnInit{
  seats: Seat[] = [];
  showtime: Showtime = new Showtime();
  auditorium: Auditorium = new Auditorium();
  movie: Movie = new Movie();
  selectedSeats: Set<Seat> = new Set<Seat>();


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private seatService: SeatService,
    private showtimeService: ShowtimeService,
    private auditoriumService: AuditoriumService,
    private movieService: MovieService
  ) {
  }

  ngOnInit(): void {
    const showtimeId = Number(this.route.snapshot.paramMap.get('showtimeId'));
    this.showtimeService.getById(showtimeId).pipe(
      // Fetch the auditorium and movie once showtime is available
      switchMap(showtime => {
        this.showtime = showtime;
        return forkJoin([
          this.seatService.getAllByShowtimeId(showtimeId),
          this.auditoriumService.getById(showtime.auditoriumId)
        ]);
      }),
      // After auditorium and seats are fetched
      switchMap(([seats, auditorium]) => {
        this.seats = seats;
        this.loadSelectedSeatsFromStorage();
        this.auditorium = auditorium;
        return this.movieService.getById(auditorium.movieId);
      }),
      map(movie => {
        this.movie = movie;
      }),
      catchError(error => {
        console.error('Error loading data', error);
        // Handle error (e.g., show an error message or redirect)
        return [];
      })
    ).subscribe();
  }

  saveSelectedSeatsToStorage(): void {
    const seatIds = Array.from(this.selectedSeats).map(seat => seat.id);  // Assuming Seat has an 'id' property
    localStorage.setItem('selectedSeats', JSON.stringify(seatIds));  // Store the seat IDs in local storage
  }

  // Load selected seats from local storage
  loadSelectedSeatsFromStorage(): void {
    const savedSeats = localStorage.getItem('selectedSeats');
    if (savedSeats) {
      const seatIds: number[] = JSON.parse(savedSeats);
      // Assuming your `seats` array is already populated, match the saved IDs with actual Seat objects
      this.selectedSeats = new Set(this.seats.filter(seat => seatIds.includes(seat.id)));
    }
  }

  getRows(): Seat[][] {
    const rows: Seat[][] = [];
    let index = 0;

    // Define row configurations
    let rowConfigurations;

    if(this.auditorium.name === 'IMAX'){
      rowConfigurations = [
        { rows: 'ABCDEF', seatsPerRow: 36 },
        { rows: 'GHIJKL', seatsPerRow: 29 },
        { rows: 'M', seatsPerRow: 38 }
      ];
    } else if (this.auditorium.name === '4DX'){
      rowConfigurations = [
        { rows: 'ABCDEFGHIJ', seatsPerRow: 12 }
      ];
    } else {
      rowConfigurations = [
        { rows: 'ABCDEFGHI', seatsPerRow: 16 }
      ];
    }

    for (const config of rowConfigurations) {
      for (const row of config.rows) {
        rows.push(this.seats.slice(index, index + config.seatsPerRow));
        index += config.seatsPerRow;
      }
    }

    return rows;
  }

  isSeatBooked(seat: Seat): boolean {
    return !seat.availability;
  }

  reserveSeat(): void {
    let userId = this.authService.getUserId();
    if (userId == null) {
      this.router.navigate(['/sign-in'], { queryParams: { redirectUrl: this.router.url } })
    }

    const seatIds: number[] = [];

    this.selectedSeats.forEach(seat => seatIds.push(seat.id))

    this.seatService.reserveSeat(seatIds, userId).subscribe(
      () => this.router.navigate([this.router.url]),
      error => console.error('Login error: ', error)
    )
  }

  isSeatSelected(seat: Seat): boolean {
    return this.selectedSeats.has(seat);
  }

  toggleSeatSelection(seat: Seat): void {
    if (this.isSeatBooked(seat)) return;

    if (this.isSeatSelected(seat)) {
      this.selectedSeats.delete(seat);
    } else {
      this.selectedSeats.add(seat);
    }

    this.saveSelectedSeatsToStorage();
  }

}
