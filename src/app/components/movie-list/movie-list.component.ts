import {Component, OnInit} from '@angular/core';
import {MovieService} from '../../services/movie.service';
import {Movie} from '../../models/movie';
import {HttpClientModule} from '@angular/common/http';
import {RouterModule} from "@angular/router";
import {CommonModule} from "@angular/common";
import {ImageService} from "../../services/image.service";

@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterModule],
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.css'],
})
export class MovieListComponent implements OnInit {
  movies: Movie[] = [];

  constructor(private movieService: MovieService, private imageService: ImageService) {}

  ngOnInit(): void {
    this.fetchMovies();
  }

  fetchMovies(): void {
    this.movieService.getMovies().subscribe(
      (data: Movie[]) => {
        this.movies = data;
      },
      (error) => {
        console.error('Error fetching movies', error);
      }
    );
  }

  getImageUrl(imageId: number): string {
    return this.imageService.getImageUrl(imageId);
  }
}
