/**
 * ProjectTerraNova - Un juego incremental con arquitectura de alta calidad.
 * @version 3.0.1
 */
class ProjectTerraNova {
    CONFIG = {
        TICK_RATE_MS: 1000,
        ENERGY_REGEN_PER_SECOND: 1,
        COINS_PER_TAP: 1,
        INITIAL_MAX_ENERGY: 1000,
        SAVE_KEY: 'terraNovaSave_Master'
    };

    projectBlueprints = {
        'edu_1': { name: "Alfabetización Básica", icon: '📚', cost: 20, profitPerHour: 5 },
        'edu_2': { name: "Bibliotecas Comunitarias", icon: '🏛️', cost: 100, profitPerHour: 15 },
        'edu_3': { name: "Acceso a Internet Rural", icon: '📶', cost: 500, profitPerHour: 40 },
        'edu_4': { name: "Plataformas E-Learning", icon: '💻', cost: 2500, profitPerHour: 120 },
        'edu_5': { name: "Programas de Intercambio", icon: '✈️', cost: 10000, profitPerHour: 350 },
        'edu_6': { name: "Preservación Cultural", icon: '🗿', cost: 40000, profitPerHour: 700 },
        'edu_7': { name: "Universidades Gratuitas", icon: '🎓', cost: 150000, profitPerHour: 1800 },
        'edu_8': { name: "Red de Conocimiento Global", icon: '🌐', cost: 500000, profitPerHour: 4500 },
        'health_1': { name: "Vacunación Infantil", icon: '💉', cost: 50, profitPerHour: 10 },
        'health_2': { name: "Agua Potable y Saneamiento", icon: '💧', cost: 400, profitPerHour: 50 },
        'health_3': { name: "Clínicas Móviles", icon: '🚑', cost: 2000, profitPerHour: 150 },
        'health_4': { name: "Programas de Nutrición", icon: '🍎', cost: 8000, profitPerHour: 300 },
        'health_5': { name: "Salud Mental para Todos", icon: '🧠', cost: 35000, profitPerHour: 800 },
        'health_6': { name: "Investigación Médica AI", icon: '🤖', cost: 120000, profitPerHour: 2000 },
        'health_7': { name: "Telemedicina Global", icon: '⚕️', cost: 450000, profitPerHour: 5000 },
        'health_8': { name: "Erradicación de Pandemias", icon: '🦠', cost: 1200000, profitPerHour: 12000 },
        'infra_1': { name: "Reciclaje Comunitario", icon: '♻️', cost: 300, profitPerHour: 45 },
        'infra_2': { name: "Energía Eólica y Solar", icon: '☀️', cost: 1500, profitPerHour: 130 },
        'infra_3': { name: "Transporte Público Eléctrico", icon: '🚌', cost: 7500, profitPerHour: 400 },
        'infra_4': { name: "Agricultura Vertical", icon: '🌱', cost: 30000, profitPerHour: 900 },
        'infra_5': { name: "Red Eléctrica Inteligente", icon: '⚡', cost: 100000, profitPerHour: 2500 },
        'infra_6': { name: "Ciudades Verdes", icon: '🌳', cost: 350000, profitPerHour: 6000 },
        'infra_7': { name: "Proyectos de Reforestación", icon: '🌲', cost: 800000, profitPerHour: 10000 },
        'infra_8': { name: "Fusión Nuclear Limpia", icon: '⚛️', cost: 2500000, profitPerHour: 25000 },
        'gov_1': { name: "Tratados de Paz Regionales", icon: '📜', cost: 5000, profitPerHour: 500 },
        'gov_2': { name: "Lucha contra la Corrupción", icon: '⚖️', cost: 20000, profitPerHour: 1000 },
        'gov_3': { name: "Fondo de Ayuda Humanitaria", icon: '🕊️', cost: 80000, profitPerHour: 2200 },
        'gov_4': { name: "Observatorio de DDHH", icon: '👁️', cost: 250000, profitPerHour: 5500 },
        'gov_5': { name: "Moneda Global Estable", icon: '🪙', cost: 700000, profitPerHour: 9000 },
        'gov_6': { name: "Parlamento Mundial", icon: '🏛️', cost: 1500000, profitPerHour: 15000 },
        'gov_7': { name: "Legislación Espacial Unificada", icon: '🛰️', cost: 3000000, profitPerHour: 28000 },
        'special_1': { name: "Exploración Espacial Unida", icon: '🚀', cost: 1000000, profitPerHour: 11000 },
        'special_2': { name: "Algoritmo de la Paz (IA)", icon: '🕊️', cost: 2200000, profitPerHour: 20000 },
        'special_3': { name: "Red de Conciencia Colectiva", icon: '🌌', cost: 5000000, profitPerHour: 40000 },
        'special_4': { name: "Proyecto de Geoingeniería", icon: '🌍', cost: 10000000, profitPerHour: 75000 },
        'special_5': { name: "Embajada Interplanetaria", icon: '👽', cost: 25000000, profitPerHour: 150000 }
    };

    state = {};

    constructor() {
        this.defaultState = {
            pazCoin: 0,
            profitPerHour: 0,
            projects: {},
            energy: this.CONFIG.INITIAL_MAX_ENERGY,
            maxEnergy: this.CONFIG.INITIAL_MAX_ENERGY,
            lastUpdate: Date.now()
        };
        this.state = {...this.defaultState};
        this.telegram = window.Telegram?.WebApp;
        this.#cacheDOMElements();
    }

    async init() {
        this.#setupTelegramSDK();
        this.#loadState();
        this.#recalculateProfitPerHour();
        this.#setupEventListeners();
        setInterval(() => this.#gameTick(), this.CONFIG.TICK_RATE_MS);
        requestAnimationFrame(this.#renderLoop);
        this.#switchView('exchange-view');
    }

    #gameTick = () => {
        const now = Date.now();
        const elapsedSeconds = (now - this.state.lastUpdate) / 1000;
        this.state.pazCoin += (this.state.profitPerHour / 3600) * elapsedSeconds;
        if (this.state.energy < this.state.maxEnergy) {
            const newEnergy = this.state.energy + (this.CONFIG.ENERGY_REGEN_PER_SECOND * elapsedSeconds);
            this.state.energy = Math.min(this.state.maxEnergy, newEnergy);
        }
        this.state.lastUpdate = now;
        this.#saveState();
    }

    #handleTap = () => {
        if (this.state.energy >= this.CONFIG.COINS_PER_TAP) {
            this.state.pazCoin += this.CONFIG.COINS_PER_TAP;
            this.state.energy -= this.CONFIG.COINS_PER_TAP;
            this.telegram?.HapticFeedback.impactOccurred('light');
        }
    }
    
    #buyProject = (projectId) => {
        const blueprint = this.projectBlueprints[projectId];
        const currentLevel = this.state.projects[projectId] || 0;
        const cost = Math.floor(blueprint.cost * Math.pow(1.1, currentLevel));
        if (this.state.pazCoin >= cost) {
            this.state.pazCoin -= cost;
            this.state.projects[projectId] = currentLevel + 1;
            this.telegram?.HapticFeedback.notificationOccurred('success');
            this.#recalculateProfitPerHour();
            this.#renderMineView();
        }
    }

    #recalculateProfitPerHour = () => {
        let totalProfit = 0;
        for (const id in this.state.projects) {
            const level = this.state.projects[id];
            totalProfit += this.projectBlueprints[id].profitPerHour * level;
        }
        this.state.profitPerHour = totalProfit;
    }

    #renderLoop = () => {
        this.#renderHeaderAndBalance();
        this.#renderEnergy();
        requestAnimationFrame(this.#renderLoop);
    }

    #renderHeaderAndBalance = () => {
        this.dom.balance.textContent = this.#formatNumber(this.state.pazCoin);
        this.dom.profitPerHour.textContent = this.#formatNumber(this.state.profitPerHour);
    }

    #renderEnergy = () => {
        const { energy, maxEnergy } = this.state;
        this.dom.energyLevel.textContent = `${Math.floor(energy)}/${maxEnergy}`;
        this.dom.energyBarFill.style.width = `${(energy / maxEnergy) * 100}%`;
    }

    #renderMineView = () => {
        this.dom.mineCardsContainer.innerHTML = '';
        for (const id in this.projectBlueprints) {
            const blueprint = this.projectBlueprints[id];
            const level = this.state.projects[id] || 0;
            const cost = Math.floor(blueprint.cost * Math.pow(1.1, level));
            const canBuy = this.state.pazCoin >= cost;
            const card = document.createElement('div');
            card.className = 'mine-card';
            if (canBuy) card.classList.add('can-buy');
            card.dataset.projectId = id;
            card.innerHTML = `
                <div class="mine-card-icon">${blueprint.icon}</div>
                <div class="mine-card-name">${blueprint.name}</div>
                <div class="mine-card-info">
                    <span>Nivel: ${level}</span> | <span>+${this.#formatNumber(blueprint.profitPerHour)}/h</span>
                </div>
                <div class="mine-card-cost">💰 ${this.#formatNumber(cost)}</div>
            `;
            this.dom.mineCardsContainer.appendChild(card);
        }
    }

    #setupTelegramSDK = () => {
        if (!this.telegram) return;
        this.telegram.ready();
        this.telegram.expand();
        this.telegram.setHeaderColor(getComputedStyle(document.documentElement).getPropertyValue('--hk-surface').trim());
    }

    #cacheDOMElements = () => {
        this.dom = {
            views: document.querySelectorAll('.view'),
            navButtons: document.querySelectorAll('.nav-button'),
            balance: document.getElementById('pazcoin-balance'),
            profitPerHour: document.getElementById('profit-per-hour'),
            globe: document.getElementById('globe'),
            energyLevel: document.getElementById('energy-level'),
            energyBarFill: document.getElementById('energy-bar-fill'),
            mineCardsContainer: document.getElementById('mine-cards-container'),
        };
    }

    #setupEventListeners = () => {
        this.dom.globe.addEventListener('click', this.#handleTap);
        this.dom.navButtons.forEach(button => {
            button.addEventListener('click', () => this.#switchView(button.dataset.view));
        });
        this.dom.mineCardsContainer.addEventListener('click', (e) => {
            const card = e.target.closest('.mine-card.can-buy');
            if (card) this.#buyProject(card.dataset.projectId);
        });
    }

    #switchView = (viewId) => {
        this.dom.views.forEach(view => view.classList.remove('active'));
        document.getElementById(viewId).classList.add('active');
        this.dom.navButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === viewId);
        });
        if (viewId === 'mine-view') this.#renderMineView();
    }

    #saveState = () => {
        try {
            localStorage.setItem(this.CONFIG.SAVE_KEY, JSON.stringify(this.state));
        } catch (error) {
            console.error("Error al guardar el estado:", error);
        }
    }

    #loadState = () => {
        try {
            const savedState = localStorage.getItem(this.CONFIG.SAVE_KEY);
            if (savedState) {
                const loaded = JSON.parse(savedState);
                this.state = { ...this.defaultState, ...loaded };
            }
        } catch (error) {
            console.error("Error al cargar el estado:", error);
            this.state = {...this.defaultState};
        }
    }

    #formatNumber = (num) => {
        const number = Math.floor(num);
        if (number < 1e3) return number.toString();
        if (number < 1e6) return `${(number / 1e3).toFixed(2)}K`;
        if (number < 1e9) return `${(number / 1e6).toFixed(2)}M`;
        if (number < 1e12) return `${(number / 1e9).toFixed(2)}B`;
        return `${(number / 1e12).toFixed(2)}T`;
    }
}

window.addEventListener('DOMContentLoaded', async () => {
    const game = new ProjectTerraNova();
    await game.init();
});