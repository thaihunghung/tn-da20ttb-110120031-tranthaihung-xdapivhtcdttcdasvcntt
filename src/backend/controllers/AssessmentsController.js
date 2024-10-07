const { Op, Sequelize } = require('sequelize');

const AssessmentModel = require('../models/AssessmentModel');
const CourseModel = require('../models/CourseModel');
const StudentModel = require('../models/StudentModel');
const ClassModel = require('../models/ClassModel');
const RubricModel = require('../models/RubricModel');
const RubricItemModel = require('../models/RubricItemModel');
const AssessmentItemModel = require('../models/AssessmentItemModel');

const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');
const CloModel = require('../models/CloModel');
const ChapterModel = require('../models/ChapterModel');
const PloModel = require('../models/PloModel');
const RubricsItemModel = require('../models/RubricItemModel');
const SubjectModel = require('../models/SubjectModel');
const MetaAssessmentModel = require('../models/MetaAssessmentModel');
const TeacherModel = require('../models/TeacherModel');

const AssessmentsController = {
  // index: async (req, res) => {
  //   try {
  //     AssessmentModel.findAll()
  //       .then(assessments => {
  //         return res.json(assessments);
  //       })
  //       .catch(error => {
  //         // Xử lý lỗi nếu có
  //         console.error('Lỗi lấy dữ liệu:', error);
  //       });

  //   } catch (error) {
  //     console.error('Lỗi lấy dữ liệu:', error);
  //     res.status(500).json({ message: 'Lỗi server' });
  //   }
  // },

  // GetByUser: async (req, res) => {
  //   try {
  //     const teacherId = parseInt(req.params.teacher_id);
  //     console.log(teacherId);
  //     const assessments = await AssessmentModel.findAll({
  //       where: {
  //         teacher_id: teacherId,
  //         isDelete: false
  //       },
  //       attributes: [
  //         'course_id',
  //         'description',
  //         [Sequelize.fn('COUNT', Sequelize.col('assessment_id')), 'assessmentCount'],
  //         [Sequelize.fn('COUNT', Sequelize.fn('DISTINCT', Sequelize.col('student_id'))), 'studentCount'],
  //         [Sequelize.fn('SUM', Sequelize.literal('CASE WHEN totalScore = 0 THEN 1 ELSE 0 END')), 'zeroScoreCount']
  //       ],
  //       group: ['course_id', 'description'],
  //       include: [{
  //         model: CourseModel,
  //         attributes: ['courseCode', 'courseName']
  //       }]

  //     });
  //     const groupedAssessments = assessments.reduce((acc, assessment) => {
  //       const key = `${assessment.description}`;
  //       if (!acc[key]) {
  //         acc[key] = [];
  //       }
  //       acc[key].push(assessment);
  //       return acc;
  //     }, {});

  //     console.log(groupedAssessments);
  //     // attributes: [
  //     //   'course_id',

  //     // ],

  //     //group: ['course_id']

  //     if (assessments.length === 0) {
  //       return res.status(404).json({ message: 'No assessments found for this user' });
  //     }

  //     const result = assessments.map(assessment => {
  //       let status;
  //       if (parseInt(assessment.dataValues.zeroScoreCount) === 0) {
  //         status = 100;
  //       } else if (parseInt(assessment.dataValues.zeroScoreCount) === parseInt(assessment.dataValues.assessmentCount)) {
  //         status = 0;
  //       } else {
  //         status = (parseInt(assessment.dataValues.zeroScoreCount) / parseInt(assessment.dataValues.assessmentCount)) * 100;
  //       }

  //       return {
  //         course_id: assessment.course_id,
  //         description: assessment.description,
  //         course: `${assessment.course.courseCode} - ${assessment.course.courseName}`,
  //         assessmentCount: parseInt(assessment.dataValues.assessmentCount),
  //         studentCount: parseInt(assessment.dataValues.studentCount),
  //         zeroScoreCount: parseInt(assessment.dataValues.zeroScoreCount),
  //         status: status
  //       };
  //     });



  //     console.log(result);
  //     res.status(200).json(result);
  //   } catch (error) {
  //     console.error('Error fetching assessments:', error);
  //     res.status(500).json({ message: 'Server error' });
  //   }
  // },
  // GetByDescriptionByUser: async (req, res) => {
  //   try {
  //     const { description, teacher_id } = req.params;
  //     console.log("description");

  //     console.log(description);

  //     // const normalizedDescription = description.replace(/_/g, ' ');
  //     // console.log("description");

  //     // console.log(normalizedDescription);

  //     const assessments = await AssessmentModel.findAll({
  //       where: {
  //         teacher_id: parseInt(teacher_id),
  //         description: description,
  //         isDelete: false
  //       },
  //       include: [{
  //         model: CourseModel,
  //         attributes: ['course_id','courseCode', 'courseName']
  //       }, {
  //         model: StudentModel,
  //         attributes: ['student_id','studentCode', 'name', 'class_id'],
  //         include: [{
  //           model: ClassModel,
  //           attributes: ['classNameShort']
  //         }]
  //       }
  //       ]
  //     });


  //     console.log(assessments);

  //     res.status(200).json(assessments);
  //   } catch (error) {
  //     console.error('Error fetching assessments:', error);
  //     res.status(500).json({ message: 'Server error' });
  //   }
  // },
  checkTeacherInAssessment: async (req, res) => {
    const { teacher_id, meta_assessment_id } = req.query;
    console.log(teacher_id + ':', meta_assessment_id);
    try {
      const assessment = await AssessmentModel.findOne({
        where: {
          teacher_id: teacher_id,
          meta_assessment_id: meta_assessment_id,
          isDelete: false
        }
      });
      console.log("assessment" + ':', assessment);

      if (assessment) {
        return res.status(200).json({ exists: true });
      } else {
        return res.status(200).json({ exists: false });
      }
    } catch (error) {
      console.error("Error checking teacher in assessment:", error.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },



  getAssessments: async (req, res) => {
    try {
      const { isDelete, teacher_id, generalDescription } = req.query;

      if (teacher_id && generalDescription) {

        const assessments = await AssessmentModel.findAll({
          where: {
            teacher_id: parseInt(teacher_id),
            isDelete: isDelete === 'true'
          },
          include: [{
            model: MetaAssessmentModel,
            where: { isDelete: false },
            include: [
              { model: CourseModel, attributes: ['courseCode', 'courseName'] },
              {
                model: StudentModel,
                attributes: ['studentCode', 'name', 'class_id'],
                include: [{
                  model: ClassModel,
                  attributes: ['classNameShort']
                }]
              },
              {
                model: RubricModel,
                where: {
                  isDelete: false
                },
                include: [{
                  model: SubjectModel
                }]
              }
            ],
          },
          {
            model: TeacherModel,
            where: {
              isDelete: false
            },
          }]
        });
        for (const assessment of assessments) {
          const rubricId = assessment.MetaAssessment.Rubric?.rubric_id;
        
          if (!rubricId) continue; // Skip if rubric_id is not found
        
          // Fetch rubric items for the current rubric
          const rubricItems = await RubricItemModel.findAll({
            where: {
              rubric_id: rubricId,
              isDelete: false
            },
            include: [
              {
                model: CloModel,
                attributes: ['clo_id', 'cloName', 'description']
              },
              {
                model: ChapterModel,
                attributes: ['chapter_id', 'chapterName', 'description']
              },
              {
                model: PloModel,
                attributes: ['plo_id', 'ploName', 'description']
              }
            ]
          });
        
          // Get IDs of rubric items
          const rubricsItemIds = rubricItems.map(item => item.rubricsItem_id);
        
          // Fetch assessment items related to the rubric items
          const assessmentItems = await AssessmentItemModel.findAll({
            where: {
              rubricsItem_id: rubricsItemIds,
              assessment_id: assessment.assessment_id
            }
          });
        
          // Attach assessment items to each rubric item
          rubricItems.forEach(rubricItem => {
            rubricItem.dataValues.AssessmentItems = assessmentItems.filter(
              assessmentItem => assessmentItem.rubricsItem_id === rubricItem.rubricsItem_id
            );
          });
        
          // Merge rubric items into the assessment object
          assessment.dataValues.MetaAssessment.Rubric.dataValues.RubricItems = rubricItems;
        }
        

        const AssessmentIdMetas = assessments.map(assessment => assessment.meta_assessment_id);
        console.log('AssessmentIdMetas')
        console.log(AssessmentIdMetas)

        // Tìm tất cả các MetaAssessments dựa trên generalDescription và isDelete
        const metaAssessments = await MetaAssessmentModel.findAll({
          where: {
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

        const metaAssessmentIds = assessments.map(assessment => assessment.meta_assessment_id);
        const filteredMetaAssessments = metaAssessments.filter(metaAssessment =>
          metaAssessmentIds.includes(metaAssessment.meta_assessment_id)
        );
        const result = filteredMetaAssessments.map(metaAssessment => {
          const associatedAssessment = assessments.find(assessment =>
            assessment.dataValues.meta_assessment_id === metaAssessment.dataValues.meta_assessment_id
          );
          return {
            ...metaAssessment.dataValues,
            assessment: associatedAssessment ? associatedAssessment.dataValues : null
          };
        });
        return res.status(200).json(result);
      } else if (teacher_id) {
        const teacherId = parseInt(teacher_id);
        const assessments = await AssessmentModel.findAll({
          where: {
            teacher_id: teacherId,
            isDelete: isDelete === 'true'
          },
          include: [ 
            {
              model: TeacherModel
            },
            {
              model: MetaAssessmentModel,
              include: [
                {
                  model: TeacherModel
                }
              ]
            }
          ]
        });

        if (assessments.length === 0) {
          return res.status(404).json({ message: 'No assessments found for this user' });
        }
        return res.status(200).json(assessments);
      } else if (generalDescription) {
        const metaAssessment = await MetaAssessmentModel.findOne({
          where: {
            generalDescription: generalDescription,
            isDelete: isDelete === 'true'
          }
        });

        if (metaAssessment) {
          const assessments = await AssessmentModel.findAll({
            where: {
              meta_assessment_id: metaAssessment.meta_assessment_id
            }
          });
          const teacherIds = assessments.map(assessment => assessment.teacher_id);
          res.json({
            assessments,
            teacherIds
          });
        } else {
          res.status(404).json({ message: 'assessment không tìm thấy' });
        }
      } else {
        const assessments = await AssessmentModel.findAll();
        return res.status(200).json(assessments);
      }
    } catch (error) {
      console.error('Error fetching assessments:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  GetitemsByID: async (req, res) => {
    try {
      const { id } = req.params;
      // Step 1: Fetch the assessment with basic associations
      const assessments = await AssessmentModel.findOne({
        where: {
          assessment_id: id,
          isDelete: false
        },
        include: [{
          model: MetaAssessmentModel,
          where: { isDelete: false },
          include: [
            { model: CourseModel, attributes: ['courseCode', 'courseName'] },
            {
              model: StudentModel,
              attributes: ['studentCode', 'name', 'class_id'],
              include: [{
                model: ClassModel,
                attributes: ['classNameShort']
              }]
            },
            {
              model: RubricModel,
              where: {
                isDelete: false
              }
            }
          ],
        },
        {
          model: TeacherModel,
          where: {
            isDelete: false
          },
        }]
      });

      if (!assessments || !assessments.MetaAssessment.Rubric) {
        return res.status(404).json({ message: 'Assessment or Rubric not found' });
      }

      // Step 2: Fetch related rubric items
      const rubricItems = await RubricItemModel.findAll({
        where: {
          rubric_id: assessments.MetaAssessment.Rubric.rubric_id,
          isDelete: false
        },
        include: [
          {
            model: CloModel,
            attributes: ['clo_id', 'cloName', 'description']
          },
          {
            model: ChapterModel,
            attributes: ['chapter_id', 'chapterName', 'description']
          },
          {
            model: PloModel,
            attributes: ['plo_id', 'ploName', 'description']
          }
        ]
      });

      const rubricsItemIds = rubricItems.map(item => item.rubricsItem_id);

      const assessmentItems = await AssessmentItemModel.findAll({
        where: {
          rubricsItem_id: rubricsItemIds,
          assessment_id: id
        }
      });

      rubricItems.forEach(rubricItem => {
        rubricItem.dataValues.AssessmentItems = assessmentItems.filter(
          assessmentItem => assessmentItem.rubricsItem_id === rubricItem.rubricsItem_id
        );
      });
      assessments.dataValues.MetaAssessment.Rubric.dataValues.RubricItems = rubricItems;
      res.status(200).json(assessments);
    } catch (error) {
      console.error('Error fetching assessments:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  create: async (req, res) => {
    try {
      const { data } = req.body;
      console.log(data);
      const Assessment = await AssessmentModel.create(data);
      res.json(Assessment);
    } catch (error) {
      console.error('Lỗi tạo Assessment:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },

  getByID: async (req, res) => {
    try {
      const { id } = req.params;
      const assessment = await AssessmentModel.findOne({
        where: { assessment_id: id },
        include: [{
          model: MetaAssessmentModel,
          where: { isDelete: false },
          include: [
            {
              model: RubricModel,
              where: { isDelete: false },
              include: [
                {
                  model: SubjectModel,
                  where: { isDelete: false },
                },
              ],
            },
            {
              model: CourseModel,
              where: { isDelete: false },
            },
            {
              model: StudentModel,
              where: { isDelete: false },
            },
          ],
        }]
      });

      if (!assessment) {
        return res.status(404).json({ message: 'Assessment not found' });
      }
      res.json(assessment);
    } catch (error) {
      console.error('Error fetching assessment:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { data } = req.body;
      const updatedProgram = await AssessmentModel.update(data, { where: { assessment_id: id } });
      if (updatedProgram[0] === 0) {
        return res.status(404).json({ message: 'assessments not found' });
      }
      res.json(updatedProgram);
    } catch (error) {
      console.error('Lỗi cập nhật assessments:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },


  updateStotalScore: async (req, res) => {
    try {
      const { id } = req.params;
      const { data } = req.body;

      const updatedProgram = await AssessmentModel.update(data, { where: { assessment_id: id } });

      if (updatedProgram[0] === 0) {
        return res.status(404).json({ message: 'Assessment not found' });
      }

      res.json(updatedProgram);
    } catch (error) {
      console.error('Lỗi cập nhật assessments:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },

  delete: async (req, res) => {
    try {
      const { id } = req.params;
      await AssessmentModel.destroy({ where: { assessment_id: id } });
      res.json({ message: 'Xóa assessments thành công' });
    } catch (error) {
      console.error('Lỗi xóa assessments:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },

  deleteMultiple: async (req, res) => {
    const { assessment_id } = req.query;
    try {
      const assessmentIds = assessment_id.map(id => parseInt(id));
      await AssessmentModel.destroy({ where: { assessment_id: assessment_id } });
      res.status(200).json({ message: 'Xóa nhiều assessment thành công' });
    } catch (error) {
      console.error('Lỗi khi xóa nhiều assessment:', error);
      res.status(500).json({ message: 'Lỗi server nội bộ' });
    }
  },

  deleteByTeacherId: async (req, res) => {
    const { teacherId } = req.params;
    try {
      const assessments = await AssessmentModel.findAll({ where: { teacher_id: teacherId } });
      const assessmentIds = assessments.map(assessment => assessment.assessment_id);
  
      if (assessmentIds.length > 0) {
        await AssessmentItemModel.destroy({
          where: {
            assessment_id: assessmentIds
          }
        });
        const result = await AssessmentModel.destroy({
          where: { teacher_id: teacherId }
        });
  
        if (result > 0) {
          res.status(200).json({ message: `Successfully deleted ${result} assessments.` });
        } else {
          res.status(404).json({ message: 'No assessments found for the given teacher_id.' });
        }
      } else {
        res.status(404).json({ message: 'No assessments found for the given teacher_id.' });
      }
    } catch (error) {
      console.error("Error deleting assessments by teacher_id:", error);
      res.status(500).json({ message: 'An error occurred while deleting assessments.' });
    }
  },
  isDeleteTotrue: async (req, res) => {
    try {
      const assessment = await AssessmentModel.findAll({ where: { isDelete: true } });

      if (!assessment) {
        return res.status(404).json({ message: 'Không tìm thấy assessments' });
      }

      res.json(assessment);
    } catch (error) {
      console.error('Lỗi tìm kiếm assessment:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },
  isDeleteTofalse: async (req, res) => {
    try {
      const assessment = await AssessmentModel.findAll({ where: { isDelete: false } });
      if (!assessment) {
        return res.status(404).json({ message: 'Không tìm thấy assessments' });
      }
      res.json(assessment);
    } catch (error) {
      console.error('Lỗi tìm kiếm assessment:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },

  toggleSoftDeleteById: async (req, res) => {
    try {
      const { id } = req.params;
      const assessment = await AssessmentModel.findOne({ where: { assessment_id: id } });
      if (!assessment) {
        return res.status(404).json({ message: 'Assessment không tìm thấy' });
      }
      const updatedIsDeleted = !assessment.isDelete;
      await AssessmentModel.update({ isDelete: updatedIsDeleted }, { where: { assessment_id: id } });

      res.status(200).json({ message: `Đã thay đổi trạng thái xóa mềm thành ${updatedIsDeleted}` });
    } catch (error) {
      console.error('Lỗi khi thay đổi trạng thái xóa mềm:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },


  softDeleteMultiple: async (req, res) => {
    try {
      const { rubric_id } = req.body;
      if (!Array.isArray(rubric_id) || rubric_id.length === 0) {
        return res.status(400).json({ message: 'Không cung cấp id nào' });
      }

      const assessments = await AssessmentModel.findAll({ where: { assessment_id: rubric_id } });
      if (assessments.length !== rubric_id.length) {
        return res.status(404).json({ message: 'Một hoặc nhiều Assessment không tìm thấy' });
      }

      const updated = await Promise.all(assessments.map(async (assessment) => {
        const updatedIsDeleted = !assessment.isDelete;
        await assessment.update({ isDelete: updatedIsDeleted });
        return { assessment_id: assessment.assessment_id, isDelete: updatedIsDeleted };
      }));

      res.json({ message: 'Trạng thái xóa mềm đã được thay đổi', updated });
    } catch (error) {
      console.error('Lỗi khi thay đổi trạng thái xóa mềm:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },


  toggleSoftDeleteByGeneralDescription: async (req, res) => {
    try {
      const { GeneralDescriptions, isDelete } = req.body;
      if (!Array.isArray(GeneralDescriptions) || GeneralDescriptions.length === 0) {
        return res.status(400).json({ message: 'GeneralDescription array is required and cannot be empty' });
      }

      // Tìm tất cả assessments dựa vào các description
      const metaAssessments = await MetaAssessmentModel.findAll({
        where: {
          generalDescription: GeneralDescriptions
        }
      });
      console.log('Found metaAssessments:', metaAssessments);

      if (metaAssessments.length === 0) {
        return res.status(404).json({ message: 'No metaAssessments found for the provided GeneralDescriptions' });
      }

      // Toggling trạng thái isDelete cho tất cả metaAssessments tìm thấy
      const updated = await Promise.all(metaAssessments.map(async (meta_assessment) => {
        if (isDelete === null) {
          return { meta_assessment_id: meta_assessment.meta_assessment_id, isDelete: meta_assessment.isDelete }; // Không thay đổi isDelete nếu isDelete là null
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
  }

  ,
  updateByDescription: async (req, res) => {
    try {
      const { description, updateData } = req.body;
      let assessments = await AssessmentModel.findAll({ where: { description: description } });
      if (assessments.length === 0) {
        return res.status(404).json({ message: "No assessments found" });
      }
      if (updateData.description) {
        const existingAssessment = await AssessmentModel.findOne({ where: { description: updateData.description } });

        if (existingAssessment) {
          return res.status(400).json({ message: "An assessment with the new description already exists" });
        }
      }

      const updatedAssessments = await Promise.all(assessments.map(async (assessment) => {
        if (updateData.rubric_id !== undefined) {
          assessment.rubric_id = updateData.rubric_id;
        }
        if (updateData.course_id !== undefined) {
          assessment.course_id = updateData.course_id;
        }
        if (updateData.description !== undefined) {
          assessment.description = updateData.description;
        }
        if (updateData.date !== undefined) {
          assessment.date = updateData.date;
        }
        if (updateData.place !== undefined) {
          assessment.place = updateData.place;
        }
        await assessment.save();
        return assessment;
      }));

      res.status(200).json(updatedAssessments);
    } catch (error) {
      console.error("Error updating assessments:", error);
      res.status(500).json({ message: "Error updating assessments", error });
    }
  },
  deleteByDescription: async (req, res) => {
    try {
      const { descriptions } = req.body; // Nhận mảng descriptions từ req.body
      console.log(descriptions);
      if (!Array.isArray(descriptions) || descriptions.length === 0) {
        return res.status(400).json({ message: 'Descriptions array is required and cannot be empty' });
      }

      // Xóa tất cả assessments dựa vào các description
      const deletedCount = await AssessmentModel.destroy({
        where: {
          description: descriptions
        }
      });

      if (deletedCount === 0) {
        return res.status(404).json({ message: 'No assessments found for the provided descriptions' });
      }

      res.status(200).json({ message: 'Successfully deleted assessments', deletedCount });

    } catch (error) {
      console.error('Error deleting assessments:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },
};

module.exports = AssessmentsController;
