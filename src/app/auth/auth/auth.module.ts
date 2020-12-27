import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from '../login/login.component';
import { SignupComponent } from '../signup/signup.component';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../../material/material.module';
import { RouterModule } from '@angular/router';
import { AuthRoutingModule } from '../auth-routing/auth-routing.module';
import { FlexLayoutModule } from '@angular/flex-layout';



@NgModule({
  declarations: [
    LoginComponent,
    SignupComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    RouterModule,
    AuthRoutingModule,
    FlexLayoutModule
  ]
})
export class AuthModule { }
