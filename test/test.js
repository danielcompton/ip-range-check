var assert = require("assert");
var ipRangeCheck = require("../index");


describe("IP Range check", function () {
    describe("for IPv6", function () {
        it("should fail when the IP is not in the range", function () {
            assert.equal(false, ipRangeCheck("::1", "::2/128"));
            assert.equal(false, ipRangeCheck("::1", ["::2", "::3/128"]));
        });

        it("should succeed when the IP is in the range", function () {
            assert.equal(true, ipRangeCheck("::1", "::1"));
            assert.equal(true, ipRangeCheck("::1", ["::1"]));
            assert.equal(true, ipRangeCheck("2001:cdba::3257:9652", "2001:cdba::3257:9652/128"))
        });

        it("an array of the same CIDRs should be the same as one CIDR string", function () {
            assert.equal(ipRangeCheck("::1", "::1"), ipRangeCheck("::1", ["::1", "::1", "::1"]));
        });

        it("should handle IPv6 synonyms", function () {
            assert.equal(true, ipRangeCheck("2001:cdba:0000:0000:0000:0000:3257:9652", "2001:cdba:0:0:0:0:3257:9652"));
            assert.equal(true, ipRangeCheck("2001:cdba:0000:0000:0000:0000:3257:9652", "2001:cdba::3257:9652"));
            assert.equal(true, ipRangeCheck("2001:cdba:0:0:0:0:3257:9652", "2001:cdba:0000:0000:0000:0000:3257:9652/128"));
        })
    });

    describe("for Ipv4", function () {
        it("should fail when the IP is not in the range", function () {
            assert.equal(false, ipRangeCheck("102.1.5.0", "102.1.5.1"))
        });

        it("should succeed when the IP is in the range", function () {
            assert.equal(true, ipRangeCheck("102.1.5.0", "102.1.5.0"));
            assert.equal(true, ipRangeCheck("102.1.5.92", "102.1.5.0/24"));
            assert.equal(true, ipRangeCheck("192.168.1.1", ["102.1.5.0/24", "192.168.1.0/24"]));
            for (var i = 0; i <= 255; i++) {
                assert.equal(true, ipRangeCheck("102.1.5." + i, "102.1.5.0/24"))
            }
        });

        describe("transmitted over IPv6", function(){
            it("should match IPv4 CIDR", function () {
                assert.equal(true, ipRangeCheck("0:0:0:0:0:FFFF:222.1.41.90", "222.1.41.90"));
                assert.equal(true, ipRangeCheck("0:0:0:0:0:FFFF:222.1.41.90", "222.1.41.0/24"));
            })
        });
    });

    describe("for mixed types", function () {
        it("should fail when comparing IPv6 with IPv4", function () {
            assert.equal(false, ipRangeCheck("::5", "102.1.1.2"));
            assert.equal(false, ipRangeCheck("::1", "0.0.0.1"));
            assert.equal(false, ipRangeCheck("195.58.1.62", "::1/128"))
        })
    });

    describe("for IPv6 prefix ranges", function () {
        it("should succeed when the IP is within the prefix", function () {
            assert.equal(true, ipRangeCheck("2001:db8::1234", "2001:db8::/32"));
            assert.equal(true, ipRangeCheck("2001:db8:ffff:ffff:ffff:ffff:ffff:ffff", "2001:db8::/32"))
        });

        it("should fail when the IP is outside the prefix", function () {
            assert.equal(false, ipRangeCheck("2001:db9::1", "2001:db8::/32"))
        })
    });

    describe("for range boundaries", function () {
        it("should fail for addresses just outside the range", function () {
            assert.equal(false, ipRangeCheck("102.1.4.255", "102.1.5.0/24"));
            assert.equal(false, ipRangeCheck("102.1.6.0", "102.1.5.0/24"))
        });

        it("should treat a /32 as a single address", function () {
            assert.equal(true, ipRangeCheck("10.0.0.5", "10.0.0.5/32"));
            assert.equal(false, ipRangeCheck("10.0.0.6", "10.0.0.5/32"))
        });

        it("should match any address of the same kind with a zero-length prefix", function () {
            assert.equal(true, ipRangeCheck("8.8.8.8", "0.0.0.0/0"));
            assert.equal(true, ipRangeCheck("2001:db8::1", "::/0"));
            assert.equal(false, ipRangeCheck("8.8.8.8", "::/0"))
        })
    });

    describe("for invalid input", function () {
        it("should fail for malformed IP addresses", function () {
            assert.equal(false, ipRangeCheck("abc", "192.168.1.0/24"));
            assert.equal(false, ipRangeCheck("256.1.1.1", "192.168.1.0/24"));
            assert.equal(false, ipRangeCheck("", "::1"))
        });

        it("should fail for malformed ranges", function () {
            assert.equal(false, ipRangeCheck("1.2.3.4", "garbage"));
            assert.equal(false, ipRangeCheck("192.168.1.1", "192.168.1.0/33"));
            assert.equal(false, ipRangeCheck("192.168.1.1", "192.168.1.0/-1"));
            assert.equal(false, ipRangeCheck("::1", "::1/129"))
        })
    });

    describe("for arrays of ranges", function () {
        it("should fail for an empty array", function () {
            assert.equal(false, ipRangeCheck("1.2.3.4", []))
        });

        it("should skip invalid entries and still match valid ones", function () {
            assert.equal(true, ipRangeCheck("192.168.1.1", ["garbage", "192.168.1.0/24"]))
        });

        it("should fail when every entry is invalid", function () {
            assert.equal(false, ipRangeCheck("192.168.1.1", ["garbage", "999.9.9.9"]))
        })
    })
});
