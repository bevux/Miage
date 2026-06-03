<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Projet 2 – Morpion</title>
    <style>
        body  { font-family: Arial, sans-serif; margin: 30px; }
        table { border-collapse: collapse; margin: 20px 0; }
        td    { width: 80px; height: 80px; text-align: center; vertical-align: middle;
                border: 3px solid #333; font-size: 36px; font-weight: bold; cursor: default; }
        .x    { color: #1a73e8; }
        .o    { color: #d93025; }
        .error{ color: #d93025; margin: 8px 0; }
        .win  { color: #188038; font-size: 22px; font-weight: bold; margin: 12px 0; }
        .info { margin: 8px 0; }
        input[type="text"] { width: 45px; font-size: 16px; text-align: center; }
    </style>
</head>
<body>

    <h2>Projet 2 – Jeu du Morpion</h2>

    <%-- Zone 1 : les variables plateau, tour, gg, message sont déjà
         initialisées par le servlet (request.getParameter null check) --%>

    <c:if test="${not empty message}">
        <p class="error">${message}</p>
    </c:if>

    <p class="info">Tour : ${tour}</p>

    <%-- Zone 2 : plateau 3x3 avec JSTL forEach + choose --%>
    <table>
        <c:forEach var="row" items="${grid}">
            <tr>
                <c:forEach var="cell" items="${row}">
                    <td>
                        <c:choose>
                            <c:when test="${cell == '1'}"><span class="x">X</span></c:when>
                            <c:when test="${cell == '2'}"><span class="o">O</span></c:when>
                            <c:otherwise>&nbsp;</c:otherwise>
                        </c:choose>
                    </td>
                </c:forEach>
            </tr>
        </c:forEach>
    </table>

    <%-- Résultat final --%>
    <c:if test="${gg == 1}"><p class="win">Joueur 1 (X) gagne !</p></c:if>
    <c:if test="${gg == 2}"><p class="win">Joueur 2 (O) gagne !</p></c:if>
    <c:if test="${gg == 0 and tour == 9}"><p class="win">Match nul !</p></c:if>

    <%-- Zone 3 : formulaire affiché uniquement si la partie est en cours --%>
    <c:if test="${gg == 0 and tour lt 9}">
        <p class="info">
            Au tour du <strong>Joueur ${tour % 2 + 1}
            (${tour % 2 == 0 ? 'X' : 'O'})</strong>
        </p>

        <form method="post" action="${pageContext.request.contextPath}/morpion">
            <input type="hidden" name="plateau" value="${plateau}" />
            <input type="hidden" name="tour"    value="${tour}" />

            Ligne&nbsp;(0-2)&nbsp;:
            <input type="text" name="x" maxlength="1" />
            &nbsp;&nbsp;
            Colonne&nbsp;(0-2)&nbsp;:
            <input type="text" name="y" maxlength="1" />
            &nbsp;&nbsp;
            <input type="submit" value="Jouer" />
        </form>
    </c:if>

    <br>
    <a href="${pageContext.request.contextPath}/morpion">Nouvelle partie</a>

</body>
</html>
