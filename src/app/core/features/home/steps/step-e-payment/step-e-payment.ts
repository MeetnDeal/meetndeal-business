import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-step-e-payment',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatButtonModule,
    MatSelectModule,
    MatCheckboxModule
  ],
  templateUrl: './step-e-payment.html',
  styleUrls: ['./step-e-payment.css']
})
export class StepEPaymentComponent {
  @Input() form!: FormGroup;
  @Output() previous = new EventEmitter<void>();
  @Output() submit = new EventEmitter<void>();
}
