import { BookOpen, CalendarDays, Timer, Utensils } from "lucide-react";
import { Link } from "react-router-dom";
import { CATEGORY_LABELS } from "../data";
import { normalizeNumber } from "../lib/planner";
import type { Recipe } from "../types";

type Props = {
  plannedRecipes: Array<{ day: string; recipe: Recipe }>;
  activeDays: string[];
  handleAssignRecipe: (day: string, recipeId: string) => void;
  setActiveRecipeId: (id: string) => void;
};

export function RecipesPage({ plannedRecipes, activeDays, handleAssignRecipe, setActiveRecipeId }: Props) {
  return (
    <section className="panel pageSection">
      <div className="panelHeader rowResponsive">
        <div>
          <div className="panelTitle">Rezepte der Woche</div>
          <div className="panelText">Alle aktuell geplanten Rezepte auf einen Blick. Tage lassen sich direkt hier neu zuweisen.</div>
        </div>
        <div className="previewCountBadge"><CalendarDays size={16} /> {plannedRecipes.length} geplante Rezepte</div>
      </div>

      {plannedRecipes.length === 0 ? (
        <div className="emptyState">
          <div className="emptyStateIcon"><Utensils size={24} /></div>
          <p className="emptyStateTitle">Noch keine Rezepte geplant</p>
          <p className="emptyStateText">Generiere zuerst einen Menüplan auf der Startseite, um hier deine Rezepte zu sehen.</p>
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
  );
}
