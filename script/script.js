document.addEventListener("DOMContentLoaded", function () {
    const container = document.getElementById("container");
    const searchInput = document.getElementById("search");
    const regionFilter = document.getElementById("region-filter"); // Lista delle regioni
    let countries = []; // Array per i dati JSON
    let selectedRegion = "all"; // Variabile per la regione selezionata

    // Funzione per recuperare i dati dal file JSON
    async function fetchData() {
        try {
            const response = await fetch("data.json");
            countries = await response.json();
            displayCountries(countries); // Mostro tutti i paesi inizialmente
        } catch (error) {
            console.error("Errore nel caricamento dei dati:", error);
            container.innerHTML = "<p>Errore nel caricamento dei dati.</p>";
        }
    }

    // Funzione per mostrare i paesi filtrati nel container
    function displayCountries(filteredCountries) {
        container.innerHTML = filteredCountries.map(country => `
            <div class="card" data-country-name="${country.name}">
                <img src="${country.flag}" alt="Flag of ${country.name}">
                <h2>${country.name}</h2>
                <p><strong>Region:</strong> ${country.region}</p>
                <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
                <p><strong>Capital:</strong> ${country.capital}</p>
            </div>
        `).join("");
        const cards = container.querySelectorAll(".card");
    
            cards.forEach(card => {
                card.addEventListener("click", function () {
            const countryName = card.getAttribute("data-country-name");
            const country = countries.find(c => c.name === countryName);
            showCountryDetails(country); // Mostra i dettagli del paese
            });
         });
    }
    
    // Funzione per filtrare i paesi in base alla ricerca e alla regione
    function filterCountries() {
        const searchText = searchInput.value.toLowerCase();
        
        const filtered = countries.filter(country => {
            const matchesSearch = country.name.toLowerCase().includes(searchText);
            const matchesRegion = selectedRegion === "all" || country.region === selectedRegion;
            return matchesSearch && matchesRegion;
        });

        displayCountries(filtered);
    }

    // Evento per la ricerca in tempo reale
    searchInput.addEventListener("input", filterCountries);

    // Evento per il filtro per regione
    regionFilter.addEventListener("click", function (event) {
        event.preventDefault(); // Evita il refresh della pagina
        if (event.target.tagName === "A") {
            selectedRegion = event.target.dataset.region; // Prendo la regione selezionata
            filterCountries(); // Aggiorno la visualizzazione
        }
    });

    fetchData(); // Carico i dati al caricamento della pagina


    const darkModeToggle = document.getElementById("dark-mode-toggle");
    const darkModeText = document.getElementById("dark-mode-text");
    const icon = darkModeToggle.querySelector("i");
    const body = document.body;

    // Controlla se la dark mode è già attivata
    if (localStorage.getItem("darkMode") === "enabled") {
        body.classList.add("dark-mode");
        icon.classList.replace("fa-moon", "fa-sun");
        darkModeText.textContent = "Light Mode";
    }

    // Toggle Dark Mode
    darkModeToggle.addEventListener("click", function () {
        body.classList.toggle("dark-mode");

        if (body.classList.contains("dark-mode")) {
            localStorage.setItem("darkMode", "enabled");
            icon.classList.replace("fa-moon", "fa-sun");
            darkModeText.textContent = "Light Mode";
        } else {
            localStorage.setItem("darkMode", "disabled");
            icon.classList.replace("fa-sun", "fa-moon");
            darkModeText.textContent = "Dark Mode";
        }
    });


    const modal = document.getElementById("country-details-modal");
    const closeModal = document.querySelector(".close");

    function showCountryDetails(country) {
        document.getElementById("country-name").textContent = country.name;
        document.getElementById("country-flag").src = country.flag;
        document.getElementById("country-native-name").textContent = country.nativeName || "N/A";
        document.getElementById("country-capital").textContent = country.capital || "N/A";
        document.getElementById("country-population").textContent = country.population.toLocaleString();
        document.getElementById("country-region").textContent = country.region;
        document.getElementById("country-subregion").textContent = country.subregion;
        document.getElementById("country-tld").textContent = country.topLevelDomain ? country.topLevelDomain.join(", ") : "N/A";

        // Gestire i paesi confinanti
        if (country.borders && country.borders.length > 0) {
            document.getElementById("country-borders").textContent = country.borders.join(", ");
        } else {
            document.getElementById("country-borders").textContent = "None";
        }

        // Mostra il modal
        modal.classList.remove("hidden");
        modal.style.display = "flex";
    }

    closeModal.addEventListener("click", function () {
        modal.style.display = "none";
    });

    window.addEventListener("click", function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });

    // Carica i dati dal file JSON
    fetch("data.json")
        .then(response => response.json())
        .then(data => {
            container.innerHTML = "";
            data.forEach(country => {
                const card = document.createElement("div");
                card.classList.add("card");
                card.innerHTML = `
                    <img src="${country.flag}" alt="Flag of ${country.name}">
                    <h3>${country.name}</h3>
                    <p><strong>Capital:</strong> ${country.capital}</p>
                    <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
                    <p><strong>Region:</strong> ${country.region}</p>
                `;

                card.addEventListener("click", function () {
                    showCountryDetails(country);
                });

                container.appendChild(card);
            });
        })
        .catch(error => console.error("Errore nel caricamento dei dati:", error));
});

