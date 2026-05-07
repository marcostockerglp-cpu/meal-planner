import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, CheckCircle, Clock, PiggyBank, Salad, Sparkles } from "lucide-react";
import { WebsiteLayout } from "../components/WebsiteLayout";
import { blogPosts, CATEGORY_LABELS } from "../data/blogPosts";

const FEATURES = [
  {
    icon: Sparkles,
    title: "KI-gestützter Wochenplan",
    text: "Unser Assistent erstellt in Sekunden einen personalisierten Plan basierend auf deinen Wünschen, der Saison und deiner Haushaltsgrösse.",
  },
  {
    icon: PiggyBank,
    title: "Bis zu 500 CHF sparen",
    text: "Durch gezielte Planung und optimierte Einkaufslisten reduzierst du Lebensmittelverschwendung und unnötige Ausgaben erheblich.",
  },
  {
    icon: Salad,
    title: "Automatisch ausgewogen",
    text: "Abwechslungsreiche Gerichte nach Saison, Kategorie und Zeit – vegetarisch, Fisch oder Fleisch, ganz nach deinen Präferenzen.",
  },
  {
    icon: Clock,
    title: "Einkauf in Minuten",
    text: "Die fertige Einkaufsliste fasst alle Zutaten zusammen. Kein Vergessen, kein doppelter Einkauf, kein Chaos im Supermarkt.",
  },
];

const HOW_IT_WORKS = [
  { step: "01", title: "Wünsche eingeben", text: "Gib an, wie viele Mahlzeiten du planst, wie viele Personen essen und welche Kategorie du bevorzugst." },
  { step: "02", title: "Plan generieren", text: "Der KI-Assistent erstellt deinen persönlichen Wochenplan mit passenden Rezepten in Sekunden." },
  { step: "03", title: "Einkaufen & geniessen", text: "Die fertige Einkaufsliste zeigt dir alles was du brauchst. Kochen kann beginnen." },
];

const BENEFITS = [
  "Keine «Was koche ich heute?»-Frage mehr",
  "Mehr Gemüse und ausgewogenere Ernährung",
  "Weniger Lebensmittelverschwendung",
  "Günstigeres Einkaufen durch bessere Planung",
  "Weniger Stress am Feierabend",
  "Saisonale Gerichte für maximalen Genuss",
];

const recentPosts = blogPosts.slice(0, 3);

export function LandingPage() {
  return (
    <WebsiteLayout>
      {/* Hero */}
      <section className="heroSection">
        <div className="heroContent">
          <div className="heroBadge">🇨🇭 Designed für die Schweiz</div>
          <h1 className="heroHeading">
            Dein intelligenter<br />
            <span className="heroHeadingAccent">Wochenplan-Assistent</span>
          </h1>
          <p className="heroSubtext">
            Plane deine Woche in Minuten, spare bis zu 500 Franken pro Monat und iss
            gesünder – mit KI-gestützten Rezeptvorschlägen, automatischer Einkaufsliste
            und Schritt-für-Schritt-Anleitungen.
          </p>
          <div className="heroCtas">
            <Link to="/app/start" className="button buttonPrimary heroCtaPrimary">
              Kostenlos starten <ArrowRight size={18} />
            </Link>
            <Link to="/blog" className="button buttonGhost">
              Mehr erfahren
            </Link>
          </div>
          <div className="heroSocialProof">
            <span>✓ Kostenlos</span>
            <span>✓ Kein Download nötig</span>
            <span>✓ Sofort loslegen</span>
          </div>
        </div>
        <div className="heroVisual">
          <div className="heroCard">
            <div className="heroCardHeader">
              <span className="heroCardEmoji">📅</span>
              <div>
                <div className="heroCardTitle">Wochenplan KW 18</div>
                <div className="heroCardSub">5 Abendessen · 4 Personen</div>
              </div>
            </div>
            <div className="heroCardDays">
              {["Mo", "Di", "Mi", "Do", "Fr"].map((d, i) => (
                <div className="heroCardDay" key={d}>
                  <span className="heroCardDayLabel">{d}</span>
                  <span className="heroCardDayRecipe">
                    {["Spargel-Pasta 🌿", "Lachsfilet 🐟", "Kürbissuppe 🎃", "Hühnercurry 🍗", "Veggie-Bowl 🥗"][i]}
                  </span>
                </div>
              ))}
            </div>
            <div className="heroCardFooter">
              <span className="badge">⏱ Ø 32 min</span>
              <span className="badge">🥗 3 vegetarisch</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="featuresSection">
        <div className="siteContainer">
          <div className="sectionHeader">
            <h2 className="sectionTitle">Alles was du brauchst</h2>
            <p className="sectionSubtext">Von der Idee bis zur fertigen Einkaufsliste – in wenigen Minuten.</p>
          </div>
          <div className="featuresGrid">
            {FEATURES.map((f) => {
              const Icon = f.icon;
              return (
                <div className="featureCard" key={f.title}>
                  <div className="featureIcon">
                    <Icon size={24} />
                  </div>
                  <h3 className="featureTitle">{f.title}</h3>
                  <p className="featureText">{f.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="howSection">
        <div className="siteContainer">
          <div className="sectionHeader">
            <h2 className="sectionTitle">So funktioniert's</h2>
            <p className="sectionSubtext">In drei einfachen Schritten zu deinem Wochenplan.</p>
          </div>
          <div className="howGrid">
            {HOW_IT_WORKS.map((s) => (
              <div className="howStep" key={s.step}>
                <div className="howStepNumber">{s.step}</div>
                <h3 className="howStepTitle">{s.title}</h3>
                <p className="howStepText">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="benefitsSection">
        <div className="siteContainer benefitsInner">
          <div className="benefitsText">
            <h2 className="sectionTitle">Warum Wochenplanung?</h2>
            <p className="sectionSubtext" style={{ marginBottom: 28 }}>
              Wer plant, isst besser, spart mehr und hat weniger Stress. Die Wissenschaft
              bestätigt: Geplante Mahlzeiten enthalten mehr Gemüse, kosten weniger und
              machen glücklicher.
            </p>
            <ul className="benefitsList">
              {BENEFITS.map((b) => (
                <li className="benefitsItem" key={b}>
                  <CheckCircle size={18} className="benefitsCheck" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
            <Link to="/app/start" className="button buttonPrimary" style={{ marginTop: 28 }}>
              Jetzt ausprobieren <ArrowRight size={16} />
            </Link>
          </div>
          <div className="benefitsStats">
            <div className="statCard">
              <div className="statNumber">500<span className="statUnit">CHF</span></div>
              <div className="statLabel">durchschnittliche Monatsersparnis</div>
            </div>
            <div className="statCard">
              <div className="statNumber">28<span className="statUnit">%</span></div>
              <div className="statLabel">mehr Gemüse pro Woche</div>
            </div>
            <div className="statCard">
              <div className="statNumber">3<span className="statUnit">h</span></div>
              <div className="statLabel">Zeitersparnis pro Woche</div>
            </div>
            <div className="statCard">
              <div className="statNumber">−70<span className="statUnit">%</span></div>
              <div className="statLabel">weniger Lebensmittelverschwendung</div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Blog Posts */}
      <section className="blogTeaser">
        <div className="siteContainer">
          <div className="sectionHeader">
            <h2 className="sectionTitle">Aus unserem Blog</h2>
            <p className="sectionSubtext">Tipps, Wissen und Inspiration rund um bessere Ernährung.</p>
          </div>
          <div className="blogTeaserGrid">
            {recentPosts.map((post) => (
              <Link to={`/blog/${post.slug}`} className="blogTeaserCard" key={post.slug}>
                <div className="blogTeaserCover">
                  <img src={post.coverImage} alt={post.title} className="blogTeaserCoverImg" loading="lazy" />
                </div>
                <div className="blogTeaserCategoryRow">
                  <span className="blogCategoryBadge" style={{ background: "var(--surface-alt)" }}>
                    {CATEGORY_LABELS[post.category]}
                  </span>
                  <span className="blogMeta">{post.readTime} Min.</span>
                </div>
                <h3 className="blogTeaserTitle">{post.title}</h3>
                <p className="blogTeaserExcerpt">{post.excerpt}</p>
                <span className="blogTeaserReadMore">
                  Weiterlesen <ArrowRight size={14} />
                </span>
              </Link>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 36 }}>
            <Link to="/blog" className="button buttonGhost">
              <BookOpen size={16} /> Alle Artikel ansehen
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="ctaSection">
        <div className="siteContainer">
          <div className="ctaCard">
            <h2 className="ctaTitle">Bereit für eine bessere Woche?</h2>
            <p className="ctaText">
              Starte jetzt kostenlos – kein Download, kein Abo, keine Kreditkarte.
            </p>
            <Link to="/app/start" className="button buttonPrimary ctaButton">
              Wochenplan erstellen <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </WebsiteLayout>
  );
}
