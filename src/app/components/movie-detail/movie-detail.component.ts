import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MovieService} from "../../services/movie.service";
import {Movie} from "../../models/movie";
import {CommonModule, formatDate} from "@angular/common";
import {Auditorium} from "../../models/auditorium";
import {AuditoriumService} from "../../services/auditorium.service";
import {ShowtimeService} from "../../services/showtime.service";
import {Showtime} from "../../models/showtime";
import {forkJoin, map, switchMap} from "rxjs";
import {ImageService} from "../../services/image.service";

@Component({
  selector: 'app-movie-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './movie-detail.component.html',
  styleUrls: ['./movie-detail.component.css']
})
export class MovieDetailComponent implements OnInit {
  movie: Movie = new Movie();
  auditoriums: Auditorium[] = [];
  showtimesMap: Map<string, Showtime[]> = new Map<string, Showtime[]>();
  selectedDate: string = 'today';
  weekDates: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private movieService: MovieService,
    private imageService: ImageService,
    private auditoriumService: AuditoriumService,
    private showtimeService: ShowtimeService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.movieService.getById(id).subscribe(movie => this.movie = movie);

    this.auditoriumService.getByMovieId(id).subscribe(auditoriums => {
      this.auditoriums = auditoriums;
      this.loadShowtimes();
    });
  }

  loadShowtimes(): void {
    if (this.selectedDate === 'week') {
      this.loadShowtimesForWeek();
    } else {
      const dateString = this.selectedDate ? this.getFormattedDate(this.selectedDate) : '';
      this.loadShowtimesForDate(dateString);
    }
  }

  loadShowtimesForDate(dateString: string): void {
    const showtimeObservables = this.auditoriums
      .map(auditorium =>
        this.showtimeService.getByAuditoriumIdAndDate(auditorium.id, dateString).pipe(
          map(showtimes => ({ auditoriumId: auditorium.id, showtimes }))
        )
      );

    forkJoin(showtimeObservables).subscribe(showtimesForAuditoriums => {
      showtimesForAuditoriums.forEach(item => {
        this.showtimesMap.set(item.auditoriumId.toString(), item.showtimes);
      });
    });
  }

  loadShowtimesForWeek(): void {
    this.weekDates = this.getWeekDates();
    const showtimeObservables = this.weekDates.flatMap(dateString =>
      this.auditoriums.map(auditorium =>
        this.showtimeService.getByAuditoriumIdAndDate(auditorium.id, dateString).pipe(
          map(showtimes => ({ auditoriumId: auditorium.id, dateString, showtimes }))
        )
      )
    );

    forkJoin(showtimeObservables).subscribe(showtimesForAuditoriums => {
      this.showtimesMap.clear();
      showtimesForAuditoriums.forEach(item => {
        const key = `${item.auditoriumId}-${item.dateString}`;
        this.showtimesMap.set(key, item.showtimes);
      });
    });
  }

  onDateChange(selectedDate: string, event: any): void {
    if (event.target.checked) {
      this.selectedDate = selectedDate;
    } else {
      this.selectedDate = '';
    }
    this.loadShowtimes();
  }

  getFormattedDate(day: string): string {
    const today = new Date();
    if (day === 'tomorrow') {
      today.setDate(today.getDate() + 1);
    }
    return formatDate(today, 'yyyy-MM-dd', 'en');
  }

  getWeekDates(): string[] {
    const dates: string[] = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(formatDate(date, 'yyyy-MM-dd', 'en'));
    }
    return dates;
  }

  hasShowtimesForDate(date: string): boolean {
    return this.auditoriums.some(auditorium => {
      const key = `${auditorium.id}-${date}`;
      const showtimes = this.showtimesMap.get(key);
      return showtimes && showtimes.length > 0;
    });
  }

  goToReservation(showtimeId: number): void {
    this.router.navigate(['/reserve', showtimeId]);
  }

  getImageUrl(): string {
    return this.imageService.getImageUrl(this.movie.imageId);
  }
}
