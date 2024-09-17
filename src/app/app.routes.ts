import {Routes} from '@angular/router';
import {MovieListComponent} from "./components/movie-list/movie-list.component";
import {MovieDetailComponent} from "./components/movie-detail/movie-detail.component";
import {ReserveComponent} from "./components/reserve/reserve.component";
import {SignInComponent} from "./components/sign-in/sign-in.component";
import {AdminMovieListComponent} from "./components/admin-movie-list/admin-movie-list.component";
import {adminGuard} from "./auth.guard";
import {AdminShowtimesComponent} from "./components/admin-showtimes/admin-showtimes.component";
import {SignUpComponent} from "./components/sign-up/sign-up.component";
import {CheckEmailComponent} from "./components/check-email/check-email.component";

export const routes: Routes = [
  { path: '', component: MovieListComponent },
  { path: 'movie/:id', component: MovieDetailComponent },
  { path: 'reserve/:showtimeId', component: ReserveComponent },
  { path: 'admin', component: AdminMovieListComponent, canActivate: [adminGuard] },
  { path: 'admin/auditorium/:id', component: AdminShowtimesComponent, canActivate: [adminGuard] },
  { path: 'sign-in', component: SignInComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'check-email', component: CheckEmailComponent },
  { path: '**', redirectTo: '' }
];
