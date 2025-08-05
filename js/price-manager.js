class PriceManager {
	constructor(config) {
		this.config = config;
	}

	// Génère le HTML pour un service
	createServiceHTML(service) {
		return `
            <div class="service-item" data-service="${service.label}">
                <h4>${service.label}</h4>
                <span class="price">${service.price}€</span>
                <p>${service.description}</p>
                ${
									service.extra
										? `<p><strong>${service.extra}</strong></p>`
										: ''
								}
            </div>
        `;
	}

	// Génère le HTML pour un supplément
	createSupplementHTML(supplement) {
		return `
            <p>${supplement.label}... <span class="price">${supplement.price}€</span></p>
        `;
	}

	// Remplit une section de services
	fillServiceSection(sectionId, services) {
		const container = document.getElementById(sectionId);
		if (container) {
			container.innerHTML = Object.values(services)
				.map((service) => this.createServiceHTML(service))
				.join('');
		}
	}

	// Remplit la section des suppléments
	fillSupplements() {
		const container = document.getElementById('supplements-list');
		if (container) {
			container.innerHTML = Object.values(this.config.supplements)
				.map((supplement) => this.createSupplementHTML(supplement))
				.join('');
		}
	}

	// Remplit l'offre spéciale
	fillSpecialOffer() {
		const element = document.getElementById('special-offer-text');
		if (element) {
			element.textContent = this.config.special.specialOffer;
		}
	}

	// Remplit le nail art
	fillNailArt() {
		const title = document.getElementById('nail-art-title');
		const description = document.getElementById('nail-art-description');
		const price = document.getElementById('nail-art-price');

		if (title) title.textContent = this.config.special.nailArt.label;
		if (description)
			description.textContent = this.config.special.nailArt.description;
		if (price)
			price.textContent = `à partir de ${this.config.special.nailArt.priceFrom}€ par ongle`;
	}

	// Initialise toute la plaquette
	initializePlaquette() {
		// Services mains
		this.fillServiceSection('mains-gel-services', this.config.mains.gel);
		this.fillServiceSection('mains-semi-services', this.config.mains.semi);
		this.fillServiceSection('mains-vernis-services', this.config.mains.vernis);

		// Services pieds
		this.fillServiceSection('pieds-gel-services', this.config.pieds.gel);
		this.fillServiceSection('pieds-semi-services', this.config.pieds.semi);
		this.fillServiceSection('pieds-vernis-services', this.config.pieds.vernis);

		// Autres sections
		this.fillSupplements();
		this.fillSpecialOffer();
		this.fillNailArt();
	}

	// Méthode pour modifier un prix facilement
	updatePrice(category, type, service, newPrice) {
		if (
			this.config[category] &&
			this.config[category][type] &&
			this.config[category][type][service]
		) {
			this.config[category][type][service].price = newPrice;
			this.initializePlaquette(); // Re-génère la plaquette
		}
	}

	// Méthode pour obtenir un prix
	getPrice(category, type, service) {
		return this.config[category]?.[type]?.[service]?.price || 0;
	}

	// Export des prix pour d'autres modules
	getAllPrices() {
		const prices = {};

		// Extraction de tous les prix dans un format simple
		Object.keys(this.config).forEach((category) => {
			if (category !== 'special') {
				prices[category] = {};
				Object.keys(this.config[category]).forEach((type) => {
					prices[category][type] = {};
					Object.keys(this.config[category][type]).forEach((service) => {
						prices[category][type][service] =
							this.config[category][type][service].price;
					});
				});
			}
		});

		return prices;
	}
}

// Initialisation globale
let priceManager;

document.addEventListener('DOMContentLoaded', () => {
	priceManager = new PriceManager(PRICES_CONFIG);
	priceManager.initializePlaquette();
});
