import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, of, timeout } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UrlShortenerService {

  constructor(private httpClient: HttpClient) {
  }

  getShortUrl(longUrl: string) {
    return this.httpClient.get<ShortUrlResponse>('https://is.gd/create.php?format=json&url=' + longUrl)
      .pipe(
        timeout(3000),
        catchError(e => {
          return of(null);
        })
      );
  }
}

export interface ShortUrlResponse {
  shorturl: string;
}