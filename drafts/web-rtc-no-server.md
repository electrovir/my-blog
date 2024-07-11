see p2p-webrtc-experiment/packages/no-server

many guides are like "it's a bad user experience to do this without a server so we won't even try that"

write a guide for how to truly do this without a server (copy and pasting stuff)

-   STUN server: simply replies with ip and port information needed for across-the-web WebRTC connections
-   TURN server: acts as a peer-to-peer middle man in cases where p2p doesn't work (this means the connection is no longer actually p2p)
-   ICE server: ??
-   signalling server: used only for initial setup of the p2p connection
