const { Sequelize } = require("sequelize");
const sequelize = require("../config/database");


const ChartController = {
  // tỉ lệ đạt được clo trên subject
  getCloPercentage: async (req, res) => {
    const { teacher_id, permission } = req.body;

    // Xây dựng bộ lọc truy vấn động
    const teacherFilter = teacher_id && permission == 1 ? 'AND t.teacher_id = :teacher_id' : '';
    try {
      const results = await sequelize.query(
        `SELECT
            s.subject_id,
            s.subjectName,
            c.clo_id,
            c.cloName,
            c.description,
            SUM(ai.assessmentScore) AS totalScoreAchieved,
            SUM(ri.maxScore) AS totalMaxScore,
            ROUND((SUM(ai.assessmentScore) / SUM(ri.maxScore)), 4) AS percentage_score
        FROM
            assessmentItems ai
        JOIN
            rubricsItems ri ON ai.rubricsItem_id = ri.rubricsItem_id
        JOIN
            rubrics r ON ri.rubric_id = r.rubric_id
        JOIN
            subjects s ON r.subject_id = s.subject_id
        JOIN
            clos c ON ri.clo_id = c.clo_id
        JOIN
            courses cs ON s.subject_id = cs.subject_id
        JOIN
            teachers t ON cs.teacher_id = t.teacher_id
        WHERE
            ai.isDelete = 0
            AND ri.isDelete = 0
            AND r.isDelete = 0
            AND s.isDelete = 0
            AND c.isDelete = 0
            AND cs.isDelete = 0
            ${teacherFilter}
        GROUP BY
            s.subject_id, s.subjectName, c.clo_id, c.cloName
        ORDER BY
            s.subject_id, c.clo_id;
        `,
        {
          type: Sequelize.QueryTypes.SELECT,
          replacements: { teacher_id }
        }
      );

      const formattedResults = results.reduce((acc, result) => {
        const { subject_id, subjectName, description, clo_id, cloName, percentage_score } = result;

        if (!acc[subject_id]) {
          acc[subject_id] = {
            subject_id,
            subjectName,
            clos: []
          };
        }

        acc[subject_id].clos.push({
          clo_id,
          cloName,
          description,
          percentage_score
        });

        return acc;
      }, {});

      res.json(Object.values(formattedResults));
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },
  getScoreStudentByCourseAndTeacher: async (req, res) => {
    console.log("req.body", req.body)
    const { course_id_list, teacher_id, permission } = req.body;
    console.log("req.body", permission)


    const courseIdFilter = course_id_list && course_id_list.length > 0 ? 'AND c.course_id IN (:course_id_list)' : '';
    const teacherFilter = teacher_id && permission == 1 ? 'AND t.teacher_id = :teacher_id' : '';

    try {
      const results = await sequelize.query(
        `SELECT
            st.student_id,
            st.name AS studentName,
            c.course_id,
            c.courseName,
            t.teacher_id,
            t.name AS teacherName,
            a.FinalScore AS studentScore
        FROM
            students st
        JOIN
            meta_assessments a ON st.student_id = a.student_id
        JOIN
            courses c ON a.course_id = c.course_id
        JOIN
            teachers t ON c.teacher_id = t.teacher_id
        WHERE
            c.isDelete = 0 AND a.isDelete = 0 AND st.isDelete = 0
            ${teacherFilter}
            ${courseIdFilter}
        ORDER BY
            st.student_id, c.course_id;
            `,
        {
          type: Sequelize.QueryTypes.SELECT,
          replacements: { teacher_id, course_id_list }
        }
      );
      res.json(results);
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
  ,
  getPloPercentage: async (req, res) => {
    const { teacher_id, permission, studentCode } = req.body;

    // Xây dựng bộ lọc truy vấn động
    const teacherFilter = teacher_id && permission == 1 ? 'AND t.teacher_id = :teacher_id' : '';

    try {
      const results = await sequelize.query(
        `SELECT
                s.subject_id,
                s.subjectName,
                plo.plo_id,
                plo.ploName,
                plo.description,
                SUM(ai.assessmentScore) AS totalScoreAchieved,
                SUM(ri.maxScore) AS totalMaxScore,
                ROUND((SUM(ai.assessmentScore) / SUM(ri.maxScore)), 4) AS percentage_score
            FROM
                assessmentItems ai
            JOIN rubricsItems ri ON ai.rubricsItem_id = ri.rubricsItem_id
            JOIN rubrics r ON ri.rubric_id = r.rubric_id
            JOIN subjects s ON r.subject_id = s.subject_id
            JOIN plos plo ON ri.plo_id = plo.plo_id
            JOIN courses cs ON s.subject_id = cs.subject_id
            JOIN teachers t ON cs.teacher_id = t.teacher_id
            WHERE
                ai.isDelete = 0
                AND ri.isDelete = 0
                AND r.isDelete = 0
                AND s.isDelete = 0
                AND plo.isDelete = 0
                AND cs.isDelete = 0
                ${teacherFilter}
            GROUP BY
                s.subject_id, s.subjectName, plo.plo_id, plo.ploName
            ORDER BY
                plo.plo_id, s.subject_id ;
            `,
        {
          type: Sequelize.QueryTypes.SELECT,
          replacements: { teacher_id }
        }
      );

      const formattedResults = results.reduce((acc, result) => {
        const { subject_id, subjectName,description, plo_id, ploName, percentage_score } = result;

        if (!acc[subject_id]) {
          acc[subject_id] = {
            subject_id,
            subjectName,
            plos: []
          };
        }

        acc[subject_id].plos.push({
          plo_id,
          ploName,
          description,
          percentage_score
        });

        return acc;
      }, {});

      res.json(Object.values(formattedResults));
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  getPloPercentageContainSubject: async (req, res) => {
    try {
      const results = await sequelize.query(
        `SELECT
            s.student_id,
            s.name AS student_name,
            subj.subject_id,
            subj.subjectName AS subjectName,
            p.plo_id,
            p.ploName AS plo_name,
            SUM(ai.assessmentScore) AS total_assessment_score,
            SUM(ri.maxScore) AS total_max_score,
            (SUM(ai.assessmentScore) / SUM(ri.maxScore)) AS score_ratio
         FROM
            students s
            JOIN course_enrollments ce ON s.student_id = ce.student_id
            JOIN courses c ON ce.course_id = c.course_id



            JOIN meta_assessments ma ON c.course_id = ma.course_id AND s.student_id = ma.student_id
            JOIN assessments a ON ma.meta_assessment_id = a.meta_assessment_id
            JOIN assessmentItems ai ON a.assessment_id = ai.assessment_id



            JOIN rubricsItems ri ON ai.rubricsItem_id = ri.rubricsItem_id
            JOIN plos p ON ri.plo_id = p.plo_id
            JOIN subjects subj ON c.subject_id = subj.subject_id
         GROUP BY
            s.student_id, subj.subject_id, p.plo_id
         ORDER BY
            p.plo_id, s.student_id, subj.subject_id;`,
        {
          type: Sequelize.QueryTypes.SELECT,
        }
      );
      

      // Process the results to format the output
      const formattedResults = results.reduce((acc, row) => {
        const { plo_name, subjectName, student_id, student_name, total_assessment_score, total_max_score, score_ratio } = row;
        if (!acc[plo_name]) {
          acc[plo_name] = {};
        }
        if (!acc[plo_name][subjectName]) {
          acc[plo_name][subjectName] = [];
        }
        acc[plo_name][subjectName].push({
          student_id,
          student_name,
          total_assessment_score,
          total_max_score,
          score_ratio,
        });
        return acc;
      }, {});

      res.json(formattedResults);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  // diểm trung bình của subject
  averageScoresPerSubject: async (req, res) => {
    const { teacher_id, permission } = req.body;

    // Xây dựng bộ lọc truy vấn động
    const teacherFilter = teacher_id && permission == 1 ? 'where t.teacher_id = :teacher_id' : '';
    try {
      const results = await sequelize.query(
        `SELECT
            ROUND(AVG(a.totalScore), 2) AS averageScore,
            s.subject_id AS subject_id,
            s.subjectName AS subjectName
        FROM
            assessments AS a
        JOIN courses AS c ON a.course_id = c.course_id
        JOIN subjects AS s ON c.subject_id = s.subject_id
        JOIN teachers AS t ON c.teacher_id = t.teacher_id
        ${teacherFilter}
        GROUP BY
            s.subject_id, s.subjectName;
        `,
        {
          type: Sequelize.QueryTypes.SELECT,
          replacements: { teacher_id }
        }
      );
      res.json(results);
    } catch (error) {
      console.error('Error fetching average scores per subject:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },
  // lấy điểm của 1 sinh viên
  getStudentPerformanceByCourse: async (req, res) => {
    try {
      const { student_id } = req.params;
      const results = await sequelize.query(
        `SELECT 
            a.assessment_id, 
            a.totalScore, 
            s.student_id AS student_id, 
            s.studentCode AS studentCode, 
            s.name AS studentName, 
            s.date_of_birth AS studentDOB, 
            c.class_id AS class_id, 
            c.className AS className, 
            c.classCode AS classCode, 
            c.classNameShort AS classNameShort, 
            cr.course_id AS course_id, 
            cr.courseName AS courseName, 
            sub.subject_id AS subject_id, 
            sub.subjectName AS subjectName, 
            sem.semester_id AS semester_id, 
            sem.descriptionShort AS semesterDescriptionShort, 
            ay.academic_year_id AS academic_year_id, 
            ay.startDate AS academicYearStartDate, 
            ay.endDate AS academicYearEndDate, 
            ay.description AS academicYearDescription
        FROM 
            assessments AS a
        LEFT JOIN students AS s
            ON a.student_id = s.student_id
        LEFT JOIN classes AS c
            ON s.class_id = c.class_id
        LEFT JOIN courses AS cr
            ON a.course_id = cr.course_id
        LEFT JOIN subjects AS sub
            ON cr.subject_id = sub.subject_id
        LEFT JOIN semester_academic_years AS say
            ON cr.id_semester_academic_year = say.id_semester_academic_year
        LEFT JOIN semesters AS sem
            ON say.semester_id = sem.semester_id
        LEFT JOIN academic_years AS ay
            ON say.academic_year_id = ay.academic_year_id
        WHERE 
            a.student_id = :student_id
            AND a.isDelete = false
        ORDER BY 
            ay.startDate ASC;`,
        {
          type: Sequelize.QueryTypes.SELECT,
          replacements: { student_id }
        }
      );

      res.json(results);
    } catch (error) {
      console.error('Error fetching student performance by course:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  // average scores by course with optional course_id_list filter
  getAverageCourseScores: async (req, res) => {
    try {
      console.log("ok", req.body)
      const {
        course_id_list,
        subject_id_list,
        academic_year_id_list,
        semester_id_list,
        class_id_list,
        student_code,
        teacher_id,
        permission
      } = req.body.processedFilters;

      // Construct dynamic query filters
      const courseIdFilter = course_id_list && course_id_list.length > 0 ? 'AND c.course_id IN (:course_id_list)' : '';
      const subjectIdFilter = subject_id_list && subject_id_list.length > 0 ? 'AND sub.subject_id IN (:subject_id_list)' : '';
      const academicYearIdFilter = academic_year_id_list && academic_year_id_list.length > 0 ? 'AND ay.academic_year_id IN (:academic_year_id_list)' : '';
      const semesterIdFilter = semester_id_list && semester_id_list.length > 0 ? 'AND s.semester_id IN (:semester_id_list)' : '';
      const classIdFilter = class_id_list && class_id_list.length > 0 ? 'AND cl.class_id IN (:class_id_list)' : '';
      const studentCodeFilter = student_code > 0 ? 'AND st.studentCode = :student_code' : '';
      const teacherFilter = teacher_id && permission == 1 ? 'and t.teacher_id = :teacher_id' : '';

      console.log("courseIdFilter 1111", courseIdFilter)
      const query = `
        SELECT
            st.student_id,
            st.studentCode,
            st.name AS studentName,
            c.course_id,
            c.courseName,
            sub.subject_id,
            sub.subjectName,
            ay.academic_year_id,
            ay.description AS academicYear,
            sem.semester_id,
            sem.descriptionShort AS semester,
            cl.class_id,
            cl.className,
            t.teacher_id,
            t.name AS teacherName,
            a.FinalScore AS score
        FROM
            students st
        JOIN
            meta_assessments a ON st.student_id = a.student_id
        JOIN
            courses c ON a.course_id = c.course_id
        JOIN
            subjects sub ON c.subject_id = sub.subject_id
        JOIN
            semester_academic_years say ON c.id_semester_academic_year = say.id_semester_academic_year
        JOIN
            academic_years ay ON say.academic_year_id = ay.academic_year_id
        JOIN
            semesters sem ON say.semester_id = sem.semester_id
        JOIN
            classes cl ON c.class_id = cl.class_id
        JOIN
            teachers t ON c.teacher_id = t.teacher_id
        WHERE
            st.isDelete = 0
            AND a.isDelete = 0
            AND c.isDelete = 0
            AND sub.isDelete = 0
            AND ay.isDelete = 0
            AND sem.isDelete = 0
            AND cl.isDelete = 0
            ${teacherFilter}
            ${studentCodeFilter}
            ${classIdFilter}
            ${subjectIdFilter}
            ${semesterIdFilter}
            ${academicYearIdFilter}
            ${courseIdFilter}
        ORDER BY
            st.student_id, c.course_id, t.teacher_id;
      `;

      const replacements = {
        ...(course_id_list && course_id_list.length > 0 && { course_id_list }),
        ...(subject_id_list && subject_id_list.length > 0 && { subject_id_list }),
        ...(academic_year_id_list && academic_year_id_list.length > 0 && { academic_year_id_list }),
        ...(semester_id_list && semester_id_list.length > 0 && { semester_id_list }),
        ...(class_id_list && class_id_list.length > 0 && { class_id_list }),
        ...(student_code && { student_code }),
        ...(teacher_id && { teacher_id })
      };

      const results = await sequelize.query(query, {
        type: Sequelize.QueryTypes.SELECT,
        replacements,
      });

      res.json(results);
    } catch (error) {
      console.error('Error fetching average course scores:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },
  getAverageCourseScoresByStudent: async (req, res) => {
    try {
      console.log("ok", req.body)
      const {
        course_id_list,
        subject_id_list,
        academic_year_id_list,
        semester_id_list,
        class_id_list,
        student_code,

      } = req.body.processedFilters;

      // Construct dynamic query filters
      const courseIdFilter = course_id_list && course_id_list.length > 0 ? 'AND c.course_id IN (:course_id_list)' : '';
      const subjectIdFilter = subject_id_list && subject_id_list.length > 0 ? 'AND sub.subject_id IN (:subject_id_list)' : '';
      const academicYearIdFilter = academic_year_id_list && academic_year_id_list.length > 0 ? 'AND ay.academic_year_id IN (:academic_year_id_list)' : '';
      const semesterIdFilter = semester_id_list && semester_id_list.length > 0 ? 'AND s.semester_id IN (:semester_id_list)' : '';
      const classIdFilter = class_id_list && class_id_list.length > 0 ? 'AND cl.class_id IN (:class_id_list)' : '';
      const studentCodeFilter = student_code > 0 ?
        `AND (:student_code IS NULL OR c.course_id IN (
        SELECT ce_inner.course_id
        FROM course_enrollments ce_inner
        JOIN students st_inner ON ce_inner.student_id = st_inner.student_id
        WHERE st_inner.studentCode = :student_code
    ))` : '';
      // const teacherFilter = teacher_id && permission == 1 ? 'and t.teacher_id = :teacher_id' : '';

      console.log("courseIdFilter 1111", courseIdFilter)
      const query = `
        SELECT
            st.student_id,
            st.studentCode,
            st.name AS studentName,
            c.course_id,
            c.courseName,
            c.courseCode,
            sub.subject_id,
            sub.subjectName,
            ay.academic_year_id,
            ay.description AS academicYear,
            sem.semester_id,
            sem.descriptionShort AS semester,
            cl.class_id,
            cl.className,
            t.teacher_id,
            t.name AS teacherName,
            a.FinalScore AS score
        FROM
            courses c
        JOIN
            course_enrollments ce ON ce.course_id = c.course_id
        JOIN
            students st ON st.student_id = ce.student_id
        JOIN
            teachers t ON t.teacher_id = c.teacher_id
        JOIN
            meta_assessments a ON a.course_id = c.course_id AND a.student_id = st.student_id
        JOIN
            subjects sub ON c.subject_id = sub.subject_id
        JOIN
            semester_academic_years say ON c.id_semester_academic_year = say.id_semester_academic_year
        JOIN
            academic_years ay ON say.academic_year_id = ay.academic_year_id
        JOIN
            semesters sem ON say.semester_id = sem.semester_id
        JOIN
            classes cl ON c.class_id = cl.class_id
        WHERE
            c.isDelete = 0
            AND a.isDelete = 0
            AND st.isDelete = 0
            AND t.isDelete = 0
            ${studentCodeFilter}
            ${classIdFilter}
            ${subjectIdFilter}
            ${semesterIdFilter}
            ${academicYearIdFilter}
            ${courseIdFilter}
        ORDER BY
            st.student_id, c.course_id;;
      `;

      const replacements = {
        ...(course_id_list && course_id_list.length > 0 && { course_id_list }),
        ...(subject_id_list && subject_id_list.length > 0 && { subject_id_list }),
        ...(academic_year_id_list && academic_year_id_list.length > 0 && { academic_year_id_list }),
        ...(semester_id_list && semester_id_list.length > 0 && { semester_id_list }),
        ...(class_id_list && class_id_list.length > 0 && { class_id_list }),
        ...(student_code && { student_code }),
      };

      const results = await sequelize.query(query, {
        type: Sequelize.QueryTypes.SELECT,
        replacements,
      });

      res.json(results);
    } catch (error) {
      console.error('Error fetching average course scores:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },
  getAverageCourseScoresOfStudents: async (req, res) => {
    try {
      const { course_id_list, teacher_id, permission } = req.body;

      // Xây dựng bộ lọc truy vấn động
      const courseIdFilter = course_id_list && course_id_list.length > 0 ? 'AND c.course_id IN (:course_id_list)' : '';
      const teacherFilter = teacher_id && permission == 1 ? 'and t.teacher_id = :teacher_id' : '';
      const query = `
        SELECT
            c.course_id,
            c.courseName,
            s.student_id,
            s.name AS studentName,
            a.FinalScore AS score,
            t.teacher_id,
            t.name AS teacherName,
            cl.class_id,
            cl.className
        FROM
            courses c
        JOIN
            meta_assessments a ON c.course_id = a.course_id
        JOIN
            students s ON a.student_id = s.student_id
        JOIN
            teachers t ON c.teacher_id = t.teacher_id
        JOIN
            classes cl ON c.class_id = cl.class_id
        WHERE
            c.isDelete = 0
            AND a.isDelete = 0
            AND s.isDelete = 0
            AND t.isDelete = 0
            AND cl.isDelete = 0
            AND a.FinalScore > 0
            ${courseIdFilter}
            ${teacherFilter}
        ORDER BY
            a.FinalScore;

      `;

      const replacements = {
        ...(course_id_list && course_id_list.length > 0 && { course_id_list }),
        teacher_id
      };

      const results = await sequelize.query(query, {
        type: Sequelize.QueryTypes.SELECT,
        replacements,
      });

      res.json(results);
    } catch (error) {
      console.error('Error fetching average course scores:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },
  getStudentStatistics: async (req, res) => {
    try {
      const { studentCode } = req.body;

      if (!studentCode) {
        return res.status(400).json({ message: 'Student code is required' });
      }

      const query = `
        SELECT
            s.student_id,
            s.name AS studentName,
            SUM(sub.numberCredits) AS totalCredits,
            round(AVG(a.FinalScore),2) AS averageScore,
            COUNT(DISTINCT c.course_id) AS courseCount
        FROM
            students s
        JOIN
            course_enrollments ce ON s.student_id = ce.student_id
        JOIN
            courses c ON ce.course_id = c.course_id
        JOIN
            meta_assessments a ON c.course_id = a.course_id AND a.student_id = s.student_id
        JOIN
            subjects sub ON c.subject_id = sub.subject_id
        WHERE
            s.studentCode = :studentCode
            AND s.isDelete = 0
            AND c.isDelete = 0
            AND sub.isDelete = 0
            AND ce.isDelete = 0
            AND a.isDelete = 0
        GROUP BY
            s.student_id, s.name;
      `;

      const replacements = { studentCode };

      const results = await sequelize.query(query, {
        type: Sequelize.QueryTypes.SELECT,
        replacements,
      });

      res.json(results);
    } catch (error) {
      console.error('Error fetching student statistics:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },
  //CLO rate achieved by students by course
  getCloAchievedByCourse: async (req, res) => {
    try {
      const { studentCode, course_id } = req.body;

      if (!studentCode) {
        return res.status(400).json({ message: 'Student code is required' });
      }

      const query = `
        SELECT
            s.student_id,
            s.name AS studentName,
            c.course_id,
            c.courseName,
            clo.clo_id,
            clo.cloName,
            clo.description AS cloDescription,
            SUM(ai.assessmentScore) AS totalScoreAchieved,
            COUNT(DISTINCT a.assessment_id) * ri.maxScore AS totalMaxScore,
            ROUND((SUM(ai.assessmentScore) / (COUNT(DISTINCT a.assessment_id) * ri.maxScore)), 2) * 100 AS percentageAchieved
        FROM
            students s
        JOIN
            meta_assessments ma ON s.student_id = ma.student_id
        JOIN
            courses c ON ma.course_id = c.course_id
        JOIN
            assessments a ON ma.meta_assessment_id = a.meta_assessment_id
        JOIN
            assessmentItems ai ON a.assessment_id = ai.assessment_id
        JOIN
            rubricsItems ri ON ai.rubricsItem_id = ri.rubricsItem_id
        JOIN
            clos clo ON ri.clo_id = clo.clo_id
        WHERE
            s.studentCode = :studentCode
            AND c.course_id = :course_id
            AND s.isDelete = 0
            AND c.isDelete = 0
            AND ma.isDelete = 0
            AND a.isDelete = 0
            AND ai.isDelete = 0
            AND ri.isDelete = 0
            AND clo.isDelete = 0
        GROUP BY
            s.student_id, s.name, c.course_id, c.courseName, clo.clo_id, clo.cloName
        ORDER BY
            clo.clo_id;
      `;

      const replacements = { studentCode, course_id };

      const results = await sequelize.query(query, {
        type: sequelize.QueryTypes.SELECT,
        replacements,
      });

      res.json(results);
    } catch (error) {
      console.error('Error fetching student statistics:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

};

module.exports = ChartController;