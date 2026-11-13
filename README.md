# Collision Elevation Precision

[English documentation](README.en.md)

Petit correctif pour Foundry VTT 14 : lorsqu'un déplacement horizontal s'arrête contre un mur, le calcul natif peut transformer une altitude de 4 en 3,9999999999999996. Le pion peut alors être affiché sous son plancher. Ce module conserve l'altitude de départ quand la différence est seulement un résidu de précision machine.

## Installation

Créer le dossier `Data/modules/collision-elevation-precision/` dans les données utilisateur de Foundry et y extraire le contenu du ZIP. Le fichier `module.json` doit être directement dans ce dossier. Relancer Foundry, ouvrir le monde et activer **Collision Elevation Precision** dans la gestion des modules. Recharger les clients connectés.

Si l'auteur fournit une adresse de manifeste, celle-ci peut être utilisée dans l'installateur natif de modules.

## Utilisation

La prévention est automatique pour les déplacements calculés après activation. Aucun bouton ni macro à lancer à chaque collision.

Un pion déjà enregistré avec une altitude incorrecte n'est pas modifié par l'installation. Facultativement, créer une macro de type **Script**, y copier `examples/repair-selected.js`, sélectionner les pions concernés et l'exécuter. Elle ne traite que les résidus infimes au bas de leur niveau, respecte les droits et effectue au plus une écriture groupée. Une hauteur distincte du plancher reste intacte. Aucun balayage ni migration du monde au démarrage.

## Compatibilité et limites

- Foundry VTT 14, à partir de 14.364 ; vérifié dans des mondes Long Hu en 14.364 et 14.370. Les générations 13 et 15 ne sont pas prises en charge.
- Aucune dépendance à Long Hu ou à un autre module. Aucun contenu de jeu inclus. D'autres systèmes peuvent l'essayer, mais leur compatibilité n'a pas été vérifiée en jeu.
- Le correctif vise uniquement le dernier point d'une collision horizontale interrompue, à niveau et dimensions identiques. Un déplacement vertical volontaire n'est pas arrondi au plancher.
- Le dessin du pion peut encore chevaucher le mur : les coordonnées X/Y et la méthode native de collision ne sont pas modifiées.
- La recette complète des hauteurs intermédiaires, notamment 4,5 m avec une configuration chargée de modules, reste à compléter. Cette première version ne promet pas de régler tous les problèmes d'élévation.
- Un autre module remplaçant le même calcul peut créer une incompatibilité. Pour un signalement, fournir les versions, modules actifs, coordonnées et altitudes de départ/arrivée, ainsi qu'un trajet reproductible.

## Fonctionnement et coût

Deux fichiers JavaScript, aucun réseau, aucune télémétrie, aucune dépendance externe. Le contrôle est synchrone dans `Token.constrainMovementPath`, avant l'enregistrement du mouvement. Pas de timer, de nouvelle recherche de mur, d'écriture de rattrapage automatique ni de rafraîchissement supplémentaire de la vision.

Les petits écarts sont détectés avec une tolérance proportionnelle à `Number.EPSILON`. Les données natives sont conservées ; un trajet corrigé est recopié sans mutation des arguments. Ce mécanisme ne supprime pas le coût de l'éclairage dynamique ou de l'animation normale des pions.

## Désactivation

Désactiver le module puis recharger les clients. Les altitudes déjà enregistrées restent celles du monde ; aucune donnée d'acteur n'est ajoutée. Pour les essais techniques : `CollisionElevationPrecision.status()`, `.install()` et `.uninstall()` ; l'action de réparation est `.repairSelectedAtLevel()`.

## Licence et provenance

Licence **MIT**, voir [LICENSE](LICENSE). Projet Long Hu, assistance technique de Codex. Aucun fichier du noyau Foundry, asset commercial, acteur ou scène n'est redistribué. Ce module ne doit pas être présenté comme entièrement créé sans assistance d'IA.

Structure de paquet : [documentation officielle Foundry](https://foundryvtt.com/article/module-development/).

## Installation par URL

Manifeste : https://github.com/Kyukitsune/collision-elevation-precision/releases/latest/download/module.json

## Tests des sources

Avec Node.js 22 ou plus récent : `node scripts/test.mjs`. Les tests ne nécessitent ni Foundry ni un monde de jeu. Les versions de Foundry et limites vérifiées sont indiquées ci-dessus.
