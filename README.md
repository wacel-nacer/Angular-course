# Prosit 4 — Communication entre deux composants imbriqués

Application Angular (v22) de gestion des conférences. Quand on clique sur une conférence dans la liste, le composant de détail se met à jour automatiquement.

## Lancer le projet

```bash
npm install
npm start          # http://localhost:4200
npm test           # tests unitaires (Vitest)
npm run build      # build de production
```

## Architecture

```
App (app-root)
└── ConferenceList   (parent « smart » : possède les données + la sélection)
    └── ConferenceDetail  (enfant « dumb » : affiche, n'a aucune donnée)
```

| Fichier | Rôle |
|---|---|
| `src/app/models/conference.ts` | Interface `Conference` (type partagé) |
| `src/app/conference-list/` | Liste des conférences, état de la sélection, gestion des inscriptions |
| `src/app/conference-detail/` | Affichage du détail, boutons « S'inscrire » et « Fermer » |

### Flux de données

```
            [conference]="selected()"          @Input()
ConferenceList ─────────────────────────────▶ ConferenceDetail
               ◀───────────────────────────── 
            (inscription)="onInscription($event)"  @Output() + EventEmitter
            (fermer)="onFermer()"
```

1. **Parent → Enfant (`@Input`)** : `ConferenceList` passe la conférence sélectionnée à `ConferenceDetail` via le property binding `[conference]`. Dès que la sélection change, Angular met à jour l'input et le détail se ré-affiche : c'est la correction du bug décrit dans le prosit (le détail restait vide parce qu'il ne recevait jamais la conférence).
2. **Enfant → Parent (`@Output`)** : `ConferenceDetail` ne modifie pas les données lui-même. Il émet un événement (`inscription`, `fermer`) et c'est le parent, propriétaire des données, qui décide quoi faire (décrémenter les places, vider la sélection).
3. **`ngOnChanges`** : l'enfant réagit au changement de son `@Input` (il efface le message de confirmation quand on change de conférence).

Les données ne circulent que dans un sens (du parent vers l'enfant) et les actions remontent par des événements. Chaque composant a ainsi une seule responsabilité, et `ConferenceDetail` est réutilisable ailleurs puisqu'il ne dépend que de ses entrées et sorties.

## Réponse à la question centrale : les mécanismes de communication

| Mécanisme | Sens | Quand l'utiliser |
|---|---|---|
| `@Input()` / `input()` (signal) | Parent → Enfant | Composants **imbriqués** : le parent fournit des données à afficher. *Utilisé ici.* |
| `@Output()` + `EventEmitter` / `output()` | Enfant → Parent | L'enfant signale une action (clic, sélection, validation) sans connaître le parent. *Utilisé ici.* |
| `model()` (two-way binding `[(x)]`) | Bidirectionnel | Un composant de type « champ de formulaire » qui lit et modifie une même valeur. |
| Variable de référence `#ref` / `viewChild()` | Parent → méthodes de l'enfant | Le parent doit appeler une méthode de l'enfant (ex. `reset()`, `open()`). Crée un couplage fort, à utiliser avec modération. |
| **Service partagé** (`@Injectable`, signal ou `BehaviorSubject`) | N'importe quels composants | Composants **frères** ou éloignés dans l'arbre, état partagé par plusieurs écrans. C'est la solution la plus extensible quand l'application grandit. |
| Routeur (paramètres d'URL, `/conferences/:id`) | Entre pages | Le détail devient une page séparée et la sélection doit survivre au rafraîchissement ou être partageable par lien. |

**Pourquoi `@Input` / `@Output` ici ?** Les deux composants sont affichés en même temps et `ConferenceDetail` est imbriqué dans `ConferenceList`, qui possède déjà les données. Il n'y a qu'un niveau de parenté, donc un service serait superflu.

**Pour faire évoluer l'application** : si d'autres composants non imbriqués ont besoin de la conférence sélectionnée (un panier d'inscriptions dans l'en-tête, par exemple), on déplacera les données et la sélection dans un `ConferenceService` injecté. `ConferenceDetail` n'aura pas à changer, puisqu'il ne dépend que de ses `@Input` et `@Output`.

> Remarque : depuis Angular 17+, `input()` et `output()` (API signaux) sont les équivalents modernes de `@Input()` et `@Output()`. Ce projet garde les décorateurs, plus répandus dans les cours, mais le parent utilise déjà `signal()` et `computed()` pour son état.
