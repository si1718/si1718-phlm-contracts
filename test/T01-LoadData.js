describe('Data is load', function () {
    it('Should show a list of more than two contracts', function() {
        browser.get("https://localhost:8080");
        var contracts = element.all(by.repeater('contract in contracts'));
        expect(contracts.count()).toBeGreaterThan(2);
    })
});
