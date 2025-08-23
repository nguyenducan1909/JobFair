import SearchBar from "./SearchBar";
import "../assets/styles/searchBar.css"
import FilterLocation from "./FilterLocation";
import CardJob from "./CardJob";

const Home = () => {
    return (
        <>
            <div className="searchBar-container">
                <SearchBar />
            </div>
            <div>
                <div className="">Việc làm mới nhất</div>
                <FilterLocation/>
                <CardJob/>
                <CardJob/>
                <CardJob/>
            </div>
        </>
    );
};

export default Home;
