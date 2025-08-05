// Configuration centralisée des prix
const PRICES_CONFIG = {
    mains: {
        gel: {
            poseComplete: { price: 60, label: "POSE COMPLÈTE", description: "Rallongement de l'ongle sans capsule. Longueur et solidité. Idéal pour ongles rongés ou abîmés" },
            remplissage: { price: 42, label: "REMPLISSAGE", description: "Comblement de la repousse naturelle des ongles. Toutes les 3 à 4 semaines" },
            kapping: { price: 35, label: "KAPPING", description: "Permet une solidité de l'ongle sans rallongement" },
            depose: { price: 30, label: "DÉPOSE", description: "Retrait du gel en douceur. Soin des mains (dépose seule 20€)" }
        },
        semi: {
            semiPermanent: { 
                price: 32, 
                label: "SEMI PERMANENT", 
                description: "Soin des mains (repousse et coupe cuticules, limage et polissage)",
                extra: "Vernis semi permanent<br>(supplément champagne, crème de marron 5€)"
            },
            depose: { price: 30, label: "DÉPOSE", description: "Retrait du semi en douceur. Soin des mains (dépose seule 15€)" }
        },
        vernis: {
            beauteDesMains: { 
                price: 25, 
                label: "BEAUTÉ DES MAINS", 
                description: "Soin des mains complet, hydratation des cuticules, limage et polissage des ongles",
                extra: "Vernis Classique<br>(supplément gommage, crème et massage 5€)"
            }
        }
    },
    pieds: {
        gel: {
            posePieds: { price: 35, label: "POSE PIEDS", description: "Apporte de la solidité à vos ongles de pieds. Tenue de 6 à 8 semaines. Permet de réparer des ongles accidentés" },
            depose: { price: 25, label: "DÉPOSE", description: "Retrait du gel en douceur. Soin des pieds (dépose seule 12€)" }
        },
        semi: {
            semiPermanent: { 
                price: 28, 
                label: "SEMI PERMANENT", 
                description: "Soin des pieds (repousse et coupe cuticules, limage et polissage)",
                extra: "Vernis semi permanent"
            },
            depose: { price: 25, label: "DÉPOSE", description: "Retrait du semi en douceur. Soin des pieds (dépose seule 12€)" }
        },
        vernis: {
            beauteDesPieds: { 
                price: 25, 
                label: "BEAUTÉ DES PIEDS", 
                description: "Soin des pieds complet, coupe cuticules, limage et polissage",
                extra: "Vernis Classique"
            },
            spaDesPieds: { 
                price: 38, 
                label: "SPA DES PIEDS", 
                description: "Soin des pieds + pédicure + gommage + ponçage des talons + gommage, crème et massage",
                extra: "Vernis Classique"
            }
        }
    },
    supplements: {
        limageVernisPieds: { price: 10, label: "Limage et pose vernis pieds lors d'une prestation mains" },
        limageVernisMains: { price: 10, label: "Limage et pose vernis mains lors d'une prestation pieds" },
        babyBoomer: { price: 10, label: "Baby boomer" },
        strassStickers: { price: 1, label: "Strass ou stickers" }
    },
    special: {
        nailArt: { priceFrom: 2, label: "Nail Art", description: "Une réalisation personnalisée et artistique pour des ongles sublimes" },
        specialOffer: "10 € OFFERTS LORS D'UNE PRESTATION PIEDS ET MAINS"
    }
};