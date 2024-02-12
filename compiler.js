const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');
const cors = require('cors');
const { exec } = require('child_process');
const compiler = require('compilex');
const options = {stats : true};
compiler.init(options);

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' })); 
app.timeout = 30000;

const clear_tempFiles = ()=>{
  compiler.flush(function(){
    console.log('temp file deleted')
  });
}

app.post('/code', async (req, res) => {
  try {
    const { title, body } = req.body;

    if (!title || !body) {
      return res.status(400).json({ error: 'Invalid request format, both title and body are required' });
    }
    

    // Check if the file has a .js extension
    
    if (title === 'js') {
      const randomName = crypto.randomBytes(4).toString('hex');
      const filePath = path.join(__dirname, 'temp', `${randomName}.${title}`);
      await fs.writeFile(filePath, body);
      console.log('File created');

      const jsExecutable = `"node" "${filePath}"`;
      exec(jsExecutable, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error executing Node.js script: ${error.message}`);
          console.error(`Standard Error (stderr): ${stderr}`);
          return res.status(500).json({ error: `${stderr}` });
        }
        fs.unlink(filePath);
        console.log('File deleted');
        return res.json({ 'Output': `${stdout}` });
      });
    }
    else if (title === 'py') {
      try {
        const code = body;
        const envData = { OS: "Windows" };
        setTimeout(clear_tempFiles, 20000);
        compiler.compilePython(envData, code, function (data) {
          return res.json(data);
        });
      } catch (error) {
        console.error('Error reading file:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
    }
    else if(title === 'cpp'){
      try{
        const code = body;
        const envData = {OS: "Windows",cmd:"g++",options:{timeout:10000}};
        setTimeout(clear_tempFiles, 30000);
        compiler.compileCPP(envData,code,function(data){
          return res.json(data);
        });
      } catch(error){
        console.error('Error reading file:',error);
        return res.status(500).json({error:'Internal server Error'});
      }
    }
    else if(title === 'ts'){
      const randomName = crypto.randomBytes(4).toString('hex');
      const tsFilePath = path.join(__dirname, 'files', `${randomName}.ts`);
      const jsFilePath = path.join(__dirname, 'files', `${randomName}.js`);
      await fs.writeFile(tsFilePath, body);
      console.log('TypeScript file created');

      const tscCommand = `"tsc" "${tsFilePath}"`;
      console.log(tscCommand);
      exec(tscCommand, async (compileError, compileStdout, compileStderr) => {
        if (compileError) {
          console.error(`Error compiling TypeScript: ${compileError.message}`);
          console.error(`Compilation Error (stderr): ${compileStderr}`);
          return res.status(500).json({ error: `${compileStderr}` });
        }

        await fs.unlink(tsFilePath);
        console.log('TypeScript file deleted');

        const jsExecutable = `"node" "${jsFilePath}"`;
        exec(jsExecutable, async (runError, stdout, stderr) => {
        if (runError) {
          console.error(`Error executing Node.js script: ${runError.message}`);
          console.error(`Standard Error (stderr): ${stderr}`);
          return res.status(500).json({ error: `${stderr}` });
        }

        await fs.unlink(jsFilePath);
        console.log('JavaScript file deleted');

        return res.json({ 'Output': `${stdout}` });
      });
      });
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.listen(3000, () => {
  console.log('Server is running on port 3000');
});