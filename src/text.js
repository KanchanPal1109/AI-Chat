// App.js 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
const  App = () => {
const getMessages = async () =>{
const options = {
  method : "POST",
  body : JSON.stringify({
    message : "Hello how are you?"
  }),
  headers: {
    "Content-Type" : "application/json"
  }
}

  try{
   const response =  await fetch('http://localhost:8000/completions' , options)
    const data = await response.json()
    console.log(data)
  }catch(error){
    console.log(error)
  }
}
  return (
    <div className="App">

    <section className="side-bar">

      <button>+ New Chat</button>
      <ul className="history">
        <li>hie</li>
      </ul>
      <nav>I am Kay</nav>
    </section>

   
    <section className="main">

    <h1>Hie, I'm you taking bot!</h1>

    <ul className="feed"></ul>

    <div className="bottom-section">
    <div className="input-container">
      <input/>

    <div id="submit" onClick={getMessages}> 
    <FontAwesomeIcon icon={faPaperPlane} />
    </div>

  </div>

  </div>
    </section>
  </div>
  );
}

export default App;


// Server.js

const PORT = 8000;
const express = require('express')
const cors = require('cors')

const app = express()
app.use(express.json())
app.use(cors())

const API_KEY = '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'

app.post('/completions', async (req , res )=> {

    const options = {
        method : "POST",
        Headers:{
            "Authorization" : `Bearer ${API_KEY}`,
            "Content-Type" : "application/json"
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{role: "User" , content: "How are you?"}],
            max_tokens:100,
        })
    }

try{
    const response = await fetch('https://api.openai.com/v1/chat/completions')
    const data = await response.json()
    res.send(data)
}
catch(error){
    console.log(error)
}

} )
app.listen(PORT, () => console.log("Server is running on PORT" + PORT))


// APp.js  Final just that titke thing array is not populating 


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { useState , useEffect } from 'react';

const  App = () => {

  const [value , setValue] = useState(null)
  const [message , setMessage] = useState(null)
  const [previousChats , setPreviousChats] = useState([])
  const [currentTitle, setCurrentTitle] = useState(null)

  const createNewChat = () =>{
    setMessage(null)
    setValue("")
    setCurrentTitle(null)

  }

const getMessages = async () =>{
const options = {
  method : "POST",
  body : JSON.stringify({
    message : value
  }),
  headers: {
    "Content-Type" : "application/json"
  },
  mode: 'cors' 
}

  try{
   const response =  await fetch('http://localhost:8000/completions' , options)
    const data = await response.json()
    // console.log(response , "response")
    console.log(data)
    setMessage(data.choices[0].message)

  }catch(error){
    console.log(error)
    // console.error("Error:", error);
  }
}

// console.log(message)

useEffect(() =>{
// console.log(currentTitle , value , message) // Actual title

if(!currentTitle && value && message){
  setCurrentTitle(value)
}
if(currentTitle && value && message){
  setPreviousChats(prevChats => [...prevChats,
  {
    title: currentTitle,
    role:"user",
    content : setValue
  }, 
  {
    title:currentTitle,
    role: message.role,
    content:message.content
    
  }]

  )
}
},[message , currentTitle] )

console.log(previousChats)

const currentChat = previousChats.filter(previousChat => previousChat.title === currentTitle)

const unoqueTitles = Array.from(new Set(previousChats.map(previousChat => previousChat.title)))
console.log(unoqueTitles , "unoqueTitles")

  return (
    <div className="App">

    <section className="side-bar">

      <button onClick={createNewChat}>+ New Chat</button>
      <ul className="history">
        <li>hie</li>
      </ul>
      <nav>I am Kay</nav>
    </section>

   
    <section className="main">

    { !currentTitle && <h1>Hie, I'm you taking bot!</h1>}

    <ul className="feed">

      {currentChat?.map((chatMessage , index) => 
      
      <li key ={index}>  
      <p className="role">{chatMessage.role}</p>
      <p>{chatMessage.message}</p>
      
      </li>)}


    </ul>

    <div className="bottom-section">
    <div className="input-container">
    <input value = {value} onChange={(e) => setValue(e.target.value)}/>

    <div id="submit" onClick={getMessages}> 
    <FontAwesomeIcon icon={faPaperPlane} />
    </div>

  </div>

  </div>
    </section>
  </div>
  );
}

export default App;



// All Codes finals sab chal raha hai just changing some design and styles 


// server.js 
const PORT = 8000;
const express = require('express');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());

// const API_KEY = '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'
const API_KEY = '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';

app.post('/completions', async (req, res) => {

  const options = {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: req.body.message }],
      max_tokens: 100,
    })
  };

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', options);
    const data = await response.json();

    // Log successful response
    // console.log("Response Status:", response.status);
    // console.log("Response Data:", data);

    res.send(data);
  } catch (error) {
    // Log error details
    console.error("Error:", error);

    if (error.response) {
      console.error("Response Status:", error.response.status);
      console.error("Response Text:", await error.response.text());
    }

    res.status(500).send({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => console.log("Server is running on PORT " + PORT));



// App.js
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { useState , useEffect } from 'react';

const  App = () => {

  const [value , setValue] = useState(null)
  const [message , setMessage] = useState(null)
  const [previousChats , setPreviousChats] = useState([])
  const [currentTitle, setCurrentTitle] = useState(null)

  const createNewChat = () =>{
    setMessage(null)
    setValue("")
    setCurrentTitle(null)

  }

  const handleClick = (uniqueTitle) =>{

      setMessage(null)
      setValue("")
      setCurrentTitle(uniqueTitle)

  }

const getMessages = async () =>{
const options = {
  method : "POST",
  body : JSON.stringify({
    message : value
  }),
  headers: {
    "Content-Type" : "application/json"
  },
  mode: 'cors' 
}

  try{
   const response =  await fetch('http://localhost:8000/completions' , options)
    const data = await response.json()
    // console.log(response , "response")
    console.log(data)
    setMessage(data.choices[0].message)

  }catch(error){
    console.log(error)
    // console.error("Error:", error);
  }
}

// console.log(message)

useEffect(() =>{
// console.log(currentTitle , value , message) // Actual title

if(!currentTitle && value && message){
  setCurrentTitle(value)
}
if(currentTitle && value && message){
  setPreviousChats(prevChats => [...prevChats,
  {
    title: currentTitle,
    role:"user",
    content : value
  }, 
  {
    title:currentTitle,
    role: message.role,
    content:message.content
    
  }]

  )
}
},[message , currentTitle] )

console.log(previousChats)

const currentChat = previousChats.filter(previousChat => previousChat.title === currentTitle)

const uniqueTitles = Array.from(new Set(previousChats.map(previousChat => previousChat.title)))
console.log(uniqueTitles , "unoqueTitles")

  return (
    <div className="App">

    <section className="side-bar">

      <button onClick={createNewChat}>+ New Chat</button>
      <ul className="history">
       {uniqueTitles?.map((uniqueTitle , index) => 
        
        
        <li key={index} onClick={ () => handleClick (uniqueTitle)}>{uniqueTitle}</li>
       )}
     
     
      </ul>
      <nav>I am Kay</nav>
    </section>
    <section className="main">
    { !currentTitle && <h1>Hie, I'm you taking bot!</h1>}
    <ul className="feed">
      {currentChat?.map((chatMessage , index) => 
      
      <li key ={index}>  
      <p className="role">{chatMessage.role}</p>
      <p>{chatMessage.content}</p>
  </li>)}
    </ul>

    <div className="bottom-section">
    <div className="input-container">
    <input value = {value} onChange={(e) => setValue(e.target.value)}/>

    <div id="submit" onClick={getMessages}> 
    <FontAwesomeIcon icon={faPaperPlane} />
    </div>

  </div>

  </div>
    </section>
  </div>
  );
}

export default App;

// Index.css

@import url('https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&display=swap');

*{
  color: white;
  font-family: 'Open Sans', sans-serif;
}

body{
  margin: 0;
  padding: 0;
  /* overflow: hidden; */
}

.App{
background-color: #343541;
display: flex;
}

.side-bar{
  background-color: #202123;
  height: 100vh;
  width:280px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.main{
  height: 100vh;
  width:100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}

button{
  border: solid 0.5px rgba(255, 255, 255, 0.5);
  background-color: transparent;
  border-radius: 5px;
  padding: 10px;
  margin: 10px;
}

nav{
  border: solid 0.5px rgba(255, 255, 255, 0.5);
  padding: 10px;
  margin: 10px;
}
.history{

  padding: 10px;
  margin: 10px;
  height: 100%;
}
.history li{
  list-style-type: none;
  padding: 15px  0;
  cursor: pointer;
}
.bottom-section{
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  }

.input-container{
  position:relative;
  width: 100%;
  max-width: 650px;
}

input{

  font-size: 20px;
  width: 100%;
  border: none;
  background-color: rgba(255, 255, 255, 0.05);
  padding: 12px 15px;
  border-radius: 5px;
  box-shadow: rgba(0, 0, 0, 0.05) 0 54px 55px,
  rgba(0, 0, 0, 0.05) 0 -12px 30px,
  rgba(0, 0, 0, 0.05) 0 4px 6px,
  rgba(0, 0, 0, 0.05) 0 12px 3px,
  rgba(0, 0, 0, 0.05) 0 -3px 5px;
  margin-bottom: 25px;
}
.input-container {
  position: relative; /* Set position to relative for absolute positioning inside it */
}
#submit{
  position:absolute;
  bottom:35px;
  right:0;
  cursor: pointer;
}

#submit > svg {
  font-size: 24px; /* Adjust the size as needed */
}

.feed{

  overflow: scroll;
  width: 100%;
  padding: 0;

}

.feed li {
  display: flex;
  background-color: 	#7393B3;
  width:100%;
  padding: 20px;
  margin: 20px 0;

}
.feed p {
  color :black;
  font-size: 14px;
  text-align: left;
}
.feed p.role{
  min-width:100px
}

/* .material-symbols-outlined {
  font-variation-settings:
  'FILL' 0,
  'wght' 400,
  'GRAD' 0,
  'opsz' 24
} */
