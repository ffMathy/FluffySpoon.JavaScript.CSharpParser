# based on https://www.ecma-international.org/publications/files/ECMA-ST/ECMA-334.pdf

# TODO: use underscore to match spaces in grammar

@{% function rejecter(d, l, reject) { return reject; } %}
@{% function joiner(d) { return d.join(''); } %}

main ->
    input

input -> 
    input_section:?

input_section ->
    input_section_part |
    input_section input_section_part

input_section_part ->
    input_elements:? new_line
    pp_directive

input_elements ->
    input_element
    input_elements input_element

input_element ->
    whitespace
    comment
    token

charriage_return_character ->
    "\u000D"

line_feed_character ->
    "\u000A"

next_line_character ->
    "\u0085"

line_separator_character ->
    "\\u2028"
    # TODO: removing the double-slash here causes the unparser to crash.

paragraph_separator_character ->
    "\\u2029"
    # TODO: removing the double-slash here causes the unparser to crash.

new_line ->
    charriage_return_character |
    line_feed_character |
    charriage_return_character line_feed_character |
    next_line_character |
    line_separator_character |
    paragraph_separator_character

comment ->
    single_line_comment |
    delimited_comment

single_line_comment ->
    "//" input_characters:?

input_characters ->
    input_character |
    input_characters input_character

input_character ->
    new_line {% rejecter %} |
    unicode_character

unicode_character ->
    [\u0000-\uFFFF]

new_line_character ->
    charriage_return_character |
    line_feed_character |
    next_line_character |
    line_separator_character |
    paragraph_separator_character

delimited_comment ->
    "/*" delimited_comment_text:? asterisks "/"

delimited_comment_text ->
    delimited_comment_section |
    delimited_comment_text delimited_comment_section

delimited_comment_section ->
    "/" |
    asterisks:? not_slash_or_asterisk

asterisks ->
    "*" |
    asterisks "*"

not_slash_or_asterisk ->
    "/" {% rejecter %} |
    "*" {% rejecter %} |
    unicode_character

whitespace ->
    whitespace_character |
    whitespace whitespace_character

whitespace_character ->
    [\p{Z}] |
    horizontal_tab_character |
    vertical_tab_character |
    form_feed_character

horizontal_tab_character ->
    "\u0009"

vertical_tab_character ->
    "\u000B"

form_feed_character ->
    "\u000C"

token ->
    identifier |
    keyword |
    integer_literal |
    real_literal |
    character_literal |
    string_literal |
    operator_or_punctuator

unicode_escape_sequence ->
    "\\u" hex_digit hex_digit hex_digit hex_digit
    "\\U" hex_digit hex_digit hex_digit hex_digit hex_digit hex_digit hex_digit hex_digit

identifier ->
    available_identifier |
    "@" identifier_or_keyword

available_identifier ->
    keyword {% rejecter %} |
    identifier_or_keyword

identifier_or_keyword ->
    identifier_start_character identifier_part_characters:?

identifier_start_character ->
    letter_character |
    underscore_character

underscore_character ->
    "\u005F"
    # TODO: "A unicode-escape-sequence representing the character U+005F"

identifier_part_characters ->
    identifier_part_character |
    identifier_part_characters identifier_part_character

identifier_part_character ->
    letter_character |
    decimal_digit_character |
    connecting_character |
    combining_character |
    formatting_character

letter_character -> 
    [\p{Lu}] |
    [\p{Ll}] |
    [\p{Lt}] |
    [\p{Lm}] |
    [\p{Lo}] |
    [\p{Nl}]
    # TODO: "A unicode-escape-sequence representing a character of classes Lu, Ll, Lt, Lm, Lo, or Nl"

combining_character ->
    [\p{Mn}] |
    [\p{Mc}]
    # TODO: "A unicode-escape-sequence representing a character of classes Mn or Mc"

decimal_digit_character ->
    [\p{Nd}]
    # TODO: "A unicode-escape-sequence representing a character of the class Nd"

connecting_character ->
    [\p{Pc}]
    # TODO: "A unicode-escape-sequence representing a character of the class Pc"

formatting_character ->
    [\p{Cf}]
    # TODO: "A unicode-escape-sequence representing a character of the class Cf"

keyword ->
    "abstract" |
    "as" |
    "base" |
    "bool" |
    "break" |
    "byte" |
    "case" |
    "catch" |
    "char" | 
    "checked" |
    "class" |
    "const" | 
    "continue" |
    "decimal" |
    "default" |
    "delegate" | 
    "do" | 
    "double" |
    "else" | 
    "enum" |
    "event" |
    "explicit" |
    "extern" | 
    "false" |
    "finally" |
    "fixed" | 
    "float" | 
    "for" | 
    "foreach" | 
    "goto" | 
    "if" | 
    "implicit" | 
    "in" | 
    "int" | 
    "interface" | 
    "internal" | 
    "is" | 
    "lock" | 
    "long" | 
    "namespace" | 
    "new" | 
    "null" | 
    "object" | 
    "operator" | 
    "out" | 
    "override" | 
    "params" | 
    "private" | 
    "protected" | 
    "public" | 
    "readonly" | 
    "ref" | 
    "return" | 
    "sbyte" | 
    "sealed" | 
    "short" | 
    "sizeof" | 
    "stackalloc" | 
    "static" | 
    "string" | 
    "struct" | 
    "switch" | 
    "this" | 
    "throw" | 
    "true" | 
    "try" | 
    "typeof" | 
    "uint" | 
    "ulong" | 
    "unchecked" | 
    "unsafe" | 
    "ushort" | 
    "using" | 
    "virtual" | 
    "void" | 
    "volatile" | 
    "while"

contextual_keyword ->
    "add" | 
    "alias" | 
    "ascending" | 
    "async" | 
    "await" | 
    "by" | 
    "descending" | 
    "dynamic" | 
    "equals" | 
    "from" | 
    "get" | 
    "global" | 
    "group" | 
    "into" | 
    "join" | 
    "let" | 
    "orderby" | 
    "partial" | 
    "remove" | 
    "select" | 
    "set" | 
    "value" | 
    "var" | 
    "where" | 
    "yield"

literal ->
    boolean_literal |
    integer_literal |
    real_literal |
    character_literal |
    string_literal |
    null_literal

boolean_literal ->
    "true" | 
    "false"

integer_literal ->
    decimal_integer_literal |
    hexadecimal_integer_literal

decimal_integer_literal ->
    decimal_digits integer_type_suffix:?

decimal_digits ->
    decimal_digit |
    decimal_digits decimal_digit

decimal_digit ->
    "0" | 
    "1" | 
    "2" | 
    "3" | 
    "4" | 
    "5" | 
    "6" | 
    "7" | 
    "8" | 
    "9"

integer_type_suffix ->
    "U" | 
    "u" | 
    "L" | 
    "l" | 
    "UL" | 
    "Ul" | 
    "uL" | 
    "ul" | 
    "LU" | 
    "Lu" | 
    "lU" | 
    "lu"

hexadecimal_integer_literal ->
    "0x" hex_digits integer_type_suffix:? |
    "0X" hex_digits integer_type_suffix:?

hex_digits ->
    hex_digit |
    hex_digits hex_digit

hex_digit ->
    "0" | 
    "1" | 
    "2" | 
    "3" | 
    "4" | 
    "5" | 
    "6" | 
    "7" | 
    "8" | 
    "9" | 
    "A" | 
    "B" | 
    "C" | 
    "D" | 
    "E" | 
    "F" | 
    "a" | 
    "b" | 
    "c" | 
    "d" | 
    "e" | 
    "f"

real_literal ->
    decimal_digits "." decimal_digits exponent_part:? real_type_suffix:? |
    "." decimal_digits exponent_part:? real_type_suffix:? |
    decimal_digits exponent_part real_type_suffix:? |
    decimal_digits real_type_suffix

exponent_part ->
    "e" sign:? decimal_digits |
    "E" sign:? decimal_digits

sign ->
    "+" |
    "-"

real_type_suffix ->
    "F" | 
    "f" | 
    "D" | 
    "d" | 
    "M" | 
    "m"

character_literal ->
    "'" character "'"

character ->
    single_character |
    simple_escape_sequence |
    hexadecimal_escape_sequence |
    unicode_escape_sequence

single_character ->
    "\u0027" {% rejecter %} |
    "\u005C" {% rejecter %} |
    new_line_character {% rejecter %} |
    character

simple_escape_sequence ->
    "\\'" |
    "\\\"" |
    "\\\\" |
    "\\0" |
    "\\a" |
    "\\b" |
    "\\f" |
    "\\n" |
    "\\r" |
    "\\t" |
    "\\v"

hexadecimal_escape_sequence ->
    "\\x" hex_digit hex_digit:? hex_digit:? hex_digit:?

string_literal ->
    regular_string_literal |
    verbatim_string_literal

regular_string_literal ->
    "\"" regular_string_literal_characters:? "\""

regular_string_literal_characters ->
    regular_string_literal_character |
    regular_string_literal_characters regular_string_literal_character

regular_string_literal_character ->
    single_regular_string_literal_character |
    simple_escape_sequence |
    hexadecimal_escape_sequence |
    unicode_escape_sequence

single_regular_string_literal_character ->
    "\u0022" {% rejecter %} |
    "\u005C" {% rejecter %} |
    new_line_character {% rejecter %} |
    character

verbatim_string_literal ->
    "@\"" verbatim_string_literal_characters:? "\""

verbatim_string_literal_characters ->
    verbatim_string_literal_character |
    verbatim_string_literal_characters verbatim_string_literal_character

verbatim_string_literal_character ->
    single_verbatim_string_literal_character |
    quote_escape_sequence

single_verbatim_string_literal_character ->
    "\"" {% rejecter %} |
    character

quote_escape_sequence ->
    "\"\""

null_literal ->
    "null"

operator_or_punctuator ->
    "{" |
    "}" |
    "[" |
    "]" |
    "(" |
    ")" |
    "." |
    "," |
    ":" |
    ";" |
    "+" |
    "-" |
    "*" |
    "/" |
    "%" |
    "&" |
    "|" |
    "^" |
    "!" |
    "~" |
    "=" |
    "<" |
    ">" |
    "?" |
    "??" |
    "::" |
    "++" |
    "--" |
    "&&" |
    "||" |
    "->" |
    "==" |
    "!=" |
    "<=" |
    ">=" |
    "+=" |
    "-=" |
    "*=" |
    "/=" |
    "%=" |
    "&=" |
    "|=" |
    "^=" |
    "<<" |
    "<<="

right_shift ->
    ">>"

right_shift_assignment ->
    ">>="

pp_directive ->
    pp_declaration |
    pp_conditional |
    pp_line |
    pp_diagnostic |
    pp_region |
    pp_pragma

conditional_symbol ->
    "true" {% rejecter %} |
    "false" {% rejecter %} |
    identifier_or_keyword

pp_expression ->
    whitespace:? pp_or_expression whitespace:?

pp_or_expression ->
    pp_and_expression |
    pp_or_expression whitespace:? "||" whitespace:? pp_and_expression

pp_and_expression ->
    pp_equality_expression |
    pp_and_expression whitespace:? "&&" whitespace:? pp_equality_expression

pp_equality_expression ->
    pp_unary_expression |
    pp_equality_expression whitespace:? "==" whitespace:? pp_unary_expression |
    pp_equality_expression whitespace:? "!=" whitespace:? pp_unary_expression

pp_unary_expression ->
    pp_primary_expression |
    "!" whitespace:? pp_unary_expression

pp_primary_expression ->
    "true" |
    "false" |
    conditional_symbol |
    "(" whitespace:? pp_expression whitespace:? ")"

pp_declaration ->
    whitespace:? "#" whitespace:? "define" whitespace conditional_symbol pp_new_line |
    whitespace:? "#" whitespace:? "undef" whitespace conditional_symbol pp_new_line

pp_new_line ->
    whitespace:? single_line_comment:? new_line

pp_conditional ->
    pp_if_section pp_elif_sections:? pp_else_section:? pp_endif

pp_if_section ->
    whitespace:? "#" whitespace:? "if" whitespace pp_expression pp_new_line conditional_section:?

pp_elif_sections ->
    pp_elif_section |
    pp_elif_sections pp_elif_section

pp_elif_section ->
    whitespace:? "#" whitespace:? "elif" whitespace pp_expression pp_new_line conditional_section:?

pp_else_section ->
    whitespace:? "#" whitespace:? "else" pp_new_line conditional_section:?

pp_endif ->
    whitespace:? "#" whitespace:? "endif" pp_new_line

conditional_section ->
    input_section |
    skipped_section

skipped_section ->
    skipped_section_part |
    skipped_section skipped_section_part

skipped_section_part ->
    skipped_characters:? new_line |
    pp_directive

skipped_characters ->
    whitespace:? not_number_sign input_characters:?

not_number_sign ->
    "#" {% rejecter %} |
    input_character

pp_diagnostic ->
    whitespace:? "#" whitespace:? "error" pp_message |
    whitespace:? "#" whitespace:? "warning" pp_message

pp_message -> 
    new_line |
    whitespace input_characters:? new_line

pp_region ->
    pp_start_region conditional_section:? pp_end_region

pp_start_region ->
    whitespace:? "#" whitespace:? "region" pp_message

pp_end_region ->
    whitespace:? "#" whitespace:? "endregion" pp_message

pp_line ->
    whitespace:? "#" whitespace:? "line" whitespace line_indicator pp_new_line

line_indicator ->
    decimal_digits whitespace file_name |
    decimal_digits |
    "default" |
    "hidden"

file_name -> 
    "\"" file_name_characters "\""

file_name_characters ->
    file_name_character |
    file_name_characters file_name_character

file_name_character ->
    "\u0022" {% rejecter %} |
    new_line_character {% rejecter %} |
    input_character

pp_pragma ->
    whitespace:? "#" whitespace:? "pragma" pp_pragma_text

pp_pragma_text ->
    new_line |
    whitespace input_characters:? new_line