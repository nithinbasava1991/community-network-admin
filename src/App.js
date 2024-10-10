import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Components/Login";
import SignUp from "./Components/SignUp";
import MainComponent from "./Components/MainComponent";
import Advertisement from "./Pages/Advertisement/Advertisement";
import Promo from "./Pages/Advertisement/Promo";
import Banner from "./Pages/Advertisement/Banner";
import SuccessStory from "./Pages/Advertisement/SuccessStory";
import Notification from "./Pages/Notifications/Notification";
import NoteNotification from "./Pages/Notifications/NoteNotification";
import Masters from "./Pages/Masters/Masters";
import Qualification from "./Pages/Masters/Qualification";
import Work from "./Pages/Masters/Work";
import Relationship from "./Pages/Masters/Relationship";
import Gotra from "./Pages/Masters/Gotra";
import ForgetPass from "./Components/ForgetPass";
import Event from "./Pages/Advertisement/Event";
import News from "./Pages/Advertisement/News";
import EventType from "./Pages/Masters/EventType";
import NewsType from "./Pages/Masters/NewsType";
import PromoType from "./Pages/Masters/PromoType";
import RequestType from "./Pages/Masters/RequestType";
import ProtectedRoute from "./Components/ProtectedRoute";
import Users from "./Pages/Users/Users";
import Staff from "./Pages/Users/Staff";
import Members from "./Pages/Users/Members";
import Request from "./Pages/Request/Request";
import RequestMain from "./Pages/Request/RequestMain";
import MemberShip from "./Pages/Membership/MemberShip";
import BulkUpload from "./Pages/Membership/BulkUpload";
import Reports from "./Pages/Reports/Reports";
import Payments from "./Pages/Payments/Payments";
import FamilyTree from "./Pages/Membership/FamilyTree";
import Individual from "./Pages/Membership/Individual";
import ViewFamiltree from "./Pages/Membership/ViewFamiltree";
import PersonalInfo from "./Pages/Membership/PersonalInfo";
import RootFamilyTree from "./Pages/Membership/RootFamilyTree";
import Family_tree from "./Pages/Membership/Family_tree";
import FatherFamilytree from "./Pages/Membership/FatherFamilytree";
import HusbandFamilyTree from "./Pages/Membership/Husbandfamilytree";
import Family from "./Pages/Membership/Family";
import Setting from "./Pages/setting/Settings";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgetpass" element={<ForgetPass />} />
          <Route
            path="/dashboard"
            element={<ProtectedRoute Component={MainComponent} />}
          />
          <Route
            path="/advertisement"
            element={<ProtectedRoute Component={Advertisement} />}
          />
          <Route
            path="/advertisement/promo"
            element={<ProtectedRoute Component={Promo} />}
          />
          <Route
            path="/advertisement/banner"
            element={<ProtectedRoute Component={Banner} />}
          />
          <Route
            path="/advertisement/success"
            element={<ProtectedRoute Component={SuccessStory} />}
          />
          <Route
            path="/advertisement/event"
            element={<ProtectedRoute Component={Event} />}
          />
          <Route
            path="/advertisement/news"
            element={<ProtectedRoute Component={News} />}
          />
          <Route
            path="/notification"
            element={<ProtectedRoute Component={Notification} />}
          />
          <Route
            path="/notification/note"
            element={<ProtectedRoute Component={NoteNotification} />}
          />
          <Route
            path="/masters"
            element={<ProtectedRoute Component={Masters} />}
          />
          <Route
            path="/masters/qualification"
            element={<ProtectedRoute Component={Qualification} />}
          />
          <Route
            path="/masters/work"
            element={<ProtectedRoute Component={Work} />}
          />
          <Route
            path="/masters/relationship"
            element={<ProtectedRoute Component={Relationship} />}
          />
          <Route
            path="/masters/gotra"
            element={<ProtectedRoute Component={Gotra} />}
          />
          <Route
            path="/masters/eventtype"
            element={<ProtectedRoute Component={EventType} />}
          />
          <Route
            path="/masters/newstype"
            element={<ProtectedRoute Component={NewsType} />}
          />
          <Route
            path="/masters/promotype"
            element={<ProtectedRoute Component={PromoType} />}
          />
          <Route
            path="/masters/requesttype"
            element={<ProtectedRoute Component={RequestType} />}
          />
          <Route path="/users" element={<ProtectedRoute Component={Users} />} />
          <Route
            path="/users/staff"
            element={<ProtectedRoute Component={Staff} />}
          />
          <Route
            path="/users/member"
            element={<ProtectedRoute Component={Members} />}
          />
          <Route
            path="/request"
            element={<ProtectedRoute Component={Request} />}
          />
          <Route
            path="/request/requestmain"
            element={<ProtectedRoute Component={RequestMain} />}
          />
          <Route
            path="/membership"
            element={<ProtectedRoute Component={MemberShip} />}
          />
          <Route
            path="/membership/bulkupload"
            element={<ProtectedRoute Component={BulkUpload} />}
          />
          <Route
            path="/membership/familytree"
            element={<ProtectedRoute Component={FamilyTree} />}
          />
          <Route
            path="/membership/individual"
            element={<ProtectedRoute Component={Individual} />}
          />
          <Route
            path="/membership/family"
            element={<ProtectedRoute Component={Family} />}
          />
          <Route
            path="/reports"
            element={<ProtectedRoute Component={Reports} />}
          />
          <Route
            path="/family_tree"
            element={<ProtectedRoute Component={Family_tree} />}
          />
          <Route
            path="/fatherfamilytree"
            element={<ProtectedRoute Component={FatherFamilytree} />}
          />
           <Route
            path="/husbandfamilytree"
            element={<ProtectedRoute Component={HusbandFamilyTree} />}
          />
          <Route
            path="/payments"
            element={<ProtectedRoute Component={Payments} />}
          />
          <Route
            path="/viewfamily"
            element={<ProtectedRoute Component={ViewFamiltree} />}
          />
          <Route
            path="/rootfamilytree"
            element={<ProtectedRoute Component={ RootFamilyTree} />}
          />
          <Route
            path="/personalinfo"
            element={<ProtectedRoute Component={PersonalInfo} />}
          />
          <Route
            path="/setting"
            element={<ProtectedRoute Component={Setting} />}
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
