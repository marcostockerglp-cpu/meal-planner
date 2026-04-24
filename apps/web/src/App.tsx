import { useEffect, useMemo, useState } from "react";
import { AlertCircle, Beef, Fish, Leaf, Loader2 } from "lucide-react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { LoginPage } from "./pages/LoginPage";
import { DAYS } from "./data";
import { AppLayout } from "./components/AppLayout";
import { RecipeModal } from "./components/RecipeModal";
import { StartPage } from "./pages/StartPage";
import { PlannerPage } from "./pages/PlannerPage";
import { RecipesPage } from "./pages/RecipesPage";
import { ShoppingPage } from "./pages/ShoppingPage";
import { buildShoppingDiff, normalizeNumber, recipeScore, scaleQty } from "./lib/planner";
import { requestMealPlan } from "./services/mealPlanApi";
import { getISOWeek, kwLabel } from "./lib/week";
import type { Preferences, Recipe, SavedWeek, WeekPlan } from "./types";

const defaultPreferences: Preferences = {
  season: "Frühling",
  mood: "",
  category: "alle",
  maxTime: 45,
  preferCoop: true,
  familyFriendly: true,
  variety: true,
};

const CATEGORY_ICONS = {
  vegetarisch: Leaf,
  fleisch: Beef,
  fisch: Fish,
} as const;

function downloadText(filename: string, text: string) {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function buildPlanFromRecipes(recipes: Recipe[], mealCount: number): WeekPlan {
  const result = DAYS.reduce((acc, day) => {
    acc[day] = { selected: "" };
    return acc;
  }, {} as WeekPlan);

  DAYS.slice(0, mealCount).forEach((day, index) => {
    const recipe = recipes[index];
    result[day] = { selected: recipe?.id ?? "" };
  });

  return result;
}

function parseAssistantPrompt(prompt: string, currentMealCount: number, currentPreferences: Preferences) {
  const lowered = prompt.toLowerCase();
  const numberMatch = lowered.match(/([1-7])\s*(abendessen|menü|menues|menüs|tage)/);
  const derivedMealCount = numberMatch ? Number(numberMatch[1]) : currentMealCount;

  const derivedCategory =
    lowered.includes("vegetarisch") ? "vegetarisch" :
    lowered.includes("fisch") ? "fisch" :
    lowered.includes("fleisch") ? "fleisch" :
    "alle";

  let derivedMaxTime = currentPreferences.maxTime;
  const maxTimeMatch = lowered.match(/max\.?\s*(\d{1,2})\s*min/);
  if (maxTimeMatch) derivedMaxTime = Number(maxTimeMatch[1]);
  else if (lowered.includes("schnell")) derivedMaxTime = 30;

  const derivedMood =
    lowered.includes("frisch") ? "frisch" :
    lowered.includes("gemütlich") ? "gemütlich" :
    lowered.includes("leicht") ? "leicht" :
    lowered.includes("würzig") ? "würzig" :
    currentPreferences.mood;

  const derivedSeason =
    lowered.includes("frühling") ? "Frühling" :
    lowered.includes("sommer") ? "Sommer" :
    lowered.includes("herbst") ? "Herbst" :
    lowered.includes("winter") ? "Winter" :
    currentPreferences.season;

  return {
    derivedMealCount,
    derivedPreferences: {
      ...currentPreferences,
      season: derivedSeason,
      mood: derivedMood,
      category: derivedCategory,
      maxTime: derivedMaxTime,
      familyFriendly: !lowered.includes("ohne kinder"),
      preferCoop: !lowered.includes("egal woher"),
      variety: true,
    } satisfies Preferences,
  };
}

function mapApiRecipesToUiRecipes(recipes: Awaited<ReturnType<typeof requestMealPlan>>["recipes"]): Recipe[] {
  return recipes.map((recipe) => ({
    ...recipe,
    icon: CATEGORY_ICONS[recipe.category],
  }));
}

export default function App() {
  const { user, isGuest, loading: authLoading } = useAuth();

  if (authLoading) {
    return (
      <div className="loginPage">
        <div className="loginSpinner" style={{ width: 32, height: 32 }} />
      </div>
    );
  }

  if (!user && !isGuest) return <LoginPage />;

  return <AuthenticatedApp />;
}

function AuthenticatedApp() {
  const [people, setPeople] = useState(4);
  const [mealCount, setMealCount] = useState(5);
  const [mealCountDraft, setMealCountDraft] = useState(5);
  const [preferences, setPreferences] = useState<Preferences>(defaultPreferences);
  const [preferencesDraft, setPreferencesDraft] = useState<Preferences>(defaultPreferences);
  const [recipeCatalog, setRecipeCatalog] = useState<Recipe[]>([]);
  const [plan, setPlan] = useState<WeekPlan>(() => buildPlanFromRecipes([], 5));
  const [assistantPrompt, setAssistantPrompt] = useState("Frühlingsküche, familienfreundlich, 5 Menüs, möglichst viel Gemüse.");
  const [pantryItems, setPantryItems] = useState<Record<string, boolean>>({ Salz: true, Pfeffer: true, Olivenöl: true });
  const [savedWeeks, setSavedWeeks] = useState<SavedWeek[]>(() => {
    try { return JSON.parse(localStorage.getItem("meal-planner-saved-weeks") ?? "[]"); } catch { return []; }
  });
  const [shoppingDiff, setShoppingDiff] = useState<{ day: string; fromRecipe: Recipe | null; toRecipe: Recipe | null; changes: ReturnType<typeof buildShoppingDiff> } | null>(null);
  const [activeRecipeId, setActiveRecipeId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatingDay, setGeneratingDay] = useState<string | null>(null);
  const [generationError, setGenerationError] = useState<string>("");
  const [generationDayError, setGenerationDayError] = useState<string>("");

  useEffect(() => {
    if (!generationDayError) return;
    const t = setTimeout(() => setGenerationDayError(""), 4000);
    return () => clearTimeout(t);
  }, [generationDayError]);

  const activeDays = useMemo(() => DAYS.slice(0, mealCount), [mealCount]);
  const activeRecipe = recipeCatalog.find((r) => r.id === activeRecipeId) || null;

  const filteredRecipes = useMemo(
    () => recipeCatalog.slice().sort((a, b) => recipeScore(b, preferences) - recipeScore(a, preferences)),
    [recipeCatalog, preferences]
  );

  const selectedRecipes = useMemo(
    () => activeDays.map((day) => recipeCatalog.find((r) => r.id === plan[day]?.selected)).filter(Boolean) as Recipe[],
    [activeDays, plan, recipeCatalog]
  );

  const plannedRecipes = useMemo(
    () =>
      activeDays
        .map((day) => {
          const recipe = recipeCatalog.find((r) => r.id === plan[day]?.selected);
          return recipe ? { day, recipe } : null;
        })
        .filter(Boolean) as Array<{ day: string; recipe: Recipe }>,
    [activeDays, plan, recipeCatalog]
  );

  const shoppingData = useMemo(() => {
    const merged: Record<string, { name: string; unit: string; totalQty: number; coop: string; usedIn: Array<{ recipeId: string; recipeTitle: string; qty: number; unit: string; day: string }> }> = {};
    activeDays.forEach((day) => {
      const recipe = recipeCatalog.find((r) => r.id === plan[day]?.selected);
      if (!recipe) return;
      recipe.ingredients.forEach((item) => {
        if (pantryItems[item.name]) return;
        const scaledQty = scaleQty(item.qty, recipe.portions, people);
        const key = `${item.name}__${item.unit}`;
        if (!merged[key]) merged[key] = { name: item.name, unit: item.unit, totalQty: 0, coop: item.coop, usedIn: [] };
        merged[key].totalQty += scaledQty;
        merged[key].usedIn.push({ recipeId: recipe.id, recipeTitle: recipe.title, qty: scaledQty, unit: item.unit, day });
      });
    });
    return Object.values(merged).sort((a, b) => a.name.localeCompare(b.name, "de"));
  }, [activeDays, pantryItems, people, plan, recipeCatalog]);

  const summary = useMemo(() => {
    const meals = selectedRecipes.length;
    const avgTime = meals ? Math.round(selectedRecipes.reduce((sum, r) => sum + r.time, 0) / meals) : 0;
    const vegMeals = selectedRecipes.filter((r) => r.category === "vegetarisch").length;
    return { meals, avgTime, vegMeals };
  }, [selectedRecipes]);

  const exportText = useMemo(() => {
    const lines = [
      "Wocheneinkauf",
      "",
      "Menüplan:",
      ...activeDays.map((day) => {
        const recipe = recipeCatalog.find((r) => r.id === plan[day]?.selected);
        return `- ${day}: ${recipe ? recipe.title : "Kein Menü geplant"}`;
      }),
      "",
      "Einkaufsliste (zusammengeführt):",
      ...shoppingData.map((item) => `- ${normalizeNumber(item.totalQty)} ${item.unit} ${item.name} | Coop-Vorschlag: ${item.coop} | Für: ${item.usedIn.map((u) => `${u.day} ${u.recipeTitle} (${normalizeNumber(u.qty)} ${u.unit})`).join("; ")}`),
    ];
    return lines.join("\n");
  }, [activeDays, plan, recipeCatalog, shoppingData]);

  async function generatePlanFromApi(nextMealCount: number, nextPreferences: Preferences) {
    setIsGenerating(true);
    setGenerationError("");

    try {
      const result = await requestMealPlan({
        prompt: assistantPrompt,
        mealCount: nextMealCount,
        userId: "demo-user",
      });

      const mappedRecipes = mapApiRecipesToUiRecipes(result.recipes);
      setRecipeCatalog(mappedRecipes);
      setPlan(buildPlanFromRecipes(mappedRecipes, nextMealCount));
      setMealCount(nextMealCount);
      setMealCountDraft(nextMealCount);
      setPreferences(nextPreferences);
      setPreferencesDraft(nextPreferences);
      setShoppingDiff(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Die Rezeptgenerierung ist fehlgeschlagen.";
      setGenerationError(message);
    } finally {
      setIsGenerating(false);
    }
  }

  const handleGeneratePlan = async () => {
    const { derivedMealCount, derivedPreferences } = parseAssistantPrompt(assistantPrompt, mealCountDraft, preferencesDraft);
    await generatePlanFromApi(derivedMealCount, derivedPreferences);
  };

  const handleMaxTimeDraftChange = (value: number) => {
    setPreferencesDraft((prev) => ({ ...prev, maxTime: Math.max(10, Math.min(120, value)) }));
  };

  const handleAssignRecipe = (day: string, recipeId: string) => {
    if (!activeDays.includes(day)) return;
    setPlan((prev) => ({ ...prev, [day]: { selected: recipeId } }));
    setShoppingDiff(null);
  };

  const handleGenerateRecipeForDay = async (day: string) => {
    setGeneratingDay(day);
    try {
      const result = await requestMealPlan({
        prompt: assistantPrompt,
        mealCount: 1,
        userId: "demo-user",
      });
      const [newRecipe] = mapApiRecipesToUiRecipes(result.recipes);
      if (!newRecipe) return;
      setRecipeCatalog((prev) => [...prev.filter((r) => r.id !== newRecipe.id), newRecipe]);
      setPlan((prev) => ({ ...prev, [day]: { selected: newRecipe.id } }));
      setShoppingDiff(null);
    } catch {
      setGenerationDayError("Rezeptgenerierung fehlgeschlagen. Bitte erneut versuchen.");
    } finally {
      setGeneratingDay(null);
    }
  };

  const handleMealCountDraftChange = (value: number) => {
    setMealCountDraft(Math.max(1, Math.min(7, value)));
  };

  const handleSaveWeek = () => {
    if (plannedRecipes.length === 0) return;
    const { kw, year } = getISOWeek();
    const newWeek: SavedWeek = {
      id: `${year}-${kw}-${Date.now()}`,
      kw,
      year,
      label: kwLabel(kw, year),
      savedAt: new Date().toISOString(),
      entries: plannedRecipes.map(({ day, recipe }) => ({
        day,
        recipeId: recipe.id,
        recipeTitle: recipe.title,
        category: recipe.category,
        time: recipe.time,
      })),
    };
    setSavedWeeks((prev) => {
      const updated = [newWeek, ...prev.filter((w) => w.id !== newWeek.id)];
      localStorage.setItem("meal-planner-saved-weeks", JSON.stringify(updated));
      return updated;
    });
  };

  const handleDeleteSavedWeek = (id: string) => {
    setSavedWeeks((prev) => {
      const updated = prev.filter((w) => w.id !== id);
      localStorage.setItem("meal-planner-saved-weeks", JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <>
      <RecipeModal recipe={activeRecipe} people={people} onClose={() => setActiveRecipeId(null)} />
      <AppLayout>
        <Routes>
          <Route
            path="/start"
            element={
              <StartPage
                mealCountDraft={mealCountDraft}
                people={people}
                setPeople={setPeople}
                maxTimeDraft={preferencesDraft.maxTime}
                handleMaxTimeDraftChange={handleMaxTimeDraftChange}
                assistantPrompt={assistantPrompt}
                setAssistantPrompt={setAssistantPrompt}
                handleGeneratePlan={handleGeneratePlan}
                handleMealCountDraftChange={handleMealCountDraftChange}
                plannedRecipes={plannedRecipes}
                activeDays={activeDays}
                handleAssignRecipe={handleAssignRecipe}
                setActiveRecipeId={setActiveRecipeId}
                isGenerating={isGenerating}
                generationError={generationError}
                summary={summary}
              />
            }
          />
          <Route path="/" element={<PlannerPage mealCount={mealCount} plan={plan} filteredRecipes={filteredRecipes} shoppingDiff={shoppingDiff} summary={summary} handleAssignRecipe={handleAssignRecipe} handleGenerateRecipeForDay={handleGenerateRecipeForDay} generatingDay={generatingDay} setActiveRecipeId={setActiveRecipeId} />} />
          <Route path="/recipes" element={<RecipesPage plannedRecipes={plannedRecipes} activeDays={activeDays} handleAssignRecipe={handleAssignRecipe} setActiveRecipeId={setActiveRecipeId} onSaveWeek={handleSaveWeek} savedWeeks={savedWeeks} onDeleteSavedWeek={handleDeleteSavedWeek} />} />
          <Route path="/shopping" element={<ShoppingPage pantryItems={pantryItems} setPantryItems={(fn) => setPantryItems(fn)} shoppingData={shoppingData} onExport={() => downloadText("wocheneinkauf-coop.txt", exportText)} />} />
          <Route path="*" element={<Navigate to="/start" replace />} />
        </Routes>
      </AppLayout>

      {(isGenerating || generationDayError) && (
        <div className="loadingOverlay">
          {isGenerating && (
            <div className="loadingCard">
              <Loader2 className="spin" size={22} />
              <div>
                <div className="loadingTitle">Rezepte werden generiert</div>
                <div className="loadingText">Der Assistent erstellt passende Menüvorschläge für deine Woche.</div>
              </div>
            </div>
          )}
          {generationDayError && !isGenerating && (
            <div className="loadingCard errorCard">
              <AlertCircle size={22} style={{ color: "var(--error)", flexShrink: 0 }} />
              <div>
                <div className="loadingTitle">Fehler</div>
                <div className="loadingText">{generationDayError}</div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
