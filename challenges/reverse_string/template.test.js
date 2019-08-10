import reverse_string from "./template";

test('reverse "Hello!" to "!olleH"', () => {
    expect(reverse_string("Hello!")).toBe("!olleH");
});

test('reverse "" does not break', () => {
    expect(reverse_string("")).toBe("");
});

test('reverse "null" does not break', () => {
    expect(reverse_string(null)).toBe("");
});
