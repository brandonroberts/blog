import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { Post } from '../models';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private http: HttpClient) { }

  getPost(postId: string) {
    return this.http.get(`/content/posts/${postId}.md`, { responseType: 'text' });
  }

  getPosts() {
    return this.http.get<{ posts: Post[] }>(`/content/posts.json`)
      .pipe(map(data => data.posts));
  }
}
