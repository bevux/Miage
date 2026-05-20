// ================================================================
// SERVLET : traitement
// Rôle : recevoir les données du formulaire (nom + prénom),
//        les stocker comme attributs, puis afficher la vue de
//        confirmation (vue2.jsp).
//
// C'est la servlet la plus importante à comprendre :
// elle illustre le flux complet d'un formulaire HTML.
//
// Flux :
//   1. L'utilisateur remplit le formulaire (formulaire.jsp)
//   2. Il clique "OK" → le navigateur envoie une requête POST
//   3. Cette servlet reçoit les données (doPost)
//   4. Elle les stocke dans le request (setAttribute)
//   5. Elle forward vers vue2.jsp qui les affiche
// ================================================================
package com;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebServlet("/traitement")
public class traitement extends HttpServlet {

    private static final long serialVersionUID = 1L;

    public traitement() {
        super();
    }

    // GET : si quelqu'un accède à /traitement directement via l'URL,
    // on lui répond juste "Served at : ..." (comportement par défaut).
    // En pratique, cette servlet est appelée en POST via le formulaire.
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.getWriter().append("Served at: ").append(request.getContextPath());
    }

    // ================================================================
    //  doPost : traitement du formulaire HTML
    //
    //  Quand l'utilisateur soumet le formulaire avec method="post",
    //  le navigateur envoie une requête POST avec les données en corps
    //  de requête (invisibles dans l'URL, plus sécurisé que GET).
    //
    //  ⚡ ASTUCE : Toujours utiliser POST pour les formulaires qui
    //              envoient des données sensibles (mots de passe, etc.)
    //              ou qui modifient des données côté serveur.
    // ================================================================
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        // On récupère les valeurs saisies dans le formulaire.
        // "nom" et "prenom" correspondent aux attributs name="" des champs <input>.
        String nom    = request.getParameter("nom");
        String prenom = request.getParameter("prenom");

        // On stocke ces valeurs comme attributs du request.
        // La vue JSP (vue2.jsp) les récupèrera avec request.getAttribute().
        //
        // ⚡ ASTUCE : Toujours stocker les données dans des attributs avant
        //             de faire un forward. Cela respecte la séparation MVC :
        //             la servlet prépare les données, le JSP les affiche.
        request.setAttribute("nom",    nom);
        request.setAttribute("prenom", prenom);

        // On transfère vers vue2.jsp pour afficher le résultat.
        this.getServletContext()
            .getRequestDispatcher("/WEB-INF/vue2.jsp")
            .forward(request, response);
    }
}
