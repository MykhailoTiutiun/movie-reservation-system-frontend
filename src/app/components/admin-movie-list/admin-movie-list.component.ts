import {Component, OnInit} from '@angular/core';
import {Movie} from "../../models/movie";
import {MovieService} from "../../services/movie.service";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {Router, RouterModule} from "@angular/router";
import {ImageService} from "../../services/image.service";
import {switchMap} from "rxjs";

@Component({
  selector: 'app-admin-movie-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './admin-movie-list.component.html',
  styleUrl: './admin-movie-list.component.css'
})
export class AdminMovieListComponent implements OnInit {
  newMovie: Movie = new Movie();
  movies: Movie[] = [];
  imagePreview: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;

  constructor(private movieService: MovieService, private router: Router, private imageService: ImageService) {}

  ngOnInit(): void {
    this.movieService.getMovies().subscribe(movies => this.movies = movies);
  }

  addMovie(): void {
    if (this.newMovie.title && this.newMovie.description && this.selectedFile) {
      this.imageService.create(this.selectedFile).pipe(
        switchMap(imageId => {
          this.newMovie.imageId = imageId;
          return this.movieService.create(this.newMovie);
        })
      ).subscribe(
        () => {
          this.movies.push(this.newMovie);
          this.newMovie = new Movie();
          this.selectedFile = null;
        },
        error => console.error('Error occurred: ', error)
      );
    } else {
      alert('Please fill out the movie title and description!');
    }
  }
  getImageUrl(imageId: number): string {
    return this.imageService.getImageUrl(imageId)
  }

  removeMovie(movie: Movie): void {
    if(movie.imageId){
      this.imageService.deleteImage(movie.imageId).subscribe(
        error => console.error('Login error: ', error)
      )
    }
    this.movieService.delete(movie.id).subscribe(
      () => this.router.navigate([this.router.url]),
      error => console.error('Login error: ', error)
    );
    this.movies = this.movies.filter(m => m.id !== movie.id);
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }
}
