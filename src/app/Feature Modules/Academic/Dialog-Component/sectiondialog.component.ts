import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { FormInputComponent } from '../../../Shared/Components/Input/form-input.component';
import { ButtonComponent } from '../../../Shared/Components/Button/button.component';
import { SectionDto } from '../models/section.model';
import { SectionService } from '../services/section.service';
import { HttpFormMessageService } from '../../../Shared/utils/HttpFormMessage.service';

@Component({
  selector: 'app-sectiondialog',
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
  templateUrl: './sectiondialog.component.html',
  styleUrl: './sectiondialog.component.scss'
})
export class SectiondialogComponent implements OnInit {
  action!: 'save' | 'edit' | 'view';
  sectionData!: SectionDto | null;
    
    constructor(
    @Inject(MAT_DIALOG_DATA) public data: { action: 'edit' | 'save' | 'view' ; data?: SectionDto },
    private dialogRef: MatDialogRef<SectiondialogComponent>,
    private fb:FormBuilder,
    private sectionservice:SectionService,
    private httpformmessage:HttpFormMessageService
  )
    {
      this.action = data.action;
      this.sectionData = data.data || null;
       
    }
  
    sectionForm!: FormGroup;
  
    getControl(name: string): FormControl {
      return this.sectionForm.get(name) as FormControl;
    }
    ngOnInit(): void {
  
      this.sectionForm = new FormGroup({
        sectionName: new FormControl(''),
        sectionShortName: new FormControl(''),
      });
      this.sectionForm = this.fb.group({
        id:'00000000-0000-0000-0000-000000000000',
        isDeleted:false,
        //id: [null], // Hidden ID field
        sectionName: ['', [Validators.required, Validators.minLength(3),
                        Validators.maxLength(20)]],
        sectionShortName: ['', [Validators.required, Validators.minLength(3),
                                Validators.maxLength(10)]],
      });
      if (this.action === 'edit' || this.action === 'view') {
        this.BindSectionData();
      }
      
    }
    SubmitSection(): void {
      console.log(this.sectionForm.value);
      if (this.action === 'save') {
        this.saveSection();
      } 
      else if (this.action === 'edit') {
        this.UpdateSection();
      }
       
      
    }

    
  
    saveSection(): void {
      
      if (this.sectionForm.invalid) {
        //this.handleInvalidForm();
        this.httpformmessage.handleInvalidForm(this.sectionForm);
      }
    
      const sectiondto: SectionDto = this.sectionForm.value;
      this.sectionservice.SaveSection(sectiondto).subscribe({
  
        next: (response) => {
           
          this.httpformmessage.handleSave();
          // Pass the saved data to the parent and close the dialog
          this.dialogRef.close({ action: 'save', data: response?.id });
        },
        error: (error) => {
          this.httpformmessage.handleError(error);
        },
      });
    }
  
    UpdateSection(): void {
      
      if (this.sectionForm.invalid) {
        //this.handleInvalidForm();
        this.httpformmessage.handleInvalidForm(this.sectionForm);
      }
    
      const sectiondto: SectionDto = this.sectionForm.value;
      this.sectionservice.UpdateSection(sectiondto).subscribe({
        next: () => {
          this.httpformmessage.handleUpdate();
          // Pass the saved data to the parent and close the dialog
          this.dialogRef.close({ action: 'update',data: sectiondto?.id });
        },
        error: (error) => {
          
          this.httpformmessage.handleError(error);
        },
      });
    }
    
    
  
    closeDialog(): void {
      this.dialogRef.close({ action: 'close', data: null }); // Close the dialog without saving
    }
    BindSectionData(): void {
       
      if ((this.data.action === 'edit' || this.data.action === 'view') && this.data.data) {
       
        this.sectionForm.patchValue(this.data.data);
      }
      else {
        this.httpformmessage.handleDataNotFound();
         
      }
    }
    ResetForm(): void {
      this.sectionForm.reset();
    }
  }
   
