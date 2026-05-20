// ================================================================
// SERVLET : formulaire
// Rôle : afficher la page du formulaire (nom + prénom).
// URL  : http://localhost:8080/Projet_1/formulaire
//
// Cette servlet est la plus simple du projet : elle reçoit une
// requête GET et redirige immédiatement vers le JSP du formulaire.
// Elle ne traite aucune donnée — c'est juste un "aiguilleur".
// ================================================================
package com;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

// Cette servlet répond à l'URL "/formulaire"
@WebServlet("/formulaire")
public class formulaire extends HttpServlet {

    private static final long serialVersionUID = 1L;

    public formulaire() {
        super();
    }

    // GET : l'utilisateur accède à la page du formulaire via un lien ou l'URL.
    // On ne fait que transférer vers le JSP qui affiche le formulaire HTML.
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        // ⚡ ASTUCE : forward vs redirect — deux façons de changer de page.
        //
        //  forward(request, response)
        //    → Le serveur transfère en interne vers le JSP.
        //    → L'URL dans le navigateur NE CHANGE PAS.
        //    → Le request (et ses attributs) est conservé.
        //    → Utiliser pour passer des données entre Servlet et JSP.
        //
        //  response.sendRedirect("url")
        //    → Le serveur dit au navigateur "va à cette URL".
        //    → L'URL dans le navigateur CHANGE.
        //    → Le request est perdu (nouvelle requête du navigateur).
        //    → Utiliser après une soumission de formulaire (pattern PRG).

        this.getServletContext()
            .getRequestDispatcher("/WEB-INF/formulaire.jsp")
            .forward(request, response);
    }

    // POST : même comportement que GET ici (on affiche juste le formulaire).
    // La soumission du formulaire va vers la servlet "traitement", pas ici.
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        doGet(request, response);
    }
}
