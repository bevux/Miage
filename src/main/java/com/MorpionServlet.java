// ================================================================
// PARTIE 3 – Jeu Morpion (Tic-Tac-Toe)
//
// Plateau : chaîne "0|0|0|0|0|0|0|0|0"
//   0 = case vide, 1 = joueur 1 (X), 2 = joueur 2 (O)
//
// tour : nombre de coups joués (0 à 9)
//   joueur courant = tour % 2 + 1  →  1 ou 2
//
// gg : état du jeu
//   0 = en cours, 1 = joueur 1 gagne, 2 = joueur 2 gagne
//   nul si gg==0 && tour==9
//
// URL : http://localhost:8080/Projet_1/morpion
// ================================================================
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

    // GET : première visite → initialisation du jeu
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        request.setAttribute("plateau", "0|0|0|0|0|0|0|0|0");
        request.setAttribute("tour",    0);
        request.setAttribute("gg",      0);
        request.setAttribute("message", "");
        forward(request, response);
    }

    // POST : le formulaire a été soumis → traitement du coup
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        // (a) Récupération des variables depuis les champs cachés et le formulaire
        String plateauStr = request.getParameter("plateau");
        int    tour       = Integer.parseInt(request.getParameter("tour"));
        String xStr       = request.getParameter("x");
        String yStr       = request.getParameter("y");

        String[] cells  = plateauStr.split("\\|");
        int      gg     = 0;
        String   message = "";

        // (b) Validation des coordonnées et mise à jour du plateau
        try {
            int x = Integer.parseInt(xStr.trim());
            int y = Integer.parseInt(yStr.trim());

            if (x < 0 || x > 2 || y < 0 || y > 2) {
                // Coordonnées hors plateau : tour n'évolue pas
                message = "Coordonnées hors plateau (valeurs attendues : 0, 1 ou 2).";
            } else if (!cells[x * 3 + y].equals("0")) {
                // Case déjà jouée : tour n'évolue pas
                message = "Cette case est déjà jouée, choisissez-en une autre.";
            } else {
                // Coup valide
                int joueur = tour % 2 + 1;
                cells[x * 3 + y] = String.valueOf(joueur);
                tour++;

                // (d) Vérification de la victoire
                gg = checkWin(cells, joueur);
            }
        } catch (NumberFormatException e) {
            message = "Veuillez saisir des coordonnées numériques (0, 1 ou 2).";
        }

        // (c) Reconstitution de la chaîne plateau pour les champs cachés
        plateauStr = String.join("|", cells);

        request.setAttribute("plateau", plateauStr);
        request.setAttribute("tour",    tour);
        request.setAttribute("gg",      gg);
        request.setAttribute("message", message);
        forward(request, response);
    }

    // Vérifie si le joueur donné aligne trois cases
    private int checkWin(String[] cells, int joueur) {
        String j = String.valueOf(joueur);
        int[][] lignes = {
            {0, 1, 2}, {3, 4, 5}, {6, 7, 8},   // lignes
            {0, 3, 6}, {1, 4, 7}, {2, 5, 8},   // colonnes
            {0, 4, 8}, {2, 4, 6}                // diagonales
        };
        for (int[] l : lignes) {
            if (cells[l[0]].equals(j) && cells[l[1]].equals(j) && cells[l[2]].equals(j)) {
                return joueur;
            }
        }
        return 0;
    }

    private void forward(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        this.getServletContext()
            .getRequestDispatcher("/WEB-INF/morpion.jsp")
            .forward(request, response);
    }
}
