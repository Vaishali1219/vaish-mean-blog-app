import { Component, OnInit, OnDestroy } from '@angular/core';
import { Post } from '../post.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PostService } from '../post.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { mimeType } from './mime-type.validator';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.scss']
})
export class PostCreateComponent implements OnInit, OnDestroy {
  title: string = '';
  content: string = '';
  private mode = 'create';
  private postId: string;
  imagePreview: string | ArrayBuffer;
  post: Post;
  isLoading = false;
  form: FormGroup;
  private authStatusSub: Subscription;

  constructor(private postService: PostService, private route: ActivatedRoute, private authService: AuthService) { }

  ngOnInit(): void {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(authStatus => {
      this.isLoading = false;
    });
    this.form = new FormGroup({
      'title': new FormControl(null, { validators: [Validators.required, Validators.minLength(3)] }),
      'content': new FormControl(null, { validators: [Validators.required, Validators.minLength(3)] })
      //'image': new FormControl(null, { validators: [Validators.required], asyncValidators: [mimeType] })
    });
    this.isLoading = true;
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.postService.getPost(this.postId).subscribe(postData => {
          this.post = { id: postData._id, title: postData.title, content: postData.content, creator: postData.creator };
          this.isLoading = false;
          this.form.setValue({
            'title': this.post.title,
            'content': this.post.content,
            //'image': this.post.imagePath,
            'creator': this.post.creator
          });
        });
      } else {
        this.mode = 'create';
        this.postId = null;
        this.isLoading = false;
      }
    });
  }

  onAddPost() {
    this.isLoading = true;

    if (this.mode === "create") {
      this.postService.addPost(this.form.value.title, this.form.value.content); //, this.form.value.image);
        this.isLoading = false;
    } else {
      this.postService.updatePost(
        this.postId,
        this.form.value.title,
        this.form.value.content
        //this.form.value.image
      );
      this.isLoading = false;
    }

    this.form.reset();
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file });
    this.form.get('image').updateValueAndValidity();

    console.log(file);
    console.log(this.form);

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(file);
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }

}
