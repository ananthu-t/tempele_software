import axios from 'axios';

const VOWELS: { [key: string]: string } = {
    'a': 'അ', 'aa': 'ആ', 'i': 'ഇ', 'ii': 'ഈ', 'u': 'ഉ', 'uu': 'ഊ',
    'e': 'എ', 'ee': 'ഏ', 'ai': 'ഐ', 'o': 'ഒ', 'oo': 'ഓ', 'au': 'ഔ',
};

const VOWEL_SIGNS: { [key: string]: string } = {
    'a': '',
    'aa': 'ാ', 'i': 'ി', 'ii': 'ീ', 'u': 'ു', 'uu': 'ൂ',
    'e': 'െ', 'ee': 'േ', 'ai': 'ൈ', 'o': 'ൊ', 'oo': 'ോ', 'au': 'ൗ',
};

const CONSONANTS: { [key: string]: string } = {
    // Clusters & Complex
    'nth': 'ന്ത', 'ndh': 'ന്ധ', 'nthh': 'ന്ഥ',
    'nt': 'ന്ത', 'nd': 'ണ്ട', 'nj': 'ഞ്ഞ', 'ng': 'ങ്ങ', 'nk': 'ങ്ക',
    'mp': 'മ്പ', 'mb': 'മ്പ', 'mm': 'മ്മ', 'nn': 'ണ്ണ',
    'tt': 'റ്റ', 'tth': 'ഠ', 'dd': 'ഡ', 'ddh': 'ഢ',
    'thh': 'ത', 'thhh': 'ഥ', 'pp': 'പ്പ', 'kk': 'ക്ക', 'cc': 'ച്ച',

    // Singles
    'k': 'ക', 'kh': 'ഖ', 'g': 'ഗ', 'gh': 'ഘ',
    'ch': 'ച', 'chh': 'ഛ', 'j': 'ജ', 'jh': 'ഝ',
    't': 'ത', 'th': 'ത', 'd': 'ദ', 'dh': 'ധ', 'n': 'ന',
    'p': 'പ', 'ph': 'ഫ', 'b': 'ബ', 'bh': 'ഭ', 'm': 'മ',
    'y': 'യ', 'r': 'ര', 'l': 'ല', 'v': 'വ', 'sh': 'ശ', 'ss': 'ഷ', 's': 'സ', 'h': 'ഹ',
    'L': 'ള', 'zh': 'ഴ', 'R': 'റ',
};

const CHILLU: { [key: string]: string } = {
    'n': 'ൻ', 'l': 'ൽ', 'L': 'ൾ', 'r': 'ർ', 'm': 'ം'
};

const VIRAMA = '്';

/**
 * Custom rule-based transliteration fallback.
 */
export const transliterateToMalayalamFallback = (text: string): string => {
    if (!text) return '';

    let result = '';
    let i = 0;
    const input = text.toLowerCase().trim();

    while (i < input.length) {
        let found = false;

        // Try matching CONSONANTS (up to 4 chars)
        for (let len = 4; len >= 1; len--) {
            const part = input.substr(i, len);
            if (CONSONANTS[part]) {
                const isEndOfWord = (i + len === input.length || input[i + len] === ' ');

                if (isEndOfWord && CHILLU[part]) {
                    result += CHILLU[part];
                } else {
                    result += CONSONANTS[part];
                }

                i += len;
                found = true;

                // Check if next part is a vowel sign
                let vowelMatched = false;
                for (let vLen = 2; vLen >= 1; vLen--) {
                    if (i >= input.length) break;
                    const vPart = input.substr(i, vLen);
                    if (VOWEL_SIGNS[vPart] !== undefined) {
                        // Revert chillu to consonant if a vowel follows
                        if (isEndOfWord && CHILLU[part] && result.endsWith(CHILLU[part])) {
                            result = result.slice(0, -CHILLU[part].length) + CONSONANTS[part];
                        }

                        result += VOWEL_SIGNS[vPart];
                        i += vLen;
                        vowelMatched = true;
                        break;
                    }
                }

                if (!vowelMatched && !isEndOfWord && !result.endsWith(CHILLU[part] || '')) {
                    result += VIRAMA;
                }
                break;
            }
        }

        if (found) continue;

        // Try matching VOWELS (up to 3 chars)
        for (let len = 3; len >= 1; len--) {
            const part = input.substr(i, len);
            if (VOWELS[part]) {
                result += VOWELS[part];
                i += len;
                found = true;
                break;
            }
        }

        if (!found) {
            result += input[i];
            i++;
        }
    }

    return result;
};

/**
 * Google Input Tools Transliteration API call.
 */
export const fetchMalayalamTransliteration = async (text: string): Promise<string> => {
    if (!text) return '';

    try {
        const response = await axios.get('https://inputtools.google.com/request', {
            params: {
                text: text,
                itc: 'ml-t-i0-und',
                num: 1,
                cp: 0,
                cs: 1,
                ie: 'utf-8',
                oe: 'utf-8',
                app: 'demopage'
            }
        });

        if (response.data[0] === 'SUCCESS') {
            const transliterated = response.data[1][0][1][0];
            return transliterated;
        }
    } catch (error) {
        console.warn('Google Transliteration failed, falling back to local engine:', error);
    }

    return transliterateToMalayalamFallback(text);
};

export const transliterateToMalayalam = transliterateToMalayalamFallback;
