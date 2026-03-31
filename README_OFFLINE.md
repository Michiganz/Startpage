# Pyramid Startpage - Mode Hors-Ligne

Votre page de nouvel onglet est maintenant **100% fonctionnelle hors connexion**.

## Ressources locales

Toutes les ressources sont maintenant stockées localement :

- **Tailwind CSS** → `style.css` (généré localement)
- **Polices** → `fonts/` (Space Grotesk, Manrope, Material Symbols)
- **Images de fond** → `assets/backgrounds/` (10 images)
- **Service Worker** → `sw.js` (gère le cache)

## Utilisation

### Ouvrir la page

1. Ouvrez `new_tab.html` directement dans votre navigateur
2. Ou configurez-la comme page de nouvel onglet dans votre navigateur

### Mode hors-ligne

- **Météo** : Affiche la dernière valeur chargée (mise en cache dans localStorage)
- **Images** : Toutes les images de fond sont disponibles localement
- **Polices** : Affichage correct même sans connexion
- **CSS** : Tailwind est généré localement

## Commandes npm

```bash
# Générer le CSS Tailwind
npm run build:css

# Mode surveillance (rebuild automatique)
npm run watch:css
```

## Structure des fichiers

```
Startpage/
├── new_tab.html          # Page principale
├── style.css             # CSS Tailwind généré
├── input.css             # Source CSS Tailwind
├── sw.js                 # Service Worker (cache hors-ligne)
├── fonts/
│   ├── fonts.css         # Configuration des polices
│   └── *.woff2           # Fichiers de polices
└── assets/
    └── backgrounds/      # Images de fond (10 fichiers .jpg)
        ├── mountain.jpg
        ├── waterfall.jpg
        ├── landscape.jpg
        ├── starry-night.jpg
        ├── dark-forest.jpg
        ├── beach.jpg
        ├── sunrise.jpg
        ├── nature.jpg
        ├── forest.jpg
        └── meadow.jpg
```

## Fonctionnalités

- ✅ Horloge en temps réel
- ✅ Météo avec cache hors-ligne (Douala, Cameroun)
- ✅ 10 thèmes d'images de fond
- ✅ Mode sombre/clair
- ✅ Raccourcis vers les sites gouvernementaux camerounais
- ✅ Barre de recherche
- ✅ Service Worker pour le cache intelligent

## Notes

- Le Service Worker ne fonctionne pas via `file://` - utilisez un serveur local ou un navigateur qui permet les SW en local
- La météo nécessite une connexion pour la première charge, puis utilise le cache
- Les données météo sont conservées dans `localStorage` du navigateur
