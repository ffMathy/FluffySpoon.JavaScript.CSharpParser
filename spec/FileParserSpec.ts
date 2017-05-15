import { FileParser } from '../src/FileParser';

describe("FileParser", function () {

    it("should be able to fetch usings", function () {
        var parser = new FileParser("using foo=buz.bar;\nusing blah.lol.omg;");
        var file = parser.parseFile();

        expect(file.usings.length).toEqual(2);

        expect(file.usings[0].alias).toEqual('foo');
        expect(file.usings[0].namespace.fullName).toEqual('buz.bar');

        expect(file.usings[1].alias).toBeUndefined();
        expect(file.usings[1].namespace.fullName).toEqual('blah.lol.omg');
    });

});
