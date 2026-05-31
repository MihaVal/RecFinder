import { useState } from "react";
import RecList from "./RecList";

const Home = () => {    
    const [recs, setRecs] = useState([
        {sport: 'Football', desc: 'lorem ipsum...', pLimit: 9, author: 'Leo', id:1},
        {sport: 'Basketball', desc: 'lorem ipsum...', pLimit: 5, author: 'Jalen', id:2},
        {sport: 'Tennis', desc: 'lorem ipsum...', pLimit: 3, author: 'Andy', id:3}

    ]);

    const handleDelete = (id) => {
        const newRecs = recs.filter(rec => rec.id !== id);
        setRecs(newRecs);
    }
    
    return (
        <div className="home">
            <RecList /*this is a prop ->*/recs={recs} title="Posts:" handleDelete={handleDelete}/>

        </div>
    );
}
 
export default Home