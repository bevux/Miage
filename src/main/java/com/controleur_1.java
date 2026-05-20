// ================================================================
// PACKAGE : com
// Un "package" c'est un dossier qui regroupe vos classes Java.
// Tous les fichiers de ce projet sont dans le package "com".
// ================================================================
package com;

// ================================================================
// IMPORTS : on importe les outils (classes) dont on a besoin.
// Sans import, Java ne sait pas ce que sont HttpServlet, etc.
// ================================================================
import jakarta.servlet.ServletException;         // Pour gérer les erreurs de servlet
import jakarta.servlet.annotation.WebServlet;    // Pour définir l'URL de la servlet
import jakarta.servlet.http.HttpServlet;         // La classe de base de toute servlet
import jakarta.servlet.http.HttpServletRequest;  // Représente la requête du navigateur
import jakarta.servlet.http.HttpServletResponse; // Représente la réponse à envoyer
import java.io.IOException;

// ================================================================
//  QU'EST-CE QU'UNE SERVLET ?
// ================================================================
//  Une Servlet est un programme Java qui tourne sur un serveur web.
//  Quand l'utilisateur tape une URL dans son navigateur, le serveur
//  appelle la servlet correspondante, qui traite la demande et renvoie
//  une réponse (page HTML, données JSON, etc.).
//
//  ARCHITECTURE MVC (Modèle – Vue – Contrôleur) :
//  Ce projet suit le patron MVC, une façon d'organiser le code :
//    Modèle     → les données (ex : une classe Personne, Produit...)
//    Vue        → ce que l'utilisateur voit  (ici les fichiers .jsp)
//    Contrôleur → fait le lien entre les deux (ici les Servlets Java)
//
//  Flux d'une requête :
//    1. L'utilisateur clique sur un lien ou soumet un formulaire.
//    2. La Servlet (Contrôleur) reçoit la demande HTTP.
//    3. Elle prépare les données si nécessaire.
//    4. Elle "forward" (transfère) vers un fichier JSP (Vue).
//    5. Le JSP génère le HTML que le navigateur affiche.
// ================================================================

// @WebServlet : annotation qui associe l'URL "/controleur_1" à cette classe.
// Exemple : http://localhost:8080/Projet_1/controleur_1
// ⚡ ASTUCE : Les annotations remplacent la configuration dans web.xml.
//             C'est plus simple et tout est au même endroit.
@WebServlet("/controleur_1")
public class controleur_1 extends HttpServlet {

    // serialVersionUID : identifiant de version unique, obligatoire pour
    // toute classe Serializable. Laissez cette ligne telle quelle.
    private static final long serialVersionUID = 1L;

    // Constructeur : appelé une seule fois quand le serveur crée la servlet.
    // super() appelle le constructeur de HttpServlet. On n'a rien de spécial
    // à faire ici, donc on le laisse vide.
    public controleur_1() {
        super();
    }

    // ================================================================
    //  doGet : méthode appelée pour les requêtes HTTP GET.
    //  GET = l'utilisateur tape une URL ou clique un lien.
    //  Les paramètres GET sont visibles dans l'URL : ?nom=valeur
    //
    //  Paramètres :
    //    request  → tout ce que le navigateur nous envoie
    //    response → ce qu'on va renvoyer au navigateur
    //
    //  "throws" : signifie que cette méthode peut lever des erreurs.
    //  Java oblige à le déclarer pour les erreurs "vérifiées".
    // ================================================================
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        // On indique au navigateur que la réponse est du HTML en UTF-8.
        // UTF-8 permet d'afficher les accents (é, à, ù...).
        response.setContentType("text/html");
        response.setCharacterEncoding("UTF-8");

        // FORWARD vers la vue JSP :
        // Au lieu d'écrire le HTML directement dans Java (vieux style),
        // on délègue l'affichage à un fichier JSP = séparation Contrôleur/Vue.
        //
        // getServletContext()          → accès au contexte de l'application
        // getRequestDispatcher(chemin) → prépare le transfert vers ce chemin
        // .forward(request, response)  → effectue le transfert
        //
        // ⚠️ WEB-INF est un dossier protégé : les utilisateurs ne peuvent pas
        //    y accéder directement depuis leur navigateur. Seul le serveur y
        //    accède. C'est une bonne pratique de sécurité !
        this.getServletContext()
            .getRequestDispatcher("/WEB-INF/vue1.jsp")
            .forward(request, response);
    }

    // ================================================================
    //  doPost : méthode appelée pour les requêtes HTTP POST.
    //  POST = l'utilisateur a soumis un formulaire.
    //  Les données POST ne sont PAS visibles dans l'URL (plus sécurisé).
    //
    //  Ici, on appelle doGet() car la logique est identique pour les deux.
    //  ⚡ ASTUCE : C'est une pratique courante quand GET et POST ont
    //              le même comportement dans votre servlet.
    // ================================================================
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        doGet(request, response);
    }
}
