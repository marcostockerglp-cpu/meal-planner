import { Beef, Fish, Leaf, Sandwich, Soup } from "lucide-react";
import type { Recipe } from "./types";

export const DAYS = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"];

export const CATEGORY_LABELS = {
  vegetarisch: "Vegetarisch",
  fleisch: "Fleisch",
  fisch: "Fisch",
} as const;

export const RECIPE_LIBRARY: Recipe[] = [
  {
    id: "r1",
    title: "Frühlings-Pasta mit Erbsen & Zitronenricotta",
    source: "FOOBY",
    season: ["Frühling", "Sommer"],
    mood: ["frisch", "leicht", "familienfreundlich"],
    time: 25,
    category: "vegetarisch",
    portions: 4,
    coopMatch: "hoch",
    icon: Leaf,
    description: "Eine frische Familienpasta mit cremigem Ricotta, süssen Erbsen, Frühlingszwiebeln und feiner Zitronennote. Das Gericht ist schnell gemacht, wirkt aber trotzdem leicht und besonders. Ideal für einen entspannten Frühlingsabend, weil es wenig Vorbereitung braucht und alle Komponenten in kurzer Zeit zusammenfinden.",
    ingredients: [
      { name: "Pasta", qty: 500, unit: "g", coop: "Pasta Penne" },
      { name: "Erbsen", qty: 300, unit: "g", coop: "Tiefkühl Erbsen" },
      { name: "Ricotta", qty: 250, unit: "g", coop: "Ricotta" },
      { name: "Zitrone", qty: 1, unit: "Stk", coop: "Bio-Zitrone" },
      { name: "Parmesan", qty: 80, unit: "g", coop: "Geriebener Parmesan" },
      { name: "Frühlingszwiebeln", qty: 1, unit: "Bund", coop: "Frühlingszwiebeln" },
      { name: "Knoblauch", qty: 2, unit: "Zehen", coop: "Knoblauch" }
    ],
    steps: [
      "Pasta in reichlich gesalzenem Wasser al dente kochen und etwas Kochwasser auffangen.",
      "Frühlingszwiebeln in feine Ringe schneiden, Knoblauch hacken und beides in wenig Öl bei mittlerer Hitze glasig andünsten.",
      "Erbsen dazugeben und einige Minuten mitgaren, bis sie heiss und noch schön grün sind.",
      "Ricotta, Zitronenabrieb und wenig Kochwasser einrühren, bis eine cremige Sauce entsteht.",
      "Pasta unterheben, mit Parmesan abschmecken und bei Bedarf mit weiterem Kochwasser binden.",
      "Zum Schluss mit zusätzlichem Parmesan und frisch geriebener Zitronenschale servieren."
    ]
  },
  {
    id: "r2",
    title: "Ofen-Lachs mit Kartoffeln und Broccoli",
    source: "Chefkoch",
    season: ["Ganzjährig"],
    mood: ["gesund", "einfach", "familienfreundlich"],
    time: 35,
    category: "fisch",
    portions: 4,
    coopMatch: "hoch",
    icon: Fish,
    description: "Ein unkompliziertes Ofengericht für die Familie mit saftigem Lachs, knusprigen Kartoffeln und zartem Broccoli. Alles wird nacheinander auf einem Blech gegart, wodurch wenig Abwasch entsteht. Die frische Dill-Zitronen-Crème-fraîche sorgt am Schluss für einen milden, kindertauglichen Geschmack.",
    ingredients: [
      { name: "Lachsfilet", qty: 600, unit: "g", coop: "Lachsfilet" },
      { name: "Kartoffeln", qty: 900, unit: "g", coop: "Kartoffeln festkochend" },
      { name: "Broccoli", qty: 2, unit: "Stk", coop: "Broccoli" },
      { name: "Crème fraîche", qty: 200, unit: "g", coop: "Crème fraîche" },
      { name: "Zitrone", qty: 1, unit: "Stk", coop: "Bio-Zitrone" },
      { name: "Dill", qty: 1, unit: "Bund", coop: "Dill" }
    ],
    steps: [
      "Ofen auf 200 °C Ober-/Unterhitze vorheizen und ein Blech vorbereiten.",
      "Kartoffeln in Spalten schneiden, würzen, mit wenig Öl mischen und zuerst alleine ca. 20 Minuten vorgaren.",
      "Broccoli in Röschen teilen, zu den Kartoffeln geben und alles nochmals kurz weitergaren.",
      "Lachs portionsweise würzen, auf das Blech legen und die letzten 10 bis 12 Minuten sanft mitgaren, damit er saftig bleibt.",
      "Crème fraîche mit Zitronensaft, Zitronenabrieb und gehacktem Dill verrühren und als frische Sauce dazu servieren.",
      "Vor dem Servieren kurz prüfen, ob Kartoffeln weich und der Lachs im Kern noch zart ist."
    ]
  },
  {
    id: "r3",
    title: "Chicken Fajita Bowl",
    source: "FOOBY",
    season: ["Sommer", "Ganzjährig"],
    mood: ["würzig", "bunt", "satt"],
    time: 30,
    category: "fleisch",
    portions: 4,
    coopMatch: "hoch",
    icon: Beef,
    description: "Eine bunte Bowl mit Poulet, Reis, Peperoni, Mais und einer frischen Joghurtsauce. Das Gericht ist sättigend, aber trotzdem ausgewogen. Durch die einzelnen Komponenten lässt es sich gut auf Familiengeschmäcker anpassen, weil jedes Element separat angerichtet werden kann.",
    ingredients: [
      { name: "Pouletbrust", qty: 600, unit: "g", coop: "Pouletbrust" },
      { name: "Reis", qty: 300, unit: "g", coop: "Langkornreis" },
      { name: "Peperoni", qty: 3, unit: "Stk", coop: "Peperoni Mix" },
      { name: "Mais", qty: 1, unit: "Dose", coop: "Mais in Dose" },
      { name: "Avocado", qty: 2, unit: "Stk", coop: "Avocado" },
      { name: "Limette", qty: 1, unit: "Stk", coop: "Limette" },
      { name: "Joghurt nature", qty: 180, unit: "g", coop: "Joghurt nature" }
    ],
    steps: [
      "Reis nach Packungsangabe garen und bis zum Servieren locker halten.",
      "Poulet in Streifen schneiden, würzen und in einer heissen Pfanne goldbraun anbraten.",
      "Peperoni in Streifen schneiden, zum Poulet geben und knackig mitbraten.",
      "Mais abspülen und kurz in der Pfanne oder separat erwärmen.",
      "Joghurt mit Limettensaft und etwas Salz zu einer frischen Sauce verrühren.",
      "Alles in Bowls anrichten und die Avocado erst zum Schluss frisch darübergeben."
    ]
  },
  {
    id: "r4",
    title: "Cremiges Pilzrisotto",
    source: "Chefkoch",
    season: ["Herbst", "Winter"],
    mood: ["gemütlich", "cremig", "vegetarisch"],
    time: 40,
    category: "vegetarisch",
    portions: 4,
    coopMatch: "mittel",
    icon: Soup,
    description: "Ein cremiges Pilzrisotto mit herzhaftem Aroma und gemütlichem Charakter für kühlere Tage. Die Bouillon wird nach und nach eingerührt, damit der Reis seine typische cremige Konsistenz entwickelt. Ein klassisches Wohlfühlgericht, das etwas Aufmerksamkeit braucht, aber mit viel Geschmack belohnt.",
    ingredients: [
      { name: "Risottoreis", qty: 320, unit: "g", coop: "Risottoreis" },
      { name: "Champignons", qty: 500, unit: "g", coop: "Champignons" },
      { name: "Zwiebel", qty: 2, unit: "Stk", coop: "Zwiebeln" },
      { name: "Parmesan", qty: 100, unit: "g", coop: "Geriebener Parmesan" },
      { name: "Bouillon", qty: 1, unit: "L", coop: "Gemüsebouillon" },
      { name: "Rahm", qty: 100, unit: "ml", coop: "Halbrahm" }
    ],
    steps: [
      "Zwiebeln fein hacken und in wenig Butter oder Öl langsam andünsten.",
      "Pilze in Scheiben schneiden, kräftig anbraten und den Reis kurz mitrösten, bis er leicht glasig wird.",
      "Nun nach und nach heisse Bouillon einrühren und jeweils fast vollständig einkochen lassen.",
      "Diesen Vorgang wiederholen, bis der Reis weich ist, aber noch leichten Biss hat.",
      "Rahm und Parmesan unterheben, dann das Risotto kurz ruhen lassen.",
      "Vor dem Servieren nochmals cremig rühren und bei Bedarf mit wenig Bouillon nachjustieren."
    ]
  },
  {
    id: "r5",
    title: "Hacktätschli mit Rüebli und Kartoffelstock",
    source: "FOOBY",
    season: ["Ganzjährig"],
    mood: ["klassisch", "familienfreundlich", "herzhaft"],
    time: 45,
    category: "fleisch",
    portions: 4,
    coopMatch: "hoch",
    icon: Beef,
    description: "Ein klassisches Familiengericht mit saftigen Hacktätschli, cremigem Kartoffelstock und süssen Rüebli. Die einzelnen Bestandteile sind vertraut, sättigend und gut vorzubereiten. Gerade für Kinder ist das Gericht unkompliziert und durch die klare Tellerstruktur gut zugänglich.",
    ingredients: [
      { name: "Hackfleisch", qty: 600, unit: "g", coop: "Rindshackfleisch" },
      { name: "Kartoffeln", qty: 1200, unit: "g", coop: "Kartoffeln mehligkochend" },
      { name: "Rüebli", qty: 600, unit: "g", coop: "Rüebli" },
      { name: "Milch", qty: 250, unit: "ml", coop: "Vollmilch" },
      { name: "Butter", qty: 60, unit: "g", coop: "Butter" },
      { name: "Zwiebel", qty: 1, unit: "Stk", coop: "Zwiebeln" }
    ],
    steps: [
      "Kartoffeln schälen, in Stücke schneiden und in Salzwasser weich kochen.",
      "Hackfleisch mit fein gehackter Zwiebel würzen, zu kleinen Tätschli formen und in der Pfanne rundum anbraten.",
      "Rüebli schälen, in Stifte schneiden und mit wenig Wasser und Butter weich dünsten.",
      "Kartoffeln abgiessen, mit Milch und Butter stampfen und zu einem cremigen Stock verrühren.",
      "Alles zusammen anrichten und die Hacktätschli vor dem Servieren kurz ruhen lassen."
    ]
  },
  {
    id: "r6",
    title: "Veggie Tacos mit Bohnen und Mais",
    source: "Chefkoch",
    season: ["Sommer", "Ganzjährig"],
    mood: ["spassig", "locker", "vegetarisch"],
    time: 20,
    category: "vegetarisch",
    portions: 4,
    coopMatch: "hoch",
    icon: Sandwich,
    description: "Lockere, bunte Veggie-Tacos zum Selberfüllen mit Bohnen, Mais, Tomaten, Avocado und Käse. Das Gericht lebt davon, dass alle am Tisch ihre eigene Kombination zusammenstellen können. Dadurch ist es spielerisch, familienfreundlich und besonders alltagstauglich.",
    ingredients: [
      { name: "Taco Shells", qty: 12, unit: "Stk", coop: "Taco Shells" },
      { name: "Kidneybohnen", qty: 2, unit: "Dose", coop: "Kidneybohnen" },
      { name: "Mais", qty: 1, unit: "Dose", coop: "Mais in Dose" },
      { name: "Tomaten", qty: 4, unit: "Stk", coop: "Tomaten" },
      { name: "Avocado", qty: 2, unit: "Stk", coop: "Avocado" },
      { name: "Reibkäse", qty: 150, unit: "g", coop: "Geriebener Käse" },
      { name: "Crème fraîche", qty: 150, unit: "g", coop: "Crème fraîche" }
    ],
    steps: [
      "Bohnen und Mais abspülen und zusammen in einer Pfanne oder kleinen Kasserolle erwärmen.",
      "Tomaten klein schneiden, Avocado in Stücke schneiden und alle kalten Zutaten in Schalen bereitstellen.",
      "Taco Shells kurz nach Packungsangabe im Ofen erwärmen, damit sie knusprig bleiben.",
      "Käse und Crème fraîche separat bereitstellen, damit alle am Tisch selber füllen können.",
      "Tacos direkt am Tisch zusammenstellen und sofort servieren."
    ]
  },
  {
    id: "r7",
    title: "Spargel-Flammkuchen",
    source: "FOOBY",
    season: ["Frühling"],
    mood: ["saisonal", "frisch", "knusprig"],
    time: 25,
    category: "vegetarisch",
    portions: 4,
    coopMatch: "hoch",
    icon: Leaf,
    description: "Ein knuspriger Flammkuchen mit grünem Spargel, Frühlingszwiebeln und cremiger Basis. Das Rezept ist saisonal, schnell und wirkt trotzdem besonders. Perfekt, wenn es frisch, leicht und unkompliziert sein soll.",
    ingredients: [
      { name: "Flammkuchenteig", qty: 2, unit: "Stk", coop: "Flammkuchenteig" },
      { name: "Grüner Spargel", qty: 500, unit: "g", coop: "Grüner Spargel" },
      { name: "Crème fraîche", qty: 200, unit: "g", coop: "Crème fraîche" },
      { name: "Mozzarella", qty: 250, unit: "g", coop: "Mozzarella" },
      { name: "Frühlingszwiebeln", qty: 1, unit: "Bund", coop: "Frühlingszwiebeln" }
    ],
    steps: [
      "Ofen gut vorheizen und den Flammkuchenteig auf Blechen ausrollen.",
      "Crème fraîche gleichmässig auf dem Teig verstreichen und leicht würzen.",
      "Spargel in feine Stücke schneiden, Frühlingszwiebeln in Ringe schneiden und beides verteilen.",
      "Mozzarella zerpflücken und über den Belag geben.",
      "Im heissen Ofen backen, bis der Rand knusprig und der Belag leicht gebräunt ist."
    ]
  },
  {
    id: "r8",
    title: "Tomaten-Kokos-Curry mit Kichererbsen",
    source: "Chefkoch",
    season: ["Ganzjährig"],
    mood: ["wärmend", "schnell", "vegetarisch"],
    time: 25,
    category: "vegetarisch",
    portions: 4,
    coopMatch: "hoch",
    icon: Soup,
    description: "Ein schnelles Wohlfühlgericht mit Kokosmilch, Kichererbsen, Tomaten und Spinat. Das Curry ist mild, cremig und lässt sich gut in den Familienalltag integrieren. Mit Reis serviert ergibt es ein ausgewogenes Essen mit wenig aktivem Kochaufwand.",
    ingredients: [
      { name: "Kichererbsen", qty: 2, unit: "Dose", coop: "Kichererbsen" },
      { name: "Passierte Tomaten", qty: 500, unit: "ml", coop: "Passierte Tomaten" },
      { name: "Kokosmilch", qty: 400, unit: "ml", coop: "Kokosmilch" },
      { name: "Basmatireis", qty: 300, unit: "g", coop: "Basmatireis" },
      { name: "Zwiebel", qty: 1, unit: "Stk", coop: "Zwiebeln" },
      { name: "Knoblauch", qty: 2, unit: "Zehen", coop: "Knoblauch" },
      { name: "Spinat", qty: 150, unit: "g", coop: "Babyspinat" }
    ],
    steps: [
      "Reis nach Packungsangabe garen.",
      "Zwiebel und Knoblauch fein schneiden und in wenig Öl weich andünsten.",
      "Passierte Tomaten, Kokosmilch und abgetropfte Kichererbsen zugeben und einige Minuten köcheln lassen.",
      "Spinat erst am Schluss unterheben, damit er nur zusammenfällt und frisch bleibt.",
      "Mit Reis servieren und vor dem Anrichten nochmals abschmecken."
    ]
  }
];
