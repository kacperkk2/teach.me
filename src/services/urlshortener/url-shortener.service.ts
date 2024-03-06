import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UrlShortenerService {

  constructor(private httpClient: HttpClient) {
  }

  getShortUrl(longUrl: string) {
    return this.httpClient.get<ShortUrlResponse>('https://is.gd/create.php?format=json&url=' + longUrl);
  }
}

export interface ShortUrlResponse {
  shorturl: string;
}