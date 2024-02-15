// D = Testing (DESD or ADT) Grade Number - Actual Grade Placement
const analysisSkills = ['Markedly Below', 'Moderately Below', 'Mildly Below', 'Borderline', 'Normal', 'Above Normal'];

export function getSkillValue(testName, spellingCorrect, testingGrade, actualGrade) {
    console.log(testName, testingGrade, actualGrade)
    const testingGradeNumber = testName === getGradeNumber(testName, testingGrade)
    const actualGradeNumber = testName === getGradeNumber(testName, actualGrade)
    const D = testingGradeNumber - actualGradeNumber

    if (D + spellingCorrect < 0) return analysisSkills[0];
    if (D + spellingCorrect === 0) return analysisSkills[1];
    if (D + spellingCorrect === 1) return analysisSkills[2];
    if (D + spellingCorrect === 2) return analysisSkills[3];
    if (D + spellingCorrect === 3) return analysisSkills[4];
    if (D + spellingCorrect > 3) return analysisSkills[5];
};

function isLessThanHalfway() {
    const currentDate = new Date();
    
    // Assuming the halfway point of the school year is December 31st of the current year
    const halfwayDate = new Date(currentDate.getFullYear(), 11, 31); // December is month 11
    
    // Calculate the difference in milliseconds between the current date and the halfway date
    const timeDiff = halfwayDate.getTime() - currentDate.getTime();
    
    // Check if the current date is before the halfway date
    return timeDiff > 0;
};


function getGradeNumber(testName, grade) {
    switch (grade) {
        case 'K':
        case 'Kindergarten':
            return -1;
        case '1st grade':
            if (isLessThanHalfway() && testName === 'DESD') {
                return 0
            }
            else {
                return 1
            }
        case '1L':
            return 0;
        case '1U':
            return 1;
        case '2':
        case '2nd grade':
            return 2;
        case '3':
        case '3rd grade':
            return 3;
        case '4':
        case '4th grade':
            return 4;
        case '5':
        case '5th grade':
            return 5;
        case '6':
        case '6th grade':
            return 6;
        case 'JRH':
        case '7th grade or 8th grade':
            return 7;
        case 'HIS':
        case '9-12':
        case 'High School':
            return 8;
        case 'LOD':
        case 'UPD':
        case 'College':
            return 9;
        case 'MAS':
        case 'Graduate School':
            return 10;
        case 'DOC':
        case 'Doctorate':
            return 11;
        case 'POD':
        case 'Post-Doctorate':
            return 12;
        default:
            return 'ERROR';
    }
};
