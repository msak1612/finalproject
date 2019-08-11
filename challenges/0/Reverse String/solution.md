```javascript
export default function reverse_string(input) {
    if (input === "" || input === null) {
        return "";
    }
    return reverse_string(input.substr(1)) + input.charAt(0);
}
```
