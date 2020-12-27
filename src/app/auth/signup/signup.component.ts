import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { error } from 'protractor';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit, OnDestroy {
  isLoading = false;
  private authStatusSubsc: Subscription;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authStatusSubsc = this.authService.getAuthStatusListener().subscribe(authStatus => {
      this.isLoading = false;
    });
  }

  onSignUp(form: NgForm) {
    if (form.invalid) {
      return;
    } else {
      this.isLoading = true;
      this.authService.createUser(form.value.email, form.value.password);
    }
  }

  ngOnDestroy() {
    this.authStatusSubsc.unsubscribe();
  }

}
