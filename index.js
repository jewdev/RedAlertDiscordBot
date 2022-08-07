const { Client, GatewayIntentBits, ActivityType, EmbedBuilder } = require("discord.js");
const axios = require("axios").default;
const config = require("./config.json");

const url = "https://www.oref.org.il/WarningMessages/alert/alerts.json";

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });

client.once("ready", () => {
	console.log(`Logged in as ${client.user.tag}!`);

	client.user.setActivity("rockets from gaza", { type: ActivityType.Watching });
	
	let prevId = "";

	setInterval(() => {
		axios.get(url, {
			headers: {
				"Accept": "application/json",
				"X-Requested-With": "XMLHttpRequest",
				"Referer": "https://www.oref.org.il/12481-he/Pakar.aspx"
			},
			maxContentLength: Infinity
		})
		.then(res => {
			if (res.data !== "" && res.data.constructor === Object) {
				let json = JSON.parse(JSON.stringify(res.data));

				if (json.id != prevId){
					prevId = json.id;

					let locations = "";

					for (let i = 0; i < json.data.length; i++) {
						locations += json.data[i] + "\n";
					}

					let embed = new EmbedBuilder()
					.setColor("#ff0001")
					.setTitle(json.title)
					.setDescription(json.desc)
					.addFields({
						name: "יישובים",
						value: locations
					})
					.setTimestamp();
	
					client.channels.cache.get(config.CHANNELID).send({ embeds: [embed] });

					console.log(`[${new Date()}] Sent message!`);
				}
			}
		})
		.catch(err => {
			console.log(err);
		});
	}, 1500);
});

client.login(config.TOKEN);