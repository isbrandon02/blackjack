function Card({suit, number}) {

    const color = (suit === "♥" || suit === "♦") ? "red" : "black"

    const styles={
        color: color
    }

    return(
        <div className="card">
            <p className="number--top" style={styles}>{number}</p>
            <p className="number--bottom" style={styles}>{number}</p>
            <p className="pip" style={styles}>{suit}</p>
        </div>
    )
}

export default Card