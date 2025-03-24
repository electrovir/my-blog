---
title: How to setup web dev on fresh Windows
tags: [dev, web, Windows, guide]
---

A step-by-step guide on how to setup a fresh Windows 11 installation for web development. These steps should also work on Windows 10 without much variation.

<!-- truncate -->

This guide assumes that you are not using WSL (I don't find it necessary to use WSL for web development).

## 1. Find your system architecture

This is necessary so you download the correct apps.

1. Open Settings > System > About.
2. Find "System Type". It'll likely either be "ARM" or "x86".

## 2. Install the latest PowerShell

1. Check your current version of PowerShell.
    1. Open "Windows Powershell" via the Start menu.
    2. Run `$PSVersionTable.PSVersion`.
2. If your current version is already >= 7, skip to the next section as your PowerShell is already up to date.

    Windows does not ship with PowerShell 7, so unless you _know_ that you already upgraded, you are most likely on an outdated PowerShell.

3. Go to https://learn.microsoft.com/en-us/powershell/scripting/install/installing-powershell-on-windows#installing-the-msi-package.
4. Download the installer for your architecture.
5. Run the installer.

## 3. Setup a PowerShell 7 configuration

1. Open "PowerShell 7" from the Start menu. (Do not open "Windows PowerShell".)
2. Right click on the title bar of the terminal window.
3. Go to Settings > PowerShell (not "Windows PowerShell").
4. Change its name to "PowerShell 7" to avoid future confusion.
5. Go to Settings > Startup.
6. Change your "Default profile" to "PowerShell 7".

## 4. Install VS Code

1. Go to https://code.visualstudio.com/download.
2. Download the _User Installer_ for your architecture.
3. Run the installer.
4. If you see a "This User Installer is not meant to be run as an Administrator" warning, _do not ignore it_. Instead, follow the "Fix Administrator Access" section at the bottom of this guide.

## 5. Install Git and Bash

I recommend using PowerShell for your CLI, _not_ the Git-Bash terminal. However, you still almost certainly need both git and bash installed.

1. Go to https://git-scm.com/downloads/win.
2. Click the main download link ("Click here to download the latest").
3. Run the installer.
4. After it finishes, find the path to your bash installation.
    1. Search for "Git Bash" in the Start menu and click "Open file location".
    2. This will show you a shortcut file. Right click that shortcut and click "Open file location" (once again).
    3. Navigate to usr > bin within that Git folder.
    4. Copy your current path location. (It will probably look something like `C:\Users\<username>\AppData\Local\Programs\Git\usr\bin`.)
5. Add bash to your PowerShell 7's `PATH`.
    1. Search for "Environment Variables" in the Start menu.
    2. Click "Edit the system environment variables" > "Environment Variables..." > Path > Edit > New.
    3. Paste in the `Git\usr\bin` path from step 4 and save it.
6. Test that it worked.
    1. Open a _new_ PowerShell 7 terminal.
    2. Run `bash`. It should not throw an error.
    3. Run `git`. It should not throw an error.

## 6. Setup SSH with GitHub

1. Configure OpenSSH to always run.
    1. Search for "Services" in the Start menu and click "Open file location".
    2. Run it as an administrator.
    3. Find "OpenSSH Authentication Agent".
    4. Right click it and click "Properties".
    5. Change "Startup type" to "Automatic" and click "Start".
2. Open a new PowerShell 7 terminal.
3. Run `git config --global core.sshCommand C:/Windows/System32/OpenSSH/ssh.exe`.
4. Follow the GitHub guide on generating a new SSH key: https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent.
    1. Make sure you’re on the Windows tab.
5. Follow the GitHub guide on adding the SSH key to GitHub: https://docs.github.com/en/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account.
    1. Make sure you’re on the Windows tab.
    2. Make sure to run the copy command from Git-Bash, not PowerShell.
    3. Make sure to copy the contents of the `.pub` file.
6. Configure PowerShell 7 to always add your ssh key.
    1. Open your profile file with `code $PROFILE` (in PowerShell 7).
    2. Paste in `ssh-add C:\Users\<username>\.ssh\<your-key-name>` (or whatever the path is to the SSH key you just generated).
7. Test your key with `ssh -T git@github.com`.
    1. You should get a message like "Hi username! You've successfully authenticated."

## 7. Install Node.js and npm

1. Download the nvm for Windows installer with the latest `nvm-setup.exe` file here: https://github.com/coreybutler/nvm-windows/releases.
2. Run the installer as an administrator. Keep track of nvm's install path, noted in the installer.
    1. If you're using a separate user as your administrator, change your nvm install path to somewhere within the _non-admin_ user's directory, like `C:\Users\<non-admin-user>\.nvm`. Likewise, change the Node.js install path: `C:\Users\<non-admin-user>\.node`.
3. Add nvm to your `PATH` variable.
    1. Search for "Environment Variables" in the Start menu.
    2. Click "Edit the system environment variables" > "Environment Variables..." > Path > Edit > New.
    3. Paste in the nvm install path.
4. Open a new PowerShell 7 window.
5. Run `nvm install <node-version`> (such as `nvm install 22`).
6. After installation, find your new Node.js install path.
    1. Run `nvm root` to find the root nvm folder again.
    2. Navigate to this folder and find a folder corresponding to the Node.js version you just installed.
    3. Copy that folder location (it'll likely look like `C:\Users\<username>\.nvm\v22.12.0`).
7. Add the new Node.js install path to `PATH`.
    1. Search for "Environment Variables" in the Start menu.
    2. Click "Edit the system environment variables" > "Environment Variables..." > Path > Edit > New.
    3. Paste in the Node.js install path.
8. Open a new PowerShell 7 terminal.
9. Verify that your Node.js installation is working.
    1. Run `node -v` and verify that it matches the version you just installed with nvm.

## 8. Install Starship

Starship helps you [configure your shell prompt](https://electrovir.com/2024-08-29-awesome-terminal/#informative-and-personalized-prompt) and supports PowerShell.

1. Download the latest `windows-msvc.msi` file for your architecture from https://github.com/starship/starship/releases.
2. Run the installer as an administrator.
3. Add Starship to your profile.
    1. Run `code $PROFILE`.
    2. Paste in `Invoke-Expression (&starship init powershell)`.
4. Create a config at `~\.config\starship.toml`. (See my guide here for an example: https://electrovir.com/2024-08-29-awesome-terminal/#informative-and-personalized-prompt.)

## Bonus Sections

### Disable WSL

Running `bash` in PowerShell will sometimes invoke WSL instead of Git Bash. To disable WSL entirely do the following:

1. Run `wsl --uninstall` in a PowerShell 7 terminal.
2. Run "Control Panel" and navigate to Programs > "Programs and Features" > "Turn Windows features on or off"
3. Uncheck "Windows Subsystem for Linux"
4. Restart.

### Using Git Bash `bash` instead of WSL

To force PowerShell 7 to use Git Bash's bash instead of WSL, do the following:

1. Open your profile file with `code $PROFILE` (in PowerShell 7).
2. Add `Set-Alias -Name bash -Value "C:\Users\<username>\AppData\Local\Programs\Git\usr\bin\bash"`

### Fix administrator access

In some situations Windows will run _every single app_ as an administrator, even if you haven't clicked "Run as Administrator". This will cause tons of permissions headaches in the future. To fix this, you need to create a separate administrator user and separate dev user. Do all dev work in the dev user, only use the administrator user when absolutely necessary. There are 2 different ways of solving this, as noted below.

#### Check administrator access

1. Check if your Windows account is an administrator.
    1. Open Settings > Accounts > "Your info".
    2. Check if your account says "Administrator" under your username. If it does, you're an administrator. If not, you're not.
2. If you are not an administrator then something else is wrong and these workarounds won't help.

#### Solution 1: downgrade current user and create a separate admin user

1. Open Settings > Accounts > "Other users" and click "Add Account".
2. Click "I don't have this person's sign-in information".
3. Click "Add a user without a Microsoft account".
4. Create a user.
5. Again in "Other users", find the new user you just created.
6. Click "Change account type".
7. Change it to an administrator.
8. Login to your new admin user.
    1. Open Start.
    2. Click your username > the three dots in the top right > "Other users" > your new admin user.
    3. login.
9. Open Settings > Accounts > "Other users".
10. Expand your original user.
11. Change its account type to "Standard" (not an administrator).
12. Login back in to your non administrator user.
13. Do all dev work in this user.

#### Solution 2: keep current admin user, create separate non-admin user

1. MAke sure you're currently logged-in to the administrator user.
2. Follow `Solution 1`'s steps (above) until step 7, "Change it to an administrator."
3. Instead, ensure that the new user is _not_ an administrator.
4. Login to your new non-admin user.
    1. Open Start.
    2. Click your username > the three dots in the top right > "Other users" > your new non-admin user.
    3. login.
5. Do all dev work in this user.

### Windows in a VM: extra steps

Running Windows in a VM will require these extra steps if you're connecting to Docker containers _outside_ of the Windows VM (as some systems don't support nested virtualization and thus you can't run Docker inside of Windows inside of a VM).

1. Forward local ports to the host Docker containers.

    1. Run the following command as an administrator in PowerShell 7:

        ```sh
        netsh interface portproxy add v4tov4 listenaddress=127.0.0.1 listenport=<docker-container-port> connectaddress=<host-LAN-ip> connectport=<docker-container-port>
        ```

    2. Example:

        ```sh
        netsh interface portproxy add v4tov4 listenaddress=127.0.0.1 listenport=6379 connectaddress=192.168.0.1 connectport=6379
        ```

2. Make sure your application code is connecting to the Docker container via `127.0.0.1` instead of `localhost`.

### Killing services

Servers and services seem to have a hard time closing down on Windows. Fix this by running `taskkill /im node.exe /F` to kill all your Node.js processes.
