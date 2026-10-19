document.addEventListener('DOMContentLoaded', () => {
    const secret = document.querySelector('.secret-button');
    if (!secret) {
        return;
    }

    const updateSecretVisibility = () => {
        const nearBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 50;
        secret.classList.toggle('visible', nearBottom);
    };

    window.addEventListener('scroll', updateSecretVisibility, { passive: true });
    window.addEventListener('resize', updateSecretVisibility);
    updateSecretVisibility();
});