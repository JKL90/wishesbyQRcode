function generateQRCode() {
    // Récupère la valeur de l'entrée utilisateur
    const text = document.getElementById('textInput').value.trim();
    const qrcodeContainer = document.getElementById('qrcode');
    const downloadBtn = document.getElementById('downloadBtn');
    const shareBtn = document.getElementById('shareBtn');

    // Vérifie si le texte est vide
    if (text === '') {
        alert("Veuillez entrer un vœu avant de générer un QR code !");
        return;
    }

    // Efface le contenu précédent (si un QR Code existe déjà)
    qrcodeContainer.innerHTML = '';

    // Génère un nouveau QR Code
    QRCode.toCanvas(document.createElement('canvas'), text, { width: 150 }, (error, canvas) => {
        if (error) {
            console.error("Erreur lors de la génération du QR Code :", error);
            alert("Une erreur est survenue lors de la génération du QR Code.");
            return;
        }

        // Ajoute le QR Code généré dans le conteneur
        qrcodeContainer.appendChild(canvas);

        // Affiche les boutons après la génération du QR Code
        shareBtn.style.display = 'inline-block';
        downloadBtn.style.display = 'inline';

        // Configure le bouton de téléchargement
        downloadBtn.onclick = () => {
            const imgURL = canvas.toDataURL("image/png");
            const link = document.createElement('a');
            link.href = imgURL;
            link.download = 'qrcode.png';
            link.click();
        };
    });
}

async function shareQRCode() {
    // Récupère le QR Code sous forme de canvas
    const qrcodeCanvas = document.querySelector('#qrcode canvas');
    if (!qrcodeCanvas) {
        alert("Veuillez générer un QR Code avant de le partager !");
        return;
    }

    try {
        // Convertit le QR Code en un blob pour le partage
        const dataURL = qrcodeCanvas.toDataURL('image/png');
        const blob = await fetch(dataURL).then(res => res.blob());

        if (navigator.canShare && navigator.canShare({ files: [new File([blob], 'qrcode.png', { type: 'image/png' })] })) {
            const file = new File([blob], 'qrcode.png', { type: 'image/png' });

            // Partage via l'API Web Share
            await navigator.share({
                files: [file],
                title: 'QR Code',
                text: 'Voici un QR Code que j’ai généré pour vous !'
            });
            console.log("Partage réussi !");
        } else {
            alert("La fonction de partage n'est pas supportée sur ce navigateur.");
            console.warn("Navigateur incompatible avec le partage via API Web Share.");
        }
    } catch (error) {
        console.error("Erreur lors du partage :", error);
        alert("Une erreur est survenue lors du partage du QR Code.");
    }
}

const worker = new Worker('worker.js');
worker.postMessage('Données à traiter');
worker.onmessage = (event) => {
  console.log('Résultat du worker :', event.data);
};


