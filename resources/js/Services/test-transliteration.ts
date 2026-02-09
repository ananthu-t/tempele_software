import { transliterateToMalayalam } from './MalayalamService';

const testCases = [
    { input: 'ananthu', expected: 'അനന്തു' },
    { input: 'hari', expected: 'ഹരി' },
    { input: 'krishna', expected: 'കൃഷ്ണ' }, // Note: Krishna might still be tricky with simple rules
    { input: 'mohan', expected: 'മോഹൻ' },
    { input: 'amala', expected: 'അമല' },
    { input: 'shaji', expected: 'ഷാജി' },
    { input: 'vinod', expected: 'വിനോദ്' },
];

console.log('Testing Malayalam Transliteration:');
console.log('----------------------------------');

let passed = 0;
testCases.forEach(({ input, expected }) => {
    const result = transliterateToMalayalam(input);
    const status = result === expected ? '✅ PASS' : `❌ FAIL (Got: ${result}, Expected: ${expected})`;
    console.log(`${input.padEnd(10)} -> ${result.padEnd(10)} ${status}`);
    if (result === expected) passed++;
});

console.log('----------------------------------');
console.log(`Summary: ${passed}/${testCases.length} tests passed.`);
