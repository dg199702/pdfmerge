const hummus = require('hummus');
const memoryStreams = require('memory-streams');
const fs = require('fs');
/**
 * Concatenate two PDFs in Buffers
 * @param {Buffer} firstBuffer 
 * @param {Buffer} secondBuffer 
 * @returns {Buffer} - a Buffer containing the concactenated PDFs
 */
const combinePDFBuffers = (buffers) => {
  var outStream = new memoryStreams.WritableStream();
  var firstPDFStream = new hummus.PDFRStreamForBuffer(buffers[0]);

  try {
    const pdfWriter = hummus.createWriterToModify(firstPDFStream, new hummus.PDFStreamForResponse(outStream));

    for (const [i, buffer] of buffers.entries()) {
      if (i == 0) continue;
      console.log(buffer)
      pdfWriter.appendPDFPagesFromPDF(buffer);
    }
    pdfWriter.end();
    var newBuffer = outStream.toBuffer();
    outStream.end();

    return newBuffer;
  }
  catch (e) {
    outStream.end();
    throw new Error('Error during PDF combination: ' + e.message);
  }
};

const files = fs.readdirSync('./pdfs')
const buffers = []

for (const file of files) {
  const fileBuffer = fs.readFileSync(`pdfs/${file}`);
  buffers.push(fileBuffer);
}

const mergedPDF = combinePDFBuffers(buffers);
fs.writeFileSync('./merged.pdf', mergedPDF);