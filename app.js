import { OpenAI } from "langchain/llms/openai";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { FaissStore } from "langchain/vectorstores/faiss";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import { loadQAStuffChain, loadQAMapReduceChain } from "langchain/chains";
import { Document } from "langchain/document";

import express from 'express';
import http from 'http'
import fs from 'fs';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
dotenv.config()
import * as dotenv from 'dotenv'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3000;

/* Create HTTP server */
http.createServer(app).listen(process.env.PORT)
console.info('listening on port ' + process.env.PORT)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

/* Get endpoint to check current status  */
app.get('/api/health', async (req, res) => {
  res.json({
    success: true,
    message: 'Server is healthy',
  })
})

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.get('/ask', async (req, res) => {
  try {

      const llmA = new OpenAI({ modelName: "gpt-3.5-turbo"});
      const chainA = loadQAStuffChain(llmA);
      const directory = process.env.DIR //saved directory in .env file
      
      const loadedVectorStore = await FaissStore.load(
        directory,
        new OpenAIEmbeddings()
        );
        
        const question = "who is the author of this document?"; //question goes here. 
        const result = await loadedVectorStore.similaritySearch(question, 1);
        const resA = await chainA.call({
          input_documents: result,
          question,
        });
        // console.log({ resA });
        res.json({ result: resA }); // Send the response as JSON
  } 
    
    catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' }); // Send an error response
  }
});


