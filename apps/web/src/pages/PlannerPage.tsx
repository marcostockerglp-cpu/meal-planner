import { BookOpen, CalendarDays, Heart, Loader2, RefreshCw, Sparkles, Trash2, Wand2 } from "lucide-react";
import { Link } from "react-router-dom";
import { CATEGORY_LABELS, DAYS } from "../data";
import { normalizeNumber } from "../lib/planner";
import type { Recipe } from "../types";

type Props = {
  mealCount: number;
  plan: Record<string, { selected: string }>;
  filteredRecipes: Recipe[];
  shoppingDiff: {
    day: string;
    fromRecipe: Recipe | null;
    toRecipe: Recipe | null;
    changes: Array<{ key: string; name: string; unit: string; coop: string; delta: number; type: "add" | "remove" }>;
  } | null;
  summary: { meals: number; avgTime: number; vegMeals: number };
  handleAssignRecipe: (day: string, recipeId: string) => void;
  handleGenerateRecipeForDay: (day: string) => void;
  generatingDay: string | null;
  setActiveRecipeId: (id: string) => void;
};

export function PlannerPage({ mealCount, plan, filteredRecipes, shoppingDiff, summary, handleAssignRecipe, handleGenerateRecipeForDay, generatingDay, setActiveRecipeId }: Props) {
  if (filteredRecipes.length === 0) {
    return (
      <section className="pageSection">
        <div className="panel">
          <div className="emptyState">
            <div className="emptyStateIcon"><CalendarDays size={24} /></div>
            <p className="emptyStateTitle">Noch kein Menüplan vorhanden</p>
            <p className="emptyStateText">Generiere zuerst einen Wochenplan auf der Startseite, damit hier deine Menüs erscheinen.</p>
            <Link to="/start" className="button buttonPrimary" style={{ marginTop: 4 }}>
              <Sparkles size={16} /> Menüplan generieren
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="sectionGrid pageSection">
      <div className="stackLarge">
        {DAYS.map((day, index) => {
          const isActiveDay = index < mealCount;
          const recipe = filteredRecipes.find((r) => r.id === plan[day]?.selected);
          const Icon = recipe?.icon ?? CalendarDays;
          const isLoadingThisDay = generatingDay === day;
          return (
            <div className={`panel ${!isActiveDay ? "panelInactive" : ""}`} key={day}>
              <div className="dayCard">
                <div className="dayInfo">
                  <div className="recipeIcon"><Icon size={20} /></div>
                  <div className="dayText">
                    <div className="dayPill">{day}</div>
                    <div className="dayTitle">{recipe ? recipe.title : isActiveDay ? "Noch kein Menü" : "Nicht aktiv"}</div>
                    <div className="dayMeta">
                      {recipe ? (<><span>{recipe.source}</span><span>·</span><span>{recipe.time} min</span><span>·</span><span>{CATEGORY_LABELS[recipe.category]}</span></>) : <span>{isActiveDay ? "Wähle ein Rezept aus der Liste." : "Dieser Tag ist derzeit nicht aktiv."}</span>}
                    </div>
                    {isActiveDay && recipe && (
                      <div className="buttonWrap">
                        <button className="button buttonSecondary" onClick={() => handleGenerateRecipeForDay(day)} disabled={isLoadingThisDay}>
                          {isLoadingThisDay ? <Loader2 size={16} className="spin" /> : <Wand2 size={16} />} Neues Menü
                        </button>
                        <button className="button buttonGhost" onClick={() => setActiveRecipeId(recipe.id)}><BookOpen size={16} /> Details</button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="dayActions">
                  <select className="select" disabled={!isActiveDay} value={plan[day]?.selected || ""} onChange={(e) => handleAssignRecipe(day, e.target.value)}>
                    <option value="">Kein Menü</option>
                    {filteredRecipes.map((r) => <option key={r.id} value={r.id}>{r.title}</option>)}
                  </select>
                  <button className="button buttonGhost" disabled={!isActiveDay || !recipe} onClick={() => handleAssignRecipe(day, "")}><Trash2 size={16} /> Leeren</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="stackLarge">
        {shoppingDiff && (
          <div className="panel">
            <div className="panelHeader">
              <div className="panelTitle"><RefreshCw size={18} /> Einkaufslisten-Differenz</div>
              <div className="panelText">{shoppingDiff.day}: {shoppingDiff.fromRecipe?.title || "Kein Menü"} → {shoppingDiff.toRecipe?.title || "Kein Menü"}</div>
            </div>
            {!shoppingDiff.changes.length ? <div className="notice">Keine Änderung in der Einkaufsliste.</div> : (
              <div className="diffGrid">
                {shoppingDiff.changes.map((change) => (
                  <div className={`diffCard ${change.type}`} key={change.key}>
                    <div><div className="listItemTitle">{change.name}</div><div className="tinyText">Coop: {change.coop}</div></div>
                    <div className="deltaBadge">{change.type === "add" ? "+" : "−"} {normalizeNumber(Math.abs(change.delta))} {change.unit}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="panel">
          <div className="panelHeader">
            <div className="panelTitle"><Heart size={18} /> Zusammenfassung</div>
            <div className="panelText">Die Kennzahlen reagieren auf die aktuell geplanten Menüs.</div>
          </div>
          <div className="statsGrid">
            <div className="statCard"><span>Geplante Menüs</span><strong>{summary.meals}</strong></div>
            <div className="statCard"><span>Ø Kochzeit</span><strong>{summary.avgTime > 0 ? `${summary.avgTime} min` : "—"}</strong></div>
            <div className="statCard"><span>Veggie-Abende</span><strong>{summary.vegMeals}</strong></div>
          </div>
        </div>
      </div>
    </section>
  );
}
