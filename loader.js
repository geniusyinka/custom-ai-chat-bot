

import { OpenAI } from "langchain/llms/openai";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { FaissStore } from "langchain/vectorstores/faiss";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import * as dotenv from 'dotenv'
dotenv.config()

export const injest_docs = async() => {
  const model = new OpenAI({ temperature: 0.9, model: "gpt-3.5-turbo", openAIApiKey:"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"});
  const loader = new PDFLoader("10.1.1.83.5248.pdf"); //you can change this to any PDF file of your choice.
  const docs = await loader.load();
  console.log('docs loaded')
  
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  })

  const docOutput = await textSplitter.splitDocuments(docs)
  let vectorStore = await FaissStore.fromDocuments(
    docOutput,
    new OpenAIEmbeddings(),
    )

    const directory = "/Users/yinka/Documents/art/OPENAI-VIBE-SESH/";
    await vectorStore.save(directory);
    console.log('saved!')

}

injest_docs()