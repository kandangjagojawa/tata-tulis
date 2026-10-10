/**
 * pujl.js
 * Modul Konversi Transliterasi JGST ke PUJL (Pelatinan / Pedoman Umum Jawa Latin)
 * 
 * Aturan:
 * - Mengembalikan varian JGST ke huruf Latin sederhana (seperti abjad).
 * - Pepet (ě) ditulis 'e'.
 * - Taling (é, è) tetap ditulis 'é'.
 * - Mencegah double konsonan pada penambahan akhiran/panambang (degeminasi seperti pada ipa.js).
 * - Penanganan pembukaan vokal awal tanpa 'h' tipis jika input asli Latin tidak berawalan 'h'.
 */

function convertJGSTtoPUJL(jgstStr, rawLatinToken) {
    if (!jgstStr || jgstStr === '-') return '-';

    let words = jgstStr.split(/(\s+)/);

    let pujlWords = words.map(word => {
        if (/^\s+$/.test(word)) return word;

        let str = word.toLowerCase().replace(/\/$/, '');

        // 1. Konversi awal Pengkal (ỿ) menjadi 'y'
        str = str.replace(/ỿ/g, 'y');

        // 2. Degeminasi konsonan ganda hasil morfologi/pasangan (nn -> n, kk -> k, dst.)
        str = str.replace(/([^aāiīuūěéèeoꜽꜷṛḷ\s])\1+/gi, '$1');

        // 3. Deteksi Ha Tipis vs Ha Tebal berdasarkan input Latin asli
        const isLatinStartWithH = /^h/i.test(rawLatinToken || '');
        if (!isLatinStartWithH) {
            str = str.replace(/^h([aāiīuūěéèeoꜽꜷṛḷ])/i, '$1');
        }

        // 4. Pemetaan Karakter JGST ke PUJL
        const pujlMap = [
            { pattern: /ā/g, replace: 'a' },
            { pattern: /ī/g, replace: 'i' },
            { pattern: /ū/g, replace: 'u' },
            { pattern: /ě/g, replace: 'e' },
            { pattern: /[éè]/g, replace: 'é' },
            { pattern: /ṝ|ṛ/g, replace: 're' },
            { pattern: /ḹ|ḷ/g, replace: 'le' },
            { pattern: /ꜽ/g, replace: 'ai' },
            { pattern: /ꜷ/g, replace: 'au' },
            { pattern: /ñ/g, replace: 'ny' },
            { pattern: /ṅ/g, replace: 'ng' },
            { pattern: /ṇ/g, replace: 'n' },
            { pattern: /ṭha/g, replace: 'tha' },
            { pattern: /ṭ/g, replace: 'th' },
            { pattern: /ḍha/g, replace: 'dha' },
            { pattern: /ḍ/g, replace: 'dh' },
            { pattern: /[śṣṡ]/g, replace: 's' },
            { pattern: /ḥ/g, replace: 'h' },
            { pattern: /ṃ/g, replace: 'm' },
            { pattern: /ṙ|ŕ|ṟ/g, replace: 'r' },
            { pattern: /ḳ/g, replace: 'k' },
            { pattern: /g̣/g, replace: 'g' },
            { pattern: /c̣/g, replace: 'c' },
            { pattern: /j̣/g, replace: 'j' },
            { pattern: /p̣/g, replace: 'p' },
            { pattern: /ḅ/g, replace: 'b' },
            { pattern: /‘/g, replace: '' }
        ];

        pujlMap.forEach(item => {
            str = str.replace(item.pattern, item.replace);
        });

        // 5. Degeminasi konsonan majemuk ganda setelah penyederhanaan (misal: thth -> th, dhdh -> dh, ngng -> ng, nyny -> ny)
        str = str.replace(/(th|dh|ng|ny)\1+/g, '$1');
        str = str.replace(/([bcdfghjklmnpqrstvwxyz])\1+/g, '$1');

        // 6. Hapus sisa karakter Unicode Aksara Jawa jika ada
        str = str.replace(/[\uA980-\uA9DF]/g, '');

        return str;
    });

    return pujlWords.join('').trim() || '-';
}

if (typeof window !== 'undefined') {
    window.convertJGSTtoPUJL = convertJGSTtoPUJL;
}
