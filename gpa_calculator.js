// GPA grade to point mapping
const gradeMap = {
    '--': null,
    'A+': 4.0, 'A': 4.0, 'A-': 3.7,
    'B+': 3.3, 'B': 3.0, 'B-': 2.7,
    'C+': 2.3, 'C': 2.0, 'C-': 1.7,
    'D+': 1.3, 'D': 1.0,
    'F': 0.0, 'T': 0.0, 'AF': 0.0,
    'P': null, 'NP': null, 'DX': null, 'CT': null, 'X': null, 'S': null, 'W': null
};
const gradeOptions = [
    '--',
    'A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'F', 'T', 'AF',
    'P', 'NP', 'DX', 'CT', 'X', 'S', 'W'
].map(g => `<option value="${g}">${g}</option>`).join('');
let yearId = 0, semesterId = 0;
function addYearBlock() {
    yearId++;
    const yearsContainer = document.getElementById('yearsContainer');
    const yearBlock = document.createElement('div');
    yearBlock.className = 'year-block';
    yearBlock.setAttribute('data-year-id', yearId);
    yearBlock.innerHTML = `
        <div class="year-header">
            <input type="text" name="year" placeholder="如\“2023-2024\”或自定义，可不填" style="width:240px;" oninput="autoCalculateGPA()">
            <button type="button" class="remove-btn" onclick="this.parentElement.parentElement.remove(); autoCalculateGPA();">Delete year</button>
            <span class="year-gpa-info" style="margin-left:12px;color:#16a085;font-weight:bold;"></span>
        </div>
        <div class="semestersContainer"></div>
        <button class="add-btn" type="button" onclick="addSemesterBlock(this)">Add semester</button>
    `;
    yearsContainer.appendChild(yearBlock);
    // Immediately update the text of newly added buttons and placeholders
    if (window.languagePack) {
        yearBlock.querySelector('.add-btn').innerText = window.languagePack.addSemester;
        yearBlock.querySelector('.remove-btn').innerText = window.languagePack.removeYear;
        yearBlock.querySelector('input[name="year"]').placeholder = window.languagePack.yearPlaceholder;
    }
    addSemesterBlock(yearBlock.querySelector('.add-btn'));
}
function addSemesterBlock(btn) {
    semesterId++;
    const yearBlock = btn.closest('.year-block');
    const semestersContainer = yearBlock.querySelector('.semestersContainer');
    const semesterBlock = document.createElement('div');
    semesterBlock.className = 'semester-block';
    semesterBlock.setAttribute('data-semester-id', semesterId);
    semesterBlock.innerHTML = `
        <div class="semester-header">
            <input type="text" name="semester" placeholder="如\“2309\”或自定义，可不填" style="width:180px;" oninput="autoCalculateGPA()">
            <button type="button" class="remove-btn" onclick="this.parentElement.parentElement.remove(); autoCalculateGPA();">Delete semester</button>
            <span class="semester-gpa-info" style="margin-left:12px;color:#2980b9;font-weight:bold;"></span>
        </div>
        <table>
            <thead>
                <tr>
                    <th>Course name</th>
                    <th>Credit <span style='color:#c0392b;font-weight:normal;font-size:12px;'>(Default value is 3 credits, please modify if it does not match the actual course credit)</span></th>
                    <th>Grade level</th>
                    <th>Major course</th>
                    <th>GP</th>
                    <th>Operation</th>
                </tr>
            </thead>
            <tbody class="coursesBody"></tbody>
        </table>
        <button class="add-btn" type="button" onclick="addCourseRow(this)">Add course</button>
    `;
    semestersContainer.appendChild(semesterBlock);
    addCourseRow(semesterBlock.querySelector('.add-btn'));
    if (window.languagePack) {
        semesterBlock.querySelector('.add-btn').innerText = window.languagePack.addCourse;
        semesterBlock.querySelector('.remove-btn').innerText = window.languagePack.removeSemester;
        semesterBlock.querySelector('input[name="semester"]').placeholder = window.languagePack.semesterPlaceholder;
        semesterBlock.querySelectorAll('th').forEach((th, idx) => {
            if (window.languagePack.tableHeaders[idx]) th.innerHTML = window.languagePack.tableHeaders[idx];
        });
    }
}
function addCourseRow(btn) {
    const tbody = btn.closest('.semester-block').querySelector('.coursesBody');
    const row = document.createElement('tr');
    row.innerHTML = `
        <td><input type="text" name="courseName" placeholder="可不填" oninput="autoCalculateGPA()"></td>
        <td><input type="number" name="credit" min="0" step="1" required value="3" oninput="autoCalculateGPA()"></td>
        <td><select name="gradeLevel" onchange="autoCalculateGPA()">${gradeOptions}</select></td>
        <td><input type="checkbox" name="isMajor" onchange="autoCalculateGPA()" checked></td>
        <td class="course-gp">--</td>
        <td><button type="button" class="remove-btn" onclick="this.parentElement.parentElement.remove(); autoCalculateGPA();">Delete</button></td>
    `;
    // Set default grade to '--' (not yet graded)
    row.querySelector('select[name="gradeLevel"]').value = '--';
    tbody.appendChild(row);
    // Immediately update the text of newly added buttons and placeholders
    if (window.languagePack) {
        row.querySelector('.remove-btn').innerText = window.languagePack.removeCourse;
        row.querySelector('input[name="courseName"]').placeholder = window.languagePack.courseNamePlaceholder;
        row.querySelector('input[name="credit"]').placeholder = window.languagePack.creditPlaceholder;
    }
}
// Add one year and one semester by default
addYearBlock();
function autoCalculateGPA() { calculateGPA(); }
function calculateGPA() {
    const yearBlocks = document.querySelectorAll('.year-block');
    document.querySelectorAll('.year-gpa-info').forEach(e=>e.innerHTML='');
    document.querySelectorAll('.semester-gpa-info').forEach(e=>e.innerHTML='');
    let totalCredit = 0, totalPoint = 0;
    let totalMajorCredit = 0, totalMajorPoint = 0;
    // Clear all credit input error styles
    document.querySelectorAll('input[name="credit"]').forEach(input => {
        input.style.border = '';
        if (input.parentNode.querySelector('.credit-error')) {
            input.parentNode.querySelector('.credit-error').remove();
        }
    });
    yearBlocks.forEach((yearBlock, yIdx) => {
        let year = yearBlock.querySelector('input[name="year"]').value.trim();
        if (!year) year = window.languagePack.yearDefault + (yIdx+1);
        let yearCredit = 0, yearPoint = 0;
        let yearMajorCredit = 0, yearMajorPoint = 0;
        const semesterBlocks = yearBlock.querySelectorAll('.semester-block');
        semesterBlocks.forEach((semesterBlock, sIdx) => {
            let semester = semesterBlock.querySelector('input[name="semester"]').value.trim();
            if (!semester) semester = window.languagePack.semesterDefault + (sIdx+1);
            let semCredit = 0, semPoint = 0;
            let semMajorCredit = 0, semMajorPoint = 0;
            const rows = semesterBlock.querySelectorAll('.coursesBody tr');
            rows.forEach(row => {
                const cells = row.querySelectorAll('td');
                const creditInput = cells[1].querySelector('input');
                const credit = parseFloat(creditInput.value);
                // Validate credit
                if (!checkCreditLegal(credit)) {
                    creditInput.style.border = '2px solid #e74c3c';
                    if (!creditInput.parentNode.querySelector('.credit-error')) {
                        const err = document.createElement('div');
                        err.className = 'credit-error';
                        err.style.color = '#e74c3c';
                        err.style.fontSize = '12px';
                        err.style.marginTop = '2px';
                        err.style.lineHeight = '1.2';
                        err.innerText = window.languagePack && window.languagePack.creditError ? window.languagePack.creditError : 'Please enter a valid number';
                        creditInput.parentNode.appendChild(err);
                    }
                }
                const gradeLevel = cells[2].querySelector('select').value;
                const isMajor = cells[3].querySelector('input').checked;
                let courseGP = '--';
                if (gradeLevel && gradeMap[gradeLevel] !== null && gradeMap[gradeLevel] !== undefined) {
                    courseGP = gradeMap[gradeLevel].toFixed(2);
                }
                cells[4].innerText = courseGP;
                // Only count grades with valid GPA points
                if (!isNaN(credit) && gradeLevel && gradeMap[gradeLevel] !== null && gradeMap[gradeLevel] !== undefined) {
                    const point = gradeMap[gradeLevel] * credit;
                    semCredit += credit;
                    semPoint += point;
                    if (isMajor) {
                        semMajorCredit += credit;
                        semMajorPoint += point;
                    }
                }
            });
            const semGPA = semCredit ? (semPoint / semCredit).toFixed(2) : '--';
            const semMajorGPA = semMajorCredit ? (semMajorPoint / semMajorCredit).toFixed(2) : '--';
            semesterBlock.querySelector('.semester-gpa-info').innerHTML = `GPA: ${semGPA} / ${window.languagePack.majorGpaTitle}: ${semMajorGPA}`;
            yearCredit += semCredit;
            yearPoint += semPoint;
            yearMajorCredit += semMajorCredit;
            yearMajorPoint += semMajorPoint;
            totalCredit += semCredit;
            totalPoint += semPoint;
            totalMajorCredit += semMajorCredit;
            totalMajorPoint += semMajorPoint;
        });
        const yearGPA = yearCredit ? (yearPoint / yearCredit).toFixed(2) : '--';
        const yearMajorGPA = yearMajorCredit ? (yearMajorPoint / yearMajorCredit).toFixed(2) : '--';
        yearBlock.querySelector('.year-gpa-info').innerHTML = `GPA: ${yearGPA} / ${window.languagePack.majorGpaTitle}: ${yearMajorGPA}`;
    });
    const totalGPA = totalCredit ? (totalPoint / totalCredit).toFixed(2) : '--';
    const totalMajorGPA = totalMajorCredit ? (totalMajorPoint / totalMajorCredit).toFixed(2) : '--';
    document.getElementById('totalGpaOutput').innerHTML = `<span style="font-weight:bold;">GPA: ${totalGPA} / ${window.languagePack.majorGpaTitle}: ${totalMajorGPA}</span>`;
}
document.addEventListener('input', autoCalculateGPA);
document.addEventListener('change', autoCalculateGPA);

// Language pack loader
function loadLanguagePack(lang, callback) {
    const script = document.createElement('script');
    script.src = `gpa_lang_${lang}.js`;
    script.onload = callback;
    document.head.appendChild(script);
}

function setLanguage(lang) {
    window.languagePack = window.languagePackAll[lang];
    renderAllText();
    autoCalculateGPA();
}

function renderAllText() {
    // Update all static text in the page
    document.querySelector('h1').innerText = window.languagePack.title;
    document.getElementById('computerRecommendation').innerText = window.languagePack.computerRecommendation;
    document.querySelectorAll('button.add-btn').forEach(btn => {
        if (!btn.closest('.year-block') && !btn.closest('.semester-block')) btn.innerText = window.languagePack.addYear;
        if (btn.closest('.year-block')) btn.innerText = window.languagePack.addSemester;
        if (btn.closest('.semester-block')) btn.innerText = window.languagePack.addCourse;
    });
    document.querySelectorAll('th').forEach((th, idx) => {
        if (window.languagePack.tableHeaders[idx]) th.innerHTML = window.languagePack.tableHeaders[idx];
    });
    document.querySelectorAll('.remove-btn').forEach(btn => {
        if (btn.closest('.year-block')) btn.innerText = window.languagePack.removeYear;
        if (btn.closest('.semester-block')) btn.innerText = window.languagePack.removeSemester;
        if (btn.closest('tr')) btn.innerText = window.languagePack.removeCourse;
    });
    // Update all placeholders
    document.querySelectorAll('input[name="courseName"]').forEach(input => {
        input.placeholder = window.languagePack.courseNamePlaceholder;
    });
    document.querySelectorAll('input[name="year"]').forEach(input => {
        input.placeholder = window.languagePack.yearPlaceholder;
    });
    document.querySelectorAll('input[name="semester"]').forEach(input => {
        input.placeholder = window.languagePack.semesterPlaceholder;
    });
    document.querySelectorAll('input[name="credit"]').forEach(input => {
        input.placeholder = window.languagePack.creditPlaceholder;
    });
    // Update bottom text
    document.getElementById('ruleReference').innerHTML = window.languagePack.ruleReference;
    document.getElementById('copyright').innerHTML = window.languagePack.copyright;
    // GPA output
    autoCalculateGPA();
}

document.getElementById('languageSelect').addEventListener('change', function() {
    const lang = this.value;
    loadLanguagePack(lang, function() {
        setLanguage(lang);
    });
});

// English by default
window.languagePackAll = {};
loadLanguagePack('en', function() {
    setLanguage('en');
});

// Validate if credit is legal: must be a number greater than or equal to 0
function checkCreditLegal(credit) {
    if (typeof credit !== 'number' || isNaN(credit)) return false;
    if (credit < 0) return false;
    return true;
} 