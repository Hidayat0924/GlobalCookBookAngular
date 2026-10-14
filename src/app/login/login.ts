import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  email = '';
  password = '';
  message = '';

  login() {
    if (this.email && this.password) {
      this.message = 'Demo form submitted! Real account verification is not connected yet.';
    } else {
      this.message = 'Please enter your email and password.';
    }
  }
}