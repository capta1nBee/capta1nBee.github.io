document.addEventListener("DOMContentLoaded", () => {
    const mainContent = document.getElementById("page-content");
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Check initial language
    const savedLang = localStorage.getItem('poyraz-lang') || 'en';
    setLang(savedLang);

    // Setup router
    window.addEventListener("hashchange", loadPage);
    
    // Initial load
    if(!window.location.hash) {
        window.location.hash = "#environments";
    } else {
        loadPage();
    }

    // Assign Lang buttons
    document.getElementById("btn-en").addEventListener("click", () => setLang("en"));
    document.getElementById("btn-tr").addEventListener("click", () => setLang("tr"));

    function setLang(lang) {
        document.body.setAttribute('data-lang', lang);
        document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
        document.getElementById('btn-' + lang).classList.add('active');
        localStorage.setItem('poyraz-lang', lang);
    }

    async function loadPage() {
        const hash = window.location.hash.substring(1) || "environments";
        
        // Update active nav
        navLinks.forEach(l => {
            l.classList.remove('active');
            if (l.getAttribute('href') === `#${hash}`) {
                l.classList.add('active');
            }
        });

        // Fade out
        mainContent.classList.add('fade-out');

        try {
            // Load the HTML fragment
            const response = await fetch(`pages/${hash}.html`);
            if(!response.ok) throw new Error("Page not found");
            
            const html = await response.text();
            
            setTimeout(() => {
                // Scroll to top
                document.querySelector('.content-wrapper').scrollTo(0,0);
                mainContent.innerHTML = html;
                mainContent.classList.remove('fade-out');
            }, 300); // match CSS fade transition
            
        } catch(e) {
            console.error("Routing error:", e);
            setTimeout(() => {
                mainContent.innerHTML = `<h2 class="en" style="color:var(--danger)">Page Not Found</h2><h2 class="tr" style="color:var(--danger)">Sayfa Bulunamadı</h2><p>The requested module (${hash}) could not be loaded.</p>`;
                mainContent.classList.remove('fade-out');
            }, 300);
        }
    }
});
