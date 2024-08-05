const express = require('express');
const router = express.Router();
const puppeteer = require('puppeteer');
const path = require('path');
const SubjectModel = require('../models/SubjectModel');
const RubricModel = require('../models/RubricModel');
const RubricsItemModel = require('../models/RubricItemModel');
const CloModel = require('../models/CloModel');
const ChapterModel = require('../models/ChapterModel');
const PloModel = require('../models/PloModel');
/**
 * @openapi
 * tags:
 *   - name: PDF
 *     description: Operations related to PDF generation
 */
/**
 * @openapi
 * /api/admin/pdf:
 *   get:
 *     summary: Generate and download a PDF file based on provided parameters
 *     description: Generates a PDF file from HTML content based on the provided rubric ID and orientation parameters. The PDF file is directly downloaded upon successful generation.
 *     tags: [PDF]
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the rubric to generate the PDF for.
 *       - in: query
 *         name: landscape
 *         schema:
 *           type: boolean
 *           default: false
 *         required: false
 *         description: Whether the PDF should be in landscape orientation. Defaults to `false`.
 *     responses:
 *       '200':
 *         description: Successful response with the PDF file
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *         headers:
 *           Content-Disposition:
 *             schema:
 *               type: string
 *             description: The disposition header to trigger file download
 *       '400':
 *         description: Bad request if parameters are invalid
 *       '500':
 *         description: Server error if something goes wrong during PDF generation
 *     security:
 *       - api_key: []
 * components:
 *   securitySchemes:
 *     api_key:
 *       type: apiKey
 *       in: header
 *       name: Authorization
 */

router.get('/pdf', async (req, res) => {
  const { id, landscape } = req.query;
  console.log(id)
  const isLandscape = landscape === 'true';
  const isDelete = false
  try {
    const rubric = await RubricModel.findOne({
      where: { rubric_id: id },
      include: [{
        model: SubjectModel,
        attributes: ['subject_id', 'subjectCode', 'subjectName']
      }]
    });

    if (!rubric) {
      return res.status(404).json({ message: 'Rubric not found' });
    }

    const rubricItems = await RubricsItemModel.findAll({
      where: {
        rubric_id: id,
        isDelete: isDelete === 'true'
      },
      include: [{
        model: CloModel,
        attributes: ['clo_id', 'cloName', 'description']
      }, {
        model: ChapterModel,
        attributes: ['chapter_id', 'chapterName', 'description']
      }, {
        model: PloModel,
        attributes: ['plo_id', 'ploName', 'description']
      }]
    });

    rubric.dataValues.rubricItems = rubricItems;

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Downloaded Div Content</title>
                <script src="https://cdn.tailwindcss.com"></script>
                <style>
                @media print {
                    table { page-break-inside:auto }
                    .test { page-break-inside:avoid; page-break-after:auto }
                    thead { display:table-header-group }
                    tfoot { display:table-footer-group }
                    .hung { background-color: black !important; }
                    thead { display: table-header-group; }
                    tfoot { display: table-footer-group; }
                }
                </style>
            </head>
      <body>
        <div class="w-full pl-[2cm] pr-[1cm] font-times">
          <div class="w-full flex justify-center items-center">
            <div class="w-[40%] flex flex-col justify-center items-center">
              <div>TRƯỜNG ĐẠI HỌC TRÀ VINH</div>
              <div class="font-bold">KHOA KỸ THUẬT CÔNG NGHỆ</div>
              <div class="w-[40%] border-1 border-black"></div>
            </div>
            <div class="flex-1 flex flex-col justify-center items-center">
              <div class="font-bold">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
              <div class="font-bold">Độc lập - Tự do - Hạnh Phúc</div>
              <div class="w-[30%] border-1 border-black"></div>
            </div>
          </div>
          <div class="text-xl font-bold w-full text-center mt-5 flex flex-col">
            <span>PHIẾU CHẤM ĐÁNH GIÁ BÁO CÁO</span>
            <span>HỌC PHẦN ${rubric.subject.subjectName.toUpperCase()}</span>
          </div>
          <div class="text-center text-base">(Mã HP: ${rubric.subject.subjectCode})</div>
          <div class="w-full text-left text-base">Nhóm<span class="text-lg">: .........</span> Chủ đề: ...........................................................................................................................................................................................</div>
          <div class="w-full text-left text-base">+ Họ và tên SV1<span class="text-lg">: ....................................................................................</span> MSSV: ....................................................................................</div>
          <div class="w-full text-left text-base">+ Họ và tên SV2<span class="text-lg">: ....................................................................................</span> MSSV: ....................................................................................</div>
          <div class="w-full text-left text-base">+ Họ và tên SV3<span class="text-lg">: ....................................................................................</span> MSSV: ....................................................................................</div>
        </div>
        <table class='border-collapse border-[1px] border-[#020401] w-full h-full text-base mt-5 font-times'>
          <thead>
            <tr class="border-[1px] border-b-0 w-full border-[#020401] h-[20px]">
              <th class="border-[1px] border-[#020401] w-[20%]">CLO</th>
              <th class="border-[1px] border-[#020401] w-[50%]">Nội dung báo cáo</th>
              <th class="border-[1px] border-[#020401] w-[50px] text-wrap p-0">
                <div class="flex flex-col items-center">
                  <span>Điểm</span>
                </div>
              </th>
              <th class="border-[1px] border-[#020401] w-[20px]">SV1</th>
              <th class="border-[1px] border-[#020401] w-[20px]">SV2</th>
              <th class="border-[1px] border-r-[2px] border-[#020401] w-[20px]">SV3</th>
            </tr>
          </thead>
          <tbody>
            ${rubricItems.map(item => `
              <tr key="${item.rubricsItem_id}" class="border-[1px] border-b-0 border-[#020401] p-5">
                <td class="border-[1px] border-[#020401] px-2 text-justify">${item.CLO.cloName}: ${item.CLO.description}</td>
                <td class="border-[1px] border-[#020401] text-justify p-2">
                  <span>${item.description}</span>
                </td>
                <td class="border-[1px] border-r-0 border-[#020401] text-center p-0 w-[10px]">
                  <div class="w-full text-center text-base overflow-hidden text-overflow-ellipsis whitespace-nowrap">
                    ${item.maxScore}
                  </div>
                </td>
                <td class="border-[1px] border-[#020401]"></td>
                <td class="border-[1px] border-[#020401]"></td>
                <td class="border-[1px] border-[#020401] border-r-[2px]"></td>
              </tr>
            `).join('')}
          </tbody>
          <tfoot>
            <tr class="h-[20px]">
              <td class="border-[1px] border-[#020401]"></td>
              <td class="border-[1px] border-[#020401]"></td>
              <td class="border-[1px] border-[#020401] w-[10px]"></td>
              <td class="border-[1px] border-[#020401]"></td>
              <td class="border-[1px] border-[#020401]"></td>
              <td class="border-[1px] border-[#020401] border-r-[2px]"></td>
            </tr>
          </tfoot>
        </table>
        <div class="w-full pl-[2cm] pr-[1cm] text-base font-times" style="page-break-inside: avoid;">
          <div class="w-full flex mt-[50px] justify-end pl-[2cm] pr-[1cm]">
            <div class="w-[50%] mr-[20px]">
              <div class="w-full text-center">
                Trà Vinh,<span class="italic"> ngày ... tháng ... năm ... </span>
              </div>
              <div class="w-full text-center font-bold">
                GV CHẤM BÁO CÁO
              </div>
              <div class="w-full text-center">
              </div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
console.log("hmdkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk")
console.log(htmlContent);

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(htmlContent);

    const outputPath = path.join(__dirname, '../public/pdf/output.pdf');
    const pdfOptions = {
      path: outputPath,
      format: 'A4',
      //landscape: isLandscape,
      margin: {
        top: '2cm',
        bottom: '2cm',
        left: '1cm',
        right: '1cm'
      }
    };
    await page.pdf(pdfOptions);
    await browser.close();

    res.sendFile(outputPath);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
