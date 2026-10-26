import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Conferance } from '../models/conferance';
import { ConferanceService } from '../services/conferance';

@Component({
  selector: 'app-conferance-list',
  imports: [FormsModule, RouterLink],
  templateUrl: './conferance-list.html',
  styleUrl: './conferance-list.css',
})
export class ConferanceList implements OnInit {
  private readonly service = inject(ConferanceService);
  readonly conferences = signal<Conferance[]>([]);
  readonly search = signal('');
  readonly loading = signal(false);
  readonly error = signal('');
  readonly filteredConferences = computed(() => {
    const query = this.search().trim().toLowerCase();
    return this.conferences().filter((conference) =>
      !query || [conference.title, conference.location, conference.description]
        .some((value) => value.toLowerCase().includes(query)),
    );
  });

  ngOnInit(): void {
    this.loadConferences();
  }

  loadConferences(): void {
    this.loading.set(true);
    this.service.getAll().subscribe({
      next: (conferences) => this.conferences.set(conferences),
      error: (error: HttpErrorResponse) => {
        this.error.set(error.status === 0 ? 'API indisponible sur le port 3000.' : `Erreur API (${error.status}).`);
        this.loading.set(false);
      },
      complete: () => this.loading.set(false),
    });
  }

  deleteConference(conference: Conferance): void {
    if (!conference.id || !confirm(`Supprimer « ${conference.title} » ?`)) return;
    this.service.deleteConferance(conference.id).subscribe({
      next: () => this.conferences.update((items) => items.filter((item) => item.id !== conference.id)),
      error: (error: HttpErrorResponse) => this.error.set(`Suppression impossible (${error.status}).`),
    });
  }
}
