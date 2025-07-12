import { App } from "@slack/bolt";
import * as chrono from "chrono-node";
import Keyv from "keyv";
import KeyvSqlite from "@keyv/sqlite";

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
});

const db = new Keyv(
  new KeyvSqlite({
    uri: "db.sqlite",
  })
);

app.command("/memegen", async ({ command, ack, respond, say }) => {
  await ack();

  if (!command.text) {
    await respond("Please provide some text for the meme.");
    return;
  }

  const res = await fetch("https://api.imgflip.com/caption_image", {
    method: "POST",
    body: new URLSearchParams({
      username: process.env.IMGFLIP_USERNAME!,
      password: process.env.IMGFLIP_PASSWORD!,
      template_id: "181913649",
      text0: command.text,
    }),
  });

  const json: any = await res.json();

  await say({
    blocks: [
      {
        type: "image",
        image_url: json.data.url,
        alt_text: "delicious tacos",
      },
    ],
  });
});

await app.start();
console.log("We're up and running :)");
