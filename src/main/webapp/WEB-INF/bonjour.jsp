<%--
  PARTIE 1 – Vue : formulaire + affichage du résultat
  Si request.getAttribute("donnee") est null → première visite → formulaire
  Sinon → la page vient du POST → on affiche "Bonjour <donnee>"
--%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>

<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Partie 1 – Bonjour</title>
</head>
<body>

    <%@ include file="../menu.jsp" %>

    <h2>Partie 1 – Gestion de formulaire</h2>

    <%
        String donnee = (String) request.getAttribute("donnee");

        if (donnee == null) {
            // Première visite (GET) : on affiche le formulaire
    %>
        <form method="post" action="${pageContext.request.contextPath}/bonjour">
            <label for="donnee">Votre nom :</label>
            <input type="text" id="donnee" name="donnee" />
            <input type="submit" value="Valider" />
        </form>
    <%
        } else {
            // Après soumission (POST) : on affiche le résultat
    %>
        <p><strong>Bonjour <%= donnee %> !</strong></p>
        <a href="${pageContext.request.contextPath}/bonjour">Retour au formulaire</a>
    <%
        }
    %>

</body>
</html>
