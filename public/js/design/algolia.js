(function() {
    var client = algoliasearch('6U15BJ87OK', '97a55b8ebb266b1b57f01f3ed49f9c94');
    var index = client.initIndex('products');
    var enterPressed = false;

    // Initialize autocomplete on search input (ID selector must match)
    autocomplete('#aa-search-input',
        { hint: false }, {
            source: autocomplete.sources.hits(index, { hitsPerPage: 10 }),
            // Value to be displayed in input control after user's suggestion selection
            displayKey: 'name',
            // Hash of templates used when rendering dataset
            templates: {
                // 'suggestion' templating function used to render a single suggestion
                suggestion: function (suggestion) {
                    const markup = `
                        <div class="algolia-result">
                            <span>
                                <img src="${window.location.origin}/public/storage/${suggestion.img_path}" alt="" class="algolia-thumb">
                                ${suggestion._highlightResult.name.value}
                            </span>
                            <span>$${(suggestion.cost / 100).toFixed(2)}</span>
                        </div>
                        <div class="algolia-details">
                            <span>${suggestion._highlightResult.description.value}</span>
                        </div>
                    `;
                    return markup;
                },
                empty: function (result) {
                    return 'Sorry, we did not find any results for "' + result.query + '"';
                }
            }
        }).on('autocomplete:selected', function (event, suggestion, dataset) {
            window.location.href = window.location.origin + '/product/' + suggestion.id;
            enterPressed = true;
        }).on('keyup', function(event) {
            if (event.keyCode == 13 && !enterPressed) {
                window.location.href = window.location.origin + '/search-algolia?q=' + document.getElementById('aa-search-input').value;
            }
        });
})();