---
title: How to Sign and Trust Your Own SSL Certificates
tags: [ssl, cli, dev, macos, security, web]
---

How to create your own root SSL certificate, get your devices to trust it, then sign your own SSL certificates (specifically for LAN HTTPS purposes).

If you don't want to manually run all these commands, I published a package to npm to run them all for you: https://www.npmjs.com/package/cert-vir

<!-- truncate -->

<!-- cspell:words addext pathlen cacreateserial extfile -->

## Create a Root Certificate

1. Create a directory to put your root certificate in.
    - For example, a _new_ directory at `~/.config/local-ca`
2. Secure the permissions for your root certificate's directory.
    ```sh
    # This is an example path, replace it with your own.
    cd ~/.config/local-ca
    chmod 700 .
    ```
3. Create a password for your root certificate's private key.
    - Save it somewhere (your password manager) and/or remember it for the next few steps.
4. Create your root certificate's private key (and encrypt it).
    ```sh
    # Make sure you are still in your root certificate dir.
    openssl genrsa -aes256 -out rootCA.key 4096
    # Enter your password from step 1.
    ```
5. Secure the permissions for the private key you just generated.
    ```sh
    chmod 400 rootCA.key
    ```
6. Decide what you want to name the certificate authority and its organization.
    - You will use the certificate name for the "Common Name" of the certificate.
    - For example: organization name "Electrovir" and certificate authority name "Electrovir Local Dev CA"
7. Create your root certificate.
    - Replace `${certAuthName}` with your chosen certificate authority name.
    - Replace `${certOrg}` with your chosen organization name.
    ```sh
    openssl req -x509 -new -key rootCA.key -sha256 -days 3650 \
        -out rootCA.crt \
        -subj "/CN=${certAuthName}/O=${certOrg}" \
        -addext "basicConstraints=critical,CA:TRUE,pathlen:0" \
        -addext "keyUsage=critical,keyCertSign,cRLSign";
    # Enter your password from step 1.
    ```
8. You should now have the following (run `stat -f "%OLp %N" *(D)` on macOS to see octal permissions):
    - a root certificate directory with `700` permissions
    - a `rootCA.key` file in that dir with `400` permissions
    - a `rootCA.crt` file in that dir with `644` permissions

## Trust your Root Certificate

-   On macOS:
    ```sh
    sudo security add-trusted-cert -d -r trustRoot \
        -k /Library/Keychains/System.keychain rootCA.crt
    ```
-   On iOS / iPadOS:
    1. Get the `.crt` file onto the device somehow (AirDrop, email, etc.).
    2. Navigate to Settings > General > VPN & Device Management > Downloaded Profile, then click Install.
    3. Navigate to Settings > General > About > scroll to the bottom > Certificate Trust Settings, then turn on your CA.

## Create an SSL Certificate

Throughout this process, feel free to replace "my-site" in file names with whatever you want to name this certificate.

1. Figure out which IP addresses and / or domain names your SSL certificate will be used on.
2. Create a config file, `my-site.cnf`.

    1. Start with the following:

        ```ini
        [req]
        distinguished_name = dn
        req_extensions = ext
        prompt = no

        [dn]
        CN = <fill-out>

        [ext]
        basicConstraints = critical,CA:FALSE
        keyUsage = critical,digitalSignature,keyEncipherment
        extendedKeyUsage = serverAuth
        subjectAltName = @alt

        [alt]
        <fill-out>
        ```

    2. Fill out the Common Name (CN).
        - Set CN to your domain name or IP address.
        - Examples:
            ```ini
            [dn]
            CN = electrovir.com
            ```
            ```ini
            [dn]
            CN = 192.168.0.1
            ```
    3. Fill out the `[alt]` section.
        - Domain names go under DNS.n, IP addresses go under IP.n.
        - Number each type sequentially from 1.
        - Note that `*.my-site.local` matches `api.my-site.local` but not `my-site.local` itself, so add a separate entry for it.
        - Example:
            ```ini
            [alt]
            DNS.1 = my-site.local
            DNS.2 = *.my-site.local
            DNS.3 = localhost
            IP.1  = 192.168.0.1
            IP.2  = 127.0.0.1
            ```

3. Create the new certificate's private key.
    ```sh
    openssl genrsa -out my-site.key 2048
    ```
4. Secure the key's permissions.
    ```sh
    chmod 400 my-site.key
    ```
5. Create the Certificate Signing Request.
    ```sh
    openssl req -new -key my-site.key -out my-site.csr -config my-site.cnf
    ```
6. Create the certificate.
    ```sh
    openssl x509 -req -in my-site.csr -CA rootCA.crt -CAkey rootCA.key \
        -CAcreateserial -out my-site.crt -days 825 -sha256 \
        -extfile my-site.cnf -extensions ext;
    # Enter the password for your root certificate's private key.
    ```
