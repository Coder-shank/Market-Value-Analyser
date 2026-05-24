import { useState } from "react";
import './App'
function Home(){
    const [input,setInput] = useState("");
    const [result,setResult] = useState("");
    const [years, setYears] = useState("");
    const [loading, setLoading] = useState(false);

    const [showInputBox,setinputbox] = useState(false);

    const [analyzeFactors, setAnalyzeFactors] = useState(false);
    const [analyzeSkills, setAnalyzeSkills] = useState(false);

    const [preferences, setPreferences] = useState({
        climate: "",
        budget: "",
        transport: "",
        distance: "",
        cityType: "",
        workMode: "",
        homeLocation: ""
    });

    function handlePreferenceChange(e){
        const { name, value } = e.target;

        setPreferences(prev => ({
            ...prev,
            [name]: value
        }));
    }

    function handlePreferenceChangeCityType(e){

        const { name, value } = e.target;

        setPreferences(prev => ({
            ...prev,
            [name]: value
        }));

        if(value === "hometown"){
            setinputbox(true);
        }

        else{

            setinputbox(false);

            setPreferences(prev => ({
                ...prev,
                homeLocation: ""
            }));
        }
    }

    function handleHomeLocationChange(e){

        const value = e.target.value;

        setPreferences(prev => ({
            ...prev,
            homeLocation: value          
        }));                           
    }                         

    async function handleClick(){

        if(!input){
            alert("Please enter skills first");
            return;
        }

        if(
            preferences.cityType === "hometown" &&
            !preferences.homeLocation
        ){
            alert("Please enter your home location");
            return;
        }

        try{

            setLoading(true);
            setResult("");

            const filteredPreferences = Object.fromEntries(
                Object.entries(preferences).filter(([_, v]) => v !== "")
            );

            console.log(filteredPreferences);

            const response = await fetch(
                // "http://localhost:5000/generate",
                "https://market-value-analyser.onrender.com/generate",
                
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        userInput: input,
                        preference: filteredPreferences,
                        years,
                        analyzeFactors,
                        analyzeSkills
                    })
                }
            );

            const data = await response.json();

            setResult(data.result);

        }catch(err){

            console.log(err);
            setResult("Error fetching result");

        }finally{
            
            setLoading(false);
        }
    }

    return (
       <>
    <div className="career-container">
         <h1> Market Value Analyser </h1>
        <h3 className="section-title">Enter Skills</h3>

        <input
            className="text-input"
            placeholder="e.g. Python, DSA, React"
            value={input}
            onChange={(e) => setInput(e.target.value)}
        />

        <br /><br />

        <h3 className="section-title">Location Preferences (Optional)</h3>

        <label className="label">Climate:</label>

        <select
            className="select-box"
            name="climate"
            value={preferences.climate}
            onChange={handlePreferenceChange}
        >
            <option value="">Select</option>
            <option value="cold">Cold</option>
            <option value="moderate">Moderate</option>
            <option value="hot">Hot</option>
        </select>

        <br /><br />

        <label className="label">PG Budget:</label>

        <select
            className="select-box"
            name="budget"
            value={preferences.budget}
            onChange={handlePreferenceChange}
        >
            <option value="">Select</option>
            <option value="low">Under 8k</option>
            <option value="medium">8k-15k</option>
            <option value="high">15k+</option>
        </select>

        <br /><br />

        <label className="label">Transport:</label>

        <select
            className="select-box"
            name="transport"
            value={preferences.transport}
            onChange={handlePreferenceChange}
        >
            <option value="">Select</option>
            <option value="good">Good</option>
            <option value="average">Average</option>
            <option value="poor">Poor</option>
        </select>

        <br /><br />

        <label className="label">Distance:</label>

        <select
            className="select-box"
            name="distance"
            value={preferences.distance}
            onChange={handlePreferenceChange}
        >
            <option value="">Select</option>
            <option value="near">0-5 km</option>
            <option value="medium">5-15 km</option>
            <option value="far">15+ km</option>
        </select>

        <br /><br />

        <label className="label">City Type:</label>

        <select
            className="select-box"
            name="cityType"
            value={preferences.cityType}
            onChange={handlePreferenceChangeCityType}
        >
            <option value="">Select</option>
            <option value="metro">Metro</option>
            <option value="peaceful">Peaceful</option>
            <option value="hometown">Near Home</option>
        </select>

        {
            showInputBox && (
                <div>

                    <br />

                    <input
                        className="text-input"
                        placeholder="Enter your home city/state"
                        value={preferences.homeLocation}
                        onChange={handleHomeLocationChange}
                    />

                </div>
            )
        }

        <br /><br />

        <label className="label">Work Mode:</label>

        <select
            className="select-box"
            name="workMode"
            value={preferences.workMode}
            onChange={handlePreferenceChange}
        >
            <option value="">Select</option>
            <option value="remote">Remote</option>
            <option value="hybrid">Hybrid</option>
            <option value="office">Office</option>
        </select>

        <br /><br />

        <h3 className="section-title">Career Roadmap for Max Package</h3>

        <label className="label">Time Horizon:</label>

        <select
            className="select-box"
            value={years}
            onChange={(e) => setYears(e.target.value)}
        >
            <option value="">Select</option>
            <option value="3">0-3 Years</option>
            <option value="10">10 Years</option>
            <option value="15">15 Years</option>
            <option value="20">20 Years</option>
            <option value="30">30 Years</option>
            <option value="40">40 Years</option>
        </select>

        <br /><br />

        <h3 className="section-title">Extra Analysis</h3>

        <label className="checkbox-label">
            <input
                type="checkbox"
                checked={analyzeFactors}
                onChange={(e) => setAnalyzeFactors(e.target.checked)}
            />
            Resume Value
        </label>

        <br />

        <label className="checkbox-label">
            <input
                type="checkbox"
                checked={analyzeSkills}
                onChange={(e) => setAnalyzeSkills(e.target.checked)}
            />
            Skill Reality Check
        </label>

        <br /><br />

        <button
            className="submit-btn"
            onClick={handleClick}
        >
            {loading ? "Analyzing..." : "Submit"}
        </button>

        <br /><br />

        <div className="result-box">
            {loading ? <p>Loading...</p> : <pre>{result}</pre>}
        </div>

    </div>
</>
    );
}

export default Home;
