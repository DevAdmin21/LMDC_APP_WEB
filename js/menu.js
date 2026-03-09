const boton = document.getElementById('btn-menu');
const menu = document.getElementById('menu-desplegable');
const icono = document.getElementById('icono-interfaz');

boton.addEventListener('click', () => {
    menu.classList.toggle('navegacion__menu--activo');
    
    // Cambiar icono y color
    if (menu.classList.contains('navegacion__menu--activo')) {
        icono.classList.replace('fa-bars', 'fa-xmark');
        icono.style.color = 'rgb(234, 241, 88)';
    } else {
        icono.classList.replace('fa-xmark', 'fa-bars');
        icono.style.color = '#FFFFFF';
    }
});