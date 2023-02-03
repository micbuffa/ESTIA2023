import { joueur } from './joueur.js';
import { tableauDesObstacles, creerDesObstaclesLevel1, dessinerLesObstacles } from './obstacles.js';
import { ajouteEcouteurSouris, ajouteEcouteursClavier, inputState, mousePos } from './ecouteurs.js';

let canvas, ctx;

// Bonne pratique : on attend que la page soit chargée
// avant de faire quoi que ce soit
window.onload = init;


function init(event) {
    console.log("Page chargée et les éléments HTML sont prêts à être manipulés");
    canvas = document.querySelector('#myCanvas');
    //console.log(canvas);
    // pour dessiner, on utilise le contexte 2D
    ctx = canvas.getContext('2d');

    // On va prendre en compte le clavier
    ajouteEcouteursClavier();
    ajouteEcouteurSouris();

    creerDesObstaclesLevel1();

    requestAnimationFrame(animationLoop);

}


var y = 0;
function animationLoop() {
    // On va exécuter cette fonction 60 fois par seconde
    // pour créer l'illusion d'un mouvement fluide
    // 1 - On efface le contenu du canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 2 - On dessine le nouveau contenu
    joueur.draw(ctx);
    dessinerLesObstacles(ctx);

    // 3 - on déplace les objets
    if(inputState.left) joueur.vx = -5; else joueur.vx = 0;
    if(inputState.right) joueur.vx = 5; else joueur.vx = 0;  
    if(inputState.up) joueur.vy = -5; else joueur.vy = 0;
    if(inputState.down) joueur.vy = 5; else joueur.vy = 0; 

    joueur.move();
    //joueur.followMouse()
    joueur.testeCollisionAvecBordsDuCanvas(canvas.width, canvas.height);
    detecteCollisionJoueurAvecObstacles()

    // 4 - On rappelle la fonction d'animation
    requestAnimationFrame(animationLoop);
}



function exempleDessin() {
    ctx.lineWidth = 20
    ctx.strokeStyle = 'green';
    ctx.strokeRect(10, y, 100, 150);

    ctx.fillStyle = 'rgba(200, 0, 0, 0.5)';
    ctx.fillRect(0, 10, 50, 70);

    ctx.lineWidth = 2
    ctx.font = "130px Arial";
    ctx.fillText("Hello", 190, 100);
    ctx.strokeText("Hello", 190, 100);

    // Les rectangles avec strokeRect et fillRect sont en mode "immédiat"
    // les cercles, lignes, courbes, sont en mode "bufférisé" ou "chemin" (path)
    // On commence par définir le chemin et à la fin tout le chemin est dessiné
    // d'un coup dans le GPU
    ctx.beginPath();
    ctx.arc(200, 200, 50, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(400, 200, 50, 0, Math.PI * 2);
    ctx.stroke();

    // 3 - On déplace les objets, on regarde ce que fait le joueur avec la souris, etc.
    // On teste les collisions etc... bref, on change l'état des objets graphiques à dessiner
    y += 0.1;
}



function detecteCollisionJoueurAvecObstacles() {
    let collisionExist = false;
    // On va tester si le joueur est en collision avec un des obstacles
    tableauDesObstacles.forEach(o => {
        if (rectsOverlap(joueur.x, joueur.y, joueur.l, joueur.h, o.x, o.y, o.l, o.h)) {
            collisionExist = true;
        } 
    });
    if(collisionExist) {
        joueur.couleur = 'red';
    } else {
        joueur.couleur = 'green';
    }
}

// Collisions between aligned rectangles
function rectsOverlap(x1, y1, w1, h1, x2, y2, w2, h2) {

    if ((x1 > (x2 + w2)) || ((x1 + w1) < x2))
        return false; // No horizontal axis projection overlap
    if ((y1 > (y2 + h2)) || ((y1 + h1) < y2))
        return false; // No vertical axis projection overlap
    return true;    // If previous tests failed, then both axis projections
    // overlap and the rectangles intersect
}