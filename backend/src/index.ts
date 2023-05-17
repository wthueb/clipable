import bcrypt from "bcrypt";
import cors from "cors";
import dotenv from "dotenv";
import express, { Request, Response } from "express";
import fileUpload from "express-fileupload";
import { expressjwt, Request as JWTRequest } from "express-jwt";
import fs from "fs";
import jwt from "jsonwebtoken";
import path from "path";
import { fileURLToPath } from "url";

import * as db from "./database.js";

dotenv.config({
  path: path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    process.env.NODE_ENV !== "development" ? "../.env" : "../.env.development"
  ),
});

const CLIP_DIR = process.env.CLIP_DIR ?? "./clips";
console.log(`using clip directory: ${CLIP_DIR}`);

if (!process.env.MONGODB_CONNECTION_STRING) {
  console.error("MONGODB_CONNECTION_STRING not set");
  process.exit(1);
}

await db.connect(process.env.MONGODB_CONNECTION_STRING);

//const JWT_EXPIRATION = process.env.JWT_EXPIRATION ?? 3600; // 1h if not specified

if (!process.env.RSA_PUBLIC_KEY_PATH) {
  console.error("RSA_PUBLIC_KEY_PATH not set");
  process.exit(1);
}

if (!process.env.RSA_PRIVATE_KEY_PATH) {
  console.error("RSA_PRIVATE_KEY_PATH not set");
  process.exit(1);
}

const RSA_PUBLIC_KEY = fs.readFileSync(process.env.RSA_PUBLIC_KEY_PATH);
const RSA_PRIVATE_KEY = fs.readFileSync(process.env.RSA_PRIVATE_KEY_PATH);

const authenticated = expressjwt({
  secret: RSA_PUBLIC_KEY,
  algorithms: ["RS256"],
});

const app = express();

app.use(cors());
app.use(express.json());
app.use(fileUpload());

if (process.env.NODE_ENV === "development") {
  console.log("serving static files from /clips");
  app.use("/clips", express.static(CLIP_DIR));
}

function generateKey(): string {
  const chars = "abcdefghijkmnopqrstuvwxyz023456789";
  let id = "";
  for (let i = 0; i < 6; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
}

interface ClipResponse {
  key: string;
  name: string;
  createdBy: string;
  createdAt: Date;
  url: string;
}

function clipToResponse(clip: db.IClip): ClipResponse {
  return {
    key: clip.key,
    name: clip.name,
    createdBy: clip.createdBy.username,
    createdAt: clip.createdAt,
    url: `/clips/${clip.filename}`,
  };
}

app.route("/login").post(async (req: Request, res: Response): Promise<any> => {
  const { username, password } = req.body;

  const user = await db.User.findOne({ username });

  if (!user) {
    return res.status(401).send("unknown username");
  }

  if (!bcrypt.compareSync(password, user.password)) {
    return res.status(401).send(`invalid password for ${username}`);
  }

  const token = jwt.sign({ username }, RSA_PRIVATE_KEY, {
    algorithm: "RS256",
  });

  return res.status(200).send({ token, username });
});

app
  .route("/register")
  .post(async (req: Request, res: Response): Promise<any> => {
    const { username, password } = req.body as {
      username: string;
      password: string;
    };

    if (await db.User.findOne({ username })) {
      return res.status(409).send("username already exists");
    }

    const hashed = bcrypt.hashSync(password, 10);

    const user = new db.User({ username, password: hashed });
    await user.save();

    const token = jwt.sign({ username }, RSA_PRIVATE_KEY, {
      algorithm: "RS256",
    });

    return res.status(200).send({ token, username });
  });

app
  .route("/clip/:key")
  .get(async (req: Request, res: Response): Promise<any> => {
    const key = req.params.key;

    console.debug(`got request for clip: ${key}`);

    const clip = await db.Clip.findOne({ key });

    if (!clip) {
      console.error(`could not find clip for key: ${key}`);
      return res.status(404).send(`could not find clip for key: ${key}`);
    }

    console.log(`found clip: ${clip.name}`);

    return res.status(200).send(clipToResponse(clip));
  });

app.route("/user/:username").get(async (req: Request, res: Response) => {
  const username = req.params.username;

  const user = await db.User.findOne({ username });

  if (!user) {
    return res.status(404).send(`unknown user: ${username}`);
  }

  const clips = await db.Clip.find({ createdBy: user });

  const resp = {
    username: user.username,
    clips: clips.map((clip) => clipToResponse(clip)),
  };

  return res.status(200).send(resp);
});

app
  .route("/upload")
  .post(authenticated, async (req: JWTRequest, res: Response): Promise<any> => {
    let clip = req["files"]?.clip;

    if (!clip) {
      return res.status(400).send("no clip in request body");
    }

    if (Array.isArray(clip)) {
      clip = clip[0];
    }

    if (!clip.name.endsWith(".mp4") && !clip.name.endsWith(".mkv")) {
      return res.status(400).send("clip must be .mp4 or .mkv");
    }

    if (!req.auth) {
      return res.status(401).send("no auth in request");
    }

    const username = req.auth["username"];

    if (!username) {
      return res.status(401).send("no username in auth");
    }

    const user = await db.User.findOne({ username });

    if (!user) {
      return res.status(401).send(`unknown user: ${username}`);
    }

    console.log(`uploading clip from ${username}: ${clip.name}`);

    const clips = fs
      .readdirSync(CLIP_DIR)
      .map((clip) => clip.substring(0, clip.lastIndexOf(".")));

    let key = "";
    for (let tries = 0; tries < 50; tries++) {
      key = generateKey();

      if (!clips.includes(key)) break;

      key = "";
    }

    if (!key) {
      console.error("could not generate non-duplicate key");
      return res.status(500).send("could not generate non-duplicate key");
    }

    console.log(`generated key: ${key}`);

    const ext = clip.name.split(".").pop();

    const filename = `${key}.${ext}`;

    await clip.mv(`${CLIP_DIR}/${filename}`);

    const clipDoc = new db.Clip({
      key,
      name: clip.name,
      createdBy: user,
      createdAt: new Date(),
      filename,
    });

    await clipDoc.save();

    return res.status(200).send({ key });
  });

app.listen(
  parseInt(process.env.PORT ?? "4201"),
  process.env.HOST ?? "localhost"
);
