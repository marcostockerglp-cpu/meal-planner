import type { Recipe } from "../types";
import { scaleQty, normalizeNumber } from "./planner";
import { getISOWeek, kwLabel } from "./week";

type ShoppingItem = {
  name: string;
  unit: string;
  totalQty: number;
  coop: string;
  usedIn: Array<{ recipeTitle: string; qty: number; unit: string; day: string }>;
};

const CATEGORY_DE: Record<string, string> = {
  vegetarisch: "Vegetarisch",
  fleisch: "Fleisch",
  fisch: "Fisch",
};

function esc(s: string | number): string {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function generateCookbookPDF(
  plannedRecipes: Array<{ day: string; recipe: Recipe }>,
  shoppingData: ShoppingItem[],
  people: number,
) {
  const { kw, year } = getISOWeek();
  const label = kwLabel(kw, year);
  const avgTime = plannedRecipes.length
    ? Math.round(plannedRecipes.reduce((s, { recipe: r }) => s + r.time, 0) / plannedRecipes.length)
    : 0;
  const vegCount = plannedRecipes.filter(({ recipe: r }) => r.category === "vegetarisch").length;

  const cover = `
<div class="cover">
  <div class="eyebrow">Wochenplan</div>
  <h1 class="cover-title">${esc(label)}</h1>
  <div class="rule"></div>
  <p class="cover-desc">${esc(plannedRecipes.length)} Mahlzeiten &middot; ${esc(people)} Personen</p>
  <div class="stats">
    <div class="stat"><span class="stat-n">${esc(plannedRecipes.length)}</span><span class="stat-l">Mahlzeiten</span></div>
    <div class="stat"><span class="stat-n">${esc(avgTime)}<small>&thinsp;min</small></span><span class="stat-l">Ø Kochzeit</span></div>
    <div class="stat"><span class="stat-n">${esc(vegCount)}</span><span class="stat-l">Vegetarisch</span></div>
    <div class="stat"><span class="stat-n">${esc(people)}</span><span class="stat-l">Personen</span></div>
  </div>
  <div class="menu-list">
    ${plannedRecipes.map(({ day, recipe: r }) => `
    <div class="menu-row">
      <span class="menu-day">${esc(day)}</span>
      <span class="menu-dish">${esc(r.title)}</span>
      <span class="menu-time">${esc(r.time)}&thinsp;min</span>
    </div>`).join("")}
  </div>
</div>`;

  const recipes = plannedRecipes.map(({ day, recipe: r }, i) => `
<div class="recipe-page${i === 0 ? "" : " pb"}">
  <div class="eyebrow">${esc(day)}</div>
  <h2 class="recipe-title">${esc(r.title)}</h2>
  <p class="recipe-desc">${esc(r.description)}</p>
  <div class="recipe-meta">
    <span class="chip">${esc(CATEGORY_DE[r.category] ?? r.category)}</span>
    <span class="sep">&middot;</span>
    <span class="meta-item"><strong>${esc(r.time)}</strong>&thinsp;min</span>
    <span class="sep">&middot;</span>
    <span class="meta-item"><strong>${esc(people)}</strong> Personen</span>
  </div>
  <div class="rule"></div>
  <div class="recipe-cols">
    <div class="col-left">
      <div class="col-head">Zutaten</div>
      ${r.ingredients.map(item => {
        const qty = normalizeNumber(scaleQty(item.qty, r.portions, people));
        return `<div class="ing-row">
          <span class="ing-name">${esc(item.name)}</span>
          <span class="ing-qty">${esc(qty)}&thinsp;${esc(item.unit)}</span>
        </div>`;
      }).join("")}
    </div>
    <div class="col-right">
      <div class="col-head">Zubereitung</div>
      <ol class="steps">
        ${r.steps.map(step => `<li>${esc(step)}</li>`).join("")}
      </ol>
    </div>
  </div>
</div>`).join("");

  const shopping = `
<div class="shopping-page pb">
  <div class="eyebrow">Wocheneinkauf</div>
  <h2 class="shopping-title">Einkaufsliste</h2>
  <p class="shopping-sub">Alle Zutaten f&uuml;r ${esc(plannedRecipes.length)} Mahlzeiten &middot; ${esc(people)} Personen &middot; zusammengef&uuml;hrt und alphabetisch sortiert</p>
  <div class="rule"></div>
  <div class="shop-cols">
    ${shoppingData.map(item => `
    <div class="shop-row">
      <div class="shop-name-block">
        <span class="shop-name">${esc(item.name)}</span>
        <span class="shop-coop">${esc(item.coop)}</span>
      </div>
      <span class="shop-qty">${esc(normalizeNumber(item.totalQty))}&thinsp;${esc(item.unit)}</span>
    </div>`).join("")}
  </div>
  <div class="footer">Erstellt mit dem Wochenplan-Assistenten &mdash; ${esc(label)}</div>
</div>`;

  const html = `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8">
<title>${esc(label)} – Wochenplan</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}

@page{size:A4;margin:2.4cm 2.2cm 2cm}

body{
  font-family:'Inter',system-ui,sans-serif;
  color:#1a1a1a;
  background:#fff;
  -webkit-print-color-adjust:exact;
  print-color-adjust:exact;
}

/* ── Shared ── */
.eyebrow{font-size:10px;letter-spacing:.18em;text-transform:uppercase;color:#aaa;margin-bottom:14px}
.rule{width:100%;height:1px;background:#e0e0e0;margin:24px 0}
.pb{page-break-before:always}

/* ── Cover ── */
.cover{
  min-height:96vh;
  display:flex;
  flex-direction:column;
  justify-content:center;
  page-break-after:always;
}
.cover-title{
  font-family:'Playfair Display',Georgia,serif;
  font-size:54px;
  font-weight:700;
  line-height:1.05;
  margin-bottom:0;
}
.rule.short{width:60px;height:2px;background:#1a1a1a;margin:26px 0}
.cover .rule{width:60px;height:2px;background:#1a1a1a;margin:26px 0}
.cover-desc{font-size:14px;color:#777;font-style:italic;margin-bottom:34px}

.stats{display:flex;gap:44px;margin-bottom:44px}
.stat{display:flex;flex-direction:column;gap:5px}
.stat-n{
  font-family:'Playfair Display',Georgia,serif;
  font-size:34px;
  font-weight:700;
  line-height:1;
}
.stat-n small{font-size:18px;font-weight:400;font-family:inherit}
.stat-l{font-size:10px;text-transform:uppercase;letter-spacing:.12em;color:#bbb}

.menu-list{border-top:1px solid #e8e8e8;padding-top:4px}
.menu-row{
  display:flex;
  align-items:baseline;
  gap:16px;
  padding:10px 0;
  border-bottom:1px solid #f2f2f2;
}
.menu-day{font-size:10px;text-transform:uppercase;letter-spacing:.12em;color:#bbb;width:72px;flex-shrink:0}
.menu-dish{
  font-family:'Playfair Display',Georgia,serif;
  font-size:15px;
  flex:1;
}
.menu-time{font-size:12px;color:#bbb;white-space:nowrap}

/* ── Recipe ── */
.recipe-page{padding-top:4px}
.recipe-title{
  font-family:'Playfair Display',Georgia,serif;
  font-size:38px;
  font-weight:700;
  line-height:1.1;
  margin-bottom:12px;
}
.recipe-desc{
  font-size:13.5px;
  color:#555;
  line-height:1.7;
  font-style:italic;
  max-width:500px;
  margin-bottom:16px;
}
.recipe-meta{display:flex;align-items:center;gap:10px;font-size:13px;color:#555}
.chip{
  background:#f4f4f4;
  border-radius:3px;
  padding:3px 9px;
  font-size:10.5px;
  text-transform:uppercase;
  letter-spacing:.08em;
  color:#666;
}
.sep{color:#ccc}

.recipe-cols{display:grid;grid-template-columns:1fr 1.65fr;gap:40px;align-items:start}
.col-head{
  font-size:10px;
  text-transform:uppercase;
  letter-spacing:.16em;
  color:#aaa;
  font-weight:600;
  margin-bottom:14px;
}

.ing-row{
  display:flex;
  justify-content:space-between;
  align-items:baseline;
  padding:7px 0;
  border-bottom:1px solid #f2f2f2;
  gap:10px;
}
.ing-name{font-size:13px;color:#1a1a1a}
.ing-qty{font-size:13px;font-weight:500;color:#444;white-space:nowrap;font-variant-numeric:tabular-nums}

.steps{list-style:none;counter-reset:sc;display:flex;flex-direction:column;gap:14px}
.steps li{
  counter-increment:sc;
  display:flex;
  gap:13px;
  font-size:13px;
  line-height:1.65;
  color:#333;
}
.steps li::before{
  content:counter(sc);
  display:flex;
  align-items:center;
  justify-content:center;
  min-width:22px;
  height:22px;
  border-radius:50%;
  background:#1a1a1a;
  color:#fff;
  font-size:10px;
  font-weight:600;
  margin-top:2px;
  flex-shrink:0;
}

/* ── Shopping ── */
.shopping-page{padding-top:4px}
.shopping-title{
  font-family:'Playfair Display',Georgia,serif;
  font-size:38px;
  font-weight:700;
  margin-bottom:8px;
}
.shopping-sub{font-size:13px;color:#888;font-style:italic}

.shop-cols{column-count:2;column-gap:32px}
.shop-row{
  display:flex;
  justify-content:space-between;
  align-items:baseline;
  padding:8px 0;
  border-bottom:1px solid #f2f2f2;
  gap:10px;
  break-inside:avoid;
}
.shop-name-block{display:flex;flex-direction:column;gap:2px}
.shop-name{font-size:13px;color:#1a1a1a}
.shop-coop{font-size:11px;color:#bbb}
.shop-qty{font-size:13px;font-weight:500;color:#444;white-space:nowrap;font-variant-numeric:tabular-nums}

.footer{margin-top:48px;padding-top:16px;border-top:1px solid #ececec;font-size:11px;color:#ccc;text-align:center}
</style>
</head>
<body>
${cover}
${recipes}
${shopping}
<script>
window.addEventListener('load', function() {
  setTimeout(function() { window.print(); }, 900);
});
</script>
</body>
</html>`;

  const win = window.open("", "_blank");
  if (!win) {
    alert("Bitte Pop-ups für diese Seite erlauben, um das PDF zu erstellen.");
    return;
  }
  win.document.write(html);
  win.document.close();
}
