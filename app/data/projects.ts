/**
 * Single source of truth for the project cards on /frontend and /threejs
 * and for their detail pages at /frontend/:slug and /threejs/:slug.
 *
 * Adding a project means adding one entry here — the index grid and the
 * detail route both render from this array, so they can't drift apart.
 */

export type Section = "frontend" | "threejs";

export interface ProjectLink {
  label: string;
  href: string;
}

/** One paragraph-with-a-heading on the detail page. */
export interface DetailBlock {
  heading: string;
  body: string;
}

export interface Project {
  slug: string;
  section: Section;
  title: string;
  /** One line, shown on the card in the grid. */
  blurb: string;
  /** Longer prose, shown at the top of the detail page. */
  summary: string;
  /** The "what's actually interesting here" body of the detail page. */
  detail: DetailBlock[];
  /** Rendered small and `·`-separated under the title. */
  stack: string[];
  links: ProjectLink[];
  /** Path under /public. Omit for a project with no capture yet. */
  video?: string;
  /** Poster still for the video, so the grid doesn't fetch 10MB on load. */
  poster?: string;
  cardClass: string;
}

export const PROJECTS: Project[] = [
  // ─────────────────────────────── frontend ───────────────────────────────
  {
    slug: "drinks-food-life",
    section: "frontend",
    title: "Drinks Food Life",
    blurb: "A Next.js food-and-drink guide built on a dense, irregular Tailwind grid.",
    summary:
      "A full-stack Next.js application on Vercel for neighbourhood food and drink coverage, whose layout is the point: an irregular editorial grid that stays readable from a 320px phone to a wide desktop without collapsing into a single boring column.",
    detail: [
      {
        heading: "The grid is the hard part",
        body: "A uniform card grid is trivial. This one mixes cell spans so featured items occupy two columns and a full row while smaller entries tile around them — which means every breakpoint has to be reasoned about separately, because a span that reads as 'featured' at desktop width reads as 'broken' at mobile width. The solve is span utilities that reset to 1 below the `sm` breakpoint, so the hierarchy degrades to reading order rather than to overlap.",
      },
      {
        heading: "Server-rendered, statically cheap",
        body: "Content is rendered on the server so the first paint carries real text rather than a spinner, and the pages cache at the edge on Vercel. There is no client-side data fetch on the critical path.",
      },
    ],
    stack: ["Next.js", "React", "Tailwind CSS", "Vercel"],
    links: [{ label: "Source on GitHub", href: "https://github.com/adamaslan/dfl" }],
    video: "/dfl1b.mov",
    poster: "/posters/dfl1b.jpg",
    cardClass: "threejs-card-purp",
  },
  {
    slug: "international-art-magazine",
    section: "frontend",
    title: "International Art Magazine",
    blurb: "A responsive magazine site in hand-written HTML, CSS and vanilla JS — no framework, no build.",
    summary:
      "A publication site built with nothing but HTML, CSS and vanilla JavaScript, deployed on Netlify. It exists partly as a demonstration that a great deal of what people reach for a framework to do does not actually need one.",
    detail: [
      {
        heading: "A navbar with two different personalities",
        body: "The sticky header changes behaviour by viewport, not just by scroll position: on mobile it becomes translucent pink, on desktop translucent black. That's a design decision that most component libraries make awkward — here it's a media query and a scroll listener, together about thirty lines.",
      },
      {
        heading: "Why no framework",
        body: "The site is content, images, and one interaction. Adding React would have added a build step, a hydration cost, and a dependency tree to maintain, in exchange for nothing this page needed. The tradeoff is deliberate rather than accidental: the JS that exists is written by hand and is small enough to read in one sitting.",
      },
    ],
    stack: ["HTML", "CSS", "Vanilla JavaScript", "Netlify"],
    links: [{ label: "Source on GitHub", href: "https://github.com/adamaslan/intartmag" }],
    video: "/iam1b.mov",
    poster: "/posters/iam1b.jpg",
    cardClass: "threejs-card-purp",
  },
  {
    slug: "tasty-tech-bytes",
    section: "frontend",
    title: "Tasty Tech Bytes",
    blurb: "A Remix app on Netlify — nested routing and a Tailwind editorial grid.",
    summary:
      "A full-stack Remix application deployed to Netlify, using nested routes so that a section layout, its list view, and an individual article each own their own data loading rather than threading props down from a single page component.",
    detail: [
      {
        heading: "Loaders instead of effects",
        body: "Every route fetches its own data in a `loader` on the server. The practical consequence is that there is no loading-spinner state to design, no waterfall of `useEffect` fetches firing after hydration, and no possibility of rendering a page whose data hasn't arrived — the route simply doesn't render until it has.",
      },
      {
        heading: "Nested layout, independent revalidation",
        body: "Because the section shell and the article body are separate routes, navigating between articles re-runs only the article loader. The shell stays mounted. That is the whole argument for nested routing, and it is visible in the transition.",
      },
    ],
    stack: ["Remix", "React", "Tailwind CSS", "Netlify"],
    links: [{ label: "Source on GitHub", href: "https://github.com/adamaslan/ttb8" }],
    video: "/ttb2.mov",
    poster: "/posters/ttb2.jpg",
    cardClass: "threejs-card-purp",
  },
  {
    slug: "taco-poll-chart",
    section: "frontend",
    title: "Taco Poll Results Chart",
    blurb: "A responsive Recharts/D3 bar chart with hover detail, embedded in a Next.js page.",
    summary:
      "A data visualisation of a neighbourhood taco poll, built with Recharts (which sits on D3) inside a Next.js route. Small in scope, and a useful demonstration of the parts of charting that are actually fiddly.",
    detail: [
      {
        heading: "Responsive charts are not free",
        body: "A chart has to re-measure when its container changes, or the axis labels collide and the bars overflow. `ResponsiveContainer` handles the measurement, but the label strategy still has to change with width — at narrow widths the category labels rotate or truncate rather than overlapping each other.",
      },
      {
        heading: "Hover as the detail layer",
        body: "Rather than printing every value on the chart, exact numbers live in the tooltip. The chart carries the comparison, the tooltip carries the precision. This keeps the default view uncluttered while still being answerable.",
      },
    ],
    stack: ["Next.js", "React", "Recharts", "D3"],
    links: [
      {
        label: "Source on GitHub",
        href: "https://github.com/adamaslan/dfl/blob/main/src/app/besttacosinbk/page.js",
      },
    ],
    video: "/taco-graph.mov",
    poster: "/posters/taco-graph.jpg",
    cardClass: "threejs-card-purp",
  },

  // ──────────────────────────────── threejs ────────────────────────────────
  {
    slug: "zxy-rotating-sphere",
    section: "threejs",
    title: "Rotating Sphere with Orbiting Text",
    blurb: "A metallic sphere spinning on its own axis while orbiting a point, with beveled 3D type on its surface.",
    summary:
      "An animated 3D splash screen built with React Three Fiber and drei: a metallic sphere rotates on its own axes while simultaneously orbiting a central point, with the beveled word “ZXY” rendered in red and sitting on its surface.",
    detail: [
      {
        heading: "Two rotations at once",
        body: "Spin and orbit are different transforms and combining them naively fights itself. The sphere rotates about its own axes inside a group; the group's position is driven around a circle by sine and cosine of elapsed time. Separating the two into parent and child means neither has to know about the other.",
      },
      {
        heading: "Beveled text is geometry, not a texture",
        body: "The lettering is extruded `TextGeometry` with a bevel, so it catches the point light along its edges the way the sphere does. A texture-mapped label would stay flat under the same lighting and read as a sticker.",
      },
      {
        heading: "Material choice does the work",
        body: "The metallic look is a physically-based material with high metalness and low roughness, lit by one ambient and one point light. Almost all of the visual result here comes from those four numbers rather than from any additional code.",
      },
    ],
    stack: ["React Three Fiber", "drei", "Three.js"],
    links: [{ label: "ZXY Gallery", href: "https://online.zxygallery.com" }],
    video: "/zxy4.mov",
    poster: "/posters/zxy4.jpg",
    cardClass: "threejs-card-blue",
  },
  {
    slug: "troika-custom-font-text",
    section: "threejs",
    title: "3D Text in a Browser-Made Custom Font",
    blurb: "Vue + Troika rendering animated 3D type in a typeface I drew in the browser.",
    summary:
      "A Vue component that builds a Three.js scene from scratch — perspective camera, WebGL renderer, point light — and renders rotating 3D text reading “nyc sound guy” using Troika Three Text, in a typeface I created in-browser rather than licensed.",
    detail: [
      {
        heading: "The font is the project",
        body: "Drawing the typeface in the browser and then rendering it as 3D geometry closes a loop most 3D-text demos skip: the letterforms are authored rather than picked from a dropdown. Troika handles SDF glyph generation at runtime, so the custom face works without a pre-baked geometry step.",
      },
      {
        heading: "Manual lifecycle, deliberately",
        body: "There is no React Three Fiber reconciler here — the scene is constructed by hand on mount and torn down in `beforeUnmount`, disposing geometries, materials and the renderer. Skipping that disposal is the standard way a Three.js component leaks GPU memory across route changes, and it is invisible until the tab has been open a while.",
      },
      {
        heading: "Not the same project as the sound site",
        body: "This is the 3D type experiment. The SvelteKit booking site for the same client is a separate piece of work; they share only a name.",
      },
    ],
    stack: ["Vue", "Three.js", "Troika Three Text"],
    links: [{ label: "Source on GitHub", href: "https://github.com/adamaslan/svelte-sound-nyc" }],
    video: "/sound1.mov",
    poster: "/posters/sound1.jpg",
    cardClass: "threejs-card-blue",
  },
  {
    slug: "moving-shapes-and-text",
    section: "threejs",
    title: "Interactive Shapes and Moving Text",
    blurb: "Primitives and text driven along sine paths under a procedural sky.",
    summary:
      "A React Three Fiber scene mixing static primitives — box, sphere, cylinder, torus — with text elements that travel along sine-wave paths, set under drei's procedural `Sky` with ambient and point lighting.",
    detail: [
      {
        heading: "Animate in the frame loop, not in state",
        body: "Every moving element updates its transform inside `useFrame`, mutating the object's matrix directly. Driving the same motion through React state would trigger a re-render per frame and drop the scene to single-digit frame rates — this is the first thing that goes wrong when people bring React habits to R3F.",
      },
      {
        heading: "Sine as a cheap choreographer",
        body: "Each text object gets a different amplitude, frequency and phase offset. That is enough to make several elements look independently choreographed without any animation system, keyframes or timeline.",
      },
      {
        heading: "A known rough edge",
        body: "The canvas-sizing helper in this scene misuses R3F's `set` and is effectively a no-op; the layout works because the canvas is already sized by CSS. It is left in as an honest artefact rather than quietly cleaned up for the portfolio.",
      },
    ],
    stack: ["React Three Fiber", "drei", "Three.js"],
    links: [{ label: "Source on GitHub", href: "https://github.com/adamaslan/dacubes2" }],
    video: "/nycpony.mov",
    poster: "/posters/nycpony.jpg",
    cardClass: "threejs-card-blue",
  },
  {
    slug: "starfield-orbit-banner",
    section: "threejs",
    title: "Starfield, Orbiting Sphere and Torus Banner",
    blurb: "An orbiting metallic sphere and rotating torus inside a drei starfield, with orbit controls.",
    summary:
      "An interactive banner scene: a metallic sphere carrying floating “TTB” text orbits a rotating orange torus, all inside a drei `Stars` field lit by pink-tinted hemisphere and point lights, with `OrbitControls` handing camera control to the visitor.",
    detail: [
      {
        heading: "Depth from a starfield",
        body: "The star layer exists to give parallax. Without it the orbit reads as flat circular motion; with thousands of points at varying depth behind it, the same animation reads as an object moving through space. It costs one component.",
      },
      {
        heading: "Coloured lights instead of coloured materials",
        body: "The pink cast comes from the hemisphere and point lights rather than from tinting each material. One change then re-tints the whole scene coherently, including the specular highlights — tinting materials individually never quite matches.",
      },
      {
        heading: "Letting the visitor drive",
        body: "`OrbitControls` turns a looping animation into something explorable. The tradeoff is that the composition can no longer be art-directed from a fixed camera, so the scene has to look acceptable from every angle the controls permit.",
      },
    ],
    stack: ["React Three Fiber", "drei", "Three.js"],
    links: [{ label: "Source on GitHub", href: "https://github.com/adamaslan/dacubes2" }],
    video: "/stars1.mov",
    poster: "/posters/stars1.jpg",
    cardClass: "threejs-card-blue",
  },
];

export function projectsIn(section: Section): Project[] {
  return PROJECTS.filter((project) => project.section === section);
}

export function findProject(section: Section, slug: string): Project | undefined {
  return PROJECTS.find(
    (project) => project.section === section && project.slug === slug,
  );
}
