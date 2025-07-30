"use strict";

// === DONNÉES PRODUITS ===
// Tableau contenant tous les produits de la boutique
const produits = [
  // Electronique
  { nom: "Ordinateur de bureau", prix: 3500000, image: "images/bureautique.jpg", categorie: "Electronique" },
  { nom: "Ordinateur portable", prix: 4500000, image: "images/laptop.jpg", categorie: "Electronique" },
  { nom: "Caméra", prix: 1200000, image: "images/Camera.jpg", categorie: "Electronique" },
  { nom: "Tablette", prix: 1800000, image: "images/Tablette.jpg", categorie: "Electronique" },
  { nom: "Casque audio", prix: 250000, image: "images/Casque.jpg", categorie: "Electronique" },
  // Homme
  { nom: "Chemise", prix: 90000, image: "images/chemise.jpg", categorie: "Homme" },
  { nom: "Jeans", prix: 120000, image: "images/jeans.jpg", categorie: "Homme" },
  { nom: "Chaussures", prix: 200000, image: "images/chaussure.jpg", categorie: "Homme" },
  { nom: "Portefeuille", prix: 50000, image: "images/PorteFeuille.jpg", categorie: "Homme" },
  // Femme
  { nom: "Robe", prix: 150000, image: "images/Robe.jpg", categorie: "Femme" },
  { nom: "Sac A Main", prix: 300000, image: "images/Sac A Main.jpg", categorie: "Femme" },
  { nom: "Collier Femme", prix: 40000, image: "images/colier.jpg", categorie: "Femme" },
  { nom: "Trousse de maquillage", prix: 60000, image: "images/kit_Maquiallage.jpg", categorie: "Femme" },
  // Bijoux
  { nom: "Boucles d’oreilles Bijoux", prix: 35000, image: "images/Boucle.jpg", categorie: "Bijoux" },
  { nom: "Bagues pour couple", prix: 50000, image: "images/Bague.jpg", categorie: "Bijoux" },
  { nom: "Bracelets", prix: 30000, image: "images/Bracelet.jpg", categorie: "Bijoux" },
  // Parfum
  { nom: "Parfum pour vêtements", prix: 70000, image: "images/ParfumVeteme.jpg", categorie: "Parfum" },
  { nom: "Déodorant", prix: 25000, image: "images/deodorants.jpg", categorie: "Parfum" },
  { nom: "Parfum floral", prix: 80000, image: "images/ParfumFloral.jpg", categorie: "Parfum" },
  { nom: "Désodorisant", prix: 20000, image: "images/Désodorisant .jpg", categorie: "Parfum" },
];


// === SÉLECTION DES ÉLÉMENTS DU DOM ===
// Sélectionne les éléments HTML pour l'affichage dynamique
const produitsGrid = document.getElementById("produits-grid"); // Grille des produits
const panierContenu = document.getElementById("panier-contenu"); // Contenu du panier
const totalPrixElement = document.getElementById("total-prix"); // Total du panier
const cartCount = document.getElementById("cart-count"); // Compteur panier

// Récupère le panier depuis le localStorage ou initialise vide
let panier = JSON.parse(localStorage.getItem("panier")) || [];


// === AFFICHAGE DES PRODUITS ===
// Affiche la liste des produits (filtrés/triés si besoin)
function afficherProduits(liste = produits) {
  if (!produitsGrid) return;
  // Appliquer le tri si le select existe
  const triSelect = document.getElementById('tri-select');
  let produitsAffiches = [...liste];
  if (triSelect) {
    const tri = triSelect.value;
    if (tri === 'prix-asc') {
      produitsAffiches.sort((a, b) => a.prix - b.prix);
    } else if (tri === 'prix-desc') {
      produitsAffiches.sort((a, b) => b.prix - a.prix);
    }
  }
  produitsGrid.innerHTML = "";
  produitsAffiches.forEach((produit) => {
    // Récupérer la note stockée pour ce produit
    const notes = JSON.parse(localStorage.getItem("notesProduits") || "{}" );
    const note = notes[produit.nom] || 0;
    let etoiles = '<div class="etoiles" data-nom="' + produit.nom + '">';
    for (let i = 1; i <= 5; i++) {
      etoiles += `<span class="etoile${i <= note ? ' active' : ''}" data-value="${i}">&#9733;</span>`;
    }
    etoiles += '</div>';
    produitsGrid.innerHTML += `
      <div class="produit">
        <div class="produit-img-bg" style="background-image:url('${produit.image}')">
          <div class="produit-img-overlay"></div>
          <div class="produit-img-content">
            <h3>${produit.nom}</h3>
            <p>${produit.prix.toLocaleString()} GNF</p>
          </div>
        </div>
        ${etoiles}
        <button class="add-to-cart" data-nom="${produit.nom.replace(/"/g, '&quot;')}">Ajouter au panier</button>
      </div>
    `;
  });
  initialiserBoutonsAjout();
  initialiserEtoiles();
  // Gestion des étoiles de notation pour chaque produit
  function initialiserEtoiles() {
    document.querySelectorAll('.etoiles').forEach(div => {
      const nomProduit = div.getAttribute('data-nom');
      div.querySelectorAll('.etoile').forEach(etoile => {
        etoile.addEventListener('click', function() {
          const value = parseInt(this.getAttribute('data-value'));
          // Sauvegarder la note en localStorage
          const notes = JSON.parse(localStorage.getItem("notesProduits") || "{}" );
          notes[nomProduit] = value;
          localStorage.setItem("notesProduits", JSON.stringify(notes));
          // Mettre à jour l'affichage des étoiles
          div.querySelectorAll('.etoile').forEach((e, idx) => {
            if (idx < value) e.classList.add('active');
            else e.classList.remove('active');
          });
        });
      });
    });
  }
}


// === AJOUTER UN PRODUIT AU PANIER ===
// Ajoute un produit au panier ou augmente la quantité si déjà présent
function ajouterAuPanier(produit) {
  const index = panier.findIndex(p => p.nom === produit.nom);
  if (index !== -1) {
    panier[index].quantite++;
  } else {
    panier.push({ ...produit, quantite: 1 });
  }
  localStorage.setItem("panier", JSON.stringify(panier));
  majPanier();
}


// === METTRE À JOUR L'AFFICHAGE DU PANIER ===
// Affiche les produits du panier et le total
function majPanier() {
  panierContenu.innerHTML = "";
  let total = 0;

  panier.forEach((item, index) => {
    const sousTotal = item.prix * item.quantite;
    total += sousTotal;

    panierContenu.innerHTML += `
      <div class="panier-item" style="display:flex;align-items:center;gap:12px;">
        <img src="${item.image}" alt="${item.nom}" style="width:54px;height:54px;object-fit:cover;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.10);">
        <div style="flex:1;">
          <p style="margin:0 0 4px 0;"><strong>${item.nom}</strong> - ${item.quantite} x ${item.prix.toLocaleString()} GNF</p>
          <p style="margin:0;">
            <button onclick="changerQuantite(${index}, -1)">-</button>
            <button onclick="changerQuantite(${index}, 1)">+</button>
            <button onclick="supprimerProduit(${index})">Supprimer</button>
          </p>
        </div>
      </div>
    `;
  });

  totalPrixElement.textContent = total.toLocaleString();
  mettreAJourCompteur();
}


// === CHANGER LA QUANTITÉ D'UN PRODUIT DANS LE PANIER ===
function changerQuantite(index, delta) {
  panier[index].quantite += delta;
  if (panier[index].quantite <= 0) {
    panier.splice(index, 1);
  }
  localStorage.setItem("panier", JSON.stringify(panier));
  majPanier();
}


// === SUPPRIMER UN PRODUIT DU PANIER ===
function supprimerProduit(index) {
  panier.splice(index, 1);
  localStorage.setItem("panier", JSON.stringify(panier));
  majPanier();
}


// === METTRE À JOUR LE COMPTEUR DU PANIER ===
// Affiche le nombre total d'articles dans le badge panier
function mettreAJourCompteur() {
  const total = panier.reduce((acc, item) => acc + item.quantite, 0);
  cartCount.textContent = total;
  cartCount.style.display = total > 0 ? "inline-block" : "none";
}


// === ÉCOUTEURS SUR LES BOUTONS "AJOUTER AU PANIER" ===
// Ajoute les produits au panier lors du clic sur les boutons
function initialiserBoutonsAjout() {
  const boutons = document.querySelectorAll(".add-to-cart");
  boutons.forEach(bouton => {
    bouton.addEventListener("click", () => {
      const nom = bouton.dataset.nom;
      const produit = produits.find(p => p.nom === nom);
      if (produit) {
        ajouterAuPanier(produit);
      }
    });
  });
  // Gestion des boutons statiques sur la page d'accueil (promos)
  document.querySelectorAll('.product-grid.accueil .add-btn').forEach((btn, idx) => {
    btn.addEventListener('click', function() {
      // Récupérer le nom du produit affiché dans la carte
      const card = btn.closest('.product-card');
      const nom = card.querySelector('h3').textContent.trim();
      // Chercher le produit correspondant dans la liste produits (par nom)
      const produit = produits.find(p => p.nom === nom);
      if (produit) {
        ajouterAuPanier(produit);
      } else {
        // Si non trouvé, créer un produit temporaire à partir du HTML
        ajouterAuPanier({
          nom: nom,
          prix: parseInt(card.querySelector('.price').textContent.replace(/[^\d]/g, '')),
          image: card.querySelector('img').getAttribute('src'),
          quantite: 1
        });
      }
    });
  });
}




// === TRI DES PRODUITS ===
// Trie les produits selon le choix de l'utilisateur
const triSelect = document.getElementById('tri-select');
if (triSelect) {
  triSelect.addEventListener('change', () => {
    afficherProduits();
  });
}


// === INITIALISATION AU CHARGEMENT ===
// Affiche les produits et le panier au chargement de la page
afficherProduits();
majPanier();


// === RECHERCHE DE PRODUITS ===
// Filtre les produits selon le texte saisi dans la barre de recherche
const searchInput = document.querySelector('.search-bar input');
const searchBtn = document.querySelector('.search-bar button');
if (searchInput) {
  function lancerRecherche() {
    const searchText = searchInput.value.trim().toLowerCase();
    if (searchText === "") {
      afficherProduits();
    } else {
      const produitsFiltres = produits.filter(p =>
        p.nom.toLowerCase().includes(searchText) ||
        (p.categorie && p.categorie.toLowerCase().includes(searchText))
      );
      afficherProduits(produitsFiltres);
    }
    afficherVue('produits');
  }
  searchInput.addEventListener('input', lancerRecherche);
  if (searchBtn) {
    searchBtn.addEventListener('click', function(e) {
      e.preventDefault();
      lancerRecherche();
    });
  }
}


// === GESTION DU CLIC SUR LES CATÉGORIES ===
// Lorsqu'on clique sur une carte catégorie, filtre les produits de cette catégorie
document.querySelectorAll('.categorie-card').forEach(card => {
  card.addEventListener('click', function() {
    const nomCategorie = this.querySelector('h3').textContent.trim();
    let produitsFiltres = produits.filter(p => p.categorie === nomCategorie);
    afficherProduits(produitsFiltres);
    afficherVue('produits');
  });
});



// === FILTRER PAR CATÉGORIE (optionnel) ===
// Permet de filtrer les produits selon une catégorie précise
function filtrerParCategorie(nomCategorie) {
  const produitsFiltres = produits.filter(p => {
    return (
      (nomCategorie === "Téléphones" && p.nom.includes("Téléphone")) ||
      (nomCategorie === "Accessoires" && (p.nom.includes("Casque"))) ||
      (nomCategorie === "Montres" && p.nom.includes("Montre")) ||
      (nomCategorie === "Chaussures" && p.nom.includes("Chaussures"))
    );
  });
  afficherProduits(produitsFiltres);
}


// === NAVIGATION ENTRE LES VUES ===
// Gère l'affichage des sections principales (accueil, catégories, produits, panier)
const vues = document.querySelectorAll(".view"); // Toutes les sections principales
const liens = document.querySelectorAll("[data-view]"); // Tous les liens de navigation

// Ajoute un écouteur sur chaque bouton du menu
liens.forEach(lien => {
  lien.addEventListener("click", e => {
    e.preventDefault();
    const cible = lien.getAttribute("data-view");
    afficherVue(cible);
    // Si Accueil, Catégories, Produits ou Panier, scroll vers le haut du main
    if (["accueil", "categories", "produits", "panier"].includes(cible)) {
      const main = document.querySelector('main');
      if (main) {
        main.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  });
});

// Affiche la section demandée et masque les autres
function afficherVue(nomVue) {
  vues.forEach(v => v.classList.remove("active"));
  const vueActive = document.getElementById(nomVue);
  if (vueActive) vueActive.classList.add("active");
}
