import { BookOpen, CalendarDays, Save, Timer, Trash2, Utensils } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { CATEGORY_LABELS } from "../data";
import { normalizeNumber } from "../lib/planner";
import type { Recipe, SavedWeek } from "../types";

type Props = {
  plannedRecipes: Array<{ day: string; recipe: Recipe }>;
  activeDays: string[];
  handleAssignRecipe: (day: string, recipeId: string) => void;
  setActiveRecipeId: (id: string) => void;
  onSaveWeek: () => void;
  savedWeeks: SavedWeek[];
  onDeleteSavedWeek: (id: string) => void;
};

export function RecipesPage({
  plannedRecipes,
  activeDays,
  handleAssignRecipe,
  setActiveRecipeId,
  onSaveWeek,
  savedWeeks,
  onDeleteSavedWeek,
}: Props) {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    onSaveWeek();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="stack pageSection">
      {/* Current week recipes */}
      <section className="panel">
        <div className="panelHeader rowResponsive">
          <div>
            <div className="panelTitle">Rezepte der Woche</div>
            <div className="panelText">Alle aktuell geplanten Rezepte auf einen Blick.</div>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            <div className="previewCountBadge"><CalendarDays size={16} /> {plannedRecipes.length} geplante Rezepte</div>
            {plannedRecipes.length > 0 && (
              <button
                className={`button ${saved ? "buttonSuccess" : "buttonPrimary"}`}
                onClick={handleSave}
                disabled={saved}
              >
                <Save size={16} />
                {saved ? "Gespeichert ✓" : "Woche speichern"}
              </button>
            )}
          </div>
        </div>

        {plannedRecipes.length === 0 ? (
          <div className="emptyState">
            <div className="emptyStateIcon"><Utensils size={24} /></div>
            <p className="emptyStateTitle">Noch keine Rezepte geplant</p>
            <p className="emptyStateText">Generiere zuerst einen Menüplan auf der Startseite.</p>
            <Link to="/start" className="button buttonPrimary" style={{ marginTop: 4 }}>Zur Startseite</Link>
          </div>
        ) : (
          <div className="recipeGrid">
            {plannedRecipes.map(({ day, recipe }) => {
              const Icon = recipe.icon;
              return (
                <div className="recipeCard" key={`${day}-${recipe.id}`}>
                  <div className="recipeTop">
                    <div className="recipeIcon"><Icon size={20} /></div>
                    <span className="badge badgeDay">{day}</span>
                  </div>
                  <div className="recipeName">{recipe.title}</div>
                  <p className="panelText">{recipe.description}</p>
                  <div className="badgeRow">
                    <span className={`mealChip mealChip--${recipe.category}`}>{CATEGORY_LABELS[recipe.category]}</span>
                    <span className="badge"><Timer size={12} /> {recipe.time} min</span>
                    <span className="badge">{recipe.source}</span>
                  </div>
                  <div className="ingredientsPreview">
                    {recipe.ingredients.slice(0, 5).map((i) => (
                      <div className="rowBetween tinyText" key={`${recipe.id}-${i.name}`}>
                        <span>{i.name}</span>
                        <span>{normalizeNumber(i.qty)} {i.unit}</span>
                      </div>
                    ))}
                  </div>
                  <div className="buttonGrid">
                    <select className="select" defaultValue={day} onChange={(e) => e.target.value && handleAssignRecipe(e.target.value, recipe.id)}>
                      {activeDays.map((dayOption) => <option key={dayOption} value={dayOption}>{dayOption}</option>)}
                    </select>
                    <button className="button buttonGhost" onClick={() => setActiveRecipeId(recipe.id)}><BookOpen size={16} /> Details</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Saved weeks archive */}
      {savedWeeks.length > 0 && (
        <section className="panel">
          <div className="panelHeader">
            <div className="panelTitle">Gespeicherte Wochen</div>
            <div className="panelText">Dein Archiv gespeicherter Wochenpläne.</div>
          </div>
          <div className="stack">
            {savedWeeks.map((week) => (
              <div key={week.id} className="savedWeekCard">
                <div className="savedWeekHeader">
                  <div>
                    <div className="savedWeekLabel">{week.label}</div>
                    <div className="savedWeekDate">
                      {new Date(week.savedAt).toLocaleDateString("de-CH", { day: "2-digit", month: "2-digit", year: "numeric" })}
                    </div>
                  </div>
                  <button
                    className="userSignOut"
                    onClick={() => onDeleteSavedWeek(week.id)}
                    aria-label="Woche löschen"
                    title="Woche löschen"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
                <div className="savedWeekEntries">
                  {week.entries.map((entry) => (
                    <div key={`${week.id}-${entry.day}`} className="savedWeekEntry">
                      <span className="savedWeekDay">{entry.day}</span>
                      <span className="savedWeekTitle">{entry.recipeTitle}</span>
                      <span className={`mealChip mealChip--${entry.category}`} style={{ fontSize: 11, padding: "3px 8px", minHeight: "unset" }}>
                        {CATEGORY_LABELS[entry.category]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
