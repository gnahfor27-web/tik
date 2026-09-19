const {
  Client,
  GatewayIntentBits,
  EmbedBuilder
} = require("discord.js");

const config = require("./config.json");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers
  ]
});

client.once("ready", () => {
  console.log(`${client.user.tag} is online`);
});

client.on("guildMemberAdd", async (member) => {

  // Welcome channel
  const channel = member.guild.channels.cache.get(config.welcomeChannel);

  // Auto role
  const role = member.guild.roles.cache.get(config.autoRole);

  // Give role
  if (role) {
    member.roles.add(role).catch(() => {});
  }

  // If channel not found
  if (!channel) return;

  // Account age
  const createdDate = member.user.createdAt.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  // Embed
  const embed = new EmbedBuilder()
    .setColor(config.color)
    .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
    .setImage(config.image)
    .setTitle("New Member Joined")
    .setDescription(`
Welcome ${member}
You are now part of the server

Username:
\`${member.user.username}\`

User ID:
\`${member.user.id}\`

Discord Account Created:
\`${createdDate}\`

Member Count:
\`${member.guild.memberCount}\`
`)
    .setFooter({
      text: member.guild.name,
      iconURL: member.guild.iconURL()
    })
    .setTimestamp();

  // Send welcome message
  channel.send({
    content: `${member}`,
    embeds: [embed]
  });

});

client.login(config.token);