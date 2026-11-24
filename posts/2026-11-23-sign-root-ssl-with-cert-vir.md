---
title: Sign and Trust Your Own SSL Certificates with cert-vir
tags: [certificates, cli, dev, macos, security, web]
---

[How to Sign and Trust Your Own SSL Certificates](/2026-09-19-sign-root-ssl) but with my [`cert-vir`](https://www.npmjs.com/package/cert-vir) CLI. It creates a root certificate, trusts it, and signs SSL certificates with it (specifically for LAN HTTPS purposes).

<!-- truncate -->

## Install

Get started by installing `cert-vir`:

```sh
npm i -g cert-vir
```

## Create a Root Certificate

1. Create a password for your root certificate's private key.
    - Save it somewhere (your password manager). You'll need it every time you sign a new certificate.
2. Decide what you want to name the certificate authority and its organization.
    - For example: organization name "My Org" and certificate authority name "My Local Dev CA"
3. Create the root certificate.
    ```sh
    cert-vir root \
        --root-certificate-common-name "My Local Dev CA" \
        --root-certificate-organization-name "My Org"
    # Enter your password from step 1.
    ```

That's it. This generates the encrypted private key and the root certificate in `~/.config/cert-vir/root/` and locks down the permissions on the directory and the key, all of which were separate manual steps in the original post.

## Trust your Root Certificate

-   On macOS:
    ```sh
    sudo cert-vir trust
    ```
    This adds the root certificate to the System keychain _and_ sets `NODE_EXTRA_CA_CERTS` in your `.zshrc` or `.bashrc`. Node.js ignores the macOS keychain and uses its own bundled certificate list, so without that variable Node won't trust your certificates even though your browser does. Open a new terminal afterwards to pick it up.
-   On iOS / iPadOS, nothing changes from the original post:
    1. Get `~/.config/cert-vir/root/rootCA.crt` onto the device somehow (AirDrop, email, etc.).
    2. Navigate to Settings > General > VPN & Device Management > Downloaded Profile, then click Install.
    3. Navigate to Settings > General > About > scroll to the bottom > Certificate Trust Settings, then turn on your CA.
-   Linux and Windows aren't supported by `cert-vir trust` yet.

## Create an SSL Certificate

1. Figure out which IP addresses and / or domain names your SSL certificate will be used on.
2. Create the certificate. Repeat `--domain-names` and `--ip-addresses` once per entry.
    ```sh
    cert-vir leaf \
        --certificate-file-name my-site \
        --certificate-common-name my-site.local \
        --domain-names my-site.local \
        --domain-names "*.my-site.local" \
        --domain-names localhost \
        --ip-addresses 192.168.0.1 \
        --ip-addresses 127.0.0.1
    # Enter the password for your root certificate's private key.
    ```
    - Just like before, `*.my-site.local` matches `api.my-site.local` but not `my-site.local` itself, so list both.

No `.cnf` file to write, no CSR to generate by hand. You get `my-site.key` and `my-site.crt` in `~/.config/cert-vir/`, ready to hand to your dev server.

## Renewing and Checking

-   To renew a certificate, run the same `cert-vir leaf` command again with the same file name. It keeps the existing key.
-   To see everything you've created, including which root signed each certificate and which domains and IPs it covers:
    ```sh
    cert-vir list
    ```

Run `cert-vir <command> --help` for the rest of the flags (like `--certificates-dir-path` to store certificates somewhere other than `~/.config/cert-vir/`).
