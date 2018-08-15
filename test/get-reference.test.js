var expect = require('chai').expect;

var RefParser = require('../index');

describe('get-reference', function() {
    it('should get references', function() {
        var refParser = RefParser();

        expect(refParser.getReferenceKeys('ref')).to.deep.equals([]);
        expect(refParser.getReferenceKeys('%ref%')).to.deep.equals(['%ref%']);
        expect(refParser.getReferenceKeys('%refA%-%refB%')).to.deep.equals(['%refA%', '%refB%']);
    });
    it('should get reference with custom char key', function() {
        var refParser = RefParser();

        expect(refParser.getReferenceKeys('%ref%', '=')).to.deep.equals([]);
        expect(refParser.getReferenceKeys('=ref=', '=')).to.deep.equals(['=ref=']);

    });
    it('should get reference with custom char key from options', function() {
        var refParser = RefParser({
            referenceCharKey: "="
        });

        expect(refParser.getReferenceKeys('%ref%')).to.deep.equals([]);
        expect(refParser.getReferenceKeys('=ref=')).to.deep.equals(['=ref=']);
    });
});