import { Helmet } from "react-helmet";
import Auth from "../auth/Auth";
import Footer from "../components/general/Footer";
import Header1 from "../components/general/Header1";
import About from "../components/home/About";
import HeroSection from "../components/home/HeroSection";
import ShortMenu from "../components/home/ShortMenu";

export default function Home() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
  } else {
    console.log("Geolocation is not supported by this browser.");
  }

  function successCallback(position: GeolocationPosition) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
    // Proceed to reverse geocoding
  }

  function errorCallback(error: GeolocationPositionError) {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        console.error("User denied the request for Geolocation.");
        break;
      case error.POSITION_UNAVAILABLE:
        console.error("Location information is unavailable.");
        break;
      case error.TIMEOUT:
        console.error("The request to get user location timed out.");
        break;
      default:
        console.error("An unknown error occurred.");
        break;
    }
  }

  return (
    <div>
      <Helmet>
        <title>DE BLISS</title>
        <meta name="home" content="Welcome to De Bliss!" />
      </Helmet>
      <Auth />
      <Header1 />
      <HeroSection />
      <ShortMenu />
      <About />
      <Footer />
    </div>
  );
}
