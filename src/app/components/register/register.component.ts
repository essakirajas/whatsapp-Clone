import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import { registerMutation } from './graphqlRegister';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from 'ngx-flexible-layout';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FlexLayoutModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  //Hello
  registerForm: FormGroup;
  selectedFile: File | null = null;
  formSubmitted = false;

  constructor(private fb: FormBuilder, private apollo: Apollo) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNo: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(2)]]
    });
  }

  // Handle file input
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      console.log('Selected file:', this.selectedFile);
    }
  }

  // Check if a control is invalid and should show an error
  isInvalid(controlName: string): boolean {
    const control = this.registerForm.get(controlName);
    return !!(control && control.invalid && (control.touched || this.formSubmitted));
  }

  // Handle form submission
  onSubmit(): void {
    this.formSubmitted = true;

    if (this.registerForm.invalid || !this.selectedFile) {
      alert('Please correct the form and upload a file.');
      return;
    }

    const { name, email, phoneNo, password } = this.registerForm.value;

    this.apollo.mutate({
      mutation: registerMutation,
      variables: {
        createuser: {
          name,
          email,
          phoneNo: Number(phoneNo),
          password
        },
        file: this.selectedFile
      },
      context: {
        headers: {
          'apollo-require-preflight': true
        },
        useMultipart: true
      }
    }).subscribe({
      next: ({ data }) => {
        console.log('Registration successful:', data);
        alert('You have been registered!');
        this.registerForm.reset();
        this.selectedFile = null;
        this.formSubmitted = false;
      },
      error: (err) => {
        console.error('Error during registration:', err);
        alert('Registration failed. Please try again.');
      }
    });
  }
}
