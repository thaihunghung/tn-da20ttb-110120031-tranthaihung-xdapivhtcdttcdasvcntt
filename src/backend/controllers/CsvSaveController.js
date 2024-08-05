const csvtojson = require('csvtojson');
const ProgramModel = require('../models/ProgramModel');
const PloModel = require('../models/PloModel');
const PoModel = require('../models/PoModel');

const { filterDescription, filterDescriptionHaveid } = require('../utils/filter');
const { checkColumns } = require('../utils/checkColumns');
const path = require('path');

const uploadDirectory = path.join(__dirname, '../uploads');

const saveDataFromCSV = async (Model, filteredDescription, filePath, res) => {
    try {
        const jsonObj = await csvtojson().fromFile(filePath);
        jsonObj.shift();
        console.log(jsonObj);
        const columnsCheckResult = checkColumns(filteredDescription, jsonObj);
        if ('error' in columnsCheckResult) {
            return res.status(400).json(columnsCheckResult);
        }
        //kiểm tra dữ liệu có undefined không
        let hasUndefinedValue = 1;
        let undefinedColumns = [];
        jsonObj.forEach(obj => {
            Object.keys(obj).forEach(key => {
                // Kiểm tra xem giá trị có thể chuyển đổi thành số không
                Object.entries(filteredDescription).forEach(([columnName, columnInfo]) => {
                    if (columnInfo.type === 'INT(10)') {
                        if (columnName === key) {
                            const num = parseFloat(obj[key]);
                            if (!isNaN(num)) {
                                obj[key] = num;
                            } else {
                                obj[key] = undefined;
                                hasUndefinedValue = 0;
                            }
                        }
                    } 
                    if (columnInfo.type === 'TINYINT(1)' && columnName === key) {
                        const num = parseFloat(obj[key]);
                        if (!isNaN(num)) {
                            obj[key] = num === 1 ? true : (num === 0 ? false : undefined, hasUndefinedValue = 0, undefinedColumns.push(columnName));
                        } else {
                            obj[key] = undefined;
                            hasUndefinedValue = 0;
                            undefinedColumns.push(columnName);
                        }
                    } 
                });
            });
        });
        if (hasUndefinedValue === 0) {
            return res.status(400).json({ error: `Kiểm tra lại file CSV có dữ liệu Undefined: ${undefinedColumns.join(', ')}` });
        } else {
            try {
                const savedData = await Model.bulkCreate(jsonObj);
                res.status(200).json({ message: "Dữ liệu đã được lưu thành công vào cơ sở dữ liệu.", value: savedData });
            } catch (error) {
                console.error('Error when saving data to the database:', error);
                res.status(500).json({ error: 'Kiểm tra khóa ngoại', detail: error.message });
            }
        }
    } catch (err) {
        console.error('Error during CSV to JSON conversion:', err);
        res.status(500).json({ error: "Lỗi khi lưu dữ liệu vào cơ sở dữ liệu." });
    }
};

const updateDataFromCSV = async (Model, filteredDescription, filePath, res, compile) => {
    try {
        const jsonObj = await csvtojson().fromFile(filePath);
        jsonObj.shift();
        console.log(jsonObj);
        const columnsCheckResult = checkColumns(filteredDescription, jsonObj);
        if ('error' in columnsCheckResult) {
            return res.status(400).json(columnsCheckResult);
        }
        //kiểm tra dữ liệu có undefined không
        let hasUndefinedValue = 1;
        let undefinedColumns = [];
        jsonObj.forEach(obj => {
            Object.keys(obj).forEach(key => {
                // Kiểm tra xem giá trị có thể chuyển đổi thành số không
                Object.entries(filteredDescription).forEach(([columnName, columnInfo]) => {
                    if (columnInfo.type === 'INT(10)') {
                        if (columnName === key) {
                            const num = parseFloat(obj[key]);
                            if (!isNaN(num)) {
                                obj[key] = num;
                            } else {
                                obj[key] = undefined;
                                hasUndefinedValue = 0;
                            }
                        }
                    } 
                    if (columnInfo.type === 'TINYINT(1)' && columnName === key) {
                        const num = parseFloat(obj[key]);
                        if (!isNaN(num)) {
                            obj[key] = num === 1 ? true : (num === 0 ? false : undefined, hasUndefinedValue = 0, undefinedColumns.push(columnName));
                        } else {
                            obj[key] = undefined;
                            hasUndefinedValue = 0;
                            undefinedColumns.push(columnName);
                        }
                    } 
                });
            });
        });
        if (hasUndefinedValue === 0) {
            return res.status(400).json({ error: `Kiểm tra lại file CSV có dữ liệu Undefined: ${undefinedColumns.join(', ')}` });
        } else {
            try {
                if (compile ==="Program"){
                    const promises = jsonObj.map(item => {
                        return Model.update(
                        { programName: item.programName, isDelete: item.isDelete },
                        { where: { program_id: item.program_id } }
                        );
                    });

                    await Promise.all(promises);
                    const updatedData = await Model.findAll({ where: { program_id: jsonObj.map(item => item.program_id) } });
                    res.status(200).json({ message: "Dữ liệu đã được cập nhật thành công vào cơ sở dữ liệu.", updatedData });

                } else if (compile ==="Po"){
                    const promises = jsonObj.map(item => {
                        return Model.update(
                        { poName: item.poName, description: item.description, program_id: item.program_id ,isDelete: item.isDelete },
                        { where: { po_id: item.po_id } }
                        );
                    });

                    await Promise.all(promises);
                    const updatedData = await Model.findAll({ where: { po_id: jsonObj.map(item => item.po_id) } });
                    res.status(200).json({ message: "Dữ liệu đã được cập nhật thành công vào cơ sở dữ liệu.", updatedData });
                } else if (compile ==="Plo"){
                    const promises = jsonObj.map(item => {
                        return Model.update(
                        { poName: item.ploName, description: item.description, program_id: item.program_id ,isDelete: item.isDelete },
                        { where: { plo_id: item.plo_id } }
                        );
                    });

                    await Promise.all(promises);
                    const updatedData = await Model.findAll({ where: { plo_id: jsonObj.map(item => item.plo_id) } });
                    res.status(200).json({ message: "Dữ liệu đã được cập nhật thành công vào cơ sở dữ liệu.", updatedData });
                }
            } catch (error) {
                console.error('Error when saving data to the database:', error);
                res.status(500).json({ error: 'Kiểm tra khóa ngoại', detail: error.message });
            }
        }
    } catch (err) {
        console.error('Error during CSV to JSON conversion:', err);
        res.status(500).json({ error: "Lỗi khi lưu dữ liệu vào cơ sở dữ liệu." });
    }
};

const CsvSaveController = {
    saveFormProgram: async (req, res) => {
        try {
            if (!req.files || req.files.length === 0) {
                return res.status(400).json({ error: 'No file uploaded.' });
            }
            const Description = await ProgramModel.describe();
            const filteredProgram = filterDescription(Description, "Program");

            const filename = req.files[0].filename;
            const filePath = path.join(uploadDirectory, filename);

            await saveDataFromCSV(ProgramModel, filteredProgram, filePath, res);
        } catch (err) {
            console.error("Lỗi khi lưu dữ liệu vào cơ sở dữ liệu:", err);
            res.status(500).json({ error: "Lỗi khi lưu dữ liệu vào cơ sở dữ liệu." });
        }
    },
    saveFormPlo: async (req, res) => {
        try {
            if (!req.files || req.files.length === 0) {
                return res.status(400).json({ error: 'No file uploaded.' });
            }
            const Description = await PloModel.describe();
            const filteredPlo = filterDescription(Description, "Plo");
            const filename = req.files[0].filename;
            const filePath = path.join(uploadDirectory, filename);
            await saveDataFromCSV(PloModel, filteredPlo, filePath, res);
        } catch (err) {
            console.error("Lỗi khi lưu dữ liệu vào cơ sở dữ liệu:", err);
            res.status(500).json({ error: "Lỗi khi lưu dữ liệu vào cơ sở dữ liệu." });
        }
    },
    saveFormPo: async (req, res) => {
        try {
            if (!req.files || req.files.length === 0) {
                return res.status(400).json({ error: 'No file uploaded.' });
            }
            const Description = await PoModel.describe();
            const filteredPo = filterDescription(Description, "Po");

            const filename = req.files[0].filename;
            const filePath = path.join(uploadDirectory, filename);
            await saveDataFromCSV(PoModel, filteredPo, filePath, res);
        } catch (err) {
            console.error("Lỗi khi lưu dữ liệu vào cơ sở dữ liệu:", err);
            res.status(500).json({ error: "Lỗi khi lưu dữ liệu vào cơ sở dữ liệu.", detail:err.message});
        }
    }
};

const CsvUpdateController = {
    updateFormProgram: async (req, res) => {
        try {
            if (!req.files || req.files.length === 0) {
                return res.status(400).json({ error: 'No file uploaded.' });
            }
            const Description = await ProgramModel.describe();
            

            const filteredProgram = filterDescriptionHaveid(Description);

            const filename = req.files[0].filename;
            const filePath = path.join(uploadDirectory, filename);
            const jsonObj = await csvtojson().fromFile(filePath);
            
            await updateDataFromCSV(Program, filteredProgram, filePath, res, "Program");
        } catch (err) {
            console.error("Lỗi khi lưu dữ liệu vào cơ sở dữ liệu:", err);
            res.status(500).json({ error: "Lỗi khi lưu dữ liệu vào cơ sở dữ liệu." });
        }
    },
    updateFormPo: async (req, res) => {
        try {
            if (!req.files || req.files.length === 0) {
                return res.status(400).json({ error: 'No file uploaded.' });
            }
            const Description = await PoModel.describe();
            const filteredPo = filterDescriptionHaveid(Description);
            const filename = req.files[0].filename;
            const filePath = path.join(uploadDirectory, filename);
            const jsonObj = await csvtojson().fromFile(filePath);
            
            await updateDataFromCSV(PoModel, filteredPo, filePath, res, "Po");
        } catch (err) {
            console.error("Lỗi khi lưu dữ liệu vào cơ sở dữ liệu:", err);
            res.status(500).json({ error: "Lỗi khi lưu dữ liệu vào cơ sở dữ liệu." });
        }
    },
    updateFormPlo: async (req, res) => {
        try {
            if (!req.files || req.files.length === 0) {
                return res.status(400).json({ error: 'No file uploaded.' });
            }
            const Description = await PloModel.describe();
            

            const filteredPlo = filterDescriptionHaveid(Description);

            const filename = req.files[0].filename;
            const filePath = path.join(uploadDirectory, filename);
            const jsonObj = await csvtojson().fromFile(filePath);
            
            await updateDataFromCSV(PloModel, filteredPlo, filePath, res, "Plo");
        } catch (err) {
            console.error("Lỗi khi lưu dữ liệu vào cơ sở dữ liệu:", err);
            res.status(500).json({ error: "Lỗi khi lưu dữ liệu vào cơ sở dữ liệu." });
        }
    },
};

module.exports = { CsvSaveController, CsvUpdateController};
