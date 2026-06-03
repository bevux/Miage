package com;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebServlet("/morpion")
public class MorpionServlet extends HttpServlet {

    private static final long serialVersionUID = 1L;

    @Override
    protected void service(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        String plateauStr = request.getParameter("plateau");
        int tour, gg;
        String message = "";

        if (plateauStr == null) {
            plateauStr = "0|0|0|0|0|0|0|0|0";
            tour = 0;
            gg   = 0;
        } else {
            tour = Integer.parseInt(request.getParameter("tour"));
            gg   = 0;

            String xStr = request.getParameter("x");
            String yStr = request.getParameter("y");
            String[] cells = plateauStr.split("\\|");

            try {
                int x = Integer.parseInt(xStr.trim());
                int y = Integer.parseInt(yStr.trim());

                if (x < 0 || x > 2 || y < 0 || y > 2) {
                    message = "Coordonnées hors plateau (0, 1 ou 2 attendu).";
                } else if (!cells[x * 3 + y].equals("0")) {
                    message = "Case déjà jouée, choisissez une autre case.";
                } else {
                    int joueur = tour % 2 + 1;
                    cells[x * 3 + y] = String.valueOf(joueur);
                    tour++;
                    gg = checkWin(cells, joueur);
                }

                plateauStr = String.join("|", cells);

            } catch (NumberFormatException e) {
                message = "Veuillez saisir des chiffres (0, 1 ou 2).";
            }
        }

        String[] cells = plateauStr.split("\\|");
        String[][] grid = new String[3][3];
        for (int i = 0; i < 3; i++)
            for (int j = 0; j < 3; j++)
                grid[i][j] = cells[i * 3 + j];

        request.setAttribute("plateau", plateauStr);
        request.setAttribute("grid",    grid);
        request.setAttribute("tour",    tour);
        request.setAttribute("gg",      gg);
        request.setAttribute("message", message);

        getServletContext()
            .getRequestDispatcher("/WEB-INF/morpion.jsp")
            .forward(request, response);
    }

    private int checkWin(String[] cells, int joueur) {
        String j = String.valueOf(joueur);
        int[][] lignes = {
            {0,1,2}, {3,4,5}, {6,7,8},
            {0,3,6}, {1,4,7}, {2,5,8},
            {0,4,8}, {2,4,6}
        };
        for (int[] l : lignes)
            if (cells[l[0]].equals(j) && cells[l[1]].equals(j) && cells[l[2]].equals(j))
                return joueur;
        return 0;
    }
}
