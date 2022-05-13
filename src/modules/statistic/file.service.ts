import { Injectable, StreamableFile } from '@nestjs/common';
import { WorkSheet } from 'xlsx';

const createCsvStringifier = require('csv-writer').createObjectCsvStringifier;
const XLSX = require('xlsx');

@Injectable()
export class FileService {
  async getCsvReport(header: any[], data: any) {
    const csvStringifier = createCsvStringifier({ header });
    const buffHeader = Buffer.from(csvStringifier.getHeaderString(), 'utf-8');
    const buffRecords = Buffer.from(
      csvStringifier.stringifyRecords(data),
      'utf-8',
    );
    return new StreamableFile(Buffer.concat([buffHeader, buffRecords]));
  }

  async getXlsxReport(header: any[], data: any) {
    const columnNames = header;

    const objectMaxLength = [];
    for (let i = 0; i < data.length; i++) {
      const value = <any>Object.values(data[i]);
      for (let j = 0; j < value.length; j++) {
        if (typeof value[j] == 'number') {
          objectMaxLength[j] = 10;
        } else {
          objectMaxLength[j] =
            objectMaxLength[j] >= value[j].length
              ? objectMaxLength[j]
              : value[j].length + 2;
        }
      }
    }
    for (let i = 0; i < columnNames.length; i++) {
      if (objectMaxLength[i] < columnNames[i].length) {
        objectMaxLength[i] = columnNames[i].length + 2;
      }
    }

    const workBook = XLSX.utils.book_new();
    const workSheetData = [columnNames, ...data];
    const worksheet: WorkSheet = XLSX.utils.aoa_to_sheet(workSheetData);

    const cols = [];
    for (let i = 0; i < objectMaxLength.length; i++) {
      cols.push({ wch: objectMaxLength[i] });
    }

    worksheet['!cols'] = cols;
    XLSX.utils.book_append_sheet(workBook, worksheet, 'Sheet1');

    const file = XLSX.write(workBook, { bookType: 'xlsx', type: 'buffer' });
    return new StreamableFile(file);
  }

  async getPdfReport(
    header: any[],
    data: any,
    reportName: string,
    fontSize = 14,
    tableSize: number = undefined,
  ) {
    const PDFDocument = require('pdfkit-table');
    const getStream = require('get-stream');

    const permissions = {
      ownerPassword: process.env.PDF_DOCUMENT_PERMISSIONS_SECRET,
      permissions: {
        modifying: false,
        copying: false,
        fillingForms: false,
      },
      layout: 'landscape',
    };

    const doc = new PDFDocument(permissions);

    doc.image('background.jpg', 0, 0, { width: 800, height: 650 });

    doc.font('Times-Bold');
    doc.fontSize(24).fillColor('aqua').text('CARGON', { align: 'center' });
    doc.moveDown();
    doc.fontSize(20).fillColor('black').text(reportName, { align: 'center' });
    doc.moveDown();

    const table = {
      headers: header,
      datas: data,
      options: {
        width: tableSize,
      },
    };
    doc.table(table, {
      prepareHeader: () => doc.font('Times-Roman').fontSize(fontSize),
      prepareRow: () => doc.font('Times-Roman').fontSize(fontSize),
    });
    doc.moveDown();
    doc
      .fontSize(12)
      .fillColor('black')
      .text('© Cargon. All rights reserved', { align: 'left' });
    doc.end();

    return new StreamableFile(await getStream.buffer(doc));
  }
}
