function openJigsawPuzzle() {
    const imageURL = 'https://www.itaste.com/wp-content/uploads/2020/08/iTaste-la-tour-du-molard-bar-a-vin-302-1598432102.jpg'; // Remplacez cette URL par l'URL de votre image
    const output = document.getElementById('output');
    const successMessage = document.getElementById('success-message');

    if (output && successMessage) {
        const jigsaw = new Jigsaw(imageURL, output, successMessage);
    } else {
        console.error("Output or success message element not found. Puzzle cannot be initialized.");
    }
}

class Jigsaw {
    constructor(imageURL, output, successMessage) {
        this.image = new Image();
        this.image.onload = () => {
            this.imageWidth = this.image.width;
            this.imageHeight = this.image.height;
            this.pieceWidth = this.imageWidth / 3; // Largeur de chaque pièce
            this.pieceHeight = this.imageHeight / 3; // Hauteur de chaque pièce
            this.pieceCount = 9; // Nombre total de pièces
            this.output = output;
            this.createdPieces = []; // Tableau pour stocker les pièces créées
            this.successMessage = successMessage; // Stocker la référence à l'élément du message de réussite
            this.correctLayout = this.generateCorrectLayout(); // Générer les coordonnées correctes du puzzle
            this.generateRandomLayout(); // Générer la disposition des pièces
        };
        this.image.onerror = (error) => {
            console.error("Error loading image:", error);
        };
        this.image.src = imageURL;
        this.successMessageDisplayed = false; // Indicateur pour éviter l'affichage multiple du message BRAVO
    }

    generateCorrectLayout() {
        // Générer les coordonnées correctes du puzzle
        const correctLayout = [];
        for (let y = 0; y < 3; y++) {
            for (let x = 0; x < 3; x++) {
                correctLayout.push({ x: x * this.pieceWidth, y: y * this.pieceHeight });
            }
        }
        return correctLayout;
    }

    checkPuzzleSolved() {
        let isPuzzleSolved = true;
        // Vérifier si les pièces sont correctement placées en utilisant les marqueurs
        for (let i = 0; i < this.createdPieces.length; i++) {
            const piece = this.createdPieces[i];
            const correctPosition = this.correctLayout[i];
            // Vérifier si la position de la pièce correspond à la position correcte avec une marge d'erreur
            if (Math.abs(piece.x - correctPosition.x) > 5 || Math.abs(piece.y - correctPosition.y) > 5) {
                isPuzzleSolved = false;
                break;
            }
        }
        if (isPuzzleSolved && !this.successMessageDisplayed) {
            console.log("check over"); // Afficher dans la console lorsque la vérification du puzzle est terminée
            this.successMessageDisplayed = true;
            this.successMessage.innerText = "BRAVO :)";
            this.successMessage.style.fontSize = "24px";
            this.successMessage.style.fontWeight = "bold";
            this.successMessage.style.display = 'block';
        }
    }

    generateRandomLayout() {
        // Découper l'image en 9 pièces et les placer correctement
        const pieceIDs = Array.from({ length: 9 }, (_, index) => index); // Identifiants uniques pour les pièces
        pieceIDs.sort(() => Math.random() - 0.5); // Mélanger les identifiants
        for (let y = 0; y < 3; y++) {
            for (let x = 0; x < 3; x++) {
                const pieceID = pieceIDs.pop(); // Prendre l'identifiant de la pièce suivante
                const newPiece = new Piece(this.image, x, y, this, pieceID); // Passer l'identifiant à la pièce
                newPiece.canvas.style.position = 'absolute';
                newPiece.canvas.style.left = x * this.pieceWidth + 'px';
                newPiece.canvas.style.top = y * this.pieceHeight + 'px';
                this.output.appendChild(newPiece.canvas);
                this.createdPieces.push(newPiece);
            }
        }
    }
}

class Piece {
    constructor(image, x, y, jigsaw, id) {
        this.canvas = document.createElement('canvas');
        this.canvas.width = jigsaw.pieceWidth;
        this.canvas.height = jigsaw.pieceHeight;
        this.ctx = this.canvas.getContext('2d');
        this.x = x * jigsaw.pieceWidth; // Coordonnée x relative à l'image originale
        this.y = y * jigsaw.pieceHeight; // Coordonnée y relative à l'image originale
        this.jigsaw = jigsaw;
        this.id = id; // Identifiant de la pièce
        this.order = [0, 1, 2, 3, 4, 5, 6, 7, 8]; // Ordre prédéfini des pièces

        // Dessiner la pièce correspondante à l'indice actuel dans l'ordre prédéfini
        this.drawPiece();

        // Ajouter un gestionnaire d'événement de clic
        this.canvas.addEventListener('click', () => this.onClick());
    }

    onClick() {
        // Passer à la pièce suivante dans l'ordre prédéfini
        this.order.push(this.order.shift());
        // Effacer le contenu actuel du canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        // Dessiner la nouvelle pièce
        this.drawPiece();

        // Vérifier si le puzzle est résolu à chaque clic
        this.jigsaw.checkPuzzleSolved();
    }

    drawPiece() {
        const pieceIndex = this.order[0];
        const xOffset = pieceIndex % 3 * this.jigsaw.pieceWidth;
        const yOffset = Math.floor(pieceIndex / 3) * this.jigsaw.pieceHeight;
        this.ctx.drawImage(this.jigsaw.image, xOffset, yOffset, this.jigsaw.pieceWidth, this.jigsaw.pieceHeight, 0, 0, this.canvas.width, this.canvas.height);
    }
}

// Appel initial de la fonction pour démarrer le puzzle
openJigsawPuzzle();
