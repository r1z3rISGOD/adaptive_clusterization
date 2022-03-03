import xlsxParser from "xls-parser";

export const xlsParser = (file) => {
    return xlsxParser
        .onFileSelection(file)
        .then(data => data);
}
