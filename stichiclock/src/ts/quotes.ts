const quotes = require('../assets/quotes.json').quotes;

const quoteDisplay = $('#quote');
const quoteContainer = $('#quote-container .back-contrast');

(function () {
    const changeQuoteInterval = 30000; //30s in ms
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
    const limit = window.innerHeight > 600 ? 1000 : 50;
    let id;
    do {
        id = Math.floor(Math.random() * quotes.length);
    } while (quotes[id].q.length > limit || id.toString() === currId);

    const quote = `${quotes[id].q} - ${quotes[id].a}`;
    quoteDisplay.fadeOut(() => {
        quoteContainer.css('width', `min(${quote.length * 12}px, 90vw)`);
        quoteDisplay.text(quote);
        quoteDisplay.attr('data-quote-id', id);
        quoteDisplay.fadeIn();
    });
}
