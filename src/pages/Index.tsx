import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FormPage from "./FormPage";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user already exists and has permission to access spinner
    const currentUser = localStorage.getItem("currentUser");
    if (currentUser) {
      try {
        const user = JSON.parse(currentUser);
        // Allow returning users to go back to spinner if they have a session
        const lastSpin = localStorage.getItem(`lastSpin_${user.mobile}`);
        const today = new Date().toDateString();
        
        // Only auto-redirect if they haven't spun today
        if (lastSpin !== today) {
          console.log("User session found, but can spin again today");
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem("currentUser");
      }
    }
  }, [navigate]);

  // Render FormPage as the main index
  return <FormPage />;
};

export default Index;
