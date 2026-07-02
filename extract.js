import fs from "fs";
import https from "https";
import path from "path";

const screens = [
  {
    title: "Doping Simulator",
    url: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzYzYTNhMzM0ZjIxMzQyZGNhODJjYTI2OTk3OTA2OTU4EgsSBxD7vfaNhwkYAZIBIwoKcHJvamVjdF9pZBIVQhMyMTY2MjU5Mzc3Njk3NTA5Mzkx&filename=&opi=89354086",
  },
  {
    title: "Property Prediction Tool",
    url: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzQ3Y2M5MGE0YmVjOTQ3NGQ5MmJhNTg0MDJmNGYyMzY1EgsSBxD7vfaNhwkYAZIBIwoKcHJvamVjdF9pZBIVQhMyMTY2MjU5Mzc3Njk3NTA5Mzkx&filename=&opi=89354086",
  },
  {
    title: "Landing Page - Indian Materials AI",
    url: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sX2NiZjkwMDRmNzg0YTQzNTU5YmIwMjIwZGNmMjhjODY2EgsSBxD7vfaNhwkYAZIBIwoKcHJvamVjdF9pZBIVQhMyMTY2MjU5Mzc3Njk3NTA5Mzkx&filename=&opi=89354086",
  },
  {
    title: "Contact Us",
    url: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzM5MzMzZjQyNjlhZTQ2YmQ4NjQ1ZjhiMmQ2NWU3YTQyEgsSBxD7vfaNhwkYAZIBIwoKcHJvamVjdF9pZBIVQhMyMTY2MjU5Mzc3Njk3NTA5Mzkx&filename=&opi=89354086",
  },
  {
    title: "Main Dashboard",
    url: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sX2U0M2NiNmUyZDY4ZjQ5ODY5NTZjYzJlZjRmZWY3YTViEgsSBxD7vfaNhwkYAZIBIwoKcHJvamVjdF9pZBIVQhMyMTY2MjU5Mzc3Njk3NTA5Mzkx&filename=&opi=89354086",
  },
  {
    title: "Materials Explorer",
    url: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzE2MmZlYTU0MmRmNDRmMjJiYWFlMTMyOTI0MTQzMzc1EgsSBxD7vfaNhwkYAZIBIwoKcHJvamVjdF9pZBIVQhMyMTY2MjU5Mzc3Njk3NTA5Mzkx&filename=&opi=89354086",
  },
  {
    title: "Trial Experience",
    url: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sX2ViYzZkN2EzNmJkZDQzZjA4ZmNjMzk4ZmYwMWZkZmNiEgsSBxD7vfaNhwkYAZIBIwoKcHJvamVjdF9pZBIVQhMyMTY2MjU5Mzc3Njk3NTA5Mzkx&filename=&opi=89354086",
  },
  {
    title: "Sign In",
    url: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzFkNDBhZTEyMTRhYzQzYjhiZjZmM2VmODU2Y2NmNjU0EgsSBxD7vfaNhwkYAZIBIwoKcHJvamVjdF9pZBIVQhMyMTY2MjU5Mzc3Njk3NTA5Mzkx&filename=&opi=89354086",
  },
  {
    title: "Saved Materials",
    url: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzQxYjMzOThhYzIzNjRkYmQ4NTRlYWUwOTkzZGI3OTAzEgsSBxD7vfaNhwkYAZIBIwoKcHJvamVjdF9pZBIVQhMyMTY2MjU5Mzc3Njk3NTA5Mzkx&filename=&opi=89354086",
  },
];

const downloadDir = path.join(process.cwd(), "extracted_screens");

if (!fs.existsSync(downloadDir)) {
  fs.mkdirSync(downloadDir, { recursive: true });
}

screens.forEach((screen) => {
  const fileName =
    screen.title.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase() + ".html";
  const filePath = path.join(downloadDir, fileName);

  https
    .get(screen.url, (res) => {
      if (res.statusCode !== 200) {
        console.error(
          `Failed to get ${screen.title}, status code: ${res.statusCode}`,
        );
        return;
      }

      const file = fs.createWriteStream(filePath);
      res.pipe(file);

      file.on("finish", () => {
        file.close();
        console.log(`Downloaded: ${fileName}`);
      });
    })
    .on("error", (err) => {
      console.error(`Error downloading ${screen.title}:`, err.message);
    });
});
