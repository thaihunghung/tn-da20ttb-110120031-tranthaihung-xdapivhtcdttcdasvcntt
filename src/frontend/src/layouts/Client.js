// import Header from "../components/pages/Client/Header/Header";
import Login from "../components/pages/Client/Auth/Login";
import Home from "../components/pages/Client/Home/Home";
// import Menu from "../components/pages/Client/Menu/Menu";
import "./Layout.css";
import { Route, Routes } from "react-router-dom";
function Client() {
    return (
        <div className="Client">
            <div className="flex-1">
                {/* <Header />
                <Image
                    className="w-[100vw] hidden xl:flex"
                    radius="none"
                    src="https://ktcn.tvu.edu.vn/ht96_image/bg.png"
                /> */}
                {/* <Menu /> */}
                <div className="max-w-[2000px] m-auto">
                    <Routes>
                        <Route path="" element={<Login />} />
                        <Route path="/dashboard" element={<Home />} />
                    </Routes>
                </div>
            </div>
            {/* <Footer /> */}
        </div>
    );
}

export default Client;
