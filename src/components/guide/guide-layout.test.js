import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

const styles = readFileSync(new URL("../../app/globals.css", import.meta.url), "utf8");

describe("Guide Mode responsive layout contract", () => {
  it("uses dynamic viewport height and prevents horizontal page overflow", () => {
    expect(styles).toMatch(/\.guide-shell\s*\{[^}]*min-height:\s*100svh;/s);
    expect(styles).toMatch(/\.guide-shell\s*\{[^}]*overflow-x:\s*clip;/s);
  });

  it("preserves a dedicated tablet recomposition and narrow companion layout", () => {
    expect(styles).toMatch(/@media \(max-width: 900px\)[\s\S]*?\.guide-stage\s*\{[^}]*grid-template-columns:\s*1fr;/);
    expect(styles).toMatch(/@media \(max-width: 550px\)[\s\S]*?\.guide-navigation__done\s*\{[^}]*grid-column:\s*1 \/ -1;/);
    expect(styles).toMatch(/@media \(max-width: 550px\)[\s\S]*?\.guide-visual--available\s*\{[^}]*min-height:\s*0;/);
  });

  it("keeps narrow controls touch-sized and safe-area aware", () => {
    expect(styles).toMatch(/\.guide-mode-switch button,[\s\S]*?min-height:\s*2\.75rem;/);
    expect(styles).toContain("env(safe-area-inset-bottom)");
    expect(styles).toMatch(/\.guide-navigation button\s*\{[^}]*min-height:\s*3\.6rem;/s);
  });

  it("provides non-color shapes for current and skipped progress states", () => {
    expect(styles).toMatch(/\.guide-progress__tick\.is-current\s*\{[^}]*height:\s*0\.65rem;/s);
    expect(styles).toMatch(/\.guide-progress__tick\.is-skipped\s*\{[^}]*border-color:/s);
  });
});
