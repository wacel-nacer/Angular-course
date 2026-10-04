import { Component, computed, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Conference } from '../models/conference';
import { ConferenceDetail } from '../conference-detail/conference-detail';

/**
 * Composant parent (« smart » / conteneur).
 * - Possède les données des conférences et l'état de la sélection.
 * - Transmet la conférence sélectionnée à l'enfant ConferenceDetail via [conference] (@Input).
 * - Écoute les événements (inscription) et (fermer) émis par l'enfant (@Output).
 */
@Component({
  imports: [DatePipe, ConferenceDetail],
  selector: 'app-conference-list',
  styleUrl: './conference-list.css',
  templateUrl: './conference-list.html',
})
export class ConferenceList {
  readonly conferences = signal<Conference[]>([
    {
      id: 1,
      titre: 'Angular 22 : les nouveautés',
      theme: 'Frontend',
      intervenant: 'Sarra Ben Ali',
      date: '2026-11-12T09:30:00',
      lieu: 'Amphi A — Esprit Ghazela',
      description:
        'Tour d’horizon des signaux, du mode zoneless et des nouvelles API de composants.',
      placesDisponibles: 40,
    },
    {
      id: 2,
      titre: 'Communication entre composants',
      theme: 'Frontend',
      intervenant: 'Mohamed Trabelsi',
      date: '2026-11-14T14:00:00',
      lieu: 'Salle B12',
      description:
        '@Input, @Output, services partagés : quel mécanisme choisir pour faire dialoguer vos composants ?',
      placesDisponibles: 3,
    },
    {
      id: 3,
      titre: 'API REST avec Spring Boot',
      theme: 'Backend',
      intervenant: 'Amira Jlassi',
      date: '2026-11-20T10:00:00',
      lieu: 'Amphi C',
      description: 'Concevoir, sécuriser et documenter une API REST consommée par Angular.',
      placesDisponibles: 25,
    },
    {
      id: 4,
      titre: 'DevOps : CI/CD avec GitHub Actions',
      theme: 'DevOps',
      intervenant: 'Youssef Hammami',
      date: '2026-12-02T09:00:00',
      lieu: 'Salle Innovation',
      description: 'Automatiser les tests, le build et le déploiement d’une application web.',
      placesDisponibles: 0,
    },
  ]);

  readonly selectedId = signal<number | null>(null);

  /** Conférence actuellement sélectionnée, recalculée automatiquement. */
  readonly selected = computed(
    () => this.conferences().find((c) => c.id === this.selectedId()) ?? null,
  );

  selectionner(conference: Conference): void {
    this.selectedId.set(conference.id);
  }

  /** Réaction à l'événement (inscription) émis par l'enfant. */
  onInscription(conference: Conference): void {
    this.conferences.update((list) =>
      list.map((c) =>
        c.id === conference.id && c.placesDisponibles > 0
          ? { ...c, placesDisponibles: c.placesDisponibles - 1 }
          : c,
      ),
    );
  }

  /** Réaction à l'événement (fermer) émis par l'enfant. */
  onFermer(): void {
    this.selectedId.set(null);
  }
}
