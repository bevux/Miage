# Projet 1 – Application Web Java (MVC avec Servlets et JSP)

Projet réalisé dans le cadre du cours MIAGE.  
Il illustre l'architecture **MVC** (Modèle – Vue – Contrôleur) avec des Servlets Java et des fichiers JSP.

---

## Structure du projet

```
Projet 1/
├── src/main/java/com/
│   ├── controleur_1.java   → Servlet qui affiche la vue 1 (page vide)
│   ├── formulaire.java     → Servlet qui affiche le formulaire nom/prénom
│   ├── traitement.java     → Servlet qui traite le formulaire (POST)
│   └── multiplication.java → Servlet qui gère la table de multiplication
│
└── src/main/webapp/
    ├── index.jsp           → Page d'accueil
    ├── menu.jsp            → Barre de navigation commune
    └── WEB-INF/
        ├── web.xml         → Configuration de l'application
        ├── formulaire.jsp  → Vue : formulaire de saisie
        ├── vue1.jsp        → Vue : page d'accueil
        ├── vue2.jsp        → Vue : affichage du nom et prénom
        └── vue3.jsp        → Vue : table de multiplication
```

---

## Architecture MVC expliquée

```
Navigateur  →  Servlet (Contrôleur)  →  JSP (Vue)
                     ↑
               Données (Modèle)
```

1. L'utilisateur clique un lien ou soumet un formulaire.
2. La **Servlet** reçoit la requête HTTP, prépare les données.
3. Elle fait un **forward** vers un **JSP** qui génère le HTML.
4. Le navigateur affiche le HTML reçu.

---

## Fonctionnalités

| URL | Description |
|-----|-------------|
| `/` ou `/index.jsp` | Page d'accueil |
| `/formulaire` | Formulaire de saisie nom/prénom |
| `/traitement` | Traitement POST du formulaire |
| `/multiplication?nombre=5` | Table de multiplication du nombre 5 |
| `/controleur_1` | Vue 1 (page d'exemple) |

---

## Concepts clés

- **Servlet** : programme Java qui répond aux requêtes HTTP.
- **JSP** : page HTML avec du code Java intégré pour générer du contenu dynamique.
- **doGet** : gère les requêtes GET (accès URL / lien).
- **doPost** : gère les requêtes POST (soumission de formulaire).
- **forward** : transfert interne de la servlet vers le JSP (l'URL ne change pas).
- **setAttribute / getAttribute** : passage de données de la servlet vers le JSP.
- **@WebServlet** : annotation qui associe une URL à une servlet.
- **WEB-INF** : dossier protégé, inaccessible directement depuis le navigateur.

---

## Prérequis

- Java 17+
- Apache Tomcat 10+
- Eclipse IDE for Enterprise Java Developers (ou IntelliJ)
