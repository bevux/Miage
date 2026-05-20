<%--
  ================================================================
  MENU.JSP : Barre de navigation commune à toutes les pages
  Ce fichier est inclus dans les autres JSP avec :
    <%@ include file="menu.jsp" %>      (depuis la racine webapp)
    <%@ include file="../menu.jsp" %>   (depuis WEB-INF/)

  ⚡ ASTUCE : Mettre les éléments communs (menu, pied de page) dans
              des fichiers séparés et les inclure avec include.
              Si le menu change, on ne modifie qu'un seul fichier.

  ⚡ ASTUCE : ${pageContext.request.contextPath} donne le préfixe
              de l'application (ex: /Projet_1).
              Utiliser toujours cela pour les liens internes au lieu
              de coder en dur "http://localhost:8080/Projet_1".
  ================================================================
--%>
<nav>
    <%-- Lien vers la page d'accueil (index.jsp) --%>
    <a href="${pageContext.request.contextPath}/index.jsp">Accueil</a>

    <%-- Lien vers le formulaire (passe par la servlet "formulaire") --%>
    <a href="${pageContext.request.contextPath}/formulaire">Formulaire</a>

    <%-- Lien vers la table de multiplication du nombre 5 par défaut.
         L'utilisateur peut changer le nombre dans l'URL. --%>
    <a href="${pageContext.request.contextPath}/multiplication?nombre=5">Table de multiplication</a>

    <%-- TP Morpion --%>
    <a href="${pageContext.request.contextPath}/bonjour">Partie 1 – Bonjour</a>
    <a href="${pageContext.request.contextPath}/tableau-chaines">Partie 2 – Tableau</a>
    <a href="${pageContext.request.contextPath}/morpion">Partie 3 – Morpion</a>
</nav>

<hr />
