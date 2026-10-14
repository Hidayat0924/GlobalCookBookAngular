import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  fullName = '';
  email = '';
  mobile = '';
  country = '';
  username = '';
  password = '';
  confirmPassword = '';
  message = '';

  registerUser() {
    if (this.password !== this.confirmPassword) {
      this.message = 'Passwords do not match!';
      return;
    }

    if (this.password.length < 6) {
      this.message = 'Password must contain at least 6 characters.';
      return;
    }

    this.message =
      'Registration form submitted successfully! Demo only; account details are not saved.';
  }
}