import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor(private http: HttpClient) { }

  getImageUrl(imageId: number): string {
    return `http://localhost:8080/v1/images/${imageId}`;
  }

  create(image: File): Observable<number> {
    const formData = new FormData();
    formData.append('imageData', image);

    return this.http.post<number>('http://localhost:8080/v1/images', formData, {
      headers: { 'enctype': 'multipart/form-data' }
    });
  }

  deleteImage(id: number): Observable<any> {
    return this.http.delete('http://localhost:8080/v1/images/' + id);
  }
}
