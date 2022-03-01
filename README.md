#### Video Chat Application

### Description
This is a simple simulative video chat application which uses websocket protocol for commmunication between client and server.

## Prerequisites
1. node js - https://kinsta.com/blog/how-to-install-node-js/
2. npx - https://www.npmjs.com/package/npx

### How to run the application and Functionalities
1. Extract the zip file and VideoChatApp folder in 
2. Open 2 terminal (bash or powershell)
3. In the first terminal
    1. Run npm i
    2. Run npm run dev (if you want to serve directly from typescript) or npm run start ( Compiles it to javascript and start app from dist folder)
4. In the second terminal
    1. cd client
    2. npm i
    3. npm run start
5. After this node server will be running at port 4000 and react client running at port 3000 be default.
6. Open a WebBrowser and Goto localhost:3000
7. You can see a meeting created with meetingId (some uuid) Click on the meeting link . You will redirected to localhost:3000/meeting/{meetingId}
8. First User joined will be host and You can see only one participant intially and his name will Host.
9. Now you can copy the meeting link localhost:3000/meeting/{meetingId} and open it in different tabs .
10. You can see no.of user joining increases propotional to the number of tabs being opened.
11. If you close the browser/refresh the browser/ click on call end button It is considered as user left the meeting .In case of refreshing the browser new joins in place of left user it will be reflected in all tabs.
12. You can enable audio/video individually for each user. Correspondingly Button displayed will changed.
13. The host view will be different from rest of participants view .Mainly with respect to the count timers being shown.
14. Once the host click on any one of the timers (15/30/45) ,the corresponding timer will start on each of the tabs including the host tab and when counter reaches 0 ,an audio will be played.
15. Existing timer will be overwritten by new timer as selected by host.
16. There is volumeoff button which act as muteAll button for host .Once host clicks on that button ,the mic button of each of the participants will be turned off except the host.
17. If any of the participants including the host leave the meeting by clicking end button he will redirected to meetingEnded page localhost:3000/meeting/meetingEnded.
18. Finallly If host leave the meeting by any of the above mentioned manner in (11) ,all the remaining participants in the meeting will be disconnected from the meeting and redirected to localhost:3000/meeting/meetingEnded
19. You can as many room as you like by going to localhost:3000 and enter the room by going to localhost:3000/meeting/{meetingId}.Each room will act independently.


### Implementation Architecture
1. API
    1. There are 2 api endpoints.
        1. / To generate a meetingId from server.
        2. /{meetingId} To check whether meeting data exists or not.
    2. All meeting data are stored in Object indexed by roomId/meetingId.
    3. All the user data are stored in a Map indexed by socket irrespective of roomId.
    4. There are 6 events emitted by client and recevied at server end:
        1. getUsers(roomId :string) - To get the list of user in the given roomId.
        2. timer(roomId :string , counter:number) - To start the timer at each of participants with particular counter. Emitted by host only.
        3. userJoined(user: any, roomId: string) - Emitted once new user join the meeting.
        4. muteAll(roomId:any) - To mute all participants in the room with roomId . Emitted by host only.
        5. disconnect - InBuilt event emmited any one of the participant leave the meeting.
        6. connect_error - InBuilt event emmited when any connection error occur.
2. UI
    1. There are 5 components.
        1. route '/' - App Component.
        2. route 'meeting/meetingEnded' - Leftmeeting Component.
        3. route 'meeting/{meetingId}'  - Combination of 3 Components with Meeting as parent and ParticipantView and Host as Childen
    2. Meeting Component
        1. UI Emitted Event - userJoined(user: any, roomId: string)
    3. Host Component
        1. UI Emitted Events - explained each in api side
            1. getUsers
            2. muteAll
            3. timer
            4. disconnect
        2. UI Captured Events
            1. user - To add the user once user joined the meeting
            2. startTimer - To start the timer.
            3. deleteUser - - To remove the user once user left the meeting
    4. ParticipantView
        1. UI Emitted Events - explained each in api side
            1. getUsers
            4. disconnect
        2. UI Captured Events (First 3 are same as in Host Component)
            1. user 
            2. startTimer
            3. deleteUser
            4. muteClient - To mute the client as requested by the host
            5. hostdisconnected - To inform participants that host left the meeting .So meeting has ended. As a result all paricipants will be disconnected
            from the given room.

### Areas of Improvements/New Features that can be taken later
1. UI of both host view /participant View can be improved a lot.
2. Can create a build of client and can serve both client and server from the same port.
3. Actual Integration of Video/ Audio.
4. Strict TypeScript Enforcements.
5. Proper Logging of each of the events.
6. Modularizing/Structuring of client components and enhance the reusability of code.
7. Overall Design architecture of each pages can be improved independently.
8. Modularizing of API Component.
9. User Authentication for uniquely identifying the user can be incorporated.
10. Exception Handling.
11. Permanent Fix for multi audio Issue. Error 'DOMException: play() failed because the user didn't interact with the document first.'
12. Js Doc comments for each function
13. Pipeline Integration and deployment.

