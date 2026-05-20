<%--
  ================================================================
  VUE 3 : Table de multiplication
  Associée à la servlet : multiplication

  Cette page affiche la table de multiplication d'un nombre.
  Le nombre est passé par la servlet via request.setAttribute().

  Exemple d'appel : http://localhost:8080/Projet_1/multiplication?nombre=7
  ================================================================
--%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>

<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Table de multiplication</title>
</head>
<body>

    <%-- Inclusion du menu de navigation --%>
    <%@ include file="../menu.jsp" %>

    <%--
      CODE JAVA dans le JSP (scriptlet) :
      Tout ce qui est entre <% et %> est du Java exécuté côté serveur.
    --%>
    <%
        // On récupère l'attribut "nombre" stocké par la servlet multiplication.
        // request.getAttribute() retourne un Object (type générique),
        // donc on le convertit en String avec (String).
        String nombre = (String) request.getAttribute("nombre");

        // Vérification : si l'attribut est null ou vide, on affiche un message d'erreur.
        // null    → l'attribut n'existe pas (page appelée sans passer par la servlet)
        // isEmpty → l'URL contenait ?nombre= mais sans valeur
        if (nombre == null || nombre.isEmpty()) {
            // out.println() écrit du HTML dans la page.
    %>
            <p style="color:red;">
                Aucun nombre fourni. Exemple d'URL :
                <code>${pageContext.request.contextPath}/multiplication?nombre=5</code>
            </p>
    <%
        } else {
            // Integer.parseInt() convertit la String "7" en entier 7.
            // ⚡ ASTUCE : getParameter/getAttribute renvoie toujours une String.
            //             Si vous avez besoin d'un nombre, il faut convertir.
            //             parseInt → entier, parseDouble → décimal (3.14)
            int n = Integer.parseInt(nombre);
    %>

            <h2>Table de multiplication de <%= n %></h2>

            <%-- On construit un tableau HTML avec une boucle Java.
                 Pour chaque valeur de i (de 0 à 10), on génère une ligne HTML. --%>
            <table border="1" cellpadding="5" cellspacing="0">

                <%-- En-tête du tableau --%>
                <tr>
                    <th>Calcul</th>
                    <th>Résultat</th>
                </tr>

                <%
                    // Boucle for : i commence à 1, s'arrête à 10, augmente de 1 à chaque tour.
                    // ⚡ ASTUCE : on peut mélanger HTML et Java dans un JSP.
                    //             Le <tr> et <td> ci-dessous sont dans la boucle Java.
                    for (int i = 1; i <= 10; i++) {
                %>
                    <tr>
                        <%-- <%= %> affiche la valeur d'une expression Java dans le HTML --%>
                        <td><%= n %> × <%= i %></td>
                        <td><strong><%= (n * i) %></strong></td>
                    </tr>
                <%
                    } // fin de la boucle for
                %>

            </table>

            <p><a href="${pageContext.request.contextPath}/formulaire">← Retour au formulaire</a></p>

    <%
        } // fin du else
    %>

</body>
</html>
