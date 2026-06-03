package com;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@WebServlet("/ajouter")
public class AjouterServlet extends HttpServlet {

    private static final long serialVersionUID = 1L;

    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        String produit = request.getParameter("produit");
        HttpSession session = request.getSession();

        List<String> liste = (List<String>) session.getAttribute("liste");
        if (liste == null) {
            liste = new ArrayList<>();
            session.setAttribute("liste", liste);
        }

        if (produit != null && !produit.trim().isEmpty()) {
            liste.add(produit.trim());
        }

        response.sendRedirect(request.getContextPath() + "/liste");
    }
}
