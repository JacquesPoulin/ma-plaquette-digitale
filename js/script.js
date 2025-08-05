// Ce fichier contient le code JavaScript pour l'application.
// Il gère l'interactivité et les comportements dynamiques de la page.

// Configuration des prix - facile à modifier
const PRICES = {
	mains: {
		gel: {
			poseComplete: 60,
			remplissage: 42,
			kapping: 35,
			depose: 30,
		},
		semi: {
			semiPermanent: 32,
			depose: 30,
		},
		vernis: {
			beauteDesMains: 25,
		},
	},
	pieds: {
		gel: {
			posePieds: 35,
			depose: 25,
		},
		semi: {
			semiPermanent: 28,
			depose: 25,
		},
		vernis: {
			beauteDesPieds: 25,
			spaDesPieds: 38,
		},
	},
	supplements: {
		limageVernisPieds: 10,
		limageVernisMains: 10,
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
			printBtn.addEventListener('click', this.handlePrint.bind(this));
		}

		// Liens sociaux
		this.setupSocialLinks();

		// Gestion du téléphone
		this.setupPhoneLink();

		// Calculateur de prix
		this.setupPriceHover();
	}

	// Gestion de l'impression
	handlePrint() {
		// Animation du bouton avant impression
		const printBtn = document.getElementById('printBtn');
		printBtn.style.transform = 'scale(0.95)';
		printBtn.innerHTML = '🖨️ Impression...';

		setTimeout(() => {
			window.print();

			// Restaurer le bouton après impression
			setTimeout(() => {
				printBtn.style.transform = 'scale(1)';
				printBtn.innerHTML = '🖨️ Imprimer la plaquette';
			}, 500);
		}, 300);
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
                            <option value="gel-pose">Gel - Pose complète (60€)</option>
                            <option value="gel-remplissage">Gel - Remplissage (42€)</option>
                            <option value="semi-permanent">Semi permanent (32€)</option>
                            <option value="beaute-mains">Beauté des mains (25€)</option>
                        </select>
                        <div class="supplements-section">
                            <label><input type="checkbox" value="10"> Baby boomer (+10€)</label>
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

		// Calcul en temps réel
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

		// Prix du service principal
		const servicePrices = {
			'gel-pose': 60,
			'gel-remplissage': 42,
			'semi-permanent': 32,
			'beaute-mains': 25,
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
