import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Signup from "./signup/page";
import Login from "./login/page";


export default function Home() {
  return (
    <>
      <Navbar />
      {/* <Signup /> */}
      <Login />
      <Footer
        githubRepoUrl="https://github.com/theashu02/assignment-house-of-edtech"
        linkedinProfileUrl="https://www.linkedin.com/in/theashuchauhan/"
      />
    </>
  );
}
