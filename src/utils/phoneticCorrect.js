const sounds = {
    'eɪ': ['a_e', 'ai', 'ay', 'ey', 'ei', 'eigh', 'aigh', 'a'],
    'æ': ['a', 'ah'],
    'i': ['ee', 'ea', 'ie', 'ei', 'i', 'y', 'e', 'ey'],
    'ɛ': ['e', 'eh'],
    'ɑɪ': ['i_e', 'y_e', 'igh', 'ie', 'i'],
    'ɪ': ['i', 'y', 'e', 'ih'],
    'oʊ': ['o_e', 'o', 'oa', 'ow', 'oe', 'ough', 'ou', 'oh'],
    'ɑ': ['o', 'a', 'ah'],
    'ju': ['u_e', 'ue', 'ew', 'yu', 'u'],
    'ʌ': ['u', 'uh', 'a', 'oo'],
    'ʊ': ['oo', 'u', 'ou', 'oul'],
    'u': ['u', 'ui', 'oo', 'ou', 'ue', 'ew', 'eu'],
    'ər': ['r', 'er', 'ir', 'or', 'ur', 'ure'],
    'ɛr': ['air', 'ere', 'eyr', 'ear', 'are', 'eir', 'ar', 'ayr'],
    'ð': ['th', 'the'],
    'ɔ': ['o', 'augh', 'ough', 'aw', 'a', 'au'], 
    'ə': ['a', 'e', 'i', 'o', 'u', 'ah', 'eh', 'ih', 'uh'],
    'dʒ': ['j'],
    'ʃ': ['sh', 'ch', 'ti', 'ss', 's'],
    'tʃ' : ['ch'],
    'ŋ' : ['ng'],
    'ʒ' : ['si', 's', 'g', 'z', 'j', 'sh'],
    'j': ['y', 'i'],
    'k': ['k', 'c', 'ck'],
    'w': ['w', 'wh', 'u'],
    'x': ['x', 'xs', 'cs', 'ks', 'cks'],
    'z': ['z', 's'],
    's': ['s', 'c'],
    'dd': ['dd', 'd'],
    'pp': ['pp', 'p'],
    'll': ['ll', 'l'],
    'nn': ['nn', 'n'],
    'ss': ['s', 'ss'],
};
  
const phoneticTestWords = {
    'baby': [['b','eɪ','b','i']], 'one': [['w','ʌ','n']], 'boat': [['b','oʊ','t']], 'do': [['d','u']], 'car': [['k','ɑ','r']],
    'was': [['w','ʌ','z']], 'daddy': [['d','æ','dd','i'], ['d','æ','dd','i']], 'book': [['b','ʌ','k']], 'good': [['g','ʌ','d']], 'doll': [['d','ɑ','ll']],
    'girl': [['g','ər','l']], 'apple': [['æ','pp','ə','l'], ['æ','pp','l']], 'they': [['ð','eɪ']], 'story': [['s','t','oʊ','r','i']], 'some': [['s','ʌ','m']],
    'above':[['ʌ','b','ʌ','v']], 'what': [['w','ʌ','t']], 'any': [['ɛ','n','i']], 'busy': [['b','ɪ','z','i'], ['b','ɪ','z', 'z','i']], 'night': [['n','ɑɪ','t']],
    'done': [['d','ʌ','n']], 'huge': [['h','ju','dʒ']], 'ocean': [['oʊ','ʃ','ə','n']], 'station': [['s','t','eɪ','ʃ','ə','n']], 'could': [['k','ʊ','d']],
    'because': [['b','ɪ','k','ʌ','z'],['b','ʌ','k','ʌ','z'], ['b','i','k','ʌ','z']], 'echo': [['ɛ','k','oʊ']], 'couple': [['k','ʌ','p','ə','l'], ['k','ʌ','p','ə','l']], 'eager': [['i','g','ər']], 'together': [['t','ə','g','ɛ','ð','ər']],
    'bought': [['b','ɔ','t']], 'delicious': [['d','ɪ','l','ɪ','ʃ','ə','s']], 'neighbor': [['n','eɪ','b','ər']], 'achieve': [['ə','tʃ','i','v']], 'region': [['r','i','dʒ','ə','n']],
    'malicious': [['m','ə','l','ɪ','ʃ','ə','s']], 'bureau': [['b','j','ʊ','ər','oʊ']], 'similar': [['s','ɪ','m','ə','l','ər']], 'campaign': [['k','æ','m','p','eɪ','n']], 'waltz': [['w','ɔ','l','t','s']],
    'prairie': [['p','r','ɛr','ər','i' ]], 'gadget': [['g','æ','dʒ','ɪ','t']], 'facsimile': [['f','æ','k','s','ɪ','m','ə','l','i'], ['f','æ','x','ɪ','m','ə','l','i']], 'emphasize': [['ɛ','m','f','ə','s','ɑɪ','z']], 'prescription': [['p','r','ɪ','s','k','r','ɪ','p','ʃ','ə','n']],
    'zealous': [['z','ɛ','l','ə','s']], 'clique': [['k','l','i','k'], ['k','l','ɪ','k']], 'atrocious': [['ə','t','r','oʊ','ʃ','ə','s']], 'catastrophe': [['k','ə','t','æ','s','t','r','ə','f','i']], 'liquidate': [['l','ɪ','k','w','ɪ','d','eɪ','t']],
    'father': [['f','ɑ','ð','ər']], 'know': [['n','oʊ']], 'money': [['m','ʌ','n','i']], 'call': [['k','ɔ','ll'], ['k', 'ɑ', 'll']], 'funny': [['f','ʌ','nn','i']], 'there': [['ð','ɛr'], ['ð','eɪ','r']],
    'does': [['d','ʌ','z']], 'listen': [['l','ɪ','s','ə','n']], 'city': [['s','ɪ','t','i']], 'animal': [['æ','n','ɪ','m','ə','l']], 'light': [['l','ɑɪ','t']], 'uncle': [['ʌ','ŋ','k','ə','l']], 'rolled': [['r','oʊ','l','d']],
    'calf': [['k','æ','f']], 'enough': [['ə','n','ʌ','f']], 'meadow': [['m','ɛ','d','oʊ']], 'heavy': [['h','ɛ','v','i']], 'business': [['b','ɪ','z','n','ɪ','ss'], ['b','ɪ','z', 'z','n','ɪ','ss']], 'believe': [['b','ə','l','i','v']], 'laugh': [['l','æ','f']],
    'delight': [['d','ə','l','ɑɪ','t']], 'familiar': [['f','ə','m','ɪ','l','i','ər']], 'rough': [['r','ʌ','f']], 'glisten': [['g','l','ɪ','s','ə','n']], 'league': [['l','i','g']], 'spectacles': [['s','p','ɛ','k','t','ə','k','ə','l','s']], 'decorate': [['d','ɛ','k','ə','r','eɪ','t']],
    'cautious': [['k','ɔ','ʃ','ə','s']], 'ancient': [['eɪ','n','ʃ','ə','n','t']], 'toughen': [['t','ʌ','f','ə','n']], 'height': [['h','ɑɪ','t']], 'doubt': [['d','aʊ','t']], 'position': [['p','ə','z','ɪ','ʃ','ə','n']], 'contagious': [['k','ə','n','t','eɪ','dʒ','ə','s']],
    'conceited': [['k','ə','n','s','i','t','ɪ','d']], 'foreign': [['f','ɔ','r','ɪ','n']], 'knapsack': [['n','æ','p','s','æ','k']], 'decisions': [['d','ɪ','s','ɪ','ʒ','ə','n','s']], 'allegiance': [['ə','l','i','dʒ','ə','n','s']], 'leisure': [['l','ɛ','ʒ','ə','r'], ['l','i','ʒ','ə','r']], 'deny': [['d','ɪ','n','ɑɪ']],
    'dominion': [['d','ə','m','ɪ','n','i','ə','n']], 'intrigue': [['ɪ','n','t','r','i','g']], 'aeronautic': [['ɛ','r','ə','n','ɔ','t','ɪ','k']], 'trudge': [['t','r','ʌ','dʒ'], ['t','r','ʌ', 'd', 'dʒ']], 'tomorrow': [['t','ə','m','ɔ','r','oʊ']], 'graciously': [['g','r','eɪ','ʃ','ə','s','l','i']], 'bridge': [['b','r','ɪ','dʒ']],
    'pollute': [['p','ə','l','u','t']], 'exonerate': [['ɪ','g','z','ɑ','n','ə','r','eɪ','t']], 'risible': [['r','ɪ','z','ɪ','b','l'], ['r','ɪ','z','ɪ','b','ə','l']], 'regime': [['r','ɛ','ʒ','i','m'], ['r','ɪ','ʒ','i','m']], 'endeavor': [['ɪ','n','d','ɛ','v','ər'], ['ɛ','n','d','ɛ','v','ər']], 'islet': [['ɑɪ','l','ə','t']], 'heinous': [['h','eɪ','n','ə','s']],
    'parliament': [['p','ɑ','r','l','ə','m','ə','n','t']], 'gnostic': [['n','ɑ','s','t','ɪ','k']], 'mannequin': [['m','æ','n','ɪ','k','ɪ','n']], 'homologous': [['h','ə','m','ɑ','l','ə','g','ə','s']], 'prerequisite': [['p','r','i','r','ɪ','k','w','ɪ','z','ɪ','t']], 'rhapsody': [['r','æ','p','s','ə','d','i']], 'euphony': [['ju','f','ə','n','i']],
    'litigious': [['l','ɪ','t','ɪ','dʒ','ə','s']], 'tincture': [['t','ɪ','ŋ','k','tʃ','ə','r'], ['t','ɪ','n','k','tʃ','ə','r']], 'oligarchy': [['oʊ','l','ɪ','g','ɑ','r','k','i']], 'inefficacious': [['ɪ','n','ɛ','f','ɪ','k','eɪ','ʃ','ə','s']], 'demagogue': [['d','ɛ','m','ə','g','ɑ','g']], 'parturition': [['p','ɑ','r','t','ʊ','r','ɪ','ʃ','ə','n']], 'mimicry': [['m','ɪ','m','ɪ','k','r','i']],
    'homeopathy': [['h','oʊ','m','i','oʊ','p','æ','θ','i']], 'evanesce': [['ɪ','v','ə','n','ɛ','s']], 'geodesy': [['dʒ','i','oʊ','d','ɛ','s','i']], 'coulomb': [['k','u','l','ɑ','m']], 'zoophyte': [['z','oʊ','ə','f','ɑɪ','t']], 'execrable': [['ɛ','k','s','ɪ','k','r','ə','b','ə','l']], 'triptych': [['t','r','ɪ','p','t','ɪ','k']],
    'sobriquet': [['s','oʊ','b','r','ɪ','k','eɪ']], 'deliquesce': [['d','ɪ','l','ɪ','k', 'w','ɛ','s']], 'colloquy': [['k','ɑ','l','ə','k','w','i']], 'vitiate': [['v','ɪ','ʃ','i','eɪ','t']], 'sycophant': [['s','ɪ','k','ə','f','æ','n','t']], 'intermezzo': [['ɪ','n','t','ə','r','m','ɛ','t','s','oʊ']], 'dehiscence': [['d','ɪ','h','ɪ','s','ə','n','s']],
    'exiguous': [['ɪ','g','z','ɪ','g','j','ə','w', 'ə', 's']], 'malapropos': [['m','æ','l','æ','p','r','ə', 'p','oʊ']], 'ytterbium': [['ɪ','t','ər','b','i','ə','m']], 'monocotyledon': [['m','ɑ','n','ə','k','ɑ','t','ə','l','ɪ','d','ə','n']], 'leitmotif': [['l','eɪ','t','m','oʊ','t','i','f']], 'egregious': [['ɪ','g','r','i','dʒ','ə','s'], ['ɛ', 'g','r','i','dʒ','ə','s']], 'legerdemain': [['l','ɛ','dʒ','ər','d','ə','m','eɪ','n']]
};

function correctPhoneticWords(testWord, testAnswer) {
    const correctAnswers = [];

    for (const pronounciation of phoneticTestWords[testWord]) {
        const possibleAnswers = {};

        for (const [x, sound] of pronounciation.entries()) {
            if (sounds.hasOwnProperty(sound)) {
                possibleAnswers[x] = sounds[sound];
            } else {
                possibleAnswers[x] = [sound];
            }
        }

        const combos = Object.values(possibleAnswers).filter(
            (sound) => Array.isArray(sound)
        );

        const combinations = cartesianProduct(...combos);

        const template = Object.values(possibleAnswers).map((sound, index) =>
            Array.isArray(sound) ? String(index) : sound
        );

        for (const combo of combinations) {
            let answer = '';

            for (const sound of template) {
                if (isNaN(parseInt(sound))) {
                answer += sound;
                } else {
                answer += combo[parseInt(sound)];
                }
            }

            if (answer.includes('_e')) {
                answer = answer.replace('_e', '') + 'e';
                correctAnswers.push(answer.slice(0, -1));
            }
            correctAnswers.push(answer);
        }
    }

    // correctAnswers.forEach((answer) => {
    //   console.log(answer);
    // });
    return correctAnswers.includes(testAnswer);
}

function cartesianProduct(...arrays) {
    return arrays.reduce(
        (acc, arr) => {
        return acc.flatMap((x) => arr.map((y) => x.concat([y])));
        },
        [[]]
    );
}

export default correctPhoneticWords;

// console.log(correctPhoneticWords('there', 'thayr'));
