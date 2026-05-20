<%--
  ================================================================
  VUE 2 : Affichage du nom et du prénom
  Associée à la servlet : traitement (doPost)

  Cette page reçoit les données saisies dans le formulaire
  et les affiche à l'écran.

  COMMENT ÇA MARCHE ?
    1. L'utilisateur soumet le formulaire (formulaire.jsp)
    2. La servlet "traitement" lit les données avec getParameter()
    3. Elle les stocke avec request.setAttribute("nom", nom)
    4. Elle forward vers ce JSP
    5. Ce JSP récupère les données avec request.getAttribute()
  ================================================================
--%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>

<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>APP ENT – Résultat</title>
</head>
<body>

    <%-- Inclusion du menu de navigation --%>
    <%@ include file="../menu.jsp" %>

    <h2>Résultat du formulaire</h2>

    <%--
      SCRIPTLET JSP : du code Java entre <% et %>
      Le serveur exécute ce code Java et insère le résultat dans le HTML.
      L'utilisateur ne voit que le HTML final, jamais ce code Java.

      ================================================================
      getAttribute vs getParameter — rappel important !
      ================================================================
      request.getAttribute("nom")
        → Récupère une valeur stockée par la SERVLET avec setAttribute().
        → C'est une valeur côté serveur, invisible pour le navigateur.
        → Le type retourné est Object, donc il faut convertir en String : (String)

      request.getParameter("nom")
        → Récupère une valeur envoyée par le NAVIGATEUR (formulaire ou URL).
        → Toujours une String, pas besoin de conversion.

      ⚡ ASTUCE : Ici on utilise getAttribute() car la servlet a utilisé
                  setAttribute() pour nous passer les données.
                  C'est la bonne pratique MVC.
      ================================================================
    --%>
    <%
        // Récupération des attributs stockés par la servlet "traitement"
        String nom    = (String) request.getAttribute("nom");
        String prenom = (String) request.getAttribute("prenom");
    %>

    <%-- Affichage des valeurs dans le HTML.
         out.println() écrit du texte directement dans la page HTML. --%>
    <p>
        Bonjour <strong><%= prenom %> <%= nom %></strong> !
    </p>

    <%--
      ⚡ ASTUCE : <%= valeur %> est un raccourci pour out.println(valeur).
                  Ces deux écritures sont équivalentes :
                    out.println(nom);
                    <%= nom %>
                  Préférez <%= %> pour afficher des valeurs dans le HTML,
                  c'est plus lisible.
    --%>

    <p><a href="${pageContext.request.contextPath}/formulaire">← Retour au formulaire</a></p>

</body>
</html>
