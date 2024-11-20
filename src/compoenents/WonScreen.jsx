function WonScreen(props) {
    return(
        <div className="lose--screen">
            <h1>YOU WON!</h1>
            <button className="button2" onClick={() => props.reset()}>Play Again?</button>
        </div>
    )
}

export default WonScreen