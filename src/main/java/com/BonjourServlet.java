// ================================================================
// PARTIE 1 – Gestion de formulaire
// GET  : affiche le formulaire de saisie
// POST : affiche "Bonjour <nom>"
// URL  : http://localhost:8080/Projet_1/bonjour
// ================================================================
package com;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebServlet("/bonjour")
public class BonjourServlet extends HttpServlet {

    private static final long serialVersionUID = 1L;

    // GET : première visite – on affiche juste le formulaire
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        this.getServletContext()
            .getRequestDispatcher("/WEB-INF/bonjour.jsp")
            .forward(request, response);
    }

    // POST : le formulaire a été soumis – on récupère "donnee" et on l'envoie à la vue
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        String donnee = request.getParameter("donnee");
        request.setAttribute("donnee", donnee);

        this.getServletContext()
            .getRequestDispatcher("/WEB-INF/bonjour.jsp")
            .forward(request, response);
    }
}
