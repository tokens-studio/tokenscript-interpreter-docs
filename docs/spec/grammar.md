---
title: Grammar Appendix (EBNF)
description: Approximate EBNF grammar derived from the TokenScript parser implementation.
sidebar_label: Grammar
---

# Grammar Appendix (EBNF)

The following Extended Backus–Naur Form (EBNF) summarizes the syntax accepted by the TokenScript parser (`src/interpreter/parser.ts`). The grammar elides whitespace/comment rules, which are handled lexically, and focuses on syntactic structure.

```ebnf
program          ::= statement-list EOF ;

statement-list   ::= { statement [";"] } ;

statement        ::= variable-declaration
                   | assignment
                   | attribute-assignment
                   | return-statement
                   | if-statement
                   | while-statement
                   | expression ;

variable-declaration
                 ::= "variable" IDENT ":" type-declaration ["=" expression] ;

type-declaration ::= IDENT {"." IDENT} ;

assignment       ::= IDENT "=" expression ;

attribute-assignment
                 ::= attribute-chain "=" expression ;

attribute-chain  ::= IDENT "." IDENT {"." IDENT} ;

return-statement ::= "return" expression ;

if-statement     ::= "if" "(" expression ")" block
                     {"elif" "(" expression ")" block}
                     ["else" block] ;

while-statement  ::= "while" "(" expression ")" block ;

block            ::= "[" statement-list "]" ;

expression       ::= logic-term {("&&" | "||") logic-term} ;

logic-term       ::= comparison {("+" | "-") comparison} ;   (* addition/subtraction level *)

comparison       ::= term {("==" | "!=" | ">=" | "<=" | ">" | "<") term} ;

term             ::= power {("*" | "/") power} ;

power            ::= factor {"^" factor} ;

factor           ::= ("+" | "-" | "!") factor
                   | number
                   | boolean
                   | "null"
                   | hex-color
                   | explicit-string access-tail
                   | "(" expression ")" [UNIT]
                   | reference access-tail
                   | identifier-or-call access-tail ;

number           ::= NUMBER [UNIT] ;

boolean          ::= "true" | "false" ;

hex-color        ::= HEX_COLOR_LITERAL ;

explicit-string  ::= STRING_LITERAL ;

reference        ::= "{" reference-name "}" ;

reference-name   ::= IDENT {"." IDENT} ;

identifier-or-call
                 ::= IDENT ["(" argument-list ")"] ;

argument-list    ::= expression {"," expression} ;

access-tail      ::= { "." ( IDENT ["(" argument-list ")"]
                          | "(" argument-list ")" ) } ;

list-expression  ::= expression {"," expression} ;
```

### Notes

- `list-expression` leverages the same `expression` production; when multiple expressions are separated by commas the parser constructs a `ListNode`.
- Parenthesized expressions may optionally carry a trailing unit (`(expr)px`), matching lexer behavior.
- Attribute/method access is chained freely (`color.to.oklch().values()`).
- Identifiers that are not previously declared resolve as `String` literals at runtime; the grammar treats them as `identifier-or-call`.

Refer back to [Lexical Syntax](syntax.md) for token definitions and reserved keywords.
