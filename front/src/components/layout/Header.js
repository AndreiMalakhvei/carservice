

const Header = () => {

    return (
        <div className="navbar">

            <div className="navbar-element">
                <a className="navbar-item" href="#home">Home</a>
            </div>
            <div className="navbar-element">
                <a className="navbar-item" href="#news">News</a>
            </div>
            <div className="navbar-element">
                <div className="dropdown">
                    <button className="dropbtn">Dropdown

                    </button>
                    <div className="dropdown-content">
                        <a href="#">Link 1</a>
                        <a href="#">Link 2</a>
                        <a href="#">Link 3</a>
                    </div>

                </div>

            </div>
        </div>

    );
};

export default Header;