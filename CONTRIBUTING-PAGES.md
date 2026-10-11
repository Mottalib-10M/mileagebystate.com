# Écrire ou étoffer une page de « Mileage by State » (mileagebystate.com)

Notice pour les agents qui écrivent ou prolongent le site. À lire en entier avant d'écrire, avec
`~/Documents/GitHub/RECETTE-SITE.md` (§0, §6, §6.5, §7, §9, §9.3, §11, §17.4, §21, §26).

Le site : frais de déplacement professionnels aux États-Unis. Per diem GSA (hébergement + M&IE) FY2026 et
FY2027, règles FTR (75 % le premier et le dernier jour, repas fournis déduits), indemnité kilométrique IRS 2026
(72,5 ¢ jusqu'au 30 juin, 76 ¢ depuis le 1er juillet), carburant (EIA), recharge VE (EPA + EIA), coût d'une
voiture, règles fiscales (accountable plan, high-low, transport routier). **Anglais américain seul**, sous
`/en/`. Dollars, `$` devant, virgule des milliers. Éditeur : la société **Radif Partners** (jamais un nom de
personne, ni photo, ni INSEAD, ni Mines, ni LinkedIn). Aucun lien vers un autre site du portefeuille
(`_trame/domaines-ovh.txt`), jamais « taxineo ».

**L'angle du site** (règle 1, rapport `reports/us-travel-expenses-serp-2026-10-11.md`) : le remboursement
complet d'un déplacement sur un seul écran, avec les barèmes du jour (GSA FY2027 depuis le 1er octobre 2026,
IRS 76 ¢ depuis le 1er juillet 2026), là où gsa.gov ne donne qu'un taux par ville.

## D'où viennent les chiffres (règle 5 : rien d'inventé)

| Donnée | Source | Fichier |
|---|---|---|
| Hébergement mensuel et M&IE de chaque zone GSA, FY2026 et FY2027 ; tarif standard | Fichiers ZIP et fichiers de taux GSA | `src/data/perdiem.json` |
| Codes ZIP → zone GSA | Fichiers ZIP GSA FY2026 et FY2027 | `src/data/zips.json` |
| Villes de 15 000 habitants et plus → comté → zone | Census (Vintage 2024, fichier place-comté 2020) | `src/data/places.json` |
| Essence et diesel par État ou région (semaine du 5 octobre 2026), électricité résidentielle (cumul janv.-juil. 2026) | EIA | `src/data/energy.json` |
| MPG et kWh/100 mi des modèles 2026-2027 | EPA fueleconomy.gov | `src/data/vehicles.json` |
| Tableau OCONUS de ventilation des repas ($1 à $265) | GSA | `src/data/oconus-mie.json` |
| Règles, taux IRS, high-low, transport, sources | IRS, FTR, GSA | `src/data/params-2026.json` |

`scripts/build-data.py` reconstruit les cinq premiers fichiers depuis `.cache-raw/` (téléchargements listés en
tête du script, hors dépôt).

## Les fichiers d'une page

| Page | Fichier | Route |
|---|---|---|
| Outil (calculateur + texte) | `src/content/pages/<id>.ts` (`definePage`) | `/en/<slug>/` |
| Per diem d'un État | `src/content/states/<slug>.ts` (`defineState`) | `/en/per-diem-rates/<slug>/` |
| Accueil | `src/content/home.ts` | `/en/` |

Modèles : `src/content/pages/per-diem-rates.ts` et `src/content/states/california.ts`. Copier la
**structure**, jamais les phrases.

Le composant affiche seul : le calculateur (`tool`), le chapeau replié (`resume`, première phrase visible), le
corps (`body`), la FAQ, les pages liées, les sources. Une page d'État affiche aussi une bande de chiffres
(nombre de zones, maximum, où, tarif standard), le calculateur de per diem préréglé sur la zone `dest` (par
défaut la plus chère) et le tableau de toutes les zones de l'État FY2027 contre FY2026 : **la prose ne répète
pas ce tableau**.

### Champs d'une page outil (`definePage`)

| Champ | Règle |
|---|---|
| `id` = `slug` = nom du fichier | minuscules et tirets, sans année ; l'id est imposé par `src/lib/planned.ts` |
| `group`, `order` | `perdiem`, `mileage`, `driving` ou `rules` ; place dans le menu (pas de 10) |
| `title` | 50 à 60 caractères, contient 2026 (ou 2026-27), **le terme-clé en tête** (« Mileage Reimbursement Calculator 2026: … ») ; jamais How/What/Is/Calculator ni le pays en tête ; pas de tiret cadratin ni demi-cadratin ; unique |
| `description` | 150 à 160 caractères, contient 2026 et un chiffre tiré des données ; unique |
| `h1`, `intro`, `nav`, `card` | H1 sans année ; une phrase ; libellé court ; une phrase pour les cartes |
| `resume` | **UN** paragraphe de 120 mots ou plus (viser 130 à 170) : la réponse à la requête avec les chiffres ; la première phrase porte le message (seule visible avant « Read the full answer »). Ne pas commencer la 2e phrase par un chiffre. |
| `body(h)` | HTML : `h2`, `h3`, `p`, `ul`, `h.table(...)`. **≥ 450 mots de prose hors tableaux** (viser 550 à 750). Au moins un `${h.mini(...)}` placé après le premier ou le deuxième `h2` |
| `faqs` | 4 à 8 vraies questions, réponses de **45 à 85 mots** (le test compte 42 à 88), chiffre + condition + source, uniques sur tout le site |
| `tool` | le calculateur de la page (voir le tableau des pages) |
| `related` | 3 à 6 ids existants ou prévus (`src/lib/planned.ts`) |
| `sources` | ≥ 3 clés de `params-2026.json > sources` |

### Champs d'une page d'État (`defineState`)

| Champ | Règle |
|---|---|
| `title` | 50 à 60 car., commence par « Per Diem Rates <State> 2026-27: » (abréviation de l'État si trop long, ex. « Per Diem Rates NH 2026-27: ») |
| `description` | 150 à 160 car., contient 2026, au moins un chiffre calculé avec le kit |
| `dest` | facultatif : nom GSA exact de la zone préréglée dans le calculateur (sinon la plus chère) |
| `intro` | une phrase propre à l'État |
| `resume` | un paragraphe ≥ 120 mots, chiffres calculés avec le kit |
| `body(h)` | **≥ 300 mots de prose** écrite pour cet État seulement (viser 350 à 500) : ce qui est singulier (zones saisonnières et leurs mois, zone qui a changé entre FY2026 et FY2027, zone définie par des limites de ville, comtés au tarif standard, prix de l'essence de l'EIA pour l'État ou sa région, exemple chiffré avec `K.trip`). Deux ou trois `h2`/`h3` **propres à l'État** (jamais le même titre d'un État à l'autre). Au moins un `${h.mini('areaTrip', { area, lodging, mie })}` sur une zone de l'État (ou sur le tarif standard pour un État sans zone) |
| `faqs` | 3 à 5 questions **contenant le nom de l'État** (ou son abréviation), réponses 45 à 85 mots, uniques |
| `related` | 3 à 6 ids : `per-diem-rates`, `home`, des États voisins (`state:oregon`), un outil |

## La règle des chiffres (non négociable)

Aucun montant, taux, nombre de zones, mois ou date présent dans les données n'est tapé en dur : il se lit avec
le kit (`src/lib/kit.ts`, importé `KIT as K`, et passé au corps sous `h`).

```ts
K.std(2027)                       // { lodging: 113, mie: 68 } ; K.std(2026)
K.fy(2027)                        // { start, end, nsa, standard, leftNsa, zipPublished }
K.nsas('CA')                      // zones FY2027 triées par maximum : { i, name, counties, mie, low, high, highMonths, lowMonths, seasonal, prev: { mie, low, high } }
K.stateSummary('california')      // { s, list, count, prevCount, std, top, cheapest, seasonalCount, mieTiers, dropped, added }
K.stateRef('texas')               // { abbr, name, slug, padd, gas, gasArea, diesel, dieselArea, elecCents }
destIndex('TX', 'Austin')         // index GSA (import { destIndex, T } from '../../lib/data'), T.dest[i].fy['2027'].lodging[0..11]
K.rateOn(i, '2027-06-15')         // { fy, lodging, mie, standard }
K.trip({ destIndex: i, depart: '2026-11-02', ret: '2026-11-05', meals: {breakfast,lunch,dinner}, mealsOnTravelDays: {...}, roomCost })
                                  // { lodging, mie, mieGross, deductions, total, nights, days[] }
K.tier(80)                        // { breakfast: 20, lunch: 22, dinner: 33, incidentals: 5 }
K.irs('2026-07-01', 'business')   // 0.76 ; 'medical' | 'moving' | 'charity' ; K.pov(date, 'automobile' | 'govCarAvailable')
K.centsWord(0.76) → "76 cents" ; K.rate(0.235) → "$0.235" ; K.usd(x, d) ; K.num(x, d) ; K.pct(0.75) → "75%" ; K.day(iso) ; K.listOf([...])
K.gas('texas'), K.elec('texas'), K.ENERGY_META.{gasWeek, usGas, usDiesel, elecPeriod, usElecCents}
K.ev('2026 Tesla Model Y Long Range AWD') → { kwh100, range } ; K.car('Toyota Camry') → { mpg } ; K.VEH.ev / K.VEH.gas
K.P.mie.partialDayShare (0.75), K.P.mie.tiers, K.P.highLow['2027'], K.P.transportation, K.P.mileage.depreciationCents, K.P.mileage.favrMaxCost
K.oconus(140) → ventilation OCONUS ; K.ZIP_COUNT, K.PLACE_COUNT
```

Dans `body(h)` : tout le kit, plus `h.a(id, texte)` (lien interne ; un id inconnu fait échouer le test),
`h.table(entêtes, lignes, légende, alignements)`, `h.src(clé, texte)` (source officielle), `h.ext(url, texte)`,
`h.box(titre, html)`, `h.mini(kind, arg)`.

Mini-simulateurs disponibles (`src/lib/minis/`) : `areaTrip` (arg `{ area, lodging: number[12], mie }`),
`mealDay`, `mileSplit`, `fuelLeg` (arg `{ label, price }`), `evCharge` (arg `{ label, cents, kwh100? }`),
`excess`. Un nouveau mini = un fichier `src/lib/minis/<kind>.ts` qui n'importe que `_kit.ts` (jamais les gros
fichiers de données).

**Rien au-delà des données et des sources lues.** Ne jamais affirmer un mois de pointe, une saison, un
classement (« le plus cher du pays »), une règle d'État ou un fait local sans le calculer avec le kit ou sans
l'avoir lu sur une source officielle citée (`h.ext(url, …)`, et le signaler dans le compte rendu). Exemple
d'erreur réelle corrigée : « San Francisco culmine en automne » alors que `highMonths` donne janvier à mars.
Les règles propres aux employés d'un État (barème de l'État pour ses fonctionnaires) ne s'écrivent pas sans la
page officielle lue.

## Ton et langue

- Anglais américain, voix humaine, phrases de longueur variable, **le chiffre d'abord**.
- Interdits (le test les refuse) : tirets cadratin et demi-cadratin, « it's important to note », « dive into »,
  « delve », « whether you're », « navigate the », « Moreover », « Additionally », « Furthermore »,
  « game changer », « unlock », « in conclusion », « seamless », « robust », « leverage ». Pas de triplets en
  série, pas de conclusion qui résume, pas d'émoji.
- **Unicité** (§6) : `check-unique` compare toutes les pages, chiffres neutralisés, seuil 30 %, sur les 12 000
  premiers caractères. Écrire ce qui n'appartient qu'à la page, avec un vocabulaire propre ; ouvrir le corps
  sur ce que l'État ou le sujet a de plus rare (choisir la phrase selon la donnée : État sans zone, zone
  saisonnière, zone qui disparaît, zone à limites de ville, plusieurs tiers M&IE…). Aucune tournure reprise
  d'une autre page ni d'un autre site du portefeuille (`check-portefeuille`).

## Contrôles

```bash
cd ~/Documents/GitHub/a-publier/Mottalib-10M/mileagebystate.com
ALLOW_PLANNED=1 PAGE_FILES=state:texas,irs-mileage-rate npx vitest run tests/pages.test.ts   # vos pages
npx vitest run                                                                              # tout (sans ALLOW_PLANNED à la fin)
export NODE_PATH=$(npm root -g):$PWD/node_modules
npm run build && S=~/Documents/GitHub/_trame/_template/scripts
python3 $S/check-seo.py . ; python3 $S/check-trame.py . ; python3 $S/check-unique.py dist
python3 $S/check-simulateurs.py . ; python3 $S/check-regles.py . ; python3 $S/check-portefeuille.py .
node $S/check-sources.mjs . ; node scripts/check-legal.mjs ; node $S/check-contraste.mjs dist
node $S/check-saisie.mjs dist --max=60 ; node $S/check-nombres.mjs dist ; node scripts/typo-nbsp.mjs dist --check
node $S/check-url-propre.mjs dist ; python3 $S/check-snippets.py . ; python3 $S/check-cookies.py .
node $S/check-layout.mjs dist > /tmp/layout-ute.log 2>&1   # long
```

Port local réservé : **4407** (`npx astro preview --port 4407`). Arrêter un serveur par son port
(`lsof -ti tcp:4407 | xargs kill`), jamais `pkill -f`.

## Mise à jour annuelle

1. Août-septembre : nouveaux fichiers GSA (FY2028) → `scripts/build-data.py` (ajouter l'année), `params-2026.json > fiscalYears`.
2. Septembre : notice IRS des per diem spéciaux (high-low, transport) → `params > highLow`, `transportation`.
3. Décembre : taux kilométriques IRS de l'année suivante (et toute révision en cours d'année) → `params > mileage.irs`, `history`, `gsaPov`, `depreciationCents`.
4. EIA : relancer le script chaque mois pour l'essence et l'électricité.
5. `npx vitest run`, puis tous les contrôles.

## Ce qu'on ne fait pas

- Pas de dépôt GitHub ni de push sans validation de l'éditeur, pas de DNS.
- Ne pas toucher à `_trame` ni à la RECETTE : les suggestions vont dans le compte rendu.
- Pas de calculateur de péage (aucune donnée officielle exploitable), pas de tarif d'État pour ses propres fonctionnaires sans source lue.
