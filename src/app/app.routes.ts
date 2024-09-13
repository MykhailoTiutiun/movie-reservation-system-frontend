import { Routes } from '@angular/router';
import {MovieListComponent} from "./components/movie-list/movie-list.component";
import {MovieDetailComponent} from "./components/movie-detail/movie-detail.component";
import {ReserveComponent} from "./components/reserve/reserve.component";
import {SignInComponent} from "./components/sign-in/sign-in.component";
import {AdminMovieListComponent} from "./components/admin-movie-list/admin-movie-list.component";
import {adminGuard} from "./auth.guard";

export const routes: Routes = [
  { path: '', component: MovieListComponent },
  { path: 'movie/:id', component: MovieDetailComponent },
  { path: 'reserve/:showtimeId', component: ReserveComponent },
  { path: 'admin', component: AdminMovieListComponent, canActivate: [adminGuard] },
  { path: 'sign-in', component: SignInComponent },
  { path: '**', redirectTo: '' }
];
