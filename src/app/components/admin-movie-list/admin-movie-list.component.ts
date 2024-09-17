import {Component, OnInit} from '@angular/core';
import {Movie} from "../../models/movie";
import {MovieService} from "../../services/movie.service";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {Router, RouterModule} from "@angular/router";
import {ImageService} from "../../services/image.service";
import {switchMap} from "rxjs";
import {Genre} from "../../models/genre";
import {GenreService} from "../../services/genre.service";

@Component({
  selector: 'app-admin-movie-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './admin-movie-list.component.html',
  styleUrl: './admin-movie-list.component.css'
})
export class AdminMovieListComponent implements OnInit {
  newMovie: Movie = new Movie();
  newGenre: Genre = new Genre();
  movies: Movie[] = [];
  genres: Genre[] = [];
  imagePreview: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  selectedAddGenreMovie: Movie = new Movie();
  selectedAddGenreGenre: Genre = new Genre();

  constructor(
    private movieService: MovieService,
    private router: Router,
    private imageService: ImageService,
    private genreService: GenreService,
  ) {
  }

  ngOnInit(): void {
    this.movieService.getMovies().subscribe(movies => {
      movies.forEach(movie => {
        movie.genres = new Map(Object.entries(movie.genres).map(([key, value]) => [Number(key), value]));
      })
      return this.movies = movies;
    });
    this.genreService.getList().subscribe(genres => this.genres = genres);
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

  openAddGenreForm(movie: Movie): void {
    this.selectedAddGenreMovie = movie;
  }

  closeAddGenreForm(): void {
    this.selectedAddGenreMovie = new Movie();
  }

  removeMovie(movie: Movie): void {
    if (confirm('Are you sure you want to delete this movie?')) {

      if (movie.imageId) {
        this.imageService.deleteImage(movie.imageId).subscribe(
          error => console.error('Image deletion error: ', error)
        )
      }
      this.movieService.delete(movie.id).subscribe(
        () => this.movies = this.movies.filter(m => m.id != movie.id),
        error => console.error('Movie deletion error: ', error)
      );
      this.movies = this.movies.filter(m => m.id !== movie.id);
    }
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

  createGenre(): void {
    if(this.newGenre.name){
      this.genreService.create(this.newGenre).subscribe(
        genre => {
          this.genres.push(genre)
          this.newGenre = new Genre();
        },
        error => console.error('Genre creation error: ', error)
      )
    } else {
      alert('Please fill out the genre name!');
    }
  }

  deleteGenre(id: number): void {
    if(confirm('Are you sure you want to delete this genre?')){
      this.genreService.deleteById(id).subscribe(
        () => this.genres = this.genres.filter(genre => genre.id != id),
        error => console.error('Genre deletion error: ', error)
      );
    }
  }

  addGenreToMovie(genre: Genre, movie: Movie): void {
    this.movieService.addGenre(movie.id, genre.id).subscribe(
      () => {
        movie.genres.set(genre.id, genre.name);
        this.selectedAddGenreGenre = new Genre();
        this.selectedAddGenreMovie = new Movie();
      },
      error => console.error('Genre adding to movie error: ', error)
    )
  }

  removeGenreFromMovie(genreId: number, movie: Movie): void {
    this.movieService.removeGenre(movie.id, genreId).subscribe(
      () => {
        movie.genres.delete(Number(genreId));
      },
      error => console.error('Genre removing from movie error: ', error)
    );
  }
}
