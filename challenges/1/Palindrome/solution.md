```javascript
export default function is_palindrome(input) {
    let test_str = input.toLowerCase().replace(/[^0-9a-z]/gi, "");
    let reverse_str = test_str
        .split("")
        .reverse()
        .join("");

    return test_str === reverse_str;
}
```
