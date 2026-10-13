---
title: Little Snitch DNS and Tailscale MagicDNS
tags: [firewall, macos, security, tip]
---

How to use Little Snitch with DNS encryption and Tailscale MagicDNS:

1. Find your "Tailnet DNS name" at https://console.tailscale.com/admin/dns. It should look something like `tail<some-id>.ts.net`.
2. Open Little Snitch > Settings > DNS
3. Click "Add Exception..." or the `+` under "DNS Encryption Exceptions"
4. Fill it out with the following:
    - Domain: your Tailnet DNS name from step 1.
    - DNS Server: `100.100.100.100`
