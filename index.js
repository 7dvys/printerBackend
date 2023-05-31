const express = require('express');
const app = express();
const port = 3000;

const cors = require('cors');
const {spawn} = require('child_process')

app.use(cors())
app.use(express.json())

// get printers
app.get('/printer',(req,res)=>{
    try{
        const subprocess = spawn('lpstat',['-e']);
        subprocess.stdout.on('data',(data)=>{
            const printers = {printers:data.toString().split('\n').slice(0,-1)};
            res.send(JSON.stringify(printers))
        })
    }
    catch (e){
        console.log('error: '+e)
    }
})

// print
app.post('/printer',(req,res)=>{
    try {
        const {printer,zpl} = req.body;
        const zplEncoded = Buffer.from(zpl,'utf-8');
        const subprocess = spawn('lpr',['-P',printer,'-o','raw']);
        
        subprocess.stdin.write(zplEncoded);
        subprocess.stdin.end();
        
        subprocess.stdout.on('error', (err) => {
        console.error(`Error en stdout: ${err}`);
        });
        
        subprocess.stderr.on('error', (err) => {
        console.error(`Error en stderr: ${err}`);
        });

        res.send('ok');
    } catch (e) {
        console.log(e);
        res.send('error');
    }
})

app.listen(port,()=>{
    console.log('ready on port: '+port);
})