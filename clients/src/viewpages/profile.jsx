import { Navigate, useLocation } from "react-router-dom";
import Nav from 'react-bootstrap/Nav';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import React, { useEffect, useState } from "react";
import History from "../subpages/History";
import Payments from "../subpages/payment";
import ChangePassWords from "../subpages/changePasswords";
import {User} from "../service/UserT";
import { Booking } from "../service/booking";
import { withRouter } from 'react-router-dom';


/** @type {React.CSSProperties} */
const tabStyle = { display: "table-cell", fontSize: "32px", paddingLeft: "20px", paddingTop: "5px", paddingRight: "20px", paddingBottom: "5px" };
/** @type {React.CSSProperties} */
const activeTabStyle = { display: "table-cell", fontSize: "32px", paddingLeft: "20px", paddingTop: "5px", paddingRight: "20px", paddingBottom: "5px", border: "1px solid rgba(0,0,0,1)", fontWeight: "bold" }

function Profile({ state }) {
    // auth
    const [authCheckInProgress, setAuthCheckInProgress] = useState(false);
    const [userChecked, setUserChecked] = useState(false);
    const [user, setUser] = useState(null);
    const params = new URLSearchParams(useLocation().search);
    const [bookingInfo, setBookingInfo] = useState([]);


    const booking = new Booking()
    useEffect(()=>{
        // console.log("userid", user?._id)
        fetchData();

    },[user])

    async function fetchData() {
        try {
        //   console.log("userid", user?._id);
          const bookingInfo = await booking.getAllUserBookingById(user?._id);
          setBookingInfo(bookingInfo)
        } catch (error) {
          console.error('Error fetching booking information:', error);
        }
      }
    async function checkAuth() {
        setAuthCheckInProgress(true);
        try {
            
            const user = await User.getCurrentUser();
            if (user) setUser(user);
        } catch (err) {
            console.error(err);
        }
        setUserChecked(true);
    }
    if (!authCheckInProgress) checkAuth();
    if (!userChecked) return null;
    if (!user) return (<Navigate to='/Login' replace={true} />);

    var requestedPage = params.get("page");
    if (requestedPage !== "payment" && requestedPage !== "security") requestedPage = "history";

    // TODO get profile topbar and show history
    return (<div>
        <div style={{ display: "float", border: "1px solid rgba(0,0,0,1)" }}>
            <div style={{ backgroundColor: "white", color: "black", paddingLeft: "10%", paddingRight: "10%", paddingTop: "32px"}}>
                <div style={{ fontSize: "32px"}}><b>User Profile</b></div>
                <div style={{ display: "table" }}>
                    <FontAwesomeIcon icon={faUser} style={{ width: "100px", height: "100px", display: "table-cell" }} />
                    <div style={{ fontSize: "50px", display: "table-cell", paddingLeft: "50px" }}><b>{user.name}</b></div>
                </div>
                <div style={{ paddingBottom: "10px", fontSize: "24px"}}>
                    {user.member.is_premium ? <b>"Premium Member"</b> : "Regular Member"} - {user.member.reward}
                </div>
                <div style={{ display: "table" }}>
                    <Nav.Link style={requestedPage === "history" ? activeTabStyle : tabStyle} href="/Profile">history</Nav.Link>
                    <Nav.Link style={requestedPage === "payment" ? activeTabStyle : tabStyle} href="/Profile?page=payment">payment</Nav.Link>
                    <Nav.Link style={requestedPage === "security" ? activeTabStyle : tabStyle} href="Profile?page=security">security</Nav.Link>
                </div>
            </div>
        </div>
        {/* {requestedPage === "history" && <History bookings={user.bookings}/>} */}
        {requestedPage === "history" && bookingInfo && <History bookings={bookingInfo? bookingInfo: []}/>}
        {requestedPage === "payment" && <Payments user={user}/>}
        {requestedPage === "security" && <ChangePassWords user={user}/>}
    </div>);
}

export default Profile;