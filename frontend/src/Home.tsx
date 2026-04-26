import { useState } from "react";

function Home(){
    const [input,setInput] = useState("")
    const [result,setResult] = useState("")
    const [preference, setPreference] = useState("")

    async function handleClick(){
      console.log(input)
        const response = await fetch("http://localhost:5000/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userInput: input, 
          preference: preference
        })
      }); 


      const data = await response.json();
      
      setResult(data.result);
      setInput("")
      console.log(data)
    }

    return (

        <>   
             <label htmlFor="InputSkills" > Input Your Skills in the given box below ,to know 
                market value of your skills 
             </label>
             <br></br>
              
             <input id="InputSkills"  placeholder="Enter Skills" value={input} onChange={(e)=>{setInput(e.target.value)}}    />
             <input
  placeholder="Describe your preferred lifestyle (budget, city type, etc)"
  value={preference}
  onChange={(e) => setPreference(e.target.value)}
/>


             <button onClick={handleClick}> Submit </button>
             <div className="ResultBox"><pre>{result}</pre> </div>
             
        </>
    )

}    

export default Home; 