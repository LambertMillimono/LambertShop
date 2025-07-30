// Slider accueil
let slideIndex = 0;
const slides = document.querySelectorAll('.slide');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

function showSlide(n) {
  slides.forEach((slide, i) => {
    slide.classList.toggle('active', i === n);
  });
}

function nextSlide() {
  slideIndex = (slideIndex + 1) % slides.length;
  showSlide(slideIndex);
}

function prevSlide() {
  slideIndex = (slideIndex - 1 + slides.length) % slides.length;
  showSlide(slideIndex);
}

if (prevBtn && nextBtn) {
  prevBtn.addEventListener('click', prevSlide);
  nextBtn.addEventListener('click', nextSlide);
}

// Auto défilement
setInterval(nextSlide, 5000);
showSlide(slideIndex);


"use strict";


// Navigation dynamique
const navLinks = document.querySelectorAll(".main-nav a");
const views = document.querySelectorAll(".view");

navLinks.forEach(link => {
  link.addEventListener("click", (e) => {
    e.preventDefault();

    const targetView = link.getAttribute("data-view");

    views.forEach(view => {
      if (view.id === targetView) {
        view.classList.add("active");
      } else {
        view.classList.remove("active");
      }
    });
  });
});


navLinks.forEach(link => {
  link.addEventListener("click", (e) => {
    e.preventDefault();

    // Afficher la bonne vue
    const targetView = link.getAttribute("data-view");
    views.forEach(view => {
      view.classList.toggle("active", view.id === targetView);
    });

    // Mettre en surbrillance le lien actif
    navLinks.forEach(l => l.classList.remove("active"));
    link.classList.add("active");
  });
});


"use strict";

// Données produits (catégorisées)
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

// DOM
const produitsGrid = document.getElementById("produits-grid");
const panierContenu = document.getElementById("panier-contenu");
const totalPrixElement = document.getElementById("total-prix");
const cartCount = document.getElementById("cart-count");

let panier = JSON.parse(localStorage.getItem("panier")) || [];

// Afficher les produits (optionnellement filtrés et triés)
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
  produitsAffiches.forEach((produit, index) => {
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
        <button class="add-to-cart" data-index="${index}">Ajouter au panier</button>
      </div>
    `;
  });
  initialiserBoutonsAjout();
  initialiserEtoiles();
// Gestion des étoiles de notation
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
        // Mettre à jour l'affichage
        div.querySelectorAll('.etoile').forEach((e, idx) => {
          if (idx < value) e.classList.add('active');
          else e.classList.remove('active');
        });
      });
    });
  });
}
}

// Ajouter un produit
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

// Mettre à jour le panier
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

// Changer quantité
function changerQuantite(index, delta) {
  panier[index].quantite += delta;
  if (panier[index].quantite <= 0) {
    panier.splice(index, 1);
  }
  localStorage.setItem("panier", JSON.stringify(panier));
  majPanier();
}

// Supprimer un produit
function supprimerProduit(index) {
  panier.splice(index, 1);
  localStorage.setItem("panier", JSON.stringify(panier));
  majPanier();
}

// Compteur sur l'icône panier
function mettreAJourCompteur() {
  const total = panier.reduce((acc, item) => acc + item.quantite, 0);
  cartCount.textContent = total;
  cartCount.style.display = total > 0 ? "inline-block" : "none";
}

// Écouteurs sur boutons "Ajouter au panier"
function initialiserBoutonsAjout() {
  const boutons = document.querySelectorAll(".add-to-cart");
  boutons.forEach(bouton => {
    bouton.addEventListener("click", () => {
      const index = parseInt(bouton.dataset.index);
      const produit = produits[index];
      ajouterAuPanier(produit);
    });
  });
}



// Gestion du tri des produits
const triSelect = document.getElementById('tri-select');
if (triSelect) {
  triSelect.addEventListener('change', () => {
    afficherProduits();
  });
}

// Initialisation
afficherProduits();
majPanier();

// Recherche de produits
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

// Gestion du clic sur les catégories (HTML statique)
document.querySelectorAll('.categorie-card').forEach(card => {
  card.addEventListener('click', function() {
    const nomCategorie = this.querySelector('h3').textContent.trim();
    let produitsFiltres = produits.filter(p => p.categorie === nomCategorie);
    afficherProduits(produitsFiltres);
    afficherVue('produits');
  });
});


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

const vues = document.querySelectorAll(".view");
const liens = document.querySelectorAll("[data-view]");

liens.forEach(lien => {
  lien.addEventListener("click", e => {
    e.preventDefault();
    const cible = lien.getAttribute("data-view");
    afficherVue(cible);
  });
});

function afficherVue(nomVue) {
  vues.forEach(v => v.classList.remove("active"));
  const vueActive = document.getElementById(nomVue);
  if (vueActive) vueActive.classList.add("active");
}
