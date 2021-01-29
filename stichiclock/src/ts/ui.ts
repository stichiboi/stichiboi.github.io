const mainNavIcons = $('#main-navigation .icon');

mainNavIcons.on('click', event => {
    mainNavIcons.removeClass('toggled');
    event.currentTarget.classList.add('toggled');
});