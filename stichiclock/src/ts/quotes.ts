const quotes = require('../assets/quotes.json').quotes;

const quoteDisplay = $('#quote');
const quoteContainer = $('#quote-container .back-contrast');

(function () {
    const changeQuoteInterval = 10000; //in ms
    //Immediately change to a quote, then setInterval to slow down
    changeQuote();
    let timer = setInterval(changeQuote, changeQuoteInterval);
    $('#quote-container').on('click', () => {
        changeQuote();
        //Reset timer countdown
        clearInterval(timer);
        timer = setInterval(changeQuote, changeQuoteInterval);
    });
})();

/**
 * If index is not specified or unavailable, select a random quote
 * @param index
 */
function changeQuote(index ?: number) {
    const currId = quoteDisplay.attr('data-quote-id');

    const id = index < quotes.length ? index : Math.floor(Math.random() * quotes.length);
    if (id.toString() !== currId) {
        const quote = `${quotes[id].q} - ${quotes[id].a}`;
        quoteDisplay.fadeOut(() => {
            quoteContainer.css('width', `min(${quote.length * 10}px, 80vw)`);
            quoteDisplay.text(quote);
            quoteDisplay.attr('data-quote-id', id);
            quoteDisplay.fadeIn();
        });
    }
}
