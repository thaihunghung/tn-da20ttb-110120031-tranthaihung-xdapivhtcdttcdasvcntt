const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');
const { Sequelize } = require("sequelize");
const sequelize = require("../config/database");

const MetaAssessmentModel = require('../models/MetaAssessmentModel');
const CourseModel = require('../models/CourseModel');
const StudentModel = require('../models/StudentModel');
const ClassModel = require('../models/ClassModel');
const RubricModel = require('../models/RubricModel');
const SubjectModel = require('../models/SubjectModel');
const CloModel = require('../models/CloModel');
const ChapterModel = require('../models/ChapterModel');
const PloModel = require('../models/PloModel');
const RubricsItemModel = require('../models/RubricItemModel');
const AssessmentModel = require('../models/AssessmentModel');
const TeacherModel = require('../models/TeacherModel');
const AssessmentItemModel = require('../models/AssessmentItemModel');

const MetaAssessmentController = {
  // Lấy tất cả các meta assessments
  index: async (req, res) => {
    try {
      const { isDelete, teacher_id, generalDescription } = req.query;

      if (teacher_id && generalDescription) {
        // Logic for GetByDescriptionByUser
        const assessments = await MetaAssessmentModel.findAll({
          where: {
            teacher_id: parseInt(teacher_id),
            generalDescription: generalDescription,
            isDelete: isDelete === 'true'
          },
          include: [
            {
              model: CourseModel,
              attributes: ['course_id', 'courseCode', 'courseName']
            },
            {
              model: StudentModel,
              attributes: ['student_id', 'studentCode', 'name', 'class_id'],
              include: [
                {
                  model: ClassModel,
                  attributes: ['classNameShort']
                }
              ]
            },
            {
              model: RubricModel,
              attributes: ['rubric_id', 'rubricName']
            }
          ]
        });

        return res.status(200).json(assessments);

      } else if (teacher_id) {
        const teacherId = parseInt(teacher_id);
        const assessments = await MetaAssessmentModel.findAll({
          where: {
            teacher_id: teacherId,
            isDelete: isDelete === 'true'
          },
          attributes: [
            'course_id',
            'generalDescription',
            [Sequelize.fn('COUNT', Sequelize.col('meta_assessment_id')), 'assessmentCount'],
            [Sequelize.fn('COUNT', Sequelize.fn('DISTINCT', Sequelize.col('student_id'))), 'studentCount'],
            [Sequelize.fn('SUM', Sequelize.literal('CASE WHEN FinalScore = 0 THEN 1 ELSE 0 END')), 'zeroScoreCount']
          ],
          group: ['course_id', 'generalDescription'],
          include: [{
            model: CourseModel,
            attributes: ['courseCode', 'courseName']
          }
          ]
        });

        if (assessments.length === 0) {
          return res.status(404).json({ message: 'No meta-assessments found for this user' });
        }

        const result = await Promise.all(assessments.map(async assessment => {
          let status;
          const assessmentCount = parseInt(assessment.dataValues.assessmentCount);
          const zeroScoreCount = parseInt(assessment.dataValues.zeroScoreCount);

          if (assessmentCount === 0) {
            status = 100;
          } else {
            status = ((assessmentCount - zeroScoreCount) / assessmentCount) * 100;
          }
          status = Math.round(status);

          const foundAssessment = await MetaAssessmentModel.findOne({
            where: {
              generalDescription: assessment.generalDescription,
              isDelete: isDelete === 'true'
            },
            attributes: ["meta_assessment_id", "teacher_id", "rubric_id", "course_id", "generalDescription", "date", "place", "isDelete", "createdAt"],
            include: [{
              model: RubricModel,
              // where: {
              //   isDelete: isDelete === 'true'
              // },
              include: [{
                model: SubjectModel,
                // where: {
                //   isDelete: isDelete === 'true'
                // }
              }]
            }, {
              model: CourseModel,
              // where: {
              //   isDelete: isDelete === 'true'
              // }
            }]
          });
          const Assessment = await AssessmentModel.findAll({
            where: {
              meta_assessment_id: foundAssessment.meta_assessment_id,
              isDelete: isDelete === 'true'
            },
            include: [{
              model: TeacherModel,
              where: {
                isDelete: isDelete === 'true'
              },
            }]
          }
          )
          let statusAllot = true;
          if (Assessment.length === 0) {
            statusAllot = false;
          }
          if (foundAssessment && foundAssessment.Rubric) {
            const rubricItems = await RubricsItemModel.findAll({
              where: {
                rubric_id: foundAssessment.Rubric.rubric_id,
                isDelete: isDelete === 'true'
              },
              include: [{
                model: CloModel,
                attributes: ['clo_id', 'cloName', 'description'],
                where: {
                  isDelete: isDelete === 'true'
                }
              }, {
                model: ChapterModel,
                attributes: ['chapter_id', 'chapterName', 'description'],
                where: {
                  isDelete: isDelete === 'true'
                }
              }, {
                model: PloModel,
                attributes: ['plo_id', 'ploName', 'description'],
                where: {
                  isDelete: isDelete === 'true'
                }
              }]
            });
            foundAssessment.Rubric.dataValues.rubricItems = rubricItems;
          }

          return {
            teacher_id: foundAssessment.teacher_id,
            course_id: assessment.course_id,
            generalDescription: assessment.generalDescription,
            course: `${assessment.course.courseCode} - ${assessment.course.courseName}`,
            courseCode: assessment.course.courseCode,
            courseName: assessment.course.courseName,
            assessmentCount: parseInt(assessment.dataValues.assessmentCount),
            studentCount: parseInt(assessment.dataValues.studentCount),
            zeroScoreCount: parseInt(assessment.dataValues.zeroScoreCount),
            status: status,
            Assessment: Assessment || [],
            statusAllot: statusAllot,
            metaAssessment: foundAssessment,
            createdAt: foundAssessment ? foundAssessment.createdAt : null,
            isDelete: foundAssessment ? foundAssessment.isDelete : null
          };
        }));

        return res.status(200).json(result);
      } else if (generalDescription) {
        const metaAssessments = await MetaAssessmentModel.findAll({
          where: {
            generalDescription: generalDescription,
            isDelete: isDelete === 'true'
          }
        });

        if (metaAssessments.length === 0) {
          return res.status(200).json([]);
        }
        const metaAssessmentIds = metaAssessments.map(meta => meta.meta_assessment_id);
        const assessments = await AssessmentModel.findAll({
          where: {
            meta_assessment_id: metaAssessmentIds
          }, include: [
            {
              model: TeacherModel
            }
          ]
        });

        const updatedMetaAssessments = metaAssessments.map(meta => {
          meta.dataValues.assessments = assessments.filter(assessment => assessment.meta_assessment_id === meta.meta_assessment_id);
          return meta;
        });

        return res.status(200).json({
          meta_assessment_ids: metaAssessmentIds,
          assessments: assessments,
          meta_assessment: updatedMetaAssessments
        });
      }
      else {
        // Logic for index
        const assessments = await MetaAssessmentModel.findAll();
        return res.status(200).json(assessments);
      }
    } catch (error) {
      console.error('Error fetching meta-assessments:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  // Lấy meta assessment theo ID
  show: async (req, res) => {
    try {
      const { id } = req.params;
      const metaAssessment = await MetaAssessmentModel.findByPk(id);
      if (metaAssessment) {
        res.json(metaAssessment);
      } else {
        res.status(404).json({ message: 'Meta assessment không tìm thấy' });
      }
    } catch (error) {
      console.error('Lỗi khi lấy meta assessment:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },

  // Tạo meta assessment mới
  create: async (req, res) => {
    const { data } = req.body;
    try {
      const newMetaAssessment = await MetaAssessmentModel.create(data);
      res.status(201).json({ 
        message: 'Tạo MetaAssessment thành công',
        meta_assessment_id: newMetaAssessment.meta_assessment_id,
        data: newMetaAssessment 
    });
    } catch (error) {
      console.error('Lỗi khi tạo meta assessment mới:', error);
      res.status(400).json({ message: 'Yêu cầu không hợp lệ' });
    }
  },
  createlistStudent: async (req, res) => {
    try {





      MetaAssessmentModel




    } catch (error) {
      console.error('Lỗi khi tạo meta assessment mới:', error);
      res.status(400).json({ message: 'Yêu cầu không hợp lệ' });
    }
  },
  // Cập nhật meta assessment
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const [updated] = await MetaAssessmentModel.update(req.body, {
        where: { meta_assessment_id: id }
      });
      if (updated) {
        const updatedMetaAssessment = await MetaAssessmentModel.findByPk(id);
        res.json(updatedMetaAssessment);
      } else {
        res.status(404).json({ message: 'Meta assessment không tìm thấy' });
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật meta assessment:', error);
      res.status(400).json({ message: 'Yêu cầu không hợp lệ' });
    }
  },
  updateDescription: async (req, res) => {
    try {
      const { id } = req.params;
      const { description } = req.body;

      // Cập nhật description trong MetaAssessmentModel
      await MetaAssessmentModel.update(
        { description: description },
        { where: { meta_assessment_id: id } }
      );

      res.status(200).json({ message: 'MetaAssessment updated successfully' });
    } catch (error) {
      console.error('Error updating MetaAssessment:', error);
      res.status(500).json({ message: 'Error updating MetaAssessment', error });
    }
  },
  // Xóa meta assessment
  delete: async (req, res) => {
    try {
      const { id } = req.params;

      // Tìm tất cả assessments liên quan đến meta_assessment_id
      const assessments = await AssessmentModel.findAll({
        where: {
          meta_assessment_id: id
        }
      });
      if (assessments.length > 0) {
        const assessmentIds = assessments.map(assessment => assessment.assessment_id);

        await AssessmentItemModel.destroy({
          where: {
            assessment_id: assessmentIds
          }
        });
        await AssessmentModel.destroy({
          where: {
            meta_assessment_id: id
          }
        });
      }

      const deleted = await MetaAssessmentModel.destroy({
        where: { meta_assessment_id: id }
      });

      if (deleted) {
        res.json({ message: 'Meta assessment đã được xóa' });
      } else {
        res.status(404).json({ message: 'Meta assessment không tìm thấy' });
      }
    } catch (error) {
      console.error('Lỗi khi xóa meta assessment:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },

  deleteMultiple: async (req, res) => {
    const { meta_assessment_id } = req.query;

    try {
      if (!Array.isArray(meta_assessment_id) || meta_assessment_id.length === 0) {
        return res.status(400).json({ message: 'meta_assessment_id array is required and cannot be empty' });
      }

      const MetaAssessmentIds = meta_assessment_id.map(id => parseInt(id));

      console.log("MetaAssessmentIds:", MetaAssessmentIds); // Debugging

      const assessments = await AssessmentModel.findAll({
        where: {
          meta_assessment_id: MetaAssessmentIds
        }
      });

      console.log("Assessments found:", assessments.length); // Debugging

      if (assessments.length > 0) {
        const assessmentIds = assessments.map(assessment => assessment.assessment_id);

        console.log("Assessment IDs:", assessmentIds); // Debugging

        await AssessmentItemModel.destroy({
          where: {
            assessment_id: assessmentIds
          }
        });
        console.log("Deleted AssessmentItems"); // Debugging

        await AssessmentModel.destroy({
          where: {
            meta_assessment_id: MetaAssessmentIds
          }
        });
        console.log("Deleted Assessments"); // Debugging
      }

      const deletedMetaAssessments = await MetaAssessmentModel.destroy({
        where: { meta_assessment_id: MetaAssessmentIds }
      });

      console.log("Deleted MetaAssessments count:", deletedMetaAssessments); // Debugging

      res.status(200).json({ message: 'Xóa nhiều MetaAssessmentModel thành công' });
    } catch (error) {
      console.error('Lỗi khi xóa nhiều MetaAssessmentModel:', error);
      res.status(500).json({ message: 'Lỗi server nội bộ' });
    }
  },


  processSaveTemplateMetaAssessment: async (req, res) => {
    if (!req.files) {
      return res.status(400).send('No file uploaded.');
    }

    const requestData = JSON.parse(req.body.data);
    const uploadDirectory = path.join(__dirname, '../uploads');
    const filename = req.files[0].filename;
    const filePath = path.join(uploadDirectory, filename);

    const workbook = new ExcelJS.Workbook();
    try {
      await workbook.xlsx.readFile(filePath);
    } catch (error) {
      return res.status(500).json({ message: 'Error reading the uploaded file' });
    }

    const worksheet = workbook.getWorksheet('Students Form');
    const jsonData = [];

    let invalidDescriptionFound = false;

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) {
        const description = `${requestData.courseName}_${requestData.description}_${requestData.date}`;
        if (description.includes('/')) {
          invalidDescriptionFound = true;
        }
        jsonData.push({
          teacher_id: requestData.teacher_id,
          course_id: requestData.course_id,
          rubric_id: requestData.rubric_id,
          generalDescription: `${requestData.courseName}_${requestData.description}_${requestData.date}`,
          description: '',
          place: requestData.place,
          date: requestData.date,
          student_id: row.getCell(1).value,
        });
      }
    });

    fs.unlinkSync(filePath);
    if (invalidDescriptionFound) {
      return res.status(400).json({ message: 'Description contains invalid characters (e.g., "/") and cannot be saved' });
    }
    try {
      const existingDescriptions = await MetaAssessmentModel.findAll({
        where: {
          generalDescription: jsonData.map(item => item.description)
        },
        attributes: ['generalDescription']
      });

      if (existingDescriptions.length > 0) {
        return res.status(400).json({ message: 'Some generalDescription already exist in the database', existingDescriptions });
      }
      const createdAssessment = await MetaAssessmentModel.bulkCreate(jsonData);
      res.status(201).json({ message: 'Data saved successfully', data: createdAssessment });
    } catch (error) {
      console.error('Error saving data to the database:', error);
      res.status(500).json({ message: 'Error saving data to the database' });
    }
  },

  getFormUpdateDescriptionExcel: async (req, res) => {
    try {
      const { data } = req.body;
      const { id } = data;
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Tên đề tài');

      // Lấy danh sách student_id từ MetaAssessmentModel dựa trên meta_assessment_id
      const enrollments = await MetaAssessmentModel.findAll({
        attributes: ['meta_assessment_id', 'description'],
        where: {
          meta_assessment_id: id,
          isDelete: false
        },
        include: [{
          model: StudentModel,
          attributes: ['name'],
        }]
      });

      worksheet.columns = [
        { header: 'Tên SV', key: 'name', width: 32 },
        { header: 'Tên đề tài', key: 'description', width: 100 },
        { header: 'ID', key: 'MetaId', width: 15 }
      ];
      console.log("enrollments")
      console.log(enrollments[0])

      enrollments.forEach(enrollment => {
        if (enrollment.Student) {
          worksheet.addRow({
            name: enrollment.Student.name,
            description: enrollment.description,
            MetaId: enrollment.meta_assessment_id
          });
        }
      });
      await worksheet.protect('yourpassword', {
        selectLockedCells: true,
        selectUnlockedCells: true
      });

      worksheet.eachRow((row, rowNumber) => {
        row.eachCell((cell, colNumber) => {
          if (colNumber === 3) {
            cell.protection = { locked: true };
          } else {
            cell.protection = { locked: false };
          }
        });
      });



      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename="StudentsForm.xlsx"');
      await workbook.xlsx.write(res);
      res.end();
    } catch (error) {
      console.error('Error generating Excel file:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  updateDescriptionFromExcel: async (req, res) => {
    if (!req.files || !req.files.length) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    try {
      const uploadDirectory = path.join(__dirname, '../uploads');
      const filename = req.files[0].filename;
      const filePath = path.join(uploadDirectory, filename);

      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.readFile(filePath);
      const worksheet = workbook.getWorksheet('Tên đề tài');

      const Updates = [];

      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber > 1) {
          const Data = {
            description: row.getCell(2).value,
            meta_assessment_id: row.getCell(3).value
          };
          Updates.push(Data);
        }
      });

      fs.unlinkSync(filePath);

      await Promise.all(Updates.map(async (data) => {
        const [affectedRows] = await MetaAssessmentModel.update(
          { description: data.description },
          { where: { meta_assessment_id: data.meta_assessment_id } }
        );

        if (affectedRows === 0) {
          console.warn(`No MetaAssessment found with ID ${data.meta_assessment_id} for update`);
        }
      }));



      res.status(200).json({ message: 'description   updated successfully' });
    } catch (error) {
      console.error('Error updating description from Excel file:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  toggleSoftDeleteByGeneralDescription: async (req, res) => {
    try {
      const { GeneralDescriptions, isDelete } = req.body;
      if (!Array.isArray(GeneralDescriptions) || GeneralDescriptions.length === 0) {
        return res.status(400).json({ message: 'GeneralDescription array is required and cannot be empty' });
      }

      const metaAssessments = await MetaAssessmentModel.findAll({
        where: {
          generalDescription: GeneralDescriptions
        }
      });
      console.log('Found metaAssessments:', metaAssessments);

      if (metaAssessments.length === 0) {
        return res.status(404).json({ message: 'No metaAssessments found for the provided GeneralDescriptions' });
      }

      const updated = await Promise.all(metaAssessments.map(async (meta_assessment) => {
        if (isDelete === null) {
          return { meta_assessment_id: meta_assessment.meta_assessment_id, isDelete: meta_assessment.isDelete };
        } else {
          const updatedIsDeleted = isDelete !== undefined ? isDelete : !meta_assessment.isDelete;
          await meta_assessment.update({ isDelete: updatedIsDeleted });
          return { meta_assessment_id: meta_assessment.meta_assessment_id, isDelete: updatedIsDeleted };
        }
      }));

      res.status(200).json({ message: 'Processed isDelete status', updated });

    } catch (error) {
      console.error('Error toggling assessment delete statuses:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },
  updateByGeneralDescription: async (req, res) => {
    try {
      const { GeneralDescription, updateData } = req.body;

      console.log(updateData);
      let metaAssessments = await MetaAssessmentModel.findAll({ where: { generalDescription: GeneralDescription } });
      if (metaAssessments.length === 0) {
        return res.status(404).json({ message: "No metaAssessments found" });
      }
      if (updateData.generalDescription) {
        const existingAssessment = await MetaAssessmentModel.findOne({ where: { generalDescription: updateData.generalDescription } });

        if (existingAssessment) {
          return res.status(400).json({ message: "An assessment with the new generalDescription already exists" });
        }
      }

      const updatedAssessments = await Promise.all(metaAssessments.map(async (meta_assessment) => {
        if (updateData.rubric_id !== undefined) {
          meta_assessment.rubric_id = updateData.rubric_id;
        }
        if (updateData.course_id !== undefined) {
          meta_assessment.course_id = updateData.course_id;
        }
        if (updateData.generalDescription !== undefined) {
          meta_assessment.generalDescription = updateData.generalDescription;
        }
        if (updateData.place !== undefined) {
          meta_assessment.place = updateData.place;
        }
        if (updateData.date !== undefined) {
          meta_assessment.date = updateData.date;
        }

        await meta_assessment.save();
        return meta_assessment;
      }));

      res.status(200).json(updatedAssessments);
    } catch (error) {
      console.error("Error updating metaAssessments:", error);
      res.status(500).json({ message: "Error updating metaAssessments", error });
    }
  },
  deleteByGeneralDescription: async (req, res) => {
    try {
      const { GeneralDescriptions } = req.body;
      console.log(GeneralDescriptions);
      if (!Array.isArray(GeneralDescriptions) || GeneralDescriptions.length === 0) {
        return res.status(400).json({ message: 'Descriptions array is required and cannot be empty' });
      }

      // Tìm tất cả meta_assessments dựa vào các description
      const metaAssessments = await MetaAssessmentModel.findAll({
        where: {
          generalDescription: GeneralDescriptions
        }
      });

      if (metaAssessments.length === 0) {
        return res.status(404).json({ message: 'No assessments found for the provided GeneralDescriptions' });
      }

      // Lấy ra tất cả meta_assessment_ids
      const metaAssessmentIds = metaAssessments.map(meta => meta.meta_assessment_id);

      // Lấy ra tất cả assessment_ids dựa vào meta_assessment_ids
      const assessments = await AssessmentModel.findAll({
        where: {
          meta_assessment_id: metaAssessmentIds
        }
      });

      const assessmentIds = assessments.map(assessment => assessment.assessment_id);

      // Xóa tất cả các assessment items trong AssessmentItemModel dựa vào assessment_ids
      await AssessmentItemModel.destroy({
        where: {
          assessment_id: assessmentIds
        }
      });

      // Xóa tất cả các assessments trong AssessmentModel dựa vào meta_assessment_ids
      await AssessmentModel.destroy({
        where: {
          meta_assessment_id: metaAssessmentIds
        }
      });

      // Xóa tất cả các meta_assessments trong MetaAssessmentModel
      const deletedCount = await MetaAssessmentModel.destroy({
        where: {
          meta_assessment_id: metaAssessmentIds
        }
      });

      res.status(200).json({ message: 'Successfully deleted assessments, assessment items, and meta assessments', deletedCount });

    } catch (error) {
      console.error('Error deleting assessments:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }


};

module.exports = MetaAssessmentController;
