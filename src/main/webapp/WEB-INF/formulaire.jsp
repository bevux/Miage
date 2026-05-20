<%--
  ================================================================
  QU'EST-CE QU'UN FICHIER JSP ?
  ================================================================
  JSP = Java Server Pages.
  C'est un fichier HTML dans lequel on peut écrire du code Java.
  Le serveur exécute le Java, génère du HTML, et l'envoie au
  navigateur. L'utilisateur ne voit jamais le code Java.

  RÔLE DE CE FICHIER :
  Afficher un formulaire HTML pour saisir un nom et un prénom.
  Quand l'utilisateur clique "OK", les données sont envoyées
  en POST à la servlet "traitement".
  ================================================================
--%>

<%-- Directive de page : paramètres globaux du JSP.
     language="java"        → le langage utilisé dans les balises <% %>
     contentType="text/html → le type de contenu envoyé au navigateur
     charset=UTF-8          → encodage pour les accents (é, à, ù...)
--%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>

<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>APP ENT – Formulaire</title>
</head>
<body>

    <%-- On inclut le menu de navigation commun à toutes les pages.
         include file="..." = copie le contenu du fichier à cet endroit.
         C'est comme du copier-coller automatique.
         ⚡ ASTUCE : chemin relatif depuis ce fichier (WEB-INF/formulaire.jsp)
                    → on remonte d'un niveau avec "../" pour atteindre menu.jsp --%>
    <%@ include file="../menu.jsp" %>

    <h2>Saisie des informations</h2>

    <%--
      FORMULAIRE HTML :
        method="post"  → les données sont envoyées en POST (invisibles dans l'URL)
        action="..."   → URL de la servlet qui va recevoir les données

      ⚡ ASTUCE : Utiliser un chemin relatif plutôt qu'une URL absolue.
                  "${pageContext.request.contextPath}" donne automatiquement
                  "/Projet_1" (ou le nom réel de l'application).
                  Ainsi le code fonctionne même si on change de serveur.

      ⚠️  L'URL absolue http://localhost:8080/Projet_1/traitement ne fonctionne
          qu'en local. En production (autre serveur), elle sera fausse.
    --%>
    <form method="post" action="${pageContext.request.contextPath}/traitement">

        <%-- Champ texte pour le nom.
             name="nom" → c'est ce nom que la servlet utilisera dans
             request.getParameter("nom") pour récupérer la valeur. --%>
        nom :
        <input type="text" name="nom" /><br />

        <%-- Champ texte pour le prénom. --%>
        prenom :
        <input type="text" name="prenom" />

        <%-- Bouton de soumission : envoie le formulaire. --%>
        <input type="submit" value="OK" />

    </form>

</body>
</html>
