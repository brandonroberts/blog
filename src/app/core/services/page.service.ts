import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PageService {

  constructor(private http: HttpClient) { }

  getPageContent(pageId: string) {
    return this.http.get(`/content/pages/${pageId}.md`, { responseType: 'text' });
  }
}
