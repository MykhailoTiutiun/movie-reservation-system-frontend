export class Movie {
  id!: number;
  title!: string;
  description!: string;
  imageId!: number;
  genres!: Map<number, string>;
}
