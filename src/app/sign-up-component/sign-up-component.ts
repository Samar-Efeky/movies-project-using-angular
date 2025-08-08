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
    name: ['',  [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(15)
        ]],
    age: ['', [
          Validators.required,
          Validators.min(12)
        ]],
    profileImage: ['', Validators.required], // base64
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });
  }

 onSubmit() {
    if (this.signupForm.valid) {
      const { email, password, name, age, profileImage } = this.signupForm.value;
      this.auth.signUp({email,
  password,
  name,
  age,
  imageUrl: profileImage}).subscribe({
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
  onImageChange(event: any) {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = () => {
    const base64 = reader.result as string;

    // تأكد إن الصيغة تبدأ بـ data:image/... تلقائيًا
    if (base64.startsWith('data:image')) {
      this.signupForm.patchValue({ profileImage: base64 });
    } else {
      const mimeType = file.type; // مثل image/jpeg أو image/png
      const fullBase64 = `data:${mimeType};base64,${base64.split(',')[1]}`;
      this.signupForm.patchValue({ profileImage: fullBase64 });
    }
  };

  reader.readAsDataURL(file);
}
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  goToSignIn(): void {
    this._router.navigate(['/signIn']);
  }
}
