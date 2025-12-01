(function() {
    // Configuration
    const RETRY_INTERVAL = 300;
    const MAX_RETRIES = 20;

    /**
     * Initialize pan-zoom on a single SVG element
     */
    function addPanZoom(svgElement) {
        // Prevent double initialization
        if (svgElement.getAttribute('data-pan-zoom-enabled')) {
            return;
        }

        // Ensure we have a valid ID
        if (!svgElement.id) {
            svgElement.id = 'mermaid-' + Math.random().toString(36).substr(2, 9);
        }

        // Ensure the SVG is visible/rendered to avoid bbox errors
        try {
            // Basic check if it's an SVG element in the DOM
            if (typeof svgElement.getBBox !== 'function') {
                return; 
            }
            
            // Initialize svg-pan-zoom
            svgPanZoom('#' + svgElement.id, {
                zoomEnabled: true,
                controlIconsEnabled: true,
                fit: true,
                center: true,
                minZoom: 0.5,
                maxZoom: 10,
                // These refresh rates help with resizing
                refreshRate: 'auto', 
            });

            // Mark as initialized
            svgElement.setAttribute('data-pan-zoom-enabled', 'true');
            
            // Handle container sizing to ensure decent usable area
            const parent = svgElement.parentElement;
            if (parent) {
                // Capture original rendered height
                const rect = svgElement.getBoundingClientRect();
                // Enforce a minimum height of 600px, or use the natural height if it's taller
                const targetHeight = Math.max(600, rect.height);
                
                // Apply styles to parent
                parent.style.height = targetHeight + 'px';
                parent.style.overflow = 'hidden'; // Clip content that pans outside
                parent.style.position = 'relative';
                
                // Ensure SVG fills the new container dimensions
                svgElement.style.height = '100%';
                svgElement.style.width = '100%';
            }

        } catch (error) {
            console.warn('Mermaid Zoom: Failed to initialize for', svgElement.id, error);
        }
    }

    /**
     * Find and initialize all mermaid diagrams
     */
    function initAllDiagrams() {
        if (typeof svgPanZoom === 'undefined') return;
        
        // astro-mermaid usually renders as .mermaid > svg
        const diagrams = document.querySelectorAll('.mermaid svg, svg.mermaid');
        diagrams.forEach(addPanZoom);
    }

    /**
     * Check if library is loaded and diagrams are present
     */
    function checkAndInit(count = 0) {
        if (typeof svgPanZoom === 'undefined') {
            if (count < MAX_RETRIES) {
                setTimeout(() => checkAndInit(count + 1), RETRY_INTERVAL);
            } else {
                console.warn('Mermaid Zoom: svg-pan-zoom library not loaded after timeout');
            }
            return;
        }
        
        initAllDiagrams();
    }

    // Setup MutationObserver to handle dynamically loaded diagrams (SPA/View Transitions)
    const observer = new MutationObserver((mutations) => {
        let shouldCheck = false;
        for (const mutation of mutations) {
            if (mutation.addedNodes.length > 0) {
                shouldCheck = true;
                break;
            }
        }
        if (shouldCheck) {
            initAllDiagrams();
        }
    });

    // Start observation and initial check
    function start() {
        checkAndInit();
        // Observe body for changes
        observer.observe(document.body, { 
            childList: true, 
            subtree: true 
        });
    }

    // Hook into Astro events and window load
    if (document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', start);
    } else {
        start();
    }

    // Re-run on Astro page transitions
    document.addEventListener('astro:page-load', () => {
        checkAndInit();
    });
    
    document.addEventListener('astro:after-swap', () => {
        checkAndInit();
    });

})();
