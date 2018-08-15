var expect = require('chai').expect;

var RefParser = require('../index');

describe('valid-reference', function() {
    it('should has reference', function() {
        var refParser = RefParser();

        expect(refParser.hasReferences('ref')).to.equals(false);
        expect(refParser.hasReferences('%ref%')).to.equals(true);
        expect(refParser.hasReferences('prefix%ref%suffix')).to.equals(true);
        expect(refParser.hasReferences('%ref%suffix')).to.equals(true);
        expect(refParser.hasReferences('prefix%ref%')).to.equals(true);
    });
    it('should has multi references', function() {
        var refParser = RefParser();

        expect(refParser.hasReferences('%refA%/%refB%')).to.equals(true);
    });
    it('should has reference with custom char key', function() {
        var refParser = RefParser();

        expect(refParser.hasReferences('%ref%', '=')).to.equals(false);
        expect(refParser.hasReferences('=ref=', '=')).to.equals(true);
    });
    it('should has reference with custom char key from options', function() {
        var refParser = RefParser({
            referenceCharKey: "="
        });

        expect(refParser.hasReferences('%ref%')).to.equals(false);
        expect(refParser.hasReferences('=ref=')).to.equals(true);
    });
});