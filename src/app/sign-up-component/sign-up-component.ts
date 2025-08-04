import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../services/user-service';
@Component({
  selector: 'app-sign-up-component',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './sign-up-component.html',
  styleUrl: './sign-up-component.css'
})
export class SignUpComponent implements OnInit{
  showPassword:boolean=false;
 signupForm!: FormGroup;
 signUpError: string = '';

  constructor(private fb: FormBuilder, private auth: UserService, private _router: Router) {}

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

 onSubmit() {
  if (this.signupForm.valid) {
    const { email, password } = this.signupForm.value;
    this.auth.signUp(email!, password!).subscribe({
      next: () => {
        this._router.navigate(['/profile']);
      },
      error: (err) => {
        // Firebase Authentication specific error code
        if (err.code === 'auth/email-already-in-use') {
          this.signUpError = 'This email is already in use. Please try logging in.';
        } else {
          this.signUpError = 'Sign up failed. Please try again later.';
        }
      }
    });
  }
}
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  goToSignIn(): void {
    this._router.navigate(['/signIn']);
  }
}
