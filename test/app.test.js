import React from "react";
import App from "./app";
import axios from "./axios";
import { render, waitForElement } from "@testing-library/react";

jest.mock("axios");

test("Shows greetee retrieved with HTTP request", async () => {
    axios.get.mockResolvedValue({
        data: {
            greetee: "Kitty"
        }
    });

    const { container } = render(<Hello />);

    expect(container.innerHTML).toContain("Loading...");

    const elem = await waitForElement(() => container.querySelector("div"));

    expect(elem.innerHTML).toBe("Hello, Kitty!");
});
