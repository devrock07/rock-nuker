# Discord Selfbot Nuker

This tool is a powerful Discord selfbot designed for educational purposes. It provides various commands to manage and, if necessary, perform destructive actions within a Discord server. This includes banning or kicking all members, renaming members, creating mass roles, and sending messages to all members.

## Features

- **Kick All Members**: Kicks every member in a server.
- **Ban All Members**: Bans every member in a server.
- **Rename All Members**: Renames every member in a server.
- **Message All Members**: Sends a message to every member in a server.
- **Destroy Server**: Deletes all channels, creates new channels with messages, creates new roles, renames the server, bans all members, and deletes emojis.

## Commands

- `!secret`: Displays a help message with all secret commands.
- `!kall`: Kicks every member in the server.
- `!ball`: Bans every member in the server.
- `!rall <new_name>`: Renames every member in the server.
- `!mall`: Sends a message to every member in the server.
- `!destroy`: Deletes channels, creates new ones, creates roles, bans members, and renames the server.
- `!ping`: Displays the bot's ping.
- `!info [@user]`: Displays information about a user.
## Disclaimer

- This disclaimer is short and emphasizes the educational intent of the tool while clearly stating that the author is not responsible for misuse or damage.

## Usage

1. Clone the repository:

   ```sh
   git clone https://github.com/devrock07/rock-nuker.git
   ```
2. Go to the Directory
   ```sh
   cd rock-nuker
   ```
3. Edit `config.js`
   ```sh
   nano config.json
   ```
4. It should look like this:
   ```
   module.exports = {

    prefix: '-',

    token: 'ADD HERE'

  };```
  
6. Replace:
Replace `ADD HERE` with your token.
If you want, you can replace the prefix too!

7. Run the code.
   ```js
   node index.js
   ```

   
