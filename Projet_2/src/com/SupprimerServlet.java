package com;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.io.IOException;
import java.util.List;

@WebServlet("/supprimer")
public class SupprimerServlet extends HttpServlet {

    private static final long serialVersionUID = 1L;

    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        HttpSession session = request.getSession();
        List<String> liste = (List<String>) session.getAttribute("liste");

        try {
            int index = Integer.parseInt(request.getParameter("index"));
            if (liste != null && index >= 0 && index < liste.size()) {
                liste.remove(index);
            }
        } catch (NumberFormatException e) {
            // index invalide, on ignore
        }

        response.sendRedirect(request.getContextPath() + "/liste");
    }
}
