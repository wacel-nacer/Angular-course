import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Conference } from '../models/conference';

/**
 * Composant enfant (« dumb » / présentation).
 * - Reçoit la conférence sélectionnée depuis le parent via @Input().
 * - Prévient le parent des actions de l'utilisateur via @Output() + EventEmitter.
 * Il ne possède aucune donnée : il se contente d'afficher et d'émettre des événements.
 */
@Component({
  imports: [DatePipe],
  selector: 'app-conference-detail',
  styleUrl: './conference-detail.css',
  templateUrl: './conference-detail.html',
})
export class ConferenceDetail implements OnChanges {
  /** Parent → Enfant : la conférence à afficher (null si aucune sélection). */
  @Input() conference: Conference | null = null;

  /** Enfant → Parent : l'utilisateur demande à s'inscrire à la conférence. */
  @Output() inscription = new EventEmitter<Conference>();

  /** Enfant → Parent : l'utilisateur ferme le panneau de détail. */
  @Output() fermer = new EventEmitter<void>();

  message = '';

  /** Appelé à chaque fois que le parent change la valeur d'un @Input(). */
  ngOnChanges(changes: SimpleChanges): void {
    const change = changes['conference'];
    if (change && change.previousValue?.id !== change.currentValue?.id) {
      this.message = '';
    }
  }

  sInscrire(): void {
    if (this.conference && this.conference.placesDisponibles > 0) {
      this.inscription.emit(this.conference);
      this.message = `Inscription confirmée pour « ${this.conference.titre} ».`;
    }
  }

  onFermer(): void {
    this.fermer.emit();
  }
}
