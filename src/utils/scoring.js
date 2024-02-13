// D = Testing (DESD or ADT) Grade Number - Actual Grade Placement
const analysisSkills = ['Markedly Below', 'Moderately Below', 'Mildly Below', 'Borderline', 'Normal', 'Above Normal'];

export function getSkillValue(testName, spellingCorrect, testingGrade, actualGrade) {
    console.log(testName, testingGrade, actualGrade)
    const testingGradeNumber = testName === getGradeNumber(testingGrade)
    const actualGradeNumber = testName === getGradeNumber(actualGrade)
    const D = testingGradeNumber - actualGradeNumber

    if (D + spellingCorrect < 0) return analysisSkills[0];
    if (D + spellingCorrect === 0) return analysisSkills[1];
    if (D + spellingCorrect === 1) return analysisSkills[2];
    if (D + spellingCorrect === 2) return analysisSkills[3];
    if (D + spellingCorrect === 3) return analysisSkills[4];
    if (D + spellingCorrect > 3) return analysisSkills[5];
}


function getGradeNumber(grade) {
    switch (grade) {
        case 'K', 'Kindergarten':
            return 0
        case '1', '1st grade', '1U', '1L':
            return 1;
        case '2', '2nd grade':
            return 2;
        case '3', '3rd grade':
            return 3;
        case '4', '4th grade':
            return 4;
        case '5', '5th grade':
            return 5;
        case '6', '6th grade':
            return 6;
        case 'JRH', '7th grade or 8th grade':
            return 7;
        case 'HIS', '9-12', 'High School':
            return 8;
        case 'LOD', 'UPD', 'College':
            return 9;
        case 'MAS', 'Graduate School':
            return 10;
        case 'DOC', 'Doctorate':
            return 11;
        case 'POD', 'Post-Doctorate':
            return 13;
        default:
            return 'ERROR';
    }
}
