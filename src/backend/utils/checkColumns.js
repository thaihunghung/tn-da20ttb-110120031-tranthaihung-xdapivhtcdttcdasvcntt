function checkColumns(filteredProgram, jsonObj) {
    const filteredColumnNames = Object.keys(filteredProgram);
    const firstObjectKeys = Object.keys(jsonObj[0]);

    const missingColumns = filteredColumnNames.filter(columnName => !firstObjectKeys.includes(columnName));

    if (missingColumns.length > 0) {
        return { error: 'Some columns in the CSV file do not match the expected columns.', missingColumns };
    } else {
        return { message: 'All column names from filteredProgram are present in the JSON file.' };
    }
}

module.exports = { checkColumns };