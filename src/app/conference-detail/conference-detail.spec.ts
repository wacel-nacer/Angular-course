import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConferenceDetail } from './conference-detail';
import { Conference } from '../models/conference';

const conf: Conference = {
  id: 1,
  titre: 'Test Angular',
  theme: 'Frontend',
  intervenant: 'Jane Doe',
  date: '2026-11-12T09:30:00',
  lieu: 'Amphi A',
  description: 'Une description',
  placesDisponibles: 2,
};

describe('ConferenceDetail', () => {
  let component: ConferenceDetail;
  let fixture: ComponentFixture<ConferenceDetail>;
  let el: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConferenceDetail],
    }).compileComponents();

    fixture = TestBed.createComponent(ConferenceDetail);
    component = fixture.componentInstance;
    el = fixture.nativeElement;
    await fixture.whenStable();
  });

  it('shows a placeholder when no conference is given', () => {
    expect(el.querySelector('.vide')).not.toBeNull();
    expect(el.querySelector('h2')).toBeNull();
  });

  it('displays the conference received through @Input', async () => {
    fixture.componentRef.setInput('conference', conf);
    await fixture.whenStable();
    expect(el.querySelector('h2')?.textContent).toContain('Test Angular');
    expect(el.textContent).toContain('Jane Doe');
  });

  it('emits (inscription) with the conference when clicking "S\'inscrire"', async () => {
    fixture.componentRef.setInput('conference', conf);
    await fixture.whenStable();
    let emitted: Conference | undefined;
    component.inscription.subscribe((c) => (emitted = c));

    el.querySelector<HTMLButtonElement>('.inscrire')!.click();
    expect(emitted).toEqual(conf);
  });

  it('disables registration when the conference is full', async () => {
    fixture.componentRef.setInput('conference', { ...conf, placesDisponibles: 0 });
    await fixture.whenStable();
    expect(el.querySelector<HTMLButtonElement>('.inscrire')!.disabled).toBe(true);
  });

  it('emits (fermer) when clicking the close button', async () => {
    fixture.componentRef.setInput('conference', conf);
    await fixture.whenStable();
    let closed = false;
    component.fermer.subscribe(() => (closed = true));

    el.querySelector<HTMLButtonElement>('.close')!.click();
    expect(closed).toBe(true);
  });
});
