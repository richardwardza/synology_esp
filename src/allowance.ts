import axios from "axios";
import fs from "fs";
import path from "path";

const getEspKey = (): string => {
  const filePath = path.join(__dirname, "esp_key.txt"); // replace with your file path
  const espKey = fs.readFileSync(filePath, "utf-8");
  return espKey.trim();
};

const ESP_KEY = getEspKey();

var config = {
  method: "get",
  maxBodyLength: Infinity,
  url: "https://developer.sepush.co.za/business/2.0/api_allowance",
  headers: {
    token: ESP_KEY,
  },
};

axios(config)
  .then(function (response: any) {
    console.log(JSON.stringify(response.data));
  })
  .catch(function (error: any) {
    console.log(error);
  });
