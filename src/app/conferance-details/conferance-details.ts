import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, inject, OnInit } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ConferanceService } from '../services/conferance';

@Component({
  selector: 'app-conferance-details',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './conferance-details.html',
  styleUrl: './conferance-details.css',
})
export class ConferanceDetails implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly service = inject(ConferanceService);
  readonly form = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', Validators.required],
    location: ['', Validators.required],
    date: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(0)]],
    nbPlaces: [1, [Validators.required, Validators.min(1)]],
  });
  readonly value = toSignal(this.form.valueChanges, { initialValue: this.form.getRawValue() });
  readonly characterCount = computed(() => (this.value().description ?? '').length);
  readonly editingId = Number(this.route.snapshot.paramMap.get('id'));
  saving = false;
  error = '';

  ngOnInit(): void {
    if (this.editingId) {
      this.service.getById(this.editingId).subscribe({
        next: (conference) => this.form.patchValue(conference),
        error: () => this.error = 'Impossible de charger cette conférence.',
      });
    }
  }

  submit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid || this.saving) return;
    this.saving = true;
    const request = this.editingId
      ? this.service.updateConferance(this.editingId, this.form.getRawValue())
      : this.service.addConferance(this.form.getRawValue());
    request.subscribe({
      next: () => this.router.navigate(['/list']),
      error: (error: HttpErrorResponse) => {
        this.error = `Enregistrement impossible (${error.status}).`;
        this.saving = false;
      },
    });
  }
}
