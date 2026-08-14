---
title: Natural Scroll Direction on Windows
tags: [Windows]
---

How to reverse scroll direction on Windows so that it matches macOS's "natural" scrolling.

<!-- truncate -->

1. Open Device Manager.
2. Open the Mice and other pointing devices branch.
3. Right-click the active mouse and select Properties > Details > Property > Device instance path.
4. Copy / paste the "VID ID" value somewhere so you can refer to it again (for example, VID_0E0F&PID_0003&MI_01).
5. Open regedit.
6. Open path:HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Enum\HID
7. Open the key that matches the "VID ID" of the mouse from earlier.
8. Expand the subkey > "Device Parameters"
9. Set the FlipFlopWheel DWORD to 1.
