import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConferenceList } from './conference-list';

describe('ConferenceList', () => {
  let component: ConferenceList;
  let fixture: ComponentFixture<ConferenceList>;
  let el: HTMLElement;

  const items = () => el.querySelectorAll<HTMLButtonElement>('.item');
  const detailTitle = () => el.querySelector('app-conference-detail h2')?.textContent ?? '';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConferenceList],
    }).compileComponents();

    fixture = TestBed.createComponent(ConferenceList);
    component = fixture.componentInstance;
    el = fixture.nativeElement;
    await fixture.whenStable();
  });

  it('renders every conference', () => {
    expect(items().length).toBe(component.conferences().length);
  });

  it('starts with an empty detail panel', () => {
    expect(el.querySelector('app-conference-detail .vide')).not.toBeNull();
  });

  it('updates the nested detail component when a conference is clicked', async () => {
    items()[1].click();
    await fixture.whenStable();
    expect(detailTitle()).toContain(component.conferences()[1].titre);

    items()[2].click();
    await fixture.whenStable();
    expect(detailTitle()).toContain(component.conferences()[2].titre);
  });

  it('decrements available places when the child emits (inscription)', async () => {
    items()[0].click();
    await fixture.whenStable();
    const before = component.conferences()[0].placesDisponibles;

    el.querySelector<HTMLButtonElement>('app-conference-detail .inscrire')!.click();
    await fixture.whenStable();

    expect(component.conferences()[0].placesDisponibles).toBe(before - 1);
    expect(el.querySelector('app-conference-detail .places')?.textContent).toContain(
      String(before - 1),
    );
  });

  it('clears the selection when the child emits (fermer)', async () => {
    items()[0].click();
    await fixture.whenStable();

    el.querySelector<HTMLButtonElement>('app-conference-detail .close')!.click();
    await fixture.whenStable();

    expect(component.selectedId()).toBeNull();
    expect(el.querySelector('app-conference-detail .vide')).not.toBeNull();
  });
});
