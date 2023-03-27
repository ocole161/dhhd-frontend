import SpecialCardList from "./SpecialCardList"

function Home({ neighborhoods, times }) {
    return (
        <>
        <SpecialCardList neighborhoods={neighborhoods} times={times}/>
        </>
    )
}

export default Home