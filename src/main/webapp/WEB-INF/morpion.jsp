<%--
  PARTIE 3 – Vue Morpion
  Zone 1 : variables récupérées depuis les attributs de requête
  Zone 2 : affichage du plateau 3×3
  Zone 3 : formulaire de saisie des coordonnées (+ champs cachés)
  Résultat affiché et formulaire masqué si la partie est terminée
--%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>

<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Partie 3 – Morpion</title>
    <style>
        table  { border-collapse: collapse; margin: 20px 0; }
        td     { width: 70px; height: 70px; text-align: center;
                 vertical-align: middle; border: 3px solid #333;
                 font-size: 32px; font-weight: bold; }
        .x     { color: #1a73e8; }
        .o     { color: #d93025; }
        .info  { font-size: 16px; margin: 8px 0; }
        .error { color: #d93025; }
        .win   { color: #188038; font-size: 22px; font-weight: bold; margin: 12px 0; }
        form   { margin-top: 10px; }
        input[type="text"] { width: 40px; text-align: center; font-size: 16px; }
    </style>
</head>
<body>

    <%@ include file="../menu.jsp" %>

    <h2>Partie 3 – Jeu du Morpion</h2>

    <%-- ============================================================
         ZONE 1 : récupération des variables
         Première visite (GET) → valeurs initiales posées par le servlet
         Retour formulaire (POST) → valeurs mises à jour par le servlet
         ============================================================ --%>
    <%
        String   plateauStr = (String)  request.getAttribute("plateau");
        int      tour       = (Integer) request.getAttribute("tour");
        int      gg         = (Integer) request.getAttribute("gg");
        String   message    = (String)  request.getAttribute("message");

        String[] cells = plateauStr.split("\\|");
        int joueurCourant = tour % 2 + 1;
    %>

    <%-- Affichage d'un message d'erreur (coup invalide) --%>
    <% if (!message.isEmpty()) { %>
        <p class="error"><%= message %></p>
    <% } %>

    <p class="info">Tour n° <%= tour %></p>

    <%-- ============================================================
         ZONE 2 : plateau de jeu
         0 → case vide, 1 → X (joueur 1), 2 → O (joueur 2)
         Ligne i, colonne j → indice = i * 3 + j
         ============================================================ --%>
    <table>
    <%
        for (int i = 0; i < 3; i++) {
    %>
        <tr>
        <%
            for (int j = 0; j < 3; j++) {
                String cell = cells[i * 3 + j];
        %>
            <td>
            <% if (cell.equals("1")) { %>
                <span class="x">X</span>
            <% } else if (cell.equals("2")) { %>
                <span class="o">O</span>
            <% } else { %>
                &nbsp;
            <% } %>
            </td>
        <%
            }
        %>
        </tr>
    <%
        }
    %>
    </table>

    <%-- (d) Affichage du résultat final --%>
    <% if (gg == 1) { %>
        <p class="win">&#127881; Joueur 1 (X) gagne !</p>
    <% } else if (gg == 2) { %>
        <p class="win">&#127881; Joueur 2 (O) gagne !</p>
    <% } else if (gg == 0 && tour == 9) { %>
        <p class="win">Match nul !</p>
    <% } %>

    <%-- ============================================================
         ZONE 3 : formulaire de saisie (masqué si la partie est finie)
         Champs cachés : plateau et tour transmis à chaque POST
         ============================================================ --%>
    <% if (gg == 0 && tour < 9) { %>

        <p class="info">
            Au tour du <strong>Joueur <%= joueurCourant %>
            (<%= joueurCourant == 1 ? "X" : "O" %>)</strong>
        </p>

        <form method="post" action="${pageContext.request.contextPath}/morpion">

            <%-- (a/c) Variables cachées : état du jeu transmis au servlet --%>
            <input type="hidden" name="plateau" value="<%= plateauStr %>" />
            <input type="hidden" name="tour"    value="<%= tour %>" />

            Ligne&nbsp;(0‑2)&nbsp;:
            <input type="text" name="x" maxlength="1" />
            &nbsp;&nbsp;
            Colonne&nbsp;(0‑2)&nbsp;:
            <input type="text" name="y" maxlength="1" />
            &nbsp;&nbsp;
            <input type="submit" value="Jouer" />
        </form>

    <% } %>

    <p><a href="${pageContext.request.contextPath}/morpion">&#8635; Nouvelle partie</a></p>

</body>
</html>
