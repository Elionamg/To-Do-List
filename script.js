const formulaire = document.querySelector("#task-form");
const taches = document.querySelector("#task");
const liste = document.querySelector("#container");
const supp_all = document.querySelector("#supp-all");
const barre = document.querySelector("#task-bar");
const date = document.querySelector("#date");
const sauvegarde = localStorage.getItem("taches");
const mesTachesSauvegardees = JSON.parse(sauvegarde)|| []
const mesTaches = mesTachesSauvegardees;

//Afficher la date
const aujourdHui = new Date();

date.textContent = aujourdHui.toLocaleDateString("fr-FR", {
    weekday: "long", //Demande le jour de la semaine en toutes lettres.
    day: "numeric", //Demande le numéro du jour sous forme numérique.
    month: "long" //Demande le mois en toutes lettres.
});

date.textContent =
    date.textContent.charAt(0).toUpperCase() +
    date.textContent.slice(1);

//Créer le bouton supprimer
function bouton(nom, nouvelleTache){
    const btn_sup = document.createElement("button"); 

    btn_sup.type = "button";
    btn_sup.textContent = "X";

    btn_sup.addEventListener("click",(event)=>{
        event.stopPropagation() //empêche l'event actuel d'aller plus loin et donc d'engendrer un autre event
        nom.remove();
        const index = mesTaches.indexOf(nouvelleTache);
        mesTaches.splice(index,1);
        majBarre();
        localStorage.setItem("taches", JSON.stringify(mesTaches));
    })
    nom.appendChild(btn_sup);
}

//Afficher une tâche
function afficherTache(tache) {
    const nom = document.createElement("li");

    nom.textContent = tache.texte;

    if (tache.terminee) {
        nom.style.textDecoration = "line-through";
    }

    nom.addEventListener("click", () => {
        if (tache.terminee) {
            nom.style.textDecoration = "none";
            tache.terminee = false;
        } else {
            nom.style.textDecoration = "line-through";
            tache.terminee = true;
        }

        localStorage.setItem("taches", JSON.stringify(mesTaches));
        majBarre();
    });

    bouton(nom, tache);
    liste.appendChild(nom);
}

//Ajouter une nouvelle tâche
formulaire.addEventListener("submit",(event)=>{
event.preventDefault(); //permet d'empêcher l'envoie du formulaire
    
    if(taches.value.trim() === ""){ // permet de supprimer les espaces vide et donc de vérifier que le champs n'est pas un espace vide avant de l'ajouter
        return //early return si le champ est vide j'arrête tout de suite sinon je continue normalement, pas besoin de else
    }
    
   const nouvelleTache = {
        texte:taches.value.trim(),
        terminee: false
    };
    
    mesTaches.push(nouvelleTache);
    afficherTache(nouvelleTache);
    localStorage.setItem("taches", JSON.stringify(mesTaches));
    majBarre();
    taches.value="";

}); 
    
//Tout supprimer
supp_all.addEventListener("click",(event)=>{
    liste.innerHTML = "";
    mesTaches.length = 0;

    majBarre();

    localStorage.setItem("taches", JSON.stringify(mesTaches));
});


//Mettre à jour la barre de progression
function majBarre(){
    const allLi = liste.querySelectorAll("li");
    let terminees = 0;
    for (const element of allLi) {
        if(element.style.textDecoration === "line-through"){
                terminees +=1;
            }
    }
    if (allLi.length === 0) {
        barre.style.width = "0%";
    } else {
        barre.style.width = terminees / allLi.length * 100 + "%";
    }
}

//Restaurer les tâches sauvegardées
for (const element of mesTaches) {
    afficherTache(element)
}

majBarre();
