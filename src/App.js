import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { useState , useEffect } from 'react';

const  App = () => {

    // State variables for handling input, messages, previous chats, and current chat title

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
      <nav>Ask Your AI Buddy!</nav>
    </section>
    <section className="main">
    { !currentTitle && <h2>Hie, How can I assist you today?</h2>} 
    <ul className="feed">
      {currentChat?.map((chatMessage , index) => 
      
      <li key ={index}>  
      <p className="role"><i><b>{chatMessage.role}</b></i></p>
      <p>{chatMessage.content}</p>
        

  </li>)}
    </ul>

    <div className="bottom-section">
    <div className="input-container">
    <input placeholder='Need a hand? Feel free to ask anything.'  value = {value} onChange={(e) => setValue(e.target.value)}/>

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
