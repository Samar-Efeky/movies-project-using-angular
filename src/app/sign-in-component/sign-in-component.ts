import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../services/user-service';
import { CommonModule } from '@angular/common';
import { take } from 'rxjs/operators';
import { AnimateOnVisibleDirective } from '../directives/animate-on-visible.directive';
import { slideDown, slideUp, zoomIn } from '../animations/animations';

@Component({
  selector: 'app-sign-in-component',
  imports: [CommonModule, ReactiveFormsModule,AnimateOnVisibleDirective],
  templateUrl: './sign-in-component.html',
  styleUrl: './sign-in-component.css',
  animations:[slideDown, slideUp,zoomIn]
})
export class SignInComponent {
  showPassword: boolean = false;
  signInForm!: FormGroup;
  signInError: string = '';

  constructor(
    private fb: FormBuilder,
    private auth: UserService,
    private _router: Router
  ) {}

  ngOnInit(): void {
    // Initialize the form with validators
    this.signInForm = this.fb.group({
      email: ['samar@gmail.com', [Validators.required, Validators.email]],
      password: ['123456', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    if (this.signInForm.valid) {
      const { email, password } = this.signInForm.value;
      // Use take(1) to automatically complete the subscription after first emission
      this.auth.signIn(email!, password!)
        .pipe(take(1))
        .subscribe({
          next: () => {
            // Navigate to home page after successful sign-in
            this._router.navigate(['/home-page']);
          },
          error: (err) => {
            console.error(err);

            // Handle Firebase auth error codes
            if (err.code === 'auth/invalid-credential') {
              this.signInError = 'Invalid email or password.';
            } else {
              this.signInError = 'Sign in failed. Please try again later.';
            }
          }
        });
    }
  }

  // Toggle password input visibility
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  // Navigate to sign-up page
  goToSignUp(): void {
    this._router.navigate(['/signUp']);
  }
}
