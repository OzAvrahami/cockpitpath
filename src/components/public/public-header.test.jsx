import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import Brand from "./brand";
import PublicHeader, {
  canShowBackToTop,
  getBackToTopThreshold,
  hasPassedBackToTopThreshold,
  returnToTop,
} from "./public-header";

describe("PublicHeader navigation refinement", () => {
  it("uses the Route & Fix identity as a same-page top link", () => {
    const markup = renderToStaticMarkup(<Brand />);

    expect(markup).toContain('href="#top"');
    expect(markup).toContain('data-public-home-link="true"');
    expect(markup).toContain('aria-label="CockpitPath home — return to top"');
  });

  it("renders the sticky-header and initially hidden Back to top contracts", () => {
    const markup = renderToStaticMarkup(<PublicHeader authenticated={false} />);

    expect(markup).toContain('class="public-header public-header--sticky"');
    expect(markup).toContain('aria-label="Back to top"');
    expect(markup).toContain('data-visible="false"');
    expect(markup).toContain('aria-hidden="true"');
    expect(markup).toContain('tabindex="-1"');
  });

  it("shows Back to top only after one viewport and outside blocking UI", () => {
    expect(getBackToTopThreshold(320)).toBe(480);
    expect(getBackToTopThreshold(800)).toBe(800);
    expect(hasPassedBackToTopThreshold(799, 800)).toBe(false);
    expect(hasPassedBackToTopThreshold(800, 800)).toBe(true);

    expect(
      canShowBackToTop({
        blockingRegionVisible: false,
        menuOpen: false,
        thresholdPassed: true,
      }),
    ).toBe(true);
    expect(
      canShowBackToTop({
        blockingRegionVisible: false,
        menuOpen: true,
        thresholdPassed: true,
      }),
    ).toBe(false);
    expect(
      canShowBackToTop({
        blockingRegionVisible: true,
        menuOpen: false,
        thresholdPassed: true,
      }),
    ).toBe(false);
  });

  it("scrolls smoothly for pointer activation and moves focus to the top link", () => {
    const scrollTo = vi.fn();
    const focus = vi.fn();
    const windowObject = {
      matchMedia: vi.fn(() => ({ matches: false })),
      scrollTo,
    };

    returnToTop({
      focusTarget: { focus },
      smooth: true,
      windowObject,
    });

    expect(scrollTo).toHaveBeenCalledWith({ behavior: "smooth", top: 0 });
    expect(focus).toHaveBeenCalledWith({ preventScroll: true });
  });

  it("uses immediate scrolling for reduced motion and keyboard activation", () => {
    const reducedMotionScroll = vi.fn();
    const reducedMotionWindow = {
      matchMedia: vi.fn(() => ({ matches: true })),
      scrollTo: reducedMotionScroll,
    };

    returnToTop({
      focusTarget: null,
      smooth: true,
      windowObject: reducedMotionWindow,
    });
    expect(reducedMotionScroll).toHaveBeenCalledWith({
      behavior: "auto",
      top: 0,
    });

    const keyboardScroll = vi.fn();
    returnToTop({
      focusTarget: null,
      smooth: false,
      windowObject: {
        matchMedia: vi.fn(() => ({ matches: false })),
        scrollTo: keyboardScroll,
      },
    });
    expect(keyboardScroll).toHaveBeenCalledWith({
      behavior: "auto",
      top: 0,
    });
  });
});
