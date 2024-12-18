import { Component, Inject, InjectionToken, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { FormInputComponent } from '../../../Shared/Components/Input/form-input.component';
import { ButtonComponent } from '../../../Shared/Components/Button/button.component';
import { CommonModule } from '@angular/common';
import { ClassDto } from '../models/classdto.model';
import { ClassService } from '../services/Class.service';
 
import { HttpFormMessageService } from '../../../Shared/utils/HttpFormMessage.service';
@Component({
  selector: 'app-classdialog',
  standalone: true,
  imports: [
  
FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MatDialogModule,
    MatIconModule,
    FormInputComponent,
    ButtonComponent,
  ],
  templateUrl: './classdialog.component.html',
  styleUrls: ['./classdialog.component.scss'],
})

export class ClassdialogComponent implements OnInit {
  action!: 'save' | 'edit' | 'view';
  classData!: ClassDto | null;
  
  constructor(
  @Inject(MAT_DIALOG_DATA) public data: { action: 'edit' | 'save' | 'view' ; data?: ClassDto },
  private dialogRef: MatDialogRef<ClassdialogComponent>,
  private fb:FormBuilder,
  private classservice:ClassService,
  private httpformmessage:HttpFormMessageService
)
  {
    this.action = data.action;
    this.classData = data.data || null;
     
  }

  classForm!: FormGroup;

  getControl(name: string): FormControl {
    return this.classForm.get(name) as FormControl;
  }
  ngOnInit(): void {

    this.classForm = new FormGroup({
      className: new FormControl(''),
      classShortName: new FormControl(''),
    });
    this.classForm = this.fb.group({
      id:'00000000-0000-0000-0000-000000000000',
      isDeleted:'false',
      //id: [null], // Hidden ID field
      className: ['', [Validators.required, Validators.minLength(3),
                      Validators.maxLength(20)]],
         classShortName: ['', [Validators.required, Validators.minLength(3),
                              Validators.maxLength(10)]],
    });
    if (this.action === 'edit' || this.action === 'view') {
      this.BindClassData();
    }
    
  }
  SubmitClass(): void {
    console.log(this.classForm.value);
    if (this.action === 'save') {
      this.saveClass();
    } 
    else if (this.action === 'edit') {
      this.UpdateClass();
    }
     
    
  }

  saveClass(): void {
    
    if (this.classForm.invalid) {
      //this.handleInvalidForm();
      this.httpformmessage.handleInvalidForm(this.classForm);
    }
  
    const classDto: ClassDto = this.classForm.value;
    this.classservice.SaveClass(classDto).subscribe({

      next: (response) => {
        // Update the form with the new ID from the response
        // if (response?.id) {
        //   this.classForm.patchValue({ id: response.id });
        // }
        this.httpformmessage.handleSave();
        // Pass the saved data to the parent and close the dialog
        this.dialogRef.close({ action: 'save', data: response?.id });
      },
      error: (error) => {
        this.httpformmessage.handleError(error);
      },
    });
  }

  UpdateClass(): void {
    
    if (this.classForm.invalid) {
      //this.handleInvalidForm();
      this.httpformmessage.handleInvalidForm(this.classForm);
    }
  
    const classDto: ClassDto = this.classForm.value;
    this.classservice.UpdateClass(classDto).subscribe({

      next: () => {
        this.httpformmessage.handleUpdate();
        // Pass the saved data to the parent and close the dialog
        this.dialogRef.close({ action: 'update',data: classDto?.id });
      },
      error: (error) => {
        
        this.httpformmessage.handleError(error);
      },
    });
  }
  
  

  closeDialog(): void {
    this.dialogRef.close({ action: 'close', data: null }); // Close the dialog without saving
  }
  BindClassData(): void {
    console.log(this.data);
    if ((this.data.action === 'edit' || this.data.action === 'view') && this.data.data) {
     
      this.classForm.patchValue(this.data.data);
    }
    else {
      this.httpformmessage.handleDataNotFound();
       
    }
  }
}
 