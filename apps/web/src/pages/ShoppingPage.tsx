import { Check, ClipboardList, Download, Plus, ShoppingCart, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { normalizeNumber } from "../lib/planner";

type Props = {
  pantryItems: Record<string, boolean>;
  setPantryItems: (fn: (prev: Record<string, boolean>) => Record<string, boolean>) => void;
  shoppingData: Array<{ name: string; unit: string; totalQty: number; coop: string; usedIn: Array<{ recipeId: string; recipeTitle: string; qty: number; unit: string; day: string }> }>;
  onExport: () => void;
};

export function ShoppingPage({ pantryItems, setPantryItems, shoppingData, onExport }: Props) {
  const [newPantryItem, setNewPantryItem] = useState("");

  const handleAddPantryItem = () => {
    const trimmed = newPantryItem.trim();
    if (!trimmed || pantryItems[trimmed] !== undefined) return;
    setPantryItems((prev) => ({ ...prev, [trimmed]: true }));
    setNewPantryItem("");
  };

  const handleRemovePantryItem = (key: string) => {
    setPantryItems((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  return (
    <section className="shoppingGrid pageSection">
      <div className="panel">
        <div className="panelHeader">
          <div className="panelTitle"><ClipboardList size={18} /> Vorräte zuhause</div>
          <div className="panelText">Markierte Zutaten werden aus der Einkaufsliste ausgeblendet.</div>
        </div>
        <div className="stack">
          <div className="toggleCard">
            {Object.keys(pantryItems).map((key) => (
              <div className="rowBetween" key={key} style={{ gap: 8 }}>
                <label className="rowBetween" style={{ flex: 1, gap: 8, cursor: "pointer" }}>
                  <span className="smallLabel">{key}</span>
                  <input type="checkbox" checked={pantryItems[key]} onChange={(e) => setPantryItems((prev) => ({ ...prev, [key]: e.target.checked }))} />
                </label>
                <button
                  onClick={() => handleRemovePantryItem(key)}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-secondary)", fontSize: 16, lineHeight: 1, padding: "0 2px" }}
                  aria-label={`${key} entfernen`}
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <input
              className="textarea"
              style={{ minHeight: "auto", padding: "10px 12px", flex: 1 }}
              placeholder="Zutat hinzufügen…"
              value={newPantryItem}
              onChange={(e) => setNewPantryItem(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleAddPantryItem(); }}
            />
            <button className="button buttonSecondary" onClick={handleAddPantryItem} disabled={!newPantryItem.trim()} style={{ flexShrink: 0 }}>
              <Plus size={16} />
            </button>
          </div>

          <div className="successNote">
            <div className="panelTitle"><Check size={18} /> Zuordnung bleibt erhalten</div>
            <div className="panelText">Jede Zutat zeigt, für welche Gerichte sie gebraucht wird — auch nach der Zusammenführung.</div>
          </div>
          <button className="button buttonPrimary" onClick={onExport} disabled={shoppingData.length === 0}><Download size={16} /> Einkaufsliste exportieren</button>
        </div>
      </div>

      <div className="panel">
        <div className="panelHeader rowResponsive">
          <div>
            <div className="panelTitle"><ShoppingCart size={18} /> Einkaufsliste</div>
            <div className="panelText">Zusammengeführt und bereit für Coop oder andere Supermärkte.</div>
          </div>
          <span className="glassPill">{shoppingData.length} Positionen</span>
        </div>

        {shoppingData.length === 0 ? (
          <div className="emptyState">
            <div className="emptyStateIcon"><ShoppingBag size={24} /></div>
            <p className="emptyStateTitle">Liste ist leer</p>
            <p className="emptyStateText">Plane Menüs im Wochenplan, damit hier deine Einkaufsliste erscheint. Vorratszutaten werden automatisch ausgeblendet.</p>
          </div>
        ) : (
          <div className="shoppingList">
            {shoppingData.map((item) => (
              <div className="shoppingItem" key={`${item.name}-${item.unit}`}>
                <div className="rowResponsive">
                  <div>
                    <div className="listItemTitle">{item.name}</div>
                    <div className="tinyText">Coop-Vorschlag: {item.coop}</div>
                  </div>
                  <div className="amountBadge">{normalizeNumber(item.totalQty)} {item.unit}</div>
                </div>
                <div className="chipRow">
                  {item.usedIn.map((u) => (
                    <span className="badge" key={`${item.name}-${u.day}-${u.recipeId}`}>{u.day}: {u.recipeTitle} · {normalizeNumber(u.qty)} {u.unit}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
