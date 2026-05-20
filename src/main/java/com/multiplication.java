// ================================================================
// SERVLET : multiplication
// Rôle : recevoir un nombre et transférer vers la vue de la table
//        de multiplication correspondante.
// URL  : http://localhost:8080/Projet_1/multiplication?nombre=5
//
// Flux :
//   1. L'utilisateur appelle l'URL avec ?nombre=5
//   2. Cette servlet lit le paramètre "nombre"
//   3. Elle le stocke dans le request comme "attribut"
//   4. Elle forward vers vue3.jsp qui affiche la table
// ================================================================
package com;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebServlet("/multiplication")
public class multiplication extends HttpServlet {

    private static final long serialVersionUID = 1L;

    public multiplication() {
        super();
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        // ================================================================
        //  PARAMÈTRE vs ATTRIBUT — différence importante !
        // ================================================================
        //
        //  request.getParameter("nom")
        //    → Lit une valeur envoyée par le navigateur (formulaire ou URL).
        //    → Exemple URL : /multiplication?nombre=5  →  getParameter("nombre") = "5"
        //    → Type : toujours une String.
        //
        //  request.setAttribute("nom", valeur)
        //    → Stocke une valeur CÔTÉ SERVEUR dans le request.
        //    → Seul le code Java/JSP du même serveur peut la lire.
        //    → Le navigateur ne la voit jamais.
        //    → Utilisé pour passer des données de la Servlet vers le JSP.
        //
        //  request.getAttribute("nom")
        //    → Récupère une valeur stockée par setAttribute().
        // ================================================================

        // On lit le paramètre "nombre" envoyé dans l'URL (?nombre=5)
        String nombre = request.getParameter("nombre");

        // On stocke ce nombre comme attribut du request pour le JSP.
        // Le JSP pourra le récupérer avec request.getAttribute("nombre").
        request.setAttribute("nombre", nombre);

        // Transfer vers vue3.jsp qui affichera la table de multiplication.
        this.getServletContext()
            .getRequestDispatcher("/WEB-INF/vue3.jsp")
            .forward(request, response);
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        doGet(request, response);
    }
}
