import { RegExHelper } from '../src/RegExHelper';
import isSafeRegEx = require('safe-regex');

describe("RegExHelper", function () {

    var regexHelper = new RegExHelper();

    var assertIsSafe = (name: keyof RegExHelper) => {
        it("should never time out for the regular expression " + name, () => {
            var regex = regexHelper[name].call(regexHelper);
            expect(isSafeRegEx(regex)).toBe(true, regex);
        });
    };

    assertIsSafe('getAttributeParameterRegex');
    assertIsSafe('getAttributeParametersRegex');
    assertIsSafe('getAttributeRegex');
    assertIsSafe('getAttributesRegex');
    assertIsSafe('getClassRegex');
    assertIsSafe('getEnumOptionRegex');
    assertIsSafe('getEnumRegex');
    assertIsSafe('getGenericNameRegex');
    assertIsSafe('getGenericTypeNameRegex');
    assertIsSafe('getGenericTypeWrapperRegex');
    assertIsSafe('getInterfaceRegex');
    assertIsSafe('getKeywordRegex');
    assertIsSafe('getLiteralCharacterRegex');
    assertIsSafe('getLiteralNumberDecimalRegex');
    assertIsSafe('getLiteralNumberHexadecimalRegex');
    assertIsSafe('getLiteralNumberIntegerRegex');
    assertIsSafe('getLiteralNumberRegex');
    assertIsSafe('getLiteralRegex');
    assertIsSafe('getLiteralStringRegex');
    assertIsSafe('getMethodParameterRegex');
    assertIsSafe('getMethodParametersWrapperRegex');
    assertIsSafe('getMethodRegex');
    assertIsSafe('getModifierRegex');
    assertIsSafe('getModifiersRegex');
    assertIsSafe('getNameRegex');
    assertIsSafe('getPropertyRegex');
    assertIsSafe('getSignRegex');
    assertIsSafe('getTypeConstraintRegex');
    assertIsSafe('getUsingRegex');
    assertIsSafe('getFieldRegex');
    assertIsSafe('getNamespaceRegex');
    assertIsSafe('getStructRegex');

});
