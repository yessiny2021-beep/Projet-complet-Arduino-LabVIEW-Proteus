**Export CSV — Fallback client-side**

But: assurer un export CSV fonctionnel lorsque l'extension DataTables Buttons (ou ses CDN) n'est pas disponible.

Comportement
- Lorsqu'un utilisateur clique sur `Exporter CSV` (ou `Exporter Excel`) et que DataTables Buttons n'est pas chargé, le client génère un fichier CSV côté navigateur.
- Le fallback exporte d'abord les lignes sélectionnées (bulk). Si aucune sélection, il exporte les lignes actuellement visibles après filtres. Si aucune donnée, affiche un toast d'avertissement.

Emplacement du code
- Logique principale: `module-pages.js` (fonctions `exportCsvFallback()` et `downloadCsv()`).
- URL d'export serveur (quand Buttons est présent ou voulu): `api/export.php` (construite par `selectedExportUrl()`).

Colonnes exportées
- Pour le module `animals`, l'ordre par défaut est: `id, rfid_number, name, species, breed, sex, status, weight`.
- Pour d'autres modules, la clé exportée est dérivée automatiquement des propriétés d'objet retournées par l'API (tous les champs non-objets).
- Pour ajouter/forcer un ordre de colonnes, modifier la constante `EXPORT_KEYS` dans `module-pages.js`.

Limitations
- Le fallback produit uniquement du CSV (pas d'Excel natif ni de PDF). Pour Excel/PDF, utilisez l'export serveur (`api/export.php`) ou chargez DataTables Buttons + JSZip/pdfmake.
- Pour de très grands jeux de données (>30k lignes), l'export côté client peut être lent ou mener à des limites mémoire. Préférer l'export serveur dans ce cas.

Test rapide
1. Ouvrir le module (ex. `animals.php`).
2. Appliquer un filtre ou sélectionner quelques lignes.
3. Cliquer sur l'action `Exporter CSV` (ou exécuter `exportModule('csv')` dans la console).
4. Vérifier le téléchargement `animals-YYYYMMDD.csv` contenant les colonnes attendues.

Si vous voulez, je peux ajouter un exemple d'export de test automatique (petit script) ou mettre à jour la page d'aide utilisateur.
