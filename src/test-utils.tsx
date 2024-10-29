import React, { ReactElement } from "react";
import { render, RenderOptions } from "@testing-library/react";
import UiProvider from "@/providers/UiProvider";

const customRender = (ui: ReactElement, options?: RenderOptions) => {
  return render(<UiProvider>{ui}</UiProvider>, options);
};

// Re-export everything from React Testing Library
export * from "@testing-library/react";
export { customRender as render };