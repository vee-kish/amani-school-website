function initMobileMenu() {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const closeBtn = document.getElementById('mobile-menu-close');
    const menu = document.getElementById('mobile-menu');
    const overlay = document.getElementById('mobile-menu-overlay');
    const menuIcon = document.getElementById('mobile-menu-icon');

    if (!menuBtn || !closeBtn || !menu || !overlay || !menuIcon) return;

    const links = menu.querySelectorAll('a');
    let lastFocusedElement = null;

    const openMenu = () => {
        lastFocusedElement = document.activeElement;

        menu.classList.remove('opacity-0', 'invisible', '-translate-y-4');
        menu.classList.add('opacity-100', 'visible', 'translate-y-0');

        overlay.classList.remove('opacity-0', 'invisible');
        overlay.classList.add('opacity-100', 'visible');

        menu.setAttribute('aria-hidden', 'false');
        menuBtn.setAttribute('aria-expanded', 'true');
        menuBtn.setAttribute('aria-label', 'Close menu');
        menuIcon.textContent = 'close';
        document.body.classList.add('overflow-hidden');

        const firstLink = menu.querySelector('a');
        if (firstLink) firstLink.focus();
    };

    const closeMenu = () => {
        menu.classList.add('opacity-0', 'invisible', '-translate-y-4');
        menu.classList.remove('opacity-100', 'visible', 'translate-y-0');

        overlay.classList.add('opacity-0', 'invisible');
        overlay.classList.remove('opacity-100', 'visible');

        menu.setAttribute('aria-hidden', 'true');
        menuBtn.setAttribute('aria-expanded', 'false');
        menuBtn.setAttribute('aria-label', 'Open menu');
        menuIcon.textContent = 'menu';
        document.body.classList.remove('overflow-hidden');

        if (
            lastFocusedElement &&
            typeof lastFocusedElement.focus === 'function'
        ) {
            lastFocusedElement.focus();
        } else {
            menuBtn.focus();
        }
    };

    const toggleMenu = () => {
        const isOpen = menuBtn.getAttribute('aria-expanded') === 'true';
        if (isOpen) closeMenu();
        else openMenu();
    };

    menuBtn.addEventListener('click', toggleMenu);
    closeBtn.addEventListener('click', closeMenu);
    overlay.addEventListener('click', closeMenu);

    links.forEach((link) => {
        link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', (e) => {
        if (
            e.key === 'Escape' &&
            menuBtn.getAttribute('aria-expanded') === 'true'
        ) {
            closeMenu();
        }
    });
}

window.addEventListener('amaniNavLoaded', initMobileMenu);

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('mobile-menu-btn')) {
        initMobileMenu();
    }
});
