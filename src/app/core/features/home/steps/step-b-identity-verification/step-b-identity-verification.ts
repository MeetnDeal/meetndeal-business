// step-b-identity-verification.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-step-b-identity-verification',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './step-b-identity-verification.html',
  styleUrls: ['./step-b-identity-verification.css']
})
export class StepBIdentityVerificationComponent {
  @Input() form!: FormGroup;
  @Input() onFileSelect!: (event: Event, field: string) => void;
  @Input() goToStep!: (step: 'A' | 'B' | 'C' | 'D' | 'E') => void;
}
