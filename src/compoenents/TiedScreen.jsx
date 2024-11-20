function TiedScreen(props) {
    return(
        <div className="lose--screen">
            <h1>YOU TIED!</h1>
            <button className="button2" onClick={() => props.reset()}>Play Again?</button>
        </div>
    )
}

export default TiedScreen