import { BookOpen, ChevronLeft, ChevronRight, Clock3, List, Users, X } from "lucide-react";
import { useMemo, useState } from "react";
import { CATEGORY_LABELS } from "../data";
import { normalizeNumber, scaleQty } from "../lib/planner";
import type { Recipe } from "../types";

type Props = {
  recipe: Recipe | null;
  people: number;
  onClose: () => void;
};

export function RecipeModal({ recipe, people, onClose }: Props) {
  const [isStepMode, setIsStepMode] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  const totalSteps = recipe?.steps.length ?? 0;

  const scaledIngredients = useMemo(() => {
    if (!recipe) return [];
    return recipe.ingredients.map((item) => ({
      ...item,
      scaledQty: normalizeNumber(scaleQty(item.qty, recipe.portions, people)),
    }));
  }, [recipe, people]);

  if (!recipe) return null;

  const goPrev = () => setActiveStep((prev) => Math.max(0, prev - 1));
  const goNext = () => setActiveStep((prev) => Math.min(totalSteps - 1, prev + 1));

  const handleToggleMode = () => {
    setIsStepMode((prev) => !prev);
    setActiveStep(0);
  };

  return (
    <div className="overlay" role="dialog" aria-modal="true" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal modalScrollable">
        <div className="modalHeader modalHeaderSticky">
          <div>
            <div className="modalBadges">
              <span className="badge"><Clock3 size={14} /> {recipe.time} min</span>
              <span className="badge">{CATEGORY_LABELS[recipe.category]}</span>
            </div>
            <h2 className="modalTitle">{recipe.title}</h2>
            <p className="panelText modalLead">{recipe.description}</p>
            <div className="modalInfoGrid">
              <div className="infoCard">
                <div className="infoLabel">Portionen</div>
                <div className="infoValue">{people}</div>
              </div>
              <div className="infoCard">
                <div className="infoLabel">Quelle</div>
                <div className="infoValue">{recipe.source}</div>
              </div>
              <div className="infoCard">
                <div className="infoLabel">Kategorie</div>
                <div className="infoValue">{CATEGORY_LABELS[recipe.category]}</div>
              </div>
            </div>
          </div>

          <div className="modalActions">
            <button
              className={`button ${isStepMode ? "buttonSecondary" : "buttonGhost"}`}
              onClick={handleToggleMode}
            >
              {isStepMode ? <List size={16} /> : <BookOpen size={16} />}
              {isStepMode ? "Übersicht" : "Schritt für Schritt"}
            </button>
            <button className="button buttonGhost" onClick={onClose} aria-label="Schliessen">
              <X size={16} />
            </button>
          </div>
        </div>

        {!isStepMode ? (
          <div className="modalContent">
            <div className="modalColumn">
              <div className="sectionLabel"><Users size={16} /> Für {people} Personen</div>
              <h3 className="sectionTitle">Zutaten</h3>
              <div className="stack">
                {scaledIngredients.map((item) => (
                  <div className="listItem" key={`${recipe.id}-${item.name}`}>
                    <div>
                      <div className="listItemTitle">{item.name}</div>
                      <div className="tinyText">Coop-Vorschlag: {item.coop}</div>
                    </div>
                    <div className="listItemValue">
                      {item.scaledQty} {item.unit}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="modalColumn">
              <h3 className="sectionTitle">Zubereitung Schritt für Schritt</h3>
              <div className="stack">
                {recipe.steps.map((step, index) => (
                  <div className="stepCard" key={`${recipe.id}-step-${index}`}>
                    <div className="stepHead">
                      <div className="stepBadge">{index + 1}</div>
                      <div className="tinyText">Schritt {index + 1}</div>
                    </div>
                    <p className="stepText">{step}</p>
                  </div>
                ))}
              </div>
              <div className="cookTipCard">
                <div className="cookTipTitle">Kochhinweis</div>
                <p className="cookTipText">
                  Lies das Rezept einmal vollständig durch, bevor du startest. Bereite danach alle Zutaten vor,
                  damit die eigentliche Zubereitung ruhig und übersichtlich abläuft.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="stepMode">
            <div className="stepModeTop">
              <div className="stepModeCounter">
                Schritt {activeStep + 1} von {totalSteps}
              </div>
              <div className="stepModeProgress">
                <div
                  className="stepModeProgressBar"
                  style={{ width: `${((activeStep + 1) / totalSteps) * 100}%` }}
                />
              </div>
            </div>

            <div className="stepModeCard">
              <div className="stepModeBadge">{activeStep + 1}</div>
              <p className="stepModeText">{recipe.steps[activeStep]}</p>
            </div>

            <div className="stepModeBottom">
              <button className="button buttonGhost" onClick={goPrev} disabled={activeStep === 0}>
                <ChevronLeft size={16} /> Zurück
              </button>
              <button className="button buttonPrimary" onClick={goNext} disabled={activeStep === totalSteps - 1}>
                Weiter <ChevronRight size={16} />
              </button>
            </div>

            <div className="stepModeIngredients">
              <h3 className="sectionTitle">Zutaten im Überblick</h3>
              <div className="stack">
                {scaledIngredients.map((item) => (
                  <div className="listItem" key={`${recipe.id}-compact-${item.name}`}>
                    <div>
                      <div className="listItemTitle">{item.name}</div>
                      <div className="tinyText">Coop-Vorschlag: {item.coop}</div>
                    </div>
                    <div className="listItemValue">
                      {item.scaledQty} {item.unit}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
