import Link from "next/link";

import MediaSlot from "../../components/public/media-slot";
import { getJourneyOutline } from "../../lib/content/repository";
import { getGuideProgress } from "../../lib/progress/data-api";

const JOURNEY_PATH = "/learn/cold-dark-to-takeoff";
const JOURNEY_SLUG = "cold-dark-to-takeoff";

export const metadata = {
  title: "CockpitPath App | Boeing 737 MAX 8",
  description: "Continue learning the iFly Boeing 737 MAX 8 in CockpitPath.",
};

export async function getApplicationLearningState() {
  let journey;

  try {
    journey = await getJourneyOutline(JOURNEY_SLUG);
  } catch {
    return { availability: "unavailable" };
  }

  const firstSection = journey?.sections?.[0];
  if (!journey || !firstSection) return { availability: "unavailable" };

  try {
    const progress = await getGuideProgress(journey.id, firstSection.procedureId);
    return {
      availability: "available",
      hasProgress: Boolean(progress.journey),
      journeyTitle: journey.title,
    };
  } catch {
    return {
      availability: "available",
      hasProgress: null,
      journeyTitle: journey.title,
    };
  }
}

function LearningAction({ state }) {
  if (state.availability !== "available") {
    return (
      <p className="app-learning__unavailable" role="status">
        The learning journey is temporarily unavailable. Please try again later.
      </p>
    );
  }

  const label =
    state.hasProgress === true
      ? "Continue Guide Mode"
      : state.hasProgress === false
        ? "Start Guide Mode"
        : "Open Guide Mode";

  return (
    <div className="app-learning__action">
      <Link className="public-button public-button--primary" href={JOURNEY_PATH}>
        {label} <span aria-hidden="true">→</span>
      </Link>
      {state.hasProgress === null ? (
        <p>
          Guide Mode will safely resolve any saved position when the journey opens.
        </p>
      ) : null}
    </div>
  );
}

const futureAreas = [
  {
    name: "Aircraft Page",
    description: "A connected home for this aircraft and its learning paths.",
  },
  {
    name: "Cockpit Explorer",
    description: "Visual discovery for cockpit panels, areas, and controls.",
  },
  {
    name: "Aircraft Systems",
    description: "System relationships connected to procedures and controls.",
  },
];

export default async function ApplicationHomePage() {
  const learningState = await getApplicationLearningState();

  return (
    <div className="app-home">
      <section className="app-home__intro" aria-labelledby="app-home-title">
        <div className="app-home__intro-copy">
          <p className="app-eyebrow">CockpitPath app · active aircraft</p>
          <h1 id="app-home-title">Boeing 737 MAX 8</h1>
          <p className="app-home__lead">
            Continue one connected path through procedures, cockpit controls,
            and aircraft systems.
          </p>
          <dl className="app-aircraft-metadata">
            <div>
              <dt>Implementation</dt>
              <dd>iFly</dd>
            </div>
            <div>
              <dt>Simulator</dt>
              <dd>Microsoft Flight Simulator 2024</dd>
            </div>
          </dl>
        </div>

        <MediaSlot
          className="app-home__aircraft-media"
          label="Boeing 737 MAX 8 verified aircraft media"
          slotId="app-home-aircraft"
        />
      </section>

      <section className="app-learning" aria-labelledby="app-learning-title">
        <div className="app-learning__copy">
          <p className="app-eyebrow">Fly · Guide Mode</p>
          <h2 id="app-learning-title">
            {learningState.journeyTitle || "Cold & Dark → Takeoff"}
          </h2>
          <p>
            Follow the existing guided learning experience. Guide Mode opens in
            its dedicated Focus Mode interface, outside the application shell.
          </p>
        </div>
        <LearningAction state={learningState} />
      </section>

      <section className="app-future" aria-labelledby="app-future-title">
        <div className="app-future__heading">
          <p className="app-eyebrow">Connected learning areas</p>
          <h2 id="app-future-title">More ways to learn this aircraft.</h2>
          <p>
            These areas will join the same aircraft context as their planned
            product phases are implemented.
          </p>
        </div>
        <div className="app-future__list">
          {futureAreas.map((area, index) => (
            <article className="app-future__item" key={area.name}>
              <span aria-hidden="true" className="app-future__index">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h3>{area.name}</h3>
                <p>{area.description}</p>
              </div>
              <span
                aria-label={`${area.name} coming soon`}
                className="app-coming-soon"
              >
                Coming soon
              </span>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
