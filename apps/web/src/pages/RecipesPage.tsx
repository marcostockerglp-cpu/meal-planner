import { BookOpen, CalendarDays, ChevronDown, ChevronUp, Save, Timer, Trash2, Utensils } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { CATEGORY_LABELS } from "../data";
import { normalizeNumber } from "../lib/planner";
import type { Recipe, SavedRecipe, SavedWeek } from "../types";

type Props = {
  plannedRecipes: Array<{ day: string; recipe: Recipe }>;
  activeDays: string[];
  handleAssignRecipe: (day: string, recipeId: string) => void;
  setActiveRecipeId: (id: string) => void;
  onSaveWeek: () => void;
  savedWeeks: SavedWeek[];
  onDeleteSavedWeek: (id: string) => void;
  onShowSavedRecipe: (recipe: SavedRecipe) => void;
};

export function RecipesPage({
  plannedRecipes,
  activeDays,
  handleAssignRecipe,
  setActiveRecipeId,
  onSaveWeek,
  savedWeeks,
  onDeleteSavedWeek,
  onShowSavedRecipe,
}: Props) {
  const [saved, setSaved] = useState(false);
  const [openWeekId, setOpenWeekId] = useState<string | null>(null);

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
                      {activeDays.map((d) => <option key={d} value={d}>{d}</option>)}
                    </select>
                    <button className="button buttonGhost" onClick={() => setActiveRecipeId(recipe.id)}>
                      <BookOpen size={16} /> Details
                    </button>
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
            <div className="panelText">Dein Archiv gespeicherter Wochenpläne. Klicke auf ein Rezept für die Detailansicht.</div>
          </div>
          <div className="stack">
            {savedWeeks.map((week) => {
              const isOpen = openWeekId === week.id;
              return (
                <div key={week.id} className="savedWeekCard">
                  <button
                    className="savedWeekHeader savedWeekToggle"
                    onClick={() => setOpenWeekId(isOpen ? null : week.id)}
                  >
                    <div>
                      <div className="savedWeekLabel">{week.label}</div>
                      <div className="savedWeekDate">
                        Gespeichert am {new Date(week.savedAt).toLocaleDateString("de-CH", { day: "2-digit", month: "2-digit", year: "numeric" })} · {week.entries.length} Rezepte
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      <button
                        className="userSignOut"
                        onClick={(e) => { e.stopPropagation(); onDeleteSavedWeek(week.id); }}
                        aria-label="Woche löschen"
                        title="Woche löschen"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </button>

                  {isOpen && (
                    <div className="savedWeekEntries">
                      {week.entries.map((entry) => (
                        <button
                          key={`${week.id}-${entry.day}`}
                          className="savedWeekEntry savedWeekEntryBtn"
                          onClick={() => onShowSavedRecipe(entry.recipe)}
                        >
                          <span className="savedWeekDay">{entry.day}</span>
                          <span className="savedWeekTitle">{entry.recipe.title}</span>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                            <span className={`mealChip mealChip--${entry.recipe.category}`} style={{ fontSize: 11, padding: "3px 8px", minHeight: "unset" }}>
                              {CATEGORY_LABELS[entry.recipe.category]}
                            </span>
                            <BookOpen size={14} style={{ color: "var(--text-secondary)", flexShrink: 0 }} />
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
