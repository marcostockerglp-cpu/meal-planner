import { AlertCircle, BookOpen, CalendarDays, Sparkles, Timer } from "lucide-react";
import { CATEGORY_LABELS } from "../data";
import { normalizeNumber } from "../lib/planner";
import type { Recipe } from "../types";

type Props = {
  mealCountDraft: number;
  people: number;
  setPeople: (value: number) => void;
  maxTimeDraft: number;
  handleMaxTimeDraftChange: (value: number) => void;
  assistantPrompt: string;
  setAssistantPrompt: (value: string | ((prev: string) => string)) => void;
  handleGeneratePlan: () => void | Promise<void>;
  handleMealCountDraftChange: (value: number) => void;
  plannedRecipes: Array<{ day: string; recipe: Recipe }>;
  activeDays: string[];
  handleAssignRecipe: (day: string, recipeId: string) => void;
  setActiveRecipeId: (id: string) => void;
  isGenerating: boolean;
  generationError: string;
  summary: { meals: number; avgTime: number; vegMeals: number };
};

export function StartPage({
  mealCountDraft,
  people,
  setPeople,
  maxTimeDraft,
  handleMaxTimeDraftChange,
  assistantPrompt,
  setAssistantPrompt,
  handleGeneratePlan,
  handleMealCountDraftChange,
  plannedRecipes,
  activeDays,
  handleAssignRecipe,
  setActiveRecipeId,
  isGenerating,
  generationError,
  summary,
}: Props) {
  return (
    <section className="pageSection stackLarge">
      <div className="heroPlanner">
        <div>
          <div className="eyebrow">Meal Planning</div>
          <h1 className="heroTitle plannerHeroTitle">Warm, appetitlich und übersichtlich</h1>
          <p className="heroText plannerHeroText">
            Plane eure Woche mit KI-Unterstützung, behalte die Rezeptübersicht im Blick und erhalte eine zusammengeführte Einkaufsliste mit klarer Zuordnung.
          </p>
          <div className="heroParamRow">
            <div className="heroParamCard">
              <span className="heroParamLabel">Anzahl Menüs</span>
              <div className="stepControl">
                <button className="stepBtn" onClick={() => handleMealCountDraftChange(mealCountDraft - 1)} disabled={mealCountDraft <= 1}>−</button>
                <span className="stepValue">{mealCountDraft}</span>
                <button className="stepBtn" onClick={() => handleMealCountDraftChange(mealCountDraft + 1)} disabled={mealCountDraft >= 7}>+</button>
              </div>
            </div>
            <div className="heroParamCard">
              <span className="heroParamLabel">Personen</span>
              <div className="stepControl">
                <button className="stepBtn" onClick={() => setPeople(Math.max(1, people - 1))} disabled={people <= 1}>−</button>
                <span className="stepValue">{people}</span>
                <button className="stepBtn" onClick={() => setPeople(Math.min(12, people + 1))} disabled={people >= 12}>+</button>
              </div>
            </div>
            <div className="heroParamCard">
              <span className="heroParamLabel">Max. Kochzeit</span>
              <div className="stepControl">
                <button className="stepBtn" onClick={() => handleMaxTimeDraftChange(maxTimeDraft - 5)} disabled={maxTimeDraft <= 10}>−</button>
                <span className="stepValue">{maxTimeDraft} min</span>
                <button className="stepBtn" onClick={() => handleMaxTimeDraftChange(maxTimeDraft + 5)} disabled={maxTimeDraft >= 120}>+</button>
              </div>
            </div>
          </div>
        </div>

        <div className="heroStats heroStatsWarm">
          <div className="statWarmCard">
            <span>Geplante Menüs</span>
            <strong>{summary.meals}</strong>
          </div>
          <div className="statWarmCard">
            <span>Ø Kochzeit</span>
            <strong>{summary.avgTime > 0 ? `${summary.avgTime} min` : "—"}</strong>
          </div>
          <div className="statWarmCard">
            <span>Vegetarisch</span>
            <strong>{summary.vegMeals}</strong>
          </div>
        </div>
      </div>

      <div className="panel">
        <div className="eyebrow">Assistent</div>
        <div className="heroTitle plannerTitle">Plane deine Woche stressfrei</div>
        <p className="panelText plannerLead">
          Beschreibe Saison, Stimmung und Wünsche. Der Assistent ist die inhaltliche Quelle für deine Rezepte.
        </p>

        <textarea
          className="textarea"
          value={assistantPrompt}
          onChange={(e) => setAssistantPrompt(e.target.value)}
          placeholder="Zum Beispiel: Frühlingsküche, 5 Menüs, familienfreundlich, 2 vegetarische Menüs, max 30 Minuten"
        />

        <div className="chipRow">
          {["Frühlingsküche", "vegetarisch", "2 vegetarische Menüs", "max 30 Minuten", "familienfreundlich", "gemütlich", "5 Menüs"].map((tag) => (
            <button key={tag} className="chip softChip" onClick={() => setAssistantPrompt((prev) => (prev ? `${prev} · ${tag}` : tag))}>
              {tag}
            </button>
          ))}
        </div>

        {generationError && (
          <div className="errorBanner">
            <AlertCircle size={16} />
            <span>{generationError}</span>
          </div>
        )}

        <div className="buttonGrid">
          <button className="button buttonPrimary" onClick={handleGeneratePlan} disabled={isGenerating}>
            <Sparkles size={16} /> Mit Assistent planen
          </button>
        </div>
      </div>

      <section className="panel pageSection">
        <div className="panelHeader rowResponsive">
          <div>
            <div className="panelTitle">Aktuelle Rezeptvorschau</div>
            <div className="panelText">
              Hier siehst du exakt die aktuell berechneten {mealCountDraft} Rezepte. Aus genau diesen Rezepten entsteht danach die Einkaufsliste.
            </div>
          </div>
          <div className="previewCountBadge">
            <CalendarDays size={16} /> {plannedRecipes.length} von {mealCountDraft} Menüs
          </div>
        </div>

        {plannedRecipes.length === 0 && (
          <div className="emptyState">
            <div className="emptyStateIcon"><CalendarDays size={24} /></div>
            <p className="emptyStateTitle">Noch keine Rezepte geplant</p>
            <p className="emptyStateText">Beschreibe deine Wünsche im Assistenten und klicke auf «Mit Assistent planen», um Rezepte zu generieren.</p>
          </div>
        )}

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
                <div className="chipRow">
                  {recipe.mood.map((m) => <span className="chip softChip" key={m}>{m}</span>)}
                </div>
                <div className="ingredientsPreview">
                  {recipe.ingredients.slice(0, 4).map((i) => (
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
                  <button className="button buttonGhost" onClick={() => setActiveRecipeId(recipe.id)}>
                    <BookOpen size={16} /> Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </section>
  );
}
