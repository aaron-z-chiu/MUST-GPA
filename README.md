# Macau University of Science and Technology GPA Calculator (Unofficial)

[简体中文](README_zh-CN.md) | [繁體中文](README_zh-TW.md)

## Overview

An unofficial GPA calculator for Macau University of Science and Technology (MUST) students. This tool aims to helps students calculate their Grade Point Average (GPA) and Major GPA.

## Features

- **Multi-language Support**: English, Simplified Chinese, and Traditional Chinese
- **Flexible Academic Structure**: Add multiple academic years and semesters
- **Real-time GPA Calculation**: Automatic calculation as you input grades
- **Core Course Tracking**: Separate calculation for core courses
- **Comprehensive Grade System**: Supports all MUST grade types including special grades (P, NP, DX, CT, X, S, W)
- **Course GP Display**: Shows individual course grade points

## Grade System

Since WeMust login is required for accessing related documents, I cannot disclose detailed grading standards here. If you are a MUST student/faculty member, please refer to the [MUST website](https://student-wmweb.must.edu.mo/ebook/handbook/Books/Chapters-CHN/Undergraduate/UG-CH-4.pdf).

## Usage

1. **Add Academic Years**: Click "Add Year" to create new academic periods
2. **Add Semesters**: Within each year, add semesters as needed
3. **Input Course Information**:
   - Course name (optional)
   - Credits (default: 3, modify as needed)
   - Grade (select from dropdown)
   - Mark as major course (default: checked)
4. **View Results**: GPA calculations appear in real-time:
   - Individual course GP
   - Semester GPA and Core course GPA
   - Year GPA and Core course GPA
   - Total GPA and Core course GPA

## Files

- `index.html` - Main HTML file
- `gpa_calculator.css` - Styling
- `gpa_calculator.js` - Core functionality
- `gpa_lang_en.js` - English language pack
- `gpa_lang_zh-CN.js` - Simplified Chinese language pack
- `gpa_lang_zh-TW.js` - Traditional Chinese language pack
- `language-multilingual.svg` - Language selection icon

## Technical Details

- Pure HTML/CSS/JavaScript implementation
- No external dependencies
- Responsive design
- Local storage not used (data not saved)

## Disclaimer

This is an unofficial tool created for educational purposes. 

This website was created in June 2025. The university's grading standards may have changed since then, and the author does not guarantee timely updates to reflect such changes. Please refer to the official MUST website for latest grade assessment rules and policies.

The user shall bear full responsibility for all consequences arising from the misuse of this website (including but not limited to illegal activities). The author shall not be held liable under any circumstances.

## Copyright

Copyright © 2025 Aaron Tse-Cheng Chiu. All rights reserved.