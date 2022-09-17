# Temtem Sticker

You must use this google sheet (create a copy): [https://docs.google.com/spreadsheets/d/1wOTibedBfyBtuzToHOeJ4UYI6GNWGQ_1aIYYwm84rXE/edit](https://docs.google.com/spreadsheets/d/1wOTibedBfyBtuzToHOeJ4UYI6GNWGQ_1aIYYwm84rXE/edit)  
Copy the `.env.example` file to `.env` and fill in with your google sheet id (must be public, readonly is OK)

Get the `googlesheet-credentials.json` file: [https://theoephraim.github.io/node-google-spreadsheet/#/getting-started/authentication](https://theoephraim.github.io/node-google-spreadsheet/#/getting-started/authentication)  

Have Node.js (tested with v18.9.0): [https://nodejs.org/](https://nodejs.org/)  
And yarn: `npm i -g yarn`  
Install dependencies: `yarn install`  

Fill input text files: `./input`  
Run it: `yarn start`  