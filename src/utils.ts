export function stripParenthesisContent(str: string) {
    return str.replace(/\(.*\)/, '').trim();
}
