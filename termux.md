Install necessary for termux packages:
- Install Node.js:
  pkg install nodejs
- Install Git (for cloning the repository):
  pkg install git

Clone the repository:
git clone https://github.com/devrock07/rock-nuker.git

Navigate to the project directory:
cd rock-nuker

Install the dependencies:
npm install

Configure the bot by editing the config.js file:
You can use a text editor like nano or vim to edit the file. Here’s an example using nano:
nano config.js
Replace the placeholder values with your actual Discord bot token and desired prefix. The file should look something like this:
module.exports = {
  prefix: '!', // Your command prefix
  token: 'YOUR_DISCORD_BOT_TOKEN' // Your Discord bot token
};
Press Ctrl + X to exit, then Y to save the changes, and press Enter to confirm.

Run the bot:
node index.js
