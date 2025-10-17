---
title: Types and Symbols
description: Runtime types, default values, methods, and attribute semantics in TokenScript.
sidebar_label: Types
---

TODO underscore vs camelCase in method names

# Types and Symbols

Every TokenScript variable declaration specifies a type using `Type` or `Type.SubType` notation. The interpreter enforces type correctness during assignment and method calls by instantiating corresponding `Symbol` classes (`src/interpreter/symbols.ts`). This chapter documents each built-in type.

## Declarations & Defaults

- `variable name: Type;` initializes `name` with the type’s `empty()` value, if no initializer is provided.
- Subtypes (`Type.SubType`) are primarily used for colors. For other types, the interpreter treats `Type` and `Type.Something` equivalently unless extension managers add meaning.
- Reassignments must respect the declared type; the interpreter throws an `InterpreterError` on mismatch.

## Primitive Types

### Number

- Represents integers or floating-point values.
- Declared with `Number`.
- Default value: `null` (represented by `NumberSymbol.empty()`).
- Methods:

| Method | Signature | Description |
| --- | --- | --- |
| `toString` | `Number.toString(radix?: Number)` | Returns the numeric value as a string. Radix (2–36) is optional; base 16 rounds halves downward for color conversions. |

- Attributes: `value` (read-only `Number`).

### String

- Represents UTF-8 strings.
- Declared with `String`.
- Default value: `null`.
- Methods:

| Method | Signature | Description |
| --- | --- | --- |
| `upper` | `String.upper()` | Converts to uppercase. |
| `lower` | `String.lower()` | Converts to lowercase. |
| `length` | `String.length()` | Returns length as `Number`. |
| `concat` | `String.concat(other: String)` | Concatenates two strings. |
| `split` | `String.split(delimiter?: String)` | Splits into a `List` of `String`; default delimiter splits into characters. |

### Boolean

- Represents true/false values.
- Declared with `Boolean`.
- Default value: `null`.
- No methods; use logical operators for manipulation.

### Null

- Declared explicitly with `Null`.
- Represents absence of value; equality comparisons treat all nulls as equal.

## NumberWithUnit

- Combines numeric values with design units (px, rem, %, deg, etc.).
- Declared with `NumberWithUnit` or a specific unit subtype (`NumberWithUnit.px`).
- Methods:

| Method | Signature | Description |
| --- | --- | --- |
| `toString` | `NumberWithUnit.toString()` | Renders numeric value followed by unit (e.g., `"16px"`). |
| `to_number` | `NumberWithUnit.to_number()` | Returns the unitless numeric value. |

- Attributes: `value` (`Number`).
- Arithmetic operators respect units; the `UnitManager` converts compatible units or throws descriptive errors (e.g., mixing `px` and `deg`).

## List

- Heterogeneous ordered collection.
- Declared with `List`. Subtype hints (e.g., `List.String`) are allowed syntactically but not enforced at runtime.
- Created via comma-separated literals or dynamic operations.
- Methods:

| Method | Signature | Description |
| --- | --- | --- |
| `append` | `List.append(item)` | Adds an item to the end (returns the list). |
| `extend` | `List.extend(...items)` | Appends items or lists. |
| `insert` | `List.insert(index: Number, item)` | Inserts at position. |
| `delete` | `List.delete(index: Number)` | Removes item at index. |
| `length` | `List.length()` | Returns length as `Number`. |
| `index` | `List.index(item)` | Returns first matching index or `-1`. |
| `get` | `List.get(index: Number)` | Retrieves element. |
| `update` | `List.update(index: Number, item)` | Replaces element. |
| `join` | `List.join(separator?: String)` | Joins elements into a `String`. |

- Lists preserve insertion order; some interpreter operations (e.g., implicit lists from color ramps) render without commas.

## Dictionary

- Map of string keys to symbol values.
- Declared with `Dictionary`.
- Methods:

| Method | Signature | Description |
| --- | --- | --- |
| `get` | `Dictionary.get(key: String)` | Returns the stored value or `null`. |
| `set` | `Dictionary.set(key: String, value)` | Assigns a key and returns the dictionary. |
| `delete` | `Dictionary.delete(key: String)` | Removes a key if present. |
| `keys` | `Dictionary.keys()` | Returns keys as `List`. |
| `values` | `Dictionary.values()` | Returns values as `List`. |
| `keyexists` / `key_exists` | `Dictionary.keyexists(key: String)` | Returns `Boolean` flag. |
| `length` | `Dictionary.length()` | Number of entries. |
| `clear` | `Dictionary.clear()` | Removes all entries. |

- Attribute access retrieves entries directly (`dictionary.someKey`), mirroring `get`.

## Color

- Represents color values supplied as hex strings or structured components.
- Declared with `Color` or `Color.SubType` (e.g., `Color.SRGB`, `Color.Oklch`).
- Constructors:
  - Hex literals (`#FFEE00`) create `Color.Hex`.
  - Schema-driven initializers (registered via `ColorManager`) can be invoked as functions (e.g., `srgb(255, 0, 0)` when provided by a schema).
- Methods:

| Method | Signature | Description |
| --- | --- | --- |
| `toString` | `Color.toString()` | Returns the underlying hex string or JSON payload. |
| `to.<target>` | `color.to.oklch()` | Uses `ColorManager` conversion graph to produce a new color subtype. |

- Attribute access:
  - Hex colors expose no attributes.
  - Structured colors (e.g., SRGB) expose schema-defined components (`color.r`, `color.g`, `color.b`).
  - Assigning attributes mutates the color object; schema validation ensures type correctness.

## References

- Reference literals (`{token.name}`) resolve to values from the interpreter’s reference map or the shared map used by `TokenSetResolver`.
- References do not introduce a distinct type; they evaluate to whichever symbol is stored for the token.

## Type Equality & Coercion

- Equality comparisons require operands of the same type (with special cases for `Null` and hex colors).
- `Number` and `NumberWithUnit` interoperate in math operations via `UnitManager` conversions.
- Attempting to mix incompatible units, compare unlike types, or call undefined methods results in an `InterpreterError` with the originating token metadata.

Proceed to [Control Flow](control-flow.md) to learn how statements execute and how loops are guarded against infinite execution.
