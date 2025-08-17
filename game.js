// game.js
class ProjectTerraNova {
    CONFIG = {
        TICK_RATE_MS: 1000,
        ENERGY_REGEN_PER_SECOND: 2, // Aumentado para más acción
        COINS_PER_TAP: 1,
        INITIAL_MAX_ENERGY: 1000,
        SAVE_KEY: 'terraNovaSave_Master_v4',
        DAILY_REWARD_COINS: 100000,
        DAILY_COMBO_REWARD_COINS: 5000000,
    };
    
    // ... (La lista de projectBlueprints no cambia) ...

    constructor() {
        this.defaultState = {
            pazCoin: 0,
            profitPerHour: 0,
            projects: {},
            energy: this.CONFIG.INITIAL_MAX_ENERGY,
            maxEnergy: this.CONFIG.INITIAL_MAX_ENERGY,
            lastUpdate: Date.now(),
            lastDailyRewardClaim: 0,
            dailyCombo: this.#generateDailyComboState(),
        };
        this.state = {...this.defaultState};
        this.telegram = window.Telegram?.WebApp;
        this.#cacheDOMElements();
    }

    async init() {
        // ... (resto del init sin cambios) ...
        this.#checkDailyCombo();
        setInterval(() => this.#gameTick(), this.CONFIG.TICK_RATE_MS);
        // ... (resto del init) ...
    }

    #gameTick = () => {
        // ... (cálculos de pazCoin y energía sin cambios) ...
        this.#updateDailyRewardButton(); // Actualiza el estado del botón
    }

    #handleTap = () => {
        if (this.state.energy >= this.CONFIG.COINS_PER_TAP) {
            // ... (lógica de tap) ...
            this.dom.clickAudio.play().catch(e => {}); // Reproducir sonido
        }
    }
    
    #buyProject = (projectId) => {
        // ... (lógica de compra sin cambios) ...
        if (this.state.pazCoin >= cost) {
            // ... (actualización de estado) ...
            this.dom.buyAudio.play().catch(e => {}); // Reproducir sonido
            this.#checkDailyCombo(projectId); // Comprobar si es parte del combo
            // ... (resto) ...
        }
    }

    // --- NUEVAS FUNCIONES DE RECOMPENSAS ---

    #claimDailyReward = () => {
        const now = Date.now();
        if (now - this.state.lastDailyRewardClaim > 24 * 60 * 60 * 1000) {
            this.state.lastDailyRewardClaim = now;
            const reward = this.CONFIG.DAILY_REWARD_COINS;
            this.state.pazCoin += reward;
            this.#showNotification("¡Recompensa Diaria!", `Has recibido ${this.#formatNumber(reward)} $XPAZ.`);
            this.#highlightBalance();
        }
    }

    #updateDailyRewardButton = () => {
        const now = Date.now();
        const canClaim = now - this.state.lastDailyRewardClaim > 24 * 60 * 60 * 1000;
        this.dom.dailyRewardButton.disabled = !canClaim;
        this.dom.dailyRewardButton.classList.toggle('ready', canClaim);
    }
    
    #generateDailyComboState = (date = new Date()) => {
        const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
        const allProjectIds = Object.keys(this.projectBlueprints);
        const combo = new Set();
        
        while(combo.size < 3) {
            const index = (dayOfYear * (combo.size + 1) * 3 + (combo.size * 5)) % allProjectIds.length;
            combo.add(allProjectIds[index]);
        }
        
        const purchased = {};
        combo.forEach(id => purchased[id] = false);

        return {
            date: date.toISOString().split('T')[0],
            combo: [...combo],
            purchased: purchased,
            isClaimed: false
        };
    }
    
    #checkDailyCombo = (purchasedProjectId = null) => {
        const todayStr = new Date().toISOString().split('T')[0];
        // Si el combo es de un día anterior, generar uno nuevo
        if (this.state.dailyCombo.date !== todayStr) {
            this.state.dailyCombo = this.#generateDailyComboState();
        }

        if (this.state.dailyCombo.isClaimed) {
            this.#renderDailyCombo();
            return;
        }

        // Marcar la compra si el ID está en el combo
        if (purchasedProjectId && this.state.dailyCombo.combo.includes(purchasedProjectId)) {
            this.state.dailyCombo.purchased[purchasedProjectId] = true;
        }
        
        // Comprobar si se completó el combo
        const allPurchased = this.state.dailyCombo.combo.every(id => this.state.dailyCombo.purchased[id]);
        if (allPurchased) {
            this.state.dailyCombo.isClaimed = true;
            const reward = this.CONFIG.DAILY_COMBO_REWARD_COINS;
            this.state.pazCoin += reward;
            this.#showNotification("¡Combo Diario Completado!", `¡Felicidades! Has ganado ${this.#formatNumber(reward)} $XPAZ.`);
            this.#highlightBalance();
        }
        this.#renderDailyCombo();
    }
    
    // --- NUEVAS FUNCIONES DE RENDERIZADO Y UI ---
    
    #renderDailyCombo = () => {
        const { combo, purchased, isClaimed } = this.state.dailyCombo;
        const comboCardsContainer = this.dom.dailyComboCards;
        comboCardsContainer.innerHTML = '';

        combo.forEach(projectId => {
            const card = document.createElement('div');
            if (purchased[projectId] || isClaimed) {
                card.className = 'combo-card-found';
                card.textContent = this.projectBlueprints[projectId].icon;
            } else {
                card.className = 'combo-card';
                card.textContent = '?';
            }
            comboCardsContainer.appendChild(card);
        });
    }

    #renderMineView = () => {
        // ... (lógica de renderizado de tarjetas) ...
        // Añadir clase si la tarjeta es parte del combo
        const { combo, isClaimed } = this.state.dailyCombo;
        if (!isClaimed && combo.includes(id)) {
            card.classList.add('is-combo');
        }
        // ... (resto de la función) ...
    }
    
    #showNotification = (title, text) => {
        this.dom.modalTitle.textContent = title;
        this.dom.modalText.textContent = text;
        this.dom.modalOverlay.classList.add('active');
    }

    #closeNotification = () => {
        this.dom.modalOverlay.classList.remove('active');
    }

    #highlightBalance = () => {
        this.dom.balanceDisplay.classList.add('highlight');
        setTimeout(() => this.dom.balanceDisplay.classList.remove('highlight'), 500);
    }

    #cacheDOMElements = () => {
        // ... (cache de todos los elementos anteriores) ...
        this.dom.dailyRewardButton = document.getElementById('daily-reward-button');
        this.dom.modalOverlay = document.getElementById('notification-modal');
        this.dom.modalTitle = document.getElementById('modal-title');
        this.dom.modalText = document.getElementById('modal-text');
        this.dom.modalCloseButton = document.getElementById('modal-close-button');
        this.dom.dailyComboCards = document.getElementById('daily-combo-cards');
        this.dom.balanceDisplay = document.querySelector('.balance-display');
        this.dom.clickAudio = document.getElementById('click-audio');
        this.dom.buyAudio = document.getElementById('buy-audio');
    }

    #setupEventListeners = () => {
        // ... (event listeners anteriores) ...
        this.dom.dailyRewardButton.addEventListener('click', this.#claimDailyReward);
        this.dom.modalCloseButton.addEventListener('click', this.#closeNotification);
    }
    
    // El resto de la clase (`#formatNumber`, `loadState`, etc.) no necesita cambios.
}

window.addEventListener('DOMContentLoaded', async () => {
    // ... (código de inicialización, sin cambios) ...
});