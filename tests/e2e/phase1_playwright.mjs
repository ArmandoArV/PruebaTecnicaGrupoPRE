// Fase 1 e2e: spawn the dev server, hit /api/active-leaf-paths in a browser, screenshot, assert.
import { spawn } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";
import { chromium } from "playwright";

const URL = "http://localhost:3000/api/active-leaf-paths";
const EXPECTED = [
  "Electrónica/Accesorios",
  "Electrónica/Celulares",
  "Electrónica/Computadoras/Laptops",
];

async function waitForServer(url, tries = 60) {
  for (let i = 0; i < tries; i++) {
    try {
      const r = await fetch(url);
      if (r.ok) return;
    } catch {
      /* not up yet */
    }
    await sleep(1000);
  }
  throw new Error("server did not start in time");
}

const server = spawn("npm", ["run", "dev"], { shell: true, stdio: "ignore" });

try {
  await waitForServer("http://localhost:3000/api/health");

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const resp = await page.goto(URL);
  await page.waitForLoadState("networkidle");
  await page.screenshot({ path: "tests/e2e/active-leaf-paths.png", fullPage: true });

  if (resp.status() !== 200) throw new Error(`status ${resp.status()}`);
  const data = JSON.parse(await page.innerText("body"));
  const got = JSON.stringify(data.paths);
  if (got !== JSON.stringify(EXPECTED)) throw new Error(`unexpected paths: ${got}`);

  await browser.close();
  console.log("OK: Fase 1 endpoint returned", EXPECTED);
} finally {
  server.kill();
}
