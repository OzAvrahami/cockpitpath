import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import AuthFrame, { AuthDestination, getDestinationCopy } from "./auth-frame";

describe("AuthFrame", () => {
  it("provides the shared branded authentication landmarks", () => {
    const markup = renderToStaticMarkup(
      <AuthFrame>
        <section aria-labelledby="test-title">
          <h1 id="test-title">Authentication test</h1>
        </section>
      </AuthFrame>,
    );

    expect(markup).toContain('class="auth-shell"');
    expect(markup).toContain('href="#auth-main-content"');
    expect(markup).toContain('<main class="auth-main" id="auth-main-content">');
    expect(markup).toContain('aria-label="CockpitPath public homepage"');
    expect(markup).toContain('href="/"');
    expect(markup).toContain('aria-labelledby="auth-context-title"');
    expect(markup).toContain("Fly");
    expect(markup).toContain("Find");
    expect(markup).toContain("Understand");
  });

  it("describes only the approved destination families", () => {
    expect(getDestinationCopy("/app")).toContain("CockpitPath app");
    expect(getDestinationCopy("/account")).toContain("your account");
    expect(getDestinationCopy("/learn/journey")).toContain("learning session");

    const markup = renderToStaticMarkup(
      <AuthDestination id="destination" returnTo="/learn/journey" />,
    );
    expect(markup).toContain('id="destination"');
    expect(markup).toContain("Next destination");
  });
});
