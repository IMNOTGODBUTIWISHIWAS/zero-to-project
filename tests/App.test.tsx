import React from "react";
import { fireEvent } from "@testing-library/react";
import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { App } from "../src/App";
import { catalog } from "../src/lib/catalog";

describe("App", () => {
  it("renders the learner workspace", () => {
    render(<App />);

    expect(screen.getByLabelText(/search projects/i)).toBeInTheDocument();
    expect(screen.getByText(/Build it, but actually learn it/i)).toBeInTheDocument();
  });

  it("shows either loaded paths or the sync empty state", () => {
    render(<App />);

    if (catalog.articles.length > 0) {
      expect(screen.getByText(/Beginner-ranked catalog/i)).toBeInTheDocument();
      expect(screen.getByText(/Learn First/i)).toBeInTheDocument();
    } else {
      expect(screen.getByText(/No projects loaded yet/i)).toBeInTheDocument();
    }
  });

  it("renders the tutorial-specific build guide", () => {
    render(<App />);

    if (catalog.articles.length === 0) {
      return;
    }

    const tabNav = screen.getByRole("navigation", { name: /learning path sections/i });
    fireEvent.click(within(tabNav).getByRole("button", { name: /build/i }));

    expect(screen.getByText(/Tutorial-specific build guide/i)).toBeInTheDocument();
    expect(screen.getByText(/Setup before coding/i)).toBeInTheDocument();
    expect(screen.getByText(/Final proof tasks/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /open tutorial/i })).toBeInTheDocument();
  });

  it("renders the curation review surface", () => {
    render(<App />);

    if (catalog.articles.length === 0) {
      return;
    }

    fireEvent.click(within(screen.getByLabelText(/catalog mode/i)).getByRole("button", { name: /curate/i }));
    const tabNav = screen.getByRole("navigation", { name: /learning path sections/i });
    fireEvent.click(within(tabNav).getByRole("button", { name: /curation/i }));

    expect(screen.getByText(/Required standard/i)).toBeInTheDocument();
    expect(screen.getByText(/Review signals/i)).toBeInTheDocument();
  });
});
