import { useState } from "react";

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
                "http://localhost:5000/generate",
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
            <h3>Enter Skills</h3>

            <input
                placeholder="e.g. Python, DSA, React"
                value={input}
                onChange={(e)=> setInput(e.target.value)}
            />

            <br /><br />

            <h3>Location Preferences (Optional)</h3>

            <label>Climate:</label>

            <select
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

            <label>PG Budget:</label>

            <select
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

            <label>Transport:</label>

            <select
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

            <label>Distance:</label>

            <select
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

            <label>City Type:</label>

            <select
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
                            placeholder="Enter your home city/state"
                            value={preferences.homeLocation}
                            onChange={handleHomeLocationChange}
                        />

                    </div>
                )
            }

            <br /><br />

            <label>Work Mode:</label>

            <select
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

            <h3>Career Roadmap for Max Package</h3>

            <label>Time Horizon:</label>

            <select
                value={years}
                onChange={(e)=> setYears(e.target.value)}
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

            <h3>Extra Analysis</h3>

            <label>
                <input
                    type="checkbox"
                    checked={analyzeFactors}
                    onChange={(e)=> setAnalyzeFactors(e.target.checked)}
                />
                Resume Value
            </label>

            <br />

            <label>
                <input
                    type="checkbox"
                    checked={analyzeSkills}
                    onChange={(e)=> setAnalyzeSkills(e.target.checked)}
                />
                Skill Reality Check
            </label>

            <br /><br />

            <button onClick={handleClick}>
                {loading ? "Analyzing..." : "Submit"}
            </button>

            <br /><br />

            <div className="ResultBox">
                {loading ? <p>Loading...</p> : <pre>{result}</pre>}
            </div>
        </>
    );
}

export default Home;
