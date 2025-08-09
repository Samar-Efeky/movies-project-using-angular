import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../services/user-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sign-in-component',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './sign-in-component.html',
  styleUrl: './sign-in-component.css'
})
export class SignInComponent {
  showPassword:boolean=false;
 signInForm!: FormGroup;
 signInError: string = '';
  constructor(private fb: FormBuilder,
     private auth: UserService, 
     private _router: Router) {}
     
  ngOnInit(): void {
    this.signInForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

 onSubmit() {
  if (this.signInForm.valid) {
    const { email, password } = this.signInForm.value;
    this.auth.signIn(email!, password!).subscribe({
      next: () => {
        this._router.navigate(['/home-page']);
      },
      error: (err) => { 
        console.log(err);
        
        // Firebase Authentication specific error code
        if (err.code === 'auth/invalid-credential') {
          this.signInError = 'Invalid email or password.';
        } else {
          this.signInError = 'Sign up failed. Please try again later.';
        }
      }
    });
  }
}
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  goToSignUp(): void {
    this._router.navigate(['/signUp']);
  }
}
