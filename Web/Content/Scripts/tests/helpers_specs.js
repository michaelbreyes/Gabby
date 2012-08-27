
describe('numberConverter', function () {
    describe('does single digits', function() {
        it('can handle 1', function () {
            var result = numberConverter.convert('1');
            expect(result).toEqual('one');
        });
        it('can handle 2', function () {
            var result = numberConverter.convert('2');
            expect(result).toEqual('two');
        });
        it('can handle 3', function () {
            var result = numberConverter.convert('3');
            expect(result).toEqual('three');
        });
        it('can handle 4', function () {
            var result = numberConverter.convert('4');
            expect(result).toEqual('four');
        });
        it('can handle 5', function () {
            var result = numberConverter.convert('5');
            expect(result).toEqual('five');
        });
        it('can handle 6', function () {
            var result = numberConverter.convert('6');
            expect(result).toEqual('six');
        });
        it('can handle 7', function () {
            var result = numberConverter.convert('7');
            expect(result).toEqual('seven');
        });
        it('can handle 8', function () {
            var result = numberConverter.convert('8');
            expect(result).toEqual('eight');
        });
        it('can handle 9', function () {
            var result = numberConverter.convert('9');
            expect(result).toEqual('nine');
        });
    });

    describe('does eleven through nineteen', function() {
        it('can handle 10', function () {
            var result = numberConverter.convert('10');
            expect(result).toEqual('ten');
        });
        it('can handle 11', function () {
            var result = numberConverter.convert('11');
            expect(result).toEqual('eleven');
        });
        it('can handle 12', function () {
            var result = numberConverter.convert('12');
            expect(result).toEqual('twelve');
        });
        it('can handle 13', function () {
            var result = numberConverter.convert('13');
            expect(result).toEqual('thirteen');
        });
        it('can handle 14', function () {
            var result = numberConverter.convert('14');
            expect(result).toEqual('fourteen');
        });
        it('can handle 15', function () {
            var result = numberConverter.convert('15');
            expect(result).toEqual('fifteen');
        });
        it('can handle 16', function () {
            var result = numberConverter.convert('16');
            expect(result).toEqual('sixteen');
        });
        it('can handle 17', function () {
            var result = numberConverter.convert('17');
            expect(result).toEqual('seventeen');
        });
        it('can handle 18', function () {
            var result = numberConverter.convert('18');
            expect(result).toEqual('eighteen');
        });
        it('can handle 19', function () {
            var result = numberConverter.convert('19');
            expect(result).toEqual('nineteen');
        });
    });

    describe('does double digits past nineteen', function() {
        it('can handle 20', function () {
            var result = numberConverter.convert('20');
            expect(result).toEqual('twenty');
        });
        it('can handle 21', function () {
            var result = numberConverter.convert('21');
            expect(result).toEqual('twenty-one');
        });
        it('can handle 28', function () {
            var result = numberConverter.convert('28');
            expect(result).toEqual('twenty-eight');
        });
        it('can handle 33', function () {
            var result = numberConverter.convert('33');
            expect(result).toEqual('thirty-three');
        });
        it('can handle 45', function () {
            var result = numberConverter.convert('45');
            expect(result).toEqual('forty-five');
        });
        it('can handle 57', function () {
            var result = numberConverter.convert('57');
            expect(result).toEqual('fifty-seven');
        });
        it('can handle 69', function () {
            var result = numberConverter.convert('69');
            expect(result).toEqual('sixty-nine');
        });
        it('can handle 71', function () {
            var result = numberConverter.convert('71');
            expect(result).toEqual('seventy-one');
        });
        it('can handle 82', function () {
            var result = numberConverter.convert('82');
            expect(result).toEqual('eighty-two');
        });
        it('can handle 90', function () {
            var result = numberConverter.convert('90');
            expect(result).toEqual('ninety');
        });
    });

    describe('does triple digits', function() {
        it('can handle 100', function () {
            var result = numberConverter.convert('100');
            expect(result).toEqual('one hundred');
        });
        it('can handle 142', function () {
            var result = numberConverter.convert('142');
            expect(result).toEqual('one hundred forty-two');
        });
        it('can handle 578', function () {
            var result = numberConverter.convert('578');
            expect(result).toEqual('five hundred seventy-eight');
        });
    });

    describe('does four digits', function() {
        it('can handle 1000', function () {
            var result = numberConverter.convert('1000');
            expect(result).toEqual('one thousand');
        });
        it('can handle 1001', function () {
            var result = numberConverter.convert('1001');
            expect(result).toEqual('one thousand, one');
        });
        it('can handle 3042', function () {
            var result = numberConverter.convert('3042');
            expect(result).toEqual('three thousand, forty-two');
        });
        it('can handle 9912', function () {
            var result = numberConverter.convert('9912');
            expect(result).toEqual('nine thousand, nine hundred twelve');
        });
    });

    describe('does more than four digits', function() {
        it('can handle 19912', function () {
            var result = numberConverter.convert('19912');
            expect(result).toEqual('nineteen thousand, nine hundred twelve');
        });
        it('can handle 875432', function () {
            var result = numberConverter.convert('875432');
            expect(result).toEqual('eight hundred seventy-five thousand, four hundred thirty-two');
        });
        it('can handle 1875432', function () {
            var result = numberConverter.convert('1875432');
            expect(result).toEqual('one million, eight hundred seventy-five thousand, four hundred thirty-two');
        });
        it('can handle 101875432', function () {
            var result = numberConverter.convert('101875432');
            expect(result).toEqual('one hundred one million, eight hundred seventy-five thousand, four hundred thirty-two');
        });
        it('can handle 100101875432', function () {
            var result = numberConverter.convert('100101875432');
            expect(result).toEqual('one hundred billion, one hundred one million, eight hundred seventy-five thousand, four hundred thirty-two');
        });
        it('can handle 123456789', function () {
            var result = numberConverter.convert('123456789');
            expect(result).toEqual('one hundred twenty-three million, four hundred fifty-six thousand, seven hundred eighty-nine');
        });
    });
})