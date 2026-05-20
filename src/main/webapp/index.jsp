<%--
  ================================================================
  INDEX.JSP : Page d'accueil de l'application
  C'est la première page affichée quand on accède à l'application.
  Elle est définie comme "welcome-file" dans web.xml.

  URL : http://localhost:8080/Projet_1/
  ================================================================
--%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>

<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>APP ENT – Accueil</title>
</head>
<body>

    <%-- Inclusion du menu.jsp : le menu de navigation est commun à toutes les pages.
         On l'inclut ici avec un chemin relatif depuis index.jsp (à la racine de webapp). --%>
    <%@ include file="menu.jsp" %>

    <h1>Bienvenue sur l'application ENT</h1>
    <p>Choisissez une fonctionnalité dans le menu ci-dessus.</p>

</body>
</html>
