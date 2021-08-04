import { process, parseCIDR } from "ipaddr.js";

function check_single_cidr(addr: string, cidr: string) {
  try {
    const parsed_addr = process(addr);
    if (cidr.indexOf("/") === -1) {
      const parsed_cidr_as_ip = process(cidr);
      if (
        parsed_addr.kind() === "ipv6" &&
        parsed_cidr_as_ip.kind() === "ipv6"
      ) {
        return (
          parsed_addr.toNormalizedString() ===
          parsed_cidr_as_ip.toNormalizedString()
        );
      }
      return parsed_addr.toString() === parsed_cidr_as_ip.toString();
    } else {
      const parsed_range = parseCIDR(cidr);
      return parsed_addr.match(parsed_range);
    }
  } catch (e) {
    return false;
  }
}

export function ipRangeCheck(addr: string, range: string | string[]): boolean {
  if (typeof range === "string") {
    return check_single_cidr(addr, range);
  } else if (Array.isArray(range)) {
    return range.find((cidr) => check_single_cidr(addr, cidr)) !== undefined;
  }
  return false;
}

export default ipRangeCheck;
