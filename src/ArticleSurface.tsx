import { BookOpenText, CaretDown, List, MagnifyingGlass, Translate, UserCircle } from "@phosphor-icons/react";
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
  ["etymology", "Etymology"],
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
  ["media", "Media"],
  ["infrastructure", "Infrastructure"],
  ["sister-cities", "Sister cities"],
  ["notable-people", "Notable people"],
  ["references", "References"],
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
            <img className="wiki-play-launcher-icon" src="/wikiplay-white.png" alt="" aria-hidden="true" />
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
          <p><strong>San Francisco</strong>, officially the <strong>City and County of San Francisco</strong>, is a commercial, financial, and cultural center in <LinkText>Northern California</LinkText>. It sits near the northern end of the <LinkText>San Francisco Peninsula</LinkText> and includes several islands in San Francisco Bay. The city is known for its steep hills, fog, cable cars, Victorian architecture, diverse neighborhoods, and the Golden Gate Bridge.</p>
          <p>The city grew rapidly after the California gold rush and later became a major Pacific port, financial center, and technology hub. San Francisco anchors a metropolitan region connected economically and culturally to Oakland, San Jose, and communities throughout the Bay Area.</p>

          <section id="etymology">
            <h2>Etymology <small>[ edit ]</small></h2>
            <p>The city is named after <LinkText>Francis of Assisi</LinkText>. Spanish colonists established Mission San Francisco de Asís, commonly called Mission Dolores, and the Presidio in 1776. The settlement was known as Yerba Buena before it was officially renamed San Francisco in 1847.</p>
          </section>

          <section id="history">
            <h2>History <small>[ edit ]</small></h2>
            <h3>Indigenous history</h3>
            <p id="indigenous-history" className={passageClass("indigenous-history")}>Before European settlement, the Yelamu, a community of the <LinkText>Ramaytush Ohlone</LinkText>, lived in villages across the San Francisco Peninsula. Their communities maintained trade networks, managed local ecosystems, and spoke a language within the Ohlone branch of the Utian language family.</p>
            <p>Spanish colonization brought missionization, disease, displacement, and profound changes to Indigenous life. Ramaytush Ohlone descendants and community organizations continue cultural, educational, and stewardship work throughout the peninsula.</p>
            <h3>Spanish and Mexican eras</h3>
            <p>Spanish settlers established the <LinkText>Presidio of San Francisco</LinkText> and Mission San Francisco de Asís in 1776. Mexico gained independence in 1821, and the mission system was later secularized. The small settlement of Yerba Buena developed around a sheltered cove that supported trade and shipping.</p>
            <h3>Early American era</h3>
            <p id="history-earthquake" className={passageClass("history-earthquake")}>The California gold rush brought rapid growth. In 1856 San Francisco became a consolidated city-county. After more than three-quarters of the city was destroyed by the <LinkText>1906 earthquake and fires</LinkText>, it was quickly rebuilt and later hosted the Panama-Pacific International Exposition.</p>
            <p>The gold rush transformed the settlement into the principal port and commercial center of the American West. Immigration from Europe, Latin America, Asia, and elsewhere made the city multilingual and established communities including Chinatown, one of the oldest and largest Chinese enclaves in North America.</p>
            <p>Cable cars began climbing the city's hills in 1873, while Victorian neighborhoods, schools, churches, theaters, and Golden Gate Park took shape. By 1890, San Francisco's population approached 300,000, making it one of the largest cities in the United States.</p>
            <h3>Modern American era</h3>
            <p>At 5:12 a.m. on April 18, 1906, a major earthquake struck northern California. Collapsed buildings, ruptured gas lines, broken water mains, and fires devastated the downtown core and left more than half of the city's residents temporarily homeless.</p>
            <p>Rebuilding proceeded rapidly. City Hall rose again in the Beaux-Arts style, neighborhoods west of the burned district expanded, and the 1915 Panama-Pacific International Exposition celebrated the city's recovery. The Bay Bridge and Golden Gate Bridge opened in the 1930s.</p>
            <h3>Modern era</h3>
            <p>During World War II, Hunters Point Naval Shipyard and Fort Mason supported Pacific operations. The United Nations Charter was signed in the city in 1945, and the 1951 Treaty of San Francisco re-established peaceful relations between Japan and the Allied Powers.</p>
            <p>Postwar migration, the Beat Generation, the 1967 Summer of Love, LGBTQ activism centered in the Castro, freeway revolts, and successive technology booms reshaped the city's neighborhoods and international identity. The 1989 Loma Prieta earthquake damaged the waterfront and helped prompt the removal of the Embarcadero Freeway.</p>
          </section>

          <section id="geography">
            <h2>Geography <small>[ edit ]</small></h2>
            <p>San Francisco is located on the <LinkText>West Coast of the United States</LinkText> at the north end of the peninsula. Its city limits include stretches of the Pacific Ocean, San Francisco Bay, and islands including Alcatraz, Treasure Island, and Yerba Buena Island.</p>
            <p id="mount-davidson" className={passageClass("mount-davidson")}>There are more than 50 hills within the city limits. <LinkText>Mount Davidson</LinkText>, San Francisco's tallest natural point, is 928 feet (283 m) high and is capped with a concrete cross built in 1934.</p>
            <p>The city's boundaries also include portions of Alameda, Red Rock, and Angel islands and the uninhabited Farallon Islands offshore. The mainland is often described as a seven-by-seven-mile square, though the city's total area is much larger when surrounding water is included.</p>
            <p>The San Andreas and Hayward faults drive much of the region's earthquake risk. Building codes, seismic retrofits, and an auxiliary water-supply system reflect that risk, while some older structures remain vulnerable.</p>
            <p>Parts of the Marina, Mission Bay, Hunters Point, the Embarcadero, and Treasure Island sit on filled land. These areas can be susceptible to soil liquefaction during earthquakes, as demonstrated during the 1989 Loma Prieta event.</p>
            <h3>Ecology</h3>
            <p>Native habitats include coastal scrub, dune systems, wetlands, rocky shorelines, and remnant grasslands. Archaeological evidence shows tule elk were historically present, while restoration projects now protect species and habitat in the Presidio, along the western shoreline, and around Lake Merced.</p>
          </section>

          <section id="climate">
            <h2>Climate <small>[ edit ]</small></h2>
            <p id="climate-statement" className={passageClass("climate-statement")}>San Francisco has a <LinkText>warm-summer Mediterranean climate</LinkText>, with cool, moist winters and mild, dry summers. The Pacific Ocean and San Francisco Bay moderate temperature swings throughout the year.</p>
            <p>Summer winds draw cool marine air through the Golden Gate, producing the city's characteristic fog. Eastern neighborhoods generally receive less fog, especially in late summer and early fall.</p>
            <p>September is typically the warmest month, and October afternoons are often warmer than those in July. The rainy season generally runs from November through April; measurable snowfall is exceptionally rare.</p>
            <div className="article-data-table climate-summary" role="table" aria-label="San Francisco climate summary">
              <div role="row"><strong role="columnheader">Measure</strong><strong role="columnheader">Typical value</strong></div>
              <div role="row"><span role="cell">Annual precipitation</span><span role="cell">About 23 inches</span></div>
              <div role="row"><span role="cell">Warmest average month</span><span role="cell">September</span></div>
              <div role="row"><span role="cell">Record high</span><span role="cell">106 °F (41 °C)</span></div>
              <div role="row"><span role="cell">Record low</span><span role="cell">27 °F (-3 °C)</span></div>
            </div>
            <p>Sea-level rise, groundwater change, and stronger coastal flooding are important climate-planning concerns for low-lying neighborhoods and waterfront infrastructure.</p>
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
            <p>San Francisco is one of the most densely populated large cities in the United States and is part of both a five-county metropolitan area and the wider San Jose-San Francisco-Oakland combined statistical area.</p>
            <h3>Race, ethnicity, religion, and languages</h3>
            <p id="race-statement" className={passageClass("race-statement")}>As of the 2020 census, San Francisco's population included 361,382 White residents, 296,505 Asian residents, 46,725 African American residents, 86,233 multiracial residents, 6,475 Native American and Alaska Native residents, and 3,476 Native Hawaiian and Pacific Islander residents. There were 136,761 Hispanic or Latino residents of any race.</p>
            <p>San Francisco is a majority-minority city. Chinese, Filipino, Vietnamese, Japanese, Korean, Mexican, Salvadoran, and many other communities are represented across neighborhoods including Chinatown, the Richmond, Sunset, Mission, Excelsior, SoMa, and Tenderloin.</p>
            <p>The city has long been shaped by migration and multilingual communities. English, Chinese languages, Spanish, Tagalog, Vietnamese, Russian, and many other languages are spoken in homes, schools, businesses, and civic life.</p>
            <h3>Education, households, and income</h3>
            <p>Household size, income, and educational attainment vary widely across the city. San Francisco has a highly educated workforce and high household incomes, alongside some of the nation's highest housing costs.</p>
            <h3>Homelessness and housing</h3>
            <p>Housing affordability and homelessness remain central civic issues. The city funds shelter, supportive housing, prevention, public health, and street outreach programs while debating land use and housing production.</p>
            <h3>Public safety</h3>
            <p>Crime patterns vary by neighborhood and year. Public agencies publish incident and emergency-response data, and city policy combines policing, violence prevention, behavioral health, and community programs.</p>
          </section>

          <section id="neighborhoods">
            <h2>Neighborhoods <small>[ edit ]</small></h2>
            <p id="neighborhood-landmarks" className={passageClass("neighborhood-landmarks")}>San Francisco's neighborhoods include Chinatown, the Mission District, North Beach, the Castro, Nob Hill, and Russian Hill. <LinkText>Lombard Street</LinkText> is famous for a steep block with eight hairpin turns, while cable cars climb nearby hills toward the waterfront.</p>
            <p>The northeastern waterfront contains the Financial District, Union Square, the Tenderloin, Fisherman's Wharf, Telegraph Hill, and North Beach. Portsmouth Square and nearby Chinatown form part of the city's earliest urban center.</p>
            <p>South of Market, Mission Bay, and the eastern waterfront changed from industrial and rail uses to a mix of housing, offices, parks, universities, cultural institutions, Oracle Park, and Chase Center.</p>
            <p>The Western Addition includes Hayes Valley, the Fillmore, and Japantown. Nearby Haight-Ashbury is associated with 1960s counterculture, while the Castro became an internationally recognized LGBTQ neighborhood and civic center.</p>
            <p>The Richmond and Sunset districts stretch toward the Pacific on either side of Golden Gate Park. The Mission, Bernal Heights, Potrero Hill, Bayview-Hunters Point, Excelsior, and Visitacion Valley reflect distinct histories of immigration, industry, housing, and community organizing.</p>
          </section>

          <section id="economy">
            <h2>Economy <small>[ edit ]</small></h2>
            <p id="economy-statement" className={passageClass("economy-statement")}>San Francisco is a global center of economic activity, technology, arts, sciences, finance, and tourism. Its economy has evolved through the gold rush, maritime trade, banking, professional services, and the growth of the technology sector.</p>
            <p>The wider Bay Area is one of the world's most productive urban economies. Within the city, finance, professional services, healthcare, education, retail, hospitality, and public institutions complement technology and tourism.</p>
            <p>Employers and workers are connected across the region by BART, Caltrain, ferries, buses, highways, and private transportation. Downtown office vacancies and hybrid work have prompted renewed debate about housing, public space, transit, and the future mix of the urban core.</p>
            <h3>Technology</h3>
            <p>Technology firms and startups cluster in downtown, South of Market, Mission Bay, and nearby cities. The sector includes software, artificial intelligence, biotechnology, financial technology, transportation, and digital media. Multiple waves of internet investment have reshaped employment, housing demand, and commercial districts since the 1990s.</p>
            <h3>Tourism and conventions</h3>
            <p>Visitors are drawn to the waterfront, Golden Gate Bridge, Alcatraz, cable cars, museums, restaurants, and neighborhood districts. Moscone Center is the city's primary convention complex, with hotels and visitor services concentrated around Union Square, South of Market, and the northeastern waterfront.</p>
          </section>

          <section id="arts-culture">
            <h2>Arts and culture <small>[ edit ]</small></h2>
            <p id="arts-statement" className={passageClass("arts-statement")}>San Francisco's cultural institutions include the <LinkText>San Francisco Museum of Modern Art</LinkText>, the de Young Museum, Legion of Honor, California Academy of Sciences, San Francisco Symphony, San Francisco Ballet, San Francisco Opera, and SFJAZZ Center.</p>
            <p>Neighborhood commercial streets, theaters, music venues, museums, festivals, and restaurants reflect the city's long history of immigration and artistic experimentation. The city was an important center for the Beat Generation, the San Francisco Renaissance, psychedelic rock, independent publishing, film, and visual art.</p>
            <h3>LGBTQ culture</h3>
            <p>The Castro became an internationally recognized LGBTQ district and organizing center. Community institutions, archives, festivals, nightlife, and the annual Pride celebration remain important parts of civic life.</p>
            <h3>Performing arts</h3>
            <p>The War Memorial and Performing Arts Center is home to the opera and ballet, while Davies Symphony Hall hosts the symphony. Smaller venues support theater, dance, jazz, experimental performance, and live music.</p>
            <h3>Museums</h3>
            <p>Major museums include SFMOMA, the Asian Art Museum, de Young, Legion of Honor, Exploratorium, Contemporary Jewish Museum, and California Academy of Sciences. Smaller institutions and archives interpret maritime history, immigration, labor, LGBTQ history, comics, photography, and neighborhood life.</p>
          </section>

          <section id="parks">
            <h2>Parks and recreation <small>[ edit ]</small></h2>
            <p id="parks-statement" className={passageClass("parks-statement")}>San Francisco maintains more than 220 parks. <LinkText>Golden Gate Park</LinkText>, the best known, stretches west toward the Pacific and contains the Conservatory of Flowers, Japanese Tea Garden, and San Francisco Botanical Garden.</p>
            <p>Other major open spaces include the Presidio, Lake Merced, Ocean Beach, Twin Peaks, Mount Davidson, and waterfront parks connected to the Golden Gate National Recreation Area. The Presidio, Crissy Field, Lands End, and Fort Funston combine natural areas with military and maritime history.</p>
            <p>Neighborhood parks range from civic squares and playgrounds to hilltop open spaces. The city and federal government jointly manage a patchwork of recreation areas, trails, beaches, gardens, and restored habitats.</p>
          </section>

          <section id="sports">
            <h2>Sports <small>[ edit ]</small></h2>
            <p id="sports-statement" className={passageClass("sports-statement")}>The <LinkText>San Francisco Giants</LinkText> play Major League Baseball at Oracle Park, while the Golden State Warriors play National Basketball Association games at Chase Center.</p>
            <p>The San Francisco 49ers originated in the city and now play in Santa Clara. The region has also hosted championship football, international soccer, professional golf, sailing competitions, and collegiate sports.</p>
            <p>The city hosts running, sailing, cycling, and community sporting events, including the Bay to Breakers road race, Escape from Alcatraz triathlon, and the San Francisco Marathon. Public recreation centers and parks support youth and amateur athletics.</p>
          </section>

          <section id="government">
            <h2>Government <small>[ edit ]</small></h2>
            <p id="government-statement" className={passageClass("government-statement")}>San Francisco is a charter city and consolidated city-county. Its executive branch is led by the mayor, while the legislative branch is the <LinkText>11-member Board of Supervisors</LinkText>.</p>
            <p>Supervisors are elected from geographic districts. Other elected offices include the city attorney, district attorney, sheriff, treasurer, assessor-recorder, and public defender, while numerous commissions oversee departments and public policy.</p>
            <p>The city uses direct ballot initiatives and operates under both municipal and county authority. Its jurisdiction includes properties outside city limits such as San Francisco International Airport and water-system lands.</p>
          </section>

          <section id="education">
            <h2>Education <small>[ edit ]</small></h2>
            <p id="education-statement" className={passageClass("education-statement")}><LinkText>University of California, San Francisco</LinkText> is dedicated to graduate education in health and biomedical sciences. Other institutions include San Francisco State University, University of San Francisco, City College of San Francisco, and California College of the Arts.</p>
            <p>Additional institutions include the University of California College of the Law, Academy of Art University, Golden Gate University, and specialized arts, design, and professional programs.</p>
            <h3>Primary and secondary schools</h3>
            <p>Public primary and secondary schools are operated by the San Francisco Unified School District, alongside charter, private, and parochial schools. The San Francisco Public Library operates a central library and neighborhood branches throughout the city.</p>
          </section>

          <section id="media">
            <h2>Media <small>[ edit ]</small></h2>
            <p id="media-statement" className={passageClass("media-statement")}><LinkText>The San Francisco Chronicle</LinkText> is the region's largest daily newspaper. The city is also served by public radio, commercial television, neighborhood papers, independent publications, and multilingual outlets.</p>
            <p>San Francisco has influenced publishing, documentary film, photography, radio, and digital media. Long-running publications include the San Francisco Examiner, while alternative, community, and neighborhood outlets cover culture and local government.</p>
            <p>Local radio and television stations serve the wider Bay Area, where shared transportation, housing, environmental, and economic issues often cross city and county boundaries.</p>
          </section>

          <section id="infrastructure">
            <h2>Infrastructure <small>[ edit ]</small></h2>
            <h3>Transportation</h3>
            <h3>Public transportation</h3>
            <p id="transport-options" className={passageClass("transport-options")}><LinkText>San Francisco Municipal Railway</LinkText>, known as Muni, operates buses, light rail, streetcars, and cable cars. <LinkText>BART</LinkText> connects the city with the East Bay, airport, and peninsula, while <LinkText>Caltrain</LinkText> provides commuter rail service south toward San Jose.</p>
            <p>Ferries link the Ferry Building and Pier 41 with communities around the bay. Regional and intercity buses connect San Francisco with neighboring counties, while historic cable cars remain both a working transit system and a city landmark.</p>
            <p>The compact street grid supports walking, cycling, taxis, ferries, and shared mobility. Transit use is high by United States standards, though service reliability, accessibility, funding, and street safety remain persistent policy concerns.</p>
            <h3>Freeways and roads</h3>
            <p>Interstate 80 begins near the Bay Bridge, while U.S. Route 101 connects the city to the peninsula and Golden Gate Bridge. Interstate 280 serves the southern part of the city. Several waterfront freeways were removed after earthquakes and replaced by surface boulevards.</p>
            <h3>Vision Zero</h3>
            <p>San Francisco adopted Vision Zero to eliminate traffic deaths through street design, speed management, enforcement, and education. Progress remains contested as pedestrians and cyclists continue to face serious injury risks.</p>
            <h3>Airports</h3>
            <p>San Francisco International Airport lies about 13 miles south of downtown in San Mateo County but is owned and operated by the city. It is a major domestic and international gateway, while Oakland and San Jose airports provide additional regional service.</p>
            <h3>Cycling and walking</h3>
            <p>Dense neighborhoods support high rates of walking and transit use. The city has expanded protected bicycle lanes, bicycle parking, slow streets, and pedestrian-safety projects.</p>
            <h3>Utilities and public safety</h3>
            <p>Water arrives primarily from the Hetch Hetchy system. Municipal and regional agencies manage electricity, wastewater, emergency response, ports, communications, and earthquake resilience. The police department dates to 1849, while the fire department provides both fire suppression and emergency medical services.</p>
          </section>

          <section id="sister-cities">
            <h2>Sister cities <small>[ edit ]</small></h2>
            <p id="sister-cities-statement" className={passageClass("sister-cities-statement")}>San Francisco participates in the Sister Cities program and maintains relationships with cities in Asia, Europe, the Americas, Africa, and the Pacific. These partnerships support cultural, educational, civic, and economic exchange.</p>
            <p>The Bay Area also hosts dozens of consulates general and honorary consulates. San Francisco and Shanghai formalized a sister-city relationship in 1980.</p>
          </section>

          <section id="notable-people">
            <h2>Notable people <small>[ edit ]</small></h2>
            <p id="notable-people-statement" className={passageClass("notable-people-statement")}>People associated with San Francisco have shaped politics, civil rights, science, technology, literature, music, film, visual art, business, and professional sports. The full list is maintained as a separate linked article.</p>
          </section>

          <section id="see-also">
            <h2>See also <small>[ edit ]</small></h2>
            <ul className="article-link-list"><li><LinkText>San Francisco Bay Area</LinkText></li><li><LinkText>List of landmarks and historic places in San Francisco</LinkText></li><li><LinkText>List of tallest buildings in San Francisco</LinkText></li><li><LinkText>Timeline of San Francisco history</LinkText></li></ul>
          </section>

          <section id="references">
            <h2>References <small>[ edit ]</small></h2>
            <ol className="reference-list"><li>United States Census Bureau. San Francisco city and county population data.</li><li>City and County of San Francisco. Government, planning, transportation, and public-service records.</li><li>National Park Service. Golden Gate National Recreation Area and Presidio histories.</li><li>California Department of Finance. Annual population estimates.</li><li>San Francisco Municipal Transportation Agency. Transit and street network information.</li><li>San Francisco Recreation and Parks. Park system history and facilities.</li></ol>
            <h3>Bibliography</h3>
            <ul className="article-link-list"><li>Historical studies of San Francisco and the Bay Area</li><li>Urban planning, architecture, and neighborhood histories</li><li>Environmental and cultural histories of Northern California</li></ul>
            <h3>Further reading</h3>
            <p>Additional collections are available through the San Francisco Public Library, California Historical Society, Bancroft Library, and local archives.</p>
            <h3>External links</h3>
            <ul className="article-link-list"><li><LinkText>Official city and county website</LinkText></li><li><LinkText>San Francisco travel and visitor information</LinkText></li><li><LinkText>San Francisco historical photographs and maps</LinkText></li></ul>
          </section>

          <footer className="article-attribution">Article text adapted from <a href="https://en.wikipedia.org/wiki/San_Francisco" target="_blank" rel="noreferrer">Wikipedia's San Francisco article</a> and shared under <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noreferrer">CC BY-SA 4.0</a>. Content has been condensed and modified.</footer>

        </article>
      </div>
    </section>
  );
}
