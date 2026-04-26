import { useState } from "react";

function Home(){
    const [input,setInput] = useState("")
    const [result,setResult] = useState("")
    const [years, setYears] = useState("")

    const [preferences, setPreferences] = useState({
        climate: "",
        budget: "",
        transport: "",
        distance: "",
        cityType: "",
        workMode: ""
    })

    function handlePreferenceChange(e){
        const { name, value } = e.target;
        setPreferences(prev => ({
            ...prev,
            [name]: value
        }))
    }

    async function handleClick(){

      const response = await fetch("http://localhost:5000/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userInput: input,
          preference: preferences,
          years: years
        })
      });

      const data = await response.json();
      setResult(data.result);
    }

    return (
        <>
            {/* SKILLS */}
            <label>Enter Skills</label><br />
            <input
                placeholder="e.g. Python, DSA, React"
                value={input}
                onChange={(e)=> setInput(e.target.value)}
            />

            <br /><br />

            

         

            {/* 🔽 OTHER PREFERENCES (OPTIONAL) */}
            <h3>Location Preferences (Optional)</h3>

            <label>Climate:</label>
            <select name="climate" onChange={handlePreferenceChange}>
                <option value="">Select</option>
                <option value="cold">Cold</option>
                <option value="moderate">Moderate</option>
                <option value="hot">Hot</option>
            </select>

            <br /><br />

            <label>PG Budget:</label>
            <select name="budget" onChange={handlePreferenceChange}>
                <option value="">Select</option>
                <option value="low">Under 8k</option>
                <option value="medium">8k-15k</option>
                <option value="high">15k+</option>
            </select>

            <br /><br />

            <label>Transport:</label>
            <select name="transport" onChange={handlePreferenceChange}>
                <option value="">Select</option>
                <option value="good">Good</option>
                <option value="average">Average</option>
                <option value="poor">Poor</option>
            </select>

            <br /><br />

            <label>Distance:</label>
            <select name="distance" onChange={handlePreferenceChange}>
                <option value="">Select</option>
                <option value="near">0-5 km</option>
                <option value="medium">5-15 km</option>
                <option value="far">15+ km</option>
            </select>

            <br /><br />

            <label>City Type:</label>
            <select name="cityType" onChange={handlePreferenceChange}>
                <option value="">Select</option>
                <option value="metro">Metro</option>
                <option value="peaceful">Peaceful</option>
                <option value="hometown">Near Home</option>
            </select>

            <br /><br />

            <label>Work Mode:</label>
            <select name="workMode" onChange={handlePreferenceChange}>
                <option value="">Select</option>
                <option value="remote">Remote</option>
                <option value="hybrid">Hybrid</option>
                <option value="office">Office</option>
            </select>

            <br /><br />

            {/* 🔥 CAREER ROADMAP SECTION */}
            <h3>Career Roadmap for Max Package</h3>

            <label>Select Time Horizon:</label>
            <select value={years} onChange={(e)=> setYears(e.target.value)}>
                <option value="">Select</option>
                <option value="3">0-3 Years</option>
                <option value="10">10 Years</option>
                <option value="15">15 Years</option>
                <option value="20">20 Years</option>
                <option value="30">30 Years</option>
                <option value="40">40 Years</option>
            </select>
        <br></br>
        
        
            {/* SUBMIT */}
            <button onClick={handleClick}>Submit</button>

            {/* RESULT */}
            <div className="ResultBox">
                <pre>{result}</pre>
            </div>
        </>
    )
}

export default Home;
