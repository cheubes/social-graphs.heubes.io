# Charte graphique

## Couleurs

### Palette de marque

| Rôle | Variable | Hex |
|---|---|---|
| Couleur principale, en-tête, accents forts | `--sg-blue` | `#2C374C` |
| Accents secondaires, survols, mise en évidence | `--sg-gold` | `#C7B299` |
| Bordures, éléments décoratifs (pas de texte, contraste insuffisant : voir `technical-specifications.md` § Accessibilité) | `--sg-light-grey` | `#ACB2B8` |
| Corps de texte courant | `--sg-grey` | `#666666` |
| Titres, textes forts | `--sg-dark-grey` | `#444444` |
| Fond général | `--sg-white` | `#FFFFFF` |

```css
:root {
  --sg-blue: #2C374C;
  --sg-gold: #C7B299;
  --sg-light-grey: #ACB2B8;
  --sg-grey: #666666;
  --sg-dark-grey: #444444;
  --sg-white: #FFFFFF;
}
```

Préfixe `--sg-`, en écho au préfixe `.sg-` des classes (voir `technical-specifications.md`), pour ne pas se confondre avec les variables `--bs-*` de Bootstrap.

### Palette du graphe (types de relation)

La palette de marque n'a pas vocation à coder des catégories : `--sg-blue` et `--sg-gold` sont les deux seuls accents, les gris sont pensés pour le texte et les bordures. Le graphe utilise donc une palette catégorielle dédiée, distincte de la charte, choisie pour rester lisible en cas de daltonisme plutôt qu'assemblée à l'œil.

| Ordre | Teinte | Hex |
|---|---|---|
| 1 | Bleu | `#2a78d6` |
| 2 | Orange | `#eb6834` |
| 3 | Turquoise | `#1baf7a` |
| 4 | Jaune | `#eda100` |
| 5 | Magenta | `#e87ba4` |
| 6 | Vert | `#008300` |
| 7 | Violet | `#4a3aa7` |
| 8 | Rouge | `#e34948` |

L'assignation couleur → type de relation se fait par univers (la taxonomie disponible n'étant pas la même partout), dans l'ordre alphabétique du `slug` du type, pour un résultat stable et reproductible d'un rendu à l'autre.

Cette palette est validée pour la lecture en daltonisme quand les couleurs apparaissent dans un ordre fixe et que seules les voisines se touchent (ex : une légende, un empilement). Un graphe en disposition dynamique n'a pas cet ordre : deux arêtes de n'importe quelle couleur peuvent se croiser n'importe où. Dans ce cas plus strict, seules les trois premières teintes (bleu, orange, turquoise) restent garanties distinguables deux à deux. Au-delà de trois types affichés simultanément, la distinction s'appuie aussi sur :

- une légende couleur → type, affichée en permanence sur la Vue Graphe : c'est la liste des filtres de type de relation de `search-filter.md`, chaque filtre portant déjà la couleur de son type (voir `graph-view.md`) ;
- le survol ou le clic d'une arête, qui affiche déjà son type en toutes lettres (voir `graph-view.md`) ;
- le sens visuel (flèche ou non) des types dirigés, indépendant de la couleur ;
- le filtre par type de `search-filter.md`, qui permet d'isoler un type à la fois.

Chiffres établis avec la méthode et la palette de référence du skill dataviz (surface `#fcfcfb`). Vérifié sur notre fond `#FFFFFF` : le turquoise, le jaune et le magenta (teintes 3, 4, 5) tombent sous 3:1 comme simple trait fin sur blanc, contre une surface plus grise où ils passaient. Un trait un peu plus épais que la normale pour ces trois teintes en particulier compense en partie ; la légende et le survol (ci-dessus) restent la garantie principale de lisibilité, indépendamment de l'épaisseur du trait.

### Couleur de groupe

La couleur d'un groupe de personnages (voir "Groupe" dans `data-model.md`) est une donnée de contenu, pas un ingrédient de la charte graphique : comme les images, elle est choisie librement à l'ajout du contenu, propre à chaque groupe, sans palette imposée ni contrainte de contraste garantie. Elle sert uniquement de bordure décorative (tuile, nœud du graphe, modale ; voir "Tuiles" et "Modale" ci-dessous), jamais de fond de texte.

## Typographie

- **Police** : Ubuntu (Google Fonts), graisses 300 / 400 / 500 / 700.
- `font-family: "Ubuntu", sans-serif;` sur `body`.

| Usage | Graisse | Couleur |
|---|---|---|
| Titres (`h1`-`h3`) | 700 | `--sg-dark-grey` |
| Sous-titres, libellés forts | 500 | `--sg-dark-grey` |
| Corps de texte | 400 | `--sg-grey` |
| Texte secondaire, légendes, métadonnées | 300 | `--sg-grey` |

L'échelle de tailles (`h1` à `h6`, corps, petit texte) reprend celle de Bootstrap par défaut, sans surcharge, pour rester cohérente avec le reste des composants.

## Espacements et grille

Pas de grille ni d'échelle d'espacement custom : la grille et les classes utilitaires d'espacement de Bootstrap 5.3 (`container`, `row`/`col-*`, `m-*`/`p-*`) sont utilisées telles quelles (voir `technical-specifications.md`).

## Composants UI de base

### En-tête

- **Accueil et pages génériques** (ex : message d'indisponibilité) :
  - **Gauche** : logo (`assets/img/logo.png`, voir "Images"), puis tagline du site sur l'accueil.
  - **Droite** : sélecteur de langue.
- **Pages univers** (Vue Mosaïque, Vue Graphe, fiche personnage) :
  - **Gauche** : couverture de l'univers courant (coins arrondis, voir "Images"), puis son `title` avec le switcher Vue Mosaïque / Vue Graphe (voir ci-dessous) juste en dessous. Ni `source-type` ni `description` de l'univers ne sont repris dans l'en-tête.
  - **Droite** : logo du site, en lien vers l'accueil, puis sélecteur de langue.
- Sélecteur de langue : deux drapeaux 🇫🇷 / 🇬🇧, chacun avec un `aria-label` explicite ("Français" / "English") puisqu'un emoji seul n'est pas toujours annoncé de façon fiable par un lecteur d'écran.
- Fond `--sg-blue`, texte `--sg-white`, bordure basse `--sg-gold`.
- En-tête collant (`position: sticky`) en haut de page, pour rester accessible sur les pages longues (Vue Mosaïque, Vue Graphe), en écho au pied de page fixe.
- Reste au-dessus de la modale fiche personnage (voir `character-sheet.md`) dans l'empilement visuel, pour que le sélecteur de langue reste utilisable modale ouverte.

### Pied de page

- Fixe (`position: fixed`, bas de l'écran) : une hauteur doit donc être réservée en bas de chaque page pour ne rien recouvrir, y compris la Vue Graphe (voir `graph-view.md`). Hauteur portée par une variable, ex. `--sg-footer-height`.
- **Gauche** : badge Creative Commons. Quatre icônes Font Awesome Brands (`fa-creative-commons`, `fa-creative-commons-by`, `fa-creative-commons-nc-eu`, `fa-creative-commons-sa`) suivies du texte "CC BY-NC-SA 4.0", lien vers `https://creativecommons.org/licenses/by-nc-sa/4.0/deed.fr` ou `.../deed.en` selon la langue courante.
- **Droite** : mention "Réalisée par Christophe Heubès" (FR) / "Created by Christophe Heubès" (EN), le nom en lien vers `https://christophe.heubes.org`.
- Fond `--sg-dark-grey`, texte `--sg-white`, bordure haute `--sg-light-grey`, liens en `--sg-gold` au survol.

### Titre de section (accueil)

- Un titre par section de l'accueil (voir "Type de source" dans `data-model.md` et `home.md`), au-dessus de la mosaïque de tuiles du type de source correspondant.
- `h2`, style repris de l'échelle typographique standard (voir "Typographie" ci-dessus), sans surcharge de couleur ou de graisse propre.

### Tuiles (mosaïques)

- Carte Bootstrap : image (couverture ou portrait) en lazy loading (voir `home.md`, `universe-home.md`), `title`/`character-name` en titre, `description` en corps (tronquée, sauf tuile univers de l'accueil, voir ci-dessous).
- Fond `--sg-white`, titre `--sg-dark-grey`, texte `--sg-grey`, bordure `--sg-light-grey`.
- Survol : légère élévation (ombre) et bordure `--sg-gold`.
- Tuile univers (accueil, voir `home.md`) uniquement : hauteur fixe, identique pour toutes les tuiles (couverture proportionnée à son ratio fixe, voir "Images", suivie d'une zone de texte à hauteur fixe pour le `title` et la `description`). Cette zone de texte n'est pas tronquée : si son contenu dépasse la hauteur disponible, elle devient défilable (`overflow-y: auto`), la couverture au-dessus restant fixe, hors du défilement. Mention de crédit de la couverture (`cover-source`, si renseigné, voir `data-model.md`) : texte secondaire italique en fin de contenu de cette zone, aligné à droite (même traitement que la mention de source du portrait de la fiche personnage, voir "Modale" ci-dessous) ; si c'est une URL, un lien suit la règle des liens de la modale ; si c'est la valeur spéciale `ai-generated`, texte simple sans lien.
- Tuile personnage (voir `universe-home.md`) uniquement : hauteur fixe, identique pour toutes les tuiles (portrait proportionné à son ratio fixe, voir "Images", suivi d'une zone de texte à hauteur fixe pour le `character-name` et la `description`). Contrairement à la tuile univers ci-dessus, cette zone n'est pas défilable : la `description` y est tronquée dès que son contenu dépasse la hauteur disponible, à une limite de mot (jamais au milieu d'un mot), la marque de troncature ("...") étant précédée d'une espace insécable. Bordure de 10px entre le portrait et le corps de la tuile (nom, description), de la couleur du groupe d'appartenance du personnage si renseigné (voir "Groupe" dans `data-model.md`), blanche sinon ; logo de ce groupe, si renseigné, affiché dans le coin en bas à droite de la tuile.

### Modale (fiche personnage)

- Modale Bootstrap standard. Fond `--sg-white`, `character-name` en titre `--sg-dark-grey`, corps `--sg-grey`, libellés de relation `--sg-blue`.
- Liens de la fiche (personnage lié, lien externe, source du portrait) : `--sg-gold` de base, `--sg-grey` au survol, jamais soulignés. Le lien externe inclut son icône (voir "Iconographie").
- Mention de source du portrait (`portrait-source`, si renseigné) : texte secondaire italique en fin de fiche, aligné à droite (graisse 300, `--sg-grey`, voir "Typographie") ; si c'est une URL, un lien suit la règle ci-dessus ; si c'est la valeur spéciale `ai-generated` (voir `data-model.md`), texte simple sans lien.
- Bordure haute de 10px, de la couleur du groupe d'appartenance du personnage si renseigné (voir "Groupe" dans `data-model.md`), blanche sinon ; logo de ce groupe, si renseigné, affiché dans le coin en haut à gauche de la modale.
- Bouton de fermeture : icône Font Awesome (`fa-xmark`).

### Switcher Vue Mosaïque / Vue Graphe

- Groupe de deux boutons (`btn-group` Bootstrap), logé dans l'en-tête sous le `title` de l'univers (voir "En-tête" ci-dessus) : ses couleurs sont donc pensées pour le fond `--sg-blue` de l'en-tête, pas pour un fond blanc. Vue active : fond `--sg-gold`, texte `--sg-blue`. Vue inactive : texte `--sg-white`, fond transparent, bordure blanche atténuée ; au survol, texte et bordure `--sg-gold`.

### Barre de recherche / filtres

- Champ de recherche Bootstrap standard, icône `fa-magnifying-glass`.
- Filtres de groupe : cases à cocher ou "chips" à fond neutre (`--sg-white`) et texte `--sg-grey`/`--sg-dark-grey`, chacun précédé du logo du groupe plutôt que d'une pastille de couleur, celui-ci étant déjà l'identifiant visuel du groupe (voir "Groupe" dans `data-model.md`).
- Filtres de type de relation : même principe, chacun précédé d'une pastille de la couleur de son type dans la palette du graphe (voir ci-dessus). La couleur reste un repère visuel à côté du texte, jamais le fond du texte : aucune couleur de texte unique ne passe le contraste AA sur les huit teintes de cette palette à la fois (vérifié).
- Disposition : filtres de groupe sur leur propre ligne, en dessous du champ de recherche, sur les deux vues. En Vue Graphe, les filtres de type de relation forment un bloc séparé sous le graphe plutôt que d'accompagner le champ de recherche (voir emplacement exact dans `graph-view.md`) ; comme les filtres de groupe, ils se replient sur plusieurs lignes (un ou plusieurs filtres passent à la ligne suivante) si l'espace manque, plutôt que le bloc dans son ensemble.
- Pas de bouton de réinitialisation dédié : vider le champ de recherche et recocher les cases se fait directement sur ces contrôles.

### Boutons

- Primaire : fond `--sg-blue`, texte `--sg-white` ; au survol, fond `--sg-gold` et texte `--sg-blue` (`--sg-white` sur `--sg-gold` ne passe pas le contraste minimal : 2,05:1, vérifié).
- Secondaire : bordure `--sg-grey`, texte `--sg-dark-grey`, fond transparent.

## Images

Format `.jpg` (voir `data-model.md`) pour les images de contenu (couvertures, portraits). Dimensions et ratios recommandés à l'ajout de contenu ; `object-fit: cover` en CSS pour absorber les écarts plutôt que d'imposer un recadrage strict.

| Image | Ratio | Dimensions minimales |
|---|---|---|
| Couverture d'univers | 16:9 | 1200 × 675 px |
| Portrait de personnage | 1:1 (carré) | 600 × 600 px |
| Logo de groupe | 1:1 (carré) | 128 × 128 px |

Le portrait est carré pour rester correct une fois recadré en cercle (nœud du graphe, voir `graph-view.md`), en tuile (voir `universe-home.md`) ou dans la modale (voir `character-sheet.md`), sans traitement différent selon le contexte d'affichage.

Le logo d'un groupe est au format PNG plutôt que `.jpg`, pour conserver la transparence : il est superposé à d'autres éléments (tuile, nœud du graphe, modale) plutôt qu'affiché seul (voir "Images" dans `data-model.md`).

Le logo du site (`assets/img/logo.png`, PNG, 256 × 256 px) est un asset d'interface distinct du contenu des univers : affiché à 48px de haut dans l'en-tête, et réutilisé tel quel comme favicon (pas de génération de variantes ni de format `.ico`).

## Iconographie

- Font Awesome Free 7.3 (voir `technical-specifications.md`), sous-ensemble Brands pour les icônes Creative Commons.
- Sélecteur de langue : emoji drapeaux 🇫🇷 / 🇬🇧, pas d'icône Font Awesome.
- Fermeture de modale : `fa-xmark`.
- Recherche : `fa-magnifying-glass`.
- Lien externe (`external-link` d'un personnage) : `fa-arrow-up-right-from-square`, devant le libellé.
- Creative Commons : `fa-creative-commons`, `fa-creative-commons-by`, `fa-creative-commons-nc-eu`, `fa-creative-commons-sa`.
