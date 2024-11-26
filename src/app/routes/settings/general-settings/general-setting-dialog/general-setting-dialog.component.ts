import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, inject, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSort } from '@angular/material/sort';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-general-setting-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatToolbarModule,
    MatIconModule,
  ],
  templateUrl: './general-setting-dialog.component.html',
  styleUrl: './general-setting-dialog.component.scss'
})
export class GeneralSettingDialogComponent implements AfterViewInit {
  addTagForm!: FormGroup;
  public readonly httpClient = inject(HttpClient);
  public readonly dialogRef = inject(MatDialogRef<GeneralSettingDialogComponent>);
  @ViewChild(MatSort) sort!: MatSort;
  dataSource: any;
  
  /*Use if require end */
  constructor(public fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {

  }
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {
    this.addTagForm = this.fb.group({
      name: [''],

    });
  }

  onAdd(): void {
    const payload = {
      Name: this.addTagForm.get('name')?.value,

    }
    console.log(payload);
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
