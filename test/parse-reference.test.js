var expect = require('chai').expect;

var RefParser = require('../index');

describe('parse-reference', function() {
    it('should parse references', function() {
        var refParser = RefParser();

        var obj = {
            "ref": "value",
            "refA": "valueA",
            "refB": "valueB",
            "refC": {
                "refD": "valueD"
            }
        }

        expect(refParser.parseReferences('%ref%', obj)).to.equals(obj.ref);
        expect(refParser.parseReferences('%ref%-%ref%', obj)).to.equals(obj.ref + '-' + obj.ref);
        expect(refParser.parseReferences('%refA%-%refB%', obj)).to.equals(obj.refA + '-' + obj.refB);
        expect(refParser.parseReferences('%refA%-%refC.refD%', obj)).to.equals(obj.refA + '-' + obj.refC.refD);
    });
});