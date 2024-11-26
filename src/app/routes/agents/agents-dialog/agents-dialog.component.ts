import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-agents-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatToolbarModule,
    MatIconModule
  ],
  templateUrl: './agents-dialog.component.html',
  styleUrl: './agents-dialog.component.scss'
})
export class AgentsDialogComponent implements OnInit {

  agentForm!: FormGroup; // Use non-null assertion
public readonly httpClient = inject(HttpClient);
  public readonly dialogRef = inject(MatDialogRef<AgentsDialogComponent>);

  isEditOpen: Boolean;
  isAddOpen: Boolean;


  agentData: any = {
    name: "",
    agentEmail: "",
    agentPhone: "",
    agentAddress: "",
    agentDisplayAddress: "",
    merchantName: "",
  };


  constructor(public fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.isAddOpen = data.isAddOpen;
    this.isEditOpen = data.isEditOpen;

  }

  ngOnInit(): void {
    this.agentForm = this.fb.group({
      name: [''],
      agentEmail: [''],
      agentPhone: [''],
      agentAddress: [''],
      agentDisplayAddress: [''],
      merchantName: [''],
    });
  }

  onAdd(): void {
    const payload = {
      Name: this.agentForm.get('name')?.value,
      agentEmail: this.agentForm.get('agentEmail')?.value,
      agentPhone: this.agentForm.get('agentPhone')?.value,
      agentAddress: this.agentForm.get('agentAddress')?.value,
      agentDisplayAddress: this.agentForm.get('agentDisplayAddress')?.value,
      merchantName: this.agentForm.get('merchantName')?.value,
    };
    console.log(payload);
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
