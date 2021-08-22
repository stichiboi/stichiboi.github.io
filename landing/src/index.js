import './css/main.css'
import './css/content.css'
import './css/responsive.css'
import './css/text.css'
import './css/planetary.css'
import './ts/main'

window.addEventListener('DOMContentLoaded', () => {
    document.getElementsByTagName('body')[0].classList.add('is-loaded');
    document.getElementById('page-loader').classList.add('fade-out');
});

