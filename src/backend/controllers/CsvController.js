const ProgramModel = require('../models/ProgramModel');
const PoModel = require('../models/PoModel');
const PloModel = require('../models/PloModel');

const json2csv = require('json2csv').parse;
const { filterDescription, filterDescriptionHaveid } = require('../utils/filter');
const fs = require('fs');

const CsvController = {
    getFormProgram: async (req, res) => {
        try {
            const Description = await ProgramModel.describe();

            console.log(Description);
            const filteredProgram = filterDescription(Description, "Program")
            if (!Description) {
                return res.status(404).json({ message: 'Không tìm thấy mô tả Program' });
            }

            const csvData = json2csv(filteredProgram);
            fs.writeFileSync('programs.csv', csvData, 'utf8');
            res.download('programs.csv', 'programs.csv', (err) => {
                if (err) {
                    console.error('Lỗi khi gửi tệp:', err);
                    res.status(500).json({ message: 'Lỗi máy chủ nội bộ' });
                } else {
                    fs.unlinkSync('programs.csv');
                }
            });
        } catch (error) {
            console.error('Error get form Proram:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },
    getFormProgramWithListId: async (req, res) => {
        try {
            const {data} =req.body;
            const programs = await ProgramModel.findAll({
                where: {
                    program_id: data.id 
                }
            });

            const dataValuesArray = programs.map(program => {
                const { createdAt, updatedAt, ...dataValues } = program.dataValues;
                return dataValues;
            });
            const Description = await ProgramModel.describe();
            console.log(Description);

            const filteredProgram = filterDescriptionHaveid(Description)
            const JsonFile = [filteredProgram, ...dataValuesArray]
            const csvData = json2csv(JsonFile);

            fs.writeFileSync('programs.csv', csvData, 'utf8');
            res.download('programs.csv', 'programs.csv', (err) => {
                if (err) {
                    console.error('Lỗi khi gửi tệp:', err);
                    res.status(500).json({ message: 'Lỗi máy chủ nội bộ' });
                } else {
                    fs.unlinkSync('programs.csv');
                }
            });
        } catch (error) {
            console.error('Error get form Proram:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },
    getFormPo: async (req, res) => {
        try {
            const Description = await PoModel.describe();
            console.log(Description);
            const filteredPo = filterDescription(Description, "Po")

            if (!Description) {
                return res.status(404).json({ message: 'Không tìm thấy mô tả PO' });
            }

            const csvData = json2csv(filteredPo);
            fs.writeFileSync('po.csv', csvData, 'utf8');
            res.download('po.csv', 'po.csv', (err) => {
                if (err) {
                    console.error('Lỗi khi gửi tệp:', err);
                    res.status(500).json({ message: 'Lỗi máy chủ nội bộ' });
                } else {
                    fs.unlinkSync('po.csv');
                }
            });
        } catch (error) {
            console.error('Error get form po:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },
    getFormPoWithListId: async (req, res) => {
        try {
            const {data} =req.body;
            const pos = await PoModel.findAll({
                where: {
                    po_id: data.id 
                }
            });
            const dataValuesArray = pos.map(po => {
                const { createdAt, updatedAt, ...dataValues } = po.dataValues;
                return dataValues;
            });
            const Description = await PoModel.describe();
            const filteredPoModel = filterDescriptionHaveid(Description)
            const JsonFile = [filteredPoModel, ...dataValuesArray]
            const csvData = json2csv(JsonFile);
            fs.writeFileSync('pos.csv', csvData, 'utf8');
            res.download('pos.csv', 'pos.csv', (err) => {
                if (err) {
                    console.error('Lỗi khi gửi tệp:', err);
                    res.status(500).json({ message: 'Lỗi máy chủ nội bộ' });
                } else {
                    fs.unlinkSync('pos.csv');
                }
            });
        } catch (error) {
            console.error('Error get form Proram:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },
    getFormPlo: async (req, res) => {
        try {
            const Description = await PloModel.describe();
            const filteredPlo = filterDescription(Description, "Plo")

            if (!Description) {
                return res.status(404).json({ message: 'Không tìm thấy mô tả PLO' });
            }

            const csvData = json2csv(filteredPlo);
            fs.writeFileSync('plo.csv', csvData, 'utf8');
            res.download('plo.csv', 'plo.csv', (err) => {
                if (err) {
                    console.error('Lỗi khi gửi tệp:', err);
                    res.status(500).json({ message: 'Lỗi máy chủ nội bộ' });
                } else {
                    fs.unlinkSync('plo.csv');
                }
            });
        } catch (error) {
            console.error('Error get form plo:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },
    getFormPloWithListId: async (req, res) => {
        try {
            const {data} =req.body;
            const plos = await PloModel.findAll({
                where: {
                    plo_id: data.id 
                }
            });
            const dataValuesArray = plos.map(plo => {
                const { createdAt, updatedAt, ...dataValues } = plo.dataValues;
                return dataValues;
            });
            const Description = await PloModel.describe();
            const filteredPloModel = filterDescriptionHaveid(Description)
            const JsonFile = [filteredPloModel, ...dataValuesArray]
            const csvData = json2csv(JsonFile);
            fs.writeFileSync('plos.csv', csvData, 'utf8');
            res.download('plos.csv', 'plos.csv', (err) => {
                if (err) {
                    console.error('Lỗi khi gửi tệp:', err);
                    res.status(500).json({ message: 'Lỗi máy chủ nội bộ' });
                } else {
                    fs.unlinkSync('plos.csv');
                }
            });
        } catch (error) {
            console.error('Error get form Proram:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },
};

module.exports = CsvController;
