import express, { Request, Response } from "express";
import axios from "axios";
import { parseISO, addMinutes, isBefore } from "date-fns";
import fs from "fs";
import path from "path";

const getEspKey = (): string => {
  const filePath = path.join(__dirname, "esp_key.txt"); // replace with your file path
  const espKey = fs.readFileSync(filePath, "utf-8");
  return espKey.trim();
};

const ESP_KEY = getEspKey();

const CAPE_TOWN = "capetown-7-capetowncbd";

var config = {
  method: "get",
  maxBodyLength: Infinity,
  url: `https://developer.sepush.co.za/business/2.0/area?id=${CAPE_TOWN}&test=future`,
  headers: {
    token: ESP_KEY,
  },
};

const app = express();
const port = 5577;

const handleRequest = async (req: Request, res: Response) => {
  const result = await main();
  if (typeof result === "boolean") {
    return res.json({ status: result });
  }
  return res.json({ error: result }).status(500);
};

app.get("/", handleRequest);

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

const main = async () => {
  try {
    const response = await axios(config);
    if (response.data.events.length === 0) {
      return false;
    } else {
      const startString = response.data.events[0].start;
      const startDate = parseISO(startString);
      const next20Minutes = addMinutes(new Date(), 20);
      const shouldRestart = isBefore(startDate, next20Minutes);
      if (shouldRestart) {
        return true;
      }
    }
  } catch (error) {
    return error;
  }
  return false;
};
