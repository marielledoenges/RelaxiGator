import Navbar from "./Navbar"
import gatorlogo from './placeholder_gator_logo.png';
export default function Dashboard() {
  return (
    <div className="p-20 h-screen flex items-center justify-center flex-col">
        <Navbar/>   
        <div class="main-homepage-content" className="flex flex-row items-center justify-center ">
            <div class="left-home">
                <h3>Welcome <i>username</i> !</h3>
                <img src={gatorlogo}alt="relaxigator logo" />
            </div>

            <div class="right-home">
                <a href="journallink">Write in Journal</a>
                <div class="log-cluster">
                    <a href="moodlink">log mood</a>
                    <a href="mentalstatelink">log mental state</a>
                    <a href="productivitylink">log productivity</a>
                    <a href="nutritionlink">log nutrition</a>
                </div>
                <a href="viewentrylink">View today's entry</a>
            </div>
        </div>
    </div>
    //links are placeholders, don't feel like re-learning button flow conventions atm so just wireframing
  );
}
