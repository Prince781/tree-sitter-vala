module.exports = grammar({
  name: 'vala',

  rules: {
    source_file: $ => seq(repeat($.using_directive), repeat($.namespace_member)),

    // taken from tree-sitter-c
    // http://stackoverflow.com/questions/13014947/regex-to-match-a-c-style-multiline-comment/36328890#36328890
    comment: $ => token(choice(
      seq('//', /(\\(.|\r?\n)|[^\\\n])*/),
      seq(
        '/*',
        /[^*]*\*+([^/*][^*]*\*+)*/,
        '/'
      )
    )),

    using_directive: $ => seq(
      'using',
      $.symbol,
      repeat(seq(',', $.symbol)),
      ';'
    ),

    symbol: $ => seq(optional('global::'), $.identifier, repeat(seq('.', $.identifier))),

    identifier: $ => /[A-Za-z_]\w*/,

    namespace_member: $ => seq(
      repeat($.attribute),
      choice(
        $.namespace_declaration,
        $.method_declaration,
        $.field_declaration
      )
    ),

    attribute: $ => seq(
      '[',
      $.identifier,
      optional(seq('(', $.attribute_argument, repeat(seq(',', $.attribute_argument)), ')')),
      ']'
    ),

    attribute_argument: $ => seq(
      $.identifier,
      '=',
      $._expression
    ),

    _expression: $ => choice(
        $.literal,
        seq('(', $._expression, ')'),
        $.member_access_expression,
        $.method_call_expression,
        $.postfix_expression,
        $.static_cast_expression,
        $.typeof_expression,
        $.sizeof_expression,
        $.unary_expression,
        $.multiplicative_expression,
        $.arithmetic_expression,
        $.in_expression,
        $.bitshift_expression,
        $.dynamic_cast_expression,
        $.type_relational_expression,
        $.relational_expression,
        $.equality_expression,
        $.bitwise_and_expression,
        $.bitwise_xor_expression,
        $.bitwise_or_expression,
        $.logical_and_expression,
        $.logical_or_expression,
        $.null_coalescing_expression,
        $.ternary_expression,
        $.assignment_expression,
        // --- expressions that do not have a precedence
        $.object_creation_expression
    ),

    member_access_expression: $ => prec.right(15,
      seq(
        optional(seq(
          choice(
            $.identifier,
            seq('(', $._expression, ')')
          ),
          choice('.', '?.', '->'),
        )),
        $.identifier
      ),
    ),

    method_call_expression: $ => prec.right(15,
      seq(
        choice(
          seq('(', $._expression, ')'),
          seq($.member_access_expression, optional($.type_arguments))
        ),
        '(',
        optional(seq($._expression, repeat(seq(',', $._expression)))),
        ')'
      )
    ),

    postfix_expression: $ => prec.left(14, seq($._expression, choice('++', '--'))),
    static_cast_expression: $ => prec.right(13, seq(seq('(', $.type, ')'), $._expression)),
    typeof_expression: $ => prec.right(13, seq('typeof', '(', $._expression, ')')),
    sizeof_expression: $ => prec.right(13, seq('sizeof', '(', $.type, ')')),
    unary_expression: $ => prec.right(13, seq(choice('!', '~', '++', '--', '-', '*', '&'), $._expression)),
    multiplicative_expression: $ => prec.left(12, seq($._expression, choice('*', '/', '%'), $._expression)),
    arithmetic_expression: $ => prec.left(11, seq($._expression, choice('+', '-'), $._expression)),
    bitshift_expression: $ => prec.left(10, seq($._expression, choice('<<', '>>'), $._expression)),
    in_expression: $ => prec.left(9, seq($._expression, optional('not'), 'in', $._expression)),
    dynamic_cast_expression: $ => prec.left(9, seq($._expression, 'as', $.type)),
    type_relational_expression: $ => prec.left(9, seq($._expression, 'is', $.type)),
    relational_expression: $ => prec.left(9, seq($._expression, choice('<', '<=', '>=', '>'), $._expression)),
    equality_expression: $ => prec.left(8, seq($._expression, choice('==', '!='), $._expression)),
    bitwise_and_expression: $ => prec.left(7, seq($._expression, '&', $._expression)),
    bitwise_xor_expression: $ => prec.left(6, seq($._expression, '^', $._expression)),
    bitwise_or_expression: $ => prec.left(5, seq($._expression, '|', $._expression)),
    logical_and_expression: $ => prec.left(4, seq($._expression, '&&', $._expression)),
    logical_or_expression: $ => prec.left(3, seq($._expression, '||', $._expression)),
    null_coalescing_expression: $ => prec.left(2, seq($._expression, '??', $._expression)),
    ternary_expression: $ => prec.right(1, seq($._expression, '?', $._expression, ':', $._expression)),

    _assignment_operator: $ => choice('=', '+=', '-=', '|=', '&=', '^=', '/=', '*=', '%=', '<<=', '>>='),
    assignment_expression: $ => prec.right(0, seq($._expression, $._assignment_operator, $._expression)),

    oce_type: $ => seq(
      $.symbol,
      optional($.type_arguments),
    ),

    object_creation_expression: $ => seq(
      'new',
      $.oce_type,
      '(',
      optional(seq($._expression, repeat(seq(',', $._expression)))),
      ')'
    ),

    boolean: $ => choice('true', 'false'),
    character: $ => /'\S'/,
    integer: $ => choice(/[1-9]\d*|0[0-7]*/, /0[xX][A-Fa-f0-9]+/),
    null: $ => 'null',
    real: $ => /\d+(\.\d+)?([eE][+-]?\d+)?/,
    regex: $ => /\/([^\\\/\n]|\\[\\\/A-z0|\[\]^$?.(){}+\-*])+\/[gmxsu]*/,
    string: $ => /"([^"]+|\\")*"/,
    template_string: $ => seq(
      '@"',
      repeat(choice(/([^$"]+|\\")+/, $.template_string_expression)),
      '"'
    ),
    template_string_expression: $ => choice(
      seq('$(', $._expression, ')'),
      seq('$', $.identifier)
    ),
    verbatim_string: $=> /"""(.|\n)*"""/,

    literal: $ => choice(
        $.boolean,
        $.null,
        $.character,
        $.integer,
        $.real,
        $.regex,
        $.string,
        $.template_string,
        $.verbatim_string
    ),

    type: $ => prec.right(
      choice(
        seq('void', repeat('*')),
        seq(
          optional('dynamic'),
          optional('unowned'),
          optional('weak'),
          '(',
          $.type,
          ')',
          repeat1($.array_type)
        ),
        seq(
          optional('dynamic'),
          optional('unowned'),
          optional('weak'),
          $.symbol,
          optional($.type_arguments),
          optional('*'),
          optional('?'),
          repeat($.array_type)
        )
      )
    ),

    type_arguments: $ => seq(
      '<',
      $.type,
      repeat(seq(',', $.type)),
      '>'
    ),

    array_type: $ => prec.right(
      seq(
        '[',
        optional($.array_size),
        ']',
        optional('?')
      )
    ),

    array_size: $ => seq(
      $._expression,
      repeat(seq(',', $._expression))
    ),

    member_declaration_modifier: $ => choice(
      'async',
      'class',
      'extern',
      'inline',
      'static',
      'abstract',
      'virtual',
      'override',
      'new'
    ),

    access_modifier: $ => choice(
      'private',
      'protected',
      'internal',
      'public'
    ),

    namespace_declaration: $ => seq(
      'namespace',
      $.symbol,
      '{',
      repeat($.using_directive),
      repeat($.namespace_member),
      '}'
    ),

    parameter: $ => seq(
      $.type,
      $.identifier,
      optional(seq('=', $._expression))
    ),

    method_declaration: $ => seq(
      optional($.access_modifier),
      repeat($.member_declaration_modifier),
      $.type,
      $.identifier,
      optional($.type_arguments),
      '(',
      optional(seq($.parameter, repeat(seq(',', $.parameter)))),
      ')',
      optional(seq('throws', $.type)),
      optional(seq(choice('requires', 'ensures'), '(', $._expression, ')')),
      choice($.block, ';')
    ),

    field_declaration: $ => seq(
      optional($.access_modifier),
      repeat($.member_declaration_modifier),
      $.type,
      $.identifier,
      optional(seq('=', $._expression)),
      ';'
    ),

    local_declaration: $ => seq(
        $.type,
        $.identifier,
        optional(seq('=', $._expression)),
        ';'
    ),

    block: $ => seq('{', repeat($._statement), '}'),

    _statement: $ => choice(
      $.block,
      ';',
      seq($._expression, ';'),
      $.local_declaration
      // TODO - for, while, if, foreach
    )
  },

  conflicts: $ => [
    [$.type, $._expression],       // for static_cast_expression
  ],

  extras: $ => [
    /\s|\\\r?\n/,
    $.comment,
  ],
});
