const http = require('http');
const { createCanvas } = require('canvas')
const assert = require('assert');
const pdfjsLib = require('pdfjs-dist');

function NodeCanvasFactory() {}
NodeCanvasFactory.prototype = {
  create: function NodeCanvasFactory_create(width, height) {
    assert(width > 0 && height > 0, 'Invalid canvas size');
    var canvas = createCanvas(width, height, 'png')
    var context = canvas.getContext('2d');
    return {
      canvas: canvas,
      context: context,
    };
  },

  reset: function NodeCanvasFactory_reset(canvasAndContext, width, height) {
    assert(canvasAndContext.canvas, 'Canvas is not specified');
    assert(width > 0 && height > 0, 'Invalid canvas size');
    canvasAndContext.canvas.width = width;
    canvasAndContext.canvas.height = height;
  },

  destroy: function NodeCanvasFactory_destroy(canvasAndContext) {
    assert(canvasAndContext.canvas, 'Canvas is not specified');

    // Zeroing the width and height cause Firefox to release graphics
    // resources immediately, which can greatly reduce memory consumption.
    canvasAndContext.canvas.width = 0;
    canvasAndContext.canvas.height = 0;
    canvasAndContext.canvas = null;
    canvasAndContext.context = null;
  },
};

http.createServer(function (req, res) {
	
	if (req.method !== 'POST') {
		res.writeHead(405, {'Content-Type': 'text/plain'});
		res.end('Method Not Allowed\n only POST requests are supported');
	    console.error('http method not allowed: ' + req.method);

		return;
	} 
	console.log((new Date()).toISOString() + ' incoming POST request');

    // read incoming POST data in chunks 
    let chunks = [];
    req.on('data', chunk => {
        chunks.push(chunk);
    });
    
    req.on('end', () => {
		// Read the PDF file into a typed array so PDF.js can load it.
		const rawData = new Uint8Array(Buffer.concat(chunks));
		// Load the PDF file.
		pdfjsLib.getDocument(rawData).then(function (pdfDocument) {
		  console.log((new Date()).toISOString() + ' PDF loaded (' + rawData.byteLength + ' Bytes)');

		  // Get the first page.
		  pdfDocument.getPage(1).then(function (page) {
			// Render the page on a Node canvas with 100% scale.
			const viewport = page.getViewport(1.0);
			const canvasFactory = new NodeCanvasFactory();
			const canvasAndContext = canvasFactory.create(viewport.width, viewport.height);
			const renderContext = {
			  canvasContext: canvasAndContext.context,
			  viewport: viewport,
			  canvasFactory: canvasFactory
			};

			page.render(renderContext).then(function () {
			  console.log((new Date()).toISOString() +  ' page rendered');
			  res.writeHead(200, {'Content-Type': 'image/png'});
			  // convert the canvas to a png stream.
			  canvasAndContext.canvas.createPNGStream({compressionLevel: 9}).pipe(res);
			  console.log((new Date()).toISOString() +  ' PNG created');
			});
		  });
		}).catch(function(reason) {
		  res.writeHead(500, {'Content-Type': 'text/plain'});
		  res.end('Error: ' + reason);
		  console.log(reason);
		});
    
    });
    
}).listen(3000, "127.0.0.1");

console.log('PDF2PNG Server running at http://127.0.0.1:3000 waiting for PDF data via POST requests');
