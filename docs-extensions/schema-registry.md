---
title: Schema Registry
description: Managing custom schema dependencies for units, colors, and functions in TokenScript.
sidebar_label: Schema Registry
---

# Schema Registry
Tokenscript supports custom schemas for units, colors, and functions. Tokens Studio provides currently a public schema registry that hosts the default tokenscript schemas as well as a collection of community contributed schemas. You can also host your own schema registry if you want to manage your own custom schemas.

## Using the Public Schema Registry
The public schema registry is hosted at `https://schema.tokenscript.dev.gcp.tokens.studio/api/v1/`. - TODO official PROD URL

Schemas are stored under a unique schema identifier (slug) and versioned using [semantic versioning](https://semver.org/). For example, the SRGB color schema is available at `https://schema.tokenscript.dev.gcp.tokens.studio/api/v1/schema/srgb-color/0.0.1/`.

You can resolve tokenscript schema versions either by the the uuid of the version, by `latest` to always get the latest version or by a specific semver version (e.g. `1.0.0` or `1.0`, `1` - which would resolve the latest minor/patch version).
