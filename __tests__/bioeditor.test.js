import React from "react";
import { render, waitForElement, fireEvent } from "@testing-library/react";
import BioEditor from "../src/bioeditor";
import axios from "../src/axios";

// 1. When no bio is passed to it, an "Add" button is rendered.
test("renders an 'Add' button when no bio is passed to it", async () => {
    const { container } = render(<BioEditor />);
    const add_button = container.querySelector("button");
    expect(add_button.innerHTML).toBe("Add Bio");
});

//2. When a bio is passed to it, an "Edit" button is rendered.
test("renders an 'Edit' button  when a bio is passed to it", async () => {
    const { container } = render(<BioEditor bio="Bio is present" />);
    const edit_button = container.querySelector("button");
    expect(edit_button.innerHTML).toBe("Edit");
});

//3.Clicking either the "Add" or "Edit" button causes a textarea and
//a "Save" button to be rendered.
test("renders textarea and 'Save' button on clicking  either 'Add' or 'Edit' button", async () => {
    const { container } = render(<BioEditor />);
    const add_button = container.querySelector("button");
    const edit_button = container.querySelector("button");
    expect(add_button.innerHTML || edit_button.innerHTML).toContain(
        "Add" || "Edit"
    );
    fireEvent.click(add_button || edit_button);
    expect(container.innerHTML).toContain("textarea");
    const save_button = await waitForElement(() =>
        container.querySelector("button")
    );
    expect(save_button.innerHTML).toContain("Save");
});

// 4. Clicking the "Save" button causes an ajax request.
// The request should not actually happen during your test.
// To prevent it from actually happening, you should mock axios
test("AJAX request happens on clicking the 'Save' button", async () => {
    const onClick = jest.fn();

    const { container } = render(<BioEditor bio="Bio is present" />);
    const edit_button = await waitForElement(() =>
        container.querySelector("button")
    );
    expect(edit_button.innerHTML).toBe("Edit");
    fireEvent.click(edit_button);
    expect(container.innerHTML).toContain("textarea");
    const save_button = await waitForElement(() =>
        container.querySelector("button")
    );
    const cancel_button = await waitForElement(() =>
        container.querySelector("button")
    );
    expect(save_button.innerHTML || cancel_button.innerHTML).toContain(
        "Save" || "Cancel"
    );
    await waitForElement(() => container.querySelector("button"));
    fireEvent.click(save_button);
    fireEvent.click(cancel_button);
    expect(onClick.mock.calls.length).toBe(1); //coming as 0
});

// 5.When the mock request is successful, the function that was passed as a prop
// to the component gets called.
test("When the mock request is successful, the function that was passed as a prop to the component gets called", async () => {
    const onClick = jest.fn();
    axios.post.mockResolvedValue();
    const { container } = render(<BioEditor onClick={onClick} />);
    const elem = await waitForElement(() => container.querySelector("div"));
    expect(elem.innerHTML).toBe("Add Bio");
    const add_button = await waitForElement(() =>
        container.querySelector("button")
    );
    fireEvent.click(add_button);
});