---
title: Setting up a Linux VM for AI
tags: [dev, macOS, Linux]
---

How to setup a Linux VM for an AI CLI to go crazy in (without risk to your host system).

<!-- truncate -->

I'm on macOS and already use [UTM](https://mac.getutm.app), so I'm using UTM to setup the machine.

1. Install [UTM](https://mac.getutm.app).
2. Create your Linux VM.

    There's also a guide from UTM here: https://docs.getutm.app/guides/ubuntu

    1. Launch UTM and click "Create a New Virtual Machine".
    2. Choose "Virtualize".
    3. I chose Linux for the VM OS but macOS might work too.
    4. I installed the Ubuntu server without a GUI, so I unchecked "Enable display output".
    5. For Memory and CPU core allocation, give what you can spare.
    6. I chose "Boot from ISO image" and downloaded the "Ubuntu Sever for ARM" v24 LTS iso from here: https://ubuntu.com/download/server/arm
    7. Go through the Ubuntu installer once it's done, select "Reboot Now".
    8. Wait for it reboot and then stop the VM.
    9. In the UTM GUI, clear the VM's CD/DVD drive.
    10. Login to Ubuntu!

3. Setup ssh
    1. Install SSH on the VM:
        ```sh
        sudo apt update
        sudo apt install -y openssh-server
        sudo systemctl enable --now ssh
        sudo systemctl status ssh
        ```
    2. Get your VM's IP address:
        ```sh
        ip -4 addr show | grep -oP '(?<=inet\s)\d+(\.\d+){3}'
        ```
    3. At this point, you can SSH into the Ubuntu server VM from your macOS terminal with username and password to run all future commands, if you wish: `ssh <username>@<vm-ip>`
    4. Generate and trust an SSH key:
        1. On your host machine: `ssh-keygen -t ed25519` (make sure to enter an absolute file path)
        2. Coy the generated `.pub` file's contents and paste into the VM's `~/.ssh/authorized-keys` file
    5. Add the following to your host machine's `~/.ssh/config` file (replace all the `<>` parts):
        ```
        Host <CHOOSE-HOST-NAME>
            HostName <YOUR-VM-IP>
            User <YOUR-VM-USERNAMe>
            AddKeysToAgent yes
            UseKeychain yes
            IdentitiesOnly yes
            IdentityFile ~/.ssh/<YOUR-SSH-KEY>
        ```
    6. You can now SSH to the VM with just your SSH key: `ssh <CHOOSE-HOST-NAME>`
    7. At this point I would also install https://starship.rs on the VM (and [configure it](https://electrovir.com/2024-08-29-awesome-terminal#informative-and-personalized-prompt)).
    8. You can also SSH via VS Code now as well.
4. Install Node.js
    1. Install nvm: https://github.com/nvm-sh/nvm?tab=readme-ov-file#install--update-script
    - As of writing this, the command is: `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash`
    2. If you don't want to restart your shell, source you bashrc: `source ~/.bashrc`
    3. Install Node.js: `nvm install --lts`
    4. Install a specific npm version: `npm i -g npm@<version>`
5. Install and setup GitHub Copilot's CLI
    1. Install: `npm install -g @github/copilot`.
    2. `cd` into the directory that you want to give Copilot access to.
    3. Run `copilot`.
    4. Trust the folder.
    5. Login with `/login`.
    6. Select a model with `/model`
    7. See https://docs.github.com/en/copilot/how-tos/use-copilot-agents/use-copilot-cli for more tips
6. Give Copilot permissions by adding the following to your `~/.bashrc` file:
    ```sh
    alias copilot="copilot --allow-tool write --allow-tool shell --deny-tool 'shell(rm)' --deny-tool 'shell(git push)'"
    ```
7. Make sure to also increase your Node.js memory by also adding this to your `~/.bashrc` file:
    ```
    export NODE_OPTIONS="--max-old-space-size=12288"
    ```
