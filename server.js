const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload());

app.post('/upload', function(req, res) {
  if (!req.files) {
    return res.status(400).send('No files were uploaded.');
  }

  const file = req.files.file;
  const folder = req.body.folder || '';
  const folderPath = path.join(__dirname, 'uploads', folder);

  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }

  file.mv(path.join(folderPath, file.name), function(err) {
    if (err) {
      return res.status(500).send(err);
    }

    res.send('File uploaded successfully!');
  });
});

app.get('/delete', function(req, res) {
  const filePath = path.join(__dirname, 'uploads', req.query.folder, req.query.file);

  if (!fs.existsSync(filePath)) {
    return res.status(400).send('File or folder does not exist.');
  }

  fs.rm(filePath, { recursive: true }, function(err) {
    if (err) {
      return res.status(500).send(err);
    }

    res.send('File or folder deleted successfully!');
  });
});

app.get('/structure', function(req, res) {
  const folderPath = path.join(__dirname, 'uploads', req.query.folder || '');

  if (!fs.existsSync(folderPath)) {
    return res.status(400).send('Folder does not exist.');
  }

  const fileStructure = getStructure(folderPath);

  res.send(fileStructure);
});

function getStructure(folderPath) {
  const fileStructure = [];

  fs.readdirSync(folderPath).forEach(function(file) {
    const filePath = path.join(folderPath, file);
    const stats = fs.statSync(filePath);

    if (stats.isDirectory()) {
      fileStructure.push({
        type: 'directory',
        name: file,
        contents: getStructure(filePath)
      });
    } else {
      fileStructure.push({
        type: 'file',
        name: file
      });
    }
  });

  return fileStructure;
}

app.listen(port, function() {
  console.log(`Server listening on port ${port}`);
});
