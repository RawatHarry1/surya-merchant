import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, Inject, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { IntegrationService } from '@shared/services/integration.service';

export interface Integration {
  dsmName: string;
  supportEmail: string;
  url: string;
  authToken: string;
  protocol: string;
  id: string;
}

@Component({
  selector: 'app-intigration-dialog',
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
  templateUrl: './intigration-dialog.component.html',
  styleUrl: './intigration-dialog.component.scss'
})
export class IntigrationDialogComponent {

  integrationForm!: FormGroup;

  public readonly httpClient = inject(HttpClient);
  public readonly dialogRef = inject(MatDialogRef<Integration>);
  @Input() integrationData: any;
  isAddOpen: boolean;
  isEditOpen: boolean;
  id: string;

  constructor(public fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private integrationService: IntegrationService,
  ) {
    this.integrationForm = this.fb.group({
      dsmName: [''],
      supportEmail: [''],
      url: [''],
      authToken: [''],
      protocol: [''],
    });
    this.isAddOpen = data.isAddOpen;
    this.isEditOpen = data.isEditOpen;
    this.id = data.id;
  }

  ngOnInit(): void {
    if (this.isEditOpen) {
      
      this.integrationForm.patchValue({
        dsmName: this.integrationData.dsmName,
        url: this.integrationData.url,
        authToken: this.integrationData.authToken
      })
      console.log(
        this.integrationForm.patchValue({
          dsmName: this.integrationData.dsmName,
          url: this.integrationData.url,
          authToken: this.integrationData.authToken
        })
      );
      
    }
  }

  onAdd(): void {
    const payload = {
      dsmName: this.integrationForm.get('dsmName')?.value,
      supportEmail: this.integrationForm.get('supportEmail')?.value,
      url: this.integrationForm.get('url')?.value,
      authToken: this.integrationForm.get('authToken')?.value,
      protocol: this.integrationForm.get('protocol')?.value,
    };
    console.log(payload);

    if (this.integrationForm.valid) {
      if (this.isAddOpen) {
        this.integrationService.addIntegration(payload).subscribe((data) => {
          alert("Integration Added Successfully!")
          this.closeDialog();
        })
      }
      if (this.isEditOpen) {
        console.log(this.isEditOpen,this.id);
        this.integrationService.editIntegration(payload, this.id)
          .subscribe({
            next: (data) => {
              alert("Integration Edited Successfully!")
              this.closeDialog();
              console.log(data);

            },
            error: (err) => {
              console.log("Error In Integration Edit", err);
            }
          })
      }
    }
  }


  closeDialog() {
    this.dialogRef.close();
  }
}
