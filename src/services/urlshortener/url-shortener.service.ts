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
    const encodedUrl = encodeURIComponent(longUrl);
    return this.httpClient.get<ShortUrlResponse>('https://is.gd/create.php?format=json&url=' + encodedUrl)
      .pipe(
        timeout(3000),
        catchError(e => {
          return of(null);
        })
      );
  }

  expandUrl(code: string) {
    return this.httpClient.get<ExpandUrlResponse>('https://is.gd/forward.php?format=json&shorturl=' + code)
      .pipe(
        timeout(3000),
        catchError(() => of(null))
      );
  }
}

export interface ShortUrlResponse {
  shorturl: string;
}

export interface ExpandUrlResponse {
  url: string;
}