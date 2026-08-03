import { BookOpenText, CaretDown, List, MagnifyingGlass, Sparkle, Translate, UserCircle } from "@phosphor-icons/react";
import type { ReactNode } from "react";
import wikipediaWordmark from "../Wikipedia-logo-textonly.svg.webp";

interface ArticleSurfaceProps {
  activePassage?: string;
  selectionEnabled?: boolean;
  onSelectArticleText?: (passageId: string, text: string) => void;
  onNavigate: (sectionId: string, passageId?: string) => void;
  onOpenWikiPlay: () => void;
  showWikiPlayLauncher: boolean;
}

const sections = [
  ["history", "History"],
  ["geography", "Geography"],
  ["climate", "Climate"],
  ["demographics", "Demographics"],
  ["neighborhoods", "Neighborhoods"],
  ["economy", "Economy"],
  ["arts-culture", "Arts and culture"],
  ["parks", "Parks"],
  ["sports", "Sports"],
  ["government", "Government"],
  ["education", "Education"],
  ["infrastructure", "Infrastructure"],
];

function LinkText({ children }: { children: ReactNode }) {
  return <span className="wiki-link">{children}</span>;
}

export function ArticleSurface({ activePassage, selectionEnabled, onSelectArticleText, onNavigate, onOpenWikiPlay, showWikiPlayLauncher }: ArticleSurfaceProps) {
  const passageClass = (id: string) => `article-passage${activePassage === id ? " is-highlighted" : ""}`;

  const captureSelection = (article: HTMLElement) => {
    if (!selectionEnabled) return;
    const selection = window.getSelection();
    const anchor = selection?.anchorNode instanceof Element ? selection.anchorNode : selection?.anchorNode?.parentElement;
    const focus = selection?.focusNode instanceof Element ? selection.focusNode : selection?.focusNode?.parentElement;
    const text = selection?.toString().replace(/\s+/g, " ").trim() ?? "";
    if (!selection || selection.isCollapsed || !anchor || !focus || !text) return;
    if (!article.contains(anchor) || !article.contains(focus)) return;

    const source = anchor.closest<HTMLElement>(".article-passage, section");
    onSelectArticleText?.(source?.id || "article-selection", text);
  };

  return (
    <section className="article-surface" aria-label="Frozen San Francisco Wikipedia article">
      <header className="wiki-header">
        <button className="icon-button menu-button" aria-label="Open main menu"><List size={22} /></button>
        <div className="wiki-brand">
          <span><img src={wikipediaWordmark} alt="Wikipedia" /></span>
        </div>
        <label className="wiki-search">
          <MagnifyingGlass size={19} />
          <input aria-label="Search Wikipedia" placeholder="Search Wikipedia" />
          <button type="button">Search</button>
        </label>
        <div className="header-tools">
          <div className="account-links" aria-hidden="true"><span>Donate</span><span>Create account</span><span>Log in</span></div>
          <button
            className={`wiki-play-launcher${showWikiPlayLauncher ? "" : " is-hidden"}`}
            type="button"
            onClick={onOpenWikiPlay}
            aria-hidden={!showWikiPlayLauncher}
            inert={!showWikiPlayLauncher}
            tabIndex={showWikiPlayLauncher ? 0 : -1}
          >
            <Sparkle size={19} weight="fill" aria-hidden="true" />
            <span>WikiPlay</span>
          </button>
          <Translate size={20} aria-hidden="true" />
          <BookOpenText size={20} aria-hidden="true" />
          <UserCircle size={22} aria-hidden="true" />
        </div>
      </header>

      <div className="article-layout">
        <aside className="wiki-sidebar">
          <h2>Contents</h2>
          <button onClick={() => onNavigate("article-top")}>Beginning</button>
          {sections.map(([id, label]) => (
            <button key={id} onClick={() => onNavigate(id)}>{label}</button>
          ))}
          <div className="sidebar-rule" />
          <h3>Contribute</h3>
          <a href="#learn">Learn to edit</a>
          <a href="#community">Community portal</a>
          <a href="#changes">Recent changes</a>
        </aside>

        <article className="wiki-article" id="article-top" onMouseUp={(event) => captureSelection(event.currentTarget)}>
          <div className="article-title-row">
            <h1>San Francisco</h1>
            <button className="language-button"><Translate size={18} /> 193 Languages <CaretDown size={14} /></button>
          </div>
          <nav className="article-tabs"><span className="active">Article</span><span>Talk</span><span className="push">Read</span><span>Edit</span><span>View history</span></nav>
          <div className="article-kicker">From Wikipedia, the free encyclopedia</div>

          <aside className="infobox">
            <div className="infobox-title">San Francisco</div>
            <div className="infobox-subtitle">City and county</div>
            <div className="photo sf-skyline" role="img" aria-label="Stylized San Francisco skyline photograph"><span>San Francisco Bay</span></div>
            <div className="infobox-grid">
              <div><strong>Population</strong><span>808,988 est.</span></div>
              <div><strong>Founded</strong><span>June 29, 1776</span></div>
              <div><strong>Area</strong><span>46.9 sq mi</span></div>
              <div><strong>Elevation</strong><span>52 ft</span></div>
            </div>
          </aside>

          <p><em>This article is about the city and county in California. For other uses, see <LinkText>San Francisco (disambiguation)</LinkText>.</em></p>
          <p><strong>San Francisco</strong>, officially the <strong>City and County of San Francisco</strong>, is a commercial, financial, and cultural center in <LinkText>Northern California</LinkText>. It sits near the northern end of the <LinkText>San Francisco Peninsula</LinkText> and includes several islands in San Francisco Bay.</p>

          <section id="history">
            <h2>History <small>[ edit ]</small></h2>
            <p id="indigenous-history" className={passageClass("indigenous-history")}>Before European settlement, the area was inhabited by the <LinkText>Ramaytush Ohlone</LinkText>, whose communities lived across the peninsula and along the bay. Spanish settlers established the <LinkText>Presidio of San Francisco</LinkText> and Mission San Francisco de Asís in 1776.</p>
            <p id="history-earthquake" className={passageClass("history-earthquake")}>The California gold rush brought rapid growth. In 1856 San Francisco became a consolidated city-county. After more than three-quarters of the city was destroyed by the <LinkText>1906 earthquake and fires</LinkText>, it was quickly rebuilt and later hosted the Panama-Pacific International Exposition.</p>
          </section>

          <section id="geography">
            <h2>Geography <small>[ edit ]</small></h2>
            <p>San Francisco is located on the <LinkText>West Coast of the United States</LinkText> at the north end of the peninsula. Its city limits include stretches of the Pacific Ocean, San Francisco Bay, and islands including Alcatraz, Treasure Island, and Yerba Buena Island.</p>
            <p id="mount-davidson" className={passageClass("mount-davidson")}>There are more than 50 hills within the city limits. <LinkText>Mount Davidson</LinkText>, San Francisco's tallest natural point, is 928 feet (283 m) high and is capped with a concrete cross built in 1934.</p>
          </section>

          <section id="climate">
            <h2>Climate <small>[ edit ]</small></h2>
            <p id="climate-statement" className={passageClass("climate-statement")}>San Francisco has a <LinkText>warm-summer Mediterranean climate</LinkText>, with cool, moist winters and mild, dry summers. The Pacific Ocean and San Francisco Bay moderate temperature swings throughout the year.</p>
            <p>Summer winds draw cool marine air through the Golden Gate, producing the city's characteristic fog. Eastern neighborhoods generally receive less fog, especially in late summer and early fall.</p>
          </section>

          <section id="demographics">
            <h2>Demographics <small>[ edit ]</small></h2>
            <div className="population-table" aria-label="Historical population table">
              <strong>Historical population</strong>
              <div><span>2010</span><span>805,235</span></div>
              <div><span>2020</span><span>873,965</span></div>
              <div><span>2023 est.</span><span>808,988</span></div>
            </div>
            <p id="population-statement" className={passageClass("population-statement")}>The <LinkText>2020 United States census</LinkText> showed San Francisco's population to be 873,965, an increase of 8.5% from the 2010 census.</p>
            <p>More recent estimates indicate that the city's population has since changed.</p>
            <h3>Race, ethnicity, religion, and languages</h3>
            <p id="race-statement" className={passageClass("race-statement")}>As of the 2020 census, San Francisco's population included residents identifying as White, Asian, African American, multiracial, Native American, Pacific Islander, Hispanic or Latino, and other races. The city has long been shaped by migration and multilingual communities.</p>
          </section>

          <section id="neighborhoods">
            <h2>Neighborhoods <small>[ edit ]</small></h2>
            <p id="neighborhood-landmarks" className={passageClass("neighborhood-landmarks")}>San Francisco's neighborhoods include Chinatown, the Mission District, North Beach, the Castro, Nob Hill, and Russian Hill. <LinkText>Lombard Street</LinkText> is famous for a steep block with eight hairpin turns, while cable cars climb nearby hills toward the waterfront.</p>
          </section>

          <section id="economy">
            <h2>Economy <small>[ edit ]</small></h2>
            <p id="economy-statement" className={passageClass("economy-statement")}>San Francisco is a global center of economic activity, technology, arts, sciences, finance, and tourism. Its economy has evolved through the gold rush, maritime trade, banking, professional services, and the growth of the technology sector.</p>
            <p>Employers and workers are connected across the wider Bay Area by regional transportation systems. The city's economy is also supported by conventions, hospitality, culture, and international travel.</p>
          </section>

          <section id="arts-culture">
            <h2>Arts and culture <small>[ edit ]</small></h2>
            <p id="arts-statement" className={passageClass("arts-statement")}>San Francisco's cultural institutions include the <LinkText>San Francisco Museum of Modern Art</LinkText>, the de Young Museum, Legion of Honor, California Academy of Sciences, San Francisco Symphony, San Francisco Ballet, San Francisco Opera, and SFJAZZ Center.</p>
            <p>Neighborhood commercial streets, theaters, music venues, museums, festivals, and restaurants reflect the city's long history of immigration and artistic experimentation.</p>
          </section>

          <section id="parks">
            <h2>Parks and recreation <small>[ edit ]</small></h2>
            <p id="parks-statement" className={passageClass("parks-statement")}>San Francisco maintains more than 220 parks. <LinkText>Golden Gate Park</LinkText>, the best known, stretches west toward the Pacific and contains the Conservatory of Flowers, Japanese Tea Garden, and San Francisco Botanical Garden.</p>
            <p>Other major open spaces include the Presidio, Lake Merced, Ocean Beach, and waterfront parks connected to the Golden Gate National Recreation Area.</p>
          </section>

          <section id="sports">
            <h2>Sports <small>[ edit ]</small></h2>
            <p id="sports-statement" className={passageClass("sports-statement")}>The <LinkText>San Francisco Giants</LinkText> play Major League Baseball at Oracle Park, while the Golden State Warriors play National Basketball Association games at Chase Center.</p>
            <p>The city also hosts running, sailing, cycling, and community sporting events, including the Bay to Breakers road race and the San Francisco Marathon.</p>
          </section>

          <section id="government">
            <h2>Government <small>[ edit ]</small></h2>
            <p id="government-statement" className={passageClass("government-statement")}>San Francisco is a charter city and consolidated city-county. Its executive branch is led by the mayor, while the legislative branch is the <LinkText>11-member Board of Supervisors</LinkText>.</p>
            <p>The city also uses direct ballot initiatives, and its municipal authority includes properties outside city limits such as San Francisco International Airport.</p>
          </section>

          <section id="education">
            <h2>Education <small>[ edit ]</small></h2>
            <p id="education-statement" className={passageClass("education-statement")}><LinkText>University of California, San Francisco</LinkText> is dedicated to graduate education in health and biomedical sciences. Other institutions include San Francisco State University, University of San Francisco, City College of San Francisco, and California College of the Arts.</p>
            <p>Public primary and secondary schools are operated by the San Francisco Unified School District, alongside charter, private, and parochial schools.</p>
          </section>

          <section id="infrastructure">
            <h2>Infrastructure <small>[ edit ]</small></h2>
            <h3>Public transportation</h3>
            <p id="transport-options" className={passageClass("transport-options")}><LinkText>San Francisco Municipal Railway</LinkText>, known as Muni, operates buses, light rail, streetcars, and cable cars. <LinkText>BART</LinkText> connects the city with the East Bay, airport, and peninsula, while <LinkText>Caltrain</LinkText> provides commuter rail service south toward San Jose.</p>
            <p>The compact street grid supports walking, cycling, taxis, ferries, and shared mobility. Historic cable cars remain both a working transit system and a city landmark.</p>
          </section>

        </article>
      </div>
    </section>
  );
}
