const RecList = ({recs,title,handleDelete}) => {
    
    return ( 
        
        <div className="rec-list">
            <h2>{title}</h2>
            {recs.map((rec) => (
            <div className="rec-preview" key={rec.id}>
                <h2>{rec.sport}</h2>
                <p>Posted by: {rec.author}</p>
                <button onClick={() => handleDelete(rec.id)}>Delete Rec</button>
            </div>
            
        ))}
        </div>
     );
}

export default RecList;