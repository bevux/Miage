// ================================================================
// PARTIE 2 – Chaînes de caractères et tableaux
// Transforme "0|1|0|2|0|0|1|0|0" en tableau, l'envoie à la vue
// URL : http://localhost:8080/Projet_1/tableau-chaines
// ================================================================
package com;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebServlet("/tableau-chaines")
public class TableauServlet extends HttpServlet {

    private static final long serialVersionUID = 1L;

    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        String chaine = "0|1|0|2|0|0|1|0|0";
        String[] tableau = chaine.split("\\|");

        request.setAttribute("chaine", chaine);
        request.setAttribute("tableau", tableau);

        this.getServletContext()
            .getRequestDispatcher("/WEB-INF/tableau.jsp")
            .forward(request, response);
    }
}
