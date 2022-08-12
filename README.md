# Collaborative-Tacton
Vibrotactile pattern generator for collaborative development. All instruction will send to a webscoket server, which will distribute the instruction to other clients from the same room

## Frontend installation ##
1. install node version 14.18.2
2. see installtation of abandonware/noble for other needed packages in cause of your OS
3. for windows you will need a bluetooth-dongle, which use the WinUsb Driver (for flashing Bluetooth Adapter use zadig)
4. navigate inside of a terminal to the directory "Collaborative-Tacton\collaborative-tacton-frontend"
5. run npm install
    1. there could be an error, that you have to remove the electron module
    2. if this error occure  --> remove all folder, which contain the name "electron" inside of the node_modules folder
    3. run npm install
6. ensure that you plugged in your bluetooth-dongle, with the correct driver and that it's currently not used
7. run npm electron:serve

## Backend installation ##
1. install node version 14.18.2
2. navigate inside of a terminal to the directory "Collaborative-Tacton\collaborative-tacton-backend"
3. run npm install
4. run npm serve
5. if you want to use your own server, change the used ip address in the frontend under "Collaborative-Tacton\collaborative-tacton-frontend\src\renderer\CommunicationManager\WebSocketManager\index.ts
