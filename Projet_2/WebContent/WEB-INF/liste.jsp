<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Ma liste de courses</title>
    <style>
        body  { font-family: Arial, sans-serif; max-width: 500px; margin: 40px auto; }
        h1    { color: #2c7a2c; }
        ul    { list-style: none; padding: 0; }
        li    { display: flex; justify-content: space-between; align-items: center;
                padding: 10px; border-bottom: 1px solid #ddd; font-size: 16px; }
        .suppr { background: #cc0000; color: white; border: none; padding: 5px 10px; cursor: pointer; border-radius: 4px; }
        .suppr:hover { background: #990000; }
        .ajout { display: flex; gap: 8px; margin-top: 20px; }
        .ajout input  { flex: 1; padding: 8px; font-size: 16px; }
        .ajout button { padding: 8px 16px; font-size: 16px; background: #2c7a2c; color: white; border: none; cursor: pointer; border-radius: 4px; }
        .ajout button:hover { background: #1e5c1e; }
        .vide  { color: #888; font-style: italic; }
        .count { font-size: 13px; color: #666; margin-bottom: 10px; }
    </style>
</head>
<body>
    <h1>🛒 Ma liste de courses</h1>

    <c:choose>
        <c:when test="${empty sessionScope.liste}">
            <p class="vide">Votre liste est vide.</p>
        </c:when>
        <c:otherwise>
            <p class="count">${sessionScope.liste.size()} produit(s)</p>
            <ul>
                <c:forEach var="produit" items="${sessionScope.liste}" varStatus="s">
                    <li>
                        <span>${produit}</span>
                        <form method="post" action="${pageContext.request.contextPath}/supprimer">
                            <input type="hidden" name="index" value="${s.index}" />
                            <%-- Champ caché contenant l'état de la liste (requis par l'énoncé) --%>
                            <input type="hidden" name="liste" value="${sessionScope.liste}" />
                            <button class="suppr" type="submit">Supprimer</button>
                        </form>
                    </li>
                </c:forEach>
            </ul>
        </c:otherwise>
    </c:choose>

    <%-- Formulaire d'ajout --%>
    <form method="post" action="${pageContext.request.contextPath}/ajouter" class="ajout">
        <input type="text" name="produit" placeholder="Ajouter un produit..." autofocus />
        <button type="submit">Ajouter</button>
    </form>

    <br>
    <a href="${pageContext.request.contextPath}/index.html">⬅ Accueil</a>
</body>
</html>
