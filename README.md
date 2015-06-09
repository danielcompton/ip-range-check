# IP Range Check

This module lets you check if an IP matches one or more IP's or [CIDR](http://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing) ranges. It handles IPv6, IPv4, and IPv4-mapped over IPv6 addresses.

It accepts either:

* A single CIDR or IP string
* An array of CIDR and/or IP strings

## IPv4

```js
var ipRangeCheck = require("ip-range-check");

// Checks CIDR
ipRangeCheck("192.168.1.1", "102.1.5.2/24")
// > false

ipRangeCheck("192.168.1.1", "192.168.1.0/24")
// > true

// Checks if IP matches string
ipRangeCheck("192.168.1.1", "192.168.1.1")
// > true

// Checks array of CIDR's and string
ipRangeCheck("192.168.1.1", ["102.1.5.2/24", "192.168.1.0/24", "106.1.180.84"])
// > true

```

## IPv6

```js
var ipRangeCheck = require("ip-range-check");

// Handles IPv6 in the same fashion as IPv4
ipRangeCheck("::1", "::2/128")
// > false
ipRangeCheck("::1", ["::2", "::3/128"])
// > false
ipRangeCheck("2001:cdba::3257:9652", "2001:cdba::3257:9652/128")
// > true

//IPv4-mapped IPv6 addresses are automatically converted back to IPv4 addresses and will match against IPv4 CIDR/IP's.
ipRangeCheck("0:0:0:0:0:FFFF:222.1.41.90", "222.1.41.0/24")
// > true

//It will normalise IPv6 addresses/CIDR's when comparing them.

ipRangeCheck("2001:cdba:0000:0000:0000:0000:3257:9652", ["2001:cdba:0:0:0:0:3257:9652"])
// > true
```

## Developing

To run the tests:

```
npm test
```
