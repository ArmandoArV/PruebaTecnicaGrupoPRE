// Generic e2e: spawn the server once, run every endpoint case, screenshot + assert each.
// Add an endpoint = add one entry to CASES.
import { spawn } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";
import { chromium } from "playwright";

const BASE = "http://localhost:3000/api";

const CASES = [
  {
    name: "health",
    path: "/health",
    status: 200,
    check: (b) => b.status === "ok",
  },
  {
    name: "active-leaf-paths",
    path: "/active-leaf-paths",
    status: 200,
    check: (b) =>
      JSON.stringify(b.paths) ===
      JSON.stringify([
        "Electrónica/Accesorios",
        "Electrónica/Celulares",
        "Electrónica/Computadoras/Laptops",
      ]),
  },
  {
    name: "find-category-found",
    path: "/category/5",
    status: 200,
    check: (b) =>
      b.node?.id === 5 && b.path === "Electrónica/Computadoras/Laptops",
  },
  {
    name: "find-category-notfound",
    path: "/category/999",
    status: 404,
    check: (b) => b.found === false,
  },
];

async function waitForServer(url, tries = 60) {
  for (let i = 0; i < tries; i++) {
    try {
      if ((await fetch(url)).ok) return;
    } catch {
      /* not up yet */
    }
    await sleep(1000);
  }
  throw new Error("server did not start in time");
}

const server = spawn("npm", ["run", "dev"], { shell: true, stdio: "ignore" });
let failures = 0;

try {
  await waitForServer(`${BASE}/health`);
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  for (const c of CASES) {
    const resp = await page.goto(`${BASE}${c.path.replace(/^\/api/, "")}`);
    await page.waitForLoadState("networkidle");
    await page.screenshot({ path: `tests/e2e/${c.name}.png`, fullPage: true });

    const body = JSON.parse(await page.innerText("body"));
    const ok = resp.status() === c.status && c.check(body);
    console.log(`${ok ? "PASS" : "FAIL"}  ${c.name}  [${resp.status()}]`);
    if (!ok) {
      failures++;
      console.log("   got:", JSON.stringify(body));
    }
  }

  await browser.close();
} finally {
  server.kill();
}

console.log(`\n${CASES.length - failures}/${CASES.length} endpoints passed`);
process.exit(failures ? 1 : 0);
