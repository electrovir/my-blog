---
title: Setup git commit signing on macOS
tags: [dev, git, macos, security]
---

<!-- cspell:word pinentry keyid signingkey gpgsign -->

A guide on how to setup git commit signing through GPG and GitHub.

<!-- truncate -->

1. Enable commit signing by default: `git config --global commit.gpgsign true`
2. add `export GPG_TTY=$(tty)` to your `~/.zshrc
3. Run some setup:
    ```sh
    brew install gpg2 gnupg pinentry-mac
    mkdir ~/.gnupg
    echo "pinentry-program $(brew --prefix)/bin/pinentry-mac" > ~/.gnupg/gpg-agent.conf
    echo 'use-agent' > ~/.gnupg/gpg.conf
    chmod 700 ~/.gnupg
    source ~/.zshrc
    git config --global gpg.program $(which gpg)
    ```
4. Generate a key
    1. `gpg --full-gen-key`
    2. use "RSA (sign only)" (option `4`)
    3. 4096 bits long
    4. valid forever (option `0`)
    5. use your git user name and email
    6. give it a passphrase (make sure to remember this!)
5. Export the key for GitHub
    1. Run `gpg -K --keyid-format SHORT` and copy the key id from `sec rsa4096/XXXXXXX 2025-09-08` (the id is the `XXXXXXX` part)
    2. run `gpg --armor --export <key-id> | pbcopy` (`pbcopy` will place it in your clipboard)
    3. Go to https://github.com/settings/keys and add a new GPG key
    4. Paste into the Key textbox
6. Tell git to use your key
    1. run `gpg -k`
    2. Copy the fingerprint from under the `pub` line
    3. `git config --global user.signingkey <fingerprint>`
7. Make a commit, enter the passphrase from step 4.6 and save it in your keychain.
