# Changelog

## 1.0.0 (unreleased)

### Behavior change: short/hex/octal IPv4 notations are now accepted

Upgrading ipaddr.js from 1.x to 2.x changed how non-standard IPv4 notations
are handled. Previously they failed to parse, so `ipRangeCheck` returned
`false` for any check involving them. They now parse using the classic
`inet_aton` rules — the same rules the OS, browsers, and curl apply when
connecting:

* Shorthand: `"127.1"` → `127.0.0.1` (the final part fills the remaining
  bytes), so `ipRangeCheck("127.1", "127.0.0.0/8")` is now `true` (was
  `false`).
* Hexadecimal octets: `"0x7f.1"` → `127.0.0.1`.
* Octal octets: a leading zero means octal, so `"010.1"` → `8.0.0.1`, *not*
  `10.0.0.1`.

This matches what those inputs actually resolve to on a real network stack,
which is generally what you want when checking whether an address falls in a
range (e.g. blocklisting `127.0.0.0/8` now correctly catches `"127.1"`).
However, if you were relying on these notations failing validation, you must
now validate input format separately (e.g. with
`ipaddr.IPv4.isValidFourPartDecimal()` from ipaddr.js).

### Dependencies

* Upgraded ipaddr.js 1.9.1 → 2.5.0.
* Removed mocha in favour of Node's built-in test runner (`node --test`).
  The package now has zero dev dependencies and a single runtime
  dependency, and `npm audit` reports zero vulnerabilities.
* Committed `package-lock.json`.

Running the tests now requires Node.js 20 or newer. This does not affect
consumers of the library — the shipped code is unchanged and its supported
Node versions are unaffected.

### Testing and CI

* Migrated CI from Travis CI to GitHub Actions, testing on Node.js 20, 22,
  and 24.
* Switched the test runner to `node --test` (see Dependencies above).
* Expanded the test suite (8 → 21 tests): invalid addresses and ranges,
  IPv6 prefix ranges, range boundary conditions, `/32` and `/0` prefixes,
  empty and partially-invalid range arrays, and the `inet_aton` notation
  behavior above.
