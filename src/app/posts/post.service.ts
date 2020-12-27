import { Injectable } from '@angular/core';
import { Post } from './post.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class PostService {
  private posts: Post[] = [];
  private newPostsAdded = new Subject<{ posts: Post[], postCount: number }>();

  BACKEND_URL = environment.apiUrl + "/posts";

  constructor(private http: HttpClient, private router: Router) { }

  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pageSize=${postsPerPage}&page=${currentPage}`;
    this.http.get<{ message: string, posts: any, maxPosts: number }>(this.BACKEND_URL + queryParams).map(postData => {
      return {
        posts: postData.posts.map(post => {
          return {
            title: post.title,
            content: post.content,
            id: post._id,
            //imagePath: post.imagePath,
            creator: post.creator
          };
        }),
        maxPosts: postData.maxPosts
      };
    }).subscribe((tpostsData) => {
      this.posts = tpostsData.posts;
      this.newPostsAdded.next({ posts: [...this.posts], postCount: tpostsData.maxPosts });
    });
  }

  getPostUpdatedListner() {
    return this.newPostsAdded.asObservable();
  }

  addPost(title: string, content: string, image?: File) {
    const postData = new FormData();
    postData.append("title", title);
    postData.append("content", content);
    //postData.append("image", image, title);

    this.http.post<{ message: string, post: Post }>(this.BACKEND_URL, postData).subscribe(responseData => {
      this.router.navigate(["/"]);
    });
  }

  getPost(id: string) {
      //return { ...this.posts.find(p => p.id === id) };
      return this.http.get<{ _id: string, title: string, content: string, creator: string }>(this.BACKEND_URL + "/" + id);
  }

  deletePost(postId: string) {
    return this.http.delete(this.BACKEND_URL + "/" + postId);
  }

  updatePost(id: string, title: string, content: string) {
    let postData = {
        id: id,
        title: title,
        content: content,
        creator: null
      };
  
    this.http
      .put(this.BACKEND_URL + "/" + id, postData)
      .subscribe(response => {
        this.router.navigate(["/"]);
      });
  }
}
