const { google } = require('googleapis')
const path = require('path')
const fs = require('fs')
const express = require('express')
const app = express()
const { OAuth2 } = google.auth

const oAuth2Client = new OAuth2(
    '1033549683997-g6hdcae9q5cvjc9pqtt98qquu4t4ojak.apps.googleusercontent.com','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'
)
 
oAuth2Client.setCredentials({
    refresh_token: '1//0gb3w2RxTauOmCgYIARAAGBASNwF-L9Ir3b1ZK9yAhYWkWijgEHv1lB8zgYSJZg3MAkSnKYfMGeSu8l_G8dU5iie07HwYKStAM4E'
}) 



const drive = google.drive({ version: 'v3', auth: oAuth2Client }) 

//file path for out file
const filePath = path.join(__dirname, 'a.text');

var fileData


const createFolder = async () => {

    const fileMetaData = {
      name: "Invoices",
      mimeType: "application/vnd.google-apps.folder",
    };
    const res = await drive.files
      .create({
        fields: "id",
        resource: fileMetaData,
      })
      .catch((err) => console.log(err));
    console.log(res.data);
  };


//   createFolder()


//function to upload the file
async function uploadFile() {
    try{
      const response = await drive.files.create({ 

            requestBody: {
                name: 'a.text', //file name
                mimeType: 'text/plain',
                parents:['145wV5hOZfl3uneir0WXHmpHqZJlrn35P'],
            },
            media: {
                mimeType: 'text/plain',
                body: fs.createReadStream(filePath),
            },
        });  
       
        // report the response from the request
        console.log(response.data);
        fileData = response.data
    }catch (error) {
        //report the error message
        console.log(error.message);
    }
}  

// uploadFile()

async function deleteFile() {
    try {
        const response = await drive.files.delete({
            fileId: '1wiCtXZsW8sPBThHvAURoKAbMf56ooVWP',// file id
        });
        console.log(response.data, response.status);
    } catch (error) {
        console.log(error.message);
    }
  }

// deleteFile()

// console.log(drive.files.list())

async function getAllFile() {
    try {
        const response = await drive.files.list({
            fields: 'files(name, webViewLink)',
            orderBy: 'createdTime desc'
        });
        console.log(response.data, response.status);
    } catch (error) {
        console.log(error.message);
    }
  }

// getAllFile()


async function getFile() {
    try {
        const response = await drive.files.get({
            fileId : '1kFo9gMzvvps2ktbxGAqMEUEZsSZA4uqF', 
             alt: "media"
        });
        
        // fs.writeFileSync(path.join(__dirname,'o.text'),response.data)

        console.log(response.data, response.status);
    } catch (error) {
        console.log(error.message);
    }
  }

// getFile()

//create a public url
async function generatePublicUrl() {
    try {
        

        // await drive.permissions.create({
        //     fileId: '1-11lleBdItEMnUL7QixNOfhcNbVMr-q_',
        //     requestBody: {
        //     role: 'reader',
        //     type: 'user',
        //     emailAddress: "andychavan505@gmail.com"
        //     },
        // });
        await drive.permissions.create({
            fileId: '1-11lleBdItEMnUL7QixNOfhcNbVMr-q_',
            requestBody: {
            role: 'writer',
            type: 'user',
            emailAddress: "andychavan505@gmail.com"
            },
        });

        //obtain the webview and webcontent links
        const result = await drive.files.get({
            fileId: '1-11lleBdItEMnUL7QixNOfhcNbVMr-q_',
            fields: 'webViewLink, webContentLink',
        });
      console.log(result.data);
    } catch (error) {
      console.log(error.message);
    }
  }

// generatePublicUrl()

// Google Forms


const Gforms = google.forms({ version: 'v1', auth: oAuth2Client })

const getAllResponse = async (req,res) =>{
  
  data = await Gforms.forms.responses.list({formId:'1xx0vb5TWTXdwg89DL54thEKfQ7AsU2N4Uz_rlhBMdEg'})

  // console.log(data.data.responses)

  // data.data.responses.forEach(element => {
  //   console.log(element.answers)
  // });
  res.send(data.data.responses)

}

// getAllResponse()


const getResponse = async ()=>{
  data = await Gforms.forms.responses.get({
    responseId: 'ACYDBNglW7UOjsyei08RonpT7Ekw3tBPvD52bhH8ZCfHeBYWjXvK57L5rNSETuyshDh4y2I',
    formId:'1xx0vb5TWTXdwg89DL54thEKfQ7AsU2N4Uz_rlhBMdEg'
  })

  console.log(data.data.answers['201b7a3a'].textAnswers.answers[0].value)

}

// getResponse()

const getForm = async (req,res) => {

  let finalData= []

  data = await Gforms.forms.get({formId:'1xx0vb5TWTXdwg89DL54thEKfQ7AsU2N4Uz_rlhBMdEg'})
  // console.log(data.data.items)

  questionData =  data.data.items

  questionData.forEach(element => {
      // console.log(element)
      finalData.push({'title':element.title,'questionId': element.questionItem.question.questionId})
    });

  res.send(finalData)
}


const getResponse2 = async (req,res) => {

  let finalData= []
  let finalData2= []

  data = await Gforms.forms.get({formId:'1xx0vb5TWTXdwg89DL54thEKfQ7AsU2N4Uz_rlhBMdEg'})

  questionData =  data.data.items

  questionData.forEach(element => {
      finalData.push({'title':element.title,'questionId': element.questionItem.question.questionId})
    });

    // console.log(finalData)

  data2 = await Gforms.forms.responses.list({formId:'1xx0vb5TWTXdwg89DL54thEKfQ7AsU2N4Uz_rlhBMdEg'})


  data2.data.responses.forEach(element => {
    temp = {'responseId':element.responseId}
    for(i=0;i<finalData.length;i++) {
    
      if(finalData[i].questionId == element.answers[finalData[i].questionId].questionId){
        temp[finalData[i].title] = element.answers[finalData[i].questionId].textAnswers['answers'][0].value
        } else {
          
        }
      }
    finalData2.push(temp)
  });


  console.log(finalData2)
  res.send(finalData2)
}



app.get('/',getForm)
app.get('/response',getAllResponse)
app.get('/response2',getResponse2)

app.listen(3001,()=>console.log("kengj"))