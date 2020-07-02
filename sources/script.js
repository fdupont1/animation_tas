window.onload = init;
/**
 * Pour tester le fonctionnement de tas binaire.
 * */

/**
 * Tableau à une dimension structure des données du tas.
 */
var listTas = [3, 5, 6,6,5, 10, 11, 12, 13, 20, 21, 22, 23, 24 ,25,15,4,8,5,3,5,6,8,6,7,8,5,4,6,78,5];

var min;

var height = 50;

var canvas;

var text = document.getElementById('text');

// pour animation
/** Tableau contenant les étapes de l'animation sous forme de couple des noeuds échangés */ 
var changeStep = [];
var tasCopy = [];
var p0;
var p1;
var vx;
var vy;
var compteur = 0;
var debut = true;

/** 
 * Pour créer le contexte du canvas et les objets Tas et Tableau.
 * Cette fonction doit-être appelée une fois la page complètement
 * chargée.
 * */
function init() {
  canvas = document.getElementById('listAnimation');
    if(!canvas) {
        alert("Impossible de récupérer le canvas");
        return;
    }
  ctx = canvas.getContext('2d');
    if(!ctx) {
        alert("Impossible de récupérer le context du canvas");
        return;
    }
  ctx.textAlign = 'center';
  Tableau.init()
  Tableau.draw(20, canvas.height-95);
  Tas.init();
  Tas.draw(0);
  }

/**
* Objet : Tas
* Gestion de la représentation graphique du tas.
 * @author François Dupont
* @constructor
*/
var Tas = {

  /** Tableau des coordonnées des noeuds du tas sur le canvas */
  nodeXY: [],  
  // paramètres des noeuds et espacements
  nodeRadius: 15,
  spaceHeight:50,
  height: 0,
  nodeFillColor: "silver",
  valueColor: "blue",
  padX: 4,
  padY: 10,

  /**
  * Initialisation du tas : calcul des coordonnées des noeuds et
  * insertion dans un tableau : nodeXY
  */     
  init: function() {
    
    var width = canvas.width - 2*this.padX;
    var height = canvas.height - 2*this.padY
    
    for (var e=0; e<5; e++) {
      decX = width/(2**(e+1));
      x = Math.round(decX);
      y = this.padY+e*this.spaceHeight;
      for (var l=1; l<(2**e)+1; l++) {
        this.nodeXY.push([this.padX+x, this.padY+y]);
        x += 2*decX;  
      }
    } 
  },

  /**
  * Dessine un sous tas à partir de l'index d'un noeud sans dessiner la
  * racine et de manière récursive.
  *  
  * @param {int} index Index du noeud raine du sous-tas.
  */     
  draw: function(index) {
    // if not leaf, draw son
    if (2*index+1 < listTas.length) {
      // left son
      var fg = this.draw(2*index+1)
      this.drawEdge(index, fg);
      this.drawNodeXY(this.nodeXY[fg], fg, listTas[fg]);
      // if right son
      if (2*index+2 < listTas.length) {
        var fd = this.draw(2*index+2);
        this.drawEdge(index, fd);
        this.drawNodeXY(this.nodeXY[fd], fd, listTas[fd]);
        }
      }
    if (listTas.length > 0 && index<1) {
      this.drawNodeXY(this.nodeXY[index], index, listTas[index]);
      }
    
    return index;
    },
    
  /**
  * Efface et redessine le tas.
  */     
  refresh: function() {
    ctx.clearRect(0,0, canvas.width, 5*this.spaceHeight);
    this.draw(0);
   },

  /**
   * Dessine un lien entre deux positions dans la liste.
   * @param {int} index1 Index du premier noeud
   * @param {int} index2 Index du second noeud
   */    
  drawEdge: function(index1, index2) {
    var pos1 = this.nodeXY[index1];
    var pos2 = this.nodeXY[index2];
    ctx.beginPath();
    ctx.moveTo(pos1[0], pos1[1]);
    ctx.lineTo(pos2[0], pos2[1]);
    ctx.stroke();
    },

  /**
   * Efface un noeud correspondant à l'index de la position dans la liste.
   * @param {Array} pos Tableau de deux entier représentant les coordonnées x et y du noeud à effacer
   */     
  clearNodeXY: function(pos) {
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(pos[0], pos[1], this.nodeRadius, 0, 2 * Math.PI);
    ctx.fill();
    },

  /**
   * Dessine un noeud sur le canvas.
   * @param {Array} pos Tableau de deux entier représentant les coordonnées x et y du noeud
   * @param {Int} index Index de la position du noeud dans la liste.
   * @param {Int} value Valeur du noeud
   * @param {Color} color Couleur du noeud, par défaut la couleur défini lors de la création de l'objet Tas
   */     
  drawNodeXY: function(pos,index, value, color = this.nodeFillColor) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(pos[0], pos[1], this.nodeRadius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(pos[0], pos[1], this.nodeRadius, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.font = "16px Helvetica";
    ctx.fillStyle = this.valueColor;
    ctx.fillText(value, pos[0], pos[1]+5);
    ctx.font = "10px Helvetica";
    ctx.fillStyle = "#0095DD";
    ctx.fillText(index, pos[0], pos[1]+28);
    }  
  }

/**
* Objet : Tableau
* Gestion de la représentation graphique du tableau représentant le tas. 
* @constructor
*/   
var Tableau = {

  xTableau: 0,
  yTableau: 0,
  height: height = 25,
  cellWidth: cellWidth = 25,
  cellPadding: cellPadding = 1,
  valueColor: "blue",

  /**
   * Initialise les paramètres du tableau liés au contexte du canvas.
   */  
  init: function() {
    ctx.lineWidth = 2;
    this.cellPadding = cellPadding+ctx.lineWidth;
    },

  /**
   * Dessine le tableau du tas à un emplacement déterminé sur le canvas.
   * @param {Int} x Coordonnée sur x du début de la liste
   * @param {Int} y Coordonnée sur y du début de la liste
   */      
  draw: function (x, y) {
    this.xTableau = x;
    this.yTableau = y;
    for (var c=0; c < listTas.length; c++) {
      this.drawCell(c);
      }
    },

  /**
   * Dessine une cellule du tableau du tas à partir de son index.
   * @param {Int} index Index de la position du noeud dans la liste.
   */       
  drawCell: function(index) {
    var x;
    var y;
    if (index>14) {
      x = (index-15)*(cellWidth + this.cellPadding)+this.xTableau;
      y = this.yTableau+47;
    }
    else {
      x = index*(cellWidth + this.cellPadding)+this.xTableau;
      y = this.yTableau;
    }
    ctx.strokeRect(x, y, this.height, this.height);
    ctx.font = "18px Helvetica";
    ctx.fillStyle = this.valueColor;
    ctx.fillText(listTas[index], x+this.height/2, y+this.height*0.7);
    ctx.fillStyle = "#0095DD";
    ctx.font = "12px Helvetica";
    ctx.fillText(index, x+this.height/2, y+38);
    },
 
   /**
   * Efface le tableau.
   */    
  clear: function() {
    ctx.clearRect(this.xTableau-10, this.yTableau-10 , 480,200);
    }, 
 
   /**
   * Efface une cellule du tableau à partir de son index.
   * @param {Int} index Index de la position du noeud dans la liste.
   */     
  clearCell: function(index) {
    x = index*(cellWidth + this.cellPadding)+this.xTableau-ctx.lineWidth;
    ctx.clearRect(x + ctx.lineWidth/2, this.yTableau - ctx.lineWidth/2 ,
     this.height+ctx.lineWidth, this.height+ctx.lineWidth + 18);
    },

   /**
   * Efface la valeur contenue dans une cellule du tableau à partir de 
   * son index.
   * @param {Int} index Index de la position du noeud dans la liste.
   */     
  clearValue: function(index) {
    x = index*(cellWidth + this.cellPadding)+this.xTableau;
    ctx.clearRect(x + ctx.lineWidth/2, this.yTableau+ ctx.lineWidth/2 ,
     dim-ctx.lineWidth, dim-ctx.lineWidth);
    },

  /** 
   * Insère et affiche un nouveau noeud en fin de tas.
   * @param {int} value Un nombre entier.
   */      
  push: function(value) {
    listTas.push(value);
    this.drawCell(listTas.length-1);
    },

  /** 
   * Actualise l'affichage du tableau.
   */    
  refresh: function() {
    this.clear();
    this.draw(20, canvas.height-95);
    }
  }

/** 
 * Affiche une chaîne de caractères dans la fenêtre de log.
 * @param {string} message Chaîne de caractère à afficher.
 */
function printLog(message) {
  var log = document.getElementById('log');
  log.innerHTML += "> " + message + "<br>";
  document.getElementById('log').scrollTop = document.getElementById('log').scrollHeight;
}

/** Supprime le dernier noeud du tas. */
function listPop() {
  if (listTas.length > 0) {
    printLog("suppression liste :");
    printLog("<s>["+(listTas.length-1)+"]</s>");
    listTas.pop();
    Tas.refresh();
    Tableau.refresh();
    }
  };

/** Insère la valeur de l'élément HTML 'valuePush' en fin de tas. */
function push() {
  let temp = document.getElementById('valuePush').value
  Tableau.push(parseInt(temp));
  Tas.refresh();
  printLog("insertion liste :");
  printLog(temp+"-> ["+(listTas.length-1)+"]");
  }

/** Converti une chaîne de caractère au format '1, 2, 3' ou '[1,2,3]'
 * en tableau à une dimension
 * @param {string} list Chaîne de caractères représenatant un tableau d'entier.
 * @return Un tableau d'entier à une dimension.
 * */
function parseTableau(list) {
  list = list.split(",");
  // delete first [ if exist
  if (list[0][0] == '[') {
    list[0] = list[0].replace('[','');
    }
  // delete last ] if exist
  if (list[list.length-1][list[list.length-1].length-1] == ']') {
    list[list.length-1] = list[list.length-1].replace(']','');
    }
  for (var c=0; c < list.length; c++) {
    list[c] = parseInt(list[c]);
    }
  return list
  }

/** Créer et affiche un nouveau tas à partir de la chaîne de caractères 
 * contenue dans l'élément HTML 'listCreate'
 */
function create() {
  var list = document.getElementById('listCreate').value;
    list = parseTableau(list);
    listTas = list;
    Tableau.refresh();
    Tas.refresh();
    printLog("création tas :");
    printLog("-> ["+listTas+"]");
  }

/** Mélange les valeurs du tas existant. */
function shuffle() {
  printLog("Mélange tas");
  var temp = [];
  var copy = listTas.slice();
  for (var i=0; i<listTas.length; i++) {
    temp.push(copy.splice(Math.floor(Math.random() * copy.length),1)[0]);
  }
  listTas = temp;
  Tableau.refresh();
  Tas.refresh();
}

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

/**
 * Vérification du tas et mise en évidence des noeuds non tasser par changement de couleur
 */
function verifyTas() {
  printLog("Vérification tas :");
  // on parcours
  let pileOk = true;
  for (var i=0; i<((listTas.length-1)/2)|0; i++) {
    let nodeOk = true;
    if ((listTas[i] > listTas[2*i+2]) || (listTas[i] > listTas[2*i+1])) {
      printLog("noeud ["+i+"] faux");
      nodeOk = false;
      pileOk = false;
      Tas.drawNodeXY(Tas.nodeXY[i], i, listTas[i], "#ff9078");
    }
    console.log("noeud",i,nodeOk);
  }
  var verify = document.getElementById('verifyButton');
  if (pileOk==false) {
    printLog("pas un tas");
    verify.innerHTML = ('<INPUT style="background-color: #ff9078;" type="button" value="vérifier" onClick="javascript:verifyTas()">  <span>Vérifier si la liste est un tas</span>')
  }
  else {
    printLog("est un tas");
    verify.innerHTML = ('<INPUT type="button" value="vérifier" onClick="javascript:verifyTas()">  <span>Vérifier si la liste est un tas</span>')
  }
  console.log("tas",pileOk);
}

/**
 * Animation : extrait le minimum du tas, la dernière valeur du tas est mise au sommet
 * et tasse le tas.
 */
 function extractMin() {
  
  printLog("extraction minimum :");
  // la liste contient plus d'un élément
  if (listTas.length > 1) {

    compteur = 0;
    // on déplace le dernier à la racine
    listTas[0] = listTas.pop();
    console.log(listTas);
    // on travail sur une copie
    tasCopy = listTas.slice();
    // on enregistre les déplacements de l'algo en l'executant à blanc
    // sur la copie  
    var n=0;
    var m;
    while (n*2+1 < tasCopy.length && tasCopy[n] > tasCopy[n*2+1]) {
      if (n*2+2<tasCopy.length && tasCopy[n*2+1]>tasCopy[n*2+2]) {
        m = n*2+2;
      }
      else {
        m = n*2+1;
      }
      var temp = tasCopy[n];
      tasCopy[n] = tasCopy[m];
      tasCopy[m] = temp;
      // enregistrement echange
      changeStep.push([m,n]);
      console.log("indice échangés",n,"<->",m); 
      n = m; 
    }
    console.log("liste changement",changeStep);
    
    // si il y'a des échanges
    if (changeStep.length > 0) {
      // on défini les 2 noeuds du premier échange
      p0 = Tas.nodeXY[changeStep[compteur][0]].slice();
      p1 = Tas.nodeXY[changeStep[compteur][1]].slice();
      // calcul du pas de déplacement
      var distance = ((p1[0]-p0[0])**2+(p1[1]-p0[1])**2)**0.5;
      vx = (p1[0]-p0[0])/distance;
      vy = (p1[1]-p0[1])/distance;
      // on lance l'animation
      raf = window.requestAnimationFrame(exchange);
    }
    Tas.refresh();
  }
  else {
    listTas.pop();
    Tas.refresh();
  }
 }
 
/**
 * Animation : tasse le tas complet.
 */
function packTas() {
  console.log("lancement animation packTas");
  printLog("tasser tas :");
  compteur = 0;
  // on travail sur une copie
  tasCopy = listTas.slice();
  // on enregistre les déplacements de l'algo en l'executant à blanc
  // sur la copie
  
  for (var i=0; i<listTas.length/2; i++) {
    pack(((listTas.length/2)|0)-(i+1));
  }
  console.log("liste changement",changeStep);
  // si il y'a des échanges
  if (changeStep.length > 0) {
    // on défini les 2 noeuds du premier échange
    p0 = Tas.nodeXY[changeStep[compteur][0]].slice();
    p1 = Tas.nodeXY[changeStep[compteur][1]].slice();
    // calcul du pas de déplacement
    var distance = ((p1[0]-p0[0])**2+(p1[1]-p0[1])**2)**0.5;
    vx = (p1[0]-p0[0])/distance;
    vy = (p1[1]-p0[1])/distance;
    // on lance l'animation
    raf = window.requestAnimationFrame(exchange);
  }
// pas d'échange
}

/**
 * Animation : tasse un noeud particulier repéré pas son index dans la liste.
 */
function packNode() {
  console.log("lancement animation pack");
  // on récupère l'indice du noeud
  node = parseInt(document.getElementById('indexPackNode').value);
  printLog("tasser noeud :");
  // possible : le noeud existe ?
  if (node < listTas.length) {

    compteur = 0;
    // on travail sur une copie
    tasCopy = listTas.slice();
    // on enregistre les déplacements de l'algo en l'executant à blanc
    // sur la copie
    // appel de pack récursif
    pack(node);
    
    console.log("liste changement",changeStep);
      
    // si il y'a des échanges
    if (changeStep.length > 0) {
      // on défini les 2 noeuds du premier échange
      p0 = Tas.nodeXY[changeStep[compteur][0]].slice();
      p1 = Tas.nodeXY[changeStep[compteur][1]].slice();
      // calcul du pas de déplacement
      var distance = ((p1[0]-p0[0])**2+(p1[1]-p0[1])**2)**0.5;
      vx = (p1[0]-p0[0])/distance;
      vy = (p1[1]-p0[1])/distance;
      // on lance l'animation
      raf = window.requestAnimationFrame(exchange);
    }
  // pas d'échange
  }
}

/**
* Fonction récursive permettant de tasser le tas.
* @param {Int} index Index de la position du noeud dans la liste.
*/
function pack(index) {
  if (index*2+2 < tasCopy.length) {
    if (tasCopy[index*2+2] < tasCopy[index] && tasCopy[index*2+2] < tasCopy[index*2+1]) {
      var temp = tasCopy[index];
      tasCopy[index] = tasCopy[index*2+2];
      tasCopy[index*2+2] = temp;
      // enregistrement echange
      changeStep.push([index*2+2,index]);
      console.log("indice échangés",index,"<->",index*2+2);
      pack(index*2+2);
      return
      }
  }
  // fils gauche
  if (index*2+1 < tasCopy.length) {
    if (tasCopy[index*2+1] < tasCopy[index]) {
      console.log(index, '<->', index*2+1);
      var temp = tasCopy[index];
      tasCopy[index] = tasCopy[index*2+1];
      tasCopy[index*2+1] = temp;
      // enregistrement echange
      changeStep.push([index*2+1,index]);
      console.log("indice échangés",index,"<->",index*2+1);
      pack(index*2+1);
      return
      }
    }
  return index
  }

/**
* Animation : Insertion d'une valeur entière en fin de liste et on tasse le tas.
*/
function insert() {
  console.log("lancement animation insert");
  // possible si on dépasse pas la limite de liste imposée
  // et qu'on insere pas la racine (seule insertion possible sans avoir
  // à faire d'échange
  if (listTas.length < 31 && listTas.length > 0) {

    compteur = 0;
    // on insere la nouvelle valeur dans la liste
    let temp = document.getElementById('valueInsert').value;
    listTas.push(parseInt(temp));
    printLog("insertion tas :");
    printLog(temp+" -> ["+(listTas.length-1)+"]");
    Tableau.refresh();
    // on travail sur une copie
    tasCopy = listTas.slice();
    // on enregistre les déplacements de l'algo en l'executant à blanc
    // sur la copie
      
    var n = tasCopy.length-1;
    var p = ((n-1)/2)|0;
    while (n > 0 && tasCopy[p] > tasCopy[n]) {
      // enregistrement echange
      changeStep.push([n,p]);
      console.log("indice échangés",n,"<->",p);
      let temp = tasCopy[n];
      tasCopy[n] = tasCopy[p];
      tasCopy[p] = temp;
      n = p
      p = ((n-1)/2)|0;
      
      console.log("liste changement",changeStep);  
    }
    
    // si il y'a des échanges
    if (changeStep.length > 0) {
      // on défini les 2 noeuds du premier échange
      p0 = Tas.nodeXY[changeStep[compteur][0]].slice();
      p1 = Tas.nodeXY[changeStep[compteur][1]].slice();
      // calcul du pas de déplacement
      var distance = ((p1[0]-p0[0])**2+(p1[1]-p0[1])**2)**0.5;
      vx = (p1[0]-p0[0])/distance;
      vy = (p1[1]-p0[1])/distance;
      // on lance l'animation
      raf = window.requestAnimationFrame(exchange);
    }
  }
  // si cas nouvelle racine
  if (listTas.length < 1) {
    // on met la liste à jour
    listTas.push(parseInt(document.getElementById('text').value));
  }
  // sinon rien à montrer

  Tas.refresh();
  return
}

/**
* Animation de l'échange de deux noeuds.
*/
function exchange() {
  // on efface
  ctx.clearRect(0, 0, 500, 250);
  // on dessine le décor fixe
  // dessin des liens
  for (var i =0; i < listTas.length; i++) {
    // si fils gauche
    if (i*2+1<listTas.length) {
      Tas.drawEdge(i,i*2+1);
      // si fils droit
      if  (i*2+2<listTas.length) {
        Tas.drawEdge(i,i*2+2);
      }
    }
    // on efface les liens sous les noeuds qui bougent
    if (i==changeStep[compteur][0] || i==changeStep[compteur][1]) {
      Tas.clearNodeXY(Tas.nodeXY[i]);
    }
    else {
      // on affiche les noeuds qui bougent pas
      Tas.drawNodeXY(Tas.nodeXY[i], i, listTas[i]); 
    }   
  }

  // dessin des noeuds echanges
  Tas.drawNodeXY(p0, changeStep[compteur][0], listTas[changeStep[compteur][0]], "green");
  Tas.drawNodeXY(p1, changeStep[compteur][1], listTas[changeStep[compteur][1]], "green");
  // calcul de la nouvelle position
  p0[0] += vx;
  p0[1] += vy;
  p1[0] -= vx;
  p1[1] -= vy;
  
  // gestion fin du déplacement
  // test fin déplacement
  if (p0[1] <= Tas.nodeXY[changeStep[compteur][1]][1]) {
	console.log('fin animation', compteur);
	
	// on met à jour la liste
	var temp = listTas[changeStep[compteur][0]];
	listTas[changeStep[compteur][0]] = listTas[changeStep[compteur][1]];
	listTas[changeStep[compteur][1]] = temp;
	Tableau.refresh();
  printLog("["+changeStep[compteur][0]+"] <-> ["+changeStep[compteur][1]+"]");
	console.log('tas :', listTas);

	// on passe à l'echange suivant
	compteur += 1;
	// si il reste des echanges
	if (compteur < changeStep.length) {
	  p0 = Tas.nodeXY[changeStep[compteur][0]].slice();
	  p1 = Tas.nodeXY[changeStep[compteur][1]].slice();
	  // calcul du pas de déplacement
	  var distance = ((p1[0]-p0[0])**2+(p1[1]-p0[1])**2)**0.5;
	  vx = (p1[0]-p0[0])/distance;
	  vy = (p1[1]-p0[1])/distance;
	  // dessin des noeuds echanges
	  Tas.drawNodeXY(p0, changeStep[compteur][0], listTas[changeStep[compteur][0]]);
	  Tas.drawNodeXY(p1, changeStep[compteur][1], listTas[changeStep[compteur][1]]);
	  p0[0] += vx;
	  p0[1] += vy;
	  p1[0] -= vx;
	  p1[1] -= vy;
	  sleep(700);
	  raf = window.requestAnimationFrame(exchange);
	}
	// sinon  FIN de l'animation
	else {
	  // vide la liste des échanges
	  changeStep = [];
	  debut=true;
	  Tas.refresh();
	  console.log("fin animation");
	  return
	}  
  }
  else {
  // on continue l'animation
  raf = window.requestAnimationFrame(exchange);
  }  
}

