import "./Carousel.css"


const Carousel = ()=>{

    return (
        <div className="carousel-wrapper">
            <img
                id="main-img"
                src={"https://clipground.com/images/square-clipart-image-9.png"}
            >

            </img>
            <div className="carousel">
                {[
                    "https://clipground.com/images/square-clipart-image-9.png",
                    "https://th.bing.com/th/id/R.f8584c07a8b39a6a557a5520d70c644c?rik=%2fLl1Q2WLTDIxgA&riu=http%3a%2f%2fpluspng.com%2fimg-png%2fpng-square-shape-red-square-shape-clipart-2400.png&ehk=PIUxN4poK1BZcEAeCVOR58%2fUBfTFPghHhHyM89QELlA%3d&risl=&pid=ImgRaw&r=0",
                    "https://th.bing.com/th/id/R.f32a9ed5b415a028255ccbea99f36c9c?rik=lMuMnNXmowxWSA&pid=ImgRaw&r=0",
                ].map((url: string) => {
                    return <img src={url} className="carousel-img"></img>;
                })}
            </div>
        </div>
    )
}

export default Carousel;