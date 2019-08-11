import is_palindrome from "./template";

test('"Hello" is not a palindrome', () => {
    expect(is_palindrome("Hello")).toBe(false);
});

test('"madam" is palindrome', () => {
    expect(is_palindrome("madam")).toBe(true);
});

test('"raceCAR" is palindrome', () => {
    expect(is_palindrome("raceCAR")).toBe(true);
});

test('"10801" is palindrome', () => {
    expect(is_palindrome("10801")).toBe(true);
});

test("\"No 'x' in Nixon\" is palindrome", () => {
    expect(is_palindrome("No 'x' in Nixon")).toBe(true);
});

test("Was it a car or a cat I saw?", () => {
    expect(is_palindrome("Was it a car or a cat I saw?")).toBe(true);
});
