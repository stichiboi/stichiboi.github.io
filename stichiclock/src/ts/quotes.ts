const quotes = require('../assets/quotes.json').quotes;

(function () {
    const changeQuoteInterval = 10000; //in ms
    const quoteDisplay = $('#quote');
    const quoteContainer = $('#quote-container .back-contrast')[0];

    setInterval(() => {
        const currId = quoteDisplay.attr('data-quote-id');

        const id = Math.floor(Math.random() * quotes.length);
        if(id.toString() !== currId){
            const quote = `${quotes[id].quote} - ${quotes[id].author}`;
            quoteDisplay.fadeOut(() => {
                quoteContainer.style.width = `min(${quote.length * 10}px, 80vw)`;
                quoteDisplay.text(quote);
                quoteDisplay.attr('data-quote-id', id);
                quoteDisplay.fadeIn();
                setTimeout(() => {

                }, 100);
            });
        }
    }, changeQuoteInterval);
})();
