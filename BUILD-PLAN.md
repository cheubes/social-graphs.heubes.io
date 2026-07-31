# Plan de construction incrémental

Onze étapes, chacune démontrable dans un navigateur avant de passer à la suivante. Voir `CLAUDE.md` pour la structure de `specs/` et les règles d'usage des spécifications.

Chaque étape a un prompt prêt à l'emploi pour la démarrer.

## 1. Squelette Jekyll + chrome commun ✅

`_config.yml`, `Gemfile`, layout `default.html` avec en-tête collant et pied de page fixe (couleurs, police, badge CC, sélecteur de langue en emoji) sur une page vide quelconque. Voir `technical-specifications.md` (Structure des fichiers, Configuration) et `style-guide.md` (En-tête, Pied de page).

**Critère :** `bundle exec jekyll serve` tourne, le header/footer respectent la charte graphique, sans rien de dynamique encore.

**Prompt :**
```
Implémente l'étape 1 du plan de construction (BUILD-PLAN.md) : squelette Jekyll et chrome commun.

Crée _config.yml et Gemfile (voir "Structure des fichiers" et "Configuration" dans
technical-specifications.md), puis le layout _layouts/default.html avec un en-tête collant
et un pied de page fixe conformes à style-guide.md (couleurs, police Ubuntu, badge Creative
Commons, sélecteur de langue en emoji drapeaux — pas encore fonctionnel, juste visuel).
Inclue Bootstrap et Font Awesome via CDN (versions et hash SRI dans technical-specifications.md).

Crée une page de test minimale pour vérifier l'affichage. Ne construis aucune fonctionnalité
au-delà de cette étape (pas de contenu d'univers, pas de JS).

Critère de fin : bundle exec jekyll serve tourne, l'en-tête et le pied de page s'affichent
correctement aux couleurs de la charte sur cette page de test.
```

## 2. Premier univers de contenu + script de validation

Créer l'univers "french-renaissance-aristocracy" (déjà l'exemple illustratif de `data-model.md`) avec deux ou trois personnages et quelques relations, en suivant le format documenté à la lettre. Écrire `scripts/validate.rb` en parallèle, en le testant contre ce contenu réel. Voir `data-model.md` (Organisation des fichiers, Exemples) et `technical-specifications.md` (Validation des données).

**Critère :** le script passe sur ce contenu, et détecte une erreur si on en introduit une volontairement (ex : un `type` de relation qui n'existe pas).

**Prompt :**
```
Implémente l'étape 2 du plan de construction (BUILD-PLAN.md) : premier univers de contenu
et script de validation.

Crée l'univers "french-renaissance-aristocracy" avec deux ou trois personnages et quelques
relations, en suivant exactement le format de data-model.md (sections "Organisation des
fichiers" et "Exemples" — reprends l'exemple illustratif déjà présent : Catherine de Médicis,
Henri III). Les deux langues (fr/en) dès le départ.

Écris ensuite scripts/validate.rb, en suivant la liste de règles de la section "Validation
des données" dans technical-specifications.md, et teste-le contre ce contenu réel.

Critère de fin : le script passe sans erreur sur ce contenu ; introduis une erreur volontaire
(ex : un type de relation inexistant) et vérifie que le script la détecte, puis retire-la.
```

## 3. Accueil du site

Mosaïque d'univers, juste le nôtre pour l'instant : tri alphabétique, lazy loading, états vide/erreur. Voir `screens/home.md`.

**Critère :** la tuile de l'univers de test s'affiche et mène à sa page.

**Prompt :**
```
Implémente l'étape 3 du plan de construction (BUILD-PLAN.md) : accueil du site.

Construis index.fr.md / index.en.md et le layout home.html, en suivant screens/home.md :
mosaïque d'univers (juste "french-renaissance-aristocracy" pour l'instant), tri alphabétique
par title, lazy loading de l'image de couverture, états vide et erreur.

Critère de fin : la tuile de l'univers de test s'affiche à l'accueil (dans les deux langues)
et mène à sa page.
```

## 4. Vue Mosaïque d'un univers

Présentation de l'univers et mosaïque de personnages triée par nombre de relations. Le switcher est visible mais peut pointer vers une Vue Graphe qui n'existe pas encore. Voir `screens/universe-home.md`.

**Critère :** les tuiles personnages s'affichent, dans le bon ordre.

**Prompt :**
```
Implémente l'étape 4 du plan de construction (BUILD-PLAN.md) : Vue Mosaïque d'un univers.

Construis mosaic.fr.md / mosaic.en.md et le layout universe.html, en suivant
screens/universe-home.md : présentation de l'univers, mosaïque de personnages triée par
nombre de relations décroissant (calculé depuis _data/<slug>/relations.yml), switcher
visible (peut pointer vers une Vue Graphe qui n'existe pas encore à ce stade).

Critère de fin : les tuiles de personnages de l'univers de test s'affichent, dans le bon ordre.
```

## 5. Fiche personnage en modale

Modale Bootstrap, `fetch()` de la page personnage déjà générée, synchronisation d'URL, navigation entre personnages liés. Voir `screens/character-sheet.md`.

**Critère :** un clic ouvre la modale sans rechargement, l'URL se met à jour, un lien direct vers cette URL ouvre la modale par-dessus la Vue Mosaïque.

**Prompt :**
```
Implémente l'étape 5 du plan de construction (BUILD-PLAN.md) : fiche personnage en modale.

Construis les fichiers characters/<slug>.fr.md / .en.md pour chaque personnage (si pas déjà
fait à l'étape 2), le layout character.html, l'include character-modal.html et
assets/js/character-modal.js, en suivant screens/character-sheet.md : modale Bootstrap,
fetch() de la page personnage déjà générée, synchronisation d'URL via pushState, navigation
vers un personnage lié sans fermer la modale.

Critère de fin : un clic sur une tuile de personnage (étape 4) ouvre la modale sans
rechargement, l'URL se met à jour, et visiter cette URL directement ouvre la modale
par-dessus la Vue Mosaïque.
```

## 6. Vue Graphe

Rendu D3 (nœuds, arêtes colorées, flèches pour les types dirigés, zoom/déplacement), clic sur un nœud réutilisant la modale de l'étape 5. Voir `screens/graph-view.md`.

**Critère :** le switcher fonctionne dans les deux sens ; le graphe de l'univers de test se lit correctement.

**Prompt :**
```
Implémente l'étape 6 du plan de construction (BUILD-PLAN.md) : Vue Graphe.

Construis graph.fr.md / graph.en.md, le layout universe-graph.html et assets/js/graph.js,
en suivant screens/graph-view.md : rendu D3 des nœuds (portrait + nom) et arêtes (couleur
par type depuis la palette catégorielle de style-guide.md, flèche pour les types dirigés),
zoom et déplacement, clic sur un nœud qui réutilise la modale de l'étape 5.

Critère de fin : le switcher Vue Mosaïque / Vue Graphe fonctionne dans les deux sens, et le
graphe de l'univers de test se lit correctement (nœuds, arêtes, couleurs, sens des flèches).
```

## 7. Recherche et filtre

Barre de recherche et filtres par type sur les deux vues, légende du graphe qui en découle. Voir `screens/search-filter.md`.

**Critère :** taper un nom isole les bons éléments ; désactiver un type de relation masque les bonnes arêtes.

**Prompt :**
```
Implémente l'étape 7 du plan de construction (BUILD-PLAN.md) : recherche et filtre.

Construis l'include search-filter.html et assets/js/search-filter.js, en suivant
screens/search-filter.md : barre de recherche par nom, filtres par type de relation (avec
pastille de couleur, voir style-guide.md), sur les deux vues (Mosaïque et Graphe), avec la
légende du graphe qui en découle.

Critère de fin : taper un nom masque/isole les bons éléments dans les deux vues ; désactiver
un type de relation masque les bonnes arêtes en Vue Graphe et les bonnes tuiles en Vue Mosaïque.
```

## 8. Multilingue complet

Détection de langue au premier accès, mémorisation `localStorage`, préfixe `/fr/`, message d'indisponibilité (`404.md`), traduction du contenu de test. Voir "Multilingue" dans `functional-specifications.md` et "Architecture" dans `technical-specifications.md`.

**Critère :** changer de langue conserve le contexte quand la traduction existe, affiche le message sinon.

**Prompt :**
```
Implémente l'étape 8 du plan de construction (BUILD-PLAN.md) : multilingue complet.

Construis assets/js/main.js (détection de la langue du navigateur au premier accès, repli
sur l'anglais, mémorisation via localStorage) et 404.md (message d'indisponibilité localisé
selon le préfixe /fr/), en suivant "Multilingue" dans functional-specifications.md et
"Architecture" dans technical-specifications.md. Termine la traduction française du contenu
de test créé à l'étape 2 si besoin.

Critère de fin : changer de langue via le sélecteur conserve le contexte de navigation quand
la traduction existe, affiche le message d'indisponibilité sinon.
```

## 9. CI de validation

Workflow GitHub Actions exécutant `scripts/validate.rb` sur chaque push/PR, sans toucher au déploiement GitHub Pages natif. Voir "Validation des données" dans `technical-specifications.md`.

**Critère :** CI rouge sur une erreur volontaire, verte sinon.

**Prompt :**
```
Implémente l'étape 9 du plan de construction (BUILD-PLAN.md) : CI de validation.

Crée .github/workflows/validate.yml, qui exécute scripts/validate.rb sur chaque push et
pull request, en suivant "Validation des données" dans technical-specifications.md. Ne
touche pas au déploiement GitHub Pages natif.

Critère de fin : la CI échoue sur une erreur de contenu volontairement introduite, et passe
une fois corrigée.
```

## 10. SEO et polish

`jekyll-seo-tag`, `jekyll-sitemap`, hreflang, puis vérification manuelle (clavier, lecteur d'écran, contraste réel à l'écran, pas juste les valeurs calculées dans `style-guide.md`). Voir "SEO" et "Accessibilité" dans `technical-specifications.md`.

**Prompt :**
```
Implémente l'étape 10 du plan de construction (BUILD-PLAN.md) : SEO et polish.

Active jekyll-seo-tag et jekyll-sitemap, ajoute les liens hreflang entre versions FR/EN
d'une même page, en suivant "SEO" dans technical-specifications.md. Fais ensuite une
vérification manuelle dans le navigateur : navigation au clavier (en particulier la
modale), lecteur d'écran si possible, contraste réel à l'écran (les valeurs de
style-guide.md ont été calculées, pas testées visuellement).

Critère de fin : sitemap.xml généré, balises meta présentes, la modale se ferme et se
rouvre correctement au clavier.
```

## 11. Deuxième univers

Un univers réellement différent du premier, sans modification de code : la meilleure preuve que rien n'est codé en dur pour un seul cas.

**Prompt :**
```
Implémente l'étape 11 du plan de construction (BUILD-PLAN.md) : deuxième univers.

Ajoute un univers réellement différent du premier (pas une simple copie), en suivant le
workflow de data-model.md ("Workflow d'ajout d'un univers"), sans modifier le code des
étapes précédentes.

Critère de fin : le nouvel univers fonctionne de bout en bout (accueil, Vue Mosaïque, Vue
Graphe, fiche personnage, recherche/filtre) uniquement par ajout de contenu, sans changement
de code. Si ce n'est pas le cas, c'est qu'une étape précédente a codé en dur des hypothèses
propres au premier univers : à corriger avant de continuer.
```

---

Chaque étape est un point de commit naturel. Avant de committer, vérifier que l'ensemble de `specs/` reste cohérent avec ce qui vient d'être implémenté (voir "Avant chaque commit" dans `CLAUDE.md`) ; si l'implémentation révèle qu'une spec doit changer, le signaler avant d'appliquer la mise à jour.
