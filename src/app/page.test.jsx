import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import HomePage from "./page";

describe("HomePage", () => {
  it("renders CockpitPath as the accessible page heading", () => {
    const markup = renderToStaticMarkup(<HomePage />);

    expect(markup).toContain('aria-labelledby="page-title"');
    expect(markup).toContain('<h1 id="page-title">CockpitPath</h1>');
  });
});
