---
title: Built-in Functions
description: Math, color, and utility functions available in the TokenScript runtime.
sidebar_label: Functions
---

# Built-in Functions

TokenScript exposes a standard library of functions supplied by the `FunctionsManager` (`src/interpreter/config/managers/functions/manager.ts`). Functions accept and return TokenScript symbols; passing incompatible types raises an `InterpreterError`.

## Numeric & Aggregate Functions

| Function | Signature | Description |
| --- | --- | --- |
| `min` | `min(...values: Number | NumberWithUnit)` | Returns the smallest numeric value (units allowed when compatible). |
| `max` | `max(...values: Number | NumberWithUnit)` | Returns the largest numeric value. |
| `sum` | `sum(...values: Number | NumberWithUnit)` | Adds values, converting units via `UnitManager` when available. |
| `average` | `average(...values: Number)` | Arithmetic mean of numeric arguments. |
| `mod` | `mod(a: Number, b: Number)` | Modulo operation with safe handling for negatives. |
| `round` | `round(value: Number)` | Bankers rounding (0.5 rounds to nearest even). |
| `roundTo` | `roundTo(value: Number, precision?: Number)` | Bankers rounding at a given decimal precision (alias `roundto`). |
| `floor` | `floor(value: Number)` | Largest integer ≤ value. |
| `ceil` | `ceil(value: Number)` | Smallest integer ≥ value. |
| `abs` | `abs(value: Number)` | Absolute value. |
| `sqrt` | `sqrt(value: Number)` | Square root. |
| `pow` | `pow(base: Number, exponent: Number)` | Power function. |
| `parseInt` | `parseInt(text: String, base?: Number)` | Parses integer string with optional radix (alias `parseint`). |
| `log` | `log(value: Number, base?: Number)` | Natural log by default; optional positive base ≠ 1. |

## Trigonometric Functions

| Function | Signature | Description |
| --- | --- | --- |
| `sin`, `cos`, `tan` | `(angle: Number)` | Standard trig functions; angle in radians. |
| `asin`, `acos`, `atan` | `(value: Number)` | Inverse trig functions with domain validation. |
| `atan2` | `(y: Number, x: Number)` | Two-argument arctangent. |

## Constants & Utility

| Function | Signature | Description |
| --- | --- | --- |
| `pi` | `pi()` | Returns π as a `Number`. |
| `type` | `type(value)` | Returns lowercase string of the symbol’s subtype (e.g., `"hex"`, `"string"`). |

## Custom Functions

- The `FunctionsManager` loads additional functions from JSON specifications (see `docs/extensions/functions.md`, to be authored).
- Spec-defined functions use the same validation pipeline and become available immediately after registration.

## Error Handling

- Functions validate argument counts and types. Violations produce descriptive error messages, e.g., `"log() base must be positive and not equal to 1."`
- Unit-aware functions (`sum`, arithmetic operators) rely on `UnitManager`; missing conversions trigger conversion errors.

Next, review [Error Handling](errors.md) for interpreter and parser diagnostics.
