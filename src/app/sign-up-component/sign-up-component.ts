import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../services/user-service';
import { AnimateOnVisibleDirective } from '../directives/animate-on-visible.directive';
import { slideDown, slideUp, zoomIn } from '../animations/animations';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-sign-up-component',
  imports: [CommonModule, ReactiveFormsModule, AnimateOnVisibleDirective],
  templateUrl: './sign-up-component.html',
  styleUrl: './sign-up-component.css',
  animations: [slideDown, slideUp, zoomIn]
})
export class SignUpComponent implements OnInit {
  showPassword: boolean = false;
  signupForm!: FormGroup;
  signUpError: string = '';

  private fb = inject(FormBuilder);
  private auth = inject(UserService);
  private router = inject(Router);

  ngOnInit(): void {
    // Initialize form with validators
    this.signupForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(15)]],
      age: ['', [Validators.required, Validators.min(12)]],
      profileImage: ['', Validators.required], // base64 image string
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.signupForm.valid) {
      const { email, password, name, age, profileImage } = this.signupForm.value;

      // Use take(1) to auto-complete subscription after first response
      this.auth.signUp({ email, password, name, age, imageUrl: profileImage })
        .pipe(take(1))
        .subscribe({
          next: () => {
            // Navigate to profile page on success
            this.router.navigate(['/profile']);
          },
          error: (err) => {
            // Handle Firebase auth error codes
            if (err.code === 'auth/email-already-in-use') {
              this.signUpError = 'This email is already in use. Please try logging in.';
            } else {
              this.signUpError = 'Sign up failed. Please try again later.';
            }
          }
        });
    }
  }

  onImageChange(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      const base64 = reader.result as string;

      // Check if base64 string starts with data:image
      if (base64.startsWith('data:image')) {
        this.signupForm.patchValue({ profileImage: base64 });
      } else {
        // Manually add mime type if missing
        const mimeType = file.type; // e.g. image/jpeg or image/png
        const fullBase64 = `data:${mimeType};base64,${base64.split(',')[1]}`;
        this.signupForm.patchValue({ profileImage: fullBase64 });
      }
    };

    reader.readAsDataURL(file);
  }

  // Toggle password visibility (show/hide)
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  // Navigate to sign-in page
  goToSignIn(): void {
    this.router.navigate(['/signIn']);
  }
}
