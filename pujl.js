/**
 * pujl.js
 * Modul Konversi Transliterasi JGST ke PUJL (Pelatinan / Pedoman Umum Jawa Latin)
 */

function convertJGSTtoPUJL(jgstStr, rawLatinToken) {
    if (!jgstStr || jgstStr === '-') return '-';

    // 1. Bersihkan teks alternatif dalam kurung jika ada (misalnya dari KBJ: "(kaña)")
    jgstStr = jgstStr.replace(/\s*\([^)]*\)/g, '');

    let words = jgstStr.split(/(\s+)/);

    let pujlWords = words.map(word => {
        if (/^\s+$/.test(word)) return word;

        let str = word.toLowerCase().replace(/\/$/, '');

        // 2. Konversi awal Pengkal (ỿ) menjadi 'y'
        str = str.replace(/ỿ/g, 'y');

        // 3. Menghilangkan Aksara Ha ('h') atau Panglancar ('y') setelah ater-ater 'di-' yang bertemu vokal
        str = str.replace(/^di-?[hy]([aāiīuūěéèeoꜽꜷṛḷ])/i, 'di$1');

        // 4. Degeminasi konsonan ganda hasil morfologi/pasangan (nn -> n, kk -> k, dst.)
        str = str.replace(/([^aāiīuūěéèeoꜽꜷṛḷ\s])\1+/gi, '$1');

        // 5. Deteksi Ha Tipis vs Ha Tebal berdasarkan input Latin asli
        const isLatinStartWithH = /^h/i.test(rawLatinToken || '');
        if (!isLatinStartWithH) {
            str = str.replace(/^h([aāiīuūěéèeoꜽꜷṛḷ])/i, '$1');
        }

        // 6. Pemetaan Karakter JGST ke PUJL
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
            { pattern: /ñc/g, replace: 'nc' },
            { pattern: /ñj/g, replace: 'nj' },
            { pattern: /ñ/g, replace: 'ny' },
            { pattern: /[ṅŋ]/g, replace: 'ng' },
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
            { pattern: /[õö]/g, replace: 'o' },
            { pattern: /ã/g, replace: 'a' },
            { pattern: /‘/g, replace: '' }
        ];

        pujlMap.forEach(item => {
            str = str.replace(item.pattern, item.replace);
        });

        // 7. Degeminasi konsonan majemuk ganda setelah penyederhanaan
        // Melindungi gugus 'ngg' agar tidak terpotong menjadi 'ng'
        str = str.replace(/ngg/g, '___NGG___');
        str = str.replace(/(th|dh|ng|ny)\1+/g, '$1');
        str = str.replace(/([bcdfghjklmnpqrstvwxyz])\1+/g, '$1');
        str = str.replace(/___NGG___/g, 'ngg');

        // 8. Memastikan bentuk nyc/nyj bersih menjadi nc/nj jika masih tersisa
        str = str.replace(/nyc/g, 'nc').replace(/nyj/g, 'nj');

        // 9. Hapus sisa karakter Unicode Aksara Jawa jika ada
        str = str.replace(/[\uA980-\uA9DF]/g, '');

        return str;
    });

    return pujlWords.join('').trim() || '-';
}

if (typeof window !== 'undefined') {
    window.convertJGSTtoPUJL = convertJGSTtoPUJL;
}
