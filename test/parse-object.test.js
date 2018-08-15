var expect = require('chai').expect;

var RefParser = require('../index');

describe('parse-object', function() {
    it('should parse object', function() {
        var refParser = RefParser();

        var obj = {
            refA: "valueA",
            refB: "%refA%",
            refC: "%refA%-%refB%",
            refD: {
                refE: 0,
                refNull: null,
                refUndefined: undefined
            },
            refFalse: false,
            refTrue: true,
            refF: "%refD.refE%-%refG%",
            refG: "%refD.refE%",
            arrayA: [
                "value1",
                "%refD%",
                "%refTrue%"
            ],
            refH: "%arrayA.1.refE%",
            refI: "%refD.refNull%",
            refJ: "%refD.refUndefined%",
            refK: "%refD.refNull%-value",
            refL: "%refFalse%"
        }

        refParser.parse(obj);

        expect(obj).to.deep.equals({
            refA: "valueA",
            refB: "valueA",
            refC: "valueA-valueA",
            refD: {
                refE: 0,
                refNull: null,
                refUndefined: undefined
            },
            refFalse: false,
            refTrue: true,
            refF: "0-0",
            refG: 0,
            arrayA: [
                "value1",
                {
                    refE: 0,
                    refNull: null,
                    refUndefined: undefined
                },
                true
            ],
            refH: 0,
            refI: null,
            refJ: undefined,
            refK: "null-value",
            refL: false
        });
    });

    it('should parse object by key', function() {
        var refParser = RefParser();

        var obj = {
            refA: "valueA",
            refB: "%refA%",
            refC: {
                refD: true
            },
            arrayA: [
                "value1",
                "%refB%",
                "%refC%"
            ]
        }

        refParser.parse(obj, 'arrayA');

        expect(obj).to.deep.equals({
            refA: "valueA",
            refB: "%refA%",
            refC: {
                refD: true
            },
            arrayA: [
                "value1",
                "valueA",
                {
                    refD: true
                }
            ]
        });
    });
});