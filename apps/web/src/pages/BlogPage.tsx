import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Clock } from "lucide-react";
import { WebsiteLayout } from "../components/WebsiteLayout";
import { blogPosts, CATEGORY_LABELS, CATEGORY_COLORS, type BlogCategory } from "../data/blogPosts";

const ALL_CATEGORIES: Array<BlogCategory | "alle"> = [
  "alle", "organisation", "gesundheit", "finanzen", "familie", "rezepte",
];

const CATEGORY_FILTER_LABELS: Record<BlogCategory | "alle", string> = {
  alle: "Alle",
  organisation: "Organisation",
  gesundheit: "Gesundheit",
  finanzen: "Finanzen",
  familie: "Familie",
  rezepte: "Rezepte",
};

export function BlogPage() {
  const [activeCategory, setActiveCategory] = useState<BlogCategory | "alle">("alle");

  const filtered = activeCategory === "alle"
    ? blogPosts
    : blogPosts.filter((p) => p.category === activeCategory);

  return (
    <WebsiteLayout>
      {/* Hero */}
      <section className="blogHero">
        <div className="siteContainer">
          <h1 className="blogHeroTitle">Wissen rund ums Meal Planning</h1>
          <p className="blogHeroSubtext">
            Über 20 ausführliche Artikel zu Gesundheit, Finanzen, Organisation und
            leckeren Rezepten – damit du besser planst, gesünder isst und mehr sparst.
          </p>
        </div>
      </section>

      {/* Category filter */}
      <section className="blogFilter">
        <div className="siteContainer">
          <div className="blogFilterRow">
            {ALL_CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`blogFilterBtn ${activeCategory === cat ? "blogFilterBtnActive" : ""}`}
                onClick={() => setActiveCategory(cat)}
              >
                {CATEGORY_FILTER_LABELS[cat]}
                <span className="blogFilterCount">
                  {cat === "alle" ? blogPosts.length : blogPosts.filter((p) => p.category === cat).length}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Post grid */}
      <section className="blogGrid">
        <div className="siteContainer">
          <div className="blogPostGrid">
            {filtered.map((post) => (
              <Link to={`/blog/${post.slug}`} className="blogPostCard" key={post.slug}>
                <div className="blogPostCover">
                  <img src={post.coverImage} alt={post.title} className="blogPostCoverImg" loading="lazy" />
                </div>
                <div className="blogPostMeta">
                  <span
                    className="blogCategoryBadge"
                    style={{ background: `${CATEGORY_COLORS[post.category]}18`, color: CATEGORY_COLORS[post.category] }}
                  >
                    {CATEGORY_LABELS[post.category]}
                  </span>
                  <span className="blogMeta">
                    <Clock size={12} /> {post.readTime} Min.
                  </span>
                </div>
                <h2 className="blogPostTitle">{post.title}</h2>
                <p className="blogPostExcerpt">{post.excerpt}</p>
                <div className="blogPostFooter">
                  <span className="blogPostDate">
                    {new Date(post.date).toLocaleDateString("de-CH", { day: "2-digit", month: "long", year: "numeric" })}
                  </span>
                  <span className="blogReadMore">
                    Lesen <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="emptyState">
              <p className="emptyStateTitle">Keine Artikel in dieser Kategorie.</p>
            </div>
          )}
        </div>
      </section>
    </WebsiteLayout>
  );
}
