import React from "react";
import { render, waitForElement, fireEvent } from "@testing-library/react";
import FriendButton from "../src/friendbutton";
import axios from "../src/axios";

//1. renders 'Make Friend Request' button on receiver's profile)
test("renders 'Make Friend Request' button on receiver's profile", async () => {
    const { container } = render(<FriendButton accepted="false" />);
    const button = await waitForElement(() =>
        container.querySelector("button")
    );
    expect(button.innerHTML).toContain("Make");
});

//2. "Make Friendship request" button is clicked by sender at receiver's url
//but receiver has not accepted the friend request yet
test("on clicking 'Make Friend Request' button by sender, 'Cancel Friend Request' button is rendered", async () => {
    const { container } = render(<FriendButton accepted="false" />);
    const button = await waitForElement(() =>
        container.querySelector("button")
    );
    expect(button.innerHTML).toContain("Make");
    fireEvent.click(button);
    expect(button.innerHTML).toContain("Cancel");
});
