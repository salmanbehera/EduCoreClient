import { Component, OnInit, TemplateRef, ViewChild,ViewEncapsulation } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog'; // For dialog
import { MatError } from '@angular/material/form-field';  // For displaying errors
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import ValidateForm from '../Shared/Validators/ValidateForm';
import { CommonModule, Time } from '@angular/common';
import { AuthService } from '../Shared/Services/auth.service';
import { FormInputComponent } from '../Shared/Components/Input/form-input.component';
import { ButtonComponent } from '../Shared/Components/Button/button.component';
import { DropdownComponent } from '../Shared/Components/Dropdown/dropdown.component';
import { Observable, of } from 'rxjs';
import { demoDropdownDataService } from '../Shared/Services/demodynamicdropdown';
import { HttpClientModule } from '@angular/common/http';
import { CheckListBoxComponent } from '../Shared/Components/CheckListBox/check-list-box.component';
import { DatepickerComponent } from '../Shared/Components/DatePicker/datepicker.component';
interface DropdownOption {
  value: any;
  text: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatCardModule,
    MatError,
    
    ReactiveFormsModule,
    FormInputComponent,
    ButtonComponent,
    DropdownComponent,
    CheckListBoxComponent,
    DatepickerComponent
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
   
})

 
export class LoginComponent implements OnInit {
  
 loadedDynamicOptions: DropdownOption[] = []; // To store the fetched options
  type: string = 'password';
  isText: boolean = false;
  eyeIcon: string = 'fa-eye-slash';
  loginForm!: FormGroup;
  resetPasswordForm!: FormGroup; // Form for reset password
  public resetPasswordEmail!: string;
  public isValidEmail!: boolean;
  @ViewChild('dialogTemplate') dialogTemplate!: TemplateRef<any>; // Access the template
  searchControl = new FormControl();
  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private authservice: AuthService,
    private router: Router,
    
  ) {

    
  }

  ngOnInit(): void {
    
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3),
         Validators.maxLength(10)]],
      
    password: ['', [Validators.required,Validators.minLength(3)]],
     //resetPasswordEmail:['', [Validators.required,Validators.email]],
     
    });
    
    // Initialize the reset password form
    this.resetPasswordForm = this.fb.group({
      resetPasswordEmail:['', [Validators.required,Validators.email]],
    });
  }

    

  
  
 


  hideshowpass() {
    this.isText = !this.isText;
    this.isText ? (this.eyeIcon = 'fa-eye') : (this.eyeIcon = 'fa-eye-slash');
    this.isText ? (this.type = 'text') : (this.type = 'password');
  }
  OnLogin() {
      if (this.loginForm.valid) {
        console.log(this.loginForm.value);
        this.authservice.Login();  // Simulate a login
        this.router.navigate(['dashboard']);  // Redirect to dashboard after login
      }  
      else {
        ValidateForm.validaeAllformfields(this.loginForm);
        alert('your form is invalid');
      }
  }
  checkValidEmail(event: string) {
    const value = event;
    const pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    this.isValidEmail = pattern.test(value);
    return this.isValidEmail;
  }
  ConfirmToSend() {
    //if (this.checkValidEmail(this.resetPasswordEmail)) {
      if (this.resetPasswordForm.valid) {
      console.log(this.resetPasswordEmail);

  //     //api call
  //     this.auth
  //       .sendRequestPasswordLink(this.resetPasswordEmail)
  //       .subscribe({
  //         next: (res) => {
  //           this.toast.success({
  //             detail: 'Success',
  //             summary: 'Mail Sent Successfully',
  //             duration: 3000,
  //           });

  //           this.resetPasswordEmail = '';
  //           const btnref = document.getElementById('closeBtn');
  //           btnref?.click();
  //         },
  //         error: (err) => {
  //           this.toast.error({
  //             detail: 'Error',
  //             summary: 'Something went wrong',
  //             duration: 3000,
  //           });
  //         },
  //       });
    }
   }

  //  openResetPasswordDialog() {
  //   const dialogRef = this.dialog.open(this.dialogTemplate, {
  //     width: '400px',
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     console.log('The dialog was closed', result);
  //     // Handle the result if necessary
  //   });
  // }

  openResetPasswordDialog() {
    if (this.dialogTemplate) {
      const dialogRef = this.dialog.open(this.dialogTemplate, { width: '400px' });
  
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed', result);
      });
    } else {
      console.error('Dialog template not found.');
    }
  }
  

  onClose() {
    this.dialog.closeAll(); // This will close the dialog
  }

  // getControl(name: string): FormControl {
  //   return this.loginForm.get(name) as FormControl;
  // }
  getControl(name: string): FormControl {
    const control = this.loginForm.get(name) || this.resetPasswordForm.get(name);
    if (control instanceof FormControl) {
      return control;
    }
    throw new Error(`Control with name '${name}' is not a FormControl`);
  }


}