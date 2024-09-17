import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {CalendarEvent, CalendarEventTimesChangedEvent, CalendarModule, CalendarView} from "angular-calendar";
import {CommonModule} from "@angular/common";
import {Subject} from "rxjs";
import {Auditorium} from "../../models/auditorium";
import {AuditoriumService} from "../../services/auditorium.service";
import {ActivatedRoute} from "@angular/router";
import {Showtime} from "../../models/showtime";
import {ShowtimeService} from "../../services/showtime.service";
import {Movie} from "../../models/movie";
import {MovieService} from "../../services/movie.service";

export const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
};

@Component({
  selector: 'app-admin-showtimes',
  standalone: true,
  imports: [CommonModule, CalendarModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './admin-showtimes.component.html',
  styleUrl: './admin-showtimes.component.css'
})
export class AdminShowtimesComponent implements OnInit {
  view: CalendarView = CalendarView.Week;
  viewDate: Date = new Date();

  auditorium!: Auditorium;
  movies: Movie[] = [];
  showtimes: Showtime[] = [];

  constructor(
    private auditoriumService: AuditoriumService,
    private showtimeService: ShowtimeService,
    private movieService: MovieService,
    private route: ActivatedRoute) {
  }

  refresh = new Subject<void>();

  events: CalendarEvent[] = [];
  externalEvents: CalendarEvent[] = [];

  ngOnInit(): void {
    this.route.paramMap.subscribe(paramMap => {
      let auditoriumId = Number(paramMap.get('id'));
      this.auditoriumService.getById(auditoriumId).subscribe(auditorium => this.auditorium = auditorium);
      this.movieService.getMovies().subscribe(movies => {
        this.movies = movies;
        this.externalEvents = this.movies.map(movie => this.getExternalEvent(movie));
        this.showtimeService.getByAuditoriumId(auditoriumId).subscribe(showtimes => {
          this.showtimes = showtimes;
          this.renderShowtimes();
        });
      });
    });
  }

  private renderShowtimes() {
    this.events = [];
    this.showtimes.forEach(showtime => {
      this.events.push(this.getEvent(showtime));
    });
    this.refresh.next();
  }

  getEvent(showtime: Showtime): CalendarEvent {
    const movie = this.movies.filter(movie => movie.id === showtime.movieId).at(0);

    return {
      id: showtime.id,
      title: movie?.title || 'Unknown movie',
      color: colors.yellow,
      start: this.dateFromSting(showtime.date, showtime.startTime),
      end: this.dateFromSting(showtime.date, showtime.endTime),
      draggable: true,
      resizable: {
        beforeStart: false,
        afterEnd: true
      },
      actions: [
        {
          label: '<i class="fas fa-fw fa-trash-alt">Delete</i>',
          onClick: ({event}: { event: CalendarEvent }): void => {
            if (event.id === undefined || typeof event.id === "string") {
              throw new Error('Event ID is not valid');
            }
            this.deleteShowtime(event.id);
          },
        },
      ]
    };
  }

  getExternalEvent(movie: Movie): CalendarEvent {
    return {
      id: movie.id,
      title: movie.title,
      color: colors.blue,
      start: new Date(),
      draggable: true
    }
  }

  eventDropped(changedEvent: CalendarEventTimesChangedEvent): void {
    if(changedEvent.event.color === colors.blue){
      this.createShowtime(changedEvent);
    } else {
      this.updateShowtime(changedEvent);
    }
  }

  createShowtime({
                   event,
                   newStart,
                   newEnd,
                 }: CalendarEventTimesChangedEvent): void {
    if(newEnd === undefined){
      newEnd = new Date(newStart);
      newEnd.setHours(newStart.getHours() + 1)
    }
    const showtime: Showtime = <Showtime>{
      id: -1,
      date: newStart.toLocaleString('sv').slice(0, 10),
      startTime: newStart.toLocaleString('sv').slice(11, 16),
      endTime: newEnd.toLocaleString('sv').slice(11, 16),
      auditoriumId: this.auditorium.id,
      movieId: event.id
    }

    this.showtimeService.create(showtime).subscribe(showtime => {
      this.events.push(this.getEvent(showtime));
      this.refresh.next();
    },
    error => console.error('Create error: ', error)
    );
  }

  updateShowtime({
                   event,
                   newStart,
                   newEnd,
                 }: CalendarEventTimesChangedEvent): void {
    if(newEnd === undefined){
      throw Error("newEnd is undefined");
    }

    const showtime: Showtime = <Showtime>{
      id: event.id,
      date: newStart.toLocaleString('sv').slice(0, 10),
      startTime: newStart.toLocaleString('sv').slice(11, 16),
      endTime: newEnd.toLocaleString('sv').slice(11, 16),
      auditoriumId: -1,
      movieId: -1
    }

    this.showtimeService.update(showtime).subscribe(showtime => {
      this.showtimes = this.showtimes.filter(s => s.id != showtime.id)
      this.showtimes.push(showtime);
      this.renderShowtimes();
    },
    error => console.error('Update error: ', error)
    );

  }

  dateFromSting(date: string, time: string): Date {
    const [hours, minutes] = time.split(':').map(Number);
    const eventDate = new Date(date);

    eventDate.setHours(hours);
    eventDate.setMinutes(minutes);
    eventDate.setSeconds(0);

    return eventDate;
  }

  deleteShowtime(id: number): void {
    const confirmed = confirm('Are you sure you want to delete this showtime?');

    if (confirmed) {
      this.showtimeService.deleteById(id).subscribe(
        () => this.events = this.events.filter(event => event.id != id),
        error => console.error('Delete error: ', error)
      )
    }
  }
}
