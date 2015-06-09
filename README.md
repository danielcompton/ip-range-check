# IP Range Check

This module presents just one function, a range check. It lets you check if an IP matches one or more CIDR ranges, or direct IP's. It handles IPv6, IPv4, and IPv4-mapped IPv6 addresses.

It accepts an array of CIDR/IP's or a single CIDR/IP string.

## IPv4

```js
var ipRangeCheck = require("ip-range-check");

ipRangeCheck("192.168.1.1", "102.1.5.2/24")
// > false

ipRangeCheck("192.168.1.1", "192.168.1.0/24")
// > true

ipRangeCheck("192.168.1.1", ["102.1.5.2/24", "192.168.1.0/24"])
// > true

ipRangeCheck("192.168.1.1", "192.168.1.1")
// > true
```

## IPv6

IPv4-mapped IPv6 addresses are automatically converted back to IPv4 addresses and can match against IPv4 CIDR/IP's.

```js
var ipRangeCheck = require("ip-range-check");

ipRangeCheck("0:0:0:0:0:FFFF:222.1.41.90", "222.1.41.0/24")
// > true
````

It normalises IPv6 addresses.

```js
ipRangeCheck("2001:cdba:0000:0000:0000:0000:3257:9652", ["2001:cdba:0:0:0:0:3257:9652"])
// > true
```

## Developing

To run the tests:

```
npm test
```
