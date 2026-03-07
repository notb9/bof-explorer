import "./Banner.css";

export function Banner() {
  // Font is Ogre
  const banner = `
 _            __  __  __      _                     
| |__   ___  / _\\ \\ \\/ /_ __ | | ___  _ __ ___ _ __ 
| '_ \\ / _ \\| |_   \\  /| '_ \\| |/ _ \\| '__/ _ \\ '__|
| |_) | (_) |  _|  /  \\| |_) | | (_) | | |  __/ |   
|_.__/ \\___/| |   /_/\\_\\ .__/|_|\\___/|_|  \\___|_|   
            |_|        |_|                          

              -  F I N D   Y O U R   B O F  -              `;
  return <p className="banner-ascii-art fw-bold">{banner}</p>;
}
