<%--
  PARTIE 2 – Vue : affiche le tableau brut puis la grille 3x3 HTML
--%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>

<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Partie 2 – Tableau</title>
    <style>
        table { border-collapse: collapse; margin: 15px 0; }
        td    { width: 50px; height: 50px; text-align: center;
                vertical-align: middle; border: 2px solid #555;
                font-size: 20px; }
    </style>
</head>
<body>

    <%@ include file="../menu.jsp" %>

    <h2>Partie 2 – Chaînes de caractères et tableaux</h2>

    <%
        String   chaine  = (String)   request.getAttribute("chaine");
        String[] tableau = (String[]) request.getAttribute("tableau");
    %>

    <%-- (a) Affichage du tableau brut issu de split() --%>
    <h3>a) Résultat de explode / split sur "<%= chaine %>"</h3>
    <p>
    <%
        for (int i = 0; i < tableau.length; i++) {
    %>
        [<%= i %>] = <%= tableau[i] %>&nbsp;&nbsp;
    <%
        }
    %>
    </p>

    <%-- (b) Représentation 3x3 en tableau HTML --%>
    <h3>b) Représentation en tableau HTML 3×3</h3>
    <table>
    <%
        for (int ligne = 0; ligne < 3; ligne++) {
    %>
        <tr>
        <%
            for (int col = 0; col < 3; col++) {
        %>
            <td><%= tableau[ligne * 3 + col] %></td>
        <%
            }
        %>
        </tr>
    <%
        }
    %>
    </table>

</body>
</html>
