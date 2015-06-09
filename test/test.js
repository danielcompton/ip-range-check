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
        });

        it("an array of the same CIDRs should be the same as one CIDR string", function () {
            assert.equal(ipRangeCheck("::1", "::1"), ipRangeCheck("::1", ["::1", "::1", "::1"]));
        });

        it("should handle IPv6 synonyms", function () {
            assert.equal(true, ipRangeCheck("2001:cdba:0000:0000:0000:0000:3257:9652", "2001:cdba:0:0:0:0:3257:9652"));
            assert.equal(true, ipRangeCheck("2001:cdba:0000:0000:0000:0000:3257:9652", "2001:cdba::3257:9652"));
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
    })
});
