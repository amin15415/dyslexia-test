const sounds = {
    'eɪ': ['a_e', 'ai', 'ay', 'ey', 'ei', 'eigh', 'aigh'],
    'æ': ['a'],
    'i': ['ee', 'ea', 'ie', 'ei', 'i', 'y', 'e', 'ey'],
    'ɛ': ['e'],
    'ɑɪ': ['i_e', 'y_e', 'igh', 'ie'],
    'ɪ': ['i', 'y', 'e', 'ih'],
    'oʊ': ['o_e', 'o', 'oa', 'ow', 'oe', 'ough', 'ou', 'oh'],
    'ɑ': ['o', 'a', 'ah'],
    'yu': ['u_e', 'ue', 'ew'],
    'ʌ': ['u', 'uh', 'a'],
    'ʊ': ['oo', 'u', 'ou', 'oul'],
    'u': ['u', 'ui', 'oo', 'ou', 'ue', 'ew', 'eu'],
    'ər': ['r', 'er', 'ir', 'or', 'ur', 'ure'],
    'ð': ['th', 'the'],
    'ɔ': ['o', 'augh', 'ough', 'aw', 'a', 'au'], 
    // # '*ə': ['*'],
    'ə': ['a', 'e', 'i', 'o', 'u', 'ah', 'eh', 'ih', 'uh'],
    'dʒ': ['j'],
    'ʃ': ['sh', 'ch', 'ti', 'ss', 's'],
    'tʃ' : ['ch'],
    'k': ['k', 'c', 'ck'],
    'w': ['w', 'wh', 'u'],
    'x': ['x', 'xs', 'cs', 'ks', 'cks'],
    'y': ['y', 'i'],
    // # '*y': ['#'],
    'z': ['z', 's'],
    'g': ['g'],
    'l': ['l']
};
  
const phoneticDesdWords = {
    'baby': [['b','eɪ','b','i']], 'one': [['w','ʌ','n']], 'boat': [['b','oʊ','t']], 'do': [['d','u']], 'car': [['k','ɑ','r']],
    'was': [['w','ʌ','z']], 'daddy': [['d','æ','d','i']], 'book': [['b','ʌ','k']], 'good': [['g','ʌ','d']], 'doll': [['d','ɑ','l'], ['d','ɑ','l', 'l']],
    'girl': [['g','ər','l']], 'apple': [['æ','p','ə','l'], ['æ','p','l']], 'they': [['ð','eɪ']], 'story': [['s','t','oʊ','r','i']], 'some': [['s','ʌ','m']],
    'above':[['ʌ','b','ʌ','v']], 'what': [['w','ʌ','t']], 'any': [['ɛ','n','i']], 'busy': [['b','ɪ','z','i']], 'night': [['n','ɑɪ','t']],
    'done': [['d','ʌ','n']], 'huge': [['h','yu','dʒ']], 'ocean': [['oʊ','ʃ','ə','n']], 'station': [['s','t','eɪ','ʃ','ə','n']], 'could': [['k','ʊ','d']],
    'because': [['b','ɪ','k','ʌ','z'],['b','ʌ','k','ʌ','z']], 'echo': [['ɛ','k','oʊ']], 'couple': [['k','ʌ','p','*ə','l']], 'eager': [['i','g','ər']], 'together': [['t','ə','g','ɛ','ð','ər']],
    'bought': [['b','ɔ','t']], 'delicious': [['d','ɪ','l','ɪ','ʃ','ə','s']], 'neighbor': [['n','eɪ','b','ər']], 'achieve': [['ə','tʃ','i','v']], 'region': [['r','i','dʒ','ə','n']],
    'malicious': [['m','ə','l','ɪ','ʃ','ə','s']], 'bureau': [['b','y','ʊ','ər','oʊ']], 'similar': [['s','ɪ','m','ə','l','ər']], 'campaign': [['k','æ','m','p','eɪ','n']], 'waltz': [['w','ɔ','l','t','s']],
    'prairie': [['p','r','ɛ','ər','i' ], ['p','r','eɪ','ər','i']], 'gadget': [['g','æ','dʒ','ɪ','t']], 'facsimile': [['f','æ','k','s','ɪ','m','ə','l','i'], ['f','æ','x','ɪ','m','ə','l','i']], 'emphasize': [['ɛ','m','f','ə','s','ɑɪ','z']], 'prescription': [['p','r','ɪ','s','k','r','ɪ','p','ʃ','ə','n']],
    'zealous': [['z','ɛ','l','ə','s']], 'clique': [['k','l','i','k']], 'atrocious': [['ə','t','r','oʊ','ʃ','ə','s']], 'catastrophe': [['k','ə','t','æ','s','t','r','ə','f','i']], 'liquidate': [['l','ɪ','k','w','ɪ','d','eɪ','t']]
};

function correctPhoneticWords(testWord, testAnswer) {
    const correctAnswers = [];

    for (const pronounciation of phoneticDesdWords[testWord]) {
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

    console.log(correctAnswers);
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