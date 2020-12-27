import { Component, OnInit } from '@angular/core';
import { Post } from './posts/post.model';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'My App';
  storedPosts: Post[] = [];

  constructor(private authService: AuthService) { }

  onPostAdded(post) {
    this.storedPosts.push(post);
  }

  ngOnInit() {
    this.authService.autoAuthUser();
  }
}
