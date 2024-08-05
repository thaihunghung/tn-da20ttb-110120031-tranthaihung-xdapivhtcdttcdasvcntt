function filterDescription(Description, Model) {
    const columnInfo = {};
    let filtered = {};

    for (const columnName in Description) {
        columnInfo[columnName] = Description[columnName].type;
    }

    if(Model === "Program") {
        const { program_id , createdAt, updatedAt, ...rest } = columnInfo;
        filtered = rest; 
    }
    if(Model === "Po") {
        const { po_id , createdAt, updatedAt, ...rest } = columnInfo;
        filtered = rest; 
    }
    if(Model === "Plo") {
        const { plo_id, createdAt, updatedAt, ...rest } = columnInfo;
        filtered = rest; 
    }

    if(Model === "Student") {
        const { student_id, createdAt, updatedAt, isDelete, ...rest } = columnInfo;
        filtered = rest; 
    }
    
    return filtered;
}

function filterDescriptionHaveid(Description) {
    const columnInfo = {};
    for (const columnName in Description) {
        columnInfo[columnName] = Description[columnName].type;
    }

    // Lọc bỏ id, createdAt, updatedAt
    const { createdAt, updatedAt, ...filtered } = columnInfo;
    
    return filtered;
} 

module.exports = { filterDescription, filterDescriptionHaveid};
