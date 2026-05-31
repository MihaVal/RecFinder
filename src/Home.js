import { useState } from "react";

const Home = () => {    
    const [recs, setRecs] = useState([
        {sport: 'Football', desc: 'lorem ipsum...', pLimit: 9, author: 'Leo', id:1},
        {sport: 'Basketball', desc: 'lorem ipsum...', pLimit: 5, author: 'Jalen', id:2},
        {sport: 'Tennis', desc: 'lorem ipsum...', pLimit: 3, author: 'Andy', id:3}

    ]);
    return (
        <div className="home">
        {recs.map((rec) => (
            <div className="rec-preview" key={rec.id}>
                <h2>{rec.sport}</h2>
                <p>Posted by: {rec.author}</p>
            </div>
            
        ))}
        </div>
    );
}
 
export default Home