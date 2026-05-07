import { useParams, Link, Navigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Clock, Tag } from "lucide-react";
import { WebsiteLayout } from "../components/WebsiteLayout";
import { blogPosts, CATEGORY_LABELS, CATEGORY_COLORS } from "../data/blogPosts";

export function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) return <Navigate to="/blog" replace />;

  const currentIndex = blogPosts.findIndex((p) => p.slug === slug);
  const prevPost = currentIndex > 0 ? blogPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < blogPosts.length - 1 ? blogPosts[currentIndex + 1] : null;

  return (
    <WebsiteLayout>
      <article className="postPage">
        <div className="postHero">
          <div className="siteContainer postHeroInner">
            <Link to="/blog" className="postBackLink">
              <ArrowLeft size={16} /> Alle Artikel
            </Link>
            <div className="postHeroCover">
              <img src={post.coverImage} alt={post.title} className="postHeroCoverImg" />
            </div>
            <div className="postHeroMeta">
              <span
                className="blogCategoryBadge"
                style={{
                  background: `${CATEGORY_COLORS[post.category]}18`,
                  color: CATEGORY_COLORS[post.category],
                  fontSize: 13,
                  padding: "4px 12px",
                }}
              >
                {CATEGORY_LABELS[post.category]}
              </span>
              <span className="blogMeta"><Clock size={13} /> {post.readTime} Minuten Lesezeit</span>
              <span className="blogMeta">
                {new Date(post.date).toLocaleDateString("de-CH", { day: "2-digit", month: "long", year: "numeric" })}
              </span>
            </div>
            <h1 className="postTitle">{post.title}</h1>
            <p className="postSubtitle">{post.subtitle}</p>
          </div>
        </div>

        <div className="siteContainer postLayout">
          {/* Article body */}
          <div className="postBody">
            {post.sections.map((section, i) => (
              <div className="postSection" key={i}>
                {section.heading && <h2 className="postSectionHeading">{section.heading}</h2>}
                {section.paragraphs.map((p, j) => (
                  <p className="postParagraph" key={j}>{p}</p>
                ))}
                {section.list && (
                  <div className="postList">
                    {section.list.intro && <p className="postParagraph">{section.list.intro}</p>}
                    <ul className="postUl">
                      {section.list.items.map((item, k) => (
                        <li className="postLi" key={k}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {section.tip && (
                  <div className="postTip">
                    <span className="postTipIcon">💡</span>
                    <p>{section.tip}</p>
                  </div>
                )}
              </div>
            ))}

            {/* Tags */}
            <div className="postTags">
              <Tag size={14} />
              {post.tags.map((t) => (
                <span className="postTag" key={t}>{t}</span>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="postSidebar">
            <div className="postSidebarCard">
              <div className="postSidebarEmoji">🥗</div>
              <h3 className="postSidebarTitle">Jetzt selbst loslegen</h3>
              <p className="postSidebarText">
                Erstelle in Sekunden deinen persönlichen Wochenplan mit KI-gestützten Rezeptvorschlägen.
              </p>
              <Link to="/app/start" className="button buttonPrimary" style={{ width: "100%", justifyContent: "center", marginTop: 8 }}>
                App öffnen <ArrowRight size={16} />
              </Link>
            </div>

            <div className="postSidebarCard">
              <h3 className="postSidebarTitle">Mehr Artikel</h3>
              <div className="postRelated">
                {blogPosts
                  .filter((p) => p.slug !== slug && p.category === post.category)
                  .slice(0, 3)
                  .map((p) => (
                    <Link to={`/blog/${p.slug}`} className="postRelatedItem" key={p.slug}>
                      <img src={p.coverImage} alt={p.title} className="postRelatedImg" loading="lazy" />
                      <span className="postRelatedTitle">{p.title}</span>
                    </Link>
                  ))}
              </div>
            </div>
          </aside>
        </div>

        {/* Prev / Next navigation */}
        <div className="siteContainer postNav">
          {prevPost ? (
            <Link to={`/blog/${prevPost.slug}`} className="postNavItem postNavPrev">
              <ArrowLeft size={16} />
              <div>
                <div className="postNavLabel">Vorheriger Artikel</div>
                <div className="postNavTitle">{prevPost.title}</div>
              </div>
            </Link>
          ) : <div />}
          {nextPost ? (
            <Link to={`/blog/${nextPost.slug}`} className="postNavItem postNavNext">
              <div style={{ textAlign: "right" }}>
                <div className="postNavLabel">Nächster Artikel</div>
                <div className="postNavTitle">{nextPost.title}</div>
              </div>
              <ArrowRight size={16} />
            </Link>
          ) : <div />}
        </div>
      </article>
    </WebsiteLayout>
  );
}
