# Changelog

## 0.2.1

### Security fix: SSRF filter bypass via abbreviated IPv4 notation

`ipRangeCheck` previously treated any unparseable address as "not in range"
(`false`). Abbreviated IPv4 forms such as `"127.1"`, `"0177.1"`, and
`"127.0x1"` failed to parse under `ipaddr.js` 1.x, so a denylist check like
`ipRangeCheck(host, ["127.0.0.0/8", ...])` returned `false` for them — even
though Node, browsers, curl, and most OS resolvers connect these forms to
`127.0.0.1`. An application using this library to block requests to private
IP ranges (a common SSRF defense) could be bypassed by an attacker supplying
one of these forms as the target host. See the security advisory for full
details, including which usage patterns are and aren't affected.

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

Running the tests now requires Node.js 22 or newer. This does not affect
consumers of the library — the shipped code is unchanged and its supported
Node versions are unaffected.

### Testing and CI

* Migrated CI from Travis CI to GitHub Actions, testing on Node.js 22, 24,
  and 26 (the currently supported releases).
* Switched the test runner to `node --test` (see Dependencies above).
* Expanded the test suite (8 → 21 tests): invalid addresses and ranges,
  IPv6 prefix ranges, range boundary conditions, `/32` and `/0` prefixes,
  empty and partially-invalid range arrays, and the `inet_aton` notation
  behavior above.
