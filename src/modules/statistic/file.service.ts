import { Injectable, StreamableFile } from "@nestjs/common";
import { WorkSheet } from "xlsx";

const createCsvStringifier = require("csv-writer").createObjectCsvStringifier;
const XLSX = require("xlsx");

@Injectable()
export class FileService {

  public async getCsvReport(header: any[], data: any) {
    const csvStringifier = createCsvStringifier({ header });
    const buffHeader = Buffer.from(csvStringifier.getHeaderString(), "utf-8");
    const buffRecords = Buffer.from(csvStringifier.stringifyRecords(data), "utf-8");
    return new StreamableFile(Buffer.concat([buffHeader, buffRecords]));
  }

  public async getXlsxReport(header: any[], data: any) {
    const columnNames = header;

    let objectMaxLength = [];
    for (let i = 0; i < data.length; i++) {
      let value = <any>Object.values(data[i]);
      for (let j = 0; j < value.length; j++) {
        if (typeof value[j] == "number") {
          objectMaxLength[j] = 10;
        } else {
          objectMaxLength[j] = objectMaxLength[j] >= value[j].length ? objectMaxLength[j] : value[j].length + 2;
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

    worksheet["!cols"] = cols;
    XLSX.utils.book_append_sheet(workBook, worksheet, "Sheet1");

    const file = XLSX.write(workBook, { bookType: "xlsx", type: "buffer" });
    return new StreamableFile(file);
  }

  public async getPdfReport(header: any[], data: any, reportName: string, fontSize: number = 14, tableSize: number = undefined) {
    const PDFDocument = require("pdfkit-table");
    const getStream = require("get-stream");

    const permissions = {
      ownerPassword: "12345678",
      permissions: {
        modifying: false,
        copying: false,
        fillingForms: false
      },
      layout : "landscape"
    };

    const doc = new PDFDocument(permissions);

    doc.font("Times-Roman");
    doc.fontSize(18).fillColor("red").text("Cargon", { align: "center" });
    doc.moveDown();
    doc.fontSize(16).fillColor("black").text(reportName, { align: "center" });
    doc.moveDown();

    const table = {
      headers: header,
      datas: data,
      options: {
        width: tableSize
      }
    };
    doc.table(table, {
      prepareHeader: () => doc.font("Times-Roman").fontSize(fontSize),
      prepareRow: (row, i) => doc.font("Times-Roman").fontSize(fontSize)
    });
    doc.moveDown();
    doc.fontSize(9).fillColor("black").text("Cargon. All rights reserved", { align: "left" });
    doc.end();

    return new StreamableFile(await getStream.buffer(doc));
  }

}
