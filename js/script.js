// Ce fichier contient le code JavaScript pour l'application.
// Il gère l'interactivité et les comportements dynamiques de la page.

// Configuration des prix
const PRICES = {
	mains: {
		gel: {
			poseComplete: 70,
			remplissage: 48,
			kapping: 40,
			depose: 30,
		},
		semi: {
			semiPermanent: 38,
			depose: 30,
		},
		vernis: {
			beauteDesMains: 30,
		},
	},
	pieds: {
		gel: {
			posePieds: 40,
			depose: 25,
		},
		semi: {
			semiPermanent: 35,
			depose: 25,
		},
		vernis: {
			beauteDesPieds: 35,
			spaDesPieds: 50,
		},
	},
	supplements: {
		limageVernisPieds: 15,
		limageVernisMains: 15,
		babyBoomer: 10,
		strassStickers: 1,
	},
	nailArt: {
		pricePerNail: 2,
	},
};

// Classe principale pour gérer l'application
class PlaquetteDigitale {
	constructor() {
		this.init();
	}

	init() {
		this.setupEventListeners();
		this.addAnimations();
		this.setupPriceCalculator();
		this.addInteractiveEffects();
	}

	// Configuration des écouteurs d'événements
	setupEventListeners() {
		// Bouton d'impression
		const printBtn = document.getElementById('printBtn');
		if (printBtn) {
			printBtn.addEventListener('click', this.handlePrintClean.bind(this)); // Changez ici
		}

		// Liens sociaux
		this.setupSocialLinks();

		// Gestion du téléphone
		this.setupPhoneLink();

		// Calculateur de prix
		this.setupPriceHover();
	}

	// Nouvelle méthode d'impression ultra-épurée
	handlePrintClean() {
		const printBtn = document.getElementById('printBtn');
		printBtn.style.transform = 'scale(0.95)';
		printBtn.innerHTML = '🖨️ Génération PDF...';

		// S'assurer que tout le contenu est chargé
		if (window.priceManager) {
			window.priceManager.initializePlaquette();
		}

		// Attendre un peu que le contenu se charge
		setTimeout(() => {
			this.createPrintOnlyPage();

			// Restaurer le bouton
			setTimeout(() => {
				printBtn.style.transform = 'scale(1)';
				printBtn.innerHTML = '🖨️ Imprimer la plaquette';
			}, 1000);
		}, 300);
	}

	// Créer une page dédiée à l'impression
	createPrintOnlyPage() {
		const printWindow = window.open('', '_blank', 'width=800,height=600');

		// Récupérer les données de la plaquette
		const data = this.extractPlaquetteData();

		const printHTML = `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <title>Pour Vos Ongles - Plaquette Tarifs</title>
        <style>
            ${this.getMinimalPrintStyles()}
        </style>
    </head>
    <body>
        <div class="print-container">
            <!-- Header minimaliste -->
            <header class="print-header">
                <h1>Pour Vos Ongles</h1>
                <p>Prothésiste Ongulaire • Service à domicile</p>
            </header>

            <!-- Contenu principal en 2 colonnes -->
            <div class="print-content">
                <!-- Colonne gauche -->
                <div class="print-column">
                    <section class="print-section">
                        <h2>🖐️ Mains</h2>
                        <div class="service-group">
                            <h3>GEL</h3>
                            ${this.generateServicesList('mains-gel')}
                        </div>
                        <div class="service-group">
                            <h3>SEMI PERMANENT</h3>
                            ${this.generateServicesList('mains-semi')}
                        </div>
                        <div class="service-group">
                            <h3>VERNIS</h3>
                            ${this.generateServicesList('mains-vernis')}
                        </div>
                    </section>

                    <section class="print-section">
                        <h2>🦶 Pieds</h2>
                        <div class="service-group">
                            <h3>GEL</h3>
                            ${this.generateServicesList('pieds-gel')}
                        </div>
                        <div class="service-group">
                            <h3>SEMI PERMANENT</h3>
                            ${this.generateServicesList('pieds-semi')}
                        </div>
                        <div class="service-group">
                            <h3>VERNIS</h3>
                            ${this.generateServicesList('pieds-vernis')}
                        </div>
                    </section>
                </div>

                <!-- Colonne droite -->
                <div class="print-column">
                    <section class="print-section highlight">
                        <h2>🎁 Offre Spéciale</h2>
                        <p class="offer-text">${data.specialOffer}</p>
                    </section>

                    <section class="print-section">
                        <h2>💅 Nail Art</h2>
                        <p class="service-line">Création personnalisée <span class="price">2€/ongle</span></p>
                    </section>

                    <section class="print-section">
                        <h2>➕ Suppléments</h2>
                        ${this.generateSupplementsList()}
                    </section>

                    <section class="print-section contact">
                        <h2>📞 Contact</h2>
                        <p class="phone-big">07 79 80 55 84</p>
                        <p class="contact-info">WhatsApp • Service à domicile</p>
                        <p class="social">@pourvosonglesadomicile</p>
                    </section>
                </div>
            </div>
        </div>

        <script>
            window.onload = function() {
                setTimeout(() => {
                    window.print();
                    window.onafterprint = function() {
                        window.close();
                    };
                }, 500);
            };
        </script>
    </body>
    </html>`;

		printWindow.document.write(printHTML);
		printWindow.document.close();
	}

	// Extraire les données de la plaquette
	extractPlaquetteData() {
		return {
			specialOffer:
				document.getElementById('special-offer-text')?.textContent ||
				"10€ OFFERTS LORS D'UNE PRESTATION PIEDS ET MAINS",
		};
	}

	// Générer la liste des services de manière compacte
	generateServicesList(sectionId) {
		const container = document.getElementById(sectionId + '-services');
		if (!container) return '';

		const services = container.querySelectorAll('.service-item');
		let html = '';

		services.forEach((service) => {
			const title = service.querySelector('h4')?.textContent || '';
			const price = service.querySelector('.price')?.textContent || '';
			if (title && price) {
				// Nettoyer le titre (enlever les détails entre parenthèses pour économiser l'espace)
				const cleanTitle = title.split('(')[0].trim();
				html += `<p class="service-line">${cleanTitle} <span class="price">${price}</span></p>`;
			}
		});

		return html;
	}

	// Générer la liste des suppléments
	generateSupplementsList() {
		const container = document.getElementById('supplements-list');
		if (!container) return '';

		const supplements = container.querySelectorAll('p');
		let html = '';

		supplements.forEach((supplement) => {
			const text = supplement.textContent;
			const parts = text.split('...');
			if (parts.length === 2) {
				const name = parts[0].trim();
				const price = parts[1].trim();
				html += `<p class="service-line">${name} <span class="price">${price}</span></p>`;
			}
		});

		return html;
	}

	// Styles minimalistes pour l'impression
	getMinimalPrintStyles() {
		return `
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
            print-color-adjust: exact !important;
        }

        @page {
            size: A4 landscape;
            margin: 10mm;
            background: white;
        }

        body {
            font-family: Arial, sans-serif;
            font-size: 9pt;
            line-height: 1.2;
            color: #333;
            background: white;
        }

        .print-container {
            width: 100%;
            height: 100%;
        }

        /* Header ultra-compact */
        .print-header {
            text-align: center;
            background: #e91e63;
            color: white;
            padding: 8mm 0;
            margin-bottom: 5mm;
        }

        .print-header h1 {
            font-size: 20pt;
            font-weight: bold;
            margin-bottom: 2mm;
        }

        .print-header p {
            font-size: 10pt;
            font-weight: 300;
        }

        /* Layout 2 colonnes */
        .print-content {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8mm;
            height: calc(100% - 25mm);
        }

        .print-column {
            display: flex;
            flex-direction: column;
            gap: 4mm;
        }

        /* Sections */
        .print-section {
            background: #fafafa;
            border: 1pt solid #ddd;
            border-radius: 3mm;
            padding: 3mm;
        }

        .print-section.highlight {
            background: #e91e63;
            color: white;
            border-color: #e91e63;
        }

        .print-section.contact {
            background: #f0f8ff;
            border-color: #e91e63;
            text-align: center;
        }

        .print-section h2 {
            font-size: 11pt;
            font-weight: bold;
            color: #e91e63;
            margin-bottom: 2mm;
            text-align: center;
        }

        .print-section.highlight h2 {
            color: white;
        }

        .print-section.contact h2 {
            color: #e91e63;
        }

        /* Groupes de services */
        .service-group {
            margin-bottom: 3mm;
        }

        .service-group h3 {
            font-size: 9pt;
            font-weight: bold;
            color: #666;
            margin-bottom: 1mm;
            text-transform: uppercase;
            border-bottom: 1pt solid #ddd;
            padding-bottom: 1mm;
        }

        /* Lignes de services */
        .service-line {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1mm;
            font-size: 8pt;
            line-height: 1.1;
        }

        .price {
            background: #e91e63;
            color: white;
            padding: 1mm 2mm;
            border-radius: 2mm;
            font-weight: bold;
            font-size: 8pt;
            flex-shrink: 0;
        }

        /* Offre spéciale */
        .offer-text {
            font-weight: bold;
            font-size: 9pt;
            text-align: center;
            line-height: 1.3;
        }

        /* Contact */
        .phone-big {
            font-size: 16pt;
            font-weight: bold;
            color: #e91e63;
            margin: 2mm 0;
        }

        .contact-info {
            font-size: 8pt;
            color: #666;
            margin-bottom: 2mm;
        }

        .social {
            font-size: 8pt;
            font-style: italic;
            color: #888;
        }

        /* Optimisations pour tout faire rentrer */
        @media print {
            .print-section {
                page-break-inside: avoid;
                break-inside: avoid;
            }
            
            .service-line {
                break-inside: avoid;
            }
        }

        /* Version encore plus compacte si nécessaire */
        .service-line:nth-child(n+8) {
            font-size: 7pt;
        }

        /* Économie d'espace maximale */
        .print-column:first-child .service-group:last-child {
            margin-bottom: 1mm;
        }
    `;
	}

	// Préparation du contenu pour l'impression
	prepareContentForPrint() {
		// S'assurer que tout le contenu est chargé
		if (window.priceManager) {
			window.priceManager.initializePlaquette();
		}

		// Ajouter une classe pour l'impression
		document.body.classList.add('printing-mode');

		// Optimiser les images
		const images = document.querySelectorAll('img');
		images.forEach((img) => {
			img.style.maxWidth = '100%';
			img.style.height = 'auto';
			img.style.pageBreakInside = 'avoid';
		});
	}

	// Restauration du contenu après l'impression
	restoreContentAfterPrint() {
		document.body.classList.remove('printing-mode');
	}

	// Ajoutez cette méthode dans la classe PlaquetteDigitale
	// createPrintPreview() {
	// 	const previewContainer = document.createElement('div');
	// 	previewContainer.innerHTML = `
	//     <button id="previewBtn" class="preview-btn" title="Aperçu d'impression">
	//         👁️ Aperçu
	//     </button>
	// `;
	// 	previewContainer.style.cssText = `
	//     position: fixed;
	//     top: 80px;
	//     right: 20px;
	//     z-index: 1000;
	// `;

	// 	const previewBtn = previewContainer.querySelector('#previewBtn');
	// 	previewBtn.style.cssText = `
	//     background: #666;
	//     color: white;
	//     border: none;
	//     padding: 10px 15px;
	//     border-radius: 8px;
	//     cursor: pointer;
	//     font-size: 12px;
	//     box-shadow: 0 2px 10px rgba(0,0,0,0.2);
	// `;

	// 	previewBtn.addEventListener('click', () => {
	// 		this.showPrintPreview();
	// 	});

	// 	document.body.appendChild(previewContainer);
	// }

	showPrintPreview() {
		const printWindow = window.open('', '_blank', 'width=800,height=600');
		const currentContent = document.documentElement.outerHTML;

		printWindow.document.write(currentContent);
		printWindow.document.close();

		// Appliquer les styles d'impression
		setTimeout(() => {
			printWindow.document.body.style.background = 'white';
			printWindow.document.body.classList.add('printing-mode');

			// Masquer les boutons dans l'aperçu
			const buttonsToHide = printWindow.document.querySelectorAll(
				'.print-button-container, .price-calculator'
			);
			buttonsToHide.forEach((btn) => (btn.style.display = 'none'));
		}, 100);
	}

	// N'oubliez pas d'appeler cette méthode dans init()
	init() {
		this.setupEventListeners();
		this.addAnimations();
		this.setupPriceCalculator();
		this.addInteractiveEffects();
		this.createPrintPreview(); // Ajoutez cette ligne
	}

	// Configuration des liens sociaux
	setupSocialLinks() {
		const socialIcons = document.querySelectorAll('.social-icon');
		socialIcons.forEach((icon, index) => {
			icon.addEventListener('click', () => {
				if (index === 0) {
					// Facebook
					this.showSocialMessage('Facebook', 'Pour Vos Ongles à domicile');
				} else if (index === 1) {
					// Instagram
					this.showSocialMessage('Instagram', '@pourvosongles');
				}
			});
		});
	}

	// Affichage des messages sociaux
	showSocialMessage(platform, handle) {
		const message = `Retrouvez-moi sur ${platform} : ${handle}`;
		this.showNotification(message, 'info');
	}

	// Lien téléphone
	setupPhoneLink() {
		const phoneNumber = document.querySelector('.phone-number');
		if (phoneNumber) {
			phoneNumber.style.cursor = 'pointer';
			phoneNumber.addEventListener('click', () => {
				window.location.href = 'tel:0779805584';
				this.showNotification('Appel en cours...', 'success');
			});
		}
	}

	// Effets au survol des prix
	setupPriceHover() {
		const serviceItems = document.querySelectorAll('.service-item');
		serviceItems.forEach((item) => {
			item.addEventListener('mouseenter', this.handleServiceHover.bind(this));
			item.addEventListener('mouseleave', this.handleServiceLeave.bind(this));
		});
	}

	handleServiceHover(event) {
		const item = event.currentTarget;
		const price = item.querySelector('.price');

		if (price) {
			// Effet de brillance sur le prix
			price.style.animation = 'priceGlow 1s ease-in-out';

			// Ajouter des étoiles temporaires
			this.addSparkles(item);
		}
	}

	handleServiceLeave(event) {
		const item = event.currentTarget;
		const price = item.querySelector('.price');

		if (price) {
			price.style.animation = '';
		}

		// Supprimer les étoiles
		this.removeSparkles(item);
	}

	// Ajouter des étoiles scintillantes
	addSparkles(element) {
		for (let i = 0; i < 3; i++) {
			const sparkle = document.createElement('span');
			sparkle.className = 'sparkle';
			sparkle.innerHTML = '✨';
			sparkle.style.position = 'absolute';
			sparkle.style.fontSize = '12px';
			sparkle.style.pointerEvents = 'none';
			sparkle.style.animation = `sparkleFloat 2s ease-out infinite`;
			sparkle.style.animationDelay = `${i * 0.3}s`;

			// Position aléatoire
			sparkle.style.left = `${Math.random() * 80}%`;
			sparkle.style.top = `${Math.random() * 80}%`;

			element.style.position = 'relative';
			element.appendChild(sparkle);
		}
	}

	// Supprimer les étoiles
	removeSparkles(element) {
		const sparkles = element.querySelectorAll('.sparkle');
		sparkles.forEach((sparkle) => sparkle.remove());
	}

	// Calculateur de prix interactif
	setupPriceCalculator() {
		this.createCalculatorButton();
	}


	createCalculatorButton() {
		const calculator = document.createElement('div');
		calculator.className = 'price-calculator';
		calculator.innerHTML = `
            <button id="calculatorBtn" class="calculator-btn">
                💰 Calculateur de prix
            </button>
            <div id="calculatorModal" class="calculator-modal hidden">
                <div class="calculator-content">
                    <h3>Calculateur de prix</h3>
                    <div class="calculator-form">
                        <select id="serviceType">
                            <option value="">Choisir un service</option>
                            <option value="">🖐️ MAINS</option>
                            <option value="gel-pose-mains">Gel - Pose complète (70€)</option>
                            <option value="gel-remplissage-mains">Gel - Remplissage mains (48€)</option>
							<option value="kapping-mains">Kapping mains (40€)</option>
							<option value="semi-permanent-mains">Semi permanent - Mains (38€)</option>
							
                            <option value="">🦶 PIEDS</option>
							<option value="gel-pose-pieds">Gel - Pose pieds (40€)</option>
							<option value="semi-permanent-pieds">Semi permanent - Pieds (35€)</option>
							<option value="vernis-spa-pieds">Vernis - Spa des pieds (50€)</option>
							<option value="vernis-beaute-pieds">Vernis - Beauté des pieds (35€)</option>
                        </select>
                        <div class="supplements-section" style="display:flex; flex-direction: column; gap: 5px; align-items: center; margin-top: 10px;">
                            <label><input type="checkbox" value="10"> Baby boomer (+10€)</label>
                            <label><input type="checkbox" value="15"> Limage vernis mains (+15€)</label>
                            <label><input type="checkbox" value="15"> Limage vernis pieds (+15€)</label>
                            <label><input type="checkbox" value="1"> Strass/Stickers (+1€)</label>
                        </div>
                        <div class="total-section">
                            <strong>Total: <span id="totalPrice">0€</span></strong>
                        </div>
                    </div>
                    <button id="closeCalculator" class="close-btn">Fermer</button>
                </div>
            </div>
        `;

		document.body.appendChild(calculator);
		this.setupCalculatorEvents();
	}

	setupCalculatorEvents() {
		const calcBtn = document.getElementById('calculatorBtn');
		const modal = document.getElementById('calculatorModal');
		const closeBtn = document.getElementById('closeCalculator');
		const serviceSelect = document.getElementById('serviceType');
		const supplements = document.querySelectorAll('.supplements-section input');

		calcBtn.addEventListener('click', () => {
			modal.classList.remove('hidden');
		});

		closeBtn.addEventListener('click', () => {
			modal.classList.add('hidden');
		});

		// ! Calcul en temps réel
		[serviceSelect, ...supplements].forEach((element) => {
			element.addEventListener('change', this.calculateTotal.bind(this));
		});
	}

	calculateTotal() {
		const serviceSelect = document.getElementById('serviceType');
		const supplements = document.querySelectorAll(
			'.supplements-section input:checked'
		);
		const totalElement = document.getElementById('totalPrice');

		let total = 0;

		// ! Prix du service principal
		const servicePrices = {
			// mains 
			'gel-pose-mains': 70,
			'gel-remplissage-mains': 48,
			'kapping-mains': 40,
			'semi-permanent-mains': 38,
			'vernis-mains': 30,
			// pieds
			'gel-pose-pieds': 40,
			'semi-permanent-pieds': 35,
			'vernis-spa-pieds': 50,
			'vernis-beaute-pieds': 35,
		};

		if (serviceSelect.value) {
			total += servicePrices[serviceSelect.value] || 0;
		}

		// Suppléments
		supplements.forEach((supplement) => {
			total += parseInt(supplement.value) || 0;
		});

		totalElement.textContent = `${total}€`;
	}

	// Animations d'entrée
	addAnimations() {
		// Animation d'apparition progressive
		this.observeElements();

		// Animation du header
		this.animateHeader();

		// Particules flottantes
		this.createFloatingParticles();
	}

	observeElements() {
		const observer = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					entry.target.style.animation = 'slideInUp 0.6s ease-out';
				}
			});
		});

		document
			.querySelectorAll('.service-card, .service-special')
			.forEach((card) => {
				observer.observe(card);
			});
	}

	animateHeader() {
		const header = document.querySelector('.header');
		if (header) {
			header.style.animation = 'headerSlideIn 1s ease-out';
		}
	}

	createFloatingParticles() {
		const container = document.querySelector('.plaquette-container');

		for (let i = 0; i < 5; i++) {
			const particle = document.createElement('div');
			particle.className = 'floating-particle';
			particle.innerHTML = ['💅', '✨', '💖', '🌸', '💫'][i];
			particle.style.position = 'fixed';
			particle.style.fontSize = '20px';
			particle.style.pointerEvents = 'none';
			particle.style.zIndex = '1';
			particle.style.opacity = '0.3';

			document.body.appendChild(particle);
			this.animateParticle(particle);
		}
	}

	animateParticle(particle) {
		const animate = () => {
			particle.style.left = Math.random() * window.innerWidth + 'px';
			particle.style.top = Math.random() * window.innerHeight + 'px';
			particle.style.transform = `rotate(${Math.random() * 360}deg)`;
		};

		animate();
		setInterval(animate, 5000 + Math.random() * 5000);
	}

	// Effets interactifs
	addInteractiveEffects() {
		this.addRippleEffect();
		this.addParallaxEffect();
	}

	addRippleEffect() {
		document
			.querySelectorAll('.service-item, .print-btn')
			.forEach((element) => {
				element.addEventListener('click', function (e) {
					const ripple = document.createElement('span');
					const rect = this.getBoundingClientRect();
					const size = Math.max(rect.width, rect.height);
					const x = e.clientX - rect.left - size / 2;
					const y = e.clientY - rect.top - size / 2;

					ripple.style.width = ripple.style.height = size + 'px';
					ripple.style.left = x + 'px';
					ripple.style.top = y + 'px';
					ripple.classList.add('ripple-effect');

					this.appendChild(ripple);

					setTimeout(() => ripple.remove(), 600);
				});
			});
	}

	addParallaxEffect() {
		window.addEventListener('scroll', () => {
			const scrolled = window.pageYOffset;
			const header = document.querySelector('.header');

			if (header) {
				header.style.transform = `translateY(${scrolled * 0.3}px)`;
			}
		});
	}

	// Système de notifications
	showNotification(message, type = 'info') {
		const notification = document.createElement('div');
		notification.className = `notification ${type}`;
		notification.textContent = message;
		notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: var(--pink-gradient);
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.2);
            z-index: 1001;
            animation: slideInRight 0.3s ease-out;
        `;

		document.body.appendChild(notification);

		setTimeout(() => {
			notification.style.animation = 'slideOutRight 0.3s ease-out';
			setTimeout(() => notification.remove(), 300);
		}, 3000);
	}
}

// Styles CSS supplémentaires pour les nouvelles fonctionnalités
const additionalStyles = `
    @keyframes priceGlow {
        0%, 100% { box-shadow: 0 2px 10px var(--shadow); }
        50% { box-shadow: 0 5px 25px rgba(233, 30, 99, 0.5); }
    }

    @keyframes sparkleFloat {
        0% { transform: translateY(0px) rotate(0deg); opacity: 1; }
        100% { transform: translateY(-20px) rotate(180deg); opacity: 0; }
    }

    @keyframes slideInUp {
        from { transform: translateY(50px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
    }

    @keyframes headerSlideIn {
        from { transform: translateY(-100px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
    }

    @keyframes slideInRight {
        from { transform: translateX(100%); }
        to { transform: translateX(0); }
    }

    @keyframes slideOutRight {
        to { transform: translateX(100%); }
    }

    .price-calculator {
        position: fixed;
        bottom: 20px;
        left: 20px;
        z-index: 1000;
    }

    .calculator-btn {
        background: var(--pink-gradient);
        color: white;
        border: none;
        padding: 12px 20px;
        border-radius: 25px;
        cursor: pointer;
        box-shadow: 0 4px 15px var(--shadow);
        transition: all 0.3s ease;
    }

    .calculator-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px var(--shadow);
    }

    .calculator-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1002;
    }

    .calculator-modal.hidden {
        display: none;
    }

    .calculator-content {
        background: white;
        padding: 30px;
        border-radius: 15px;
        max-width: 400px;
        width: 90%;
    }

    .calculator-form select, .calculator-form input {
        width: 100%;
        padding: 10px;
        margin: 10px 0;
        border: 2px solid #eee;
        border-radius: 8px;
    }

    .supplements-section {
        margin: 20px 0;
    }

    .supplements-section label {
        display: block;
        margin: 10px 0;
        cursor: pointer;
    }

    .total-section {
        background: #f8f9fa;
        padding: 15px;
        border-radius: 8px;
        margin: 20px 0;
        text-align: center;
        font-size: 1.2rem;
    }

    .close-btn {
        background: #666;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 8px;
        cursor: pointer;
        width: 100%;
    }

    .ripple-effect {
        position: absolute;
        border-radius: 50%;
        background: rgba(255,255,255,0.6);
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
    }

    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }

    .floating-particle {
        animation: float 6s ease-in-out infinite;
    }

    @keyframes float {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        50% { transform: translateY(-20px) rotate(180deg); }
    }
`;

// Injection des styles supplémentaires
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Initialisation de l'application
document.addEventListener('DOMContentLoaded', () => {
	new PlaquetteDigitale();
});

// Gestion du redimensionnement
window.addEventListener('resize', () => {
	// Recalculer les positions des particules
	document.querySelectorAll('.floating-particle').forEach((particle) => {
		particle.style.left = Math.random() * window.innerWidth + 'px';
	});
});
